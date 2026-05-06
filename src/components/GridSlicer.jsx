import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { GRID_CONFIG, getStickerSize } from '../i18n'

const BACKEND_URL = 'http://127.0.0.1:5174'

export default function GridSlicer({ gridImage, onStickersReady, removeBg, stickers }) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [backendStatus, setBackendStatus] = useState('checking') // checking | ready | unavailable
  const backendChecked = useRef(false)

  // Check backend status on mount
  useEffect(() => {
    if (backendChecked.current) return
    backendChecked.current = true
    checkBackend()
  }, [])

  const checkBackend = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/`)
      const data = await res.json()
      setBackendStatus(data.rembg_installed ? 'ready' : 'unavailable')
      console.log(`[rembg backend] status: ${data.rembg_installed ? 'ready' : 'unavailable'}`)
    } catch {
      setBackendStatus('unavailable')
      console.log('[rembg backend] unavailable - Python server not running')
    }
  }

  // Call Python backend to remove background
  const removeBackgroundBackend = async (blob, index) => {
    try {
      const formData = new FormData()
      formData.append('file', blob, 'sticker.png')

      const res = await fetch(`${BACKEND_URL}/remove-bg`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}`)
      }

      const data = await res.json()
      console.log(`[rembg] 第${index}張完成`)
      return data.image // base64 data URL
    } catch (error) {
      console.error(`[rembg] 第${index}張失敗:`, error)
      throw error
    }
  }

  // Simple client-side fallback background removal
  const applySimpleBgRemoval = (canvas) => {
    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imgData.data

    // Sample corners to detect background color
    const samplePixels = [
      [0, 0], [canvas.width - 1, 0],
      [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
      [Math.floor(canvas.width / 2), 0],
      [0, Math.floor(canvas.height / 2)],
      [canvas.width - 1, Math.floor(canvas.height / 2)],
      [Math.floor(canvas.width / 2), canvas.height - 1],
    ]

    let avgR = 0, avgG = 0, avgB = 0
    samplePixels.forEach(([x, y]) => {
      const i = (y * canvas.width + x) * 4
      avgR += data[i]
      avgG += data[i + 1]
      avgB += data[i + 2]
    })
    avgR = Math.round(avgR / samplePixels.length)
    avgG = Math.round(avgG / samplePixels.length)
    avgB = Math.round(avgB / samplePixels.length)
    console.log(`[簡單去背] 偵測背景色: RGB(${avgR},${avgG},${avgB})`)

    // Replace pixels close to background color with transparent
    const threshold = 60
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const diff = Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB)
      if (diff < threshold) {
        data[i + 3] = 0 // transparent
      }
    }

    ctx.putImageData(imgData, 0, 0)
    return canvas.toDataURL('image/png')
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
          col * stickerSize.width,
          row * stickerSize.height,
          stickerSize.width,
          stickerSize.height,
          0, 0,
          stickerSize.width,
          stickerSize.height
        )

        // Remove background if enabled
        let imageData = canvas.toDataURL('image/png')

        if (removeBg) {
          if (backendStatus === 'ready') {
            // Use Python rembg backend
            const blob = await new Promise((resolve) => {
              canvas.toBlob(resolve, 'image/png')
            })
            try {
              imageData = await removeBackgroundBackend(blob, index)
            } catch {
              // Fallback to simple removal if backend fails
              imageData = applySimpleBgRemoval(canvas)
            }
          } else {
            // Use simple client-side fallback
            imageData = applySimpleBgRemoval(canvas)
          }
        }

        slicedStickers.push({
          id: index,
          src: imageData,
          row,
          col,
        })

        setProgress(Math.round((index / GRID_CONFIG.stickerCount) * 100))
        await new Promise(r => setTimeout(r, 20))
      }
    }

    onStickersReady(slicedStickers)
    setIsProcessing(false)
  }, [gridImage, removeBg, onStickersReady, backendStatus])

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

  if (!gridImage) return null

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
            <span>{t('processingTitle')} {progress}%</span>
            {removeBg && backendStatus === 'unavailable' && (
              <span className="text-xs text-orange-500">(使用簡單去背)</span>
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