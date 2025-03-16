import React from "react";
import { TranscriptPanel } from "./TranscriptPanel"; // Import the transcript panel

const VideoGrid: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {/* Video Grid (Takes up most of the space) */}
      <div
        id="video-grid"
        className="flex-1 grid auto-rows-fr gap-4 p-4 bg-black transition-all duration-300"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative w-full h-full bg-gray-600">
            <video
              id={`video-${i}`}
              className="w-full h-full object-cover"
              controls
            ></video>
          </div>
        ))}
      </div>

      {/* Transcript Panel (At the bottom) */}
      <div className="flex-shrink-0">
      <TranscriptPanel />
    </div>
    </div>
  );
};

export default VideoGrid;
