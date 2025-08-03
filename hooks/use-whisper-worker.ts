"use client"

import { useState, useRef, useCallback } from "react"

export function useWhisperWorker() {
  const [isLoading, setIsLoading] = useState(false)
  const workerRef = useRef<Worker | null>(null)

  const initWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker("/workers/whisper-worker.js")
    }
    return workerRef.current
  }, [])

  const transcribeAudio = useCallback(
    async (audioBlob: Blob): Promise<string> => {
      setIsLoading(true)

      try {
        const worker = initWorker()

        return new Promise((resolve, reject) => {
          worker.onmessage = (event) => {
            const { type, data, error } = event.data

            if (type === "transcription-complete") {
              setIsLoading(false)
              resolve(data.text)
            } else if (type === "error") {
              setIsLoading(false)
              reject(new Error(error))
            }
          }

          // Convert blob to array buffer and then process the audio
          audioBlob
            .arrayBuffer()
            .then(async (buffer) => {
              try {
                // Create AudioContext to decode the audio properly
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                const audioBuffer = await audioContext.decodeAudioData(buffer)

                // Convert to Float32Array with proper format
                const channelData = audioBuffer.getChannelData(0) // Get first channel
                const sampleRate = audioBuffer.sampleRate

                worker.postMessage({
                  type: "transcribe",
                  audioData: channelData.buffer, // Send the underlying ArrayBuffer
                  sampleRate: sampleRate,
                })
              } catch (decodeError) {
                console.error("Audio decode error:", decodeError)
                reject(new Error("Failed to decode audio data"))
              }
            })
            .catch(reject)
        })
      } catch (error) {
        setIsLoading(false)
        throw error
      }
    },
    [initWorker],
  )

  return {
    transcribeAudio,
    isLoading,
  }
}
