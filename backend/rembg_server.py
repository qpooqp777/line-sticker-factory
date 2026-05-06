#!/usr/bin/env python3
"""
LINE Sticker Factory - Background Removal Backend
Uses rembg for AI-powered background removal.
"""

import io
import time
import base64
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

try:
    from rembg import remove
    HAS_REMBG = True
except ImportError:
    HAS_REMBG = False

app = FastAPI(title="LINE Sticker Factory - Background Removal")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Warm up rembg model on startup
if HAS_REMBG:
    print("[rembg] Warming up model...")
    dummy = Image.new('RGBA', (10, 10), (255, 0, 0, 255))
    remove(dummy)
    print("[rembg] Model ready!")

@app.get("/")
async def root():
    return {
        "status": "ok",
        "rembg_installed": HAS_REMBG,
        "message": "POST image to /remove-bg"
    }

@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    """Remove background from uploaded image."""
    
    if not HAS_REMBG:
        raise HTTPException(
            status_code=503, 
            detail="rembg not installed. Run: pip install rembg"
        )
    
    try:
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGBA")
        
        print(f"[rembg] Processing: {input_image.size}")
        start = time.time()
        output_image = remove(input_image)
        elapsed = time.time() - start
        print(f"[rembg] Done in {elapsed:.1f}s")
        
        output_buffer = io.BytesIO()
        output_image.save(output_buffer, format="PNG")
        output_base64 = base64.b64encode(output_buffer.getvalue()).decode()
        
        return {
            "success": True,
            "image": f"data:image/png;base64,{output_base64}"
        }
        
    except Exception as e:
        print(f"[rembg] Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/remove-bg-batch")
async def remove_background_batch(files: list[UploadFile] = File(...)):
    """Remove background from multiple images."""
    
    if not HAS_REMBG:
        raise HTTPException(
            status_code=503, 
            detail="rembg not installed"
        )
    
    results = []
    for i, file in enumerate(files):
        try:
            contents = await file.read()
            input_image = Image.open(io.BytesIO(contents)).convert("RGBA")
            
            print(f"[rembg] Processing {i+1}/{len(files)}")
            start = time.time()
            output_image = remove(input_image)
            print(f"[rembg] {i+1} done in {time.time() - start:.1f}s")
            
            output_buffer = io.BytesIO()
            output_image.save(output_buffer, format="PNG")
            output_base64 = base64.b64encode(output_buffer.getvalue()).decode()
            
            results.append({
                "index": i,
                "success": True,
                "image": f"data:image/png;base64,{output_base64}"
            })
        except Exception as e:
            print(f"[rembg] Error on image {i+1}: {e}")
            results.append({
                "index": i,
                "success": False,
                "error": str(e)
            })
    
    return {"results": results}

if __name__ == "__main__":
    print("=" * 50)
    print("LINE Sticker Factory - Background Removal")
    print(f"rembg installed: {HAS_REMBG}")
    print("Server: http://127.0.0.1:5174")
    print("=" * 50)
    
    uvicorn.run(app, host="127.0.0.1", port=5174, reload=False)