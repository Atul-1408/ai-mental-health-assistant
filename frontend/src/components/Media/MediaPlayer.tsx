import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Play, Pause, Square, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';

const MediaContainer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

const MediaHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MediaInfo = styled.div`
  flex: 1;
`;

const MediaTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const MediaDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const MediaContent = styled.div`
  margin-bottom: 1rem;
`;

const VideoPlayer = styled.video`
  width: 100%;
  max-height: 300px;
  border-radius: 8px;
  background: #000;
`;

const AudioPlayer = styled.audio`
  width: 100%;
  margin: 1rem 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ControlButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 1rem 0 0.5rem 0;
  cursor: pointer;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: white;
  border-radius: 2px;
  width: ${props => props.progress}%;
  transition: width 0.1s ease;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  opacity: 0.8;
`;

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'audio' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
  category: 'relaxation' | 'meditation' | 'nature' | 'therapy' | 'music';
}

interface MediaPlayerProps {
  media: MediaItem;
  onClose?: () => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ media, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);

  useEffect(() => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    const updateTime = () => setCurrentTime(mediaElement.currentTime);
    const updateDuration = () => setDuration(mediaElement.duration);
    const handleEnded = () => setIsPlaying(false);

    mediaElement.addEventListener('timeupdate', updateTime);
    mediaElement.addEventListener('loadedmetadata', updateDuration);
    mediaElement.addEventListener('ended', handleEnded);

    return () => {
      mediaElement.removeEventListener('timeupdate', updateTime);
      mediaElement.removeEventListener('loadedmetadata', updateDuration);
      mediaElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    if (isPlaying) {
      mediaElement.pause();
    } else {
      mediaElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    const mediaElement = mediaRef.current;
    if (!mediaElement) return;

    mediaElement.pause();
    mediaElement.currentTime = 0;
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    const newTime = progress * duration;

    if (mediaRef.current) {
      mediaRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <MediaContainer>
      <MediaHeader>
        <MediaInfo>
          <MediaTitle>{media.title}</MediaTitle>
          <MediaDescription>{media.description}</MediaDescription>
        </MediaInfo>
        {onClose && (
          <ControlButton onClick={onClose}>
            <Square size={16} />
          </ControlButton>
        )}
      </MediaHeader>

      <MediaContent>
        {media.type === 'video' ? (
          <VideoPlayer
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={media.url}
            poster={media.thumbnail}
            controls={false}
          />
        ) : (
          <AudioPlayer
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            src={media.url}
            style={{ display: 'none' }} // Hide default audio controls
          />
        )}
      </MediaContent>

      <ProgressBar onClick={handleProgressClick}>
        <ProgressFill progress={progress} />
      </ProgressBar>

      <TimeDisplay>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </TimeDisplay>

      <Controls>
        <ControlButton onClick={togglePlay}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </ControlButton>
        
        <ControlButton onClick={handleStop}>
          <Square size={16} />
        </ControlButton>

        <VolumeControl>
          <ControlButton onClick={toggleMute}>
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </ControlButton>
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeControl>
      </Controls>
    </MediaContainer>
  );
};

export default MediaPlayer;
