import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAudio } from '../../../shared/contexts/AudioContext';
import { useAccessibility } from '../../../shared/contexts/AccessibilityContext';
import type { ColorblindMode } from '../../../shared/contexts/AccessibilityContext';
import type { Difficulty } from '../../../core/types/game';

interface SettingsMenuProps {
    difficulty: Difficulty;
    onDifficultyChange: (d: Difficulty) => void;
    onBack: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ difficulty, onDifficultyChange, onBack }) => {
    const { t, i18n } = useTranslation();
    const { volume, setVolume, isMuted, toggleMute } = useAudio();
    const { colorblindMode, setColorblindMode } = useAccessibility();

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' },
        { code: 'ru', name: 'Русский' },
        { code: 'it', name: 'Italiano' },
        { code: 'fa', name: 'فارسی' },
        { code: 'ar', name: 'العربية' },
    ];

    const colorblindModes: { id: ColorblindMode; label: string }[] = [
        { id: 'none', label: t('settings.modes.none') },
        { id: 'protanopia', label: t('settings.modes.protanopia') },
        { id: 'deuteranopia', label: t('settings.modes.deuteranopia') },
        { id: 'tritanopia', label: t('settings.modes.tritanopia') },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-zinc-200 p-8 animate-fadeIn">
            <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-lg shadow-2xl">
                <h2 className="text-3xl font-bold tracking-tighter mb-8 text-zinc-100 uppercase border-b border-zinc-800 pb-4">
                    {t('settings.title')}
                </h2>

                {/* Audio Section */}
                <section className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 italic">{t('settings.audio')}</h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{t('settings.volume')}</span>
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
                            {isMuted ? t('settings.mute') : t('settings.unmute')}
                        </button>
                    </div>
                </section>

                {/* Language Section */}
                <section className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 italic">{t('settings.language')}</h3>
                    <select
                        value={i18n.language}
                        onChange={(e) => i18n.changeLanguage(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </section>

                {/* Accessibility Section */}
                <section className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 italic">{t('settings.accessibility')}</h3>
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-400 block mb-1">{t('settings.colorblind')}</label>
                        <select
                            value={colorblindMode}
                            onChange={(e) => setColorblindMode(e.target.value as ColorblindMode)}
                            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                        >
                            {colorblindModes.map((mode) => (
                                <option key={mode.id} value={mode.id}>
                                    {mode.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Gameplay Section */}
                <section className="mb-10">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 italic">{t('settings.governance')}</h3>

                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { id: 'easy' as Difficulty, label: t('difficulty.easy'), sub: t('difficulty.easy_sub') },
                            { id: 'normal' as Difficulty, label: t('difficulty.normal'), sub: t('difficulty.normal_sub') },
                            { id: 'hard' as Difficulty, label: t('difficulty.hard'), sub: t('difficulty.hard_sub') }
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
                    {t('menu.back')}
                </button>
            </div>
        </div>
    );
};

export default SettingsMenu;
