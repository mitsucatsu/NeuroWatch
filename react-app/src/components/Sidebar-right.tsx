import React, { useState } from "react";
import { Calendar } from "./calendar";
import { FaCamera, FaCalendarAlt, FaVideo, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface SidebarProps {
  toggleCamera: (cameraIndex: number) => void;
  togglePlaybackControls: (cameraIndex: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleCamera, togglePlaybackControls }) => {
  const [isOpen, setIsOpen] = useState(true);
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
    <div className={`sidebar-right ${isOpen ? "expanded" : "collapsed"}`}>

      {/* Toggle Button */}
      <button
        className="text-white mb-4 p-2 bg-gray-700 rounded hover:bg-gray-600 self-end"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Cameras Section */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${isOpen ? "block" : "hidden"}`}>Cameras</h3>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center mb-2">
              <FaCamera className="mr-2" />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value={`cam${i}`}
                  checked={cameraState[i]}
                  className="mr-2"
                  onChange={() => handleCameraToggle(i)}
                />
                <span className={`${isOpen ? "block" : "hidden"}`}>CAM {i}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Calendar Section */}
      <div className="calendar-container mb-6">
        <h2 className={`text-white mb-2 text-sm font-medium ${isOpen ? "block" : "hidden"}`}>Calendar</h2>
        <FaCalendarAlt className={`mr-2 ${isOpen ? "hidden" : "block"}`} />
        {isOpen && (
          <Calendar mode="single" selected={date} onSelect={setDate} className="calendar" />
        )}
      </div>

      {/* Playback Controls Section */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-2 ${isOpen ? "block" : "hidden"}`}>Playback Controls</h3>
        <ul>
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center mb-2">
              <FaVideo className="mr-2" />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id={`cam${i}-controls-toggle`}
                  className="mr-2"
                  checked={playbackState[i]}
                  onChange={() => handlePlaybackToggle(i)}
                />
                <span className={`${isOpen ? "block" : "hidden"}`}>CAM {i} Controls</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
