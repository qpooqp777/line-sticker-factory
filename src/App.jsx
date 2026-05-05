import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import Header from './components/Header'
import PromptGenerator from './components/PromptGenerator'
import GridImageUploader from './components/GridImageUploader'
import GridSlicer from './components/GridSlicer'
import StickerSelector from './components/StickerSelector'
import FileNaming from './components/FileNaming'
import DownloadPanel from './components/DownloadPanel'

function AppContent() {
  // State
  const [gridImage, setGridImage] = useState(null)
  const [stickers, setStickers] = useState([])
  const [mainSticker, setMainSticker] = useState(null)
  const [tabSticker, setTabSticker] = useState(null)
  const [startNumber, setStartNumber] = useState(1)
  const [removeBg, setRemoveBg] = useState(true)

  // Handlers
  const handleGridImageLoaded = (image) => {
    setGridImage(image)
    setStickers([]) // Reset stickers when new image uploaded
    setMainSticker(null)
    setTabSticker(null)
  }

  const handleStickersReady = (slicedStickers) => {
    setStickers(slicedStickers)
    // Auto-select first sticker as main and tab
    if (slicedStickers.length > 0) {
      setMainSticker(slicedStickers[0])
      setTabSticker(slicedStickers[0])
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header 
        removeBg={removeBg} 
        onRemoveBgChange={setRemoveBg}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Slice */}
          <div className="lg:col-span-2 space-y-6">
            <PromptGenerator />
            
            <GridImageUploader 
              gridImage={gridImage}
              onImageLoaded={handleGridImageLoaded}
            />
            
            <GridSlicer 
              gridImage={gridImage}
              stickers={stickers}
              removeBg={removeBg}
              onStickersReady={handleStickersReady}
            />
          </div>
          
          {/* Right Column - Selection & Download */}
          <div className="space-y-6">
            <StickerSelector 
              stickers={stickers}
              mainSticker={mainSticker}
              tabSticker={tabSticker}
              onMainSelect={setMainSticker}
              onTabSelect={setTabSticker}
            />
            
            <FileNaming 
              startNumber={startNumber}
              onStartNumberChange={setStartNumber}
            />
            
            <DownloadPanel 
              stickers={stickers}
              mainSticker={mainSticker}
              tabSticker={tabSticker}
              startNumber={startNumber}
            />
          </div>
        </div>
      </main>
      
      <footer className="border-t border-[var(--color-border)] py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-[var(--color-text-secondary)]">
          LINE 貼圖自動化助手 Clone • Built with React + Tailwind CSS
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
