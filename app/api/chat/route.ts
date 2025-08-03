import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    const baseUrl = process.env.OPENAI_API_BASE || "https://openrouter.ai/api/v1"

    if (!apiKey) {
      console.error("OpenRouter API key not configured")
      return NextResponse.json(
        {
          error: "API key not configured. Please add OPENAI_API_KEY to your .env.local file.",
          fallbackReply: "AI service is currently unavailable. Please check your configuration.",
        },
        { status: 500 },
      )
    }

    console.log("Making request to OpenRouter API...")

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // CHANGE THIS in production
        "X-Title": "Offline Voice Assistant",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // OpenRouter requires model ID with provider
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant. Keep responses concise and conversational, under 100 words.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error(`OpenRouter API error: ${response.status}`, errorData)

      let errorMessage = "Failed to get AI response"
      let fallbackReply = "I'm having trouble connecting to the AI service right now. Please try again later."

      if (response.status === 401) {
        errorMessage = "Invalid API key"
        fallbackReply = "The API key is invalid. Please check your configuration."
      } else if (response.status === 429) {
        errorMessage = "Rate limit exceeded"
        fallbackReply = "Too many requests right now. Please wait a moment and try again."
      } else if (response.status === 500) {
        errorMessage = "OpenRouter service error"
        fallbackReply = "The AI service is experiencing issues. Please try again soon."
      }

      return NextResponse.json(
        {
          error: errorMessage,
          fallbackReply: fallbackReply,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    const reply = data.choices[0]?.message?.content || "Sorry, I could not process that."

    console.log("OpenRouter API response received successfully")
    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process chat request",
        fallbackReply: "I'm experiencing technical difficulties. Please try again later.",
      },
      { status: 500 },
    )
  }
}
