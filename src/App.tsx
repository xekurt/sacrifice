import { useState } from 'react'
import GameDesk from './GameDesk'
import IntroSequence from './IntroSequence'
import MainMenu from './MainMenu'
import SettingsMenu from './SettingsMenu'
import { AudioProvider } from './AudioContext'
import type { AppScreen, Difficulty } from './gameTypes'
import introMusic from './assets/audio/intro_music.mp3'
import './index.css'

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('intro')
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')

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
    <div className="App min-h-screen bg-black overflow-hidden selection:bg-zinc-100 selection:text-zinc-950">
      {renderScreen()}
    </div>
  )
}

function App() {
  return (
    <AudioProvider src={introMusic}>
      <AppContent />
    </AudioProvider>
  )
}

export default App
