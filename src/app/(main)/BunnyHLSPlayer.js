"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
// Memoize the signed URL function outside the component
const getSignedUrl = async (baseUrl) => {
  try {
    const response = await fetch("/api/bunny-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: baseUrl }),
    });
    const data = await response.json();
    return data.signedUrl;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw error;
  }
};

const BunnyHLSPlayer = ({
  src = "",
  autoPlay = false,
  controls = true,
  poster = null,
  token = null,
  expires = null,
  muted = true,
  securityKey = null,
  startLevel = 5,
  videoPlayerStyle,
}) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  // State that triggers re-renders
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [signedUrl, setSignedUrl] = useState(`${src}/playlist.m3u8`);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [qualities, setQualities] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isHlsJs, setIsHlsJs] = useState(false);

  // Refs for values that don't need re-renders
  const isFullscreenRef = useRef(false);
  const mountedRef = useRef(true);

  // Memoized callback functions
  const generateSignedUrl = useCallback(
    async (baseUrl, token, expires, securityKey) => {
      if (!token || !expires) return baseUrl;

      try {
        const signed = await getSignedUrl(baseUrl);
        return signed;
      } catch (error) {
        console.error("Error generating signed URL:", error);
        return baseUrl;
      }
    },
    []
  );

  // Format time helper (memoized).
  const formatTime = useCallback((time) => {
    if (!time || isNaN(time) || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // Current quality label (memoized).
  const currentQualityLabel = useCallback(() => {
    if (selectedQuality === null) return "";
    if (selectedQuality === -1) return "Auto";
    const q = qualities.find((qq) => qq.index === selectedQuality);
    return q ? q.label : `Level ${selectedQuality}`;
  }, [selectedQuality, qualities]);

  // Memoized event handlers
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleSeek = useCallback(
    (e) => {
      const video = videoRef.current;
      if (!video || !duration) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * duration;
    },
    [duration]
  );

  const handleVolumeChange = useCallback((e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const changeQuality = useCallback((index) => {
    const hls = hlsRef.current;
    if (!hls) {
      setShowQualityMenu(false);
      return;
    }

    if (index === -1) {
      hls.currentLevel = -1;
      setSelectedQuality(-1);
    } else {
      hls.currentLevel = index;
      setSelectedQuality(index);
    }
    setShowQualityMenu(false);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    // Safari-specific fullscreen detection
    const isFull =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      // iOS Safari fullscreen detection
      video.webkitDisplayingFullscreen ||
      document.webkitCurrentFullScreenElement === video;

    if (!isFull) {
      // Enter fullscreen with Safari support
      const element = container.requestFullscreen ? container : video;

      if (element.requestFullscreen) {
        element.requestFullscreen().catch(console.error);
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        // iOS Safari
        video.webkitEnterFullscreen();
      }

      isFullscreenRef.current = true;
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.error);
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (video.webkitExitFullscreen) {
        video.webkitExitFullscreen();
      }

      isFullscreenRef.current = false;
    }
  }, []);

  // Generate signed URL effect
  useEffect(() => {
    const updateSignedUrl = async () => {
      const signed = await generateSignedUrl(
        signedUrl,
        token,
        expires,
        securityKey
      );
      if (mountedRef.current) {
        setSignedUrl(signed);
      }
    };

    updateSignedUrl();
  }, [signedUrl, token, expires, securityKey, generateSignedUrl]);

  // HLS setup effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    mountedRef.current = true;

    const loadHLS = async () => {
      try {
        setIsLoading(true);

        let Hls;
        try {
          Hls = (await import("hls.js")).default;
        } catch (importError) {
          // Fallback to native HLS (Safari)
          setIsHlsJs(false);

          // Safari HLS support
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // For Safari, we need to handle the URL differently
            let safariUrl = signedUrl;

            // If it's a signed URL with tokens, Safari might need a different approach
            if (token && expires) {
              // For Safari, we might need to use a proxy or different signing method
              // This is a simplified approach - you might need to adjust based on your auth system
              safariUrl = signedUrl.includes("?")
                ? `${signedUrl}&token=${token}`
                : `${signedUrl}?token=${token}`;
            }

            video.src = safariUrl;
            video.load(); // Explicitly load for Safari

            const onLoadedMetadata = () => {
              if (mountedRef.current) setIsLoading(false);
            };

            video.addEventListener("loadedmetadata", onLoadedMetadata, {
              once: true,
            });
          } else {
            setIsLoading(false);
          }
          return;
        }

        // HLS.js is available
        if (Hls.isSupported()) {
          setIsHlsJs(true);

          const hls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: false,
            startLevel: startLevel || -1,
            capLevelToPlayerSize: true,
          });

          hlsRef.current = hls;

          hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            if (!mountedRef.current) return;

            const levels = hls.levels || [];
            const seen = new Set();
            const qualityOptions = levels
              .map((lvl, idx) => {
                const label = lvl.height
                  ? `${lvl.height}p`
                  : lvl.bitrate
                  ? `${Math.round(lvl.bitrate / 1000)} kbps`
                  : `Level ${idx}`;
                return {
                  label,
                  height: lvl.height,
                  bitrate: lvl.bitrate,
                  index: idx,
                };
              })
              .filter((item) => {
                if (seen.has(item.label)) return false;
                seen.add(item.label);
                return true;
              });

            setQualities([{ label: "Auto", index: -1 }, ...qualityOptions]);

            const initialLevel =
              typeof startLevel === "number" &&
              startLevel >= 0 &&
              startLevel < levels.length
                ? startLevel
                : -1;
            setSelectedQuality(initialLevel);
            setIsLoading(false);

            if (autoPlay && mountedRef.current) {
              video.play().catch(console.error);
            }
          });

          hls.on(Hls.Events.LEVEL_SWITCHED, () => {
            if (hlsRef.current && mountedRef.current) {
              setSelectedQuality(hls.currentLevel);
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });

          hls.attachMedia(video);
          hls.loadSource(signedUrl);
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("HLS loading error:", err);
        if (mountedRef.current) setIsLoading(false);
      }
    };

    loadHLS();

    return () => {
      mountedRef.current = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [signedUrl, autoPlay, startLevel]);

  // Video event listeners effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleCanPlay = () => setIsVideoReady(true);
    const handlePlaying = () => setIsVideoReady(true);
    const handleWaiting = () => setIsVideoReady(false);

    const events = [
      { type: "timeupdate", handler: handleTimeUpdate },
      { type: "durationchange", handler: handleDurationChange },
      { type: "play", handler: handlePlay },
      { type: "pause", handler: handlePause },
      { type: "volumechange", handler: handleVolumeChange },
      { type: "canplay", handler: handleCanPlay },
      { type: "playing", handler: handlePlaying },
      { type: "waiting", handler: handleWaiting },
    ];

    events.forEach(({ type, handler }) => {
      video.addEventListener(type, handler);
    });

    return () => {
      events.forEach(({ type, handler }) => {
        video.removeEventListener(type, handler);
      });
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      isFullscreenRef.current = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className="relative w-full h-full mx-auto bg-black  overflow-hidden shadow-lg"
    >
      <div className="relative h-full">
        <video
          ref={videoRef}
          className={`w-full h-auto ${videoPlayerStyle || ""}`}
          poster={poster}
          autoPlay={autoPlay}
          loop={true}
          muted={muted} // Required for Safari autoplay
          playsInline // Required for iOS Safari
          preload="metadata" // Better for Safari
          onClick={togglePlay}
          onContextMenu={(e) => e.preventDefault()}
        />
        {(isLoading || !isVideoReady) && (
          <div
            role="status"
            className="flex items-center justify-center h-full w-full absolute top-0 left-0  bg-dark-150 rounded-lg animate-pulse "
          >
            <div role="status">
              <svg
                className="w-8 h-8 animate-spin text-gray-600 fill-custom-red"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}

        {controls && !isLoading && isVideoReady && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
            <VideoControls
              isPlaying={isPlaying}
              isMuted={isMuted}
              volume={volume}
              currentTime={currentTime}
              duration={duration}
              isHlsJs={isHlsJs}
              qualities={qualities}
              selectedQuality={selectedQuality}
              showQualityMenu={showQualityMenu}
              isFullscreenRef={isFullscreenRef}
              onTogglePlay={togglePlay}
              onToggleMute={toggleMute}
              onVolumeChange={handleVolumeChange}
              onToggleFullscreen={toggleFullscreen}
              onChangeQuality={changeQuality}
              onToggleQualityMenu={() => setShowQualityMenu((s) => !s)}
              formatTime={formatTime}
              currentQualityLabel={currentQualityLabel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BunnyHLSPlayer);

// Memoized progress bar component to avoid re-renders
const ProgressBar = React.memo(({ currentTime, duration, onSeek }) => (
  <div
    className="w-full h-2 bg-gray-600 rounded-full mb-4 cursor-pointer"
    onClick={onSeek}
  >
    <div
      className="h-full bg-[#ff4040] rounded-full transition-all duration-100"
      style={{
        width: duration ? `${(currentTime / duration) * 100}%` : "0%",
      }}
    />
  </div>
));
ProgressBar.displayName = "ProgressBar";

const VideoControls = React.memo(
  ({
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    isHlsJs,
    isFullscreenRef,
    qualities,
    selectedQuality,
    showQualityMenu,
    onTogglePlay,
    onToggleMute,
    onVolumeChange,
    onToggleFullscreen,
    onChangeQuality,
    onToggleQualityMenu,
    formatTime,
    currentQualityLabel,
  }) => (
    <div className="flex items-center justify-between text-white">
      <div className="flex items-center space-x-4">
        <button
          onClick={onTogglePlay}
          className="hover:scale-110 transition-transform"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleMute}
            className="hover:scale-110 transition-transform"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          {!isSafari && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none slider"
            />
          )}
        </div>

        <div className="text-sm">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <div className="flex items-center space-x-3 relative">
        {isHlsJs && qualities.length > 0 && (
          <div className="relative">
            <button
              onClick={onToggleQualityMenu}
              className="px-2 py-1 border rounded-md text-sm bg-black bg-opacity-30 hover:bg-opacity-50"
            >
              {currentQualityLabel()}
            </button>
            {showQualityMenu && (
              <div className="absolute right-0 bottom-0 mt-2 w-36 bg-black bg-opacity-90 border rounded shadow-lg z-50">
                <ul className="divide-y">
                  {qualities.map((q) => (
                    <li key={q.index}>
                      <button
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 ${
                          selectedQuality === q.index ? "font-semibold" : ""
                        }`}
                        onClick={() => onChangeQuality(q.index)}
                      >
                        {q.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onToggleFullscreen}
          className="hover:scale-110 transition-transform"
        >
          {isFullscreenRef.current ? (
            <Minimize size={20} />
          ) : (
            <Maximize size={20} />
          )}
        </button>
      </div>
    </div>
  )
);
VideoControls.displayName = "VideoControls";
