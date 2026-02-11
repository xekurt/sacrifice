import React from 'react';
import { useSFX } from '../hooks/useSFX';

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const GameButton: React.FC<GameButtonProps> = ({
    onClick,
    children,
    className,
    disabled,
    ...props
}) => {
    // SFX for the button click
    const { play } = useSFX('/audio/click_stamp.mp3');

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        play();
        if (onClick) {
            onClick(e);
        }
    };

    // Requested bureaucratic theme as a default
    const defaultTheme = "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 px-6 py-2 rounded font-serif uppercase tracking-wider";
    // Base behavioral classes for all buttons
    const behavioralClasses = "transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed selection:bg-none";

    return (
        <button
            {...props}
            disabled={disabled}
            onClick={handleClick}
            className={`${className || defaultTheme} ${behavioralClasses}`}
        >
            {children}
        </button>
    );
};

export default GameButton;
