

DCIT 26: Final Project
For your final project, your group will design, develop, and deploy a fully functional Quiz
Application using React and TailwindCSS. You will apply the skills learned throughout the
course—from UI/UX planning, state management, and component-based architecture to
deployment and documentation.
This project will test your ability to work collaboratively, write clean and modular code, and
communicate your technical decisions through proper documentation.
Application Features (Core Requirements)
## A. User Roles
## 1. Student
- Instructor (Admin)
## STUDENT FEATURES
- Take a Quiz
- Timer must be visible.
- Questions must come from a local JSON file or your mock backend.
## 2. Prevent Quiz Retake
- Detect if the student has already completed the quiz:
o Use localStorage, IndexedDB, or your own database (optional).
o Before starting, show:
“You have already taken this quiz. Please wait for the instructor to
release your score.”
- Open-Tab / Focus Change Detection
When the student switches tabs or minimizes the window:
- Trigger a warning popup.
- Log the violation (count how many times it happened).
- If violations reach a threshold (ex: 3), the quiz auto-submits.



## 4. Score Visibility
- After quiz submission, students do NOT see their score immediately.
- Instead display:
“Your answers have been submitted. Please wait for the instructor to release the results.”
## INSTRUCTOR FEATURES
## 1. View Student Results
## • View:
o Name
o Score
o Number of violations
o Submission timestamp
## 2. Release Scores
- Instructor can click a button: “Release Results”
- Once released:
o Students’ dashboards update and show their score.
## Documentation Requirements
Your documentation must be clean, organized, and complete.
## A. Project Overview
- App purpose
- Team members & roles
- Tech stack
B. Wireframes (Low-Fidelity)
## Include:
- Student login page (or welcome page)
- Quiz page
- Result pending page



- Instructor dashboard
- Result release control
## C. Class Diagram
At minimum include:
## • Student
## • Instructor
## • Quiz
## • Question
## • Result
## • Violation
Show relationships: (e.g., Student — takes —> Quiz, Instructor — releases —> Result)
## D. Flowchart
Use a system flow from:
- Student opens app
- System checks retake
- Student takes quiz
- Tab monitoring
- Auto submit or manual submit
- Results stored
- Instructor releases results
- Student views result
Must show conditional paths and event triggers.
E. System Architecture Diagram (Optional Bonus)
- React front-end
- Local storage / mock backend
- Data flow



## Deployment Requirements
Deploy your project using:
## • Vercel (recommended)
## • Netlify
- GitHub Pages (optional)
Your final submission must include:
- Live URL
- GitHub Repository link
## Submission Requirements
A. What your group submits
- Deployed Quiz App URL
- GitHub Repository
- Project Documentation (PDF) containing:
o Wireframes
o Class Diagram
o Flowchart
o Screenshots of the working app
## 4. Video Presentation
o Duration: 12–15 minutes
o All members must speak (even briefly)
o Show your actual application
o Include diagrams from documentation




PDF Fonts & Spacing Template (exact values for consistent look)
General: Use a modern sans-serif font (Arial).
- Document size & margins
o Page size: A4 (210 × 297 mm)
o Margins: 1 inch (2.54 cm) all sides
## • Typography
o Cover title: Arial 24 pt, Bold, centered
o Headings (H1): 16 pt Bold
o Sub-headings (H2): 14 pt Bold
o Body text: 11 pt Regular, line spacing: 1.15
o Code blocks: Consolas 10 pt, single-spaced, put inside a shaded box
o Captions: 9 pt Italic
o Footer / page number: 9 pt
- Paragraph spacing & alignment
o Paragraph spacing: 6 pt after each paragraph
o Alignment: Justified for body text, centered for headings and cover
- Images & diagrams
o Leave at least 12 pt space above and below images
o Provide captions for each image



## Criteria Description Score
## Functionality &
## Features
Program runs without errors, meets all requirements. /40
UI/UX Design &
## Technical
## Implementation
Focus on visual design, responsiveness, and code quality. /20
Documentation Quality and completeness of the project documentation. /20
## Video
## Presentation
All members appear; clear explanation, code walkthrough,
demonstration, reflection, within 15-minute limit.
## /20
## Total


## Comment/s: ______________________________________________________________


## Edan A. Belgica
## Instructor