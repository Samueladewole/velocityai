/**
 * Real-Time Behavior Tracking Service
 * Captures user behavior patterns for Zero Trust analysis
 */

export interface TypingPattern {
  keyCode: string;
  keyDownTime: number;
  keyUpTime: number;
  timeBetweenKeys: number;
  pressure?: number; // For supported devices
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
  eventType: 'move' | 'click' | 'scroll';
  button?: number;
  scrollDelta?: number;
}

export interface NavigationEvent {
  url: string;
  timestamp: number;
  eventType: 'page_load' | 'navigation' | 'action';
  action?: string;
  elementType?: string;
  timeOnPage?: number;
}

export interface BehaviorSession {
  sessionId: string;
  userId: string;
  deviceId: string;
  startTime: number;
  endTime?: number;
  typingPatterns: TypingPattern[];
  mouseMovements: MouseMovement[];
  navigationEvents: NavigationEvent[];
  focusEvents: { timestamp: number; hasFocus: boolean }[];
  scrollBehavior: { timestamp: number; scrollY: number; velocity: number }[];
}

export interface BehaviorMetrics {
  // Typing characteristics
  averageTypingSpeed: number; // WPM
  keystrokeDynamics: {
    avgKeyPressDuration: number;
    avgTimeBetweenKeys: number;
    typingRhythm: number; // Consistency score
    pausePatterns: number[]; // Common pause durations
  };
  
  // Mouse/pointer behavior
  mouseCharacteristics: {
    averageSpeed: number;
    clickPrecision: number; // How accurate clicks are
    movementSmoothness: number; // How smooth movements are
    scrollBehavior: {
      averageScrollSpeed: number;
      scrollDirection: 'normal' | 'inverted';
      wheelSensitivity: number;
    };
  };
  
  // Navigation patterns
  navigationBehavior: {
    averageTimeOnPage: number;
    commonActionSequences: string[];
    navigationSpeed: number; // How quickly user navigates
    backButtonUsage: number; // Frequency of back button use
  };
  
  // Attention patterns
  focusBehavior: {
    averageFocusSessionLength: number;
    tabSwitchingFrequency: number;
    idleTimeThreshold: number;
  };
  
  // Session characteristics
  sessionPatterns: {
    averageSessionLength: number;
    activityLevel: 'low' | 'medium' | 'high';
    multitaskingIndicators: number;
  };
}

export class BehaviorTracker {
  private currentSession: BehaviorSession | null = null;
  private trackingEnabled = false;
  private lastKeyTime = 0;
  private lastMousePosition = { x: 0, y: 0 };
  private lastScrollPosition = 0;
  private pageLoadTime = 0;
  private eventBuffer: any[] = [];
  private flushInterval: number | null = null;

  // Privacy settings
  private readonly PRIVACY_CONFIG = {
    trackKeyContent: false, // Never track actual key content
    trackMousePrecision: true,
    trackScrollBehavior: true,
    trackNavigationTiming: true,
    maxDataRetention: 7 * 24 * 60 * 60 * 1000, // 7 days
    minSessionLength: 30000, // 30 seconds minimum
  };

  // Behavior tracking thresholds
  private readonly TRACKING_CONFIG = {
    mouseSampleRate: 100, // Sample every 100ms
    typingSampleMinimum: 5, // Need at least 5 keystrokes
    scrollSampleRate: 50, // Sample every 50ms
    bufferFlushInterval: 5000, // Flush every 5 seconds
    maxBufferSize: 1000, // Max events in buffer
  };

  /**
   * Initialize behavior tracking for a user session
   */
  async initializeTracking(userId: string, deviceId: string): Promise<void> {
    if (this.trackingEnabled) {
      await this.stopTracking();
    }

    this.currentSession = {
      sessionId: this.generateSessionId(),
      userId,
      deviceId,
      startTime: Date.now(),
      typingPatterns: [],
      mouseMovements: [],
      navigationEvents: [],
      focusEvents: [],
      scrollBehavior: []
    };

    this.trackingEnabled = true;
    this.pageLoadTime = Date.now();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Start periodic data flushing
    this.startPeriodicFlush();
    
    console.log('Behavior tracking initialized for session:', this.currentSession.sessionId);
  }

  /**
   * Stop behavior tracking and process final data
   */
  async stopTracking(): Promise<BehaviorMetrics | null> {
    if (!this.trackingEnabled || !this.currentSession) {
      return null;
    }

    this.trackingEnabled = false;
    this.currentSession.endTime = Date.now();
    
    // Remove event listeners
    this.removeEventListeners();
    
    // Stop periodic flushing
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    // Final data flush
    await this.flushEventBuffer();
    
    // Calculate behavior metrics
    const metrics = this.calculateBehaviorMetrics(this.currentSession);
    
    // Store session data (if it meets minimum requirements)
    if (this.isValidSession(this.currentSession)) {
      await this.storeSessionData(this.currentSession, metrics);
    }
    
    const result = metrics;
    this.currentSession = null;
    
    return result;
  }

  /**
   * Set up event listeners for behavior tracking
   */
  private setupEventListeners(): void {
    // Keyboard events (with privacy protection)
    document.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: true });
    document.addEventListener('keyup', this.handleKeyUp.bind(this), { passive: true });
    
    // Mouse events
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('click', this.handleMouseClick.bind(this), { passive: true });
    document.addEventListener('wheel', this.handleScroll.bind(this), { passive: true });
    
    // Focus events
    window.addEventListener('focus', this.handleFocusChange.bind(this), { passive: true });
    window.addEventListener('blur', this.handleFocusChange.bind(this), { passive: true });
    
    // Navigation events
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this));
    
    // Page visibility
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this), { passive: true });
  }

  /**
   * Remove event listeners
   */
  private removeEventListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('click', this.handleMouseClick.bind(this));
    document.removeEventListener('wheel', this.handleScroll.bind(this));
    window.removeEventListener('focus', this.handleFocusChange.bind(this));
    window.removeEventListener('blur', this.handleFocusChange.bind(this));
    window.removeEventListener('beforeunload', this.handlePageUnload.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  /**
   * Handle keyboard events (privacy-safe)
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.trackingEnabled || !this.currentSession) return;

    const timestamp = Date.now();
    const timeBetweenKeys = this.lastKeyTime > 0 ? timestamp - this.lastKeyTime : 0;
    
    // Store anonymized key information (no actual content)
    const pattern: TypingPattern = {
      keyCode: this.anonymizeKeyCode(event.code),
      keyDownTime: timestamp,
      keyUpTime: 0, // Will be filled in keyup
      timeBetweenKeys,
      pressure: (event as any).pressure || undefined
    };
    
    this.currentSession.typingPatterns.push(pattern);
    this.lastKeyTime = timestamp;
    
    // Limit buffer size
    if (this.currentSession.typingPatterns.length > 1000) {
      this.currentSession.typingPatterns = this.currentSession.typingPatterns.slice(-500);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.trackingEnabled || !this.currentSession) return;

    const timestamp = Date.now();
    const patterns = this.currentSession.typingPatterns;
    
    // Find the corresponding keydown event
    const lastPattern = patterns[patterns.length - 1];
    if (lastPattern && lastPattern.keyCode === this.anonymizeKeyCode(event.code)) {
      lastPattern.keyUpTime = timestamp;
    }
  }

  /**
   * Handle mouse movement (sampled for performance)
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.trackingEnabled || !this.currentSession) return;
    
    const timestamp = Date.now();
    
    // Sample at configured rate
    if (timestamp - this.lastMousePosition.x < this.TRACKING_CONFIG.mouseSampleRate) {
      return;
    }
    
    const movement: MouseMovement = {
      x: event.clientX,
      y: event.clientY,
      timestamp,
      eventType: 'move'
    };
    
    this.currentSession.mouseMovements.push(movement);
    this.lastMousePosition = { x: timestamp, y: 0 }; // Store timestamp for rate limiting
    
    // Limit buffer size
    if (this.currentSession.mouseMovements.length > 2000) {
      this.currentSession.mouseMovements = this.currentSession.mouseMovements.slice(-1000);
    }
  }

  private handleMouseClick(event: MouseEvent): void {
    if (!this.trackingEnabled || !this.currentSession) return;
    
    const movement: MouseMovement = {
      x: event.clientX,
      y: event.clientY,
      timestamp: Date.now(),
      eventType: 'click',
      button: event.button
    };
    
    this.currentSession.mouseMovements.push(movement);
  }

  /**
   * Handle scroll events
   */
  private handleScroll(event: WheelEvent): void {
    if (!this.trackingEnabled || !this.currentSession) return;
    
    const timestamp = Date.now();
    const currentScrollY = window.scrollY;
    const velocity = Math.abs(currentScrollY - this.lastScrollPosition);
    
    this.currentSession.scrollBehavior.push({
      timestamp,
      scrollY: currentScrollY,
      velocity
    });
    
    this.lastScrollPosition = currentScrollY;
    
    // Also record as mouse movement
    const movement: MouseMovement = {
      x: event.clientX,
      y: event.clientY,
      timestamp,
      eventType: 'scroll',
      scrollDelta: event.deltaY
    };
    
    this.currentSession.mouseMovements.push(movement);
  }

  /**
   * Handle focus changes
   */
  private handleFocusChange(): void {
    if (!this.trackingEnabled || !this.currentSession) return;
    
    this.currentSession.focusEvents.push({
      timestamp: Date.now(),
      hasFocus: document.hasFocus()
    });
  }

  /**
   * Handle page unload
   */
  private handlePageUnload(): void {
    if (this.trackingEnabled && this.currentSession) {
      // Record page navigation
      const timeOnPage = Date.now() - this.pageLoadTime;
      
      this.currentSession.navigationEvents.push({
        url: window.location.href,
        timestamp: Date.now(),
        eventType: 'navigation',
        timeOnPage
      });
      
      // Quick flush before unload
      this.flushEventBuffer();
    }
  }

  /**
   * Handle visibility changes
   */
  private handleVisibilityChange(): void {
    if (!this.trackingEnabled || !this.currentSession) return;
    
    this.currentSession.focusEvents.push({
      timestamp: Date.now(),
      hasFocus: !document.hidden
    });
  }

  /**
   * Anonymize key codes for privacy
   */
  private anonymizeKeyCode(code: string): string {
    // Group keys by type rather than exact key
    if (code.startsWith('Key')) return 'letter';
    if (code.startsWith('Digit')) return 'digit';
    if (code.includes('Arrow')) return 'arrow';
    if (['Space', 'Enter', 'Tab', 'Backspace', 'Delete'].includes(code)) return code.toLowerCase();
    if (code.startsWith('Shift') || code.startsWith('Control') || code.startsWith('Alt')) return 'modifier';
    if (code.startsWith('F') && code.length <= 4) return 'function';
    return 'other';
  }

  /**
   * Calculate behavior metrics from session data
   */
  private calculateBehaviorMetrics(session: BehaviorSession): BehaviorMetrics {
    const typingMetrics = this.calculateTypingMetrics(session.typingPatterns);
    const mouseMetrics = this.calculateMouseMetrics(session.mouseMovements);
    const navigationMetrics = this.calculateNavigationMetrics(session.navigationEvents);
    const focusMetrics = this.calculateFocusMetrics(session.focusEvents);
    const sessionMetrics = this.calculateSessionMetrics(session);
    
    return {
      averageTypingSpeed: typingMetrics.speed,
      keystrokeDynamics: typingMetrics.dynamics,
      mouseCharacteristics: mouseMetrics,
      navigationBehavior: navigationMetrics,
      focusBehavior: focusMetrics,
      sessionPatterns: sessionMetrics
    };
  }

  private calculateTypingMetrics(patterns: TypingPattern[]) {
    if (patterns.length < this.TRACKING_CONFIG.typingSampleMinimum) {
      return {
        speed: 0,
        dynamics: {
          avgKeyPressDuration: 0,
          avgTimeBetweenKeys: 0,
          typingRhythm: 0,
          pausePatterns: []
        }
      };
    }

    const validPatterns = patterns.filter(p => p.keyUpTime > 0 && p.keyCode === 'letter');
    
    if (validPatterns.length === 0) {
      return {
        speed: 0,
        dynamics: {
          avgKeyPressDuration: 0,
          avgTimeBetweenKeys: 0,
          typingRhythm: 0,
          pausePatterns: []
        }
      };
    }

    const pressDurations = validPatterns.map(p => p.keyUpTime - p.keyDownTime);
    const timeBetweenKeys = validPatterns.map(p => p.timeBetweenKeys).filter(t => t > 0);
    
    const avgPressDuration = pressDurations.reduce((a, b) => a + b, 0) / pressDurations.length;
    const avgTimeBetween = timeBetweenKeys.reduce((a, b) => a + b, 0) / timeBetweenKeys.length;
    
    // Calculate typing speed (approximate)
    const totalTime = validPatterns[validPatterns.length - 1]?.keyDownTime - validPatterns[0]?.keyDownTime || 1;
    const wpm = (validPatterns.length / (totalTime / 1000)) * 60 / 5; // Assuming 5 chars per word
    
    // Calculate rhythm consistency
    const timeBetweenVariance = this.calculateVariance(timeBetweenKeys);
    const rhythmConsistency = Math.max(0, 1 - (timeBetweenVariance / avgTimeBetween));
    
    return {
      speed: Math.min(200, Math.max(0, wpm)), // Cap at reasonable values
      dynamics: {
        avgKeyPressDuration: avgPressDuration,
        avgTimeBetweenKeys: avgTimeBetween,
        typingRhythm: rhythmConsistency,
        pausePatterns: this.findCommonPauses(timeBetweenKeys)
      }
    };
  }

  private calculateMouseMetrics(movements: MouseMovement[]) {
    if (movements.length < 10) {
      return {
        averageSpeed: 0,
        clickPrecision: 0,
        movementSmoothness: 0,
        scrollBehavior: {
          averageScrollSpeed: 0,
          scrollDirection: 'normal' as const,
          wheelSensitivity: 0
        }
      };
    }

    const moveEvents = movements.filter(m => m.eventType === 'move');
    const clickEvents = movements.filter(m => m.eventType === 'click');
    const scrollEvents = movements.filter(m => m.eventType === 'scroll');
    
    // Calculate average speed
    let totalDistance = 0;
    let totalTime = 0;
    
    for (let i = 1; i < moveEvents.length; i++) {
      const prev = moveEvents[i - 1];
      const curr = moveEvents[i];
      const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
      const time = curr.timestamp - prev.timestamp;
      
      totalDistance += distance;
      totalTime += time;
    }
    
    const averageSpeed = totalTime > 0 ? totalDistance / totalTime : 0;
    
    // Calculate click precision (simplified)
    const clickPrecision = clickEvents.length > 0 ? 0.8 : 0; // Placeholder
    
    // Calculate movement smoothness
    const smoothness = this.calculateMovementSmoothness(moveEvents);
    
    // Calculate scroll behavior
    const scrollSpeeds = scrollEvents.map(s => Math.abs(s.scrollDelta || 0));
    const avgScrollSpeed = scrollSpeeds.length > 0 ? 
      scrollSpeeds.reduce((a, b) => a + b, 0) / scrollSpeeds.length : 0;
    
    return {
      averageSpeed,
      clickPrecision,
      movementSmoothness: smoothness,
      scrollBehavior: {
        averageScrollSpeed: avgScrollSpeed,
        scrollDirection: 'normal' as const,
        wheelSensitivity: avgScrollSpeed / 100 // Normalized
      }
    };
  }

  private calculateNavigationMetrics(events: NavigationEvent[]) {
    const timeOnPages = events.map(e => e.timeOnPage).filter(t => t && t > 0) as number[];
    const avgTimeOnPage = timeOnPages.length > 0 ? 
      timeOnPages.reduce((a, b) => a + b, 0) / timeOnPages.length : 0;
    
    return {
      averageTimeOnPage: avgTimeOnPage,
      commonActionSequences: [], // Would be calculated with more data
      navigationSpeed: events.length / Math.max(1, avgTimeOnPage / 1000),
      backButtonUsage: 0 // Would track browser back button usage
    };
  }

  private calculateFocusMetrics(events: { timestamp: number; hasFocus: boolean }[]) {
    let totalFocusTime = 0;
    let focusSessions = 0;
    let tabSwitches = 0;
    
    for (let i = 1; i < events.length; i++) {
      const prev = events[i - 1];
      const curr = events[i];
      
      if (prev.hasFocus && !curr.hasFocus) {
        tabSwitches++;
      }
      
      if (prev.hasFocus) {
        totalFocusTime += curr.timestamp - prev.timestamp;
        focusSessions++;
      }
    }
    
    return {
      averageFocusSessionLength: focusSessions > 0 ? totalFocusTime / focusSessions : 0,
      tabSwitchingFrequency: tabSwitches,
      idleTimeThreshold: 30000 // 30 seconds default
    };
  }

  private calculateSessionMetrics(session: BehaviorSession) {
    const sessionLength = (session.endTime || Date.now()) - session.startTime;
    
    // Calculate activity level based on event frequency
    const totalEvents = session.typingPatterns.length + 
                       session.mouseMovements.length + 
                       session.navigationEvents.length;
    
    const eventsPerMinute = totalEvents / (sessionLength / 60000);
    
    let activityLevel: 'low' | 'medium' | 'high' = 'low';
    if (eventsPerMinute > 50) activityLevel = 'high';
    else if (eventsPerMinute > 20) activityLevel = 'medium';
    
    return {
      averageSessionLength: sessionLength,
      activityLevel,
      multitaskingIndicators: session.focusEvents.filter(e => !e.hasFocus).length
    };
  }

  // Helper methods
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  private findCommonPauses(intervals: number[]): number[] {
    // Group intervals into bins and find common pause durations
    const bins: { [key: string]: number } = {};
    
    intervals.forEach(interval => {
      const bin = Math.round(interval / 100) * 100; // 100ms bins
      bins[bin] = (bins[bin] || 0) + 1;
    });
    
    return Object.entries(bins)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([bin]) => parseInt(bin));
  }

  private calculateMovementSmoothness(movements: MouseMovement[]): number {
    if (movements.length < 3) return 0;
    
    // Calculate direction changes as smoothness indicator
    let directionChanges = 0;
    
    for (let i = 2; i < movements.length; i++) {
      const p1 = movements[i - 2];
      const p2 = movements[i - 1];
      const p3 = movements[i];
      
      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
      
      const angleDiff = Math.abs(angle2 - angle1);
      if (angleDiff > Math.PI / 4) { // 45 degree threshold
        directionChanges++;
      }
    }
    
    return Math.max(0, 1 - (directionChanges / movements.length));
  }

  private isValidSession(session: BehaviorSession): boolean {
    const sessionLength = (session.endTime || Date.now()) - session.startTime;
    return sessionLength >= this.PRIVACY_CONFIG.minSessionLength &&
           (session.typingPatterns.length > 0 || session.mouseMovements.length > 10);
  }

  private generateSessionId(): string {
    return `behavior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startPeriodicFlush(): void {
    this.flushInterval = window.setInterval(() => {
      this.flushEventBuffer();
    }, this.TRACKING_CONFIG.bufferFlushInterval);
  }

  private async flushEventBuffer(): Promise<void> {
    if (!this.currentSession || this.eventBuffer.length === 0) return;
    
    try {
      // Send behavior data to backend
      await this.sendBehaviorData(this.currentSession);
      this.eventBuffer = [];
    } catch (error) {
      console.error('Failed to flush behavior data:', error);
      // Don't throw - tracking should be resilient to backend failures
    }
  }

  private async storeSessionData(session: BehaviorSession, metrics: BehaviorMetrics): Promise<void> {
    try {
      // Store final session data
      const response = await fetch('/api/behavior/session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({ 
          session: this.sanitizeSessionData(session), 
          metrics,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Session data stored successfully:', result.sessionId);
      
    } catch (error) {
      console.error('Failed to store session data:', error);
      // Store in localStorage as fallback
      this.storeSessionDataLocally(session, metrics);
    }
  }

  private async sendBehaviorData(session: BehaviorSession): Promise<void> {
    // Send incremental behavior data
    try {
      const response = await fetch('/api/behavior/update', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'X-Session-ID': session.sessionId
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          userId: session.userId,
          deviceId: session.deviceId,
          timestamp: new Date().toISOString(),
          incrementalData: {
            typingPatterns: session.typingPatterns.slice(-10), // Last 10 patterns
            mouseMovements: session.mouseMovements.slice(-50), // Last 50 movements
            recentEvents: this.eventBuffer,
            currentMetrics: this.calculateRealtimeMetrics(session)
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Failed to send behavior data:', error);
      // Add to local buffer for retry
      this.addToRetryBuffer(session);
    }
  }

  /**
   * Calculate real-time behavior metrics for continuous assessment
   */
  private calculateRealtimeMetrics(session: BehaviorSession) {
    const currentTime = Date.now();
    const sessionLength = currentTime - session.startTime;
    
    // Recent typing patterns (last 30 seconds)
    const recentTyping = session.typingPatterns.filter(
      p => currentTime - p.keyDownTime < 30000
    );
    
    // Recent mouse movements (last 10 seconds)
    const recentMouse = session.mouseMovements.filter(
      m => currentTime - m.timestamp < 10000
    );

    return {
      sessionDuration: sessionLength,
      recentTypingSpeed: this.calculateTypingSpeed(recentTyping),
      recentMouseActivity: recentMouse.length,
      currentActivityLevel: this.assessCurrentActivityLevel(session, currentTime),
      anomalyIndicators: this.detectRealtimeAnomalies(session, currentTime)
    };
  }

  /**
   * Detect real-time behavioral anomalies
   */
  private detectRealtimeAnomalies(session: BehaviorSession, currentTime: number) {
    const anomalies = [];
    
    // Check for unusual typing patterns
    const recentTyping = session.typingPatterns.slice(-10);
    if (recentTyping.length >= 5) {
      const avgInterval = recentTyping.reduce((sum, p) => sum + p.timeBetweenKeys, 0) / recentTyping.length;
      if (avgInterval > 2000 || avgInterval < 50) { // Very slow or impossibly fast
        anomalies.push({
          type: 'typing_speed_anomaly',
          severity: avgInterval > 2000 ? 'medium' : 'high',
          details: { averageInterval: avgInterval }
        });
      }
    }

    // Check for mouse movement patterns
    const recentMouse = session.mouseMovements.slice(-20);
    if (recentMouse.length >= 10) {
      const movements = recentMouse.filter(m => m.eventType === 'move');
      if (movements.length === 0) {
        anomalies.push({
          type: 'no_mouse_movement',
          severity: 'low',
          details: { duration: 10000 }
        });
      }
    }

    // Check for focus patterns
    const recentFocus = session.focusEvents.filter(
      f => currentTime - f.timestamp < 60000
    );
    const focusLost = recentFocus.filter(f => !f.hasFocus).length;
    if (focusLost > 3) {
      anomalies.push({
        type: 'excessive_focus_changes',
        severity: 'medium',
        details: { focusChanges: focusLost }
      });
    }

    return anomalies;
  }

  /**
   * Assess current activity level
   */
  private assessCurrentActivityLevel(session: BehaviorSession, currentTime: number): 'idle' | 'low' | 'medium' | 'high' {
    const recentEvents = [
      ...session.typingPatterns.filter(p => currentTime - p.keyDownTime < 30000),
      ...session.mouseMovements.filter(m => currentTime - m.timestamp < 30000)
    ];

    const eventsPerMinute = recentEvents.length * 2; // Scale to per minute

    if (eventsPerMinute === 0) return 'idle';
    if (eventsPerMinute < 10) return 'low';
    if (eventsPerMinute < 30) return 'medium';
    return 'high';
  }

  /**
   * Calculate typing speed from recent patterns
   */
  private calculateTypingSpeed(patterns: TypingPattern[]): number {
    if (patterns.length < 3) return 0;
    
    const validPatterns = patterns.filter(p => p.keyCode === 'letter' && p.keyUpTime > 0);
    if (validPatterns.length < 2) return 0;

    const timeSpan = validPatterns[validPatterns.length - 1].keyDownTime - validPatterns[0].keyDownTime;
    const charCount = validPatterns.length;
    
    // Calculate WPM (assuming 5 characters per word)
    const minutes = timeSpan / 60000;
    return minutes > 0 ? (charCount / 5) / minutes : 0;
  }

  /**
   * Get authentication token for API requests
   */
  private getAuthToken(): string {
    return localStorage.getItem('auth_token') || '';
  }

  /**
   * Sanitize session data to remove sensitive information
   */
  private sanitizeSessionData(session: BehaviorSession): Partial<BehaviorSession> {
    return {
      sessionId: session.sessionId,
      userId: session.userId,
      deviceId: session.deviceId,
      startTime: session.startTime,
      endTime: session.endTime,
      // Only include anonymized patterns
      typingPatterns: session.typingPatterns.map(p => ({
        ...p,
        keyCode: p.keyCode // Already anonymized
      })),
      mouseMovements: session.mouseMovements.map(m => ({
        x: Math.round(m.x / 10) * 10, // Round to nearest 10px for privacy
        y: Math.round(m.y / 10) * 10,
        timestamp: m.timestamp,
        eventType: m.eventType
      })),
      navigationEvents: session.navigationEvents.map(n => ({
        url: this.sanitizeUrl(n.url),
        timestamp: n.timestamp,
        eventType: n.eventType,
        timeOnPage: n.timeOnPage
      })),
      focusEvents: session.focusEvents,
      scrollBehavior: session.scrollBehavior
    };
  }

  /**
   * Sanitize URLs to protect privacy
   */
  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query parameters and fragments for privacy
      return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
    } catch {
      return 'invalid-url';
    }
  }

  /**
   * Store session data locally as fallback
   */
  private storeSessionDataLocally(session: BehaviorSession, metrics: BehaviorMetrics): void {
    try {
      const localData = {
        session: this.sanitizeSessionData(session),
        metrics,
        timestamp: new Date().toISOString(),
        syncStatus: 'pending'
      };

      const key = `behavior_session_${session.sessionId}`;
      localStorage.setItem(key, JSON.stringify(localData));

      // Clean up old sessions (keep last 5)
      this.cleanupLocalSessions();
      
    } catch (error) {
      console.warn('Failed to store session data locally:', error);
    }
  }

  /**
   * Clean up old local sessions
   */
  private cleanupLocalSessions(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('behavior_session_'));
    if (keys.length > 5) {
      // Sort by timestamp and remove oldest
      const sessions = keys.map(key => ({
        key,
        data: JSON.parse(localStorage.getItem(key) || '{}')
      })).sort((a, b) => new Date(b.data.timestamp).getTime() - new Date(a.data.timestamp).getTime());

      // Remove oldest sessions
      sessions.slice(5).forEach(session => {
        localStorage.removeItem(session.key);
      });
    }
  }

  /**
   * Add session to retry buffer for failed uploads
   */
  private addToRetryBuffer(session: BehaviorSession): void {
    // Implementation would queue failed uploads for retry
    console.log('Added session to retry buffer:', session.sessionId);
  }

  /**
   * Get behavior analytics for trust assessment
   */
  async getBehaviorAnalytics(userId: string, timeRange: number = 24 * 60 * 60 * 1000): Promise<any> {
    try {
      const response = await fetch(`/api/behavior/analytics/${userId}?timeRange=${timeRange}`, {
        headers: { 
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
      
    } catch (error) {
      console.error('Failed to get behavior analytics:', error);
      return this.getFallbackAnalytics();
    }
  }

  /**
   * Get fallback analytics from local data
   */
  private getFallbackAnalytics(): any {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('behavior_session_'));
    const sessions = keys.map(key => JSON.parse(localStorage.getItem(key) || '{}')).filter(s => s.session);

    return {
      sessionCount: sessions.length,
      totalDuration: sessions.reduce((sum, s) => sum + (s.session.endTime - s.session.startTime), 0),
      averageTypingSpeed: sessions.reduce((sum, s) => sum + (s.metrics?.averageTypingSpeed || 0), 0) / sessions.length,
      activityLevel: 'medium',
      source: 'local_fallback'
    };
  }
}

export const behaviorTracker = new BehaviorTracker();