import { useState } from 'react'
import GameDesk from './features/game/components/GameDesk'
import IntroSequence from './features/intro/components/IntroSequence'
import MainMenu from './features/menu/components/MainMenu'
import SettingsMenu from './features/settings/components/SettingsMenu'
import { AudioProvider } from './shared/contexts/AudioContext'
import { AccessibilityProvider } from './shared/contexts/AccessibilityContext'
import { useDocumentDirection } from './shared/hooks/useDocumentDirection'
import type { AppScreen, Difficulty } from './core/types/game'
import introMusic from './assets/audio/intro_music.mp3'
import './core/i18n'
import './core/styles/index.css'

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('intro')
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')

  // Handle document direction (RTL/LTR) based on language
  useDocumentDirection();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'intro':
        return <IntroSequence onComplete={() => setCurrentScreen('main_menu')} />
      case 'main_menu':
        return <MainMenu onNavigate={setCurrentScreen} />
      case 'settings':
        return (
          <SettingsMenu
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onBack={() => setCurrentScreen('main_menu')}
          />
        )
      case 'game':
        return <GameDesk />
      default:
        return <IntroSequence onComplete={() => setCurrentScreen('main_menu')} />
    }
  }

  return (
    <div className="App min-h-screen overflow-hidden selection:bg-zinc-100 selection:text-zinc-950">
      {renderScreen()}
    </div>
  )
}

function App() {
  return (
    <AccessibilityProvider>
      <AudioProvider src={introMusic}>
        <AppContent />
      </AudioProvider>
    </AccessibilityProvider>
  )
}

export default App
