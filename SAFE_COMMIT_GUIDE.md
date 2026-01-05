# Safe Git Commit Guide

## 📋 Pre-Commit Checklist (Always Do This!)

Before committing, verify:
- [ ] All files you want to commit are listed
- [ ] No sensitive data (passwords, API keys) in files
- [ ] No accidental files (node_modules, .env, etc.)
- [ ] Code works and is tested
- [ ] You're on the correct branch

---

## 🛡️ Safe Commit Process

### Step 1: Check Current Status
```bash
git status
```
**What to look for:**
- Modified files you expect
- New files you want to add
- No unexpected files

### Step 2: Review Changes (IMPORTANT!)
```bash
# See what changed in each file
git diff

# Or check specific file
git diff filename.jsx
```
**Before proceeding:** Make sure changes look correct!

### Step 3: Stage Files (Add to Commit)
```bash
# Add specific files (RECOMMENDED)
git add backend/
git add sync-backend.ps1
git add setup-backend.ps1
git add BACKEND_INTEGRATION.md

# OR add all (use carefully!)
git add .
```

### Step 4: Verify Staged Files
```bash
git status
```
**Check:** Only files you want are "Changes to be committed"

### Step 5: Review Staged Changes One Last Time
```bash
git diff --staged
```
**This shows exactly what will be committed!**

### Step 6: Commit with Message
```bash
git commit -m "Your commit message"

# OR for multi-line message
git commit
# (Opens editor for detailed message)
```

### Step 7: Verify Commit
```bash
# See your commit
git log -1

# See what was committed
git show HEAD
```

### Step 8: Push to Remote
```bash
# Push to main branch
git push origin main

# If push fails (branch protection), create PR instead
git push origin your-branch-name
```

---

## 🚨 Emergency: Undo Commands

### Before Pushing:

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```bash
git reset --hard HEAD~1
```

**Unstage files (keep changes):**
```bash
git restore --staged filename
# Or unstage everything:
git restore --staged .
```

**Discard changes in file:**
```bash
git restore filename
```

### After Pushing:

**⚠️ DON'T use `git reset` after pushing!**

Instead, revert the commit:
```bash
git revert HEAD
git push origin main
```

---

## ✅ Best Practices

1. **Commit often** - Small, focused commits are better
2. **Test before committing** - Make sure code works
3. **Write clear messages** - Explain WHAT and WHY
4. **Review diffs** - Always check `git diff --staged`
5. **One feature per commit** - Don't mix unrelated changes
6. **Use branches** - For experimental features
7. **Pull before push** - Avoid conflicts: `git pull origin main`

---

## 📝 Commit Message Format

### Good Structure:
```
<type>: <short summary (50 chars max)>

<detailed description (optional)>

- Bullet point 1
- Bullet point 2

Why this change was needed.
```

### Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, no code change
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance (dependencies, config)

### Example:
```
feat: Add PHP backend with instructor quiz CRUD

- Complete database schema (5 tables)
- Authentication with bcrypt hashing
- Instructor quiz management (create, edit, delete, get)
- Student quiz endpoints
- CORS configured for React dev server
- Sync scripts for easy backend updates

Tested via PowerShell, all endpoints verified working.
Addresses need for persistent data storage beyond localStorage.
```

---

## 🎯 Quick Reference Commands

```bash
# Status check
git status

# See changes
git diff
git diff --staged

# Stage files
git add filename
git add .

# Commit
git commit -m "message"

# Push
git push origin main

# View history
git log --oneline -10

# Undo last commit (not pushed)
git reset --soft HEAD~1
```
