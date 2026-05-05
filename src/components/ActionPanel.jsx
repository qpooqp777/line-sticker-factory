import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function ActionPanel({ images, selectedSize }) {
  const { t } = useLanguage()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const sizeMap = {
    main: { width: 1024, height: 1024, folder: 'main' },
    popup: { width: 512, height: 512, folder: 'popup' },
    stamp: { width: 512, height: 512, folder: 'stamp' },
    thumbnail: { width: 240, height: 240, folder: 'thumbs' },
  }

  const resizeImage = (img, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      
      const image = new window.Image()
      image.onload = () => {
        // Calculate scaling to fit while maintaining aspect ratio
        const scale = Math.min(targetWidth / image.width, targetHeight / image.height)
        const scaledWidth = image.width * scale
        const scaledHeight = image.height * scale
        const offsetX = (targetWidth - scaledWidth) / 2
        const offsetY = (targetHeight - scaledHeight) / 2
        
        // Fill with transparent background
        ctx.clearRect(0, 0, targetWidth, targetHeight)
        
        // Draw scaled image centered
        ctx.drawImage(image, offsetX, offsetY, scaledWidth, scaledHeight)
        
        resolve(canvas.toDataURL('image/png'))
      }
      image.src = img.src
    })
  }

  const generateZip = async () => {
    if (images.length === 0) {
      alert(t('errorNoImages'))
      return
    }

    setIsGenerating(true)
    setProgress({ current: 0, total: images.length })

    try {
      const targetSize = sizeMap[selectedSize]
      const processedImages = []

      for (let i = 0; i < images.length; i++) {
        const resized = await resizeImage(images[i], targetSize.width, targetSize.height)
        processedImages.push({
          name: `${i + 1}_${targetSize.folder}.png`,
          data: resized,
        })
        setProgress({ current: i + 1, total: images.length })
      }

      // Create a simple zip-like structure using base64
      // For a real implementation, you'd use JSZip or similar
      const manifest = {
        version: '1.0',
        size: selectedSize,
        count: processedImages.length,
        createdAt: new Date().toISOString(),
      }

      // Download each image individually
      processedImages.forEach((img, idx) => {
        const link = document.createElement('a')
        link.href = img.data
        link.download = img.name
        link.click()
      })

      // Download manifest
      const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' })
      const manifestUrl = URL.createObjectURL(manifestBlob)
      const manifestLink = document.createElement('a')
      manifestLink.href = manifestUrl
      manifestLink.download = 'manifest.json'
      manifestLink.click()
      URL.revokeObjectURL(manifestUrl)

      alert(t('successMessage'))
    } catch (error) {
      console.error('Error generating:', error)
      alert('Error: ' + error.message)
    } finally {
      setIsGenerating(false)
      setProgress({ current: 0, total: 0 })
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-text-secondary)]">
          {images.length > 0 && (
            <span>{t('selectedCount', { count: images.length })}</span>
          )}
        </div>
      </div>

      <button
        onClick={generateZip}
        disabled={images.length === 0 || isGenerating}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {t('generatingProgress', { current: progress.current, total: progress.total })}
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {t('generateBtn')}
          </>
        )}
      </button>

      {isGenerating && (
        <div className="w-full bg-[var(--color-border)] rounded-full h-2">
          <div 
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(progress.current / progress.total) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}