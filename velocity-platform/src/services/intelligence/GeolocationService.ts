/**
 * Geolocation and IP Intelligence Service
 * Provides location-based risk assessment and threat intelligence
 */

export interface LocationData {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  organization: string;
  asn: string;
  accuracy: number;
  vpnDetected: boolean;
  proxyDetected: boolean;
  torDetected: boolean;
  hostingProvider: boolean;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatReasons: string[];
  lastUpdated: Date;
}

export interface LocationRisk {
  riskScore: number; // 0-1
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    isVPN: boolean;
    isProxy: boolean;
    isTor: boolean;
    isKnownThreat: boolean;
    isHighRiskCountry: boolean;
    isDataCenter: boolean;
    hasReputationIssues: boolean;
  };
  recommendations: string[];
  trustModifier: number; // -1 to 1, affects overall trust score
}

export interface ThreatIntelligence {
  ip: string;
  threatType: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  firstSeen: Date;
  lastSeen: Date;
  reportCount: number;
  sources: string[];
  description: string;
  mitigation: string[];
}

export class GeolocationService {
  private readonly maxmindApiKey: string;
  private readonly abuseipdbApiKey: string;
  private readonly virustotalApiKey: string;
  private readonly cache = new Map<string, { data: LocationData; expires: number }>();
  private readonly threatCache = new Map<string, { data: ThreatIntelligence[]; expires: number }>();

  // High-risk countries for additional verification
  private readonly HIGH_RISK_COUNTRIES = [
    'CN', 'RU', 'IR', 'KP', 'SY', 'AF', 'IQ', 'LY', 'SO', 'YE'
  ];

  // Known VPN/proxy ASNs and ISPs
  private readonly VPN_PROVIDERS = [
    'ExpressVPN', 'NordVPN', 'Surfshark', 'Private Internet Access',
    'ProtonVPN', 'CyberGhost', 'Windscribe', 'TunnelBear'
  ];

  constructor(
    maxmindApiKey?: string,
    abuseipdbApiKey?: string,
    virustotalApiKey?: string
  ) {
    this.maxmindApiKey = maxmindApiKey || process.env.MAXMIND_API_KEY || '';
    this.abuseipdbApiKey = abuseipdbApiKey || process.env.ABUSEIPDB_API_KEY || '';
    this.virustotalApiKey = virustotalApiKey || process.env.VIRUSTOTAL_API_KEY || '';
  }

  /**
   * Get comprehensive location data for an IP address
   */
  async getLocationData(ip: string): Promise<LocationData> {
    try {
      // Check cache first
      const cached = this.cache.get(ip);
      if (cached && cached.expires > Date.now()) {
        return cached.data;
      }

      // Skip analysis for private IPs
      if (this.isPrivateIP(ip)) {
        return this.createLocalLocationData(ip);
      }

      // Gather location data from multiple sources
      const [geoData, threatData] = await Promise.all([
        this.fetchGeolocationData(ip),
        this.getThreatIntelligence(ip)
      ]);

      // Combine and analyze data
      const locationData = this.processLocationData(ip, geoData, threatData);

      // Cache result for 1 hour
      this.cache.set(ip, {
        data: locationData,
        expires: Date.now() + 60 * 60 * 1000
      });

      return locationData;

    } catch (error) {
      console.error('Failed to get location data:', error);
      return this.createFallbackLocationData(ip);
    }
  }

  /**
   * Assess location-based risk
   */
  async assessLocationRisk(ip: string, userLocationHistory?: any[]): Promise<LocationRisk> {
    try {
      const locationData = await this.getLocationData(ip);
      const threatIntel = await this.getThreatIntelligence(ip);

      // Calculate risk factors
      const factors = {
        isVPN: locationData.vpnDetected,
        isProxy: locationData.proxyDetected,
        isTor: locationData.torDetected,
        isKnownThreat: threatIntel.length > 0 && threatIntel.some(t => t.severity === 'high' || t.severity === 'critical'),
        isHighRiskCountry: this.HIGH_RISK_COUNTRIES.includes(locationData.countryCode),
        isDataCenter: locationData.hostingProvider,
        hasReputationIssues: threatIntel.length > 0
      };

      // Calculate base risk score
      let riskScore = 0.1; // Base risk

      if (factors.isKnownThreat) riskScore += 0.4;
      if (factors.isTor) riskScore += 0.3;
      if (factors.isVPN || factors.isProxy) riskScore += 0.2;
      if (factors.isHighRiskCountry) riskScore += 0.15;
      if (factors.isDataCenter) riskScore += 0.1;
      if (factors.hasReputationIssues) riskScore += 0.1;

      // Adjust based on user's location history
      if (userLocationHistory) {
        const historyAdjustment = this.calculateLocationHistoryAdjustment(
          locationData, 
          userLocationHistory
        );
        riskScore *= historyAdjustment;
      }

      riskScore = Math.min(1.0, riskScore);

      // Determine risk level
      const riskLevel = this.determineRiskLevel(riskScore);

      // Generate recommendations
      const recommendations = this.generateLocationRecommendations(factors, riskLevel);

      // Calculate trust modifier
      const trustModifier = this.calculateTrustModifier(riskScore, factors);

      return {
        riskScore,
        riskLevel,
        factors,
        recommendations,
        trustModifier
      };

    } catch (error) {
      console.error('Failed to assess location risk:', error);
      return {
        riskScore: 0.5,
        riskLevel: 'medium',
        factors: {
          isVPN: false,
          isProxy: false,
          isTor: false,
          isKnownThreat: false,
          isHighRiskCountry: false,
          isDataCenter: false,
          hasReputationIssues: false
        },
        recommendations: ['Unable to assess location risk - manual review recommended'],
        trustModifier: -0.1
      };
    }
  }

  /**
   * Get threat intelligence for an IP address
   */
  async getThreatIntelligence(ip: string): Promise<ThreatIntelligence[]> {
    try {
      // Check cache first
      const cached = this.threatCache.get(ip);
      if (cached && cached.expires > Date.now()) {
        return cached.data;
      }

      const threats: ThreatIntelligence[] = [];

      // Query multiple threat intelligence sources
      const [abuseIPData, virusTotalData] = await Promise.all([
        this.queryAbuseIPDB(ip),
        this.queryVirusTotal(ip)
      ]);

      // Process AbuseIPDB data
      if (abuseIPData && abuseIPData.abuseConfidencePercentage > 25) {
        threats.push({
          ip,
          threatType: ['abuse', 'spam'],
          severity: abuseIPData.abuseConfidencePercentage > 75 ? 'high' : 'medium',
          firstSeen: new Date(),
          lastSeen: new Date(),
          reportCount: abuseIPData.totalReports,
          sources: ['AbuseIPDB'],
          description: `IP reported for abuse with ${abuseIPData.abuseConfidencePercentage}% confidence`,
          mitigation: ['Block IP', 'Require additional authentication']
        });
      }

      // Process VirusTotal data
      if (virusTotalData && virusTotalData.malicious > 0) {
        threats.push({
          ip,
          threatType: ['malware', 'botnet'],
          severity: virusTotalData.malicious > 5 ? 'critical' : 'high',
          firstSeen: new Date(),
          lastSeen: new Date(),
          reportCount: virusTotalData.malicious,
          sources: ['VirusTotal'],
          description: `IP flagged by ${virusTotalData.malicious} security vendors`,
          mitigation: ['Block IP immediately', 'Alert security team']
        });
      }

      // Cache results for 30 minutes
      this.threatCache.set(ip, {
        data: threats,
        expires: Date.now() + 30 * 60 * 1000
      });

      return threats;

    } catch (error) {
      console.error('Failed to get threat intelligence:', error);
      return [];
    }
  }

  /**
   * Check if user is accessing from a new location
   */
  async detectLocationAnomaly(
    ip: string, 
    userLocationHistory: any[]
  ): Promise<{
    isAnomalous: boolean;
    confidence: number;
    details: string;
    previousLocations: any[];
  }> {
    try {
      const currentLocation = await this.getLocationData(ip);
      
      if (userLocationHistory.length === 0) {
        return {
          isAnomalous: false,
          confidence: 0.5,
          details: 'No location history available',
          previousLocations: []
        };
      }

      // Calculate distance from known locations
      const distances = userLocationHistory.map(loc => 
        this.calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          loc.latitude,
          loc.longitude
        )
      );

      const minDistance = Math.min(...distances);
      const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;

      // Determine if this is anomalous
      const isAnomalous = minDistance > 1000; // More than 1000km from any known location
      const confidence = Math.min(0.95, minDistance / 5000); // Higher confidence for more distant locations

      let details = '';
      if (isAnomalous) {
        details = `Access from ${currentLocation.city}, ${currentLocation.country} is ${Math.round(minDistance)}km from nearest known location`;
      } else {
        details = `Access from known or nearby location (${Math.round(minDistance)}km away)`;
      }

      return {
        isAnomalous,
        confidence,
        details,
        previousLocations: userLocationHistory.slice(-5) // Last 5 locations
      };

    } catch (error) {
      console.error('Failed to detect location anomaly:', error);
      return {
        isAnomalous: false,
        confidence: 0.1,
        details: 'Unable to assess location anomaly',
        previousLocations: []
      };
    }
  }

  // Private helper methods

  private async fetchGeolocationData(ip: string): Promise<any> {
    try {
      // In real implementation, would call MaxMind GeoIP2 API
      // For demo, return mock data
      return {
        country: 'United States',
        country_code: 'US',
        region: 'California',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: 'America/Los_Angeles',
        isp: 'Example ISP',
        organization: 'Example Corp',
        asn: 'AS12345'
      };
    } catch (error) {
      throw new Error(`Geolocation lookup failed: ${error.message}`);
    }
  }

  private async queryAbuseIPDB(ip: string): Promise<any> {
    try {
      if (!this.abuseipdbApiKey) {
        return null;
      }

      // In real implementation, would call AbuseIPDB API
      // For demo, return mock data
      return {
        abuseConfidencePercentage: Math.random() * 100,
        totalReports: Math.floor(Math.random() * 50)
      };
    } catch (error) {
      console.error('AbuseIPDB query failed:', error);
      return null;
    }
  }

  private async queryVirusTotal(ip: string): Promise<any> {
    try {
      if (!this.virustotalApiKey) {
        return null;
      }

      // In real implementation, would call VirusTotal API
      // For demo, return mock data
      return {
        malicious: Math.floor(Math.random() * 10),
        suspicious: Math.floor(Math.random() * 5)
      };
    } catch (error) {
      console.error('VirusTotal query failed:', error);
      return null;
    }
  }

  private processLocationData(ip: string, geoData: any, threatData: ThreatIntelligence[]): LocationData {
    // Detect VPN/Proxy/Tor
    const vpnDetected = this.detectVPN(geoData);
    const proxyDetected = this.detectProxy(geoData);
    const torDetected = this.detectTor(geoData);
    const hostingProvider = this.detectHostingProvider(geoData);

    // Determine threat level
    const threatLevel = this.calculateThreatLevel(threatData, {
      vpnDetected,
      proxyDetected,
      torDetected,
      hostingProvider
    });

    return {
      ip,
      country: geoData.country || 'Unknown',
      countryCode: geoData.country_code || 'XX',
      region: geoData.region || 'Unknown',
      city: geoData.city || 'Unknown',
      latitude: geoData.latitude || 0,
      longitude: geoData.longitude || 0,
      timezone: geoData.timezone || 'UTC',
      isp: geoData.isp || 'Unknown',
      organization: geoData.organization || 'Unknown',
      asn: geoData.asn || 'Unknown',
      accuracy: 80, // Mock accuracy
      vpnDetected,
      proxyDetected,
      torDetected,
      hostingProvider,
      threatLevel,
      threatReasons: threatData.map(t => t.description),
      lastUpdated: new Date()
    };
  }

  private detectVPN(geoData: any): boolean {
    const org = (geoData.organization || '').toLowerCase();
    const isp = (geoData.isp || '').toLowerCase();
    
    return this.VPN_PROVIDERS.some(provider => 
      org.includes(provider.toLowerCase()) || isp.includes(provider.toLowerCase())
    ) || org.includes('vpn') || isp.includes('vpn');
  }

  private detectProxy(geoData: any): boolean {
    const org = (geoData.organization || '').toLowerCase();
    return org.includes('proxy') || org.includes('cdn');
  }

  private detectTor(geoData: any): boolean {
    // In real implementation, would check against Tor exit node list
    const org = (geoData.organization || '').toLowerCase();
    return org.includes('tor') || org.includes('onion');
  }

  private detectHostingProvider(geoData: any): boolean {
    const org = (geoData.organization || '').toLowerCase();
    const hostingTerms = ['hosting', 'cloud', 'server', 'datacenter', 'digital ocean', 'aws', 'azure', 'google cloud'];
    return hostingTerms.some(term => org.includes(term));
  }

  private calculateThreatLevel(
    threats: ThreatIntelligence[], 
    indicators: any
  ): 'low' | 'medium' | 'high' | 'critical' {
    if (threats.some(t => t.severity === 'critical')) return 'critical';
    if (threats.some(t => t.severity === 'high') || indicators.torDetected) return 'high';
    if (threats.length > 0 || indicators.vpnDetected || indicators.proxyDetected) return 'medium';
    return 'low';
  }

  private calculateLocationHistoryAdjustment(current: LocationData, history: any[]): number {
    // Reduce risk if location is in user's known locations
    const knownCountries = new Set(history.map(h => h.countryCode));
    if (knownCountries.has(current.countryCode)) {
      return 0.7; // 30% risk reduction
    }
    return 1.0; // No adjustment
  }

  private determineRiskLevel(riskScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (riskScore >= 0.8) return 'critical';
    if (riskScore >= 0.6) return 'high';
    if (riskScore >= 0.4) return 'medium';
    return 'low';
  }

  private generateLocationRecommendations(factors: any, riskLevel: string): string[] {
    const recommendations = [];

    if (factors.isKnownThreat) {
      recommendations.push('Block IP - known threat source');
    }
    if (factors.isTor) {
      recommendations.push('Require strong authentication - Tor access detected');
    }
    if (factors.isVPN && riskLevel !== 'low') {
      recommendations.push('Additional verification recommended - VPN detected');
    }
    if (factors.isHighRiskCountry) {
      recommendations.push('Enhanced monitoring - access from high-risk country');
    }
    if (riskLevel === 'low') {
      recommendations.push('Standard security posture appropriate');
    }

    return recommendations;
  }

  private calculateTrustModifier(riskScore: number, factors: any): number {
    let modifier = 0;

    if (factors.isKnownThreat) modifier -= 0.4;
    if (factors.isTor) modifier -= 0.3;
    if (factors.isVPN) modifier -= 0.1;
    if (factors.isHighRiskCountry) modifier -= 0.1;
    if (riskScore < 0.3) modifier += 0.1; // Bonus for low-risk locations

    return Math.max(-0.5, Math.min(0.2, modifier));
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private isPrivateIP(ip: string): boolean {
    // Check for private IP ranges
    const privateRanges = [
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^192\.168\./,
      /^127\./,
      /^::1$/,
      /^localhost$/
    ];
    
    return privateRanges.some(range => range.test(ip));
  }

  private createLocalLocationData(ip: string): LocationData {
    return {
      ip,
      country: 'Local Network',
      countryCode: 'XX',
      region: 'Private',
      city: 'Local',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
      isp: 'Private Network',
      organization: 'Private Network',
      asn: 'Private',
      accuracy: 100,
      vpnDetected: false,
      proxyDetected: false,
      torDetected: false,
      hostingProvider: false,
      threatLevel: 'low',
      threatReasons: [],
      lastUpdated: new Date()
    };
  }

  private createFallbackLocationData(ip: string): LocationData {
    return {
      ip,
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      city: 'Unknown',
      latitude: 0,
      longitude: 0,
      timezone: 'UTC',
      isp: 'Unknown',
      organization: 'Unknown',
      asn: 'Unknown',
      accuracy: 0,
      vpnDetected: false,
      proxyDetected: false,
      torDetected: false,
      hostingProvider: false,
      threatLevel: 'medium', // Conservative fallback
      threatReasons: ['Unable to assess threat level'],
      lastUpdated: new Date()
    };
  }
}

export const geolocationService = new GeolocationService();