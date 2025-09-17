# 🧠 AI Mental Health Assistant

A compassionate AI-powered mental health companion that provides emotional support, conversation, and wellness tools through an intuitive chat interface.

## ✨ Features

- **🤖 Intelligent AI Chat**: Natural conversations powered by OpenAI's GPT models
- **😌 Breathing Exercises**: Interactive 4-7-8 breathing technique with visual guidance  
- **🎯 Contextual Responses**: AI understands emotions and responds appropriately
- **💭 Human-like Conversation**: Natural, warm, and empathetic communication style
- **🔐 Privacy Focused**: Secure handling of sensitive conversations
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend (Python/FastAPI)
- **FastAPI**: Modern, fast web framework for Python
- **OpenAI Integration**: GPT-4 powered conversational AI
- **Smart Fallback System**: Local responses when API is unavailable
- **RESTful API**: Clean, documented endpoints

### Frontend (React/TypeScript)
- **React 18**: Modern UI with hooks and functional components
- **TypeScript**: Type-safe development
- **Styled Components**: Dynamic, themeable styling
- **Real-time Chat**: Responsive messaging interface

## 🚀 Quick Start

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **OpenAI API Key**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/ai-mental-health-assistant.git
   cd ai-mental-health-assistant/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

5. **Start the server**
   ```bash
   python main.py
   ```
   Server runs on `http://localhost:8001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   App runs on `http://localhost:3000`

## 🎮 Demo Access

For quick testing, use these demo credentials:
- **Username**: `demo`
- **Password**: `password`

The application includes intelligent fallback responses when OpenAI API is not configured.

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework
- **OpenAI GPT-4** - Conversational AI
- **Python 3.8+** - Core language
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Features
- **Glassmorphism UI** - Modern design aesthetic
- **Dark/Light Theme** - User preference support
- **Responsive Design** - Mobile-first approach
- **Crisis Detection** - Safety-focused features
- **Emotion Analysis** - Contextual understanding

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Required
OPENAI_API_KEY=your-openai-api-key-here

# Optional
DEBUG=true
SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:3000"]
```

## 📖 API Documentation

Once the backend is running, visit:
- **Interactive Docs**: `http://localhost:8001/docs`
- **ReDoc**: `http://localhost:8001/redoc`

### Key Endpoints

- `POST /api/v1/chat/send` - Send message to AI
- `POST /api/v1/emotions/analyze` - Analyze text emotion
- `GET /health` - Health check

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests  
```bash
cd frontend
npm test
```

## 🏢 Production Deployment

### Backend
```bash
# Install production dependencies
pip install -r requirements.txt

# Run with production server
uvicorn main:app --host 0.0.0.0 --port 8001
```

### Frontend
```bash
# Build for production
npm run build

# Serve static files (use nginx, apache, or hosting service)
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API
- **FastAPI** for the excellent web framework
- **React** team for the amazing frontend library
- Mental health professionals who inspired this project

## 📞 Support

If you have questions or need help:

- 📧 Email: [Update with your email]
- 🐛 Issues: [GitHub Issues](https://github.com/[your-username]/ai-mental-health-assistant/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/[your-username]/ai-mental-health-assistant/discussions)

---

**⚠️ Important Notice**: This application is for informational and wellness purposes only. It is not a substitute for professional mental health care, diagnosis, or treatment. If you're experiencing a mental health crisis, please contact a licensed mental health professional or emergency services immediately.

---

<div align="center">
  Made with ❤️ for mental wellness
</div>
