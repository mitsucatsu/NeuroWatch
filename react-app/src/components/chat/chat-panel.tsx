"use client"

import type React from "react"

import { useState } from "react"
import { MessageList } from "../../components/chat/message-list"
import { ChatInput } from "../../components/chat/chat-input"
import  VideoGrid  from "../../components/VideoGrid"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ChatPanelProps {
  setDisplayContent: (content: React.ReactNode, title?: string) => void
}

export function ChatPanel({ setDisplayContent }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Check if message contains "video" and update main content
    if (input.toLowerCase().includes("video")) {
      setDisplayContent(<VideoGrid />, "Video Playback")
    }

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: input.toLowerCase().includes("video")
          ? "I've displayed a video grid in the preview panel. You can view up to 4 videos simultaneously."
          : `This is a response to your message: "${input}"`,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="chat-panel">
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}

