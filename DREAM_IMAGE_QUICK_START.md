# 🚀 Dream Image Generation - Quick Start

## Get Started in 5 Minutes!

### Step 1: Get FREE Hugging Face API Key (2 minutes)

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name: "Dream Decoder"
4. Type: "Read"
5. Click "Generate a token"
6. Copy the token (starts with `hf_`)

### Step 2: Add to .env (1 minute)

Edit `backend/.env` and add:

```bash
HUGGINGFACE_API_KEY=hf_your_token_here
```

### Step 3: Restart Backend (1 minute)

```bash
# Stop backend (Ctrl+C in terminal)
# Start again
cd backend
python -m uvicorn app.main:app --reload
```

### Step 4: Test It! (1 minute)

```bash
# Test endpoint
curl -X POST http://localhost:8000/dream-image/test
```

You should see a response with `"success": true` and an image!

---

## How to Use in Your App

### From Frontend (React)

```javascript
// After EEG analysis
const response = await fetch('http://localhost:8000/predict', {
  method: 'POST',
  body: formData
});

const analysisData = await response.json();

// Generate dream image
const imageResponse = await fetch('http://localhost:8000/dream-image/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dream_type: analysisData.dream,
    confidence: analysisData.confidence,
    bands: analysisData.bands,
    probabilities: analysisData.probabilities
  })
});

const imageData = await imageResponse.json();

// Display image
if (imageData.success) {
  // imageData.image_base64 contains the image
  // imageData.prompt contains the AI prompt
  // imageData.interpretation contains the explanation
}
```

---

## What You Get

### Input (EEG Analysis):
```json
{
  "dream_type": "Lucid Dream",
  "confidence": 85.7,
  "bands": {
    "delta": 0.45,
    "theta": 0.32,
    "alpha": 0.78,
    "beta": 0.61
  }
}
```

### Output (Dream Image):
```json
{
  "success": true,
  "image_base64": "data:image/png;base64,iVBORw0KG...",
  "prompt": "a surreal lucid dreamscape with...",
  "interpretation": "Brain Wave Analysis:\n- Delta (28%): Moderate delta...",
  "provider": "huggingface"
}
```

---

## Display the Image

```jsx
{imageData && imageData.success && (
  <div className="dream-image-container">
    <img 
      src={imageData.image_base64} 
      alt="Generated Dream" 
      style={{ width: '100%', borderRadius: '12px' }}
    />
    <p className="interpretation">{imageData.interpretation}</p>
  </div>
)}
```

---

## Cost

- **Hugging Face**: FREE ✅
- **OpenAI DALL-E**: ~$0.04 per image
- **Stability AI**: ~$0.02 per image
- **Demo Mode**: FREE (placeholder)

---

## Troubleshooting

### "No API key configured"
→ Add `HUGGINGFACE_API_KEY` to `.env` and restart backend

### "Image generation failed"
→ Check backend logs for error details

### "Demo image showing"
→ No API keys configured, add Hugging Face key

---

## Next Steps

1. ✅ Add Hugging Face key (free)
2. ✅ Test with `/dream-image/test`
3. ✅ Integrate into Decode page
4. ✅ Show images to users
5. 🎨 Enjoy AI-generated dream visualizations!

**Full Guide**: See `DREAM_IMAGE_GENERATION_GUIDE.md`
