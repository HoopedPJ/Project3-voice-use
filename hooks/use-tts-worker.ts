"use client"

import { useState, useRef, useCallback } from "react"

export function useTTSWorker() {
  const [isLoading, setIsLoading] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  const initWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker("/workers/tts-worker.js")
    }
    return workerRef.current
  }, [])

  const synthesizeSpeech = useCallback(
    async (text: string): Promise<ArrayBuffer> => {
      setIsLoading(true)

      try {
        const worker = initWorker()

        return new Promise((resolve, reject) => {
          worker.onmessage = (event) => {
            const { type, data, error } = event.data

            if (type === "synthesis-complete") {
              setIsLoading(false)
              resolve(data.audioBuffer)
            } else if (type === "error") {
              setIsLoading(false)
              reject(new Error(error))
            }
          }

          worker.postMessage({
            type: "synthesize",
            text: text,
          })
        })
      } catch (error) {
        setIsLoading(false)
        throw error
      }
    },
    [initWorker],
  )

  return {
    synthesizeSpeech,
    isLoading,
  }
}
