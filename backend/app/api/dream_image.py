"""
Dream Image Generation API
Generates dream images based on EEG analysis using AI image generation
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict
import os
import httpx
import base64
from datetime import datetime
import asyncio

router = APIRouter(
    prefix="/dream-image",
    tags=["Dream Image Generation"]
)

# Configuration
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY", "")

class EEGAnalysisInput(BaseModel):
    """Input model for EEG analysis data"""
    dream_type: str  # "Lucid Dream", "Nightmare", "Memory Recall", "Normal Sleep"
    confidence: float
    bands: Dict[str, float]  # delta, theta, alpha, beta
    probabilities: Optional[Dict[str, float]] = None

class DreamImageResponse(BaseModel):
    """Response model for dream image generation"""
    success: bool
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    prompt: str
    interpretation: str
    provider: str
    error: Optional[str] = None

# ===============================
# PROMPT GENERATION FROM EEG DATA
# ===============================

def generate_dream_prompt(analysis: EEGAnalysisInput) -> tuple[str, str]:
    """
    Generate a detailed image prompt based on EEG analysis
    Returns: (prompt, interpretation)
    """
    
    # Extract band values
    delta = analysis.bands.get("delta", 0.5)
    theta = analysis.bands.get("theta", 0.5)
    alpha = analysis.bands.get("alpha", 0.5)
    beta = analysis.bands.get("beta", 0.5)
    
    # Normalize bands to 0-1 range
    total = delta + theta + alpha + beta
    if total > 0:
        delta_norm = delta / total
        theta_norm = theta / total
        alpha_norm = alpha / total
        beta_norm = beta / total
    else:
        delta_norm = theta_norm = alpha_norm = beta_norm = 0.25
    
    # Build prompt components based on brain wave patterns
    
    # 1. Base scene from dream type
    dream_scenes = {
        "Lucid Dream": "a surreal lucid dreamscape with impossible geometry and vivid colors",
        "Nightmare": "a dark, unsettling nightmare scene with ominous shadows",
        "Memory Recall": "a nostalgic memory scene with soft, faded colors",
        "Normal Sleep": "a peaceful, abstract dream environment"
    }
    base_scene = dream_scenes.get(analysis.dream_type, "an abstract dreamscape")
    
    # 2. Delta waves (deep sleep, unconscious) - affects depth and mystery
    if delta_norm > 0.3:
        depth_elements = "deep underwater caverns, mysterious fog, ancient ruins"
        depth_desc = "High delta waves suggest deep unconscious processing"
    elif delta_norm > 0.2:
        depth_elements = "misty valleys, hidden pathways"
        depth_desc = "Moderate delta waves indicate restful sleep state"
    else:
        depth_elements = "clear skies, open spaces"
        depth_desc = "Low delta waves suggest lighter sleep"
    
    # 3. Theta waves (creativity, imagination) - affects surrealism
    if theta_norm > 0.3:
        creative_elements = "floating islands, morphing shapes, impossible architecture, melting clocks"
        creative_desc = "High theta waves indicate strong creative imagination"
    elif theta_norm > 0.2:
        creative_elements = "unusual perspectives, dreamlike transitions"
        creative_desc = "Moderate theta waves show creative processing"
    else:
        creative_elements = "realistic forms, familiar structures"
        creative_desc = "Low theta waves suggest more literal dream content"
    
    # 4. Alpha waves (relaxation, visualization) - affects clarity and color
    if alpha_norm > 0.3:
        visual_elements = "vibrant colors, crystal clear details, luminous light, ethereal glow"
        visual_desc = "High alpha waves create vivid, clear visualizations"
    elif alpha_norm > 0.2:
        visual_elements = "soft colors, gentle lighting"
        visual_desc = "Moderate alpha waves provide balanced imagery"
    else:
        visual_elements = "muted tones, dim lighting, shadowy forms"
        visual_desc = "Low alpha waves result in less vivid imagery"
    
    # 5. Beta waves (active thinking, awareness) - affects complexity
    if beta_norm > 0.3:
        complexity_elements = "intricate patterns, detailed textures, multiple layers, complex scenes"
        complexity_desc = "High beta waves add mental complexity and detail"
    elif beta_norm > 0.2:
        complexity_elements = "moderate detail, balanced composition"
        complexity_desc = "Moderate beta waves create structured dreams"
    else:
        complexity_elements = "simple forms, minimal detail"
        complexity_desc = "Low beta waves suggest relaxed, simple imagery"
    
    # Construct the final prompt
    prompt = f"{base_scene}, featuring {depth_elements}, with {creative_elements}, rendered in {visual_elements}, showing {complexity_elements}, digital art, dreamlike, surreal, high quality, 4k"
    
    # Create interpretation
    interpretation = f"""
Dream Image Interpretation:

Brain Wave Analysis:
- Delta ({delta_norm:.1%}): {depth_desc}
- Theta ({theta_norm:.1%}): {creative_desc}
- Alpha ({alpha_norm:.1%}): {visual_desc}
- Beta ({beta_norm:.1%}): {complexity_desc}

Dream Type: {analysis.dream_type} (Confidence: {analysis.confidence:.1f}%)

This image represents the approximate visual characteristics of your dream based on your brain wave patterns during sleep. The imagery reflects the balance of different sleep stages and mental states captured in your EEG data.
    """.strip()
    
    return prompt, interpretation

# ===============================
# IMAGE GENERATION PROVIDERS
# ===============================

async def generate_with_huggingface(prompt: str) -> Optional[str]:
    """Generate image using Hugging Face Inference API (FREE)"""
    if not HUGGINGFACE_API_KEY:
        return None
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
                headers={"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"},
                json={"inputs": prompt}
            )
            
            if response.status_code == 200:
                # Return base64 encoded image
                image_bytes = response.content
                image_base64 = base64.b64encode(image_bytes).decode('utf-8')
                return f"data:image/png;base64,{image_base64}"
            else:
                print(f"Hugging Face API error: {response.status_code}")
                return None
                
    except Exception as e:
        print(f"Hugging Face generation error: {e}")
        return None

async def generate_with_openai(prompt: str) -> Optional[str]:
    """Generate image using OpenAI DALL-E (PAID)"""
    if not OPENAI_API_KEY:
        return None
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/images/generations",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "dall-e-3",
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024",
                    "quality": "standard"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["data"][0]["url"]
            else:
                print(f"OpenAI API error: {response.status_code}")
                return None
                
    except Exception as e:
        print(f"OpenAI generation error: {e}")
        return None

async def generate_with_stability(prompt: str) -> Optional[str]:
    """Generate image using Stability AI (PAID)"""
    if not STABILITY_API_KEY:
        return None
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers={
                    "Authorization": f"Bearer {STABILITY_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "text_prompts": [{"text": prompt}],
                    "cfg_scale": 7,
                    "height": 1024,
                    "width": 1024,
                    "samples": 1,
                    "steps": 30
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                image_base64 = data["artifacts"][0]["base64"]
                return f"data:image/png;base64,{image_base64}"
            else:
                print(f"Stability AI error: {response.status_code}")
                return None
                
    except Exception as e:
        print(f"Stability AI generation error: {e}")
        return None

async def generate_demo_image(prompt: str) -> str:
    """Generate a demo placeholder image (for testing without API keys)"""
    # Return a placeholder SVG image
    svg = f'''
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:rgb(138,43,226);stop-opacity:1" />
                <stop offset="50%" style="stop-color:rgb(75,0,130);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgb(25,25,112);stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#grad1)"/>
        <text x="256" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle">
            Dream Image
        </text>
        <text x="256" y="240" font-family="Arial" font-size="16" fill="white" text-anchor="middle" opacity="0.8">
            Generated from EEG Analysis
        </text>
        <text x="256" y="300" font-family="Arial" font-size="12" fill="white" text-anchor="middle" opacity="0.6">
            {prompt[:60]}...
        </text>
        <circle cx="256" cy="380" r="40" fill="none" stroke="white" stroke-width="2" opacity="0.5"/>
        <circle cx="256" cy="380" r="30" fill="none" stroke="white" stroke-width="2" opacity="0.7"/>
        <circle cx="256" cy="380" r="20" fill="white" opacity="0.3"/>
    </svg>
    '''
    svg_base64 = base64.b64encode(svg.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{svg_base64}"

# ===============================
# MAIN ENDPOINT
# ===============================

@router.post("/generate", response_model=DreamImageResponse)
async def generate_dream_image(analysis: EEGAnalysisInput):
    """
    Generate a dream image based on EEG analysis
    
    This endpoint:
    1. Analyzes EEG brain wave patterns (delta, theta, alpha, beta)
    2. Generates a descriptive prompt based on the patterns
    3. Creates an AI-generated image representing the dream
    
    The image is an artistic interpretation, not an exact recreation of the dream.
    """
    try:
        # Generate prompt from EEG analysis
        prompt, interpretation = generate_dream_prompt(analysis)
        
        # Try different providers in order of preference
        image_data = None
        provider = "demo"
        
        # 1. Try Hugging Face (free)
        if HUGGINGFACE_API_KEY:
            print("Trying Hugging Face...")
            image_data = await generate_with_huggingface(prompt)
            if image_data:
                provider = "huggingface"
        
        # 2. Try OpenAI DALL-E (paid, high quality)
        if not image_data and OPENAI_API_KEY:
            print("Trying OpenAI DALL-E...")
            image_data = await generate_with_openai(prompt)
            if image_data:
                provider = "openai"
        
        # 3. Try Stability AI (paid, high quality)
        if not image_data and STABILITY_API_KEY:
            print("Trying Stability AI...")
            image_data = await generate_with_stability(prompt)
            if image_data:
                provider = "stability"
        
        # 4. Fallback to demo image
        if not image_data:
            print("Using demo image...")
            image_data = await generate_demo_image(prompt)
            provider = "demo"
        
        # Determine if it's a URL or base64
        if image_data.startswith("http"):
            return DreamImageResponse(
                success=True,
                image_url=image_data,
                prompt=prompt,
                interpretation=interpretation,
                provider=provider
            )
        else:
            return DreamImageResponse(
                success=True,
                image_base64=image_data,
                prompt=prompt,
                interpretation=interpretation,
                provider=provider
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Dream image generation failed: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Check dream image generation service health"""
    providers_available = {
        "huggingface": bool(HUGGINGFACE_API_KEY),
        "openai": bool(OPENAI_API_KEY),
        "stability": bool(STABILITY_API_KEY),
        "demo": True
    }
    
    return {
        "status": "healthy",
        "service": "Dream Image Generation",
        "version": "1.0.0",
        "providers": providers_available
    }

@router.post("/test")
async def test_generation():
    """Test endpoint with sample EEG data"""
    sample_analysis = EEGAnalysisInput(
        dream_type="Lucid Dream",
        confidence=85.7,
        bands={
            "delta": 0.45,
            "theta": 0.32,
            "alpha": 0.78,
            "beta": 0.61
        },
        probabilities={
            "Lucid Dream": 85.7,
            "Nightmare": 8.3,
            "Memory Recall": 4.2,
            "Normal Sleep": 1.8
        }
    )
    
    return await generate_dream_image(sample_analysis)
