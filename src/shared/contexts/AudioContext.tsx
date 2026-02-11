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

    // Track the current playing state in a ref to avoid dependency loop in src useEffect
    const isPlayingRef = useRef(false);

    // Handle source changes
    useEffect(() => {
        // Cleanup old audio if it exists
        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(src);
        audioRef.current.loop = true;
        audioRef.current.volume = isMuted ? 0 : volume;

        // If it was playing, resume with the new source
        if (isPlayingRef.current) {
            audioRef.current.play().catch(err => {
                console.warn("Autoplay blocked on source change:", err);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src]);

    // Handle volume/mute updates without recreating the Audio object
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
            isPlayingRef.current = true;
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            isPlayingRef.current = false;
        }
    };

    const setVolume = (v: number) => {
        const clampedVolume = Math.max(0, Math.min(1, v));
        setVolumeState(clampedVolume);
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
