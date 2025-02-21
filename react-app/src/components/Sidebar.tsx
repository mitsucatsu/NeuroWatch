import React, { useState } from "react";
import { Calendar } from "./calendar";

interface SidebarProps {
  toggleCamera: (cameraIndex: number) => void;
  togglePlaybackControls: (cameraIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleCamera, togglePlaybackControls }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [cameraState, setCameraState] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const [playbackState, setPlaybackState] = useState<{ [key: number]: boolean }>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const handleCameraToggle = (i: number) => {
    setCameraState((prev) => ({ ...prev, [i]: !prev[i] }));
    toggleCamera(i);
  };

  const handlePlaybackToggle = (i: number) => {
    setPlaybackState((prev) => ({ ...prev, [i]: !prev[i] }));
    togglePlaybackControls(i);
  };

  return (
    <div className="sidebar">
      {/* Cameras Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Cameras</h3>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value={`cam${i}`}
                  checked={cameraState[i]}
                  className="mr-2"
                  onChange={() => handleCameraToggle(i)}
                />
                CAM {i}
              </label>
              <ul id={`cam${i}-playlists`} className="ml-4 text-sm"></ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Section */}
      <div className="calendar-container">
        <h2 className="text-white mb-2 text-sm font-medium">Calendar</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="calendar"
        />
      </div>

      {/* Playback Controls Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Hide Playback Controls</h3>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i}>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id={`cam${i}-controls-toggle`}
                  className="mr-2"
                  checked={playbackState[i]}
                  onChange={() => handlePlaybackToggle(i)}
                />
                CAM {i} Controls
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
