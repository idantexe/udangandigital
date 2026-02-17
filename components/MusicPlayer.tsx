import React, { useState, useEffect, useRef } from 'react';
import { Music, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  autoStart: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ autoStart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrl = "https://res.cloudinary.com/drs5bj8tq/video/upload/v1771307650/Alex_Warren_-_Ordinary_Official_Lyric_Video_ymwzjh.mp3";

  useEffect(() => {
    if (autoStart && audioRef.current) {
      // Browser policy requires user interaction before playing audio.
      // Since autoStart is triggered by a button click in the parent ("Buka Undangan"),
      // this usually works. We catch errors just in case.
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error);
            setIsPlaying(false);
          });
      }
    }
  }, [autoStart]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-4 right-4 md:top-12 md:right-12 z-[120]">
      <audio ref={audioRef} src={audioUrl} loop />

      <button 
        onClick={togglePlay} 
        className={`flex items-center justify-center w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-white shadow-2xl transition-all duration-700 backdrop-blur-3xl ${isPlaying ? 'bg-[#1E293B] text-white rotate-[360deg]' : 'bg-white/80 text-[#475569]'} hover:scale-110`}
      >
        <div className={isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}>
          {isPlaying ? <Music size={24} className="md:w-8 md:h-8" /> : <VolumeX size={24} className="md:w-8 md:h-8" />}
        </div>
      </button>
    </div>
  );
};

export default MusicPlayer;