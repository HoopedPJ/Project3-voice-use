"use client"

import { useState, useRef, useCallback } from "react"
import { Mic, Volume2, Square } from "lucide-react"
import { useAudioRecorder } from "@/hooks/use-audio-recorder"
import { useWhisperWorker } from "@/hooks/use-whisper-worker"
import { useTTSWorker } from "@/hooks/use-tts-worker"
import { usePerformanceMetrics } from "@/hooks/use-performance-metrics"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: number
  audioUrl?: string
}

export function SpeechAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState("")

  const audioRef = useRef<HTMLAudioElement>(null)
  const { startRecording, stopRecording, audioChunks } = useAudioRecorder()
  const { transcribeAudio, isLoading: whisperLoading } = useWhisperWorker()
  const { synthesizeSpeech, isLoading: ttsLoading } = useTTSWorker()
  const { startTimer, endTimer, metrics } = usePerformanceMetrics()

  const handleStartRecording = useCallback(async () => {
    setIsRecording(true)
    setCurrentTranscript("")
    startTimer("stt")
    await startRecording()
  }, [startRecording, startTimer])

  const handleStopRecording = useCallback(async () => {
    setIsProcessing(true)
    setIsRecording(false)

    const audioBlob = await stopRecording()
    if (!audioBlob) return

    try {
      // Transcribe audio locally
      const transcript = await transcribeAudio(audioBlob)
      endTimer("stt")
      setCurrentTranscript(transcript)

      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: transcript,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMessage])

      // Send to OpenAI API
      startTimer("llm")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: transcript }),
      })

      const responseData = await response.json()
      let reply = responseData.reply

      // If API failed but we have a fallback reply, use it
      if (!response.ok && responseData.fallbackReply) {
        reply = responseData.fallbackReply
        console.warn("Using fallback reply due to API error:", responseData.error)
      } else if (!response.ok) {
        throw new Error(responseData.error || "API request failed")
      }

      endTimer("llm")

      // Continue with TTS synthesis...
      startTimer("tts")
      const audioBuffer = await synthesizeSpeech(reply)
      endTimer("tts")

      // Create audio URL
      const audioBlobForUrl = new Blob([audioBuffer], { type: "audio/wav" })
      const audioUrl = URL.createObjectURL(audioBlobForUrl)

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: reply,
        timestamp: Date.now(),
        audioUrl,
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Play audio
      startTimer("playback")
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
        audioRef.current.onended = () => endTimer("playback")
      }
    } catch (apiError) {
      console.error("API Error:", apiError)
      endTimer("llm")

      // Use a generic fallback response
      const fallbackReply =
        "I'm sorry, I'm having trouble connecting to my AI service right now. Please try again later."

      startTimer("tts")
      const audioBuffer = await synthesizeSpeech(fallbackReply)
      endTimer("tts")

      const audioBlobForUrl = new Blob([audioBuffer], { type: "audio/wav" })
      const audioUrl = URL.createObjectURL(audioBlobForUrl)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: fallbackReply,
        timestamp: Date.now(),
        audioUrl,
      }
      setMessages((prev) => [...prev, assistantMessage])

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
      }
    } finally {
      setIsProcessing(false)
    }
  }, [stopRecording, transcribeAudio, synthesizeSpeech, startTimer, endTimer])

  const playMessage = useCallback((audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
    }
  }, [])

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isProcessing}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-200 ${
            isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isRecording ? <Square /> : <Mic />}
        </button>

        <div className="mt-4">
          {isRecording && <p className="text-red-600 font-medium">Recording...</p>}
          {isProcessing && <p className="text-yellow-600 font-medium">Processing...</p>}
          {currentTranscript && <p className="text-gray-600 italic mt-2">"{currentTranscript}"</p>}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.audioUrl && (
                <button
                  onClick={() => playMessage(message.audioUrl!)}
                  className="mt-2 flex items-center text-xs opacity-75 hover:opacity-100"
                >
                  <Volume2 className="w-3 h-3 mr-1" />
                  Play
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
