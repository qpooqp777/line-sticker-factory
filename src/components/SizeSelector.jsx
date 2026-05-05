import { useLanguage } from '../contexts/LanguageContext'
import { sizeOptions } from '../i18n'

export default function SizeSelector({ selectedSize, onSizeChange }) {
  const { t } = useLanguage()

  const sizeLabels = {
    main: t('sizeMain'),
    popup: t('sizePopup'),
    stamp: t('sizeStamp'),
    thumbnail: t('sizeThumbnail'),
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        {t('sizeTitle')}
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {sizeOptions.map(({ key, width, height }) => (
          <button
            key={key}
            onClick={() => onSizeChange(key)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left
              ${selectedSize === key 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 ring-2 ring-primary-500/20' 
                : 'border-[var(--color-border)] hover:border-primary-400 hover:bg-[var(--color-surface)]'
              }`}
          >
            <div className="font-medium text-[var(--color-text)]">{sizeLabels[key]}</div>
            <div className="text-sm text-[var(--color-text-secondary)] mt-1">
              {t('sizeInfo', { width, height })}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}