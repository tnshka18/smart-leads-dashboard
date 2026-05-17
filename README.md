
# ⚡ Smart Leads Dashboard

Full-stack MERN Lead Management Dashboard with TypeScript.

---

## 🚀 Quick Start (Docker — ONE COMMAND)

> Prerequisites: Docker Desktop installed and running.

```bash
docker-compose up --build
```

Then open: **http://localhost:5173**

**Demo Login:**
- Admin: `admin@demo.com` / `admin123`
- Sales: `sales@demo.com` / `sales123`

To load demo data (25 leads):
```bash
docker exec leads-server node dist/utils/seed.js
```

---

## 🛠️ Manual Setup (No Docker)

Prerequisites: Node.js 18+, MongoDB running locally

```bash
# Install all dependencies
npm run install:all

# Setup env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Seed demo data
cd server && npm run seed && cd ..

# Start dev servers (both together)
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## 🔌 API Endpoints

Base: `http://localhost:5000/api`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login |
| GET | /auth/me | Yes | Current user |
| GET | /leads | Yes | List leads (paginated + filtered) |
| POST | /leads | Yes | Create lead |
| PUT | /leads/:id | Yes | Update lead |
| DELETE | /leads/:id | Yes | Delete lead |
| GET | /leads/stats | Yes | Stats by status |
| GET | /leads/export/csv | Yes | Export CSV |

Query params for GET /leads: `page, limit, status, source, search, sort`

---

## ✅ Features

- JWT Auth + bcrypt password hashing
- Role-Based Access (Admin / Sales)
- Full CRUD Leads
- Debounced Search + Multi-filter (Status + Source + Sort)
- Backend Pagination (skip/limit)
- CSV Export
- Stats Dashboard
- Dark Mode UI
- Docker ready
=======
# smart-leads-dashboard
>>>>>>> e133f6af02b488236c845dc0aea2cc72f1684b06
