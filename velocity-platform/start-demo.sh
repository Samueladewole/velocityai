#!/bin/bash

echo "🚀 Starting ERIP Demo Platform..."
echo ""

# Install Python dependencies
echo "📦 Installing Python dependencies..."
python3 -m pip install fastapi uvicorn structlog pydantic --break-system-packages --quiet

# Start backend in background
echo "🔧 Starting Python backend..."
cd backend/python
python3 demo_main.py &
BACKEND_PID=€!
cd ../..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend
echo "🎨 Starting React frontend..."
echo ""
echo "🌐 Demo will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8001"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "🎯 Navigate to http://localhost:5173/simple/atlas to see live security scanning!"
echo ""

npm run dev

# Cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down demo..."
    kill €BACKEND_PID 2>/dev/null
}
trap cleanup EXIT