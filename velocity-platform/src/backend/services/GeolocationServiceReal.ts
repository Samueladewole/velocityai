/**
 * Real Geolocation Service
 * Integration with MaxMind GeoIP2 and AbuseIPDB for threat intelligence
 */

import axios from 'axios';
import { Pool } from 'pg';
import Redis from 'ioredis';

export interface GeolocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp?: string;
  organization?: string;
  asn?: string;
  accuracy?: number;
  lastUpdated: Date;
}

export interface ThreatIntelligence {
  ip: string;
  isVpn: boolean;
  isProxy: boolean;
  isTor: boolean;
  isHosting: boolean;
  isMalicious: boolean;
  riskScore: number;
  abuseConfidence: number;
  threatCategories: string[];
  lastSeen?: Date;
  reportCount?: number;
  whitelisted: boolean;
  source: string[];
  lastChecked: Date;
}

export interface LocationAnalysis {
  geolocation: GeolocationData;
  threatIntel: ThreatIntelligence;
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high' | 'critical';
    riskFactors: string[];
    riskScore: number;
    trustAdjustment: number;
    recommendations: string[];
  };
  velocityCheck: {
    impossibleTravel: boolean;
    suspiciousDistance?: number;
    timeWindow?: number;
    previousLocation?: GeolocationData;
  };
}

export class GeolocationServiceReal {
  private db: Pool;
  private redis: Redis;
  private readonly maxmindLicenseKey: string;
  private readonly abuseipdbApiKey: string;
  private readonly CACHE_DURATION = 24 * 60 * 60; // 24 hours
  private readonly HIGH_RISK_COUNTRIES = ['CN', 'RU', 'IR', 'KP', 'SY'];
  private readonly VPN_RISK_MULTIPLIER = 1.5;
  private readonly IMPOSSIBLE_TRAVEL_SPEED = 1000; // km/h

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    });

    this.maxmindLicenseKey = process.env.MAXMIND_LICENSE_KEY || '';
    this.abuseipdbApiKey = process.env.ABUSEIPDB_API_KEY || '';

    if (!this.maxmindLicenseKey) {
      console.warn('MaxMind license key not configured - using fallback geolocation');
    }

    if (!this.abuseipdbApiKey) {
      console.warn('AbuseIPDB API key not configured - threat intelligence limited');
    }
  }

  /**
   * Analyze IP location and threat intelligence
   */
  async analyzeLocation(
    ip: string, 
    userId?: string, 
    context?: { userAgent?: string; sessionId?: string }
  ): Promise<LocationAnalysis> {
    try {
      // Get geolocation data
      const geolocation = await this.getGeolocation(ip);
      
      // Get threat intelligence
      const threatIntel = await this.getThreatIntelligence(ip);
      
      // Perform velocity check if user provided
      let velocityCheck = {
        impossibleTravel: false,
        suspiciousDistance: undefined,
        timeWindow: undefined,
        previousLocation: undefined
      };
      
      if (userId) {
        velocityCheck = await this.performVelocityCheck(userId, geolocation);
      }
      
      // Calculate risk assessment
      const riskAssessment = this.calculateRiskAssessment(
        geolocation, 
        threatIntel, 
        velocityCheck
      );

      const analysis: LocationAnalysis = {
        geolocation,
        threatIntel,
        riskAssessment,
        velocityCheck
      };

      // Store analysis results
      await this.storeAnalysis(ip, userId, analysis, context);

      return analysis;

    } catch (error) {
      console.error('Failed to analyze location:', error);
      
      // Return safe defaults on error
      return {
        geolocation: await this.getFallbackGeolocation(ip),
        threatIntel: {
          ip,
          isVpn: false,
          isProxy: false,
          isTor: false,
          isHosting: false,
          isMalicious: false,
          riskScore: 0.5,
          abuseConfidence: 0,
          threatCategories: [],
          whitelisted: false,
          source: ['fallback'],
          lastChecked: new Date()
        },
        riskAssessment: {
          overallRisk: 'medium',
          riskFactors: ['geolocation_service_error'],
          riskScore: 0.5,
          trustAdjustment: 0,
          recommendations: ['Monitor closely due to service error']
        },
        velocityCheck: {
          impossibleTravel: false
        }
      };
    }
  }

  /**
   * Get geolocation data for IP
   */
  async getGeolocation(ip: string): Promise<GeolocationData> {
    try {
      // Check cache first
      const cached = await this.redis.get(`geo:${ip}`);
      if (cached) {
        return JSON.parse(cached);
      }

      let geolocation: GeolocationData;

      if (this.maxmindLicenseKey) {
        geolocation = await this.getMaxMindGeolocation(ip);
      } else {
        geolocation = await this.getFallbackGeolocation(ip);
      }

      // Cache result
      await this.redis.setex(`geo:${ip}`, this.CACHE_DURATION, JSON.stringify(geolocation));

      return geolocation;

    } catch (error) {
      console.error('Failed to get geolocation:', error);
      return this.getFallbackGeolocation(ip);
    }
  }

  /**
   * Get threat intelligence for IP
   */
  async getThreatIntelligence(ip: string): Promise<ThreatIntelligence> {
    try {
      // Check cache first
      const cached = await this.redis.get(`threat:${ip}`);
      if (cached) {
        return JSON.parse(cached);
      }

      let threatIntel: ThreatIntelligence = {
        ip,
        isVpn: false,
        isProxy: false,
        isTor: false,
        isHosting: false,
        isMalicious: false,
        riskScore: 0.1,
        abuseConfidence: 0,
        threatCategories: [],
        whitelisted: false,
        source: [],
        lastChecked: new Date()
      };

      // Get AbuseIPDB data
      if (this.abuseipdbApiKey) {
        const abuseData = await this.getAbuseIPDBData(ip);
        threatIntel = { ...threatIntel, ...abuseData };
      }

      // Check VPN/Proxy detection services
      const vpnCheck = await this.checkVPNProxy(ip);
      threatIntel = { ...threatIntel, ...vpnCheck };

      // Calculate overall risk score
      threatIntel.riskScore = this.calculateThreatRiskScore(threatIntel);

      // Cache result (shorter duration for threat data)
      await this.redis.setex(`threat:${ip}`, 3600, JSON.stringify(threatIntel)); // 1 hour

      return threatIntel;

    } catch (error) {
      console.error('Failed to get threat intelligence:', error);
      return {
        ip,
        isVpn: false,
        isProxy: false,
        isTor: false,
        isHosting: false,
        isMalicious: false,
        riskScore: 0.3, // Default to medium risk on error
        abuseConfidence: 0,
        threatCategories: [],
        whitelisted: false,
        source: ['error'],
        lastChecked: new Date()
      };
    }
  }

  /**
   * Perform velocity check for impossible travel
   */
  async performVelocityCheck(
    userId: string, 
    currentLocation: GeolocationData
  ): Promise<{
    impossibleTravel: boolean;
    suspiciousDistance?: number;
    timeWindow?: number;
    previousLocation?: GeolocationData;
  }> {
    try {
      // Get user's recent locations
      const recentResult = await this.db.query(
        `SELECT geolocation_data, created_at 
         FROM ip_analyses 
         WHERE user_id = $1 AND created_at > NOW() - INTERVAL '4 hours'
         ORDER BY created_at DESC 
         LIMIT 1`,
        [userId]
      );

      if (recentResult.rows.length === 0) {
        return { impossibleTravel: false };
      }

      const previousEntry = recentResult.rows[0];
      const previousLocation = JSON.parse(previousEntry.geolocation_data);
      const previousTime = new Date(previousEntry.created_at);
      const currentTime = new Date();
      const timeWindow = (currentTime.getTime() - previousTime.getTime()) / 1000 / 3600; // hours

      // Calculate distance
      const distance = this.calculateDistance(
        previousLocation.latitude,
        previousLocation.longitude,
        currentLocation.latitude,
        currentLocation.longitude
      );

      // Check if travel is physically impossible
      const maxPossibleSpeed = this.IMPOSSIBLE_TRAVEL_SPEED; // km/h
      const impossibleTravel = distance > (maxPossibleSpeed * timeWindow);

      return {
        impossibleTravel,
        suspiciousDistance: impossibleTravel ? distance : undefined,
        timeWindow: impossibleTravel ? timeWindow : undefined,
        previousLocation: impossibleTravel ? previousLocation : undefined
      };

    } catch (error) {
      console.error('Failed to perform velocity check:', error);
      return { impossibleTravel: false };
    }
  }

  // Private methods

  private async getMaxMindGeolocation(ip: string): Promise<GeolocationData> {
    try {
      // MaxMind GeoIP2 API call
      const response = await axios.get(
        `https://geoip.maxmind.com/geoip/v2.1/city/${ip}`,
        {
          auth: {
            username: this.maxmindLicenseKey,
            password: ''
          },
          timeout: 5000
        }
      );

      const data = response.data;
      
      return {
        ip,
        country: data.country?.names?.en || 'Unknown',
        countryCode: data.country?.iso_code || 'XX',
        region: data.subdivisions?.[0]?.names?.en || 'Unknown',
        regionCode: data.subdivisions?.[0]?.iso_code || 'XX',
        city: data.city?.names?.en || 'Unknown',
        zipCode: data.postal?.code,
        latitude: data.location?.latitude || 0,
        longitude: data.location?.longitude || 0,
        timezone: data.location?.time_zone || 'UTC',
        isp: data.traits?.isp,
        organization: data.traits?.organization,
        asn: data.traits?.autonomous_system_number?.toString(),
        accuracy: data.location?.accuracy_radius,
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('MaxMind API error:', error);
      throw error;
    }
  }

  private async getFallbackGeolocation(ip: string): Promise<GeolocationData> {
    try {
      // Use free IP geolocation service as fallback
      const response = await axios.get(`http://ip-api.com/json/${ip}`, {
        timeout: 5000
      });

      const data = response.data;
      
      if (data.status !== 'success') {
        throw new Error(`IP-API error: ${data.message}`);
      }

      return {
        ip,
        country: data.country || 'Unknown',
        countryCode: data.countryCode || 'XX',
        region: data.regionName || 'Unknown', 
        regionCode: data.region || 'XX',
        city: data.city || 'Unknown',
        zipCode: data.zip,
        latitude: data.lat || 0,
        longitude: data.lon || 0,
        timezone: data.timezone || 'UTC',
        isp: data.isp,
        organization: data.org,
        asn: data.as,
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('Fallback geolocation error:', error);
      
      // Return minimal data for unknown IP
      return {
        ip,
        country: 'Unknown',
        countryCode: 'XX',
        region: 'Unknown',
        regionCode: 'XX', 
        city: 'Unknown',
        latitude: 0,
        longitude: 0,
        timezone: 'UTC',
        lastUpdated: new Date()
      };
    }
  }

  private async getAbuseIPDBData(ip: string): Promise<Partial<ThreatIntelligence>> {
    try {
      const response = await axios.get(`https://api.abuseipdb.com/api/v2/check`, {
        params: {
          ipAddress: ip,
          maxAgeInDays: 90,
          verbose: true
        },
        headers: {
          'Key': this.abuseipdbApiKey,
          'Accept': 'application/json'
        },
        timeout: 5000
      });

      const data = response.data.data;

      return {
        isMalicious: data.abuseConfidencePercentage > 25,
        abuseConfidence: data.abuseConfidencePercentage,
        threatCategories: data.usageType ? [data.usageType] : [],
        reportCount: data.totalReports,
        lastSeen: data.lastReportedAt ? new Date(data.lastReportedAt) : undefined,
        whitelisted: data.isWhitelisted,
        source: ['abuseipdb']
      };

    } catch (error) {
      console.error('AbuseIPDB API error:', error);
      return {
        source: ['abuseipdb_error']
      };
    }
  }

  private async checkVPNProxy(ip: string): Promise<Partial<ThreatIntelligence>> {
    try {
      // Use ProxyCheck.io for VPN/Proxy detection (free tier available)
      const response = await axios.get(`http://proxycheck.io/v2/${ip}`, {
        params: {
          vpn: 1,
          asn: 1,
          risk: 1,
          port: 1
        },
        timeout: 5000
      });

      const data = response.data[ip];
      
      if (!data) {
        return { source: ['proxycheck'] };
      }

      return {
        isVpn: data.proxy === 'yes' && data.type === 'VPN',
        isProxy: data.proxy === 'yes' && data.type === 'Proxy',
        isHosting: data.type === 'Hosting',
        riskScore: data.risk ? data.risk / 100 : 0.1,
        source: ['proxycheck']
      };

    } catch (error) {
      console.error('VPN/Proxy check error:', error);
      return {
        source: ['vpncheck_error']
      };
    }
  }

  private calculateThreatRiskScore(threat: ThreatIntelligence): number {
    let score = 0.1; // Base score

    if (threat.isMalicious) score += 0.4;
    if (threat.isVpn) score += 0.2;
    if (threat.isProxy) score += 0.2;
    if (threat.isTor) score += 0.3;
    if (threat.abuseConfidence > 50) score += 0.3;
    if (threat.abuseConfidence > 75) score += 0.2;

    return Math.min(1, score);
  }

  private calculateRiskAssessment(
    geo: GeolocationData,
    threat: ThreatIntelligence,
    velocity: any
  ): LocationAnalysis['riskAssessment'] {
    let riskScore = 0.1;
    const riskFactors: string[] = [];
    const recommendations: string[] = [];

    // Geographic risk
    if (this.HIGH_RISK_COUNTRIES.includes(geo.countryCode)) {
      riskScore += 0.3;
      riskFactors.push('high_risk_country');
      recommendations.push('Require additional verification for high-risk countries');
    }

    // Threat intelligence risk
    if (threat.isMalicious) {
      riskScore += 0.4;
      riskFactors.push('malicious_ip');
      recommendations.push('Block or heavily restrict malicious IPs');
    }

    if (threat.isVpn || threat.isProxy) {
      riskScore += 0.2;
      riskFactors.push(threat.isVpn ? 'vpn_detected' : 'proxy_detected');
      recommendations.push('Monitor VPN/Proxy usage closely');
    }

    if (threat.isTor) {
      riskScore += 0.3;
      riskFactors.push('tor_network');
      recommendations.push('Consider blocking Tor traffic');
    }

    // Velocity risk
    if (velocity.impossibleTravel) {
      riskScore += 0.5;
      riskFactors.push('impossible_travel');
      recommendations.push('Investigate impossible travel patterns');
    }

    // Normalize risk score
    riskScore = Math.min(1, riskScore);

    // Determine overall risk level
    let overallRisk: 'low' | 'medium' | 'high' | 'critical';
    if (riskScore >= 0.8) overallRisk = 'critical';
    else if (riskScore >= 0.6) overallRisk = 'high';
    else if (riskScore >= 0.3) overallRisk = 'medium';
    else overallRisk = 'low';

    // Calculate trust adjustment
    let trustAdjustment = 0;
    if (overallRisk === 'critical') trustAdjustment = -0.3;
    else if (overallRisk === 'high') trustAdjustment = -0.2;
    else if (overallRisk === 'medium') trustAdjustment = -0.1;

    return {
      overallRisk,
      riskFactors,
      riskScore,
      trustAdjustment,
      recommendations
    };
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private async storeAnalysis(
    ip: string,
    userId: string | undefined,
    analysis: LocationAnalysis,
    context: any
  ): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO ip_analyses 
         (ip_address, user_id, geolocation_data, threat_intelligence, 
          risk_assessment, velocity_check, context, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          ip,
          userId,
          JSON.stringify(analysis.geolocation),
          JSON.stringify(analysis.threatIntel),
          JSON.stringify(analysis.riskAssessment),
          JSON.stringify(analysis.velocityCheck),
          JSON.stringify(context || {})
        ]
      );
    } catch (error) {
      console.error('Failed to store IP analysis:', error);
    }
  }
}