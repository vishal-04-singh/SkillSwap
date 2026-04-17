# SkillSwap - MCA Sem-II Full-Stack Project

## Project Overview
- **Type**: Full-stack MERN application with MongoDB
- **Tech Stack**: React 18 + Vite + TypeScript + Tailwind CSS | Node.js + Express.js + TypeScript | MongoDB + Prisma ORM
- **Roles**: student, faculty (mentor)
- **Auth**: JWT + bcrypt, role-based access

## Quick Start

### 1. Setup MongoDB
```bash
# Ensure MongoDB is running with replica set
/opt/homebrew/bin/mongod --replSet rs0 --dbpath /Users/vishal04/Desktop/DBMS/data --port 27017 --fork --logpath /Users/vishal04/Desktop/DBMS/data/mongod.log

# Initialize replica set (first time only)
/opt/homebrew/bin/mongosh --eval 'rs.initiate()'
```

### 2. Start Backend
```bash
cd backend
npm install
cp .env.example .env  # Edit with your MongoDB URI
npx prisma generate
npx prisma db push    # Sync schema to MongoDB
npm start             # or npm run dev
```

### 3. Seed Database
```bash
cd backend
npx ts-node prisma/seed.ts
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### Test Accounts
- Faculty: `priya.sharma@university.edu` / `password123`
- Student: `aarav.gupta@student.edu` / `password123`

## Database Schema (7 Collections)

### Collections
- `User` — `_id` ObjectId, roll_number UNIQUE, email UNIQUE, role, avg_rating
- `Skill` — `_id` ObjectId, name, categoryId (ref)
- `SkillCategory` — `_id` ObjectId, name
- `UserSkill` — `_id` ObjectId, userId+skillId UNIQUE, proficiency_level, years_of_experience
- `SkillSession` — `_id` ObjectId, mentorId, menteeId, skillId, title, status, scheduled_date
- `SessionReview` — `_id` ObjectId, sessionId UNIQUE, rating, comment
- `Notification` — `_id` ObjectId, userId, message, is_read

### Aggregation Pipeline (MongoDB Equivalent of VIEW/PROCEDURE)
- **Leaderboard**: Aggregation pipeline calculating avg_rating from completed sessions with reviews
- **Session Booking**: Application-level transaction with conflict check
- **Auto-rating**: Recalculated on each review insert/update

## Key Implementation Notes

### Session Booking Flow
1. Student requests session → status: 'pending'
2. Mentor accepts → status: 'confirmed'
3. After session → status: 'completed', prompts review
4. Review submitted → mentor avg_rating recalculated

### Role-Based Access
- **Student**: Browse skills, book sessions, review mentors
- **Faculty**: Manage skills, accept/reject requests, view sessions

### API Endpoints
```
POST   /api/auth/register      POST   /api/auth/login
GET    /api/auth/profile       GET    /api/skills
GET    /api/skills/categories  GET    /api/skills/users/:id
POST   /api/skills            DELETE /api/skills/:id
GET    /api/sessions          POST   /api/sessions
PATCH  /api/sessions/:id/status GET   /api/sessions/stats
POST   /api/reviews           GET    /api/reviews/leaderboard
GET    /api/notifications     PATCH  /api/notifications/:id/read
```

## Design System (Supabase-Inspired)
- **Theme**: Dark mode primary
- **Primary**: `#3ecf8e` (Emerald green)
- **Background**: `#171717` (Near black)
- **Surface**: `#0f0f0f` (Darker)
- **Border**: `rgba(255,255,255,0.1)`
- **Components**: Pill buttons, glass effect (backdrop-blur), no shadows
- **Animations**: framer-motion for page transitions

## Environment Variables

### Backend (.env)
```
DATABASE_URL="mongodb://localhost:27017/skillswap_db?replicaSet=rs0"
JWT_SECRET="your-secret-key-min-32-chars"
PORT=5001
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api
```

## File Structure
```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma schema (MongoDB provider)
│   └── seed.ts           # Database seeding script
├── src/
│   ├── index.ts          # Express entry point
│   ├── config/           # env config
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic (Prisma queries)
│   ├── middleware/       # Auth (JWT) + Validation (Zod)
│   ├── routes/          # API routes
│   └── types/            # TypeScript interfaces
frontend/
├── public/
│   └── favicon.svg       # SkillSwap logo
├── src/
│   ├── components/       # Navbar, Layout, StatCard, SessionCard, Modal, StarRating
│   ├── pages/            # Dashboard, Login, Register, MySkills, BrowseMentors, Sessions, BookSession, Leaderboard, Notifications
│   ├── context/          # AuthContext
│   ├── services/         # API client (axios)
│   └── types/            # TypeScript interfaces
```

## MongoDB-Specific Notes
- IDs are MongoDB ObjectIds (24-character hex strings)
- Use `@db.ObjectId` in Prisma schema
- Aggregation pipelines for complex queries (leaderboard, stats)
- Application-level transactions for multi-document operations
- Requires replica set for Prisma transactions

## Required Packages

### Backend
```bash
npm install express cors helmet dotenv bcryptjs jsonwebtoken zod prisma @prisma/client
npm install -D typescript ts-node @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken prisma
```

### Frontend
```bash
npm install react-router-dom axios framer-motion react-hot-toast date-fns
npm install -D tailwindcss postcss autoprefixer @vitejs/plugin-react
```

## Common Commands
```bash
# Start MongoDB
/opt/homebrew/bin/mongod --replSet rs0 --dbpath /Users/vishal04/Desktop/DBMS/data --port 27017 --fork --logpath /Users/vishal04/Desktop/DBMS/data/mongod.log

# Initialize replica set
/opt/homebrew/bin/mongosh --eval 'rs.initiate()'

# Reset database
cd backend && npx prisma db push --force-reset && npx ts-node prisma/seed.ts
```

## Deliverables Status
- [x] Project Report (Project_Report.md)
- [x] README with setup instructions
- [x] Source code (backend + frontend)
- [x] Custom favicon
