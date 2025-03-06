import React from "react";

const VideoGrid: React.FC = () => {
  return (
    <div id="video-grid" className="flex-1 min-w-0 grid auto-rows-fr gap-4 p-4 bg-black transition-all duration-300">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="relative w-full h-full bg-gray-600">
          <video id={`video-${i}`} className="w-full h-full object-cover" controls></video>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
