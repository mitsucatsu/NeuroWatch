"use client"

import * as React from "react"
import { Smile } from "lucide-react"
import { useChatStore } from "../lib/store"

import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../components/ui/tooltip"
import { useState } from "react"

export function Chat() {
  const [message, setMessage] = useState("")
  const isChatOpen = useChatStore((state) => state.isChatOpen)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    // Handle message submission here
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  if (!isChatOpen) return null

  return (
    <TooltipProvider>
      <div className="w-[400px] animate-in slide-in-from-left duration-300 ease-in-out">
        <div className="rounded-lg border bg-card">
          <div className="flex h-[calc(100vh-theme(spacing.16)-theme(spacing.8))] flex-col">
            <div className="flex-1 space-y-4 overflow-auto p-4">
              <div className="flex min-h-[200px] items-center justify-center text-center text-sm text-muted-foreground">
                👉 Add a video by clicking the @ button in the chat input on the bottom left.
              </div>
            </div>
            <div className="border-t bg-card p-4">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-9 w-9">
                      <Smile className="h-5 w-5" />
                      <span className="sr-only">Add emoji</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add emoji</TooltipContent>
                </Tooltip>
                <div className="relative flex-1">
                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type something"
                    className="min-h-0 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                    rows={1}
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="submit" size="sm" className="h-9 px-3">
                      Run
                      <kbd className="ml-2 text-xs">⌘⏎</kbd>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send message</TooltipContent>
                </Tooltip>
              </form>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

