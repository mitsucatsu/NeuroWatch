"use client"

import { Clock, Download, Copy } from "lucide-react"
import { cn } from "../lib/utils"

export function TranscriptPanel() {
  // Sample transcript data
  const segments = [
    {
      id: "1",
      start: 0,
      text: "Welcome to this video demonstration of our new product.",
      speaker: "Speaker 1",
    },
    {
      id: "2",
      start: 5,
      text: "Today we'll be looking at the key features and benefits.",
      speaker: "Speaker 1",
    },
    {
      id: "3",
      start: 10,
      text: "First, let's talk about the user interface.",
      speaker: "Speaker 1",
    },
    {
      id: "4",
      start: 15,
      text: "As you can see, we've completely redesigned it for better usability.",
      speaker: "Speaker 1",
    },
    {
      id: "5",
      start: 20,
      text: "The navigation is now much more intuitive.",
      speaker: "Speaker 2",
    },
    {
      id: "6",
      start: 25,
      text: "Users can easily find what they're looking for without any training.",
      speaker: "Speaker 2",
    },
    {
      id: "7",
      start: 30,
      text: "Next, let's look at performance improvements.",
      speaker: "Speaker 1",
    },
    {
      id: "8",
      start: 35,
      text: "We've optimized the backend to handle more concurrent users.",
      speaker: "Speaker 1",
    },
  ]

  // Format time (seconds) to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="transcript-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <h3 className="text-sm font-medium text-neutral-300">Transcript</h3>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
            title="Copy transcript"
          >
            <Copy size={16} />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200"
            title="Download transcript"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Transcript segments */}
      <div className="overflow-y-auto max-h-[440px] custom-scrollbar">
        {segments.map((segment, index) => (
          <div
            key={segment.id}
            className={cn(
              "flex gap-3 px-4 py-3 hover:bg-neutral-800/50 cursor-pointer transition-colors",
              index === 4
                ? "bg-neutral-800 border-l-2 border-blue-500 transcript-segment-active"
                : "border-l-2 border-transparent",
            )}
          >
            <div className="flex-shrink-0 text-blue-400 font-mono text-xs flex items-center gap-1 pt-0.5">
              <Clock size={12} />
              <span>{formatTime(segment.start)}</span>
            </div>
            <div className="flex-1">
              {segment.speaker && <div className="text-xs font-semibold text-neutral-400 mb-1">{segment.speaker}</div>}
              <p className="text-sm text-neutral-300">{segment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

