# Velocity.ai - AI-Powered Compliance Automation Platform

## Project Structure

The main application is located in the `velocity-platform` directory (legacy naming - will be migrated).

```
Velocity-Platform/
├── velocity-platform/          # Main Velocity.ai application
│   ├── src/               # React/TypeScript source code
│   ├── backend/python/    # Python FastAPI backend services
│   ├── backend/velocity/  # Velocity-specific services
│   ├── src/services/cryptoCore/ # Rust cryptographic engine
│   ├── src/services/truthLayer/ # Blockchain verification
│   ├── dist/             # Build output
│   └── package.json      # Frontend dependencies
├── docs/                 # Comprehensive documentation
└── amplify.yml          # AWS Amplify configuration
```

## Getting Started

```bash
# Navigate to the main application
cd velocity-platform

# Install dependencies
npm install

# Set up Python backend
npm run setup:python

# Run full development stack
npm run dev:full

# Build for production
npm run build
```

## Development Modes

```bash
# Frontend only
npm run dev

# Backend API server
npm run dev:api

# Python FastAPI server
npm run dev:python

# Full stack (all services)
npm run dev:full
```

## Key Features

- **AI Agent Orchestration**: 9 specialized compliance agents
- **Cryptographic Verification**: Rust-powered security engine
- **Truth Layer**: Blockchain-based evidence integrity
- **Real-time Monitoring**: Live compliance dashboard
- **Multi-framework Support**: SOC 2, ISO 27001, GDPR, NIST

## URLs

- **Development**: http://localhost:5173
- **Velocity Subdomain**: http://localhost:5173/velocity
- **Production**: [Your Amplify URL]

## Architecture

- **Frontend**: React/TypeScript with real-time WebSocket updates
- **Backend**: Python FastAPI with Celery task queue
- **Crypto Core**: Rust engine for performance-critical operations
- **Database**: PostgreSQL with Redis caching
- **Blockchain**: Polygon integration for verification
