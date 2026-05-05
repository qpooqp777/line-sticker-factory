import { useLanguage } from '../contexts/LanguageContext'

export default function StickerSelector({ stickers, mainSticker, tabSticker, onMainSelect, onTabSelect }) {
  const { t } = useLanguage()

  if (stickers.length === 0) {
    return null
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
        {t('mainTabTitle')}
      </h2>
      
      <p className="text-sm text-[var(--color-text-secondary)]">{t('mainTabDesc')}</p>
      <p className="text-xs text-primary-600 dark:text-primary-400">{t('mainTabNote')}</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Main Image Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">{t('mainLabel')}</label>
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center">
            {mainSticker ? (
              <img 
                src={mainSticker.src} 
                alt="Main" 
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm text-[var(--color-text-secondary)]">{t('clickToSelect')}</span>
            )}
          </div>
        </div>

        {/* Tab Image Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">{t('tabLabel')}</label>
          <div className="aspect-square rounded-xl overflow-hidden border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center">
            {tabSticker ? (
              <img 
                src={tabSticker.src} 
                alt="Tab" 
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm text-[var(--color-text-secondary)]">{t('clickToSelect')}</span>
            )}
          </div>
        </div>
      </div>

      {/* Sticker selection grid */}
      <div className="grid grid-cols-6 gap-2 pt-2 border-t border-[var(--color-border)]">
        {stickers.map((sticker) => {
          const isMainSelected = mainSticker?.id === sticker.id
          const isTabSelected = tabSticker?.id === sticker.id
          
          return (
            <button
              key={sticker.id}
              onClick={() => {
                if (!isMainSelected) onMainSelect(sticker)
                if (!isTabSelected) onTabSelect(sticker)
              }}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative
                ${isMainSelected || isTabSelected 
                  ? 'border-primary-500 ring-2 ring-primary-500/30' 
                  : 'border-transparent hover:border-primary-400'
                }`}
            >
              <img 
                src={sticker.src} 
                alt={`Sticker ${sticker.id}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-0.5 text-center">
                #{sticker.id}
              </div>
              {isMainSelected && (
                <div className="absolute top-0 left-0 bg-primary-500 text-white text-xs px-1 rounded-br">
                  Main
                </div>
              )}
              {isTabSelected && !isMainSelected && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-1 rounded-bl">
                  Tab
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}