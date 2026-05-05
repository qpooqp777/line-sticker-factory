import { useState, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function ImageUploader({ onImagesSelected, images }) {
  const { t } = useLanguage()
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    processFiles(files)
  }

  const processFiles = (files) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp']
    const validFiles = files.filter(file => validTypes.includes(file.type))
    
    if (validFiles.length !== files.length) {
      alert(t('errorFileType'))
    }

    // Limit to 10 images total
    const remaining = 10 - images.length
    const filesToProcess = validFiles.slice(0, remaining)

    const newImages = []
    filesToProcess.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          newImages.push({
            id: Date.now() + Math.random(),
            file,
            src: e.target.result,
            name: file.name,
            width: img.width,
            height: img.height,
          })
          if (newImages.length === filesToProcess.length) {
            onImagesSelected([...images, ...newImages].slice(0, 10))
          }
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (id) => {
    onImagesSelected(images.filter(img => img.id !== id))
  }

  const handleClearAll = () => {
    onImagesSelected([])
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {t('uploadTitle')}
      </h2>
      
      <div
        className={`drop-zone ${isDragging ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="w-12 h-12 text-primary-500 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-[var(--color-text)] font-medium">{t('uploadHint')}</p>
        <p className="text-sm text-[var(--color-text-secondary)]">{t('uploadFormats')}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">
              {t('selectedCount', { count: images.length })}
            </span>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              {t('clearAll')}
            </button>
          </div>
          
          <div className="sticker-grid">
            {images.map((img) => (
              <div key={img.id} className="sticker-item relative group">
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage(img.id)
                    }}
                    className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 truncate">
                  {img.width}×{img.height}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}