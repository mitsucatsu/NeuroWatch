import React from "react";

const VideoGrid: React.FC = () => {
  return (
    <div id="video-grid" className="flex-1 grid gap-4 p-4 bg-black">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="w-full h-full bg-gray-600 relative">
          <video id={`video-${i}`} className="w-full h-full" controls></video>
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
