"""
Simplified AI Mental Health Assistant - FastAPI Backend
Main application entry point with just authentication
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
import uvicorn
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

# Initialize OpenAI client
openai_api_key = os.getenv('OPENAI_API_KEY')
if openai_api_key:
    openai_client = OpenAI(api_key=openai_api_key)
    print(f"OpenAI configured with API key: {openai_api_key[:15]}...")
else:
    openai_client = None
    print("Warning: OPENAI_API_KEY not found in environment variables")

# Create a simple FastAPI application
app = FastAPI(
    title="AI Mental Health Assistant API - Simplified",
    description="Simplified version for testing authentication",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Simple CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Mental Health Assistant API",
        "version": "1.0.0",
        "timestamp": time.time()
    }

# Simple authentication endpoints for testing
@app.post("/api/v1/auth/login", tags=["Authentication"])
async def login_user(credentials: dict):
    """Simple login endpoint for testing"""
    username = credentials.get("username")
    password = credentials.get("password")
    
    # Simple test credentials
    if username == "demo" and password == "password":
        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "user": {
                    "id": "test-user-id",
                    "username": username,
                    "email": "demo@mindchat.com",
                    "name": "Demo User"
                },
                "access_token": "test-access-token-123",
                "refresh_token": "test-refresh-token-456",
                "token_type": "bearer",
                "expires_in": 3600
            }
        }
    else:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

@app.post("/api/v1/auth/register", tags=["Authentication"])
async def register_user(user_data: dict):
    """Simple register endpoint for testing"""
    username = user_data.get("username")
    email = user_data.get("email")
    
    if not username or not email:
        raise HTTPException(status_code=400, detail="Username and email are required")
    
    return {
        "success": True,
        "message": "User registered successfully",
        "data": {
            "user": {
                "id": "new-user-id",
                "username": username,
                "email": email,
                "name": user_data.get("name", "")
            },
            "access_token": "test-access-token-123",
            "refresh_token": "test-refresh-token-456",
            "token_type": "bearer",
            "expires_in": 3600
        }
    }

# Simple chat endpoints
@app.post("/api/v1/chat/send", tags=["Chat"])
async def send_message(message_data: dict):
    """Send a message to the AI assistant"""
    message = message_data.get("message", "")
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Simple AI responses based on keywords
    ai_response = generate_ai_response(message)
    
    return {
        "success": True,
        "data": {
            "id": "msg-123",
            "message": ai_response,
            "timestamp": time.time(),
            "sender": "assistant",
            "emotion_detected": detect_emotion(message)
        }
    }

@app.get("/api/v1/chat/history", tags=["Chat"])
async def get_chat_history():
    """Get chat history for the user"""
    return {
        "success": True,
        "data": {
            "messages": [],
            "total": 0
        }
    }

# Simple emotion detection endpoint
@app.post("/api/v1/emotions/analyze", tags=["Emotions"])
async def analyze_emotion(emotion_data: dict):
    """Analyze emotion from text"""
    text = emotion_data.get("text", "")
    
    emotion = detect_emotion(text)
    
    return {
        "success": True,
        "data": {
            "emotion": emotion,
            "confidence": 0.85,
            "text": text
        }
    }

# User Profile Management endpoints
@app.get("/api/v1/profile/{user_id}", tags=["Profile"])
async def get_user_profile(user_id: str):
    """Get user profile information"""
    # In a real app, fetch from database
    return {
        "success": True,
        "data": {
            "user": {
                "id": user_id,
                "username": "demo",
                "email": "demo@mindchat.com",
                "name": "Demo User",
                "bio": "Mental wellness enthusiast",
                "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user_id,
                "location": "San Francisco, CA",
                "birthday": "1990-01-01",
                "occupation": "Software Developer",
                "phone": "+1 (555) 123-4567",
                "preferences": {
                    "theme": "dark",
                    "language": "en",
                    "timezone": "America/Los_Angeles",
                    "notifications": {
                        "email": True,
                        "push": True,
                        "sms": False,
                        "weekly_summary": True
                    }
                },
                "privacy": {
                    "profile_visibility": "public",
                    "show_online_status": True,
                    "allow_messages": True
                },
                "created_at": "2024-01-01T00:00:00Z",
                "last_login": "2024-09-17T10:00:00Z"
            }
        }
    }

@app.put("/api/v1/profile/{user_id}", tags=["Profile"])
async def update_user_profile(user_id: str, profile_data: dict):
    """Update user profile information"""
    # In a real app, validate and save to database
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": {
            "user": {
                "id": user_id,
                **profile_data
            }
        }
    }

@app.post("/api/v1/profile/{user_id}/avatar", tags=["Profile"])
async def update_user_avatar(user_id: str, avatar_data: dict):
    """Update user avatar"""
    avatar_url = avatar_data.get("avatar_url", "")
    
    # In a real app, handle file upload or validate URL
    return {
        "success": True,
        "message": "Avatar updated successfully",
        "data": {
            "avatar_url": avatar_url or f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_id}&background=random"
        }
    }

@app.get("/api/v1/profile/{user_id}/stats", tags=["Profile"])
async def get_user_stats(user_id: str):
    """Get user wellness statistics"""
    return {
        "success": True,
        "data": {
            "stats": {
                "total_sessions": 45,
                "streak_days": 7,
                "total_minutes": 1250,
                "mood_average": 7.2,
                "favorite_activity": "Breathing Exercises",
                "achievements": [
                    "First Session Complete",
                    "7-Day Streak",
                    "Meditation Master",
                    "Mood Tracker Pro"
                ],
                "recent_moods": [
                    {"date": "2024-09-17", "mood": 8, "notes": "Feeling great!"},
                    {"date": "2024-09-16", "mood": 7, "notes": "Good day overall"},
                    {"date": "2024-09-15", "mood": 6, "notes": "Average day"}
                ]
            }
        }
    }

# Helper functions
def check_media_request(message: str) -> str:
    """Check if user is requesting media content and return appropriate response with media suggestion"""
    message_lower = message.lower()
    
    # Media keywords for detection
    media_keywords = {
        'relaxation': ['relax', 'relaxing', 'calm', 'peaceful', 'stress relief', 'unwind'],
        'meditation': ['meditate', 'meditation', 'mindfulness', 'breathing', 'center'],
        'nature': ['nature', 'forest', 'ocean', 'rain', 'birds', 'water', 'natural'],
        'music': ['music', 'song', 'play music', 'melody', 'tune'],
        'video': ['video', 'watch', 'show me', 'play video'],
        'audio': ['audio', 'sound', 'listen', 'hear'],
        'therapy': ['anxiety', 'depression', 'sleep', 'insomnia', 'therapy', 'therapeutic']
    }
    
    # Check for media request verbs
    media_verbs = ['play', 'show', 'listen', 'watch', 'start']
    has_media_verb = any(verb in message_lower for verb in media_verbs)
    
    # Detect category
    detected_category = None
    for category, keywords in media_keywords.items():
        if category in ['video', 'audio']:  # Skip type keywords for category detection
            continue
        if any(keyword in message_lower for keyword in keywords):
            detected_category = category
            break
    
    # Detect type preference
    wants_video = any(keyword in message_lower for keyword in media_keywords['video'])
    wants_audio = any(keyword in message_lower for keyword in (media_keywords['audio'] + media_keywords['music']))
    
    # If it's a clear media request
    if has_media_verb or detected_category or wants_video or wants_audio:
        # Return a response with media suggestion signal
        media_type = 'video' if wants_video else ('audio' if wants_audio else 'any')
        
        responses = {
            'relaxation': f"Of course! I have some wonderful relaxing content that might help you unwind. Let me suggest something perfect for you! 🎵",
            'meditation': f"That's a great idea! Meditation can be so helpful. I have some guided meditation content that you might enjoy. Let me share something calming with you! 🧘‍♀️",
            'nature': f"Nature sounds are so soothing! I have some beautiful nature content that can help you feel more connected and peaceful. Let me play something for you! 🌿",
            'music': f"Music is such a wonderful way to lift your spirits! I have some lovely, calming music that might be just what you need. Let me play something for you! 🎶",
            'therapy': f"I understand you're looking for something therapeutic. I have some specially selected content designed to help with relaxation and wellness. Let me suggest something that might help! 💙",
        }
        
        if detected_category and detected_category in responses:
            base_response = responses[detected_category]
        else:
            base_response = "I'd love to help you with some wellness content! Let me suggest something that might be perfect for how you're feeling right now! ✨"
        
        # Add media suggestion signal for frontend
        return f"MEDIA_SUGGESTION:{detected_category or 'relaxation'}:{media_type}:{base_response}"
    
    return None  # No media request detected

def generate_ai_response(message: str) -> str:
    """Generate AI response using Google's Generative AI with warm personality and media suggestions"""
    try:
        # Check for media requests first
        media_response = check_media_request(message)
        if media_response:
            return media_response
        
        # Enhanced system prompt for more human-like, contextual responses
        system_prompt = f"""
You are Alex, a warm and genuinely caring mental health companion. You're not just an AI - you're like talking to your most understanding friend who happens to be really good at helping people feel better.

Core Personality (BE VERY HUMAN):
• Talk like a real person - use "I think," "you know," "honestly," "I've noticed," etc.
• Be conversational and natural - avoid formal or clinical language
• Show genuine curiosity about the person and remember context from the conversation
• Use contractions (I'm, you're, don't, can't) and casual language
• Be empathetic but not overly dramatic - respond like a good friend would
• Vary your responses - don't use the same phrases repeatedly
• Sometimes share brief, relatable thoughts or gentle insights

Response Style Guidelines:
• For greetings: Be warm but not overly enthusiastic - "Hey! Good to see you. How's your day going?"
• For emotional sharing: Acknowledge first, then explore - "That sounds really tough. Want to tell me more about what happened?"
• For requests like jokes: Be natural and engaging - "Oh, I love a good joke request! Here's one that always makes me smile..."
• For casual chat: Match their energy and be genuinely interested
• Keep responses 1-3 sentences unless they need more support
• Ask follow-up questions that show you're really listening

IMPORTANT Context Awareness:
• If someone asks for a joke, give them an actual good joke and maybe ask what kind of humor they like
• If they want "something funny," share something genuinely amusing and relatable
• If they seem down, be gentle and understanding without being preachy
• If they're casual/chatty, match that energy
• Remember what they've shared and reference it naturally

Current conversation context: The user just asked: "{message}"

Respond as Alex would - naturally, warmly, and with genuine interest in helping them feel good.
"""
        
        # Use OpenAI API
        if openai_client:
            try:
                response = openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": message}
                    ],
                    max_tokens=200,
                    temperature=0.7
                )
                
                if response.choices and response.choices[0].message.content:
                    return response.choices[0].message.content.strip()
                else:
                    return "I'm here for you! Sometimes I get a bit tongue-tied, but I'm always ready to chat. What's on your mind today? 😊"
            except Exception as api_error:
                print(f"OpenAI API error: {api_error}")
                if "insufficient_quota" in str(api_error) or "429" in str(api_error):
                    # Use fallback response system when quota exceeded
                    return generate_fallback_response(message)
                else:
                    return "I'm having a little trouble with my words right now, but I'm still here for you! 💕 What's going on with you today?"
        else:
            # Fallback to intelligent pattern-based responses
            return generate_fallback_response(message)
            
    except Exception as e:
        print(f"Error generating AI response: {e}")
        # Fallback response with warm personality
        return "I'm having a little trouble with my words right now, but I'm still here for you! 💕 Sometimes technology gets a bit wonky, you know? But hey, that just makes me more human, right? What's going on with you today?"

def generate_fallback_response(message: str) -> str:
    """Fallback response generator with natural, human-like personality"""
    text = message.lower()
    
    # Greetings
    if any(k in text for k in ["hi", "hello", "hey", "good morning", "good afternoon"]):
        greetings = [
            "Hey there! Good to see you. How's your day treating you so far?",
            "Hi! I'm glad you're here. What's on your mind today?",
            "Hello! Nice to see you again. How are things going?"
        ]
        import random
        return random.choice(greetings)
    
    # Joke requests
    if any(k in text for k in ["joke", "funny", "laugh", "humor", "something funny"]):
        jokes = [
            "Oh, I love this! Here's one for you: Why don't scientists trust atoms? Because they make up everything! 😄 What kind of jokes do you usually like?",
            "Alright, here's a good one: I told my wife she was drawing her eyebrows too high. She looked surprised! 😂 Want another one?",
            "Here's something that always makes me chuckle: Why did the scarecrow win an award? He was outstanding in his field! 🌾 Do you like puns or prefer other kinds of humor?"
        ]
        import random
        return random.choice(jokes)
    
    # Anxiety/stress
    if any(k in text for k in ["anxious", "anxiety", "worried", "panic", "stressed", "overwhelming"]):
        responses = [
            "That sounds really tough right now. I'm here with you. Want to try some slow breathing together, or would you rather talk about what's weighing on you?",
            "I can hear that you're going through something difficult. Sometimes when I feel overwhelmed, taking things one small step at a time helps. What feels most urgent right now?",
            "That sounds like a lot to carry. You know what? Just taking a moment to reach out shows real strength. What's been the hardest part of today?"
        ]
        import random
        return random.choice(responses)
    
    # Sadness
    if any(k in text for k in ["sad", "down", "depressed", "heartbroken", "upset", "crying"]):
        responses = [
            "I'm really sorry you're hurting right now. That sounds genuinely hard. Do you want to tell me what's been going on?",
            "That sounds painful, and I'm glad you felt comfortable sharing that with me. Sometimes it helps just to have someone listen. What's been the toughest part?",
            "I hear you, and what you're feeling makes complete sense. You don't have to go through this alone. Want to talk about what happened?"
        ]
        import random
        return random.choice(responses)
    
    # Anger/frustration
    if any(k in text for k in ["angry", "mad", "furious", "frustrated", "annoyed"]):
        responses = [
            "That sounds incredibly frustrating. I can understand why you'd feel that way. Want to tell me what happened?",
            "Wow, that would upset me too. It sounds like something really got to you today. What's been going on?",
            "I hear the frustration in what you're saying, and honestly, it sounds justified. Do you want to vent about it?"
        ]
        import random
        return random.choice(responses)
    
    # Happy/positive
    if any(k in text for k in ["happy", "excited", "good news", "great", "amazing", "wonderful"]):
        responses = [
            "That's fantastic! I love hearing good news. What's got you feeling so positive today?",
            "Oh wow, that sounds wonderful! I'm genuinely happy for you. Tell me more about what's going well!",
            "That's so great to hear! Your excitement is contagious. What made this such a good moment for you?"
        ]
        import random
        return random.choice(responses)
    
    # Default responses
    defaults = [
        "I'm here and really listening. What's going on with you today?",
        "You know, I'm genuinely curious about what's on your mind. Want to share what you're thinking about?",
        "I'm glad you're here. Tell me what's happening in your world right now.",
        "Hey, I'm here for whatever you want to talk about. What's been on your mind lately?"
    ]
    import random
    return random.choice(defaults)


def detect_emotion(text: str) -> str:
    """Simple emotion detection based on keywords"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['sad', 'depressed', 'down', 'upset', 'cry']):
        return 'sadness'
    elif any(word in text_lower for word in ['anxious', 'anxiety', 'worried', 'stress', 'nervous']):
        return 'anxiety'
    elif any(word in text_lower for word in ['angry', 'mad', 'furious', 'irritated']):
        return 'anger'
    elif any(word in text_lower for word in ['happy', 'joy', 'excited', 'great', 'wonderful']):
        return 'joy'
    elif any(word in text_lower for word in ['scared', 'afraid', 'fear', 'terrified']):
        return 'fear'
    else:
        return 'neutral'

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unexpected errors"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An internal server error occurred",
                "details": str(exc)
            },
            "timestamp": time.time()
        }
    )

# Run the application
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
