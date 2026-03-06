import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import {
    OrthographicCamera,
    OrbitControls,
    Float,
    Edges
} from '@react-three/drei';
import type { GameState } from '../../../core/types/game';

interface ImaginaryMapProps {
    className?: string;
    gameState?: GameState;
}

const HEX_COLOR_MAP: Record<string, string> = {
    'fill-violet-600': '#7c3aed',
    'fill-orange-600': '#ea580c',
    'fill-yellow-600': '#ca8a04',
    'fill-slate-600': '#475569'
};

const ExtrudedRegion = ({
    shape,
    depth = 0.4,
    color = '#18181b',
    position = [0, 0, 0],
    isCapital = false
}: {
    shape: THREE.Shape;
    depth?: number;
    color?: string;
    position?: [number, number, number];
    isCapital?: boolean;
}) => {
    const extrudeSettings = useMemo(() => ({
        depth: depth,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelSegments: 3,
        curveSegments: 12
    }), [depth]);

    return (
        <mesh position={position} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial
                color={color}
                metalness={0.7}
                roughness={0.3}
                emissive={color}
                emissiveIntensity={0.05}
            />
            <Edges
                threshold={15}
                color={isCapital ? "#ffffff" : color}
                opacity={0.5}
                transparent
            />
        </mesh>
    );
};

const ImaginaryMap: React.FC<ImaginaryMapProps> = ({ className, gameState }) => {
    if (!gameState) return null;

    const shapes = useMemo(() => {
        // Define shared vertices for interlocking borders
        // C = Capital points
        const c1 = [0.2, 0.9];
        const c2 = [0.8, 0.4];
        const c3 = [0.7, -0.6];
        const c4 = [-0.1, -0.9];
        const c5 = [-0.8, -0.3];
        const c6 = [-0.5, 0.7];

        const capital = new THREE.Shape();
        capital.moveTo(c1[0], c1[1]);
        capital.lineTo(c2[0], c2[1]);
        capital.lineTo(c3[0], c3[1]);
        capital.lineTo(c4[0], c4[1]);
        capital.lineTo(c5[0], c5[1]);
        capital.lineTo(c6[0], c6[1]);
        capital.lineTo(c1[0], c1[1]);

        // Province 1 (North-East) - Interlocks C1-C2
        const p1 = new THREE.Shape();
        p1.moveTo(c1[0], c1[1]);
        p1.lineTo(1.2, 1.8);
        p1.lineTo(2.4, 0.8);
        p1.lineTo(2.1, -0.2);
        p1.lineTo(c2[0], c2[1]);
        p1.lineTo(c1[0], c1[1]);

        // Province 2 (East) - Interlocks C2-C3
        const p2 = new THREE.Shape();
        p2.moveTo(c2[0], c2[1]);
        p2.lineTo(2.1, -0.2);
        p2.lineTo(2.5, -1.4);
        p2.lineTo(1.1, -2.1);
        p2.lineTo(c3[0], c3[1]);
        p2.lineTo(c2[0], c2[1]);

        // Province 3 (South-East) - Interlocks C3-C4
        const p3 = new THREE.Shape();
        p3.moveTo(c3[0], c3[1]);
        p3.lineTo(1.1, -2.1);
        p3.lineTo(-0.2, -2.5);
        p3.lineTo(-1.3, -1.9);
        p3.lineTo(c4[0], c4[1]);
        p3.lineTo(c3[0], c3[1]);

        // Province 4 (South-West) - Interlocks C4-C5
        const p4 = new THREE.Shape();
        p4.moveTo(c4[0], c4[1]);
        p4.lineTo(-1.3, -1.9);
        p4.lineTo(-2.4, -0.8);
        p4.lineTo(-2.2, 0.3);
        p4.lineTo(c5[0], c5[1]);
        p4.lineTo(c4[0], c4[1]);

        // Province 5 (West) - Interlocks C5-C6
        const p5 = new THREE.Shape();
        p5.moveTo(c5[0], c5[1]);
        p5.lineTo(-2.2, 0.3);
        p5.lineTo(-1.8, 1.6);
        p5.lineTo(-0.8, 2.1);
        p5.lineTo(c6[0], c6[1]);
        p5.lineTo(c5[0], c5[1]);

        // Province 6 (North-West) - Interlocks C6-C1
        const p6 = new THREE.Shape();
        p6.moveTo(c6[0], c6[1]);
        p6.lineTo(-0.8, 2.1);
        p6.lineTo(0.5, 2.6);
        p6.lineTo(1.2, 1.8);
        p6.lineTo(c1[0], c1[1]);
        p6.lineTo(c6[0], c6[1]);

        return { capital, provinces: [p1, p2, p3, p4, p5, p6] };
    }, []);

    const calculateTerritory = (state: GameState) => {
        const total = state.piety + state.sepah + state.bazaar;
        if (total === 0) return Array(6).fill('fill-slate-600');

        let pietyRegions = Math.round((state.piety / total) * 6);
        let sepahRegions = Math.round((state.sepah / total) * 6);
        let bazaarRegions = 6 - pietyRegions - sepahRegions;

        if (bazaarRegions < 0) {
            const overflow = Math.abs(bazaarRegions);
            if (pietyRegions >= sepahRegions) {
                pietyRegions = Math.max(0, pietyRegions - overflow);
            } else {
                sepahRegions = Math.max(0, sepahRegions - overflow);
            }
            bazaarRegions = 0;
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

    const themeColor = isIsolated ? '#ef4444' : '#ffffff';
    const fogColor = isIsolated ? '#450a0a' : '#09090b';

    return (
        <div className={`w-full aspect-[4/3] relative rounded-sm overflow-hidden border border-zinc-800 bg-black shadow-2xl ${className || ''}`}>
            <Canvas shadows gl={{ antialias: true }}>
                <color attach="background" args={['#09090b']} />
                <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={45} />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2.2}
                />

                <fog attach="fog" args={[fogColor, 15, 35]} />
                <ambientLight intensity={0.2} />
                <spotLight
                    position={[0, 10, 0]}
                    intensity={200}
                    distance={40}
                    angle={0.6}
                    penumbra={0.5}
                    castShadow
                    color={themeColor}
                />

                <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.4}>
                    <group>
                        {/* The Capital (Highter extrusion) */}
                        <ExtrudedRegion
                            shape={shapes.capital}
                            depth={0.7}
                            color="#18181b"
                            isCapital={true}
                        />

                        {/* Surround Provinces (Interlocking coastlines) */}
                        {shapes.provinces.map((shape, i) => (
                            <ExtrudedRegion
                                key={`province-organic-${i}`}
                                shape={shape}
                                depth={0.4}
                                color={HEX_COLOR_MAP[regionColors[i]]}
                            />
                        ))}
                    </group>
                </Float>
            </Canvas>

            {/* Tactical UI Overlays */}
            <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none z-10">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live_Topography_v5.2</span>
                </div>
                <div className="h-[1px] w-24 bg-zinc-800 my-1" />
                <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isIsolated ? 'text-red-500' : 'text-zinc-600'}`}>
                    Region_Interlock: ONLINE
                </span>
                {isIsolated && (
                    <div className="mt-2 px-2 py-1 border border-red-900/50 bg-red-950/20 text-red-500 text-[8px] font-bold tracking-[0.4em] uppercase">
                        Emergency_Fog_Active
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 right-4 text-right pointer-events-none opacity-30">
                <span className="text-[8px] font-mono text-zinc-600 block">LAT: 35.6892 N</span>
                <span className="text-[8px] font-mono text-zinc-600 block">LONG: 139.6917 E</span>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
        </div>
    );
};

export default ImaginaryMap;
