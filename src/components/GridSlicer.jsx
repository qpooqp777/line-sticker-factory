import { useState, useEffect, useCallback, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { GRID_CONFIG, getStickerSize } from '../i18n'

export default function GridSlicer({ gridImage, onStickersReady, removeBg, stickers }) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [removeSettings, setRemoveSettings] = useState({
    targetColor: '#00FF00',  // 預設綠色
    tolerance: 30,
    smoothness: 2,
    despill: true,
    zoomLevel: 1.0
  })
  const workerRef = useRef(null)
  const workerUrlRef = useRef(null)

  // 建立 Web Worker
  useEffect(() => {
    const workerScript = `
    self.onmessage = function(e) {
      const { imageBitmap, id, targetColor, tolerance, smoothness, despill } = e.data;
      const w = imageBitmap.width;
      const h = imageBitmap.height;
      const canvas = new OffscreenCanvas(w, h);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      
      // 解析目標顏色
      const tr = parseInt(targetColor.slice(1, 3), 16);
      const tg = parseInt(targetColor.slice(3, 5), 16);
      const tb = parseInt(targetColor.slice(5, 7), 16);
      
      const distThreshold = tolerance * 4.42;
      const ramp = Math.max(1, smoothness * 5);
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt((r - tr) * (r - tr) + (g - tg) * (g - tg) + (b - tb) * (b - tb));
        let alpha = 255;
        if (dist < distThreshold) alpha = 0;
        else if (dist < distThreshold + ramp) alpha = ((dist - distThreshold) / ramp) * 255;
        
        // 去綠色溢出
        if (despill && alpha > 0) {
          if (targetColor.toLowerCase() === '#00ff00') {
            if (g > r && g > b) {
              data[i + 1] = Math.floor((r + b) / 2);
            }
          }
        }
        
        data[i + 3] = alpha;
      }
      
      ctx.putImageData(imgData, 0, 0);
      canvas.convertToBlob({ type: 'image/png' }).then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => self.postMessage({ id, dataUrl: reader.result });
      });
    };
    `;
    
    const blob = new Blob([workerScript], { type: 'text/javascript' });
    workerUrlRef.current = URL.createObjectURL(blob);
    workerRef.current = new Worker(workerUrlRef.current);
    
    return () => {
      if (workerRef.current) workerRef.current.terminate();
      if (workerUrlRef.current) URL.revokeObjectURL(workerUrlRef.current);
    };
  }, [])

  // 處理完成計數
  const processedCountRef = useRef(0)
  const totalPiecesRef = useRef(0)
  const resultsRef = useRef([])

  const sliceImage = useCallback(async () => {
    if (!gridImage) return

    setIsProcessing(true)
    setProgress(0)
    processedCountRef.current = 0
    resultsRef.current = []

    const stickerSize = getStickerSize(gridImage.width, gridImage.height)
    const targetW = 740  // 370 * 2
    const targetH = 640  // 320 * 2
    
    const img = new window.Image()
    img.crossOrigin = 'anonymous'

    await new Promise((resolve) => {
      img.onload = resolve
      img.src = gridImage.src
    })

    const pieces = []
    const cols = GRID_CONFIG.columns
    const rows = GRID_CONFIG.rows
    const pieceW = img.width / cols
    const pieceH = img.height / rows

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col + 1
        
        // 建立工作畫布
        const workCanvas = document.createElement('canvas')
        workCanvas.width = targetW
        workCanvas.height = targetH
        const workCtx = workCanvas.getContext('2d')
        
        // 計算縮放與置中
        const rawW = pieceW
        const rawH = pieceH
        const baseScale = Math.min(targetW / rawW, targetH / rawH)
        const finalScale = baseScale * removeSettings.zoomLevel
        const drawW = rawW * finalScale
        const drawH = rawH * finalScale
        const dx = (targetW - drawW) / 2
        const dy = (targetH - drawH) / 2
        
        // 切圖
        const sliceCanvas = document.createElement('canvas')
        sliceCanvas.width = pieceW
        sliceCanvas.height = pieceH
        const sliceCtx = sliceCanvas.getContext('2d')
        sliceCtx.drawImage(
          img,
          col * pieceW, row * pieceH, pieceW, pieceH,
          0, 0, pieceW, pieceH
        )
        
        // 縮放到工作畫布
        workCtx.drawImage(sliceCanvas, dx, dy, drawW, drawH)
        
        pieces.push({
          id: index,
          canvas: workCanvas,
          previewUrl: workCanvas.toDataURL('image/png')
        })
        
        setProgress(Math.round((index / (cols * rows)) * 30))
      }
    }

    totalPiecesRef.current = pieces.length

    if (removeBg) {
      // 使用 Web Worker 去背
      workerRef.current.onmessage = (e) => {
        const { id, dataUrl } = e.data
        resultsRef.current.push({ id, dataUrl })
        processedCountRef.current++
        
        setProgress(30 + Math.round((processedCountRef.current / totalPiecesRef.current) * 70))
        
        if (processedCountRef.current === totalPiecesRef.current) {
          // 排序後回傳
          const sorted = resultsRef.current.sort((a, b) => a.id - b.id)
          onStickersReady(sorted.map(p => ({ id: p.id, src: p.dataUrl })))
          setIsProcessing(false)
        }
      }

      // 送出所有圖片給 Worker
      for (const piece of pieces) {
        piece.canvas.toBlob(async (blob) => {
          const bitmap = await createImageBitmap(blob)
          workerRef.current.postMessage({
            imageBitmap: bitmap,
            id: piece.id,
            targetColor: removeSettings.targetColor,
            tolerance: removeSettings.tolerance,
            smoothness: removeSettings.smoothness,
            despill: removeSettings.despill
          }, [bitmap])
        }, 'image/png')
      }
    } else {
      // 不去背，直接回傳
      onStickersReady(pieces.map(p => ({ id: p.id, src: p.previewUrl })))
      setIsProcessing(false)
    }
  }, [gridImage, removeBg, onStickersReady, removeSettings])

  // Auto-slice when image is loaded
  useEffect(() => {
    if (gridImage && stickers.length === 0) {
      sliceImage()
    }
  }, [gridImage])

  // Re-slice when removeBg changes
  useEffect(() => {
    if (gridImage && stickers.length > 0) {
      sliceImage()
    }
  }, [removeBg, removeSettings])

  if (!gridImage) return null

  return (
    <div className="card space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
        {t('step2Title')}
      </h2>

      {/* 去背設定 */}
      {removeBg && (
        <div className="bg-[var(--color-surface)] p-4 rounded-lg space-y-3 text-sm">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-[var(--color-text-secondary)]">目標顏色:</span>
              <input
                type="color"
                value={removeSettings.targetColor}
                onChange={(e) => setRemoveSettings(s => ({ ...s, targetColor: e.target.value.toUpperCase() }))}
                className="w-10 h-8 rounded cursor-pointer"
              />
              <span className="font-mono text-[var(--color-text)]">{removeSettings.targetColor}</span>
            </label>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 flex-1">
              <span className="text-[var(--color-text-secondary)]">容差:</span>
              <input
                type="range"
                min="5"
                max="80"
                value={removeSettings.tolerance}
                onChange={(e) => setRemoveSettings(s => ({ ...s, tolerance: parseInt(e.target.value) }))}
                className="flex-1 accent-primary-500"
              />
              <span className="w-8 text-[var(--color-text)]">{removeSettings.tolerance}</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 flex-1">
              <span className="text-[var(--color-text-secondary)]">邊緣柔化:</span>
              <input
                type="range"
                min="0"
                max="10"
                value={removeSettings.smoothness}
                onChange={(e) => setRemoveSettings(s => ({ ...s, smoothness: parseInt(e.target.value) }))}
                className="flex-1 accent-primary-500"
              />
              <span className="w-8 text-[var(--color-text)]">{removeSettings.smoothness}</span>
            </label>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeSettings.despill}
              onChange={(e) => setRemoveSettings(s => ({ ...s, despill: e.target.checked }))}
              className="accent-primary-500"
            />
            <span className="text-[var(--color-text-secondary)]">去綠色溢出 (Despill)</span>
          </label>

          {/* 快速預設 */}
          <div className="flex gap-2 pt-2 border-t border-[var(--color-border)]">
            <button
              onClick={() => setRemoveSettings({ targetColor: '#00FF00', tolerance: 30, smoothness: 2, despill: true, zoomLevel: 1.0 })}
              className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold"
            >
              綠色背景
            </button>
            <button
              onClick={() => setRemoveSettings({ targetColor: '#000000', tolerance: 15, smoothness: 1, despill: false, zoomLevel: 1.0 })}
              className="px-3 py-1 bg-neutral-700 text-white rounded text-xs font-bold"
            >
              黑色背景
            </button>
            <button
              onClick={() => setRemoveSettings({ targetColor: '#FFFFFF', tolerance: 20, smoothness: 2, despill: false, zoomLevel: 1.0 })}
              className="px-3 py-1 bg-white text-black rounded text-xs font-bold"
            >
              白色背景
            </button>
          </div>
        </div>
      )}

      {isProcessing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>{t('processingTitle')} {progress}%</span>
          </div>
          <div className="w-full bg-[var(--color-border)] rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : stickers.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('stickersTitle')}
          </p>

          {/* 4x3 Grid Preview */}
          <div className="grid grid-cols-4 gap-2">
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                className="aspect-square rounded-lg overflow-hidden border-2 border-dashed border-neutral-400 bg-[var(--color-surface)]"
                style={{
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                  backgroundColor: '#f0f0f0'
                }}
              >
                <img
                  src={sticker.src}
                  alt={`Sticker ${sticker.id}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}