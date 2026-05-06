import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

// Sticker sets with detailed descriptions
const STICKER_SETS = {
  knight: {
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
function PromptPreview({ stickerSet, style, faceRealistic, clothingHanddrawn }) {
  const data = STICKER_SETS[stickerSet]
  const styleData = STYLES[style]

  // Build style note text based on checkboxes
  const styleNote = (() => {
    const parts = []
    if (faceRealistic) parts.push('臉部用實際照片 寫實 ,不用重新手繪')
    if (clothingHanddrawn) parts.push('服裝可以用手繪')
    return parts.length > 0 ? parts.join('，') : null
  })()

  return (
    <>
      {/* Title */}
      <span className="text-primary-500 font-bold text-sm">✅ 12 格角色貼圖集｜Prompt 建議</span>
      {'\n'}
      {'\n'}
      請參考上傳圖片中的角色，生成 一張包含 12 個不同動作的角色貼圖集。<mark className="text-red-500 font-bold text-base bg-transparent">也不要使用任何emoji表情符號。</mark>
      {'\n'}
      {'\n'}
      {/* Style section */}
      <span className="text-neutral-500">[角色與風格設定]</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">角色一致性：必須完全維持原圖主角的髮型、服裝、五官與整體外觀特徵。</span>
      {styleNote && <mark className="text-red-500 font-bold text-base bg-transparent">{styleNote}</mark>}
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">構圖風格：畫面僅包含「角色 + 文字」，不包含任何場景背景。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">畫風設定：【<mark className="text-red-500 font-bold text-base bg-transparent">{styleData.style}</mark>】。</span>
      {styleNote && <mark className="text-red-500 font-bold text-base bg-transparent">{styleNote}</mark>}
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">貼紙風格（去背友善）：角色與文字外圍皆需加入 粗白色外框（Sticker Style）。背景統一為 #00FF00（純綠色），不可有雜點。</span>
      {'\n'}
      {'\n'}
      {/* Layout section */}
      <span className="text-neutral-500">[畫面佈局與尺寸規格]</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">整體為 4 × 3 佈局，共 12 張貼圖。總尺寸：2560×1664 px。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">每張小圖約 370 × 320 px（自動等比縮放填滿排列）。每張貼圖四周預留約 0.2 cm Padding，避免畫面互相黏住。</span>
      {'\n'}
      <span className="text-neutral-600 dark:text-neutral-400">鏡頭多樣化：全身 + 半身混合，必須包含正面、側面、俯角等不同視角。</span>
      {'\n'}
      {'\n'}
      {/* Stickers detail */}
      {data.stickers.map((s, i) => (
        <span key={i}>
          【<mark className="text-red-500 font-bold text-base bg-transparent">{s.title}</mark>】
          {'\n'}
          <span className="text-neutral-600 dark:text-neutral-400">文字：</span><mark className="text-red-500 font-bold text-base bg-transparent">{s.text}</mark>
          {'\n'}
          <span className="text-neutral-600 dark:text-neutral-400">動作：</span><mark className="text-red-500 font-bold text-base bg-transparent">{s.action}</mark>
          {'\n'}
          <span className="text-neutral-600 dark:text-neutral-400">特效：</span><mark className="text-red-500 font-bold text-base bg-transparent">{s.effect}</mark>
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
  const [selectedSet, setSelectedSet] = useState('knight')
  const [selectedStyle, setSelectedStyle] = useState('cute')
  const [copied, setCopied] = useState(false)
  const [faceRealistic, setFaceRealistic] = useState(true) // 預設勾選：頭像用寫實
  const [clothingHanddrawn, setClothingHanddrawn] = useState(true) // 預設勾選：衣服手繪

  const generatePrompt = () => {
    const data = STICKER_SETS[selectedSet]
    const style = STYLES[selectedStyle]
    
    // Build style note text
    const parts = []
    if (faceRealistic) parts.push('臉部用實際照片 寫實 ,不用重新手繪')
    if (clothingHanddrawn) parts.push('服裝可以用手繪')
    const styleNote = parts.length > 0 ? parts.join('，') : ''
    
    let prompt = `✅ 12 格角色貼圖集｜Prompt 建議

請參考上傳圖片中的角色，生成 一張包含 12 個不同動作的角色貼圖集，也不要使用任何emoji表情符號。

[角色與風格設定]
角色一致性：必須完全維持原圖主角的髮型、服裝、五官與整體外觀特徵。${styleNote}
構圖風格：畫面僅包含「角色 + 文字」，不包含任何場景背景。
畫風設定：【${style.style}】${styleNote}
貼紙風格（去背友善）：角色與文字外圍皆需加入 粗白色外框（Sticker Style）。背景統一為 #00FF00（純綠色），不可有雜點。

[畫面佈局與尺寸規格]
整體為 4 × 3 佈局，共 12 張貼圖。總尺寸：2560×1664 px。
每張小圖約 370 × 320 px（自動等比縮放填滿排列）。每張貼圖四周預留約 0.2 cm Padding，避免畫面互相黏住。
鏡頭多樣化：全身 + 半身混合，必須包含正面、側面、俯角等不同視角。

`

    // Add each sticker detail
    data.stickers.forEach((s) => {
      prompt += `【${s.title}】
文字：${s.text}
動作：${s.action}
特效：${s.effect}

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
        </div>
        {(faceRealistic || clothingHanddrawn) && (
          <p className="text-xs text-red-500 font-mono bg-red-50 dark:bg-red-900/20 p-2 rounded">
            → {faceRealistic ? '臉部用實際照片 寫實 ,不用重新手繪' : ''}{faceRealistic && clothingHanddrawn ? '，' : ''}{clothingHanddrawn ? '服裝可以用手繪' : ''}
          </p>
        )}
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
            <PromptPreview stickerSet={selectedSet} style={selectedStyle} faceRealistic={faceRealistic} clothingHanddrawn={clothingHanddrawn} />
          </div>
        </div>
      </div>
    </div>
  )
}
