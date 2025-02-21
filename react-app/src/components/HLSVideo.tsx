import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

interface HLSVideoProps {
  cameraIndex: number;
  onVideoElementCreated?: (
    cameraIndex: number,
    videoElement: HTMLVideoElement
  ) => void;
  visible?: boolean;
  controls?: boolean;
}

const HLSVideo: React.FC<HLSVideoProps> = ({
  cameraIndex,
  onVideoElementCreated,
  visible = true,
  controls = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && onVideoElementCreated) {
      onVideoElementCreated(cameraIndex, videoRef.current);
    }
  }, [cameraIndex, onVideoElementCreated]);

  return (
    <div className={`w-full h-full ${visible ? "block" : "none"}`}>
      <video
        ref={videoRef}
        id={`video-${cameraIndex}`}
        className="w-full h-full"
        controls={controls}
      />
    </div>
  );
};

export default HLSVideo;
