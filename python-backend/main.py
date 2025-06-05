from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pypinyin import pinyin, Style
from typing import Dict
from deep_translator import GoogleTranslator

app = FastAPI()

# Enable CORS for the Electron app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Chinese Learning Assistant API"}

@app.post("/translate")
async def translate_chinese(text: Dict[str, str]):
    chinese_text = text.get("text", "")
    
    # Convert to Pinyin
    pinyin_result = pinyin(chinese_text, style=Style.TONE)
    pinyin_text = " ".join([item[0] for item in pinyin_result])
    
    try:
        # Get translation using GoogleTranslator
        translator = GoogleTranslator(source='zh-CN', target='en')
        meaning = translator.translate(chinese_text)
        
        synonyms = []
        
        return {
            "original": chinese_text,
            "pinyin": pinyin_text,
            "meaning": meaning if meaning else "No translation found",
            "synonyms": synonyms
        }
    except Exception as e:
        return {
            "original": chinese_text,
            "pinyin": pinyin_text,
            "meaning": f"Translation error: {str(e)}",
            "synonyms": []
        } 