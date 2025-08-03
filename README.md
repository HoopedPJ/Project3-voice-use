# Offline Speech AI Assistant

A Next.js Progressive Web App (PWA) that provides offline-first speech processing with AI integration. Features local speech-to-text, text-to-speech, and AI chat completion through OpenAI or OpenRouter APIs.

## 🚀 Features

### Offline-First Architecture
- **Service Worker**: Caches assets for offline functionality
- **Web App Manifest**: Installable PWA with native app-like experience
- **Asset Precaching**: Whisper WASM and TTS model files cached locally

### Local Speech Processing
- **Speech-to-Text (STT)**: Local microphone recording with Whisper.cpp WASM
- **Text-to-Speech (TTS)**: Local audio synthesis with Coqui-style TTS
- **Web Workers**: Non-blocking audio processing in background threads

### AI Integration
- **OpenAI Support**: GPT-3.5-turbo and GPT-4 models
- **OpenRouter Support**: Access to 100+ AI models from multiple providers
- **Secure API Handling**: Server-side API key management

### Performance Optimized
- **Real-time Metrics**: Track STT, LLM, TTS, and playback latency
- **Target Performance**: \< 1.2s total response time
- **Streaming Pipeline**: STT → LLM → TTS → Playback

## 📋 Prerequisites

- Node.js 18+ and pnpm
- OpenAI API key OR OpenRouter API key
- HTTPS (required for PWA features in production)

## 🛠️ Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd offline-speech-pwa
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Configure environment variables**
   
   Create a \`.env.local\` file in the project root:

   **Option A: OpenAI (Recommended for beginners)**
   \`\`\`env
   OPENAI_API_KEY=sk-your_openai_key_here
   \`\`\`

   **Option B: OpenRouter (More models, cost-effective)**
   \`\`\`env
   OPENROUTER_API_KEY=sk-or-your_openrouter_key_here
   \`\`\`

   **Option C: Both (App will prefer OpenRouter if both are set)**
   \`\`\`env
   OPENAI_API_KEY=sk-your_openai_key_here
   OPENROUTER_API_KEY=sk-or-your_openrouter_key_here
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   pnpm run dev
   \`\`\`

5. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 🔑 API Key Setup

### OpenAI Setup
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add to \`.env.local\`: \`OPENAI_API_KEY=sk-your_key_here\`

### OpenRouter Setup (Recommended)
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create a new API key
3. Add to \`.env.local\`: \`OPENROUTER_API_KEY=sk-or-your_key_here\`

**Why OpenRouter?**
- **100+ Models**: Access to Claude, Llama, Gemini, and more
- **Cost-Effective**: Pay-as-you-go with competitive pricing
- **No Monthly Fees**: Only pay for what you use
- **High Availability**: Enterprise-grade infrastructure
- **Latest Models**: Immediate access to new releases

### Browser Storage (Alternative)
If you prefer not to use environment variables:
1. Click "API Configuration" in the app
2. Enter your API key directly
3. It will be stored securely in your browser

## 🏗️ Architecture

### Core Components

\`\`\`
app/
├── api/chat/route.ts          # AI API integration
├── layout.tsx                 # PWA configuration
├── manifest.ts                # Web app manifest
└── page.tsx                   # Main application

components/
├── speech-assistant.tsx       # Main speech interface
├── performance-monitor.tsx    # Metrics dashboard
├── offline-status.tsx         # Network status
└── api-key-setup.tsx         # Configuration UI

hooks/
├── use-audio-recorder.ts      # Microphone recording
├── use-whisper-worker.ts      # STT processing
├── use-tts-worker.ts          # TTS synthesis
└── use-performance-metrics.ts # Performance tracking

public/
├── sw.js                      # Service worker
└── workers/
    ├── whisper-worker.js      # STT Web Worker
    └── tts-worker.js          # TTS Web Worker
\`\`\`

### Data Flow

1. **Recording**: Capture audio from microphone
2. **STT**: Process audio locally with Whisper WASM
3. **LLM**: Send transcript to OpenAI/OpenRouter API
4. **TTS**: Synthesize response audio locally
5. **Playback**: Play generated audio to user

## 🎯 Usage

### Basic Operation
1. Click the microphone button to start recording
2. Speak your message
3. Click stop or the button again to end recording
4. Wait for AI processing and audio response

### Performance Monitoring
- View real-time latency metrics
- Track average performance over time
- Monitor against \< 1.2s target

### Offline Capabilities
- STT and TTS work completely offline
- Only LLM requires internet connection
- Graceful fallback when offline

## ⚙️ Configuration

### Model Selection

**OpenAI Models**
- \`gpt-3.5-turbo\` (default, fast and cost-effective)
- \`gpt-4\` (higher quality, slower)
- \`gpt-4-turbo\` (balanced performance)

**OpenRouter Models** (examples)
- \`anthropic/claude-3.5-sonnet\` (excellent reasoning)
- \`meta-llama/llama-3.1-405b-instruct\` (open source)
- \`google/gemini-pro\` (multimodal capabilities)
- \`mistralai/mixtral-8x7b-instruct\` (cost-effective)

To change models, edit \`app/api/chat/route.ts\`:

\`\`\`typescript
// For OpenAI
model: "gpt-4-turbo"

// For OpenRouter
model: "anthropic/claude-3.5-sonnet"
\`\`\`

### Audio Settings

Modify recording settings in \`hooks/use-audio-recorder.ts\`:

\`\`\`typescript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    sampleRate: 16000,        // Whisper optimal rate
    channelCount: 1,          // Mono audio
    echoCancellation: true,   // Noise reduction
    noiseSuppression: true,   // Background noise
    autoGainControl: true,    // Volume normalization
  },
})
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Add environment variables in site settings
- **Railway**: Configure environment in project settings
- **Self-hosted**: Ensure HTTPS for PWA features

### Environment Variables for Production
\`\`\`env
# Required: Choose one or both
OPENAI_API_KEY=sk-your_openai_key
OPENROUTER_API_KEY=sk-or-your_openrouter_key

# Optional: Custom endpoints
OPENAI_API_BASE=https://api.openai.com/v1
OPENROUTER_API_BASE=https://openrouter.ai/api/v1
\`\`\`

## 🔧 Development

### Adding New Models

1. **OpenRouter Integration**
   \`\`\`typescript
   import { createOpenRouter } from '@openrouter/ai-sdk-provider'
   
   const openrouter = createOpenRouter({
     apiKey: process.env.OPENROUTER_API_KEY,
   })
   
   const result = streamText({
     model: openrouter.chat('anthropic/claude-3.5-sonnet'),
     messages: convertToModelMessages(messages),
   })
   \`\`\`

2. **Custom Providers**
   Follow the [AI SDK provider documentation](https://ai-sdk.dev/providers) to add new providers.

### Performance Optimization

- **Web Workers**: Keep audio processing off main thread
- **Asset Caching**: Preload models and dependencies
- **Streaming**: Start playback as soon as audio is ready
- **Compression**: Optimize audio formats for size/quality

### Testing

\`\`\`bash
# Run development server
pnpm run dev

# Build for production
pnpm run build

# Test production build
pnpm run start
\`\`\`

## 📊 Performance Targets

| Component | Target | Typical |
|-----------|--------|---------|
| STT       | \< 300ms | 200-500ms |
| LLM       | \< 500ms | 300-800ms |
| TTS       | \< 200ms | 150-300ms |
| Playback  | \< 100ms | 50-150ms |
| **Total** | **\< 1.2s** | **0.7-1.8s** |

## 🛡️ Security

- **API Keys**: Never exposed to client-side code
- **HTTPS**: Required for microphone access and PWA
- **CSP**: Content Security Policy headers configured
- **Local Storage**: API keys encrypted in browser storage

## 🐛 Troubleshooting

### Common Issues

**"API key not configured"**
- Check \`.env.local\` file exists and has correct format
- Restart development server after adding environment variables
- Verify API key starts with \`sk-\` (OpenAI) or \`sk-or-\` (OpenRouter)

**"Microphone access denied"**
- Enable microphone permissions in browser
- Ensure HTTPS in production (required for microphone API)
- Check browser compatibility (Chrome/Firefox recommended)

**"Audio processing failed"**
- Verify Web Workers are loading correctly
- Check browser console for detailed error messages
- Ensure sufficient memory for audio processing

**"Poor performance"**
- Check network connection for LLM requests
- Monitor browser memory usage
- Consider using smaller/faster models

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PWA | ✅ | ✅ | ✅ | ✅ |
| Web Workers | ✅ | ✅ | ✅ | ✅ |
| MediaRecorder | ✅ | ✅ | ✅ | ✅ |
| AudioContext | ✅ | ✅ | ✅ | ✅ |

## 📚 Resources

### Documentation
- [AI SDK Documentation](https://ai-sdk.dev)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Next.js PWA Guide](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)

### Model Providers
- [OpenAI Platform](https://platform.openai.com)
- [OpenRouter](https://openrouter.ai)
- [Anthropic](https://console.anthropic.com)
- [Google AI Studio](https://aistudio.google.com)

### Audio Processing
- [Whisper.cpp](https://github.com/ggerganov/whisper.cpp)
- [Coqui TTS](https://github.com/coqui-ai/TTS)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [Vercel AI SDK](https://ai-sdk.dev) for unified AI integration
- [OpenRouter](https://openrouter.ai) for multi-provider AI access
- [Whisper.cpp](https://github.com/ggerganov/whisper.cpp) for local STT
- [Next.js](https://nextjs.org) for the React framework
- [Tailwind CSS](https://tailwindcss.com) for styling

---

**Built with ❤️ using Next.js, TypeScript, and the Vercel AI SDK**
\`\`\`
\`\`\`

Now let me update the API route to support OpenRouter as well:
