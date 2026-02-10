import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioContext';

interface Slide {
    text: string;
    duration: number; // in ms, 0 means manual
}

const SLIDES: Slide[] = [
    {
        text: "The revolution is over. The old regime has fallen. You stand victorious in the ashes.",
        duration: 3500,
    },
    {
        text: "But victory is fragile. The Sepah demands control. The Bonyads demand wealth. The Ideology demands obedience. You cannot satisfy them all.",
        duration: 4500,
    },
    {
        text: "You are the Supreme Leader. How long can you survive the system you created?",
        duration: 0,
    },
];

interface IntroSequenceProps {
    onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const { play } = useAudio();

    const handleStart = () => {
        setHasStarted(true);
        play();
    };

    useEffect(() => {
        if (!hasStarted) return;

        const slide = SLIDES[currentSlide];

        // If duration is 0, we wait for user input
        if (slide.duration === 0) return;

        const timer = setTimeout(() => {
            // Start fade out
            setIsFading(true);

            // After fade out (1000ms), change slide and fade back in
            setTimeout(() => {
                setCurrentSlide((prev) => prev + 1);
                setIsFading(false);
            }, 1000);

        }, slide.duration);

        return () => clearTimeout(timer);
    }, [currentSlide, hasStarted]);

    const handleFinish = () => {
        setIsFinishing(true);
        // Allow final fade out before calling onComplete
        setTimeout(() => {
            onComplete();
        }, 1000);
    };

    if (!hasStarted) {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[2000] text-center p-4">
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-100 uppercase mb-8 opacity-50">Sacrifice</h1>
                <button
                    onClick={handleStart}
                    className="px-8 py-3 border border-zinc-100 text-zinc-100 hover:bg-zinc-100 hover:text-black transition-all duration-500 uppercase tracking-widest text-sm"
                >
                    Initialize Transmission
                </button>
            </div>
        );
    }

    return (
        <div className={`intro-container ${(isFinishing || isFading) ? 'fade-out' : 'fade-in'}`}>
            <div className="intro-content">
                <p className="intro-text">
                    {SLIDES[currentSlide].text}
                </p>

                {SLIDES[currentSlide].duration === 0 && (
                    <button
                        className="group relative px-8 py-3 bg-white text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform mt-8"
                        onClick={handleFinish}
                    >
                        Enter the Palace
                    </button>
                )}
            </div>
        </div>
    );
};

export default IntroSequence;
