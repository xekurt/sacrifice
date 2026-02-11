import React from 'react';
import { useTranslation } from 'react-i18next';
import GameButton from '../../../shared/components/GameButton';
import type { AppScreen } from '../../../core/types/game';

interface MainMenuProps {
    onNavigate: (screen: AppScreen) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
    const { t } = useTranslation();

    const handleQuit = () => {
        // Browser "Exit" strategy
        document.body.innerHTML = `
      <div style="height: 100vh; background: black; color: #71717a; display: flex; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 2rem;">
        <div>
          <p style="font-size: 1.5rem; letter-spacing: 0.1em; text-transform: uppercase;">${t('menu.quit_message')}</p>
          <p style="font-size: 0.75rem; color: #3f3f46; margin-top: 1rem;">${t('menu.quit_submessage')}</p>
        </div>
      </div>
    `;
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-zinc-200 p-4">
            <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h1 className="text-7xl font-black tracking-tighter mb-2 text-zinc-100 uppercase italic">
                    {t('game.title')}
                </h1>
                <div className="h-px w-24 bg-zinc-800 mx-auto my-6"></div>
                <p className="text-zinc-500 tracking-[0.3em] font-light uppercase text-[10px]">Systemic Balance Simulation</p>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-[280px]">
                <GameButton
                    onClick={() => onNavigate('game')}
                    className="group relative px-6 py-4 bg-zinc-100 text-zinc-950 transition-all duration-300 rounded-sm overflow-hidden"
                >
                    <span className="relative z-10 font-black tracking-widest uppercase text-xs">{t('menu.start')}</span>
                </GameButton>

                <GameButton
                    onClick={() => onNavigate('settings')}
                    className="group relative px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-100 transition-all duration-300 rounded-sm text-zinc-500 hover:text-zinc-100"
                >
                    <span className="font-bold tracking-widest uppercase text-[10px]">{t('menu.settings')}</span>
                </GameButton>

                <GameButton
                    onClick={handleQuit}
                    className="group relative px-6 py-3 bg-zinc-900 border border-zinc-800 hover:border-red-900 transition-all duration-300 rounded-sm text-zinc-600 hover:text-red-500"
                >
                    <span className="font-bold tracking-widest uppercase text-[10px]">{t('menu.quit')}</span>
                </GameButton>
            </div>

            <footer className="fixed bottom-8 text-[10px] uppercase tracking-[0.4em] text-zinc-800 font-bold">
                Central Intelligence Archive • Year 1392
            </footer>
        </div>
    );
};

export default MainMenu;
