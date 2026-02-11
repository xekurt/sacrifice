import React from 'react';
import type { GameState } from '../../../core/types/game';

interface ImaginaryMapProps {
    className?: string;
    gameState?: GameState;
}

const ImaginaryMap: React.FC<ImaginaryMapProps> = ({ className, gameState }) => {
    if (!gameState) return null;

    /**
     * Normalization Algorithm
     * Converts independent 0-100 scales into a shared 6-region territorial balance.
     */
    const calculateTerritory = (state: GameState) => {
        const total = state.piety + state.sepah + state.bazaar;

        // Handle void state
        if (total === 0) return Array(6).fill('fill-slate-600');

        // Proportional distribution
        let pietyRegions = Math.round((state.piety / total) * 6);
        let sepahRegions = Math.round((state.sepah / total) * 6);

        // Remainder calculation to ensure exactly 6 regions
        let bazaarRegions = 6 - pietyRegions - sepahRegions;

        // Integrity check: handle negative remainder or rounding overflows
        if (bazaarRegions < 0) {
            const overflow = Math.abs(bazaarRegions);
            if (pietyRegions >= sepahRegions) {
                pietyRegions = Math.max(0, pietyRegions - overflow);
            } else {
                sepahRegions = Math.max(0, sepahRegions - overflow);
            }
            bazaarRegions = 0;
            // Final adjustment
            bazaarRegions = 6 - pietyRegions - sepahRegions;
        }

        const colors: string[] = [];
        for (let i = 0; i < pietyRegions; i++) colors.push('fill-violet-600');
        for (let i = 0; i < sepahRegions; i++) colors.push('fill-orange-600');
        for (let i = 0; i < bazaarRegions; i++) colors.push('fill-yellow-600');

        return colors;
    };

    const regionColors = calculateTerritory(gameState);
    const isIsolated = gameState.isolation > 75;
    const strokeClass = isIsolated ? 'stroke-red-500' : 'stroke-slate-800';

    return (
        <svg
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-full h-auto shadow-2xl rounded-sm border border-zinc-800 ${className || ''}`}
        >
            {/* Surrounding Ocean/Void */}
            <rect width="800" height="600" fill="#09090b" />

            <g strokeWidth="3" className={`${strokeClass} transition-all duration-700`}>
                {/* Central Region: The Player's Government (Capital) */}
                <polygon
                    id="region-capital"
                    points="469,340 400,380 331,340 331,260 400,220 469,260"
                    className="fill-zinc-900 transition-colors duration-500"
                />

                {/* 
                  Outer Regions: Procedurally weighted by faction power.
                  Mapped to indices 0 through 5 from the proportional normalization.
                */}
                <polygon
                    id="territory-1"
                    points="469,260 469,340 640,400 640,200"
                    className={`${regionColors[0]} transition-colors duration-1000 ease-in-out`}
                />
                <polygon
                    id="territory-2"
                    points="469,340 400,380 400,540 640,400"
                    className={`${regionColors[1]} transition-colors duration-1000 ease-in-out`}
                />
                <polygon
                    id="territory-3"
                    points="400,380 331,340 160,400 400,540"
                    className={`${regionColors[2]} transition-colors duration-1000 ease-in-out`}
                />
                <polygon
                    id="territory-4"
                    points="331,340 331,260 160,200 160,400"
                    className={`${regionColors[3]} transition-colors duration-1000 ease-in-out`}
                />
                <polygon
                    id="territory-5"
                    points="331,260 400,220 400,60 160,200"
                    className={`${regionColors[4]} transition-colors duration-1000 ease-in-out`}
                />
                <polygon
                    id="territory-6"
                    points="400,220 469,260 640,200 400,60"
                    className={`${regionColors[5]} transition-colors duration-1000 ease-in-out`}
                />
            </g>
        </svg>
    );
};

export default ImaginaryMap;
