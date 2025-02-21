import React, { useState, useEffect, useRef, use } from "react";
import Hls from "hls.js"; // Import Hls.js
import Header from "./components/Header";
import VideoGrid from "./components/VideoGrid";
import Sidebar from "./components/Sidebar";
import Slider from "./components/Slider";
import Timeline from "./components/Timeline";
import { debounce } from "lodash";
//last change
const App: React.FC = () => {
  const [masterVideo, setMasterVideo] = useState<HTMLVideoElement | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [syncInterval, setSyncInterval] = useState<NodeJS.Timeout | null>(null);
  const [hlsInstances, setHlsInstances] = useState<{ [key: number]: any }>({});
  const [today, setToday] = useState<string>("");
  const sliderRef = useRef<HTMLInputElement>(null);
  const masterVideoSet = useRef(false);

  useEffect(() => {
    const todayDate = new Date().toLocaleDateString("en-CA", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    console.log(`Setting today's date: ${todayDate}`);
    setToday(todayDate);
  }, []);

  useEffect(() => {
    if (today) {
      console.log(`Today's date: ${today}`);
      updateGridLayout(1);
      initializeCamerasForDate(today);
    }
  }, [today]);

  const updateGridLayout = (selectedLayout: number) => {
    const videoGrid = document.getElementById("video-grid");
    if (videoGrid) {
      videoGrid.style.gridTemplateColumns = `repeat(${selectedLayout}, 1fr)`;
      videoGrid.style.gridTemplateRows = `repeat(${selectedLayout}, 1fr)`;
    }
  };

  const debouncedHandleSliderChange = debounce((value: number) => {
    syncVideosToTime(value, today);
  }, 100); // Adjust the delay as needed

  const syncVideosToTime = (currentTime: number, today: string) => {
    // Parse today (YYYY-MM-DD) into a local Date object
    const [year, month, day] = today.split("-").map(Number);

    // Create a Date object at midnight in local time
    const date = new Date(year, month - 1, day, 0, 0, 0, 0);

    // Add the milliseconds from currentTime (treating it as ms since midnight)
    date.setMilliseconds(date.getMilliseconds() + currentTime);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", date);
      return;
    }
    seekToProgramDateTime(date);
    // updateTimelinePlayhead(currentTime / 1000); // Convert milliseconds to seconds for the timeline
  };

  const seekToProgramDateTime = async (selectedDate: Date) => {
    const seekToFragment = (
      hls: any,
      videoElement: HTMLVideoElement,
      selectedDate: Date
    ) => {
      if (!hls.levels || !hls.levels[hls.currentLevel]) {
        console.error("HLS levels or current level is not available.");
        return;
      }

      const fragments = hls.levels[hls.currentLevel].details.fragments;
      if (!fragments) {
        console.error("HLS fragments are not available.");
        return;
      }

      let closestFragment = null;
      let minDiff = Infinity;
      fragments.forEach((fragment: any) => {
        const fragDate = new Date(fragment.programDateTime);
        const diff = Math.abs(fragDate - selectedDate);
        if (diff < minDiff) {
          minDiff = diff;
          closestFragment = fragment;
        }
      });

      if (closestFragment) {
        videoElement.currentTime = closestFragment.start;
      }
    };

    const loadPlaylistAndSeek = async (
      cameraIndex: number,
      selectedDate: Date
    ) => {
      const playlistUrls = await getRecordingsForDate(
        cameraIndex,
        selectedDate.toLocaleDateString("en-CA", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );
      if (playlistUrls.length === 0) {
        console.error(
          `No recordings found for Camera ${cameraIndex} on ${
            selectedDate.toISOString().split("T")[0]
          }`
        );
        return;
      }

      let closestPlaylistUrl = null;
      let minDiff = Infinity;

      playlistUrls.forEach((url) => {
        const match = url.match(/(\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2})/);
        if (match) {
          const [datePart, timePart] = match[1].split("_"); // Split date and time
          const [year, month, day] = datePart.split("-").map(Number);
          const [hours, minutes, seconds] = timePart.split("-").map(Number);

          const urlDate = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            seconds
          );
          const nextHourDate = new Date(urlDate);
          nextHourDate.setHours(nextHourDate.getHours() + 1);

          // Check if selectedDate is within the range of urlDate and nextHourDate
          if (selectedDate >= urlDate && selectedDate < nextHourDate) {
            const diff = Math.abs(urlDate - selectedDate);
            if (diff < minDiff) {
              minDiff = diff;
              closestPlaylistUrl = url;
            }
          }
        }
      });

      if (closestPlaylistUrl) {
        const hls = hlsInstances[cameraIndex];
        const videoElement = document.getElementById(
          `video-${cameraIndex}`
        ) as HTMLVideoElement;
        if (hls.url !== closestPlaylistUrl) {
          hls.loadSource(closestPlaylistUrl);
          hls.attachMedia(videoElement);
        }
        videoElement.play().catch(console.error); // Play the video element

        seekToFragment(hls, videoElement, selectedDate);
      }
    };

    Object.keys(hlsInstances).forEach((key) => {
      loadPlaylistAndSeek(Number(key), selectedDate);
    });
  };

  const toggleCamera = (cameraIndex: number) => {
    const videoElement = document.getElementById(
      `video-${cameraIndex}`
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.style.display =
        videoElement.style.display === "none" ? "block" : "none";

      if (
        videoElement === masterVideo &&
        videoElement.style.display === "none"
      ) {
        const firstVisibleVideo = document.querySelector(
          'video:not([style*="display: none"])'
        ) as HTMLVideoElement;
        if (firstVisibleVideo) {
          setMasterVideo(firstVisibleVideo);
        }
      }
    }
  };

  const togglePlaybackControls = (cameraIndex: number) => {
    const videoElement = document.getElementById(
      `video-${cameraIndex}`
    ) as HTMLVideoElement;
    const checkbox = document.getElementById(
      `cam${cameraIndex}-controls-toggle`
    ) as HTMLInputElement;

    if (checkbox.checked) {
      videoElement.removeAttribute("controls");
      if (videoElement === masterVideo) {
        const firstVisibleVideo = document.querySelector(
          'video:not([style*="display: none"])'
        ) as HTMLVideoElement;
        if (firstVisibleVideo) {
          setMasterVideo(firstVisibleVideo);
        }
      }
    } else {
      if (!masterVideo) setMasterVideo(videoElement);
      videoElement.setAttribute("controls", "true");
    }
  };

  const initializeSyncController = () => {
    if (masterVideo) {
      console.log("Initializing sync controller for master video");
      masterVideo.controls = true;
      masterVideo.addEventListener("play", syncPlay);
      masterVideo.addEventListener("pause", syncPause);
      masterVideo.addEventListener("seeked", syncSeek);
      masterVideo.addEventListener("ratechange", syncPlaybackRate);

      const interval = setInterval(syncVideos, 500);
      setSyncInterval(interval);
    } else {
      console.error("Master video is not set in initializeSyncController");
    }
  };

  const syncPlay = () => {
    if (isSyncing) return;
    setIsSyncing(true);

    const currentTime = masterVideo?.currentTime || 0;
    document.querySelectorAll("video").forEach((video) => {
      if (video !== masterVideo && !video.paused) video.pause();
      video.currentTime = currentTime;
      video.playbackRate = playbackRate;
      video.play().catch(console.error);
    });
    setIsSyncing(false);
  };

  const syncPause = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    document.querySelectorAll("video").forEach((video) => {
      if (video !== masterVideo && !video.paused) video.pause();
    });
    setIsSyncing(false);
  };

  const syncSeek = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    const currentTime = masterVideo?.currentTime || 0;
    document.querySelectorAll("video").forEach((video) => {
      if (video !== masterVideo) video.currentTime = currentTime;
    });
    setIsSyncing(false);
    updateTimelinePlayhead(currentTime);
  };

  const syncPlaybackRate = () => {
    setPlaybackRate(masterVideo?.playbackRate || 1);
    document.querySelectorAll("video").forEach((video) => {
      video.playbackRate = playbackRate;
    });
  };

  const syncVideos = () => {
    if (isSyncing || !masterVideo || masterVideo.paused) return;

    const currentTime = masterVideo.currentTime;
    const tolerance = 0.1;

    document.querySelectorAll("video").forEach((video) => {
      if (video === masterVideo) return;

      if (Math.abs(video.currentTime - currentTime) > tolerance) {
        video.currentTime = currentTime;
      }

      if (video.paused) {
        video.play().catch(console.error);
      }
    });

    updateTimelinePlayhead(currentTime);
  };

  const updateTimelinePlayhead = (currentTime: number) => {
    const timeline = document.querySelector(
      ".timeline-playhead"
    ) as HTMLDivElement;
    const timelineWidth =
      document.querySelector("#timeline-tracks")?.clientWidth || 1;
    const duration = masterVideo?.duration || 1;

    const position = (currentTime / duration) * timelineWidth;
    timeline.style.left = `${position}px`;
  };

  const initializeCamerasForDate = async (date: string) => {
    for (let i = 1; i <= 4; i++) {
      const playlistUrls = await getRecordingsForDate(i, date);
      if (playlistUrls.length > 0) {
        initializeHlsPlayback(i, playlistUrls);
      }
    }
  };

  const getRecordingsForDate = async (
    cameraIndex: number,
    date: string
  ): Promise<string[]> => {
    try {
      const response = await fetch(
        `http://localhost:8000/recordings/cam${cameraIndex}/`
      );
      const text = await response.text();
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(text, "text/html");
      // console.log("getRecordingsforDate:", date);
      const links = Array.from(htmlDoc.querySelectorAll("a"));
      const directories = links
        .map((a) => a.textContent.trim())
        .filter((name) => name.startsWith(date))
        .map((name) => name.replace(/\/$/, ""))
        .sort();

      return directories.map(
        (dir) =>
          `http://localhost:8000/recordings/cam${cameraIndex}/${dir}/playlist.m3u8`
      );
    } catch (error) {
      console.error(
        `Error fetching recordings for Camera ${cameraIndex}:`,
        error
      );
      return [];
    }
  };

  const initializeHlsPlayback = async (
    cameraIndex: number,
    playlistUrls: string[]
  ) => {
    const videoElement = document.getElementById(
      `video-${cameraIndex}`
    ) as HTMLVideoElement;
    const hls = new Hls({
      enableWorker: true,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
    });

    let currentIndex = 0;

    const loadPlaylist = async (index: number) => {
      hls.loadSource(playlistUrls[index]);
      hls.attachMedia(videoElement);

      // Fetch and display the duration of the playlist
      const duration = await fetchPlaylistDuration(playlistUrls[index]);
      const listItem = document.createElement("li");
      listItem.textContent = `${playlistUrls[index]} - ${duration} seconds`;
      listItem.style.cursor = "pointer";
      listItem.onclick = () => {
        console.log(hls.url, playlistUrls[index]);
        if (hls.url !== playlistUrls[index]) {
          hls.loadSource(playlistUrls[index]);
          hls.attachMedia(videoElement);
          videoElement.play().catch(console.error);
        }
      };
      document
        .getElementById(`cam${cameraIndex}-playlists`)
        ?.appendChild(listItem);
    };

    videoElement.addEventListener("ended", () => {
      currentIndex++;
      if (currentIndex < playlistUrls.length) {
        loadPlaylist(currentIndex); // Load next video on end
      }
    });

    loadPlaylist(currentIndex); // Start with the first video

    setHlsInstances((prev) => ({ ...prev, [cameraIndex]: hls }));

    // Set the first video as the master video
    if (!masterVideoSet.current) {
      console.log(`Setting master video to camera ${cameraIndex}`);
      setMasterVideo(videoElement);
      masterVideoSet.current = true;
    }
  };

  const fetchPlaylistDuration = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const text = await response.text();
      const lines = text.split("\n");
      let duration = 0;

      lines.forEach((line) => {
        if (line.startsWith("#EXTINF:")) {
          const lineDuration = parseFloat(line.split(":")[1]);
          duration += lineDuration;
        }
      });

      return duration.toFixed(2);
    } catch (error) {
      console.error(`Error fetching playlist duration for ${url}:`, error);
      return "Unknown";
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header updateGridLayout={updateGridLayout} />
      <div className="flex flex-1">
        <VideoGrid />
        <Sidebar
          toggleCamera={toggleCamera}
          togglePlaybackControls={togglePlaybackControls}
        />
      </div>
      <button onClick={() => masterVideo?.play()}>Play</button>
      <Slider ref={sliderRef} onValueChange={debouncedHandleSliderChange} />
      <Timeline />
    </div>
  );
};

export default App;
