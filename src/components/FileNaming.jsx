import { useLanguage } from '../contexts/LanguageContext'

export default function FileNaming({ startNumber, onStartNumberChange }) {
  const { t } = useLanguage()

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
        {t('namingTitle')}
      </h2>
      
      <p className="text-sm text-[var(--color-text-secondary)]">{t('namingDesc')}</p>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{t('startNumber')}</label>
        <input
          type="number"
          min="1"
          max="100"
          value={startNumber}
          onChange={(e) => onStartNumberChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] text-center"
        />
        <span className="text-xs text-[var(--color-text-secondary)]">{t('startNumberHint')}</span>
      </div>

      <div className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface)] px-3 py-2 rounded-lg">
        檔名預覽：{startNumber}.png, {startNumber + 1}.png, ... {startNumber + 11}.png
      </div>
    </div>
  )
}