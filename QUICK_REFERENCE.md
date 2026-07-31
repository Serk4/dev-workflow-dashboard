# Quick Reference - Local Setup

## ⚡ 5-Minute Setup

```bash
# 1. Navigate to project
cd dev-workflow-dashboard

# 2. Install dependencies
npm install

# 3. Create .env file
echo "DATABASE_URL=file:./dev.db" > .env
echo "GITHUB_TOKEN=" >> .env

# 4. Setup database
npm run prisma:migrate

# 5. Start dev server
npm run dev
```

✅ Open http://localhost:5173

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | Web interface |
| Backend API | http://localhost:4000/trpc | API endpoint |
| DB Studio | npm run prisma:studio | Database viewer |

---

## 📋 Essential Commands

```bash
npm run dev              # Start everything
npm run dev:server      # Backend only (port 4000)
npm run dev:client      # Frontend only (port 5173)
npm run build           # Production build
npm run lint            # Check code quality
npm run prisma:studio   # Open database viewer
npm run prisma:migrate  # Setup database
```

---

## 📁 Key Files to Edit

```
src/
  ├── pages/            ← Feature pages
  ├── components/       ← Reusable parts
  ├── App.tsx          ← Main app
  └── App.css          ← Styling

server/
  └── routers/         ← API endpoints

prisma/
  └── schema.prisma    ← Database schema

.env                   ← Configuration
```

---

## 🐛 Quick Fixes

| Problem | Fix |
|---------|-----|
| Port in use | `netstat -ano \| findstr :5173` then `taskkill /PID <PID> /F` |
| No database | `npm run prisma:migrate` |
| Missing packages | `npm install` |
| TypeScript errors | `npm run prisma:generate` |
| GitHub not working | Add token to `.env` from https://github.com/settings/tokens |

---

## 🎯 Verify It Works

```bash
# Check frontend
curl http://localhost:5173

# Check backend
curl http://localhost:4000/trpc/task.list
```

---

## 📚 Full Documentation

See `LOCAL_SETUP_GUIDE.md` for detailed instructions.
