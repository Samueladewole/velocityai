import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface DataPoint {
  time: string
  cpu: number
  memory: number
  tasks: number
}

export function AgentChart({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Generate mock data
    const dataPoints: DataPoint[] = []
    const now = Date.now()
    for (let i = 0; i < 20; i++) {
      dataPoints.push({
        time: new Date(now - (19 - i) * 3 * 60 * 1000).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        cpu: Math.random() * 60 + 20,
        memory: Math.random() * 200 + 200,
        tasks: Math.floor(Math.random() * 20) + 5
      })
    }

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Chart dimensions
    const padding = 40
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(rect.width - padding, y)
      ctx.stroke()
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, rect.height - padding)
    ctx.lineTo(rect.width - padding, rect.height - padding)
    ctx.stroke()

    // Draw CPU line
    const drawLine = (data: number[], color: string, maxValue: number) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index
        const y = rect.height - padding - (value / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw area fill
      ctx.lineTo(rect.width - padding, rect.height - padding)
      ctx.lineTo(padding, rect.height - padding)
      ctx.closePath()
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, padding, 0, rect.height - padding)
      gradient.addColorStop(0, color.replace('1)', '0.3)'))
      gradient.addColorStop(1, color.replace('1)', '0.05)'))
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Draw lines
    drawLine(dataPoints.map(d => d.cpu), 'rgba(139, 92, 246, 1)', 100)
    drawLine(dataPoints.map(d => d.memory / 5), 'rgba(236, 72, 153, 1)', 100)

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.font = '11px system-ui'
    
    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      const value = Math.round((5 - i) * 20)
      ctx.textAlign = 'right'
      ctx.fillText(`€{value}%`, padding - 10, y + 4)
    }

    // X-axis labels
    ctx.textAlign = 'center'
    dataPoints.forEach((point, index) => {
      if (index % 4 === 0) {
        const x = padding + (chartWidth / (dataPoints.length - 1)) * index
        ctx.fillText(point.time, x, rect.height - padding + 20)
      }
    })

    // Legend
    const legendItems = [
      { label: 'CPU Usage', color: 'rgba(139, 92, 246, 1)' },
      { label: 'Memory Usage', color: 'rgba(236, 72, 153, 1)' }
    ]

    ctx.textAlign = 'left'
    legendItems.forEach((item, index) => {
      const x = rect.width - 150
      const y = padding + index * 20

      // Color indicator
      ctx.fillStyle = item.color
      ctx.fillRect(x, y - 8, 12, 12)

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(item.label, x + 20, y)
    })

  }, [])

  return (
    <div className={cn('relative w-full h-64', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}