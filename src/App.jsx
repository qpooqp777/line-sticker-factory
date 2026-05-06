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
      
      {/* Floating button for mobile - quick scroll to Step 1 */}
      <button
        onClick={scrollToStep1}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
        title="回到步驟 1"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
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
