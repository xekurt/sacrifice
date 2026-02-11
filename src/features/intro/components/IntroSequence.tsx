import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudio } from '../../../shared/contexts/AudioContext';

interface Slide {
    text: string;
    duration: number; // in ms, 0 means manual
}

interface IntroSequenceProps {
    onComplete: () => void;
}

const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFading, setIsFading] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const { play } = useAudio();

    // Get slides from localization
    const slidesData = t('intro.slides', { returnObjects: true }) as string[];
    const SLIDES: Slide[] = slidesData.map((text, index) => ({
        text,
        duration: index === slidesData.length - 1 ? 0 : 3500 + (index * 1000)
    }));

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
    }, [currentSlide, hasStarted, SLIDES]);

    const handleFinish = () => {
        setIsFinishing(true);
        // Allow final fade out before calling onComplete
        setTimeout(() => {
            onComplete();
        }, 1000);
    };

    if (!hasStarted) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center z-[2000] text-center p-4">
                <h1 className="text-4xl font-bold tracking-tighter text-zinc-100 uppercase mb-8 opacity-50">{t('game.title')}</h1>
                <button
                    onClick={handleStart}
                    className="px-10 py-4 border border-zinc-800 text-zinc-400 hover:border-zinc-100 hover:text-zinc-100 transition-all duration-700 uppercase tracking-[0.3em] text-[10px] font-bold bg-zinc-950/50 backdrop-blur-sm"
                >
                    {t('intro.init')}
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
                        className="px-8 py-4 bg-zinc-100 text-zinc-950 font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:scale-105 transition-all duration-500 mt-12 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        onClick={handleFinish}
                    >
                        {t('intro.enter')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default IntroSequence;
