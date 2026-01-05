[33mcommit bde5aee49c67282712f920f72f1c525e601ddca5[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m)[m
Author: BlackRose-26 <lesterpajarillo1342@gmail.com>
Date:   Mon Jan 5 13:55:21 2026 +0800

    feat: Implement dark mode navbar across all student pages
    
    - Add dark mode toggle (sun/moon icon) to navbar on all student pages
    - Add profile dropdown menu with navigation options
    - Update 1.svg logo size (48-56px) and remove navigation onClick
    - Implement consistent theme object with light/dark color schemes
    - Update sidebar styling with theme-aware colors and hover states
    - Add responsive mobile/desktop navbar layouts
    - Update all menu buttons with theme colors and transitions
    - Create comprehensive Git workflow guide for team
    - Update .gitignore to track documentation files
    
    Affects: StudentDashboard, ProfilePage, NotificationsPage, ManageQuizzesPage, MyResultPage

[1mdiff --git a/.gitignore b/.gitignore[m
[1mindex 411bfcf..5b43a5e 100644[m
[1m--- a/.gitignore[m
[1m+++ b/.gitignore[m
[36m@@ -32,4 +32,9 @@[m [m_PROJECT_ARCHIVE/[m
 [m
 # Testing[m
 coverage/[m
[31m-.nyc_output/[m
\ No newline at end of file[m
[32m+[m[32m.nyc_output/[m
[32m+[m
[32m+[m[32m# Documentation (KEEP THESE - they should be tracked)[m
[32m+[m[32m# README.md[m
[32m+[m[32m# GIT_WORKFLOW_GUIDE.md[m
[32m+[m[32m# VIDEO_SCRIPT_GIT_ACTIVITY.md[m
\ No newline at end of file[m
[1mdiff --git a/GIT_WORKFLOW_GUIDE.md b/GIT_WORKFLOW_GUIDE.md[m
[1mnew file mode 100644[m
[1mindex 0000000..4b8cd8d[m
[1m--- /dev/null[m
[1m+++ b/GIT_WORKFLOW_GUIDE.md[m
[36m@@ -0,0 +1,951 @@[m
[32m+[m[32m# Git Workflow Guide for Quiz App Team[m
[32m+[m[32m## Complete Git Commands Reference for 7-Member Development Team[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Table of Contents[m
[32m+[m[32m1. [Initial Setup](#initial-setup)[m
[32m+[m[32m2. [Daily Workflow](#daily-workflow)[m
[32m+[m[32m3. [Branch Management](#branch-management)[m
[32m+[m[32m4. [Commit Best Practices](#commit-best-practices)[m
[32m+[m[32m5. [Push & Pull Operations](#push--pull-operations)[m
[32m+[m[32m6. [Collaboration Workflow](#collaboration-workflow)[m
[32m+[m[32m7. [Conflict Resolution](#conflict-resolution)[m
[32m+[m[32m8. [Common Scenarios](#common-scenarios)[m
[32m+[m[32m9. [Emergency Procedures](#emergency-procedures)[m
[32m+[m[32m10. [Git Commands Cheat Sheet](#git-commands-cheat-sheet)[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Initial Setup[m
[32m+[m
[32m+[m[32m### First-Time Git Configuration[m
[32m+[m[32m```bash[m
[32m+[m[32m# Set your identity (REQUIRED - do this once per machine)[m
[32m+[m[32mgit config --global user.name "Your Full Name"[m
[32m+[m[32mgit config --global user.email "your.email@example.com"[m
[32m+[m
[32m+[m[32m# Verify configuration[m
[32m+[m[32mgit config --list[m
[32m+[m
[32m+[m[32m# Set default branch name to 'main'[m
[32m+[m[32mgit config --global init.defaultBranch main[m
[32m+[m
[32m+[m[32m# Optional: Set your preferred text editor[m
[32m+[m[32mgit config --global core.editor "code --wait"  # For VS Code[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Clone the Repository (First Time)[m
[32m+[m[32m```bash[m
[32m+[m[32m# Navigate to your projects folder[m
[32m+[m[32mcd C:\BS_Projects[m
[32m+[m
[32m+[m[32m# Clone the repository[m
[32m+[m[32mgit clone https://github.com/your-username/quiz-app.git[m
[32m+[m
[32m+[m[32m# Navigate into the project[m
[32m+[m[32mcd quiz-app[m
[32m+[m
[32m+[m[32m# Verify remote connection[m
[32m+[m[32mgit remote -v[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Install Dependencies After Cloning[m
[32m+[m[32m```bash[m
[32m+[m[32m# Install npm packages[m
[32m+[m[32mnpm install[m
[32m+[m
[32m+[m[32m# Run the development server[m
[32m+[m[32mnpm run dev[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Daily Workflow[m
[32m+[m
[32m+[m[32m### Starting Your Work Day[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# 1. Check which branch you're on[m
[32m+[m[32mgit status[m
[32m+[m
[32m+[m[32m# 2. Switch to main branch[m
[32m+[m[32mgit checkout main[m
[32m+[m
[32m+[m[32m# 3. Pull latest changes from GitHub[m
[32m+[m[32mgit pull origin main[m
[32m+[m
[32m+[m[32m# 4. Verify you have the latest code[m
[32m+[m[32mgit log --oneline -5[m
[32m+[m
[32m+[m[32m# 5. Create a new branch for your feature[m
[32m+[m[32mgit checkout -b feature/your-feature-name[m
[32m+[m
[32m+[m[32m# Example: git checkout -b feature/dark-mode-toggle[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### During Development[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Check what files you've modified[m
[32m+[m[32mgit status[m
[32m+[m
[32m+[m[32m# See specific changes in files[m
[32m+[m[32mgit diff[m
[32m+[m
[32m+[m[32m# See changes in a specific file[m
[32m+[m[32mgit diff src/pages/StudentDashboard.jsx[m
[32m+[m
[32m+[m[32m# Stage specific files[m
[32m+[m[32mgit add src/pages/StudentDashboard.jsx[m
[32m+[m[32mgit add src/components/Navbar.jsx[m
[32m+[m
[32m+[m[32m# Stage all modified files[m
[32m+[m[32mgit add .[m
[32m+[m
[32m+[m[32m# Stage all files with specific extension[m
[32m+[m[32mgit add *.jsx[m
[32m+[m
[32m+[m[32m# Unstage a file (if you added by mistake)[m
[32m+[m[32mgit reset src/pages/SomeFile.jsx[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Making Commits[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Commit with a message[m
[32m+[m[32mgit commit -m "feat: Add dark mode toggle to navbar"[m
[32m+[m
[32m+[m[32m# Commit with detailed message (opens text editor)[m
[32m+[m[32mgit commit[m
[32m+[m
[32m+[m[32m# Amend the last commit (if you forgot something)[m
[32m+[m[32mgit add forgotten-file.jsx[m
[32m+[m[32mgit commit --amend --no-edit[m
[32m+[m
[32m+[m[32m# View commit history[m
[32m+[m[32mgit log --oneline[m
[32m+[m
[32m+[m[32m# View detailed commit history[m
[32m+[m[32mgit log --stat[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### End of Work Day[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Make sure everything is committed[m
[32m+[m[32mgit status[m
[32m+[m
[32m+[m[32m# Push your branch to GitHub[m
[32m+[m[32mgit push origin feature/your-feature-name[m
[32m+[m
[32m+[m[32m# First time pushing a new branch? Use:[m
[32m+[m[32mgit push -u origin feature/your-feature-name[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Branch Management[m
[32m+[m
[32m+[m[32m### Creating Branches[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Create a new branch[m
[32m+[m[32mgit branch feature/student-profile[m
[32m+[m
[32m+[m[32m# Create and switch to new branch (shortcut)[m
[32m+[m[32mgit checkout -b feature/student-profile[m
[32m+[m
[32m+[m[32m# Create branch from specific commit[m
[32m+[m[32mgit checkout -b bugfix/auth-error abc1234[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Switching Branches[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Switch to existing branch[m
[32m+[m[32mgit checkout main[m
[32m+[m[32mgit checkout feature/dark-mode[m
[32m+[m
[32m+[m[32m# Switch and create if doesn't exist[m
[32m+[m[32mgit checkout -b feature/new-feature[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Viewing Branches[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# List all local branches[m
[32m+[m[32mgit branch[m
[32m+[m
[32m+[m[32m# List all branches (local + remote)[m
[32m+[m[32mgit branch -a[m
[32m+[m
[32m+[m[32m# List branches with last commit[m
[32m+[m[32mgit branch -v[m
[32m+[m
[32m+[m[32m# See which branch you're currently on[m
[32m+[m[32mgit branch --show-current[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Deleting Branches[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Delete a local branch (after it's merged)[m
[32m+[m[32mgit branch -d feature/completed-feature[m
[32m+[m
[32m+[m[32m# Force delete a branch (even if not merged)[m
[32m+[m[32mgit branch -D feature/abandoned-feature[m
[32m+[m
[32m+[m[32m# Delete a remote branch[m
[32m+[m[32mgit push origin --delete feature/old-feature[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Branch Naming Conventions[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Feature branches[m
[32m+[m[32mgit checkout -b feature/student-dashboard[m
[32m+[m[32mgit checkout -b feature/quiz-timer[m
[32m+[m[32mgit checkout -b feature/instructor-analytics[m
[32m+[m
[32m+[m[32m# Bug fix branches[m
[32m+[m[32mgit checkout -b bugfix/login-redirect[m
[32m+[m[32mgit checkout -b bugfix/dark-mode-flicker[m
[32m+[m[32mgit checkout -b hotfix/security-patch[m
[32m+[m
[32m+[m[32m# Documentation branches[m
[32m+[m[32mgit checkout -b docs/readme-update[m
[32m+[m[32mgit checkout -b docs/api-documentation[m
[32m+[m
[32m+[m[32m# Refactor branches[m
[32m+[m[32mgit checkout -b refactor/navbar-component[m
[32m+[m[32mgit checkout -b refactor/state-management[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Commit Best Practices[m
[32m+[m
[32m+[m[32m### Commit Message Format[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Format: <type>: <subject>[m
[32m+[m
[32m+[m[32m# Feature commits[m
[32m+[m[32mgit commit -m "feat: Add student dashboard with quiz list"[m
[32m+[m[32mgit commit -m "feat: Implement dark mode toggle"[m
[32m+[m[32mgit commit -m "feat: Add profile dropdown menu"[m
[32m+[m
[32m+[m[32m# Bug fix commits[m
[32m+[m[32mgit commit -m "fix: Correct authentication redirect for instructors"[m
[32m+[m[32mgit commit -m "fix: Resolve navbar alignment on mobile"[m
[32m+[m[32mgit commit -m "fix: Prevent quiz timer from resetting"[m
[32m+[m
[32m+[m[32m# Refactor commits[m
[32m+[m[32mgit commit -m "refactor: Extract navbar component from dashboard"[m
[32m+[m[32mgit commit -m "refactor: Simplify theme switching logic"[m
[32m+[m
[32m+[m[32m# Style commits[m
[32m+[m[32mgit commit -m "style: Update button hover effects"[m
[32m+[m[32mgit commit -m "style: Fix inconsistent spacing in sidebar"[m
[32m+[m
[32m+[m[32m# Documentation commits[m
[32m+[m[32mgit commit -m "docs: Add setup instructions to README"[m
[32m+[m[32mgit commit -m "docs: Document API endpoints"[m
[32m+[m
[32m+[m[32m# Test commits[m
[32m+[m[32mgit commit -m "test: Add unit tests for authentication"[m
[32m+[m
[32m+[m[32m# Build/config commits[m
[32m+[m[32mgit commit -m "build: Update dependencies"[m
[32m+[m[32mgit commit -m "chore: Configure ESLint rules"[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### When to Commit[m
[32m+[m
[32m+[m[32m**✅ COMMIT WHEN:**[m
[32m+[m[32m- You complete a logical unit of work[m
[32m+[m[32m- You fix a bug[m
[32m+[m[32m- You add a new feature (even if small)[m
[32m+[m[32m- Before switching branches[m
[32m+[m[32m- Before pulling changes[m
[32m+[m[32m- At the end of your work session[m
[32m+[m
[32m+[m[32m**❌ DON'T COMMIT:**[m
[32m+[m[32m- Half-finished features (unless using WIP commits)[m
[32m+[m[32m- Code that breaks the build[m
[32m+[m[32m- Large unrelated changes in one commit[m
[32m+[m[32m- Sensitive data (passwords, API keys)[m
[32m+[m
[32m+[m[32m### Atomic Commits[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# GOOD: Small, focused commits[m
[32m+[m[32mgit add src/pages/LoginPage.jsx[m
[32m+[m[32mgit commit -m "feat: Add email validation to login form"[m
[32m+[m
[32m+[m[32mgit add src/styles/theme.css[m
[32m+[m[32mgit commit -m "style: Add dark mode color variables"[m
[32m+[m
[32m+[m[32m# BAD: One massive commit[m
[32m+[m[32mgit add .[m
[32m+[m[32mgit commit -m "Updated everything"[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Push & Pull Operations[m
[32m+[m
[32m+[m[32m### Pulling Changes[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Pull latest changes from main[m
[32m+[m[32mgit pull origin main[m
[32m+[m
[32m+[m[32m# Pull from your feature branch[m
[32m+[m[32mgit pull origin feature/your-feature[m
[32m+[m
[32m+[m[32m# Pull and rebase (keeps history cleaner)[m
[32m+[m[32mgit pull --rebase origin main[m
[32m+[m
[32m+[m[32m# Fetch changes without merging[m
[32m+[m[32mgit fetch origin[m
[32m+[m
[32m+[m[32m# See what changed after fetch[m
[32m+[m[32mgit log HEAD..origin/main --oneline[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Pushing Changes[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Push to your feature branch[m
[32m+[m[32mgit push origin feature/your-feature[m
[32m+[m
[32m+[m[32m# Push new branch (first time)[m
[32m+[m[32mgit push -u origin feature/your-feature[m
[32m+[m
[32m+[m[32m# Push to main (after PR approval)[m
[32m+[m[32mgit push origin main[m
[32m+[m
[32m+[m[32m# Force push (USE WITH CAUTION)[m
[32m+[m[32mgit push --force origin feature/your-feature[m
[32m+[m
[32m+[m[32m# Force push safely (won't overwrite others' work)[m
[32m+[m[32mgit push --force-with-lease origin feature/your-feature[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Before Pushing - Pre-Push Checklist[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# 1. Check status[m
[32m+[m[32mgit status[m
[32m+[m
[32m+[m[32m# 2. Make sure you're on the right branch[m
[32m+[m[32mgit branch --show-current[m
[32m+[m
[32m+[m[32m# 3. Pull latest changes first[m
[32m+[m[32mgit pull origin main[m
[32m+[m
[32m+[m[32m# 4. Run tests (if you have them)[m
[32m+[m[32mnpm test[m
[32m+[m
[32m+[m[32m# 5. Build to check for errors[m
[32m+[m[32mnpm run build[m
[32m+[m
[32m+[m[32m# 6. Push[m
[32m+[m[32mgit push origin feature/your-feature[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Collaboration Workflow[m
[32m+[m
[32m+[m[32m### Standard Team Workflow[m
[32m+[m
[32m+[m[32m#### 1. Start New Feature[m
[32m+[m[32m```bash[m
[32m+[m[32mgit checkout main[m
[32m+[m[32mgit pull origin main[m
[32m+[m[32mgit checkout -b feature/navbar-improvements[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m#### 2. Work on Feature[m
[32m+[m[32m```bash[m
[32m+[m[32m# Make changes[m
[32m+[m[32m# ...[m
[32m+[m
[32m+[m[32mgit add src/components/Navbar.jsx[m
[32m+[m[32mgit commit -m "feat: Add dark mode toggle to navbar"[m
[32m+[m
[32m+[m[32mgit add src/styles/navbar.css[m
[32m+[m[32mgit commit -m "style: Update navbar styles for dark mode"[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m#### 3. Keep Feature Branch Updated[m
[32m+[m[32m```bash[m
[32m+[m[32m# Periodically sync with main[m
[32m+[m[32mgit checkout main[m
[32m+[m[32mgit pull origin main[m
[32m+[m[32mgit checkout feature/navbar-improvements[m
[32m+[m[32mgit merge main[m
[32m+[m
[32m+[m[32m# Or use rebase for cleaner history[m
[32m+[m[32mgit checkout feature/navbar-improvements[m
[32m+[m[32mgit rebase main[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m#### 4. Push Feature Branch[m
[32m+[m[32m```bash[m
[32m+[m[32mgit push origin feature/navbar-improvements[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m#### 5. Create Pull Request on GitHub[m
[32m+[m[32m- Go to GitHub repository[m
[32m+[m[32m- Click "Pull Requests" → "New Pull Request"[m
[32m+[m[32m- Select your branch[m
[32m+[m[32m- Add description of changes[m
[32m+[m[32m- Request reviewers[m
[32m+[m[32m- Wait for approval[m
[32m+[m
[32m+[m[32m#### 6. After PR is Merged[m
[32m+[m[32m```bash[m
[32m+[m[32m# Switch back to main[m
[32m+[m[32mgit checkout main[m
[32m+[m
[32m+[m[32m# Pull the merged changes[m
[32m+[m[32mgit pull origin main[m
[32m+[m
[32m+[m[32m# Delete your local feature branch[m
[32m+[m[32mgit branch -d feature/navbar-improvements[m
[32m+[m
[32m+[m[32m# Delete remote branch (if not auto-deleted)[m
[32m+[m[32mgit push origin --delete feature/navbar-improvements[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Working on Same Files as Teammate[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Before starting work[m
[32m+[m[32mgit checkout main[m
[32m+[m[32mgit pull origin main[m
[32m+[m
[32m+[m[32m# Create your branch[m
[32m+[m[32mgit checkout -b feature/your-work[m
[32m+[m
[32m+[m[32m# Pull teammate's changes regularly[m
[32m+[m[32mgit fetch origin[m
[32m+[m[32mgit merge origin/main[m
[32m+[m
[32m+[m[32m# Or pull directly[m
[32m+[m[32mgit pull origin main[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Reviewing Teammate's Code[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# Fetch all branches[m
[32m+[m[32mgit fetch origin[m
[32m+[m
[32m+[m[32m# Checkout teammate's branch[m
[32m+[m[32mgit checkout feature/teammate-branch[m
[32m+[m
[32m+[m[32m# View their changes[m
[32m+[m[32mgit log origin/main..HEAD --oneline[m
[32m+[m
[32m+[m[32m# See detailed diff[m
[32m+[m[32mgit diff origin/main..HEAD[m
[32m+[m
[32m+[m[32m# Test their code locally[m
[32m+[m[32mnpm install[m
[32m+[m[32mnpm run dev[m
[32m+[m
[32m+[m[32m# If approved, merge via GitHub PR[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m---[m
[32m+[m
[32m+[m[32m## Conflict Resolution[m
[32m+[m
[32m+[m[32m### Understanding Merge Conflicts[m
[32m+[m
[32m+[m[32mConflicts occur when:[m
[32m+[m[32m- Two people edit the same line in the same file[m
[32m+[m[32m- One person deletes a file while another modifies it[m
[32m+[m[32m- Branches have diverged significantly[m
[32m+[m
[32m+[m[32m### Resolving Conflicts - Step by Step[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# 1. Try to merge/pull[m
[32m+[m[32mgit pull origin main[m
[32m+[m[32m# Output: CONFLICT (content): Merge conflict in src/pages/Dashboard.jsx[m
[32m+[m
[32m+[m[32m# 2. Check which files have conflicts[m
[32m+[m[32mgit status[m
[32m+[m
[32m+[m[32m# 3. Open conflicted file in VS Code[m
[32m+[m[32m# You'll see markers like:[m
[32m+[m[32m# <<<<<<< HEAD[m
[32m+[m[32m# Your changes[m
[32m+[m[32m# =======[m
[32m+[m[32m# Their changes[m
[32m+[m[32m# >>>>>>> main[m
[32m+[m
[32m+[m[32m# 4. Edit the file to resolve conflict[m
[32m+[m[32m# Remove markers and keep the code you want[m
[32m+[m
[32m+[m[32m# 5. Stage the resolved file[m
[32m+[m[32mgit add src/pages/Dashboard.jsx[m
[32m+[m
[32m+[m[32m# 6. Complete the merge[m
[32m+[m[32mgit commit -m "fix: Resolve merge conflict in Dashboard"[m
[32m+[m
[32m+[m[32m# 7. Push the resolution[m
[32m+[m[32mgit push origin feature/your-branch[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Example Conflict Resolution[m
[32m+[m
[32m+[m[32m**Before (conflicted file):**[m
[32m+[m[32m```javascript[m
[32m+[m[32m<<<<<<< HEAD[m
[32m+[m[32mconst theme = darkMode ? 'dark' : 'light';[m
[32m+[m[32m=======[m
[32m+[m[32mconst theme = isDarkMode ? 'dark-theme' : 'light-theme';[m
[32m+[m[32m>>>>>>> main[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m**After (resolved):**[m
[32m+[m[32m```javascript[m
[32m+[m[32mconst theme = darkMode ? 'dark' : 'light';[m
[32m+[m[32m```[m
[32m+[m
[32m+[m[32m### Avoiding Conflicts[m
[32m+[m
[32m+[m[32m```bash[m
[32m+[m[32m# 1. Pull frequently[m
[32m+[m[32mgit pull origin main  # Do this multiple times per day[m
[32m+[m
[32m+[m[32m# 2. Commit frequently[m
[32m+[m[32mgit commit -m "feat: Small incremental change"[m
[32m+[m
[32m+[m[32m# 3. Communicate with team[m
[32m+[m[32m# Use Slack/Discord to coordinate who's working on what[m
[32m+[m
[32m+[m[32m# 4. Keep branches short-lived[m
[32m+[m[32m# Don't let feature branches live for weeks[m
[32m+[m
[32m+[m[32m# 5. Use .gitignore properly[m
[32m+[m[32m# Avoid committing build files, node_modules, etc.