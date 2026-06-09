# Setup Guide

## Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB (local or cloud)
- OpenAI API Key
- Git

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/medical-report-simplifier.git
cd medical-report-simplifier
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your settings:
- MONGODB_URI: Your MongoDB connection string
- OPENAI_API_KEY: Your OpenAI API key
- JWT_SECRET: Your secret key

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

App opens at `http://localhost:3000`

## Environment Setup

### MongoDB

**Option 1: Local**
```bash
mongod
```

**Option 2: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create cluster
- Get connection string
- Add to .env

### OpenAI API Key

1. Go to https://platform.openai.com
2. Create account / login
3. Get API key from settings
4. Add to .env

## Troubleshooting

### Port in use
```bash
kill -9 $(lsof -t -i:5000)  # Unix/Mac
```

### MongoDB connection error
- Check MongoDB is running
- Verify connection string
- Check network access (Atlas)

### API errors
- Verify OPENAI_API_KEY
- Check backend is running
- Verify CORS_ORIGIN in .env
