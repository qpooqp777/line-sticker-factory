export const translations = {
  'zh-TW': {
    title: 'LINE 貼圖自動化助手',
    subtitle: '一鍵切圖 + 去背，輕鬆製作 LINE 貼圖包',
    
    // Step 1 - Upload
    step1Title: 'Step 1：上傳網格圖',
    step1Desc: '請上傳 AI 生成的 4×3 網格圖（JPG/PNG）',
    uploadHint: '拖放圖片到此處，或點擊選擇',
    sizeRequirement: '總尺寸：2560×1664 或 1200×896 px，共 12 張貼圖',
    sizeWarning: '⚠️ 建議尺寸為 2560×1664 或 1200×896 px，當前：{width}×{height}',
    clearAll: '清除',
    
    // Step 2 - Processing
    step2Title: 'Step 2：切圖 + 去背',
    processingTitle: '正在處理...',
    slicing: '切分中...',
    removingBg: '去背中...',
    done: '完成！',
    
    // Stickers grid
    stickersTitle: '切分結果（共 12 張貼圖）',
    stickerNum: '貼圖 #{num}',
    
    // Main/Tab selection
    mainTabTitle: 'Step 3：選擇封面圖',
    mainTabDesc: '挑選一張最能代表你角色的封面圖',
    mainLabel: 'Main 圖（主圖）',
    tabLabel: 'Tab 圖（聊天室標籤）',
    mainTabNote: '建議使用同一張貼圖作為 Main 和 Tab',
    
    // File naming
    namingTitle: 'Step 4：檔名設定',
    namingDesc: '設定下載檔案的起始編號',
    startNumber: '起始編號',
    startNumberHint: '第二組貼圖請設為 13，方便整合',
    
    // Actions
    downloadBtn: '下載全部（ZIP）',
    downloading: '下載中...',
    downloadNote: '將下載 {count} 張貼圖（含 Main、Tab）',
    
    // Settings
    settingsTitle: '設定',
    lightMode: '淺色模式',
    darkMode: '深色模式',
    removeBgOption: '自動去背',
    removeBgHint: '去除白色背景，變成透明 PNG',
    
    // Messages
    successMessage: '✅ ZIP 檔案已下載！',
    errorNoImage: '請先上傳網格圖',
    errorFileType: '僅支援 JPG、PNG 格式',
    
    // Preview
    previewTitle: '預覽',
    originalImage: '原始網格圖',
    clickToSelect: '點擊選擇',
    selected: '已選擇',
    
    // Prompt helper
    promptTitle: 'AI 提示詞大師',
    promptDesc: '還沒有圖片？用這些 Prompt 生圖吧！',
    copyPrompt: '複製 Prompt',
    promptCopied: '已複製！',
  },
  en: {
    title: 'LINE Sticker Automation Assistant',
    subtitle: 'Auto slice + remove background, create LINE sticker packs easily',
    
    // Step 1 - Upload
    step1Title: 'Step 1: Upload Grid Image',
    step1Desc: 'Upload your AI-generated 4×3 grid image (JPG/PNG)',
    uploadHint: 'Drag & drop image here, or click to select',
    sizeRequirement: 'Total size: 2560×1664 or 1200×896 px, 12 stickers',
    sizeWarning: '⚠️ Recommended size: 2560×1664 or 1200×896 px, current: {width}×{height}',
    clearAll: 'Clear',
    
    // Step 2 - Processing
    step2Title: 'Step 2: Slice + Remove Background',
    processingTitle: 'Processing...',
    slicing: 'Slicing...',
    removingBg: 'Removing background...',
    done: 'Done!',
    
    // Stickers grid
    stickersTitle: 'Sliced Results (12 stickers)',
    stickerNum: 'Sticker #{num}',
    
    // Main/Tab selection
    mainTabTitle: 'Step 3: Select Cover Images',
    mainTabDesc: 'Pick a sticker that best represents your character',
    mainLabel: 'Main Image',
    tabLabel: 'Tab Image',
    mainTabNote: 'Recommend using the same sticker for Main and Tab',
    
    // File naming
    namingTitle: 'Step 4: File Naming',
    namingDesc: 'Set the starting number for downloaded files',
    startNumber: 'Starting Number',
    startNumberHint: 'Set to 13 for second sticker pack',
    
    // Actions
    downloadBtn: 'Download All (ZIP)',
    downloading: 'Downloading...',
    downloadNote: 'Will download {count} stickers (including Main, Tab)',
    
    // Settings
    settingsTitle: 'Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    removeBgOption: 'Auto Remove Background',
    removeBgHint: 'Remove white background to transparent PNG',
    
    // Messages
    successMessage: '✅ ZIP file downloaded!',
    errorNoImage: 'Please upload a grid image first',
    errorFileType: 'Only JPG and PNG formats supported',
    
    // Preview
    previewTitle: 'Preview',
    originalImage: 'Original Grid Image',
    clickToSelect: 'Click to select',
    selected: 'Selected',
    
    // Prompt helper
    promptTitle: 'AI Prompt Master',
    promptDesc: 'No image yet? Use these prompts to generate!',
    copyPrompt: 'Copy Prompt',
    promptCopied: 'Copied!',
  }
}

// Grid configuration: 4 columns × 3 rows = 12 stickers
// Supported sizes: 2560×1664 (large) or 1200×896 (small)
export const GRID_CONFIG = {
  columns: 4,
  rows: 3,
  sizes: [
    { width: 2560, height: 1664 },
    { width: 1200, height: 896 },
  ],
  stickerCount: 12,
}

// Get sticker size based on upload image size
// LINE sticker sizes for export
export const LINE_STICKER_SIZES = {
  main: { width: 240, height: 240 },
  tab: { width: 51, height: 51 },
  sticker: { width: 370, height: 320 },
}

export const getStickerSize = (totalWidth, totalHeight) => ({
  width: totalWidth / GRID_CONFIG.columns,
  height: totalHeight / GRID_CONFIG.rows,
})