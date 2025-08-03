"use client"

import { useState, useCallback, useRef } from "react"

interface Metrics {
  stt?: number
  llm?: number
  tts?: number
  playback?: number
  total?: number
}

interface TimerState {
  [key: string]: number
}

export function usePerformanceMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({})
  const [history, setHistory] = useState<Metrics[]>([])
  const timersRef = useRef<TimerState>({})

  const startTimer = useCallback((key: string) => {
    timersRef.current[key] = performance.now()

    if (key === "stt") {
      // Reset all metrics for new session
      setMetrics({})
      timersRef.current = { [key]: timersRef.current[key] }
    }
  }, [])

  const endTimer = useCallback((key: string) => {
    const startTime = timersRef.current[key]
    if (!startTime) return

    const duration = performance.now() - startTime

    setMetrics((prev) => {
      const newMetrics = { ...prev, [key]: duration }

      // Calculate total if we have all components
      if (key === "playback" && prev.stt && prev.llm && prev.tts) {
        newMetrics.total = prev.stt + prev.llm + prev.tts + duration

        // Add to history
        setHistory((prevHistory) => [...prevHistory.slice(-9), newMetrics])
      }

      return newMetrics
    })
  }, [])

  const averages = {
    stt: history.length > 0 ? history.reduce((sum, m) => sum + (m.stt || 0), 0) / history.length : undefined,
    llm: history.length > 0 ? history.reduce((sum, m) => sum + (m.llm || 0), 0) / history.length : undefined,
    tts: history.length > 0 ? history.reduce((sum, m) => sum + (m.tts || 0), 0) / history.length : undefined,
    total: history.length > 0 ? history.reduce((sum, m) => sum + (m.total || 0), 0) / history.length : undefined,
  }

  return {
    metrics,
    averages,
    history,
    startTimer,
    endTimer,
  }
}
