import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AudioContextType {
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    play: () => void;
    pause: () => void;
    setVolume: (v: number) => void;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};

interface AudioProviderProps {
    children: ReactNode;
    src: string;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children, src }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const play = () => {
        if (audioRef.current) {
            audioRef.current.play().catch(err => {
                console.warn("Autoplay blocked or audio error:", err);
            });
            setIsPlaying(true);
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    const setVolume = (v: number) => {
        const clampedVolume = Math.max(0, Math.min(1, v));
        setVolumeState(clampedVolume);
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : clampedVolume;
        }
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <AudioContext.Provider value={{
            isPlaying,
            volume,
            isMuted,
            play,
            pause,
            setVolume,
            toggleMute
        }}>
            {children}
        </AudioContext.Provider>
    );
};
