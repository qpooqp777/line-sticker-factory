import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const TOPICS = {
  daily: {
    label: { 'zh-TW': '日常用語', en: 'Daily' },
    texts: ['早安', '晚安', '謝謝', '不客氣', '對不起', '沒問題', '好的', '收到', '拜託', '辛苦了', 'OK', '等等'],
    actions: ['揮手打招呼', '雙手合十', '鞠躬道歉', '比 OK 手勢', '點頭ok', '豎起大拇指', '搖頭拒絕', '舉手', '比噓', '拍拍自己肩膀', '比勝利手勢', '東張西望']
  },
  greeting: {
    label: { 'zh-TW': '打招呼', en: 'Greeting' },
    texts: ['哈囉', '嗨', '你好', '嗨嗨', '早安', '午安', '晚安', '歡迎', '好久不見', '好久不見！', '最近好嗎', '最近忙嗎'],
    actions: ['熱情揮手', '微笑鞠躬', '比愛心', '俏皮眨眼', '伸懶腰', '打哈欠', '睡覺中', '鼓掌歡迎', '激動擁抱', '拍肩打招呼', '疑惑歪頭', '壞笑']
  },
  holiday: {
    label: { 'zh-TW': '節日祝福', en: 'Holiday' },
    texts: ['新年快樂', '生日快樂', '聖誕快樂', '情人節快樂', '萬聖節快樂', '教師節快樂', '母親節快樂', '父親節快樂', '中秋節快樂', '端午節快樂', '過年好', '恭喜發財'],
    actions: ['放煙火', '拿蛋糕慶祝', '掛聖誕襪', '比愛心', '扮鬼嚇人', '拿康乃馨', '拿愛心', '拿領帶', '賞月', '划龍舟', '拿紅包', '撒金幣']
  },
  response: {
    label: { 'zh-TW': '回應篇', en: 'Response' },
    texts: ['收到', '了解', '好的', '沒問題', '了解喔', '好的好的', '收到收到', '了解了解', '好喔', '嗯嗯', '好呀', '可以'],
    actions: ['點頭', '豎起大拇指', '比 OK', '敬禮', '比愛心', '開心拍手', '點頭如搗蒜', '眨眼', '比耶', '微笑', '用力點頭', '比 ok 手勢']
  },
  office: {
    label: { 'zh-TW': '上班族', en: 'Office' },
    texts: ['上班了', '下班了', '加班中', '休息一下', '會議中', '好累', '開會了', '報告', '客戶來了', '下班囉', '放假了', '摸魚中'],
    actions: ['穿西裝敬禮', '甩公文包', '加班打字', '喝咖啡', '看報告', '趴桌睡覺', '站起來報告', '遞文件', '鞠躬迎接', '甩掉包包', '沙灘躺椅', '划手機']
  },
  couple: {
    label: { 'zh-TW': '老公老婆', en: 'Couple' },
    texts: ['老婆最棒', '老公最棒', '我愛你', '愛你喔', '親一個', '抱抱', '生氣了', '吃醋了', '對不起', '原諒我', '想你了', '晚安'],
    actions: ['單膝跪地', '比愛心', '雙手比愛心', '飛吻', '張開雙臂', '雙手叉腰', '轉頭不理', '鞠躬道歉', '抱著愛心', '送玫瑰花', '打瞌睡', '親吻']
  },
  meme: {
    label: { 'zh-TW': '迷因搞笑', en: 'Meme' },
    texts: ['笑死', '哭笑不得', '崩潰', '黑人問號', '等等', '蛤', '真的假的', '太神了', '帥爆', '醜爆', '喔不', '驚呆了'],
    actions: ['倒地大笑', '苦笑', '抱頭崩潰', '雙手撐下巴疑惑', '伸手指', '張大嘴震驚', '崇拜眼神', '耍帥', '嫌棄表情', '雙手抓頭', '瞪大眼睛', '暈倒']
  }
}

const STYLES = {
  cute: {
    label: { 'zh-TW': '通用 Q 版', en: 'Cute Q-style' },
    style: '可愛、活潑、2D平面',
    keywords: ['cute', 'chibi', 'kawaii', '2D flat style', 'rounded features', 'big eyes']
  },
  realistic: {
    label: { 'zh-TW': '寫實風格', en: 'Realistic' },
    style: '寫實、逼真、高畫質',
    keywords: ['realistic', 'detailed', 'high quality', 'photorealistic', 'professional']
  },
  '3d': {
    label: { 'zh-TW': '3D 立體', en: '3D Style' },
    style: '3D、卡通渲染、立體',
    keywords: ['3D render', 'cartoon style', '3D cartoon', ' Pixar style', 'three-dimensional']
  },
  doodle: {
    label: { 'zh-TW': '手繪塗鴉', en: 'Doodle' },
    style: '手繪、塗鴉、素描感',
    keywords: ['hand-drawn', 'sketch', 'doodle', 'rough lines', 'paper texture', 'artistic']
  },
  pixel: {
    label: { 'zh-TW': '像素風', en: 'Pixel Art' },
    style: '像素、8-bit、懷舊遊戲風',
    keywords: ['pixel art', '8-bit', 'retro game style', 'blocky', 'low resolution charm']
  },
  anime: {
    label: { 'zh-TW': '日系動漫', en: 'Anime' },
    style: '日系動漫、少年Jump風',
    keywords: ['anime style', 'Japanese manga', 'Shonen Jump style', 'vibrant colors', 'dynamic poses']
  }
}

const EXPRESSIONS = ['喜', '怒', '哀', '樂', '驚訝', '無語', '放空', '大哭', '得意', '害羞', '無奈', '滿足']

export default function PromptGenerator() {
  const { t, lang } = useLanguage()
  const [selectedTopic, setSelectedTopic] = useState('daily')
  const [selectedStyle, setSelectedStyle] = useState('cute')
  const [copied, setCopied] = useState(false)

  const generatePrompt = () => {
    const topic = TOPICS[selectedTopic]
    const style = STYLES[selectedStyle]
    
    // Build the prompt based on template
    const prompt = `請參考上傳圖片中的角色，生成 一張包含 12 個不同動作的角色貼圖集。

[角色與風格設定]
角色一致性：必須完全維持原圖主角的髮型、服裝、五官與整體外觀特徵。
構圖風格：畫面僅包含「角色 + 文字」，不包含任何場景背景。
畫風設定：【${style.style}】。
貼紙風格（去背友善）：角色與文字外圍皆需加入 粗白色外框（Sticker Style）。背景統一為 #00FF00（純綠色），不可有雜點。

[畫面佈局與尺寸規格]
整體為 4 × 3 佈局，共 12 張貼圖。總尺寸：2560 × 1664 px。
每張小圖約 370 × 320 px（自動等比縮放填滿排列）。每張貼圖四周預留約 0.2 cm Padding，避免畫面互相黏住。
鏡頭多樣化：全身 + 半身混合，必須包含正面、側面、俯角等不同視角。

[文字設計]
語言：台灣繁體中文
文字內容：${topic.texts.join('、')}
字型風格：可愛 Q 版字型，顏色鮮豔、易讀，多色彩混合，絕對禁止使用任何綠色（包含深綠、淺綠、螢光綠、藍綠）與黑色，因為會導致去背錯誤。請改用紅、藍、紫、橘、黃等高對比色彩。
排版：文字大小約佔單張貼圖 1/3，文字可適度壓在衣服邊角等非重要區域，不能遮臉，也不要使用任何emoji表情符號。

[表情與動作設計]
表情必須明顯、誇張、情緒豐富：${EXPRESSIONS.join('、')}
角色動作需與文字情境一致：${topic.actions.map((a, i) => `【${topic.texts[i]}配${a}】`).join('、')}
12 格皆須為 不同動作與不同表情。

[輸出格式]
一張大圖，內含 4 × 3 的 12 張貼圖。背景必須為 純綠色 #00FF00。每格角色 + 文字均附上粗白邊。`

    return prompt
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = generatePrompt()
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">0</span>
        {t('promptTitle')}
      </h2>

      <p className="text-sm text-[var(--color-text-secondary)]">
        {t('promptDesc')}
      </p>

      {/* Topic Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{lang === 'zh-TW' ? '選擇主題內容' : 'Select Topic'}</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.entries(TOPICS).map(([key, topic]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(key)}
              className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                selectedTopic === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'border-[var(--color-border)] hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              {topic.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{lang === 'zh-TW' ? '選擇畫風' : 'Select Style'}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(STYLES).map(([key, style]) => (
            <button
              key={key}
              onClick={() => setSelectedStyle(key)}
              className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                selectedStyle === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'border-[var(--color-border)] hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              {style.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Prompt Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{lang === 'zh-TW' ? '預覽 Prompt' : 'Prompt Preview'}</label>
          <button
            onClick={copyPrompt}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('promptCopied')}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {t('copyPrompt')}
              </>
            )}
          </button>
        </div>
        <div className="p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg">
          <pre className="text-xs whitespace-pre-wrap font-mono text-[var(--color-text-secondary)] max-h-48 overflow-y-auto">
            {generatePrompt()}
          </pre>
        </div>
      </div>
    </div>
  )
}
