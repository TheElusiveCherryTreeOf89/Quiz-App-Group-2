# Git Workflow Guide for Quiz App Team
## Complete Git Commands Reference for 7-Member Development Team

---

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [Daily Workflow](#daily-workflow)
3. [Branch Management](#branch-management)
4. [Commit Best Practices](#commit-best-practices)
5. [Push & Pull Operations](#push--pull-operations)
6. [Collaboration Workflow](#collaboration-workflow)
7. [Conflict Resolution](#conflict-resolution)
8. [Common Scenarios](#common-scenarios)
9. [Emergency Procedures](#emergency-procedures)
10. [Git Commands Cheat Sheet](#git-commands-cheat-sheet)

---

## Initial Setup

### First-Time Git Configuration
```bash
# Set your identity (REQUIRED - do this once per machine)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list

# Set default branch name to 'main'
git config --global init.defaultBranch main

# Optional: Set your preferred text editor
git config --global core.editor "code --wait"  # For VS Code
```

### Clone the Repository (First Time)
```bash
# Navigate to your projects folder
cd C:\BS_Projects

# Clone the repository
git clone https://github.com/your-username/quiz-app.git

# Navigate into the project
cd quiz-app

# Verify remote connection
git remote -v
```

### Install Dependencies After Cloning
```bash
# Install npm packages
npm install

# Run the development server
npm run dev
```

---

## Daily Workflow

### Starting Your Work Day

```bash
# 1. Check which branch you're on
git status

# 2. Switch to main branch
git checkout main

# 3. Pull latest changes from GitHub
git pull origin main

# 4. Verify you have the latest code
git log --oneline -5

# 5. Create a new branch for your feature
git checkout -b feature/your-feature-name

# Example: git checkout -b feature/dark-mode-toggle
```

### During Development

```bash
# Check what files you've modified
git status

# See specific changes in files
git diff

# See changes in a specific file
git diff src/pages/StudentDashboard.jsx

# Stage specific files
git add src/pages/StudentDashboard.jsx
git add src/components/Navbar.jsx

# Stage all modified files
git add .

# Stage all files with specific extension
git add *.jsx

# Unstage a file (if you added by mistake)
git reset src/pages/SomeFile.jsx
```

### Making Commits

```bash
# Commit with a message
git commit -m "feat: Add dark mode toggle to navbar"

# Commit with detailed message (opens text editor)
git commit

# Amend the last commit (if you forgot something)
git add forgotten-file.jsx
git commit --amend --no-edit

# View commit history
git log --oneline

# View detailed commit history
git log --stat
```

### End of Work Day

```bash
# Make sure everything is committed
git status

# Push your branch to GitHub
git push origin feature/your-feature-name

# First time pushing a new branch? Use:
git push -u origin feature/your-feature-name
```

---

## Branch Management

### Creating Branches

```bash
# Create a new branch
git branch feature/student-profile

# Create and switch to new branch (shortcut)
git checkout -b feature/student-profile

# Create branch from specific commit
git checkout -b bugfix/auth-error abc1234
```

### Switching Branches

```bash
# Switch to existing branch
git checkout main
git checkout feature/dark-mode

# Switch and create if doesn't exist
git checkout -b feature/new-feature
```

### Viewing Branches

```bash
# List all local branches
git branch

# List all branches (local + remote)
git branch -a

# List branches with last commit
git branch -v

# See which branch you're currently on
git branch --show-current
```

### Deleting Branches

```bash
# Delete a local branch (after it's merged)
git branch -d feature/completed-feature

# Force delete a branch (even if not merged)
git branch -D feature/abandoned-feature

# Delete a remote branch
git push origin --delete feature/old-feature
```

### Branch Naming Conventions

```bash
# Feature branches
git checkout -b feature/student-dashboard
git checkout -b feature/quiz-timer
git checkout -b feature/instructor-analytics

# Bug fix branches
git checkout -b bugfix/login-redirect
git checkout -b bugfix/dark-mode-flicker
git checkout -b hotfix/security-patch

# Documentation branches
git checkout -b docs/readme-update
git checkout -b docs/api-documentation

# Refactor branches
git checkout -b refactor/navbar-component
git checkout -b refactor/state-management
```

---

## Commit Best Practices

### Commit Message Format

```bash
# Format: <type>: <subject>

# Feature commits
git commit -m "feat: Add student dashboard with quiz list"
git commit -m "feat: Implement dark mode toggle"
git commit -m "feat: Add profile dropdown menu"

# Bug fix commits
git commit -m "fix: Correct authentication redirect for instructors"
git commit -m "fix: Resolve navbar alignment on mobile"
git commit -m "fix: Prevent quiz timer from resetting"

# Refactor commits
git commit -m "refactor: Extract navbar component from dashboard"
git commit -m "refactor: Simplify theme switching logic"

# Style commits
git commit -m "style: Update button hover effects"
git commit -m "style: Fix inconsistent spacing in sidebar"

# Documentation commits
git commit -m "docs: Add setup instructions to README"
git commit -m "docs: Document API endpoints"

# Test commits
git commit -m "test: Add unit tests for authentication"

# Build/config commits
git commit -m "build: Update dependencies"
git commit -m "chore: Configure ESLint rules"
```

### When to Commit

**✅ COMMIT WHEN:**
- You complete a logical unit of work
- You fix a bug
- You add a new feature (even if small)
- Before switching branches
- Before pulling changes
- At the end of your work session

**❌ DON'T COMMIT:**
- Half-finished features (unless using WIP commits)
- Code that breaks the build
- Large unrelated changes in one commit
- Sensitive data (passwords, API keys)

### Atomic Commits

```bash
# GOOD: Small, focused commits
git add src/pages/LoginPage.jsx
git commit -m "feat: Add email validation to login form"

git add src/styles/theme.css
git commit -m "style: Add dark mode color variables"

# BAD: One massive commit
git add .
git commit -m "Updated everything"
```

---

## Push & Pull Operations

### Pulling Changes

```bash
# Pull latest changes from main
git pull origin main

# Pull from your feature branch
git pull origin feature/your-feature

# Pull and rebase (keeps history cleaner)
git pull --rebase origin main

# Fetch changes without merging
git fetch origin

# See what changed after fetch
git log HEAD..origin/main --oneline
```

### Pushing Changes

```bash
# Push to your feature branch
git push origin feature/your-feature

# Push new branch (first time)
git push -u origin feature/your-feature

# Push to main (after PR approval)
git push origin main

# Force push (USE WITH CAUTION)
git push --force origin feature/your-feature

# Force push safely (won't overwrite others' work)
git push --force-with-lease origin feature/your-feature
```

### Before Pushing - Pre-Push Checklist

```bash
# 1. Check status
git status

# 2. Make sure you're on the right branch
git branch --show-current

# 3. Pull latest changes first
git pull origin main

# 4. Run tests (if you have them)
npm test

# 5. Build to check for errors
npm run build

# 6. Push
git push origin feature/your-feature
```

---

## Collaboration Workflow

### Standard Team Workflow

#### 1. Start New Feature
```bash
git checkout main
git pull origin main
git checkout -b feature/navbar-improvements
```

#### 2. Work on Feature
```bash
# Make changes
# ...

git add src/components/Navbar.jsx
git commit -m "feat: Add dark mode toggle to navbar"

git add src/styles/navbar.css
git commit -m "style: Update navbar styles for dark mode"
```

#### 3. Keep Feature Branch Updated
```bash
# Periodically sync with main
git checkout main
git pull origin main
git checkout feature/navbar-improvements
git merge main

# Or use rebase for cleaner history
git checkout feature/navbar-improvements
git rebase main
```

#### 4. Push Feature Branch
```bash
git push origin feature/navbar-improvements
```

#### 5. Create Pull Request on GitHub
- Go to GitHub repository
- Click "Pull Requests" → "New Pull Request"
- Select your branch
- Add description of changes
- Request reviewers
- Wait for approval

#### 6. After PR is Merged
```bash
# Switch back to main
git checkout main

# Pull the merged changes
git pull origin main

# Delete your local feature branch
git branch -d feature/navbar-improvements

# Delete remote branch (if not auto-deleted)
git push origin --delete feature/navbar-improvements
```

### Working on Same Files as Teammate

```bash
# Before starting work
git checkout main
git pull origin main

# Create your branch
git checkout -b feature/your-work

# Pull teammate's changes regularly
git fetch origin
git merge origin/main

# Or pull directly
git pull origin main
```

### Reviewing Teammate's Code

```bash
# Fetch all branches
git fetch origin

# Checkout teammate's branch
git checkout feature/teammate-branch

# View their changes
git log origin/main..HEAD --oneline

# See detailed diff
git diff origin/main..HEAD

# Test their code locally
npm install
npm run dev

# If approved, merge via GitHub PR
```

---

## Conflict Resolution

### Understanding Merge Conflicts

Conflicts occur when:
- Two people edit the same line in the same file
- One person deletes a file while another modifies it
- Branches have diverged significantly

### Resolving Conflicts - Step by Step

```bash
# 1. Try to merge/pull
git pull origin main
# Output: CONFLICT (content): Merge conflict in src/pages/Dashboard.jsx

# 2. Check which files have conflicts
git status

# 3. Open conflicted file in VS Code
# You'll see markers like:
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> main

# 4. Edit the file to resolve conflict
# Remove markers and keep the code you want

# 5. Stage the resolved file
git add src/pages/Dashboard.jsx

# 6. Complete the merge
git commit -m "fix: Resolve merge conflict in Dashboard"

# 7. Push the resolution
git push origin feature/your-branch
```

### Example Conflict Resolution

**Before (conflicted file):**
```javascript
<<<<<<< HEAD
const theme = darkMode ? 'dark' : 'light';
=======
const theme = isDarkMode ? 'dark-theme' : 'light-theme';
>>>>>>> main
```

**After (resolved):**
```javascript
const theme = darkMode ? 'dark' : 'light';
```

### Avoiding Conflicts

```bash
# 1. Pull frequently
git pull origin main  # Do this multiple times per day

# 2. Commit frequently
git commit -m "feat: Small incremental change"

# 3. Communicate with team
# Use Slack/Discord to coordinate who's working on what

# 4. Keep branches short-lived
# Don't let feature branches live for weeks

# 5. Use .gitignore properly
# Avoid committing build files, node_modules, etc.
```

### Aborting a Merge

```bash
# If conflict is too complex, abort and try again
git merge --abort

# Or for rebase
git rebase --abort
```

---

## Common Scenarios

### Scenario 1: "I Made Changes on Wrong Branch"

```bash
# You're on main but should be on a feature branch

# 1. Don't panic! Create new branch (keeps your changes)
git checkout -b feature/correct-branch

# 2. Commit your changes
git add .
git commit -m "feat: Add feature on correct branch"

# 3. Switch back to main
git checkout main

# 4. Reset main to match remote
git reset --hard origin/main
```

### Scenario 2: "I Need to Undo Last Commit"

```bash
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and unstage changes
git reset HEAD~1

# Undo commit and discard changes (CAREFUL!)
git reset --hard HEAD~1

# Undo multiple commits
git reset --soft HEAD~3  # Undo last 3 commits
```

### Scenario 3: "I Accidentally Committed Sensitive Data"

```bash
# 1. Remove file and commit
git rm --cached .env
git commit -m "chore: Remove sensitive file"

# 2. Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: Add .env to gitignore"

# 3. If already pushed, contact team lead immediately
# May need to rotate credentials

# 4. To completely remove from history (advanced)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Scenario 4: "My Branch is Behind Main"

```bash
# Update your feature branch with main

# Option A: Merge (creates merge commit)
git checkout feature/your-branch
git merge main
git push origin feature/your-branch

# Option B: Rebase (cleaner history)
git checkout feature/your-branch
git rebase main
git push --force-with-lease origin feature/your-branch
```

### Scenario 5: "I Want to Save Work Without Committing"

```bash
# Stash your changes
git stash

# Or stash with a message
git stash save "WIP: Dark mode navbar"

# List all stashes
git stash list

# Apply most recent stash
git stash apply

# Apply and remove from stash list
git stash pop

# Apply specific stash
git stash apply stash@{1}

# Delete a stash
git stash drop stash@{0}
```

### Scenario 6: "I Need to Work on Urgent Bug"

```bash
# You're in middle of feature work

# 1. Stash current work
git stash save "WIP: feature work"

# 2. Switch to main
git checkout main
git pull origin main

# 3. Create hotfix branch
git checkout -b hotfix/urgent-bug

# 4. Fix bug and commit
git add .
git commit -m "fix: Resolve urgent authentication bug"

# 5. Push and create PR
git push origin hotfix/urgent-bug

# 6. Return to feature work
git checkout feature/your-feature
git stash pop
```

### Scenario 7: "I Want to Copy Specific Commit to Another Branch"

```bash
# Cherry-pick a commit

# 1. Find commit hash you want
git log --oneline

# 2. Switch to target branch
git checkout main

# 3. Cherry-pick the commit
git cherry-pick abc1234

# 4. Push
git push origin main
```

---

## Emergency Procedures

### "I Pushed to Main by Mistake"

```bash
# 1. Immediately notify team
# 2. If no one pulled yet, force reset
git reset --hard HEAD~1
git push --force origin main

# 3. If others pulled, create revert commit
git revert HEAD
git push origin main
```

### "I Deleted Important Code"

```bash
# If not committed yet
git checkout -- path/to/file.jsx

# If committed
git log --oneline  # Find commit before deletion
git checkout abc1234 -- path/to/file.jsx
git commit -m "fix: Restore deleted file"

# If deleted commit
git reflog  # Find deleted commit
git cherry-pick abc1234
```

### "My Local Repo is Completely Messed Up"

```bash
# Nuclear option: Start fresh

# 1. Backup any uncommitted work
cp -r C:\BS_Projects\quiz-app C:\BS_Projects\quiz-app-backup

# 2. Delete local repo
rm -rf C:\BS_Projects\quiz-app

# 3. Clone fresh copy
git clone https://github.com/your-username/quiz-app.git
cd quiz-app
npm install
```

---

## Git Commands Cheat Sheet

### Setup & Config
```bash
git config --global user.name "Name"       # Set username
git config --global user.email "email"     # Set email
git config --list                          # View config
git clone <url>                            # Clone repository

# Remove global username and email
git config --global --unset user.name
git config --global --unset user.email

# Verify they're removed
git config --global --list
```

### Basic Commands
```bash
git status                                 # Check status
git add <file>                            # Stage file
git add .                                 # Stage all files
git commit -m "message"                   # Commit with message
git push origin <branch>                  # Push to remote
git pull origin <branch>                  # Pull from remote
```

### Branch Operations
```bash
git branch                                # List branches
git branch <name>                         # Create branch
git checkout <branch>                     # Switch branch
git checkout -b <branch>                  # Create & switch
git branch -d <branch>                    # Delete branch
git merge <branch>                        # Merge branch
```

### Viewing History
```bash
git log                                   # View commit history
git log --oneline                         # Compact history
git log --graph --all                     # Visual history
git diff                                  # See changes
git show <commit>                         # Show commit details
```

### Undo Operations
```bash
git reset --soft HEAD~1                   # Undo commit (keep changes)
git reset --hard HEAD~1                   # Undo commit (discard changes)
git revert <commit>                       # Create inverse commit
git checkout -- <file>                    # Discard file changes
git clean -fd                             # Remove untracked files
```

### Remote Operations
```bash
git remote -v                             # Show remotes
git fetch origin                          # Fetch changes
git push -u origin <branch>               # Push new branch
git push --force-with-lease               # Safe force push
git pull --rebase                         # Pull with rebase
```

### Stash Commands
```bash
git stash                                 # Stash changes
git stash list                            # List stashes
git stash apply                           # Apply stash
git stash pop                             # Apply & remove stash
git stash drop                            # Delete stash
```

### Advanced
```bash
git cherry-pick <commit>                  # Apply specific commit
git rebase <branch>                       # Rebase onto branch
git reflog                                # View all actions
git bisect start                          # Binary search for bugs
git tag v1.0                              # Create tag
```

---

## Team Coordination Best Practices

### Communication Rules
1. **Before pushing to main**: Get approval from team
2. **Before major refactor**: Discuss in team meeting
3. **After merge conflict**: Notify team of resolution
4. **When creating new branch**: Update team on Slack/Discord
5. **Before deleting shared branch**: Confirm no one is using it

### Code Review Process
1. Create pull request with clear description
2. Request 2 team members as reviewers
3. Address all review comments
4. Wait for approvals before merging
5. Delete branch after successful merge

### Merge Strategy
- **Feature branches**: Merge via pull request
- **Hotfixes**: Fast-track review and merge
- **Main branch**: Always stable, production-ready
- **No direct commits to main**: Always use branches

---

## Useful Git Aliases (Optional)

Add these to your `.gitconfig` for shortcuts:

```bash
# Create aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.cm "commit -m"
git config --global alias.ps push
git config --global alias.pl pull
git config --global alias.lg "log --oneline --graph --all"

# Now use them:
git st        # Instead of git status
git co main   # Instead of git checkout main
git cm "msg"  # Instead of git commit -m "msg"
```

---

## Troubleshooting

### "Permission denied (publickey)"
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key and add to GitHub
cat ~/.ssh/id_ed25519.pub
```

### "Failed to push some refs"
```bash
# Pull first, then push
git pull origin main --rebase
git push origin main
```

### "Detached HEAD state"
```bash
# Create branch from current state
git checkout -b recovery-branch

# Or go back to main
git checkout main
```

---

## Summary: Daily Git Routine

**Morning:**
```bash
git checkout main
git pull origin main
git checkout -b feature/daily-task
```

**Throughout Day:**
```bash
git add .
git commit -m "feat: Descriptive message"
git push origin feature/daily-task
```

**End of Day:**
```bash
git status
git add .
git commit -m "WIP: Describe progress"
git push origin feature/daily-task
```

**When Feature Complete:**
- Create pull request on GitHub
- Request reviews
- Merge after approval
- Delete feature branch

---

## Questions? Need Help?

1. Check this guide first
2. Ask in team Discord/Slack
3. Check GitHub documentation: https://docs.github.com
4. Use `git --help <command>` for command details

---

**Remember**: Git is your safety net. Commit often, push regularly, and communicate with your team!

**Last Updated**: January 5, 2026
**Team**: Quiz App Development (7 members)
**Project**: DCIT 26 Quiz Application
