# ERIP - Enterprise Risk Intelligence Platform

## Project Structure

The main application is located in the `erip-platform` directory.

```
ERIP-app/
├── erip-platform/          # Main frontend application
│   ├── src/               # React/TypeScript source code
│   ├── backend/python/    # Python backend services
│   ├── dist/             # Build output
│   └── package.json      # Frontend dependencies
├── backend/python/        # Legacy Python backend (deprecated)
├── docs/                 # Documentation
└── amplify.yml          # AWS Amplify configuration
```

## Getting Started

```bash
# Navigate to the main application
cd erip-platform

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The application is configured to deploy via AWS Amplify. The `amplify.yml` file ensures the correct directory (`erip-platform`) is built and deployed.

## Frontend URL

- Development: http://localhost:5173
- Production: [Your Amplify URL]

All functionality is consolidated under `/tools/` as the primary navigation path.
