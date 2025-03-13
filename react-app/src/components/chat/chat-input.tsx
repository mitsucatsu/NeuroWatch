"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Paperclip, SendHorizontal, Mic } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading?: boolean
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "24px"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
    }
  }, [input])

  // Custom handler for textarea changes
  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)
  }

  return (
    <div className="p-4 border-t bg-background/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2 max-w-3xl mx-auto">
        <div
          className={cn(
            "flex items-end w-full rounded-lg border bg-background px-3 py-2 focus-within:ring-1 focus-within:ring-ring",
            isFocused ? "ring-1 ring-ring" : "",
          )}
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            placeholder="Ask AI..."
            className="min-h-[24px] w-full resize-none bg-transparent border-0 p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={input}
            onChange={onTextareaChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
              }
            }}
            rows={1}
          />
          <div className="flex items-end h-full space-x-1 py-2 pl-2">
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8">
              <Mic className="h-4 w-4" />
              <span className="sr-only">Voice input</span>
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={input.trim() === "" || isLoading}
              className="h-8 w-8 bg-primary text-primary-foreground"
            >
              <SendHorizontal className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center">v0 may make mistakes. Please use with discretion.</p>
      </form>
    </div>
  )
}

