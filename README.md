# SecureIn Assessment

This repository contains a complete Recipe Management System built for the SecureIn hiring process, including backend API, database setup, and a React-based frontend UI.

## Project Structure

```
securein_assessment/
├── frontend/           # React-based UI
├── src/               # Backend API
│   ├── models/        # Mongoose schemas
│   └── server.js      # Express server
├── scripts/           # Database import scripts
├── US_recipes_null.json  # Recipe data
└── Documentation files
```

## Quick Start

### 1. Backend Setup

#### Install Dependencies
```bash
npm install
```

#### Configure Environment
Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/recipes_db
PORT=3000
```

#### Import Recipe Data
```bash
npm run import
```

#### Start Backend Server
```bash
npm start
```

Backend runs at: `http://localhost:3000`

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

Frontend runs at: `http://localhost:3001`


