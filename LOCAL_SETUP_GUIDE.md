# Dev Workflow Dashboard - Local Setup Guide

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** 18+ (check: `node --version`)
- **npm** 9+ (check: `npm --version`)
- **Git** (to clone the repo)
- **GitHub Personal Access Token** (for GitHub features, optional)

### Installation

```bash
# 1. Navigate to the project directory
cd dev-workflow-dashboard

# 2. Install dependencies
npm install

# 3. Create environment file
cat > .env << EOF
DATABASE_URL=file:./dev.db
GITHUB_TOKEN=your_github_token_here
EOF

# 4. Set up database
npm run prisma:migrate

# 5. Start development server
npm run dev
```

✅ Done! Open http://localhost:5173 in your browser.

---

## 📋 Detailed Setup Instructions

### Step 1: Clone or Navigate to Project

```bash
# If you don't have the project yet
git clone <repository-url>
cd dev-workflow-dashboard

# If you already have it
cd C:\Users\david\source\repos\dev-workflow-dashboard
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages:
- React 19 + TypeScript
- tRPC + @tanstack/react-query
- Prisma ORM
- Zod validation
- Vite build tool

**Time**: ~2-3 minutes depending on internet speed

### Step 3: Create Environment File

```bash
# Create .env file in project root
cat > .env << EOF
DATABASE_URL=file:./dev.db
GITHUB_TOKEN=ghp_your_token_here
EOF
```

**Or manually create `.env` file with:**
```
DATABASE_URL=file:./dev.db
GITHUB_TOKEN=ghp_your_token_here
```

⚠️ **Note**: 
- `DATABASE_URL=file:./dev.db` uses SQLite (default)
- Leave `GITHUB_TOKEN` empty if you don't need GitHub features (app still works)

### Step 4: Set Up Database

```bash
# Generate Prisma client
npm run prisma:generate

# Apply migrations (creates database)
npm run prisma:migrate
```

This creates `dev.db` SQLite database with all tables.

### Step 5: Start Development Server

```bash
npm run dev
```

Expected output:
```
VITE v8.2.0  ready in 245 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

✅ Server is running!

---

## 🌐 Access the Application

### Frontend
- **URL**: http://localhost:5173
- **Port**: 5173 (Vite dev server)

### Backend API
- **URL**: http://localhost:4000/trpc
- **Port**: 4000 (tRPC server)

### Features Available
- ✅ Tasks management
- ✅ Recipes management
- ✅ Snippets management
- ✅ Activity logging
- ✅ GitHub integration (if GITHUB_TOKEN set)

---

## 📦 Project Structure

```
dev-workflow-dashboard/
├── src/                    # Frontend (React)
│   ├── pages/             # Page components
│   │   ├── TasksPage.tsx
│   │   ├── RecipesPage.tsx
│   │   ├── SnippetsPage.tsx
│   │   ├── ActivityLogPage.tsx
│   │   └── GitHubActivityPage.tsx
│   ├── components/        # Reusable components
│   ├── lib/              # tRPC client
│   ├── App.tsx           # Main app
│   └── App.css           # Styling
├── server/               # Backend (tRPC)
│   ├── routers/         # API routers
│   │   ├── tasks-router.ts
│   │   ├── recipes-router.ts
│   │   ├── snippets-router.ts
│   │   ├── activity-router.ts
│   │   └── github-router.ts
│   ├── context.ts       # tRPC context
│   ├── router.ts        # Main router
│   ├── db.ts            # Database
│   └── index.ts         # Server entry
├── prisma/              # Database
│   └── schema.prisma    # Data models
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── .env                 # Environment variables
```

---

## 🛠️ Common Commands

### Development

```bash
# Start both frontend and backend
npm run dev

# Start only backend (port 4000)
npm run dev:server

# Start only frontend (port 5173)
npm run dev:client
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Database

```bash
# Generate Prisma client
npm run prisma:generate

# Apply pending migrations
npm run prisma:migrate

# Open Prisma Studio (visual database editor)
npm run prisma:studio
```

### Code Quality

```bash
# Run linter
npm run lint

# Lint and fix
npm run lint --fix
```

### Cleaning

```bash
# Remove node_modules
rm -r node_modules

# Remove build artifacts
rm -r dist

# Remove database
rm dev.db

# Fresh install
npm install
```

---

## 🔑 GitHub Token Setup (Optional)

### Get Your GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" (Classic)
3. Give it a name: "Dev Dashboard Local"
4. Select scopes:
   - `repo` - Full control of private repositories
   - `workflow` - Full control of workflows
5. Click "Generate token"
6. Copy the token

### Add to .env

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

### Verify It Works

1. Navigate to GitHub Activity page
2. You should see repositories loading
3. Click a repository to view PRs and issues

⚠️ **If you don't have a token**: App still works, just GitHub features return "GitHub token not configured"

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

```
Error: Port 5173/4000 already in use
```

**Solution**: Kill the process using the port

```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

Or use different ports in package.json scripts.

### Issue: Database Not Found

```
Error: ENOENT: no such file or directory, open 'dev.db'
```

**Solution**: Run migrations
```bash
npm run prisma:migrate
```

### Issue: Dependencies Not Installed

```
Error: Cannot find module '@trpc/client'
```

**Solution**: Install dependencies
```bash
npm install
```

### Issue: TypeScript Errors

```
error TS2304: Cannot find name 'React'
```

**Solution**: Generate Prisma client
```bash
npm run prisma:generate
```

### Issue: GitHub Token Not Working

```
Error: GitHub API error: Unauthorized
```

**Solution**: 
- Verify token in `.env` is correct
- Check token hasn't expired
- Verify token has `repo` and `workflow` scopes

### Issue: Port Shows "Cannot GET /"

**Solution**: This is normal - the tRPC server doesn't have a root route. The frontend at http://localhost:5173 calls the backend at http://localhost:4000/trpc.

---

## 📊 Verify Installation

### Check Frontend Loading

```bash
curl http://localhost:5173
```

Should return HTML.

### Check Backend API

```bash
curl http://localhost:4000/trpc/task.list
```

Should return tRPC response.

### Check Tasks in Database

Open Prisma Studio:
```bash
npm run prisma:studio
```

Or check database file exists:
```bash
ls -la dev.db
```

---

## 🧪 Testing the Features

### 1. Tasks
1. Go to http://localhost:5173
2. Click "Add task" in Tasks section
3. Type task name and press Enter
4. Check box to toggle completion
5. Click edit to change title
6. Click delete to remove

### 2. Recipes
1. Scroll to "Workflow Recipes"
2. Enter recipe name and steps
3. Click "Save recipe"
4. Edit inline or delete

### 3. Snippets
1. Scroll to "Snippet Library"
2. Enter title and code
3. Click "Save snippet"
4. Verify monospace font for code

### 4. Activity Log
1. Scroll to "Recent Activity" or navigate to Activity Log page
2. You should see tasks/recipes/snippets you created
3. Filter by entity type
4. View statistics

### 5. GitHub (if token configured)
1. Navigate to GitHub Activity page
2. Click on a repository
3. View Pull Requests
4. View Issues
5. Create a new issue

---

## 🔄 Workflow

### Development Workflow

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to files
# - Edit src/pages/*.tsx for pages
# - Edit src/App.css for styles
# - Edit server/routers/*.ts for API

# 3. Changes auto-reload in browser

# 4. Check for errors
npm run lint

# 5. Build when ready
npm run build

# 6. Preview production build
npm run preview
```

### Database Workflow

```bash
# 1. Make changes to prisma/schema.prisma
# 2. Create migration
npm run prisma:migrate

# 3. View data
npm run prisma:studio

# 4. Reset database (WARNING: deletes all data)
npm run prisma:migrate reset
```

---

## 📱 Frontend Development Tips

### Hot Module Replacement (HMR)
- Changes to `.tsx` and `.css` files auto-reload
- State is preserved during reload
- No manual refresh needed

### React DevTools
- Install React DevTools browser extension
- Inspect components in Chrome DevTools
- Debug state and props

### Network Tab
- Open Chrome DevTools > Network
- Watch tRPC requests to http://localhost:4000/trpc
- See request/response payloads

---

## 🔧 Backend Development Tips

### View Database with Prisma Studio

```bash
npm run prisma:studio
```

Opens browser interface to view and edit data.

### Debug API Calls

Add to browser console:
```javascript
// See all network requests
console.log(performance.getEntriesByType("resource"))
```

### View Server Logs

Check terminal where `npm run dev:server` is running for tRPC errors.

---

## 🚢 Deployment (After Local Testing)

### Build for Production

```bash
npm run build
```

Creates `dist/` folder with production files.

### Test Production Build Locally

```bash
npm run preview
```

### Deploy

```bash
# Copy dist/ to your hosting provider
# Set environment variables on hosting:
# DATABASE_URL
# GITHUB_TOKEN
# Start server pointing to dist/
```

---

## 📚 Documentation

For more details, see:
- `README.md` - Project overview
- `GITHUB_ACTIVITY_INTEGRATION.md` - GitHub setup
- `COMPLETENESS_CONSISTENCY_CHECKLIST.md` - Feature checklist
- `PROJECT_REVIEW_COMPLETE.md` - Architecture details

---

## 🆘 Need Help?

### Common Issues

1. **"npm command not found"**
   - Install Node.js from https://nodejs.org

2. **"Port 5173 in use"**
   - Kill the process or change port in package.json

3. **"Database error"**
   - Delete `dev.db` and run `npm run prisma:migrate`

4. **"TypeScript errors"**
   - Run `npm run prisma:generate`

5. **"GitHub not working"**
   - Create token at https://github.com/settings/tokens
   - Add to `.env` as `GITHUB_TOKEN=...`

---

## ✅ Quick Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Project cloned/downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with `DATABASE_URL`
- [ ] Database migrations run (`npm run prisma:migrate`)
- [ ] Dev server started (`npm run dev`)
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend runs at http://localhost:4000
- [ ] Can create tasks/recipes/snippets
- [ ] Activity log shows your actions

---

## 🎉 You're Ready!

Your Dev Workflow Dashboard is now running locally. Start creating tasks, recipes, and snippets!

**Happy developing!** 🚀
