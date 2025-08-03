"use client"

import { usePerformanceMetrics } from "@/hooks/use-performance-metrics"
import { Clock, Zap } from "lucide-react"

export function PerformanceMonitor() {
  const { metrics, averages } = usePerformanceMetrics()

  const formatTime = (ms: number) => `${ms.toFixed(0)}ms`

  return (
    <div className="card mt-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Zap className="w-5 h-5 mr-2" />
        Performance Metrics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.stt ? formatTime(metrics.stt) : "-"}</div>
          <div className="text-sm text-gray-600">STT</div>
          {averages.stt && <div className="text-xs text-gray-500">Avg: {formatTime(averages.stt)}</div>}
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{metrics.llm ? formatTime(metrics.llm) : "-"}</div>
          <div className="text-sm text-gray-600">LLM</div>
          {averages.llm && <div className="text-xs text-gray-500">Avg: {formatTime(averages.llm)}</div>}
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{metrics.tts ? formatTime(metrics.tts) : "-"}</div>
          <div className="text-sm text-gray-600">TTS</div>
          {averages.tts && <div className="text-xs text-gray-500">Avg: {formatTime(averages.tts)}</div>}
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{metrics.total ? formatTime(metrics.total) : "-"}</div>
          <div className="text-sm text-gray-600">Total</div>
          {averages.total && <div className="text-xs text-gray-500">Avg: {formatTime(averages.total)}</div>}
        </div>
      </div>

      <div className="mt-4 text-center">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            (metrics.total || 0) < 1200 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          <Clock className="w-4 h-4 mr-1" />
          Target: {"<"} 1.2s
        </div>
      </div>
    </div>
  )
}
