import { useState, useRef, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function GridImageUploader({ onImageLoaded, gridImage }) {
  const { t } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  const [sizeWarning, setSizeWarning] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const processImage = useCallback((file) => {
    const validTypes = ['image/png', 'image/jpeg']
    if (!validTypes.includes(file.type)) {
      alert(t('errorFileType'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        // Check size - support both 2560×1664 and 1200×896
        const validSizes = [
          { width: 2560, height: 1664 },
          { width: 1200, height: 896 },
        ]
        const isCorrectSize = validSizes.some(
          s => img.width === s.width && img.height === s.height
        )
        
        if (!isCorrectSize) {
          setSizeWarning(t('sizeWarning', { width: img.width, height: img.height }))
        } else {
          setSizeWarning(null)
        }

        onImageLoaded({
          src: e.target.result,
          width: img.width,
          height: img.height,
          name: file.name,
          isCorrectSize,
        })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  }, [t, onImageLoaded])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processImage(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) processImage(file)
  }

  const handleClear = () => {
    onImageLoaded(null)
    setSizeWarning(null)
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
          {t('step1Title')}
        </h2>
        {gridImage && (
          <button onClick={handleClear} className="text-sm text-red-500 hover:text-red-600">
            {t('clearAll')}
          </button>
        )}
      </div>
      
      <p className="text-sm text-[var(--color-text-secondary)]">{t('step1Desc')}</p>
      <p className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-3 py-2 rounded-lg">
        {t('sizeRequirement')}
      </p>

      {!gridImage ? (
        <div
          className={`drop-zone ${isDragging ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg className="w-16 h-16 text-primary-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm8 10v4m0 0h4m-4 0l4-4m-4 4l-4-4" />
          </svg>
          <p className="text-[var(--color-text)] font-medium">{t('uploadHint')}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {sizeWarning && (
            <div className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded-lg">
              {sizeWarning}
            </div>
          )}
          <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)]">
            <img 
              src={gridImage.src} 
              alt="Grid" 
              className="w-full object-contain max-h-[400px]"
            />
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {gridImage.width} × {gridImage.height}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}