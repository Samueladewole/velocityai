/**
 * Metrics Collector for ERIP Platform Observability
 * 
 * Provides comprehensive metrics collection and export
 * for monitoring platform health and performance
 */

export interface MetricsConfig {
  enabled: boolean
  exportInterval: number
  labels: Record<string, string>
  histogramBuckets?: number[]
}

interface Counter {
  value: number
  labels: Record<string, string>
}

interface Histogram {
  sum: number
  count: number
  buckets: Map<number, number>
  labels: Record<string, string>
}

export class MetricsCollector {
  private counters: Map<string, Counter> = new Map()
  private histograms: Map<string, Histogram> = new Map()
  private exportTimer?: NodeJS.Timeout
  private defaultBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]

  constructor(private config: MetricsConfig) {
    if (config.enabled && config.exportInterval > 0) {
      this.exportTimer = setInterval(
        () => this.exportMetrics(),
        config.exportInterval
      )
    }
  }

  incrementCounter(name: string, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const key = this.createKey(name, labels)
    const counter = this.counters.get(key) || { value: 0, labels: { ...this.config.labels, ...labels } }
    counter.value++
    this.counters.set(key, counter)
  }

  recordHistogram(name: string, value: number, labels: Record<string, string> = {}): void {
    if (!this.config.enabled) return

    const key = this.createKey(name, labels)
    let histogram = this.histograms.get(key)
    
    if (!histogram) {
      histogram = {
        sum: 0,
        count: 0,
        buckets: new Map(),
        labels: { ...this.config.labels, ...labels }
      }
      
      // Initialize buckets
      const buckets = this.config.histogramBuckets || this.defaultBuckets
      buckets.forEach(bucket => histogram!.buckets.set(bucket, 0))
      
      this.histograms.set(key, histogram)
    }
    
    histogram.sum += value
    histogram.count++
    
    // Update buckets
    for (const [bucket, count] of histogram.buckets.entries()) {
      if (value <= bucket) {
        histogram.buckets.set(bucket, count + 1)
      }
    }
  }

  getCounterValue(name: string, labels: Record<string, string> = {}): number {
    const key = this.createKey(name, labels)
    return this.counters.get(key)?.value || 0
  }

  getHistogramAverage(name: string, labels: Record<string, string> = {}): number {
    const key = this.createKey(name, labels)
    const histogram = this.histograms.get(key)
    
    if (!histogram || histogram.count === 0) return 0
    return histogram.sum / histogram.count
  }

  getHistogramPercentile(name: string, percentile: number, labels: Record<string, string> = {}): number {
    const key = this.createKey(name, labels)
    const histogram = this.histograms.get(key)
    
    if (!histogram || histogram.count === 0) return 0
    
    const target = histogram.count * (percentile / 100)
    let accumulated = 0
    
    for (const [bucket, count] of Array.from(histogram.buckets.entries()).sort((a, b) => a[0] - b[0])) {
      accumulated += count
      if (accumulated >= target) {
        return bucket
      }
    }
    
    return 0
  }

  private createKey(name: string, labels: Record<string, string>): string {
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `€{k}="€{v}"`)
      .join(',')
    
    return labelStr ? `€{name}{€{labelStr}}` : name
  }

  private exportMetrics(): void {
    const timestamp = new Date().toISOString()
    
    // Export counters
    for (const [key, counter] of this.counters.entries()) {
      console.log(`[METRIC] €{timestamp} COUNTER €{key} €{counter.value}`)
    }
    
    // Export histograms
    for (const [key, histogram] of this.histograms.entries()) {
      console.log(`[METRIC] €{timestamp} HISTOGRAM €{key}_sum €{histogram.sum}`)
      console.log(`[METRIC] €{timestamp} HISTOGRAM €{key}_count €{histogram.count}`)
      
      if (histogram.count > 0) {
        console.log(`[METRIC] €{timestamp} HISTOGRAM €{key}_avg €{histogram.sum / histogram.count}`)
        console.log(`[METRIC] €{timestamp} HISTOGRAM €{key}_p50 €{this.getHistogramPercentile(key.split('{')[0], 50)}`)
        console.log(`[METRIC] €{timestamp} HISTOGRAM €{key}_p95 €{this.getHistogramPercentile(key.split('{')[0], 95)}`)
        console.log(`[METRIC] €{timestamp} HISTOGRAM €{key}_p99 €{this.getHistogramPercentile(key.split('{')[0], 99)}`)
      }
    }
  }

  shutdown(): void {
    if (this.exportTimer) {
      clearInterval(this.exportTimer)
      this.exportMetrics() // Final export
    }
  }
}