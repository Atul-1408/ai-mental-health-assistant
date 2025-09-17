# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AI Mental Health Assistant is a full-stack mental health companion application featuring:
- **Backend**: FastAPI-based Python server with OpenAI GPT integration
- **Frontend**: React TypeScript SPA with styled-components and modern UI
- **Architecture**: Client-server with RESTful API communication
- **AI Features**: GPT-powered conversational assistant with emotion detection and crisis support

## Development Commands

### Backend Development
```bash
# Setup virtual environment and dependencies
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Run development server with hot reload
python main.py
# Server runs on http://localhost:8001

# Production server
uvicorn main:app --host 0.0.0.0 --port 8001

# Test backend connectivity
# Use the health check endpoint: GET http://localhost:8001/health
```

### Frontend Development
```bash
# Install dependencies and start development server
cd frontend
npm install
npm start
# App runs on http://localhost:3000

# Build for production
npm run build

# Run tests
npm test

# Type checking
npx tsc --noEmit
```

### Environment Configuration
```bash
# Backend requires .env file in backend/ directory
# Copy .env.example to .env and configure:
OPENAI_API_KEY=your-openai-api-key-here
DEBUG=true
CORS_ORIGINS=["http://localhost:3000"]
```

## Architecture & Code Structure

### High-Level Architecture
- **Monorepo Structure**: Separate `backend/` and `frontend/` directories
- **API Communication**: Frontend communicates with backend via REST API on port 8001
- **State Management**: React Context for theme and authentication state
- **Styling**: Styled-components with theme provider and glassmorphism design
- **AI Integration**: OpenAI GPT-4 with intelligent fallback responses

### Backend Architecture (Python/FastAPI)
- **Single File Application**: All logic in `backend/main.py` (400+ lines)
- **Key Components**:
  - Authentication endpoints with test credentials (demo/password)
  - Chat endpoints with OpenAI integration and fallback responses
  - Emotion detection with keyword-based analysis
  - Media suggestion system for wellness content
  - CORS configuration for local development

### Frontend Architecture (React/TypeScript)
- **Component Structure**: Organized by feature (Auth, Chat, Dashboard, Common, etc.)
- **Key Architectural Patterns**:
  - Context providers for theme and global state
  - Styled-components with theme integration
  - Service layer abstraction (`services/api.ts`)
  - Type-safe interfaces in `types/index.ts`
  
### Core Components
- **App.tsx**: Root component with authentication flow and view routing
- **ChatInterface**: Main conversational UI with message handling
- **ModernDashboard**: Multi-view dashboard with wellness features
- **ThemeContext**: Theme management with light/dark mode support
- **ApiService**: Centralized HTTP client with auth token management

### State Management Flow
1. **Authentication**: JWT token stored in localStorage, managed by ApiService
2. **Theme**: Context provider with localStorage persistence
3. **Chat Messages**: Local component state with API persistence
4. **User Profile**: Context-based user data management

### API Integration Patterns
- **Axios Instance**: Configured with interceptors for auth and error handling
- **Error Boundaries**: Global error handling with user-friendly messages
- **Fallback Systems**: Local responses when OpenAI API is unavailable
- **Type Safety**: Full TypeScript interfaces for API requests/responses

## Key Development Patterns

### Component Development
- Use functional components with hooks
- Implement styled-components with theme props
- Follow the established glassmorphism design system
- Include error boundaries for robust UX

### API Development
- RESTful endpoints following `/api/v1/` convention
- Consistent response format with success/error structure
- OpenAI integration with intelligent fallback handling
- CORS configuration for cross-origin requests

### Authentication Flow
- JWT token-based authentication
- Demo credentials: username="demo", password="password"
- Token persistence in localStorage
- Automatic token refresh handling

### Styling Guidelines
- Use theme context for consistent colors and spacing
- Implement glassmorphism effects with backdrop-filter
- Responsive design with mobile-first approach
- Consistent animation patterns with keyframes

## Testing & Quality

### Backend Testing
- No formal test suite currently implemented
- Manual testing via `/health` endpoint
- API documentation available at `/docs` when server running

### Frontend Testing
- Jest and React Testing Library configured
- Run tests with `npm test`
- Component testing patterns established

### Code Quality Tools
- Backend: Black and isort for Python formatting
- Frontend: ESLint with react-app configuration
- TypeScript strict mode enabled

## Common Development Tasks

### Adding New Chat Features
1. Update backend `main.py` with new endpoint
2. Add TypeScript types in `frontend/src/types/index.ts`
3. Update `ApiService` with new method
4. Implement UI components following existing patterns

### Theme Customization
- Modify `ThemeContext.tsx` for new theme variables
- Update styled-components to use new theme properties
- Test both light and dark modes

### API Endpoint Development
- Follow RESTful conventions
- Implement consistent error handling
- Add CORS configuration if needed
- Document endpoints in FastAPI automatic docs

### Database Integration (Future)
- Backend structured for easy database integration
- User model interfaces already defined in TypeScript
- Authentication system ready for database persistence

## Deployment Notes

### Environment Requirements
- **Backend**: Python 3.8+, OpenAI API key required
- **Frontend**: Node.js 16+, builds to static files
- **Development**: Both servers run simultaneously (ports 3000 and 8001)

### Production Considerations
- Backend runs on uvicorn ASGI server
- Frontend builds to static files for CDN deployment
- Environment variables required for OpenAI integration
- CORS origins must be configured for production domains

### Security Notes
- API keys managed through environment variables
- JWT tokens for session management
- CORS properly configured for cross-origin requests
- No sensitive data stored in client-side code

## Development Workflow

1. **Start Backend**: `cd backend && python main.py`
2. **Start Frontend**: `cd frontend && npm start`
3. **Access Application**: http://localhost:3000
4. **API Documentation**: http://localhost:8001/docs
5. **Test Login**: Use demo/password credentials

The application follows modern full-stack development patterns with clear separation of concerns, type safety, and robust error handling throughout the stack.
