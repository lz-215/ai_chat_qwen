@echo off
cd frontend && (
  echo Installing frontend dependencies...
  npm install && (
    echo Starting frontend development server...
    npm run dev
  )
)
