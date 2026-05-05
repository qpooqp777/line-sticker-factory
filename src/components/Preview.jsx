import { useLanguage } from '../contexts/LanguageContext'

export default function Preview({ images, selectedSize }) {
  const { t } = useLanguage()

  const sizeMap = {
    main: { width: 1024, height: 1024 },
    popup: { width: 512, height: 512 },
    stamp: { width: 512, height: 512 },
    thumbnail: { width: 240, height: 240 },
  }

  const targetSize = sizeMap[selectedSize]

  if (images.length === 0) {
    return (
      <div className="card space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {t('previewTitle')}
        </h2>
        <p className="text-[var(--color-text-secondary)] text-center py-8">
          {t('previewEmpty')}
        </p>
      </div>
    )
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        {t('previewTitle')}
      </h2>
      
      <p className="text-sm text-[var(--color-text-secondary)]">
        {t('previewNote')} {t('sizeInfo', { width: targetSize.width, height: targetSize.height })}
      </p>
      
      <div className="sticker-grid">
        {images.map((img) => (
          <div key={img.id} className="preview-sticker">
            <img
              src={img.src}
              alt={img.name}
              className="w-full aspect-square object-cover"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}