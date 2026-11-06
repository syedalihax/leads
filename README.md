# Lead Management MERN App

A simple MERN stack app for managing leads.

## Features

- React frontend
- Express backend API
- MongoDB-ready models
- Lead create, read, update, and delete flow
- Simple dashboard UI

## Run locally

1. Install dependencies:
   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```
2. Create a `.env` file inside `server`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/lead-management
   ```
3. Start both apps:
   ```bash
   npm run dev
   ```

The React app runs on http://localhost:5173 and the API runs on http://localhost:5000.

## Project structure

- `client/` - React + Vite frontend
- `server/` - Express backend
