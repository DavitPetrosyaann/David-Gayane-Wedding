import React, { useState, useEffect, useRef } from 'react';
import { Music, Pause } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const MusicPlayer: React.FC<{ isPlaying: boolean }> = ({ isPlaying: initialPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initPlayer = () => {
      if (!document.getElementById('youtube-player')) return;
      
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: 'KtlgYxa6BMU', // The Night We Met - Lord Huron
        playerVars: {
          autoplay: initialPlay ? 1 : 0,
          loop: 1,
          playlist: 'KtlgYxa6BMU', // Required for looping a single video
          controls: 0,
          showinfo: 0,
          autohide: 1,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            setIsReady(true);
            event.target.setVolume(30); // Elegant, non-intrusive volume level
            if (initialPlay) {
              // Browser policies might block autoplay if not initiated by a direct user click.
              // Since the user clicked the postcard to reveal this component, it usually works.
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else {
              setIsPlaying(false);
            }
          }
        }
      });
    };

    // Load YouTube Iframe API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      window.onYouTubeIframeAPIReady = initPlayer;
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [initialPlay]);

  const togglePlay = () => {
    if (playerRef.current && isReady) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div id="youtube-player" className="hidden"></div>
      <button 
        onClick={togglePlay}
        className={`w-12 h-12 bg-wedding-accent text-white rounded-full shadow-[0_0_15px_rgba(139,154,133,0.5)] flex items-center justify-center hover:scale-110 transition-all duration-300 ${!isReady ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:shadow-[0_0_20px_rgba(139,154,133,0.8)]'}`}
        aria-label="Toggle Music"
        disabled={!isReady}
      >
        {isPlaying ? <Pause size={20} /> : <Music size={20} className={isReady ? "animate-pulse" : ""} />}
      </button>
    </div>
  );
};

export default MusicPlayer;