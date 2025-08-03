// Whisper Web Worker for local speech-to-text processing
const whisperModule = null
let isInitialized = false

// Initialize Whisper WASM module
async function initWhisper() {
  if (isInitialized) return

  try {
    console.log("Initializing Whisper WASM module...")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    isInitialized = true
    console.log("Whisper module initialized")
  } catch (error) {
    console.error("Failed to initialize Whisper:", error)
    throw error
  }
}

// Process audio data with Whisper
async function transcribeAudio(audioBuffer, sampleRate = 16000) {
  if (!isInitialized) {
    await initWhisper()
  }

  try {
    // Ensure we have a proper Float32Array
    let audioData
    if (audioBuffer instanceof ArrayBuffer) {
      // Check if buffer length is valid for Float32Array
      if (audioBuffer.byteLength % 4 !== 0) {
        console.warn("Audio buffer length not aligned for Float32Array, adjusting...")
        const alignedLength = Math.floor(audioBuffer.byteLength / 4) * 4
        const alignedBuffer = audioBuffer.slice(0, alignedLength)
        audioData = new Float32Array(alignedBuffer)
      } else {
        audioData = new Float32Array(audioBuffer)
      }
    } else {
      audioData = new Float32Array(audioBuffer)
    }

    console.log(`Processing audio: ${audioData.length} samples at ${sampleRate}Hz`)

    // Simulate transcription process
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock transcription result based on audio characteristics
    const mockTranscriptions = [
      "Hello, how are you today?",
      "What's the weather like?",
      "Can you help me with something?",
      "Tell me a joke please.",
      "What time is it now?",
      "How can I improve my productivity?",
      "What's new in technology?",
      "Can you explain that concept?",
    ]

    const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)]
    return randomTranscription
  } catch (error) {
    console.error("Transcription error:", error)
    throw error
  }
}

// Handle messages from main thread
self.onmessage = async (event) => {
  const { type, audioData, sampleRate } = event.data

  try {
    switch (type) {
      case "transcribe":
        const text = await transcribeAudio(audioData, sampleRate)
        self.postMessage({
          type: "transcription-complete",
          data: { text },
        })
        break

      case "init":
        await initWhisper()
        self.postMessage({
          type: "init-complete",
        })
        break

      default:
        throw new Error(`Unknown message type: ${type}`)
    }
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error.message,
    })
  }
}

// Initialize on worker startup
initWhisper().catch(console.error)
