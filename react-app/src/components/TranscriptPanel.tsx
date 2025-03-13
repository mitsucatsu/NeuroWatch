"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../lib/utils"

type TranscriptEntry = {
  timestamp: string
  text: string
  time: number // in seconds
}

export function TranscriptPanel() {
  const [entries] = useState<TranscriptEntry[]>([
    { timestamp: "00:10", text: "Sample caption text 1", time: 10 },
    { timestamp: "00:16", text: "Sample caption text 2", time: 16 },
    { timestamp: "00:19", text: "Sample caption text 3", time: 19 },
    { timestamp: "00:22", text: "Sample caption text 4", time: 22 },
  ])

  const [currentTime] = useState(22) // This would be synced with video in a real implementation
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="bg-neutral-900 border-t border-neutral-800">
      {/* Header with toggle button */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-sm font-medium text-neutral-300">Transcript</h3>
        <button className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200">
          {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Collapsible content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isCollapsed ? "max-h-0" : "max-h-[200px]",
        )}
      >
        <div className="overflow-y-auto max-h-[200px]">
          {entries.map((entry) => (
            <div
              key={entry.timestamp}
              className={cn(
                "flex gap-4 px-4 py-3 hover:bg-neutral-800/50 cursor-pointer font-mono text-sm",
                currentTime >= entry.time &&
                  currentTime < (entries[entries.indexOf(entry) + 1]?.time || Number.POSITIVE_INFINITY)
                  ? "bg-neutral-800"
                  : "bg-transparent",
              )}
            >
              <span className="text-blue-400 flex-shrink-0">{entry.timestamp}</span>
              <span className="text-neutral-300">{entry.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

