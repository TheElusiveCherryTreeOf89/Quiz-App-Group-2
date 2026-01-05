# DCIT 26: Git Version Control Activity - Video Script
## 10-12 Minute Presentation (All 7 Team Members)

---

### SPEAKER 1: Introduction & Project Overview (1:30 - 2:00 minutes)

**[Show screen: Quiz App login page]**

"Good morning/afternoon everyone. I'm [Name], and I'll be presenting how our group used Git and GitHub while developing this Quiz Application for DCIT 26.

Our project is a fully functional React-based Quiz Application with two user roles: students who take quizzes with tab monitoring and violation detection, and instructors who can manage quizzes and release student results.

Over the past [weeks], our team of 7 developers has used Git as our primary collaboration and version control tool. Let me walk you through our workflow, our repository structure, and how Git helped us work together seamlessly."

**[Click to show GitHub repository URL]**

---

### SPEAKER 2: Git Workflow & Team Process (2:00 - 3:30 minutes)

**[Navigate to GitHub repo > show branches]**

"Hi, I'm [Name]. Let me explain our Git workflow. Our team decided to use a simple branching strategy:

**Main Workflow:**
1. We have a `main` branch that contains the stable, production-ready code
2. Each feature or bug fix is developed in a separate branch
3. Once completed, we create a pull request, review the changes, and merge back to main

**Our Branching Convention:**
- `feature/student-pages` - for student-facing UI components
- `feature/instructor-dashboard` - for instructor administrative pages
- `feature/authentication` - for login and role-based routing
- `feature/quiz-timer` - for the timer and violation detection system
- `bugfix/dark-mode` - for dark mode fixes across instructor pages
- `docs/documentation` - for README and setup guides

**How We Collaborated:**
- Everyone cloned the repository to their local machine
- Before starting work, we'd pull the latest changes: `git pull origin main`
- Created a new branch for our task: `git checkout -b feature/my-feature`
- Made changes, tested locally, then committed with clear messages
- Pushed to GitHub: `git push origin feature/my-feature`
- Created a pull request for review
- After approval, we merged and deleted the branch

This approach helped us avoid conflicts and kept our code organized."

**[Show screen: GitHub branches page]**

---

### SPEAKER 3: Commit History & Individual Contributions (3:30 - 5:00 minutes)

**[Click to GitHub > Commits tab]**

"I'm [Name]. Let me show you our commit history. Each commit represents real development progress in our project.

**Our Commit Messages Follow a Pattern:**
- `feat: Add student dashboard with sidebar navigation`
- `fix: Correct authentication redirect for instructor pages`
- `refactor: Unify dark mode theme across all instructor pages`
- `docs: Update README with setup instructions`
- `style: Fix CSS alignment and responsive design issues`

**Looking at our commit graph [scroll through history], you can see:**

1. **[Name 1's commits]** - Focused on student-facing pages (LoginPage, RegistrationPage, StudentDashboard)
2. **[Name 2's commits]** - Built instructor pages and dark mode features
3. **[Name 3's commits]** - Implemented quiz timer and violation detection system
4. **[Name 4's commits]** - Created Toast notification system and modals
5. **[Name 5's commits]** - Set up project structure and state management (Zustand store)
6. **[Name 6's commits]** - Fixed bugs and improved code quality
7. **[Name 7's commits]** - Wrote documentation and created setup guides

**Key Git Commands We Used:**
- `git init` - Initialize the repository at project start
- `git add .` - Stage changes before committing
- `git commit -m "message"` - Create meaningful commit snapshots
- `git push origin branch-name` - Push commits to GitHub
- `git pull origin main` - Fetch and merge latest changes
- `git status` - Check current branch status
- `git log --oneline` - View commit history
- `git diff` - See what changed between commits

This shows how each team member contributed individually while maintaining a clean commit history."

**[Show GitHub contributors page]**

---

### SPEAKER 4: Handling Conflicts & Problem Solving (5:00 - 6:30 minutes)

**[Show screen: GitHub > Pull Requests]**

"I'm [Name]. While collaborating with 7 developers, we encountered some challenges that Git helped us solve.

**Challenge 1: Dark Mode Merge Conflict**
- Two team members were updating the same theme file simultaneously
- Git detected the conflict when we tried to merge
- We resolved it by comparing both changes and keeping the updates from both
- Commit: `fix: Merge dark mode updates without losing functionality`

**Challenge 2: Authentication Redirect Issues**
- Some pages redirected to the wrong login page (student vs instructor)
- We used `git log` to find when the bug was introduced
- Used `git diff` to see what changed between working and broken versions
- Fixed it across multiple files in a single `bugfix/auth-redirect` branch
- Commit: `fix: Correct authentication redirects for instructor pages`

**Challenge 3: Coordinating Parallel Development**
- Multiple people working on different features simultaneously
- Solution: Good branching practice and frequent pulls from main
- We had a team rule: pull before pushing to stay synchronized

**Git's Role in Problem Solving:**
- Version history lets us see exactly what changed and when
- Branches isolate work so conflicts are minimal
- Pull requests act as a checkpoint before merging
- Everyone can see the full development history

This collaborative approach kept us organized and prevented major issues."

**[Show a few pull request examples]**

---

### SPEAKER 5: Code Review & Quality Assurance (6:30 - 8:00 minutes)

**[Click on a merged pull request]**

"I'm [Name]. Git gave us a platform for code review and quality assurance.

**Our Review Process:**
1. Developer pushes feature branch to GitHub
2. Creates a pull request with description of changes
3. Team members review the code using GitHub's interface
4. We discuss improvements in comments
5. Requested changes are made locally and pushed again
6. Once approved, we merge to main

**Example Review:**
[Show a PR comment thread]
- Reviewer noticed: 'This function could use better error handling'
- Developer replied: 'Good catch, I'll add validation'
- Developer committed the fix: `refactor: Add input validation to form submission`
- Reviewer approved: 'Looks good, merging now'

**Quality Metrics We Tracked:**
- Total commits: [X] (showing consistent progress)
- Contributors: 7 (everyone actively involved)
- Branches created: [X] (organized feature development)
- Pull requests: [X] (all reviewed before merging)
- Merge conflicts resolved: [X] (managed successfully)

**Benefits of This Approach:**
- Knowledge sharing - reviewers learn what teammates are doing
- Catches bugs before they reach main branch
- Maintains code quality and consistency
- Creates a paper trail for accountability and learning

This Git-based review system was crucial for our project's success."

---

### SPEAKER 6: Integration & Deployment Readiness (8:00 - 9:30 minutes)

**[Show GitHub > Releases/Tags page]**

"I'm [Name]. As we approached project completion, Git helped us manage releases and deployment.

**Our Release Strategy:**
- The `main` branch is always production-ready
- Feature branches are merged only when fully tested
- We created tags for stable versions: `v1.0-initial`, `v1.1-dark-mode`, `v2.0-complete`

**Pre-Deployment Checklist Using Git:**
1. Ensure all features are committed and pushed
2. Run `git log` to verify commit history is clean
3. Check `git status` - nothing should be uncommitted
4. Review `git diff main...feature-branch` before final merge
5. Merge only when ready: `git merge feature-branch`
6. Create release tag: `git tag v1.0`

**Deployment Information:**
- GitHub Repository: [Show URL - paste your actual repo link]
- All code is version-controlled and backed up
- Deployment platform: [Vercel/Netlify - whichever you're using]
- Live URL: [Show deployed app]

**Git's Role in Deployment:**
- History preserved for troubleshooting production issues
- Easy rollback if needed: `git revert commit-hash`
- Clear record of what's in production vs development
- Collaboration made it possible for 7 people to ship one polished product

This Git workflow enabled us to ship a production-quality application."

---

### SPEAKER 7: Lessons Learned & Reflection (9:30 - 11:30 minutes)

**[Show timeline of commits on screen]**

"I'm [Name], and I'll share our lessons learned from using Git in this project.

**What Went Well:**

1. **Clear Communication** - Commit messages and branch names told the story of our development
   - Example: `feat: Add tab-monitoring with violation detection` is instantly clear
   - Everyone knew what branch to look at for specific features

2. **Prevented Disasters** - Without Git, merging work from 7 people would be nightmare
   - Version control ensured we never lost anyone's work
   - History let us find and fix bugs quickly

3. **Enabled Parallel Development** - Multiple people worked simultaneously without blocking each other
   - One person on authentication, another on UI, another on state management
   - All merged seamlessly through Git

4. **Documentation Through Commits** - Our commit history tells the project story
   - Anyone can see how the quiz timer evolved
   - Can track when dark mode was added
   - Understand decision-making through commit messages

**Challenges We Faced:**

1. **Initial Learning Curve** - Some team members weren't familiar with Git
   - Solution: Pair programming and peer support
   - Key learning: `git pull` before pushing prevents most conflicts

2. **Merge Conflicts** - Inevitable when multiple people edit same files
   - Solution: Communication and using Git's conflict resolution tools
   - Key lesson: Commit frequently and in small chunks

3. **Accidental Pushes** - One team member almost pushed sensitive data
   - Solution: `.gitignore` file protected environment variables
   - Key lesson: Set up proper gitignore rules at project start

4. **Keeping Branches Updated** - Easy to fall behind main branch changes
   - Solution: Weekly sync - everyone pulls main before pushing features
   - Key learning: Frequent syncs reduce conflict complexity

**Impact on Project Quality:**

- **Code Quality:** Code reviews through PRs caught bugs early
- **Team Coordination:** Branches made it clear who was working on what
- **Accountability:** Commit history shows exactly who made which changes
- **Knowledge Sharing:** Reviewing teammates' code taught us new techniques
- **Reliability:** Version control let us confidently refactor without fear

**Key Takeaways for Future Projects:**

1. **Start with Git** - Don't wait, initialize version control from day one
2. **Use Meaningful Commits** - Your future self will thank you when reading history
3. **Use Clear Branches** - Clear naming saves confusion
4. **Review Code** - Pull requests catch issues and spread knowledge
5. **Commit Often** - Small, frequent commits are easier to debug than massive ones
6. **Keep Main Stable** - Only merge tested, complete features to main
7. **Document Decisions** - Use commit messages and README to explain why, not just what

**Final Reflection:**

Git transformed our project from 7 individual efforts into one cohesive product. Without version control, coordination would be impossible. The commit history visible here represents not just code, but our entire development journey—the features we built, the bugs we fixed, and the growth we experienced.

For any developer, Git is non-negotiable. For a team, Git is the difference between collaboration and chaos.

Thank you for watching our Git journey on the DCIT 26 Quiz Application project!"

**[Show GitHub repo one final time with commit graph visible]**

---

## Recording Tips:
- **Eye Contact:** Look at camera, not the script
- **Pacing:** Speak naturally, not rushed (this script is ~11.5 minutes)
- **Gestures:** Point to screen when referring to specific elements
- **Audio:** Use mic to ensure clear sound
- **Order:** Record speakers 1-7 in sequence
- **Breaks:** Each speaker gets 1-2 minutes; edit transitions between speakers
- **Editing:** Cut long pauses, sync audio with screen recordings
- **Final Check:** Ensure all 7 members are visible and audible

## Git Commands Reference:
```
git init                           # Initialize repository
git clone <url>                    # Clone remote repository
git add <file>                     # Stage changes
git commit -m "message"            # Create commit
git push origin <branch>           # Push to GitHub
git pull origin main               # Fetch and merge
git status                         # Check working state
git log --oneline                  # View commit history
git diff                           # See changes
git checkout -b feature/name       # Create new branch
git merge <branch>                 # Merge branch to current
```
