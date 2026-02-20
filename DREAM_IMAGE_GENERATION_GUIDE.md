# 🎨 Dream Image Generation Feature

## Overview

This feature generates AI-powered dream images based on EEG brain wave analysis. It interprets your alpha, beta, theta, and delta wave patterns to create an artistic visualization of what your dream might have looked like.

---

## How It Works

### 1. EEG Analysis → Prompt Generation

The system analyzes your brain wave patterns:

**Delta Waves (Deep Sleep)**
- High delta → Deep, mysterious imagery (underwater caverns, fog, ruins)
- Low delta → Clear, open imagery (clear skies, open spaces)

**Theta Waves (Creativity)**
- High theta → Surreal elements (floating islands, impossible architecture)
- Low theta → Realistic forms (familiar structures)

**Alpha Waves (Visualization)**
- High alpha → Vibrant colors, crystal clear details, luminous light
- Low alpha → Muted tones, dim lighting, shadowy forms

**Beta Waves (Active Thinking)**
- High beta → Intricate patterns, detailed textures, complex scenes
- Low beta → Simple forms, minimal detail

### 2. Dream Type Integration

The base scene is determined by your dream classification:
- **Lucid Dream**: Surreal dreamscape with impossible geometry
- **Nightmare**: Dark, unsettling scene with ominous shadows
- **Memory Recall**: Nostalgic scene with soft, faded colors
- **Normal Sleep**: Peaceful, abstract environment

### 3. AI Image Generation

The generated prompt is sent to an AI image generator to create the visual representation.

---

## API Providers

### Option 1: Hugging Face (FREE) ✅ Recommended for Start

**Cost**: FREE
**Quality**: Good
**Speed**: Medium (10-30 seconds)

**Setup**:
1. Go to https://huggingface.co/settings/tokens
2. Create a new token (read access is enough)
3. Add to `.env`:
   ```bash
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

**Pros**:
- Completely free
- No credit card required
- Unlimited generations
- Good quality images

**Cons**:
- Slower than paid options
- May have queue times during peak hours

---

### Option 2: OpenAI DALL-E 3 (PAID) 💎 Best Quality

**Cost**: ~$0.04 per image (1024x1024)
**Quality**: Excellent
**Speed**: Fast (5-10 seconds)

**Setup**:
1. Go to https://platform.openai.com/api-keys
2. Create API key
3. Add billing information
4. Add to `.env`:
   ```bash
   OPENAI_API_KEY=sk-your_key_here
   ```

**Pros**:
- Highest quality images
- Fast generation
- Best prompt understanding
- Reliable service

**Cons**:
- Costs money per image
- Requires credit card

---

### Option 3: Stability AI (PAID) 🎨 High Quality

**Cost**: ~$0.02 per image
**Quality**: Excellent
**Speed**: Fast (5-15 seconds)

**Setup**:
1. Go to https://platform.stability.ai/account/keys
2. Create API key
3. Add credits to account
4. Add to `.env`:
   ```bash
   STABILITY_API_KEY=sk-your_key_here
   ```

**Pros**:
- High quality images
- Cheaper than DALL-E
- Good for artistic styles

**Cons**:
- Requires payment
- Need to manage credits

---

### Option 4: Demo Mode (NO API KEY) 🎭

**Cost**: FREE
**Quality**: Placeholder
**Speed**: Instant

If no API keys are configured, the system generates a beautiful SVG placeholder with gradient colors and your dream information.

**Pros**:
- Works immediately
- No setup required
- Good for testing

**Cons**:
- Not a real AI-generated image
- Just a placeholder

---

## Quick Setup (5 Minutes)

### Step 1: Choose Your Provider

For beginners, we recommend **Hugging Face** (free):

1. Visit https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it "Dream Decoder"
4. Select "read" access
5. Click "Generate"
6. Copy the token (starts with `hf_`)

### Step 2: Add to Environment

Edit `backend/.env`:

```bash
# Add this line
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

### Step 3: Restart Backend

```bash
# Stop backend (Ctrl+C)
# Start again
cd backend
python -m uvicorn app.main:app --reload
```

### Step 4: Test

```bash
# Test the endpoint
curl -X POST http://localhost:8000/dream-image/test
```

Done! Your dream image generation is ready!

---

## API Endpoints

### 1. Generate Dream Image

**POST** `/dream-image/generate`

**Request Body**:
```json
{
  "dream_type": "Lucid Dream",
  "confidence": 85.7,
  "bands": {
    "delta": 0.45,
    "theta": 0.32,
    "alpha": 0.78,
    "beta": 0.61
  },
  "probabilities": {
    "Lucid Dream": 85.7,
    "Nightmare": 8.3,
    "Memory Recall": 4.2,
    "Normal Sleep": 1.8
  }
}
```

**Response**:
```json
{
  "success": true,
  "image_base64": "data:image/png;base64,iVBORw0KG...",
  "prompt": "a surreal lucid dreamscape with...",
  "interpretation": "Dream Image Interpretation:\n\nBrain Wave Analysis:...",
  "provider": "huggingface"
}
```

### 2. Health Check

**GET** `/dream-image/health`

**Response**:
```json
{
  "status": "healthy",
  "service": "Dream Image Generation",
  "version": "1.0.0",
  "providers": {
    "huggingface": true,
    "openai": false,
    "stability": false,
    "demo": true
  }
}
```

### 3. Test Generation

**POST** `/dream-image/test`

Generates a test image with sample EEG data.

---

## Integration with Decode Page

The dream image generation is automatically integrated with your EEG analysis. After uploading an EEG file:

1. EEG is analyzed (alpha, beta, theta, delta)
2. Dream type is predicted
3. User can click "Generate Dream Image" button
4. AI generates image based on brain waves
5. Image is displayed with interpretation

---

## Cost Estimates

### Hugging Face (FREE)
- **Cost per image**: $0
- **100 images**: $0
- **1,000 images**: $0
- **10,000 images**: $0

### OpenAI DALL-E 3
- **Cost per image**: ~$0.04
- **100 images**: ~$4
- **1,000 images**: ~$40
- **10,000 images**: ~$400

### Stability AI
- **Cost per image**: ~$0.02
- **100 images**: ~$2
- **1,000 images**: ~$20
- **10,000 images**: ~$200

---

## Example Prompts Generated

### High Alpha + High Theta (Vivid Lucid Dream)
```
a surreal lucid dreamscape with impossible geometry and vivid colors, 
featuring misty valleys, hidden pathways, with floating islands, morphing 
shapes, impossible architecture, melting clocks, rendered in vibrant colors, 
crystal clear details, luminous light, ethereal glow, showing intricate 
patterns, detailed textures, multiple layers, complex scenes, digital art, 
dreamlike, surreal, high quality, 4k
```

### High Delta + Low Alpha (Deep Sleep)
```
a peaceful, abstract dream environment, featuring deep underwater caverns, 
mysterious fog, ancient ruins, with realistic forms, familiar structures, 
rendered in muted tones, dim lighting, shadowy forms, showing simple forms, 
minimal detail, digital art, dreamlike, surreal, high quality, 4k
```

### Nightmare with High Beta
```
a dark, unsettling nightmare scene with ominous shadows, featuring deep 
underwater caverns, mysterious fog, ancient ruins, with unusual perspectives, 
dreamlike transitions, rendered in soft colors, gentle lighting, showing 
intricate patterns, detailed textures, multiple layers, complex scenes, 
digital art, dreamlike, surreal, high quality, 4k
```

---

## Troubleshooting

### Issue: "No API key configured"

**Solution**: Add at least one API key to `.env` file and restart backend.

### Issue: "Image generation failed"

**Possible causes**:
1. Invalid API key
2. No credits (for paid services)
3. API rate limit reached
4. Network issues

**Solution**: Check backend logs for detailed error message.

### Issue: "Demo image showing instead of real image"

**Solution**: This means no API keys are configured. Add a Hugging Face token.

### Issue: "Slow generation"

**Solution**: 
- Hugging Face can be slow during peak hours
- Consider upgrading to OpenAI or Stability AI
- Or wait a bit longer (can take 30-60 seconds)

---

## Security & Privacy

### API Keys
- ✅ Stored in `.env` file (gitignored)
- ✅ Never sent to frontend
- ✅ Only used in backend

### Images
- ✅ Generated on-demand
- ✅ Not stored permanently (unless you save them)
- ✅ Sent directly to user

### Data
- ✅ EEG data never sent to image API
- ✅ Only the generated prompt is sent
- ✅ No personal information included

---

## Advanced Configuration

### Custom Prompt Templates

You can modify the prompt generation logic in `backend/app/api/dream_image.py`:

```python
def generate_dream_prompt(analysis: EEGAnalysisInput) -> tuple[str, str]:
    # Customize this function to change how prompts are generated
    # based on EEG data
    pass
```

### Image Quality Settings

For OpenAI DALL-E:
```python
"quality": "standard"  # or "hd" for higher quality (costs more)
"size": "1024x1024"    # or "1792x1024", "1024x1792"
```

For Stability AI:
```python
"steps": 30  # More steps = better quality but slower
"cfg_scale": 7  # How closely to follow prompt (1-35)
```

---

## Future Enhancements

Potential features to add:

1. **Image History**: Save generated images to database
2. **Style Selection**: Let users choose art styles
3. **Multiple Images**: Generate variations
4. **Image Editing**: Refine generated images
5. **Animation**: Create dream sequences
6. **3D Visualization**: Generate 3D dream environments
7. **VR Integration**: View dreams in VR

---

## FAQ

**Q: Is the image an exact representation of my dream?**
A: No, it's an artistic interpretation based on your brain wave patterns. Dreams are subjective experiences that can't be perfectly captured.

**Q: Can I save the generated images?**
A: Yes! Right-click and save, or we can add a save feature to the app.

**Q: How accurate is the interpretation?**
A: The interpretation is based on neuroscience research about brain waves and sleep stages, but it's still an approximation.

**Q: Can I generate multiple images?**
A: Yes! Just click the generate button again. Each generation may produce different results.

**Q: Do I need all three API keys?**
A: No! Just one is enough. Hugging Face (free) is recommended to start.

**Q: Will this work offline?**
A: No, it requires internet connection to access the AI image generation APIs.

---

## Summary

✅ **Free option available** (Hugging Face)
✅ **Easy setup** (5 minutes)
✅ **Based on real EEG data** (alpha, beta, theta, delta)
✅ **Scientific interpretation** (neuroscience-based)
✅ **High quality images** (AI-generated)
✅ **Privacy-focused** (no data stored)

**Get started**: Add a Hugging Face API key and start generating dream images!
