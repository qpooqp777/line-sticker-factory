import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Header() {
  const { lang, setLang, t } = useLanguage()
  const { isDark, toggle } = useTheme()

  return (
    <header className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--color-text)]">{t('title')}</h1>
              <p className="text-sm text-[var(--color-text-secondary)]">{t('subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center bg-[var(--color-bg)] rounded-lg p-1 border border-[var(--color-border)]">
              <button
                onClick={() => setLang('zh-TW')}
                className={`lang-btn ${lang === 'zh-TW' ? 'active' : ''}`}
              >
                繁中
              </button>
              <button
                onClick={() => setLang('en')}
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              >
                EN
              </button>
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="mode-btn flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-primary-500"
              title={isDark ? t('lightMode') : t('darkMode')}
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}