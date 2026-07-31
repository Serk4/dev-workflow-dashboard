# How to Run Locally - Complete Guide

## 🚀 Fastest Way (Copy & Paste)

```bash
cd dev-workflow-dashboard
npm install
echo "DATABASE_URL=file:./dev.db" > .env
echo "GITHUB_TOKEN=" >> .env
npm run prisma:migrate
npm run dev
```

Then open: **http://localhost:5173**

---

## 📝 Step-by-Step Instructions

### Step 1: Prerequisites ✅

Make sure you have installed:
- **Node.js 18+**: Download from https://nodejs.org/
- **npm 9+**: Comes with Node.js

Verify:
```bash
node --version    # Should be v18+
npm --version     # Should be 9+
git --version     # Optional, for cloning
```

### Step 2: Get the Code

**Option A: If you have a git clone**
```bash
cd dev-workflow-dashboard
```

**Option B: If you downloaded a zip file**
```bash
# Extract the zip file first
cd path/to/extracted/dev-workflow-dashboard
```

### Step 3: Install Dependencies

```bash
npm install
```

⏱️ **Time**: 2-3 minutes (first time only)

This downloads and installs all required packages.

### Step 4: Create Environment File

Create a file named `.env` in the project root with:

```
DATABASE_URL=file:./dev.db
GITHUB_TOKEN=
```

**Option A: Using command line (Windows PowerShell)**
```powershell
@"
DATABASE_URL=file:./dev.db
GITHUB_TOKEN=
"@ | Out-File .env -Encoding UTF8
```

**Option B: Using command line (Mac/Linux)**
```bash
cat > .env << EOF
DATABASE_URL=file:./dev.db
GITHUB_TOKEN=
EOF
```

**Option C: Manual**
- Create a text file named `.env` in project root
- Paste the contents above
- Save

### Step 5: Setup Database

```bash
npm run prisma:migrate
```

This creates `dev.db` SQLite database with all tables.

### Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
VITE v8.2.0  ready in 245 ms

➜  Local:   http://localhost:5173/
```

### Step 7: Open in Browser

Click or copy/paste: **http://localhost:5173**

✅ You're done! The app is running.

---

## 🌐 What's Running

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | http://localhost:5173 | ✅ Running |
| **Backend API** | http://localhost:4000/trpc | ✅ Running |
| **Database** | dev.db (local SQLite) | ✅ Ready |

---

## 🎯 Test the Features

### 1. Create a Task
1. Go to http://localhost:5173
2. Under "Tasks", enter "Learn tRPC"
3. Press Enter or click "Add"
4. Click the checkbox to complete it
5. ✅ Task created and activity logged

### 2. Create a Recipe
1. Scroll to "Workflow Recipes"
2. Name: "Deploy Process"
3. Steps: "1. Test\n2. Build\n3. Deploy"
4. Click "Save recipe"
5. ✅ Recipe created

### 3. Create a Snippet
1. Scroll to "Snippet Library"
2. Title: "Hello World"
3. Content: `console.log("Hello, World!");`
4. Click "Save snippet"
5. ✅ Snippet created with code highlighting

### 4. Check Activity Log
1. Scroll to "Recent Activity" or navigate to Activity Log page
2. You should see all 3 items you created
3. View statistics
4. ✅ Activity tracking working

### 5. Optional: GitHub Integration
1. Navigate to "GitHub Activity"
2. If you see "GitHub token not configured", it means:
   - GitHub features disabled (normal if no token)
   - App still works perfectly without GitHub

---

## 🔑 GitHub Integration (Optional)

If you want GitHub features to work:

### Get a GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: `dev-dashboard-local`
4. Select scopes:
   - ✅ `repo` (full control of repositories)
   - ✅ `workflow` (full control of workflows)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)

### Add to .env

```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

Replace `xxxxxxxxxxxxxxxxxxxx` with your actual token.

### Restart Server

```bash
# Stop: Press Ctrl+C in terminal
# Start again:
npm run dev
```

### Test It

1. Go to http://localhost:5173
2. Navigate to "GitHub Activity"
3. You should see repositories loading
4. Click a repository
5. View pull requests, issues, workflows

---

## 📋 Common Commands

### Development

```bash
npm run dev              # Start frontend + backend
npm run dev:server       # Start backend only (port 4000)
npm run dev:client       # Start frontend only (port 5173)
```

### Building

```bash
npm run build            # Build for production
npm run preview          # Preview production build
```

### Database

```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Apply migrations
npm run prisma:studio    # Open database viewer
```

### Code Quality

```bash
npm run lint             # Check code
npm run lint --fix       # Fix code style
```

---

## 🐛 Troubleshooting

### "npm: command not found"
**Solution**: Install Node.js from https://nodejs.org/

### "Port 5173 already in use"
**Solution**: Either close other app using that port, or kill process:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

### "Cannot find module 'react'"
**Solution**: Install dependencies
```bash
npm install
```

### "ENOENT: no such file or directory 'dev.db'"
**Solution**: Setup database
```bash
npm run prisma:migrate
```

### "GitHub token not configured"
**Solution**: Either:
1. Add token to `.env` (see GitHub Integration section), OR
2. This is normal if you don't want GitHub features

### Port 4000 shows "Cannot GET /"
**Solution**: This is normal - backend is running correctly. The frontend calls the backend API at `/trpc` endpoint.

### "VITE HMR connection failed"
**Solution**: Close browser, clear cache, refresh page

---

## 💾 File Locations

```
Project Root/
├── .env                 ← Your configuration (IMPORTANT)
├── dev.db              ← Database file (created automatically)
├── package.json        ← Dependencies
├── src/                ← Frontend code
├── server/             ← Backend code
├── prisma/             ← Database schema
└── dist/               ← Production build (created by npm run build)
```

### .env File Location
**Full path**: `C:\Users\david\source\repos\dev-workflow-dashboard\.env`

---

## 🔄 Development Workflow

### While Developing

1. **Make code changes** in `src/` or `server/` folders
2. **Browser auto-refreshes** (HMR - Hot Module Replacement)
3. **No manual rebuild needed**
4. **Database changes**: Edit `prisma/schema.prisma`, then run:
   ```bash
   npm run prisma:migrate
   ```

### Before Committing

```bash
npm run lint          # Check code style
npm run build         # Verify production build works
```

---

## 📊 Performance Tips

### Frontend Development
- Use Chrome DevTools (F12) > React Profiler tab
- Console shows tRPC request/response
- Network tab shows all API calls

### Backend Development
- Terminal shows tRPC errors
- Add `console.log` in server/routers/*.ts files
- View database with `npm run prisma:studio`

### Database Inspection
```bash
npm run prisma:studio
```
Opens visual database editor at http://localhost:5555

---

## 🚀 Next Steps After Setup

### Learn the Code
1. Check out `src/App.tsx` (main app)
2. Look at `src/pages/TasksPage.tsx` (task management)
3. Review `server/routers/tasks-router.ts` (API)
4. Check `prisma/schema.prisma` (database)

### Modify Features
- Add new fields to database: Edit schema.prisma → Run migration
- Add new API endpoints: Add to server/routers/*.ts
- Add new pages: Create src/pages/NewPage.tsx
- Change styles: Edit src/App.css

### Run Tests (When Ready)
- TypeScript check: Already running (see build output)
- Manual testing: Use the app via browser
- Production test: `npm run build && npm run preview`

---

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Project folder exists
- [ ] `npm install` completed
- [ ] `.env` file created
- [ ] Database migrated (`npm run prisma:migrate`)
- [ ] `npm run dev` started successfully
- [ ] Frontend loads at http://localhost:5173
- [ ] Can create tasks
- [ ] Can create recipes
- [ ] Can create snippets
- [ ] Activity log shows your actions

---

## 🎉 Success!

Once all checks above pass, your Dev Workflow Dashboard is **running locally** and ready to use!

### What You Can Do Now:
✅ Create tasks and track completion  
✅ Save workflow recipes  
✅ Store code snippets  
✅ View activity audit trail  
✅ Browse GitHub (if token configured)  
✅ Modify and extend the code  
✅ Build production version  

---

## 📚 Additional Resources

For more detailed information, see:
- **LOCAL_SETUP_GUIDE.md** - Comprehensive setup guide
- **QUICK_REFERENCE.md** - Commands cheat sheet
- **README.md** - Project overview
- **GITHUB_ACTIVITY_INTEGRATION.md** - GitHub setup details

---

## 💬 Common Questions

**Q: Does the app require internet?**  
A: Mostly no, except GitHub features need internet access to GitHub API.

**Q: Can I use MySQL/PostgreSQL instead of SQLite?**  
A: Yes! Edit `.env`: `DATABASE_URL="mysql://user:pass@localhost/dbname"`

**Q: Can I change the ports?**  
A: Yes! Edit `package.json` scripts or environment variables.

**Q: Is data persistent?**  
A: Yes! `dev.db` SQLite file stores all data locally. Delete it to reset.

**Q: Can I share the database?**  
A: Yes, if you use MySQL/PostgreSQL instead of SQLite. For SQLite, each person needs their own file.

---

## 🎓 Learning Resources

### Understanding the Stack
- **React**: UI framework (front-end)
- **TypeScript**: Type-safe JavaScript
- **tRPC**: Type-safe APIs
- **Prisma**: Database ORM
- **SQLite**: Local database
- **Vite**: Build tool

### Where to Learn
- React: https://react.dev
- tRPC: https://trpc.io
- Prisma: https://prisma.io
- TypeScript: https://typescriptlang.org

---

**Ready to build? Start with `npm run dev`!** 🚀
