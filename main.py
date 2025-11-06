from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import pipeline
import logging
from typing import Optional, Literal, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Model API",
    description="API for text generation and sentiment analysis using transformer models",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class TextGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=500, description="Text prompt for generation")
    max_length: Optional[int] = Field(100, ge=10, le=500, description="Maximum length of generated text")
    temperature: Optional[float] = Field(1.0, ge=0.1, le=2.0, description="Sampling temperature")
    num_return_sequences: Optional[int] = Field(1, ge=1, le=5, description="Number of sequences to generate")

class SentimentAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1000, description="Text for sentiment analysis")

class UnifiedRequest(BaseModel):
    task: Literal["text-generation", "sentiment-analysis"] = Field(..., description="Task type to perform")
    text: str = Field(..., min_length=1, max_length=1000, description="Input text")
    max_length: Optional[int] = Field(100, ge=10, le=500, description="Maximum length (text generation only)")
    temperature: Optional[float] = Field(1.0, ge=0.1, le=2.0, description="Temperature (text generation only)")

# Initialize models
models: Dict[str, Any] = {}

try:
    logger.info("Loading GPT-2 model...")
    models['text-generation'] = pipeline('text-generation', model='distilgpt2')
    logger.info("Loading distilgpt2 model loaded successfully")
    
    logger.info("Loading DistilBERT sentiment analysis model...")
    models['sentiment-analysis'] = pipeline('sentiment-analysis', model='distilbert-base-uncased-finetuned-sst-2-english')
    logger.info("DistilBERT model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    raise

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "AI Model API is running",
        "available_tasks": ["text-generation", "sentiment-analysis"],
        "models": {
            "text-generation": "gpt2",
            "sentiment-analysis": "distilbert-base-uncased-finetuned-sst-2-english"
        }
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/api/process")
async def process_unified(request: UnifiedRequest):
    """
    Unified endpoint for text generation and sentiment analysis.
    """
    try:
        if request.task == "text-generation":
            logger.info(f"Generating text for prompt: {request.text[:50]}...")
            
            result = models['text-generation'](
                request.text,
                max_length=request.max_length,
                temperature=request.temperature,
                num_return_sequences=1,
                truncation=True,
                pad_token_id=models['text-generation'].tokenizer.eos_token_id
            )
            
            generated_text = result[0]['generated_text']
            
            logger.info("Text generation completed successfully")
            
            return {
                "task": "text-generation",
                "generated_text": generated_text,
                "prompt": request.text,
                "model": "gpt2"
            }
        
        elif request.task == "sentiment-analysis":
            logger.info(f"Analyzing sentiment for text: {request.text[:50]}...")
            
            result = models['sentiment-analysis'](request.text)
            
            logger.info("Sentiment analysis completed successfully")
            
            return {
                "task": "sentiment-analysis",
                "text": request.text,
                "sentiment": result[0]['label'],
                "confidence": result[0]['score'],
                "model": "distilbert-base-uncased-finetuned-sst-2-english"
            }
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process request: {str(e)}"
        )

@app.post("/api/generate")
async def generate_text(request: TextGenerationRequest):
    """
    Generate text based on the provided prompt using GPT-2 model.
    """
    try:
        logger.info(f"Generating text for prompt: {request.prompt[:50]}...")
        
        result = models['text-generation'](
            request.prompt,
            max_length=request.max_length,
            temperature=request.temperature,
            num_return_sequences=request.num_return_sequences,
            truncation=True,
            pad_token_id=models['text-generation'].tokenizer.eos_token_id
        )
        
        generated_text = result[0]['generated_text']
        
        logger.info("Text generation completed successfully")
        
        return {
            "generated_text": generated_text,
            "prompt": request.prompt,
            "model": "gpt2"
        }
    
    except Exception as e:
        logger.error(f"Error generating text: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate text: {str(e)}"
        )

@app.post("/api/sentiment")
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """
    Analyze sentiment of the provided text using DistilBERT model.
    """
    try:
        logger.info(f"Analyzing sentiment for text: {request.text[:50]}...")
        
        result = models['sentiment-analysis'](request.text)
        
        logger.info("Sentiment analysis completed successfully")
        
        return {
            "text": request.text,
            "sentiment": result[0]['label'],
            "confidence": result[0]['score'],
            "model": "distilbert-base-uncased-finetuned-sst-2-english"
        }
    
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze sentiment: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)