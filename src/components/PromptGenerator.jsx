import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

// Text language options for prompt output
const TEXT_LANGUAGES = {
  'zh-TW': '台灣繁體中文',
  'zh-CN': '簡體中文',
  'ja': '日文',
  'en': '英文'
}

// Font style options
const FONT_STYLES = {
  cute: {
    label: { 'zh-TW': '可愛 Q 版', en: 'Cute Q-style' },
    desc: '可愛 Q 版字型，顏色鮮豔、易讀，多色彩混合，絕對禁止使用任何綠色（包含深綠、淺綠、螢光綠、藍綠）與黑色，因為會導致去背錯誤。請改用紅、藍、紫、橘、黃等高對比色彩。'
  },
  simple: {
    label: { 'zh-TW': '簡潔白字', en: 'Simple White' },
    desc: '簡潔白色粗體字，帶黑色描邊，清晰易讀。'
  },
  custom: {
    label: { 'zh-TW': '自訂', en: 'Custom' },
    desc: '' // 使用者自行輸入
  }
}

// Layout options
const SIZE_OPTIONS = {
  '1480x960': {
    label: { 'zh-TW': '1480×960 px', en: '1480×960 px' },
    desc: '1480 × 960 px',
    cell: '370 × 240 px',
  },
  '1200x896': {
    label: { 'zh-TW': '1200×896 px', en: '1200×896 px' },
    desc: '1200×896 px',
    cell: '~300 × 224 px',
  },
  '2560x1664': {
    label: { 'zh-TW': '2560×1664 px', en: '2560×1664 px' },
    desc: '2560×1664 px',
    cell: '~640 × 416 px',
  },
}

const LAYOUT_OPTIONS = {
  standard: {
    label: { 'zh-TW': '標準排版', en: 'Standard' },
    desc: '文字大小約佔單張貼圖 1/3，文字可適度壓在衣服邊角等非重要區域，不能遮臉，也不要使用任何emoji表情符號。'
  },
  compact: {
    label: { 'zh-TW': '緊湊排版', en: 'Compact' },
    desc: '文字較小，約佔單張貼圖 1/4，適合動作較大的貼圖。'
  }
}

// Sticker sets with detailed descriptions
const STICKER_SETS = {
  daily: {
    label: { 'zh-TW': '⚔️ 騎士戰鬥', en: '⚔️ Knight Battle' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '衝擊之暈', text: '暈爆你！', action: '騎士揮劍擊中敵人，頭上爆出星星暈眩效果', effect: '黃色衝擊波＋暈眩光圈' },
      { emoji: '2️⃣', title: '幹架模式 ON', text: '來打！', action: '低姿態持劍＋盾，腳踩裂地', effect: '地面裂開＋紅色氣場' },
      { emoji: '3️⃣', title: '重擊爆發', text: '給我倒！', action: '雙手重劍往下砍', effect: '巨大白色斬擊＋震動波紋' },
      { emoji: '4️⃣', title: '防禦反擊', text: '擋！', action: '舉盾硬扛攻擊，火花四濺', effect: '金屬撞擊火星' },
      { emoji: '5️⃣', title: '怒氣全開', text: '爆氣！', action: '騎士全身紅光，盔甲尖刺發亮', effect: '紅色能量噴發＋氣流旋轉' },
      { emoji: '6️⃣', title: '暈你第二次', text: '再暈！', action: '補一刀，敵人雙眼轉圈', effect: '旋轉星星＋暈眩波' },
      { emoji: '7️⃣', title: '開戰宣言', text: '開幹！', action: '指著前方怒吼', effect: '音波震動＋背景火焰' },
      { emoji: '8️⃣', title: '刺盔衝撞', text: '撞飛你！', action: '用肩膀尖刺盔甲衝撞', effect: '速度線＋撞擊爆炸' },
      { emoji: '9️⃣', title: '被打也要硬', text: '不痛！', action: '被打歪臉但硬撐', effect: '臉變形＋小火花' },
      { emoji: '🔟', title: '擊殺確認', text: '收掉！', action: '劍收回，敵人倒地', effect: '黑影消散＋勝利光' },
      { emoji: '1️⃣1️⃣', title: '嘲諷', text: '就這？', action: '雙手抱胸＋歪頭', effect: '冷笑＋小煙霧' },
      { emoji: '1️⃣2️⃣', title: '王者站姿', text: '誰還要來？', action: '踩在倒地敵人上，劍插地', effect: '霸氣威壓＋灰塵飄散' },
    ]
  },
  daily: {
    label: { 'zh-TW': '💬 日常用語', en: '💬 Daily' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '早安問候', text: '早安！', action: '伸懶腰打哈欠', effect: '太陽公公＋愛睏符號' },
      { emoji: '2️⃣', title: '晚安祝福', text: '晚安～', action: '抱著枕頭打瞌睡', effect: '月亮＋星星＋ZZZ' },
      { emoji: '3️⃣', title: '感謝回應', text: '謝謝！', action: '雙手合十鞠躬', effect: '愛心飄出' },
      { emoji: '4️⃣', title: '客氣回應', text: '不客氣～', action: '害羞撓頭', effect: '小花朵' },
      { emoji: '5️⃣', title: '道歉誠懇', text: '對不起！', action: '低頭認錯，眼眶泛淚', effect: '雨滴＋悔恨符號' },
      { emoji: '6️⃣', title: '沒問題', text: '沒問題！', action: '豎起大拇指比讚', effect: '勝利光芒' },
      { emoji: '7️⃣', title: '好的好的', text: '好的好的', action: '用力點頭', effect: '信心火花' },
      { emoji: '8️⃣', title: '收到收到', text: '收到！', action: '敬禮確認', effect: '收到標記' },
      { emoji: '9️⃣', title: '拜託拜託', text: '拜託！', action: '雙手合十拜託', effect: '拜託泡泡' },
      { emoji: '🔟', title: '辛苦慰問', text: '辛苦了！', action: '拍拍肩膀', effect: '愛心＋掌聲' },
      { emoji: '1️⃣1️⃣', title: 'OK確認', text: 'OK！', action: '比OK手勢微笑', effect: 'OK光芒' },
      { emoji: '1️⃣2️⃣', title: '等一下', text: '等等！', action: '伸出一隻手', effect: '時鐘＋等待符號' },
    ]
  },
  greeting: {
    label: { 'zh-TW': '👋 打招呼', en: '👋 Greeting' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '哈囉嗨', text: '哈囉！', action: '熱情揮手', effect: '旋轉光芒' },
      { emoji: '2️⃣', title: '嗨嗨俏皮', text: '嗨嗨～', action: '眨眼俏皮笑', effect: '愛心泡泡' },
      { emoji: '3️⃣', title: '你好', text: '你好！', action: '90度鞠躬', effect: '禮貌光環' },
      { emoji: '4️⃣', title: '嗨嗨嗨', text: '嗨嗨嗨！', action: '原地跳躍興奮', effect: '音符飛舞' },
      { emoji: '5️⃣', title: '早安你好', text: '早安！', action: '拿著咖啡杯', effect: '升起的太陽' },
      { emoji: '6️⃣', title: '午安問候', text: '午安～', action: '伸懶腰', effect: '太陽高照' },
      { emoji: '7️⃣', title: '晚安囉', text: '晚安～', action: '打哈欠揉眼', effect: '月亮＋星星' },
      { emoji: '8️⃣', title: '歡迎光臨', text: '歡迎！', action: '張開雙臂', effect: '彩帶飄落' },
      { emoji: '9️⃣', title: '好久不見', text: '好久不見！', action: '激動擁抱姿勢', effect: '愛心爆發' },
      { emoji: '🔟', title: '好久不見激動', text: '好久不見！', action: '眼睛閃光激動', effect: '愛心眼睛' },
      { emoji: '1️⃣1️⃣', title: '最近好嗎', text: '最近好嗎？', action: '歪頭疑惑', effect: '問號飄浮' },
      { emoji: '1️⃣2️⃣', title: '最近忙嗎', text: '最近忙嗎？', action: '擔心皺眉', effect: '疑問雲朵' },
    ]
  },
  meme: {
    label: { 'zh-TW': '😂 迷因搞笑', en: '😂 Meme' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '笑死', text: '笑死！', action: '倒地大笑捶地', effect: '眼淚狂飆＋笑到扭曲' },
      { emoji: '2️⃣', title: '哭笑不得', text: '哭笑不得', action: '表情扭曲複雜', effect: '又哭又笑臉' },
      { emoji: '3️⃣', title: '崩潰', text: '崩潰了！', action: '抱頭蹲下', effect: '火花四射＋裂開' },
      { emoji: '4️⃣', title: '黑人問號', text: '？？？', action: '雙手撐下巴疑惑', effect: '問號包圍' },
      { emoji: '5️⃣', title: '等等', text: '等等？？', action: '伸手暫停', effect: '時間暫停特效' },
      { emoji: '6️⃣', title: '蛤', text: '蛤？？', action: '張大嘴巴震驚', effect: '震驚音波' },
      { emoji: '7️⃣', title: '真的假的', text: '真的假的！', action: '眼睛瞪大', effect: '震驚閃電' },
      { emoji: '8️⃣', title: '太神了', text: '太神了！', action: '崇拜眼神跪拜', effect: '金光閃閃' },
      { emoji: '9️⃣', title: '帥爆', text: '帥爆了！', action: '戴墨鏡耍帥', effect: '帥氣光環' },
      { emoji: '🔟', title: '醜爆', text: '醜爆了！', action: '嫌棄捂眼', effect: '醜陋雲朵' },
      { emoji: '1️⃣1️⃣', title: '喔不', text: '喔不！！！', action: '雙手抓頭驚恐', effect: '閃電劈下' },
      { emoji: '1️⃣2️⃣', title: '驚呆了', text: '驚呆！', action: '嘴巴合不起來', effect: '暈眩漩渦' },
    ]
  },
  holiday: {
    label: { 'zh-TW': '🎉 節日祝福', en: '🎉 Holiday' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '新年快樂', text: '新年快樂！', action: '放鞭炮慶祝', effect: '煙火＋紅包' },
      { emoji: '2️⃣', title: '生日快樂', text: '生日快樂！', action: '拿蛋糕慶祝', effect: '蠟燭火焰＋彩帶' },
      { emoji: '3️⃣', title: '聖誕快樂', text: '聖誕快樂！', action: '戴聖誕帽', effect: '聖誕樹＋雪花' },
      { emoji: '4️⃣', title: '情人節快樂', text: '情人節快樂！', action: '比愛心', effect: '愛心飄落' },
      { emoji: '5️⃣', title: '萬聖節快樂', text: '萬聖節快樂！', action: '扮鬼臉', effect: '南瓜燈＋幽靈' },
      { emoji: '6️⃣', title: '教師節快樂', text: '教師節快樂！', action: '拿康乃馨', effect: '愛心泡泡' },
      { emoji: '7️⃣', title: '母親節快樂', text: '媽媽我愛您！', action: '擁抱媽媽', effect: '愛心花束' },
      { emoji: '8️⃣', title: '父親節快樂', text: '爸爸最棒！', action: '豎起大拇指', effect: '領帶圖案' },
      { emoji: '9️⃣', title: '中秋節快樂', text: '中秋節快樂！', action: '賞月', effect: '大月亮＋兔子' },
      { emoji: '🔟', title: '端午節快樂', text: '端午安康！', action: '拿粽子', effect: '龍舟划槳' },
      { emoji: '1️⃣1️⃣', title: '過年好', text: '過年好！', action: '拱手拜年', effect: '鞭炮＋紅包雨' },
      { emoji: '1️⃣2️⃣', title: '恭喜發財', text: '恭喜發財！', action: '撒金幣', effect: '金元寶＋紅包' },
    ]
  },
  response: {
    label: { 'zh-TW': '👍 回應篇', en: '👍 Response' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '收到', text: '收到！', action: '敬禮', effect: '閃電確認' },
      { emoji: '2️⃣', title: '了解', text: '了解！', action: '點頭', effect: '大拇指' },
      { emoji: '3️⃣', title: '好的', text: '好的！', action: '比OK', effect: '愛心' },
      { emoji: '4️⃣', title: '沒問題', text: '沒問題！', action: '拍胸脯', effect: '自信光環' },
      { emoji: '5️⃣', title: '了解喔', text: '了解喔～', action: '眨眼', effect: '俏皮愛心' },
      { emoji: '6️⃣', title: '好的好的', text: '好的好的', action: '用力點頭', effect: '認真火花' },
      { emoji: '7️⃣', title: '收到收到', text: '收到收到！', action: '敬禮x2', effect: '雙重確認' },
      { emoji: '8️⃣', title: '了解了解', text: '了解了解！', action: '連續點頭', effect: '知識光環' },
      { emoji: '9️⃣', title: '好喔', text: '好喔～', action: '微笑點頭', effect: '溫柔光圈' },
      { emoji: '🔟', title: '嗯嗯', text: '嗯嗯！', action: '嗯嗯迴音', effect: '回音符號' },
      { emoji: '1️⃣1️⃣', title: '好呀', text: '好呀！', action: '開心比耶', effect: '彩虹光芒' },
      { emoji: '1️⃣2️⃣', title: '可以', text: '可以！', action: '霸氣比讚', effect: 'power光芒' },
    ]
  },
  work: {
    label: { 'zh-TW': '💼 上班日常', en: '💼 Work Life' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '收到', text: '收到！', action: '迅速回覆email', effect: '閃電郵件' },
      { emoji: '2️⃣', title: '馬上改', text: '馬上改！', action: '瘋狂敲鍵盤', effect: '鍵盤火花' },
      { emoji: '3️⃣', title: '開會中', text: '開會中...', action: '嚴肅表情開會', effect: '會議記錄' },
      { emoji: '4️⃣', title: '加班中', text: '加班中...', action: '盯著電腦眼神死', effect: '深夜加班燈' },
      { emoji: '5️⃣', title: '準時下班', text: '下班！', action: '衝出門興奮', effect: '夕陽奔跑' },
      { emoji: '6️⃣', title: '心累', text: '心累...', action: '靈魂出竅趴桌', effect: '靈魂飄走' },
      { emoji: '7️⃣', title: '報告長官', text: '報告！', action: '立正敬禮', effect: '報告紙張' },
      { emoji: '8️⃣', title: '辛苦了', text: '辛苦了！', action: '拍拍對方肩膀', effect: '辛苦汗水' },
      { emoji: '9️⃣', title: '求放過', text: '求放過！', action: '雙手合十拜託', effect: '可憐泡泡' },
      { emoji: '🔟', title: '薪水呢', text: '薪水呢？', action: '伸手要錢', effect: '金幣閃閃' },
      { emoji: '1️⃣1️⃣', title: '不想上班', text: '不想上班...', action: '躺在床上裝死', effect: '躺平大字' },
      { emoji: '1️⃣2️⃣', title: '加油', text: '加油！', action: '握拳打氣', effect: '努力火焰' }
    ]
  },
  couple: {
    label: { 'zh-TW': '💕 老公老婆', en: '💕 Couple' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '愛你', text: '愛你！', action: '發射飛吻', effect: '愛心飛沫' },
      { emoji: '2️⃣', title: '想你', text: '想你～', action: '抱頭思念', effect: '思念星星' },
      { emoji: '3️⃣', title: '抱抱', text: '抱抱！', action: '張開雙手求抱', effect: '擁抱光圈' },
      { emoji: '4️⃣', title: '親親', text: '親親～', action: '嘟嘴要親', effect: '親親泡泡' },
      { emoji: '5️⃣', title: '寶貝', text: '寶貝！', action: '寵溺眼神', effect: '愛心眼睛' },
      { emoji: '6️⃣', title: '老公', text: '老公～', action: '撒嬌晃身體', effect: '老婆愛心' },
      { emoji: '7️⃣', title: '老婆', text: '老婆！', action: '溫柔摟肩', effect: '老公力量' },
      { emoji: '8️⃣', title: '在幹嘛', text: '在幹嘛？', action: '探頭詢問', effect: '問號泡泡' },
      { emoji: '9️⃣', title: '快回家', text: '快回家！', action: '等待門口', effect: '家門口' },
      { emoji: '🔟', title: '買給我', text: '買給我啦！', action: '拽著衣角撒嬌', effect: '購物欲望' },
      { emoji: '1️⃣1️⃣', title: '原諒我', text: '原諒我...', action: '跪算盤道歉', effect: '算盤珠' },
      { emoji: '1️⃣2️⃣', title: '啾咪', text: '啾咪💋', action: 'wink加愛心嘴', effect: '發射愛心' }
    ]
  },
  kamen: {
    label: { 'zh-TW': '⚡ 假面騎士', en: '⚡ Kamen Rider' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '假面騎士皮套風格要用金屬質感',
    stickers: [
      { title: '變身', text: '變身！', action: '變身腰帶舉起大喊「HenShin！」，光芒環繞', effect: '閃光環繞全身＋光芒爆發' },
      { title: '騎士踢', text: '騎士踢！', action: '空中全身旋轉踢招牌姿勢，腳踢向鏡頭', effect: '火焰踢軌跡＋旋風能量波' },
      { title: '騎士拳', text: '騎士拳！', action: '連續直拳攻擊，騎士拳出擊', effect: '衝擊波拳影' },
      { title: '準備戰鬥', text: '來吧！', action: '握拳舉手擺出戰鬥姿勢，警戒眼神', effect: '戰鬥氣場' },
      { title: '必殺踢', text: 'Finish！', action: '躍起空中側踢最高威力', effect: '火焰踢軌跡＋金色光芒' },
      { title: '升級拳', text: 'Rider Punch！', action: '騎士拳升級版，重拳出擊', effect: '金色衝擊波' },
      { title: '防禦架式', text: '少囉嗦！', action: '單手舉起擋住攻擊，霸氣眼神', effect: '防護光盾' },
      { title: '吃丸子在', text: '好吃！', action: '吃章魚小丸子，嘴巴鼓腮', effect: '蘑菇雲+小丸子在嘴裡' },
      { title: '勝利宣言', text: '我打！', action: '指向鏡頭宣布勝利，帥氣背影', effect: '勝利光芒背光' },
      { title: '被打', text: '可惡！', action: '被打單膝跪地咬牙', effect: '憤怒火花' },
      { title: '集氣中', text: 'henshin！', action: '雙手交叉擺出變身姿勢，光芒漸增', effect: '能量匯聚光芒' },
      { title: '最終型態', text: '最大值！', action: '全身金色光芒爆發，最強姿態', effect: '全域金色光芒' }
    ]
  },
  tackle: {
    label: { 'zh-TW': '⚡ 電波人Tackle', en: '⚡ Electrowave Tackle' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '電波人Tackle皮套風格要用金屬質感',
    stickers: [
      { title: '變身', text: '變身！', action: '變身腰帶舉起大喊，電波光芒環繞', effect: '閃光環繞全身＋電流爆發' },
      { title: '電波攻擊', text: '電波！', action: '雙手發射電波能量波', effect: '藍色電流波＋火花' },
      { title: '電波拳', text: '電波拳！', action: '帶電的騎士拳攻擊', effect: '藍色電流拳影' },
      { title: '電波踢', text: '電波踢！', action: '空中踢擊帶電波軌跡', effect: '藍色電流踢軌跡' },
      { title: '準備戰鬥', text: '來吧！', action: '握拳擺出戰鬥姿勢，電流環繞', effect: '電流能量氣場' },
      { title: '防禦', text: '擋！', action: '單手舉起產生電波護盾', effect: '藍色電波防護罩' },
      { title: '電波衝擊', text: '衝擊！', action: '全身電流衝撞攻擊', effect: '藍色衝擊波' },
      { title: '電波迴旋', text: '旋轉！', action: '身體旋轉帶電波攻擊', effect: '藍色旋風電流' },
      { title: '吃丸子在', text: '好吃！', action: '吃章魚小丸子，嘴巴鼓腮', effect: '蘑菇雲+小丸子在嘴裡' },
      { title: '勝利', text: '勝利！', action: '指向鏡頭宣布勝利，電流背光', effect: '藍色勝利光芒' },
      { title: '被打', text: '可惡！', action: '被打單膝跪地咬牙', effect: '憤怒火花' },
      { title: '最終型態', text: '最大值！', action: '全身藍色電流光芒爆發，最強姿態', effect: '全域藍色電流光芒' }
    ]
  },
  spider: {
    label: { 'zh-TW': '🕷️ 蜘蛛男', en: '🕷️ Spider Man' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '蜘蛛男皮套風格要有蜘蛛紋路與網絲',
    stickers: [
      { title: '蛛網束縛', text: '抓住了！', action: '雙手發射蛛網綑綁對手', effect: '白色蛛網絲線纏繞' },
      { title: '毒液攻擊', text: '中毒吧！', action: '張口噴射毒液', effect: '紫綠色毒液噴射' },
      { title: '爬牆尾行', text: '我從上面！', action: '倒掛天花板準備突襲', effect: '陰影籠罩＋蛛絲' },
      { title: '蛛絲陷阱', text: '踩到沒！', action: '地面佈滿蛛網陷阱', effect: '蛛網地面陷阱光芒' },
      { title: '蜘蛛崩擊', text: '崩擊！', action: '從上方跳下重腳踩擊', effect: '震動波＋蛛網裂痕' },
      { title: '八腳連攻', text: '哈！哈！哈！', action: '八隻利爪連續攻擊', effect: '爪痕光芒' },
      { title: '吸血咬', text: '咬！', action: '張嘴咬向對手脖子', effect: '尖牙光芒＋血滴' },
      { title: '蛛絲強襲', text: '衝！', action: '全身纏繞蛛絲高速旋轉衝撞', effect: '蛛絲龍捲風' },
      { title: '吃丸子在', text: '好吃！', action: '吃章魚小丸子，嘴巴鼓腮', effect: '蘑菇雲+小丸子在嘴裡' },
      { title: '勝利姿勢', text: '吾乃蜘蛛男！', action: '蜘蛛姿勢獰笑勝利', effect: '蛛網背景＋邪惡光芒' },
      { title: '被打', text: '可惡！', action: '被打倒退咬牙', effect: '憤怒火花' },
      { title: '蛛王全開', text: '蛛王降臨！', action: '全身巨大蜘蛛能量爆發', effect: '巨大蜘蛛幻影＋蛛網光芒' }
    ]
  },
  ultraman1: {
    label: { 'zh-TW': '🦸 鹹蛋超人1', en: '🦸 Ultraman 1' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '鹹蛋超人皮套風格要有金屬質感與發光線條',
    stickers: [
      { title: '斯派修姆光線', text: '看招！', action: '雙手呈十字交叉狀，發射光線', effect: '金色光線射向敵人＋能量波' },
      { title: '斯派修姆光線', text: '發射！', action: '雙手呈十字交叉狀，發射光線', effect: '金色光線射向敵人＋能量波' },
      { title: '斯派修姆光線', text: '正義必勝', action: '雙手呈十字交叉狀，勝利姿勢', effect: '金色光線＋勝利光芒' },
      { title: '能量指示燈閃爍', text: '我沒電了', action: '胸口圓燈變紅閃爍，表示時間不足', effect: '紅色閃爍警示燈' },
      { title: '能量指示燈閃爍', text: '時間不夠', action: '胸口圓燈變紅閃爍，表示時間不足', effect: '紅色閃爍警示燈' },
      { title: '能量指示燈閃爍', text: '撤退', action: '胸口圓燈變紅閃爍，表示時間不足', effect: '紅色閃爍警示燈' },
      { title: '能量指示燈閃爍', text: '快救我', action: '胸口圓燈變紅閃爍，求助姿勢', effect: '紅色閃爍警示燈＋求助光芒' },
      { title: '變身動作', text: '交給我吧！', action: '單手舉起變身器', effect: '變身光芒環繞' },
      { title: '變身動作', text: '變身！', action: '單手舉起變身器，變身特效', effect: '閃光環繞全身＋光芒爆發' },
      { title: '變身動作', text: '我來了', action: '單手舉起變身器', effect: '變身光芒環繞' },
      { title: '防禦姿勢', text: '拒絕', action: '雙手張開擋在身前', effect: '防護光盾' },
      { title: '防禦姿勢', text: '沒問題', action: '雙手張開擋在身前，自信表情', effect: '防護光盾＋自信光芒' },
    ]
  },
  ultraman2: {
    label: { 'zh-TW': '🦸 鹹蛋超人2', en: '🦸 Ultraman 2' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '鹹蛋超人皮套風格要有金屬質感與發光線條',
    stickers: [
      { title: '防禦姿勢', text: '包在我身上', action: '雙手張開擋在身前，自信表情', effect: '防護光盾＋自信光芒' },
      { title: '飛行姿勢', text: '衝啊！', action: '單手向前伸直，身體俯衝', effect: '飛行軌跡＋速度線' },
      { title: '飛行姿勢', text: '趕路中', action: '雙手向前伸直，身體俯衝', effect: '飛行軌跡＋速度線' },
      { title: '飛行姿勢', text: '我飛過去', action: '單手向前伸直，身體俯衝', effect: '飛行軌跡＋速度線' },
      { title: 'OK', text: '收到', action: '超人豎起大拇指', effect: '勝利光芒' },
      { title: 'OK', text: 'OK', action: '超人豎起大拇指', effect: '勝利光芒' },
      { title: '辛苦了', text: '辛苦了', action: '與怪獸握手或點頭示意', effect: '友情光芒' },
      { title: '抱歉', text: '抱歉', action: '超人或怪獸低頭鞠躬', effect: '歉意光芒' },
      { title: '想睡', text: '想睡', action: '怪獸（如皮古蒙）蓋被子睡覺', effect: 'ZZZ＋月亮' },
      { title: '晚安', text: '晚安', action: '怪獸蓋被子睡覺，月亮背景', effect: 'ZZZ＋月亮＋星星' },
      { title: '早安', text: '早安', action: '超人迎接太陽', effect: '太陽光芒' },
      { title: '加油', text: '加油', action: '超人握拳鼓勵', effect: '火焰鬥志' },
    ]
  },
  meme2: {
    label: { 'zh-TW': '🤣 迷因搞笑2', en: '🤣 Meme 2' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '無言', text: '...', action: '面無表情盯著前方', effect: '省略號飄浮' },
      { title: '累爆', text: '累死', action: '癱倒在地上', effect: '靈魂出竅' },
      { title: '頭痛', text: '頭好痛', action: '雙手抱頭痛苦', effect: '閃電劈頭' },
      { title: '不科學', text: '不科學！', action: '指著天空驚訝', effect: '問號爆炸' },
      { title: '算了', text: '算了...', action: '揮手放棄', effect: '灰塵飄散' },
      { title: '沒救了', text: '沒救了', action: '搖頭嘆氣', effect: '雨滴落下' },
      { title: '尷尬', text: '好尷尬', action: '冒汗僵住', effect: '尷尬黑線' },
      { title: '滾啦', text: '滾！', action: '指著遠處趕人', effect: '氣憤火焰' },
      { title: '不想理你', text: '懶得理', action: '轉頭不理', effect: '冷漠結界' },
      { title: '你說啥', text: '你說啥？', action: '瞇眼湊近', effect: '懷疑眼鏡' },
      { title: '嘖嘖嘖', text: '嘖嘖嘖', action: '搖頭咋舌', effect: '不認同符號' },
      { title: '攤手', text: '攤手', action: '雙手攤開無奈', effect: '無奈符號' },
    ]
  },
  meme3: {
    label: { 'zh-TW': '🤪 迷因搞笑3', en: '🤪 Meme 3' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '裝傻', text: '我不知道', action: '摸頭傻笑', effect: '問號泡泡' },
      { title: '裝酷', text: '酷吧', action: '戴墨鏡歪頭', effect: '帥氣光線' },
      { title: '震驚臉', text: '震驚！', action: '嘴巴張大到極限', effect: '閃電劈下' },
      { title: '不屑', text: '哼', action: '歪嘴不屑', effect: '冷笑氣場' },
      { title: '攤手無奈', text: '隨便啦', action: '雙手攤開聳肩', effect: '無奈符號' },
      { title: '想太多', text: '想太多', action: '托腮思考過度', effect: '思考漩渦' },
      { title: '不想面對', text: '不要！', action: '矇住眼睛', effect: '拒絕結界' },
      { title: '吃瓜群眾', text: '看熱鬧', action: '拿瓜子看戲', effect: '八卦光芒' },
      { title: '佛系', text: '隨緣', action: '雙手合十閉眼', effect: '佛光普照' },
      { title: '世風日下', text: '世風日下', action: '搖頭感嘆', effect: '嘆息雲朵' },
      { title: '智商堪憂', text: '智商...', action: '指著腦袋疑惑', effect: '燈泡熄滅' },
      { title: '給你錢', text: '拿去花', action: '撒錢手勢', effect: '金幣飄落' },
    ]
  },
  meme4: {
    label: { 'zh-TW': '😏 迷因搞笑4', en: '😏 Meme 4' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '敷衍', text: '喔喔', action: '敷衍點頭', effect: '隨便符號' },
      { title: '懷疑人生', text: '懷疑人生', action: '空洞眼神', effect: '虛無背景' },
      { title: '聽不懂', text: '聽不懂', action: '歪頭疑惑', effect: '問號雨' },
      { title: '沒興趣', text: '沒興趣', action: '打哈欠', effect: '無聊符號' },
      { title: '饒了我', text: '饒了我', action: '雙手合十拜託', effect: '求饒光芒' },
      { title: '看戲', text: '繼續', action: '抱著爆米花', effect: '戲院光芒' },
      { title: '不關我事', text: '不關我事', action: '雙手舉起撇清', effect: '無辜光圈' },
      { title: '你說得對', text: '你說得對', action: '敷衍點頭', effect: '敷衍符號' },
      { title: '真的假的', text: '真假？', action: '瞇眼懷疑', effect: '放大鏡' },
      { title: '再說吧', text: '再說吧', action: '揮手敷衍', effect: '延遲符號' },
      { title: '隨便你', text: '隨便你', action: '聳肩', effect: '隨意符號' },
      { title: '懶得理', text: '懶得理', action: '轉身不理', effect: '冷漠牆' },
    ]
  },
  meme5: {
    label: { 'zh-TW': '😐 迷因搞笑5', en: '😐 Meme 5' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '硬撐', text: '硬撐', action: '咬牙堅持', effect: '汗水滴落' },
      { title: '已讀不回', text: '已讀', action: '滑手機不回', effect: '訊息符號' },
      { title: '假裝忙', text: '忙中', action: '裝忙打字', effect: '忙碌符號' },
      { title: '沒空', text: '沒空', action: '看手錶', effect: '時鐘符號' },
      { title: '晚點', text: '晚點', action: '揮手拖延', effect: '延遲符號' },
      { title: '再說', text: '再說', action: '敷衍點頭', effect: '拖延符號' },
      { title: '不知道', text: '不知道', action: '搖頭攤手', effect: '問號符號' },
      { title: '問別人', text: '問別人', action: '指著別人', effect: '箭頭符號' },
      { title: '不確定', text: '不確定', action: '猶豫表情', effect: '猶豫符號' },
      { title: '看看吧', text: '看看吧', action: '托腮思考', effect: '思考符號' },
      { title: '再想想', text: '再想想', action: '摸下巴思考', effect: '燈泡符號' },
      { title: '可能吧', text: '可能吧', action: '聳肩不確定', effect: '不確定符號' },
    ]
  },
  meme6: {
    label: { 'zh-TW': '🙄 迷因搞笑6', en: '🙄 Meme 6' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '白眼', text: '白眼', action: '翻白眼', effect: '眼珠翻轉符號' },
      { title: '嘖', text: '嘖', action: '咋舌', effect: '嘖嘖符號' },
      { title: '不想聽', text: '不想聽', action: '摀住耳朵', effect: '靜音符號' },
      { title: '無所謂', text: '無所謂', action: '聳肩', effect: '隨便符號' },
      { title: '算了啦', text: '算了啦', action: '揮手放棄', effect: '放棄符號' },
      { title: '懶得計較', text: '懶得計較', action: '轉身不理', effect: '冷漠符號' },
      { title: '隨便', text: '隨便', action: '攤手', effect: '隨便符號' },
      { title: '你開心就好', text: '你開心就好', action: '敷衍微笑', effect: '假笑符號' },
      { title: '不想管', text: '不想管', action: '雙手舉起', effect: '放棄符號' },
      { title: '隨便你們', text: '隨便你們', action: '轉身走開', effect: '離開符號' },
      { title: '不關我事', text: '不關我事', action: '撇清關係', effect: '無辜符號' },
      { title: '我才不管', text: '我才不管', action: '雙手抱胸', effect: '拒絕符號' },
    ]
  },
  meme7: {
    label: { 'zh-TW': '😤 迷因搞笑7', en: '😤 Meme 7' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '生氣', text: '生氣！', action: '握拳怒視', effect: '火焰背景' },
      { title: '不爽', text: '不爽', action: '皺眉瞪眼', effect: '怒氣符號' },
      { title: '煩躁', text: '煩躁', action: '抓頭煩躁', effect: '混亂符號' },
      { title: '受不了', text: '受不了', action: '抱頭崩潰', effect: '爆炸符號' },
      { title: '火大', text: '火大', action: '全身冒火', effect: '火焰特效' },
      { title: '不跟你說了', text: '不說了', action: '轉身不理', effect: '憤怒符號' },
      { title: '懶得理你', text: '懶得理你', action: '揮手趕人', effect: '冷漠符號' },
      { title: '算了算了', text: '算了算了', action: '搖手放棄', effect: '放棄符號' },
      { title: '不想吵', text: '不想吵', action: '摀住耳朵', effect: '靜音符號' },
      { title: '隨便你說', text: '隨便你說', action: '翻白眼', effect: '敷衍符號' },
      { title: '我沒興趣', text: '沒興趣', action: '轉頭不理', effect: '無聊符號' },
      { title: '算了算了', text: '算了', action: '揮手放棄', effect: '放棄符號' },
    ]
  },
  meme8: {
    label: { 'zh-TW': '🤯 迷因搞笑8', en: '🤯 Meme 8' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '腦容量不足', text: '腦容量不足', action: '眼睛打轉', effect: 'CPU過熱符號' },
      { title: '當機中', text: '當機中', action: '眼神空洞', effect: '當機符號' },
      { title: '系統過載', text: '過載了', action: '抱頭痛苦', effect: '過載符號' },
      { title: '無法處理', text: '無法處理', action: '雙手攤開', effect: '錯誤符號' },
      { title: '思考中', text: '思考中...', action: '托腮思考', effect: '載入符號' },
      { title: '資訊爆炸', text: '爆炸了', action: '頭冒煙', effect: '爆炸符號' },
      { title: '太複雜', text: '太複雜', action: '皺眉苦惱', effect: '複雜符號' },
      { title: '超出範圍', text: '超出範圍', action: '搖頭放棄', effect: '超出符號' },
      { title: '不懂裝懂', text: '懂了', action: '點頭假裝', effect: '假裝符號' },
      { title: '假裝理解', text: '嗯嗯', action: '敷衍點頭', effect: '敷衍符號' },
      { title: '一知半解', text: '大概吧', action: '不確定表情', effect: '疑惑符號' },
      { title: '似懂非懂', text: '喔...', action: '困惑表情', effect: '問號符號' },
    ]
  },
  meme9: {
    label: { 'zh-TW': '🤔 迷因搞笑9', en: '🤔 Meme 9' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '這什麼', text: '這什麼？', action: '指著前方疑惑', effect: '問號爆炸' },
      { title: '什麼情況', text: '什麼情況？', action: '歪頭困惑', effect: '疑惑符號' },
      { title: '怎麼回事', text: '怎麼回事？', action: '張大嘴巴', effect: '驚訝符號' },
      { title: '搞不清楚', text: '搞不清楚', action: '搖頭困惑', effect: '混亂符號' },
      { title: '一頭霧水', text: '霧煞煞', action: '抓頭困惑', effect: '霧氣符號' },
      { title: '完全不懂', text: '完全不懂', action: '攤手困惑', effect: '不懂符號' },
      { title: '不明所以', text: '不明所以', action: '茫然表情', effect: '茫然符號' },
      { title: '摸不著頭緒', text: '摸不著頭緒', action: '摸頭困惑', effect: '問號符號' },
      { title: '搞不懂', text: '搞不懂', action: '皺眉困惑', effect: '困惑符號' },
      { title: '想不通', text: '想不通', action: '托腮苦惱', effect: '思考符號' },
      { title: '看不懂', text: '看不懂', action: '瞇眼困惑', effect: '問號符號' },
      { title: '聽不明白', text: '聽不明白', action: '歪頭不解', effect: '疑惑符號' },
    ]
  },
  meme10: {
    label: { 'zh-TW': '😑 迷因搞笑10', en: '😑 Meme 10' },
    faceStyle: '寫實照片風格，不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { title: '心如止水', text: '心如止水', action: '面無表情', effect: '平靜符號' },
      { title: '看破紅塵', text: '看破紅塵', action: '閉眼淡然', effect: '禪意符號' },
      { title: '一切隨緣', text: '隨緣', action: '雙手合十', effect: '佛光符號' },
      { title: '不強求', text: '不強求', action: '攤手淡然', effect: '放下符號' },
      { title: '順其自然', text: '順其自然', action: '微笑點頭', effect: '自然符號' },
      { title: '莫問', text: '莫問', action: '閉眼不語', effect: '禪意符號' },
      { title: '不強求了', text: '不強求了', action: '搖頭淡然', effect: '放下符號' },
      { title: '看開了', text: '看開了', action: '微笑淡然', effect: '開悟符號' },
      { title: '放下了', text: '放下了', action: '雙手放開', effect: '放下符號' },
      { title: '不計較', text: '不計較', action: '揮手淡然', effect: '大度符號' },
      { title: '不在意', text: '不在意', action: '聳肩淡然', effect: '淡然符號' },
      { title: '隨風去', text: '隨風去', action: '雙手張開', effect: '風吹符號' },
    ]
  },
  knight: {
    label: { 'zh-TW': '⚔️ 騎士戰鬥', en: '⚔️ Knight Battle' },
    faceStyle: '寫實照片風格不用重新手繪',
    clothingStyle: '服裝用手繪方式呈現',
    stickers: [
      { emoji: '1️⃣', title: '衝擊之暈', text: '暈爆你！', action: '騎士揮劍擊中敵人，頭上爆出星星暈眩效果', effect: '黃色衝擊波＋暈眩光圈' },
      { emoji: '2️⃣', title: '幹架模式 ON', text: '來打！', action: '低姿態持劍＋盾，腳踩裂地', effect: '地面裂開＋紅色氣場' },
      { emoji: '3️⃣', title: '重擊爆發', text: '給我倒！', action: '雙手重劍往下砍', effect: '巨大白色斬擊＋震動波紋' },
      { emoji: '4️⃣', title: '防禦反擊', text: '擋！', action: '舉盾硬扛攻擊，火花四濺', effect: '金屬撞擊火星' },
      { emoji: '5️⃣', title: '怒氣全開', text: '爆氣！', action: '騎士全身紅光，盔甲尖刺發亮', effect: '紅色能量噴發＋氣流旋轉' },
      { emoji: '6️⃣', title: '暈你第二次', text: '再暈！', action: '補一刀，敵人雙眼轉圈', effect: '旋轉星星＋暈眩波' },
      { emoji: '7️⃣', title: '開戰宣言', text: '開幹！', action: '指著前方怒吼', effect: '音波震動＋背景火焰' },
      { emoji: '8️⃣', title: '刺盔衝撞', text: '撞飛你！', action: '用肩膀尖刺盔甲衝撞', effect: '速度線＋撞擊爆炸' },
      { emoji: '9️⃣', title: '被打也要硬', text: '不痛！', action: '被打歪臉但硬撐', effect: '臉變形＋小火花' },
      { emoji: '🔟', title: '擊殺確認', text: '收掉！', action: '劍收回，敵人倒地', effect: '黑影消散＋勝利光' },
      { emoji: '1️⃣1️⃣', title: '嘲諷', text: '就這？', action: '雙手抱胸＋歪頭', effect: '冷笑＋小煙霧' },
      { emoji: '1️⃣2️⃣', title: '王者站姿', text: '誰還要來？', action: '踩在倒地敵人上，劍插地', effect: '霸氣威壓＋灰塵飄散' },
    ]
  }
}

const STYLES = {
  cute: {
    label: { 'zh-TW': '通用 Q 版', en: 'Cute Q-style' },
    style: '可愛、活潑、2D平面',
  },
  realistic: {
    label: { 'zh-TW': '寫實風格', en: 'Realistic' },
    style: '寫實、逼真、高畫質',
  },
  '3d': {
    label: { 'zh-TW': '3D 立體', en: '3D Style' },
    style: '3D、卡通渲染、立體',
  },
  doodle: {
    label: { 'zh-TW': '手繪塗鴉', en: 'Doodle' },
    style: '手繪、塗鴉、素描感',
  },
  pixel: {
    label: { 'zh-TW': '像素風', en: 'Pixel Art' },
    style: '像素、8-bit、懷舊遊戲風',
  },
  anime: {
    label: { 'zh-TW': '日系動漫', en: 'Anime' },
    style: '日系動漫、少年Jump風',
  },
}

// Preview component with highlighted dynamic parts
function PromptPreview({ stickerSet, style, faceRealistic, clothingHanddrawn, twoHeaded, textLanguage, fontStyle, customFontDesc, layoutOption, sizeOption }) {
  const data = STICKER_SETS[stickerSet]
  const styleData = STYLES[style]

  // Build style note text based on checkboxes
  const styleNote = (() => {
    const parts = []
    if (faceRealistic) parts.push('臉部用實際照片 寫實 ,不用重新手繪')
    if (clothingHanddrawn) parts.push('服裝可以用手繪')
    return parts.length > 0 ? parts.join('，') : null
  })()
  const twoHeadNote = twoHeaded ? '人物符合二頭身比例（頭身比 2:1），頭大身小。' : null

  return (
    <>
      {/* Title */}
      <span className="text-primary-500 font-bold text-sm">✅ 12 格角色貼圖集｜Prompt 建議</span>
      {'\n'}
      {'\n'}
      <mark className="text-red-500 font-bold text-lg bg-transparent">請參考上傳圖片中的角色</mark>，生成 一張包含 12 個不同動作的角色貼圖集。<mark className="text-red-500 font-bold text-base bg-transparent">也不要使用任何emoji表情符號。</mark>
      {'\n'}
      {'\n'}
      {/* Style section */}
      <span className="text-neutral-500">[角色與風格設定]</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">角色一致性：必須完全維持原圖主角的髮型、服裝、五官與整體外觀特徵。</span>
      {styleNote && <mark className="text-red-500 font-bold text-base bg-transparent">{styleNote}</mark>}
      {twoHeadNote && <><span> </span><mark className="text-red-500 font-bold text-base bg-transparent">{twoHeadNote}</mark></>}
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">構圖風格：畫面僅包含「角色 + 文字」，不包含任何場景背景。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">畫風設定：【<mark className="text-red-500 font-bold text-base bg-transparent">{styleData.style}</mark>】。</span>
      {styleNote && <mark className="text-red-500 font-bold text-base bg-transparent">{styleNote}</mark>}
      {twoHeadNote && <><span> </span><mark className="text-red-500 font-bold text-base bg-transparent">{twoHeadNote}</mark></>}
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">貼紙風格（去背友善）：角色與文字外圍皆需加入 粗白色外框（Sticker Style）。背景統一為 #00FF00（純綠色），不可有雜點。特效勿使用文字顯示（使用手繪製圖案）。</span>
      {'\n'}
      {'\n'}
      {/* Layout section */}
      <span className="text-neutral-500">[畫面佈局與尺寸規格]</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">整體為 4 × 3 佈局，共 12 張貼圖。總尺寸：{SIZE_OPTIONS[sizeOption].desc}。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">每張小圖四周預留約 0.2 cm Padding，避免畫面互相黏住。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">鏡頭多樣化：全身 + 半身混合，必須包含正面、側面、俯角等不同視角。</span>
      {'\n'}
      {'\n'}
      {/* Text design section */}
      <span className="text-neutral-500">[文字設計]</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">語言：【<mark className="text-red-500 font-bold text-base bg-transparent">{TEXT_LANGUAGES[textLanguage]}</mark>】</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">文字內容請使用{TEXT_LANGUAGES[textLanguage]}書寫，包含每張貼圖上的文字與標題。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">字型風格：【<mark className="text-red-500 font-bold text-base bg-transparent">{fontStyle === 'custom' ? customFontDesc : FONT_STYLES[fontStyle].desc}</mark>】</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">排版：【<mark className="text-red-500 font-bold text-base bg-transparent">{LAYOUT_OPTIONS[layoutOption].desc}</mark>】</span>
      {'\n'}
      {'\n'}
      {/* Stickers detail */}
      {data.stickers.map((s, i) => (
        <span key={i}>
          【<mark className="text-red-500 font-bold text-base bg-transparent">{s.title}</mark>】
          {'\n'}
          <span className="text-neutral-600 dark:text-neutral-400">文字：</span><mark className="text-red-500 font-bold text-base bg-transparent">{s.text}</mark>
          {'\n'}
          {'\n'}
        </span>
      ))}
      {'\n'}
      {/* Output format */}
      <span className="text-neutral-500">[輸出格式]</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">一張大圖，內含 4 × 3 的 12 張貼圖。背景必須為 純綠色 #00FF00。每格角色 + 文字均附上粗白邊。</span>
    </>
  )
}

export default function PromptGenerator() {
  const { t, lang } = useLanguage()
  const [selectedSet, setSelectedSet] = useState('daily')
  const [selectedStyle, setSelectedStyle] = useState('cute')
  const [copied, setCopied] = useState(false)
  const [faceRealistic, setFaceRealistic] = useState(true) // 預設勾選：頭像用寫實
  const [clothingHanddrawn, setClothingHanddrawn] = useState(true) // 預設勾選：衣服手繪
  const [twoHeaded, setTwoHeaded] = useState(true) // 預設勾選：人物符合二頭身
  const [textLanguage, setTextLanguage] = useState('zh-TW') // 預設：台灣繁體中文
  const [fontStyle, setFontStyle] = useState('cute') // 預設：可愛 Q 版字型
  const [customFontDesc, setCustomFontDesc] = useState('') // 自訂字型描述
  const [layoutOption, setLayoutOption] = useState('standard') // 預設：標準排版
const [sizeOption, setSizeOption] = useState('1480x960') // 預設：1480×960

  const generatePrompt = () => {
    const data = STICKER_SETS[selectedSet]
    const style = STYLES[selectedStyle]
    
    // Build style note text
    const parts = []
    if (faceRealistic) parts.push('臉部用實際照片 寫實 ,不用重新手繪')
    if (clothingHanddrawn) parts.push('服裝可以用手繪')
    const styleNote = parts.length > 0 ? parts.join('，') : ''
    const twoHeadNote = twoHeaded ? '人物符合二頭身比例（頭身比 2:1），頭大身小。' : ''
    
    let prompt = `✅ 12 格角色貼圖集｜Prompt 建議

請參考上傳圖片中的角色，生成 一張包含 12 個不同動作的角色貼圖集，也不要使用任何emoji表情符號。

[角色與風格設定]
角色一致性：必須完全維持原圖主角的髮型、服裝、五官與整體外觀特徵。${styleNote}${twoHeadNote ? ' ' + twoHeadNote : ''}
構圖風格：畫面僅包含「角色 + 文字」，不包含任何場景背景。
畫風設定：【${style.style}】${styleNote}
貼紙風格（去背友善）：角色與文字外圍皆需加入 粗白色外框（Sticker Style）。背景統一為 #00FF00（純綠色），不可有雜點。特效勿使用文字顯示（使用手繪製圖案）。

[畫面佈局與尺寸規格]
整體為 4 × 3 佈局，共 12 張貼圖。總尺寸：${SIZE_OPTIONS[sizeOption].desc}。
每張小圖四周預留約 0.2 cm Padding，避免畫面互相黏住。
鏡頭多樣化：全身 + 半身混合，必須包含正面、側面、俯角等不同視角。

[文字設計]
語言：【${TEXT_LANGUAGES[textLanguage]}】
文字內容請使用${TEXT_LANGUAGES[textLanguage]}書寫，包含每張貼圖上的文字與標題。
字型風格：【${fontStyle === 'custom' ? customFontDesc : FONT_STYLES[fontStyle].desc}】
排版：【${LAYOUT_OPTIONS[layoutOption].desc}】

`

    // Add each sticker detail
    data.stickers.forEach((s) => {
      prompt += `【${s.title}】
文字：${s.text}
`
    })

    prompt += `[輸出格式]
一張大圖，內含 4 × 3 的 12 張貼圖。背景必須為 純綠色 #00FF00。每格角色 + 文字均附上粗白邊。`

    return prompt
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
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

  const openInGemini = () => {
    const prompt = generatePrompt()
    const encodedPrompt = encodeURIComponent(prompt)
    const url = `https://gemini.google.com/app?prompt=${encodedPrompt}`
    window.open(url, '_blank')
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

      {/* Sticker Set Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{lang === 'zh-TW' ? '選擇貼圖主題' : 'Select Sticker Set'}</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(STICKER_SETS).map(([key, set]) => (
            <button
              key={key}
              onClick={() => setSelectedSet(key)}
              className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                selectedSet === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'border-[var(--color-border)] hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              {set.label[lang]}
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

      {/* Face/Clothing Style Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{lang === 'zh-TW' ? '風格備註（選填）' : 'Style Notes (Optional)'}</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={faceRealistic}
              onChange={(e) => setFaceRealistic(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--color-border)] text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm">{lang === 'zh-TW' ? '頭像用寫實' : 'Face Realistic'}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={clothingHanddrawn}
              onChange={(e) => setClothingHanddrawn(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--color-border)] text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm">{lang === 'zh-TW' ? '衣服手繪' : 'Clothing Hand-drawn'}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={twoHeaded}
              onChange={(e) => setTwoHeaded(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--color-border)] text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm">{lang === 'zh-TW' ? '二頭身' : '2-Head Proportion'}</span>
          </label>
        </div>
        {(faceRealistic || clothingHanddrawn) && (
          <p className="text-xs text-red-500 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
            → {faceRealistic ? '臉部用實際照片 寫實 ,不用重新手繪' : ''}{faceRealistic && clothingHanddrawn ? '，' : ''}{clothingHanddrawn ? '服裝可以用手繪' : ''}
          </p>
        )}

        {/* Language selector for text design */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-sm font-medium">{lang === 'zh-TW' ? '文字語言：' : 'Text Language:'}</span>
          <select
            value={textLanguage}
            onChange={(e) => setTextLanguage(e.target.value)}
            className="px-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(TEXT_LANGUAGES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {/* Font style selector */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-sm font-medium">{lang === 'zh-TW' ? '字型風格：' : 'Font Style:'}</span>
          <select
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
            className="px-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(FONT_STYLES).map(([key, val]) => (
              <option key={key} value={key}>{val.label['zh-TW']}</option>
            ))}
          </select>
        </div>

        {/* Custom font description input */}
        {fontStyle === 'custom' && (
          <div className="mt-2">
            <textarea
              value={customFontDesc}
              onChange={(e) => setCustomFontDesc(e.target.value)}
              placeholder={lang === 'zh-TW' ? '輸入自訂字型描述...' : 'Enter custom font description...'}
              className="w-full px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              rows={2}
            />
          </div>
        )}

        {/* Size selector */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-sm font-medium">{lang === 'zh-TW' ? '尺寸：' : 'Size:'}</span>
          <select
            value={sizeOption}
            onChange={(e) => setSizeOption(e.target.value)}
            className="px-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(SIZE_OPTIONS).map(([key, val]) => (
              <option key={key} value={key}>{val.label['zh-TW']}</option>
            ))}
          </select>
        </div>

        {/* Layout selector */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-sm font-medium">{lang === 'zh-TW' ? '排版：' : 'Layout:'}</span>
          <select
            value={layoutOption}
            onChange={(e) => setLayoutOption(e.target.value)}
            className="px-3 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {Object.entries(LAYOUT_OPTIONS).map(([key, val]) => (
              <option key={key} value={key}>{val.label['zh-TW']}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Generated Prompt Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{lang === 'zh-TW' ? '預覽 Prompt' : 'Prompt Preview'}</label>
          <button
            onClick={openInGemini}
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            title="用 Gemini 生成"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Gemini
          </button>
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
          <div className="text-xs whitespace-pre-wrap font-mono text-[var(--color-text-secondary)] max-h-64 overflow-y-auto">
            <PromptPreview stickerSet={selectedSet} style={selectedStyle} faceRealistic={faceRealistic} clothingHanddrawn={clothingHanddrawn} twoHeaded={twoHeaded} textLanguage={textLanguage} fontStyle={fontStyle} customFontDesc={customFontDesc} layoutOption={layoutOption} sizeOption={sizeOption} />
          </div>
        </div>
      </div>
    </div>
  )
}
