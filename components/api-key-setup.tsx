"use client"

import { useState } from "react"
import { Key, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ApiKeySetup() {
  const [showSetup, setShowSetup] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "testing" | "success" | "error">("idle")

  const testApiConnection = async () => {
    setTestResult("testing")

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Hello, this is a test." }),
      })

      if (response.ok) {
        setTestResult("success")
      } else {
        setTestResult("error")
      }
    } catch (error) {
      setTestResult("error")
    }
  }

  if (!showSetup) {
    return (
      <div className="text-center mb-4">
        <Button variant="outline" onClick={() => setShowSetup(true)} className="text-sm">
          <Key className="w-4 h-4 mr-2" />
          API Configuration
        </Button>
      </div>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Key className="w-5 h-5 mr-2" />
          OpenAI API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>
              Get your API key from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                OpenAI Platform
              </a>
            </li>
            <li>
              Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file in your project root
            </li>
            <li>
              Add: <code className="bg-blue-100 px-1 rounded">OPENAI_API_KEY=your_key_here</code>
            </li>
            <li>Restart your development server</li>
          </ol>
        </div>

        <div className="flex gap-2">
          <Button onClick={testApiConnection} disabled={testResult === "testing"}>
            {testResult === "testing" ? "Testing..." : "Test Connection"}
          </Button>
          <Button variant="outline" onClick={() => setShowSetup(false)}>
            Close
          </Button>
        </div>

        {testResult === "success" && (
          <div className="flex items-center text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5 mr-2" />
            API connection successful! You're ready to use the speech assistant.
          </div>
        )}

        {testResult === "error" && (
          <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5 mr-2" />
            API connection failed. Please check your API key configuration.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
