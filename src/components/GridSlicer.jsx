import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { GRID_CONFIG, getStickerSize } from '../i18n'
import removeBackground from '@imgly/background-removal'

export default function GridSlicer({ gridImage, onStickersReady, removeBg, stickers }) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [modelDownloading, setModelDownloading] = useState(false)

  // Convert data URL to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // Convert Blob to data URL
  const blobToDataURL = (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    })
  }

  // AI-powered background removal using @imgly/background-removal
  const removeBackgroundAI = async (canvas) => {
    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })

    try {
      const resultBlob = await removeBackground(blob, {
        progress: (key, current, total) => {
          if (key === 'fetch-model' || key.startsWith('download')) {
            setModelDownloading(true)
            const pct = Math.round((current / total) * 100)
            setProgress(pct)
          }
        },
        output: {
          format: 'image/png',
          quality: 1,
        },
        model: 'u2net', // Fast general-purpose model
      })
      
      setModelDownloading(false)
      return await blobToDataURL(resultBlob)
    } catch (error) {
      console.error('Background removal error:', error)
      setModelDownloading(false)
      // Fallback to original if AI removal fails
      return canvas.toDataURL('image/png')
    }
  }

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

        // Remove background if enabled (AI-powered)
        let imageData = canvas.toDataURL('image/png')
        if (removeBg) {
          if (modelDownloading) {
            // Skip if model is still downloading
          } else {
            imageData = await removeBackgroundAI(canvas)
          }
        }

        slicedStickers.push({
          id: index,
          src: imageData,
          row,
          col,
        })
        
        if (!removeBg) {
          setProgress((index / GRID_CONFIG.stickerCount) * 100)
        }
        // Small delay to show progress
        await new Promise(r => setTimeout(r, 30))
      }
    }

    onStickersReady(slicedStickers)
    setIsProcessing(false)
    setModelDownloading(false)
  }, [gridImage, removeBg, onStickersReady, modelDownloading])

  // Auto-slice when image is loaded
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
            {modelDownloading ? (
              <>
                <svg className="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-sm">下載 AI 模型中... {progress}%</span>
              </>
            ) : (
              <>
                <svg className="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t('processingTitle')}</span>
              </>
            )}
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
                className="aspect-square rounded-lg overflow-hidden border-2 border-dashed border-neutral-400 bg-[var(--color-surface)]"
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
