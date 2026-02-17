import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player/youtube';
import { Music, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  shouldPlay: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ shouldPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    if (shouldPlay) {
      setIsPlaying(true);
    }
  }, [shouldPlay]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-6 right-6 z-[120]">
      {/* 
        Optimization: Instead of 'hidden' (display: none), we use a 1px size 
        with opacity 0 and pointer-events-none. This prevents browsers from 
        pausing the video execution which often happens with display:none.
      */}
      <div className="absolute top-0 left-0 w-px h-px opacity-0 pointer-events-none overflow-hidden">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=A8dH4cKGa6s"
          playing={isPlaying}
          loop={true}
          volume={0.6}
          muted={isMuted}
          width="100%"
          height="100%"
          playsinline={true}
          config={{
            youtube: {
              playerVars: { showinfo: 0, controls: 0, disablekb: 1 }
            }
          }}
        />
      </div>

      {shouldPlay && (
        <button 
          onClick={toggleMute} 
          className={`flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full border border-[#475569]/20 shadow-2xl transition-all duration-500 backdrop-blur-xl ${!isMuted ? 'bg-[#1E293B] text-white animate-[spin_10s_linear_infinite]' : 'bg-white/80 text-[#475569]'}`}
          title={isMuted ? "Matikan Musik" : "Hidupkan Musik"}
        >
          {!isMuted ? <Music size={20} /> : <VolumeX size={20} />}
        </button>
      )}
    </div>
  );
};

export default MusicPlayer;