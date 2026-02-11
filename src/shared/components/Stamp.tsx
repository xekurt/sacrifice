import React, { useMemo } from 'react';

interface StampProps {
    type: 'approved' | 'denied';
    className?: string;
}

const Stamp: React.FC<StampProps> = ({ type, className = '' }) => {
    // Generate a random rotation between -3 and +3 degrees
    const rotation = useMemo(() => (Math.random() * 6 - 3).toFixed(2), []);

    const config = {
        approved: {
            text: 'APPROVED',
            color: 'text-emerald-500',
            borderColor: 'border-emerald-500/80',
            bgColor: 'bg-emerald-500/5',
            inkColor: '#10b981'
        },
        denied: {
            text: 'DENIED',
            color: 'text-red-500',
            borderColor: 'border-red-500/80',
            bgColor: 'bg-red-500/5',
            inkColor: '#ef4444'
        }
    };

    const current = config[type];

    return (
        <div
            className={`absolute z-50 pointer-events-none flex items-center justify-center w-full h-full ${className}`}
            style={{ '--stamp-rotate': `${rotation}deg` } as React.CSSProperties}
        >
            <div
                className={`
                    animate-stamp-slam
                    px-8 py-3 
                    border-[6px] rounded-sm 
                    ${current.borderColor} ${current.color} ${current.bgColor}
                    font-black text-5xl tracking-[0.2em]
                    shadow-[0_0_15px_rgba(0,0,0,0.5)]
                    relative
                    backdrop-blur-[1px]
                `}
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {/* Gritty texture overlay using SVG filter if needed, but simple css noise/mask is easier */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />

                <span className="relative z-10 select-none uppercase italic">
                    {current.text}
                </span>

                {/* Rough ink splat or "worn" effect can be added with absolute positioned tiny dots if needed */}
                <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: current.inkColor }} />
                <div className="absolute -bottom-1 -right-1 w-3 h-1 rounded-full opacity-30" style={{ backgroundColor: current.inkColor }} />
            </div>
        </div>
    );
};

export default Stamp;
