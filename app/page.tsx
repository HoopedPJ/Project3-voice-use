import { SpeechAssistant } from "@/components/speech-assistant"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { OfflineStatus } from "@/components/offline-status"
import { ApiKeySetup } from "@/components/api-key-setup"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Offline Speech AI Assistant</h1>
          <p className="text-gray-600 mb-4">Local speech processing with AI integration</p>
          <OfflineStatus />
        </header>

        <div className="max-w-4xl mx-auto">
          <ApiKeySetup />
          <SpeechAssistant />
          <PerformanceMonitor />
        </div>
      </div>
    </main>
  )
}
