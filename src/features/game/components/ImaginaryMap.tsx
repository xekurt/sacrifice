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
    const strokeClass = isIsolated ? 'stroke-red-500' : 'stroke-zinc-700/50';

    // Region Data with pre-calculated centers for iconography
    const regions = [
        { id: 'territory-1', points: "469,260 469,340 640,400 640,200", center: { x: 554, y: 300 } },
        { id: 'territory-2', points: "469,340 400,380 400,540 640,400", center: { x: 477, y: 415 } },
        { id: 'territory-3', points: "400,380 331,340 160,400 400,540", center: { x: 323, y: 415 } },
        { id: 'territory-4', points: "331,340 331,260 160,200 160,400", center: { x: 246, y: 300 } },
        { id: 'territory-5', points: "331,260 400,220 400,60 160,200", center: { x: 323, y: 185 } },
        { id: 'territory-6', points: "400,220 469,260 640,200 400,60", center: { x: 477, y: 185 } },
    ];

    const getIconId = (fillClass: string) => {
        if (fillClass.includes('violet')) return 'icon-piety';
        if (fillClass.includes('orange')) return 'icon-sepah';
        if (fillClass.includes('yellow')) return 'icon-bazaar';
        return null;
    };

    return (
        <svg
            viewBox="0 0 800 600"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-full h-auto shadow-2xl rounded-sm border border-zinc-800 bg-black ${className || ''}`}
        >
            <defs>
                {/* Visual Polish: Background Gradient */}
                <radialGradient id="oceanGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#18181b" />
                    <stop offset="100%" stopColor="#000000" />
                </radialGradient>

                {/* Filters */}
                <filter id="floatShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
                    <feOffset dx="0" dy="12" result="offsetblur" />
                    <feFlood floodColor="black" floodOpacity="0.6" />
                    <feComposite in2="offsetblur" operator="in" />
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="innerGlow">
                    <feFlood floodColor="white" floodOpacity="0.2" result="glowColor" />
                    <feComposite in="glowColor" in2="SourceAlpha" operator="out" result="glowMask" />
                    <feGaussianBlur stdDeviation="2" in="glowMask" result="glowBlur" />
                    <feComposite in="glowBlur" in2="SourceAlpha" operator="in" result="glowFinal" />
                    <feMerge>
                        <feMergeNode in="SourceGraphic" />
                        <feMergeNode in="glowFinal" />
                    </feMerge>
                </filter>

                {/* Scanline Pattern */}
                <pattern id="scanlines" width="100%" height="4" patternUnits="userSpaceOnUse">
                    <rect width="100%" height="1" fill="white" fillOpacity="0.05" />
                </pattern>

                {/* Faction Icons (Mini-SVG Paths) */}
                {/* Sepah: Sword */}
                <symbol id="icon-sepah" viewBox="-10 -10 20 20">
                    <path d="M -1,-8 L 1,-8 L 1,4 L 4,4 L 4,6 L 1,6 L 1,9 L -1,9 L -1,6 L -4,6 L -4,4 L -1,4 Z" fill="currentColor" />
                </symbol>

                {/* Bazaar: Coin */}
                <symbol id="icon-bazaar" viewBox="-10 -10 20 20">
                    <circle cx="0" cy="0" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx="0" cy="0" r="3" fill="currentColor" />
                </symbol>

                {/* Piety: Star */}
                <symbol id="icon-piety" viewBox="-10 -10 20 20">
                    <path d="M 0,-9 L 2, -2 L 9,0 L 2, 2 L 0,9 L -2, 2 L -9,0 L -2, -2 Z" fill="currentColor" />
                </symbol>
            </defs>

            {/* Surrounding Ocean/Void with Radial Gradient */}
            <rect width="800" height="600" fill="url(#oceanGradient)" />

            {/* Main Map Group with Drop Shadow */}
            <g filter="url(#floatShadow)">
                {/* Central Region: The Player's Government (Capital) */}
                <polygon
                    id="region-capital"
                    points="469,340 400,380 331,340 331,260 400,220 469,260"
                    className="fill-zinc-900 stroke-zinc-700 transition-all duration-700 animate-pulse-slow"
                    strokeWidth="2"
                    filter="url(#innerGlow)"
                />

                {/* Outer Regions: Procedurally weighted by faction power */}
                {regions.map((region, i) => (
                    <g key={region.id}>
                        <polygon
                            id={region.id}
                            points={region.points}
                            className={`${regionColors[i]} ${strokeClass} transition-all duration-700 ease-in-out opacity-90 hover:opacity-100 hover:brightness-110`}
                            strokeWidth="3"
                            filter="url(#innerGlow)"
                        />

                        {/* Faction Icon Overlay */}
                        {getIconId(regionColors[i]) && (
                            <use
                                href={`#${getIconId(regionColors[i])}`}
                                x={region.center.x - 12}
                                y={region.center.y - 12}
                                width="24"
                                height="24"
                                className="text-white/30 pointer-events-none transition-opacity duration-700"
                            />
                        )}
                    </g>
                ))}
            </g>

            {/* Retro Scanlines Overlay */}
            <rect width="800" height="600" fill="url(#scanlines)" className="pointer-events-none" />

            {/* Glossy Overlay for that Glass Screen look */}
            <rect width="800" height="600" fill="transparent" className="pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.02) 100%)' }} />
        </svg>
    );
};

export default ImaginaryMap;
