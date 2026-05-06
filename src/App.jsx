import { useState, useRef } from 'react'
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
  // Refs
  const step1Ref = useRef(null)
  
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

  // Scroll to Step 1
  const scrollToStep1 = () => {
    step1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload & Slice */}
          <div className="lg:col-span-2 space-y-6">
            <PromptGenerator />
            
            <GridImageUploader 
              ref={step1Ref}
              gridImage={gridImage}
              onImageLoaded={handleGridImageLoaded}
              removeBg={removeBg}
              onRemoveBgChange={setRemoveBg}
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
      
      {/* Floating buttons for mobile - quick scroll */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Scroll to top */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-primary-400 text-[var(--color-text)] rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          title="回到最上"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        
        {/* Scroll to Step 1 */}
        <button
          onClick={scrollToStep1}
          className="w-12 h-12 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
          title="到步驟 1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
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
