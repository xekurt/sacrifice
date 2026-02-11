import { useRef, useEffect } from 'react';

export const useSFX = (audioPath: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Ensure path starts with a slash for public folder resolution
        const resolvedPath = audioPath.startsWith('/') ? audioPath : `/${audioPath}`;
        audioRef.current = new Audio(resolvedPath);
        audioRef.current.load(); // Pre-load the audio
    }, [audioPath]);

    const play = () => {
        if (audioRef.current) {
            // Optional: console.debug("Triggering SFX:", audioRef.current.src);
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
                // Silently handle exceptions if user hasn't interacted with document yet
                console.warn("SFX play blocked or failed:", err);
            });
        }
    };

    return { play };
};
