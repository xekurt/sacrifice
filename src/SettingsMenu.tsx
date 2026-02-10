import React from 'react';
import { useAudio } from './AudioContext';
import type { Difficulty } from './gameTypes';

interface SettingsMenuProps {
    difficulty: Difficulty;
    onDifficultyChange: (d: Difficulty) => void;
    onBack: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ difficulty, onDifficultyChange, onBack }) => {
    const { volume, setVolume, isMuted, toggleMute } = useAudio();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-zinc-200 p-8 animate-fadeIn">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold tracking-tighter mb-8 text-zinc-100 uppercase border-b border-zinc-800 pb-4">
                    Settings
                </h2>

                {/* Audio Section */}
                <section className="mb-8">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 italic">Audio Configuration</h3>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Master Volume</span>
                            <span className="text-xs text-zinc-500">{Math.round(volume * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-100"
                        />

                        <button
                            onClick={toggleMute}
                            className={`w-full py-2 text-xs font-bold uppercase tracking-widest border transition-all ${isMuted
                                ? 'bg-red-900/20 border-red-900 text-red-500'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-750'
                                }`}
                        >
                            {isMuted ? 'Muted' : 'Sound On'}
                        </button>
                    </div>
                </section>

                {/* Gameplay Section */}
                <section className="mb-12">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 italic">Governance Mode</h3>

                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { id: 'easy' as Difficulty, label: 'Provisional Gov', sub: 'Easy' },
                            { id: 'normal' as Difficulty, label: 'Supreme Leader', sub: 'Normal' },
                            { id: 'hard' as Difficulty, label: 'Eternal Guardian', sub: 'Hard' }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => onDifficultyChange(mode.id)}
                                className={`flex flex-col items-start p-3 border transition-all ${difficulty === mode.id
                                    ? 'bg-zinc-100 border-zinc-100 text-zinc-950'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                    }`}
                            >
                                <span className="text-sm font-bold uppercase tracking-tight">{mode.label}</span>
                                <span className="text-[10px] opacity-70 italic">{mode.sub}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <button
                    onClick={onBack}
                    className="w-full py-3 bg-zinc-100 text-zinc-950 font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
                >
                    Return to Hub
                </button>
            </div>
        </div>
    );
};

export default SettingsMenu;
