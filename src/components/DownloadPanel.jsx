import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { LINE_STICKER_SIZES } from '../i18n'

export default function DownloadPanel({ stickers, mainSticker, tabSticker, startNumber }) {
  const { t } = useLanguage()
  const [isDownloading, setIsDownloading] = useState(false)

  const resizeImage = (src, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = targetWidth
        canvas.height = targetHeight
        const ctx = canvas.getContext('2d')
        
        // Calculate scaling to fit while maintaining aspect ratio
        const scale = Math.min(targetWidth / img.width, targetHeight / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const offsetX = (targetWidth - scaledWidth) / 2
        const offsetY = (targetHeight - scaledHeight) / 2
        
        // Fill with transparent background
        ctx.clearRect(0, 0, targetWidth, targetHeight)
        
        // Draw scaled image centered
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)
        
        resolve(canvas.toDataURL('image/png'))
      }
      img.src = src
    })
  }

  const downloadAll = async () => {
    if (stickers.length === 0) {
      alert(t('errorNoImage'))
      return
    }

    setIsDownloading(true)

    try {
      const files = []
      const stickerSize = LINE_STICKER_SIZES.sticker

      // Add all stickers
      for (let i = 0; i < stickers.length; i++) {
        const resized = await resizeImage(stickers[i].src, stickerSize.width, stickerSize.height)
        files.push({
          name: `${startNumber + i}.png`,
          data: resized,
        })
      }

      // Add main image
      if (mainSticker) {
        const mainSize = LINE_STICKER_SIZES.main
        const mainResized = await resizeImage(mainSticker.src, mainSize.width, mainSize.height)
        files.push({
          name: 'main.png',
          data: mainResized,
        })
      }

      // Add tab image
      if (tabSticker) {
        const tabSize = LINE_STICKER_SIZES.tab
        const tabResized = await resizeImage(tabSticker.src, tabSize.width, tabSize.height)
        files.push({
          name: 'tab.png',
          data: tabResized,
        })
      }

      // Download each file
      for (const file of files) {
        const link = document.createElement('a')
        link.href = file.data
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        await new Promise(r => setTimeout(r, 100)) // Small delay between downloads
      }

      alert(t('successMessage'))
    } catch (error) {
      console.error('Download error:', error)
      alert('Error: ' + error.message)
    } finally {
      setIsDownloading(false)
    }
  }

  const totalCount = stickers.length + (mainSticker ? 1 : 0) + (tabSticker ? 1 : 0)

  return (
    <div className="card space-y-4">
      <div className="text-sm text-[var(--color-text-secondary)]">
        {t('downloadNote', { count: totalCount })}
      </div>

      <button
        onClick={downloadAll}
        disabled={stickers.length === 0 || isDownloading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-3"
      >
        {isDownloading ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t('downloading')}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('downloadBtn')}
          </>
        )}
      </button>
    </div>
  )
}