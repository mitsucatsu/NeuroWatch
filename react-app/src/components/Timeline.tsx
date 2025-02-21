import React from "react";

const Timeline: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 relative">
      <div className="timeline-playhead"></div>
      <div id="timeline-tracks" className="flex flex-col gap-2"></div>
    </div>
  );
};

export default Timeline;
