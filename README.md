# Laptop Shop - AdonisJS 6

E-commerce platform for laptop management built with AdonisJS 6 and MongoDB.

## Tech Stack

- **Backend**: AdonisJS 6 (TypeScript)
- **Database**: MongoDB + Mongoose ODM
- **Frontend**: React SPA
- **Auth**: JWT + Session-based

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your MongoDB connection

# Start development
npm run dev              # Backend on :3333

# Frontend (separate terminal)
cd client && npm start   # React on :3000
```

## Project Structure

```
app/
├── controllers/    # API endpoints
├── middleware/     # Auth & CORS
└── models/        # Mongoose schemas

client/            # React frontend
config/            # App configuration
start/
├── api_routes.ts  # REST API
└── routes.ts      # Server routes
```

## Development

- Backend: `npm run dev`
- Frontend: `cd client && npm start`
- Build: `npm run build`
- Type check: `npm run typecheck`

## Status

- Zero TypeScript errors
- Zero linting errors
- Production ready
