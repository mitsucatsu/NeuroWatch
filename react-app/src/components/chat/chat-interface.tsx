"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useChat } from "ai/react"
import { Bot, User, Paperclip, SendHorizontal, Mic } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { VideoGrid } from "../VideoGrid"

// Message component for displaying chat messages
function ChatMessage({
  message,
  isUser,
}: {
  message: { id: string; role: string; content: string }
  isUser: boolean
}) {
  return (
    <div className={cn("flex w-full items-start gap-4 p-4", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "flex-1 rounded-lg px-4 py-2 shadow-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

export function ChatInterface({
  setDisplayContent,
}: {
  setDisplayContent: (content: React.ReactNode, title?: string) => void
}) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Using the useChat hook from ai/react
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat", // This would be your actual API endpoint
    onResponse: (response) => {
      // Check if the message contains video-related content
      if (input.toLowerCase().includes("video")) {
        setDisplayContent(<VideoGrid />, "Video Playback")
      }
    },
  })

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === "") return
    handleSubmit(e)

    // Focus the input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
    if (inputRef.current) {
      inputRef.current.style.height = "24px"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-neutral-800 bg-[hsl(var(--v0-chat-bg))]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold mb-4">How can I assist with surveillance?</h1>
            <p className="text-neutral-400 max-w-md">
            Ask me to help analyze CCTV footage, summarize key events, and enhance security monitoring with AI-powered insights. I can also assist with video retrieval, anomaly detection, and more.            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} isUser={message.role === "user"} />
            ))}
          </div>
        )}
      </div>

      {/* Chat input */}
      <div className="border-t border-neutral-800 p-4">
        <form onSubmit={onSubmit} className="flex flex-col space-y-2">
          <div className="relative">
            <Textarea
              ref={inputRef}
              tabIndex={0}
              placeholder="Ask a follow up..."
              className="min-h-[24px] w-full resize-none bg-transparent border-none shadow-none outline-none text-neutral-300 placeholder:text-neutral-600 py-3 pr-20 max-h-32"
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
              }}
              rows={1}
            />
            <div className="absolute bottom-1 right-1 flex items-center space-x-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-neutral-500 hover:text-neutral-300"
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Attach file</span>
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-neutral-500 hover:text-neutral-300"
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">Voice input</span>
              </Button>
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full",
                  input.trim()
                    ? "bg-neutral-700 text-white hover:bg-neutral-600"
                    : "bg-neutral-800 text-neutral-600 cursor-not-allowed",
                )}
                disabled={input.trim() === "" || isLoading}
              >
                <SendHorizontal className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
          <p className="text-xs text-neutral-600">v0 may make mistakes. Please use with discretion.</p>
        </form>
      </div>
    </div>
  )
}

