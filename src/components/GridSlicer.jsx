import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { GRID_CONFIG, getStickerSize, LINE_STICKER_SIZES } from '../i18n'

export default function GridSlicer({ gridImage, onStickersReady, removeBg, stickers }) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const sliceImage = useCallback(async () => {
    if (!gridImage) return

    setIsProcessing(true)
    setProgress(0)

    const stickerSize = getStickerSize(gridImage.width, gridImage.height)
    const slicedStickers = []
    
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve) => {
      img.onload = resolve
      img.src = gridImage.src
    })

    for (let row = 0; row < GRID_CONFIG.rows; row++) {
      for (let col = 0; col < GRID_CONFIG.columns; col++) {
        const index = row * GRID_CONFIG.columns + col + 1
        
        // Create canvas for each sticker
        const canvas = document.createElement('canvas')
        canvas.width = stickerSize.width
        canvas.height = stickerSize.height
        const ctx = canvas.getContext('2d')
        
        // Draw the sliced portion
        ctx.drawImage(
          img,
          col * stickerSize.width,  // source x
          row * stickerSize.height, // source y
          stickerSize.width,        // source width
          stickerSize.height,       // source height
          0, 0,                     // dest x, y
          stickerSize.width,        // dest width
          stickerSize.height        // dest height
        )

        // Remove background if enabled
        let imageData = canvas.toDataURL('image/png')
        if (removeBg) {
          imageData = removeBackground(canvas)
        }

        slicedStickers.push({
          id: index,
          src: imageData,
          row,
          col,
        })
        
        setProgress((index / GRID_CONFIG.stickerCount) * 100)
        // Small delay to show progress
        await new Promise(r => setTimeout(r, 50))
      }
    }

    onStickersReady(slicedStickers)
    setIsProcessing(false)
  }, [gridImage, removeBg, onStickersReady])

  // Auto-slice when image is loaded or removeBg changes
  useEffect(() => {
    if (gridImage && stickers.length === 0) {
      sliceImage()
    }
  }, [gridImage])

  // Re-slice when removeBg changes
  useEffect(() => {
    if (gridImage && stickers.length > 0) {
      sliceImage()
    }
  }, [removeBg])

  // Smart background removal - detects dominant color from edges/corners
  const removeBackground = (canvas) => {
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data
    
    // Sample background color from corners and edges
    const samples = []
    const samplePoints = [
      [0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1], // corners
      [Math.floor(width / 2), 0], [Math.floor(width / 2), height - 1], // top/bottom middle
      [0, Math.floor(height / 2)], [width - 1, Math.floor(height / 2)], // left/right middle
    ]
    
    for (const [x, y] of samplePoints) {
      const idx = (y * width + x) * 4
      samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] })
    }
    
    // Calculate average background color
    const avgBg = {
      r: Math.round(samples.reduce((a, s) => a + s.r, 0) / samples.length),
      g: Math.round(samples.reduce((a, s) => a + s.g, 0) / samples.length),
      b: Math.round(samples.reduce((a, s) => a + s.b, 0) / samples.length),
    }
    
    // Color distance threshold (0-255)
    const threshold = 35
    const edgeFeather = 15
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Calculate color distance to background
      const dist = Math.sqrt(
        Math.pow(r - avgBg.r, 2) +
        Math.pow(g - avgBg.g, 2) +
        Math.pow(b - avgBg.b, 2)
      )
      
      if (dist < threshold) {
        // Full transparency for exact matches
        data[i + 3] = 0
      } else if (dist < threshold + edgeFeather) {
        // Feather the edges
        const alpha = Math.round(((dist - threshold) / edgeFeather) * 255)
        data[i + 3] = alpha
      }
    }
    
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL('image/png')
  }

  if (!gridImage) {
    return null
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
        {t('step2Title')}
      </h2>

      {isProcessing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{t('processingTitle')}</span>
          </div>
          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : stickers.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('stickersTitle')}
          </p>
          
          {/* 4x3 Grid Preview */}
          <div className="grid grid-cols-4 gap-2">
            {stickers.map((sticker) => (
              <div 
                key={sticker.id}
                className="aspect-square rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                <img 
                  src={sticker.src} 
                  alt={`Sticker ${sticker.id}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}