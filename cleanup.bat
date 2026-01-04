@echo off
echo Creating archive folder...
mkdir _PROJECT_ARCHIVE

echo Moving unnecessary files...
move "DCIT 26 Final Project.pdf" _PROJECT_ARCHIVE\
move "DCIT 26 FINAL PROJECT INSTRUCTIONS & RELATED ACTIVITY.md" _PROJECT_ARCHIVE\
move "QuizApp (HiFi)" _PROJECT_ARCHIVE\
move "QuizApp (LoFi)" _PROJECT_ARCHIVE\
move References _PROJECT_ARCHIVE\
move resources _PROJECT_ARCHIVE\
move populate-notifications.html _PROJECT_ARCHIVE\

echo Done! All files moved to _PROJECT_ARCHIVE folder
echo You can now safely delete this folder after pushing to GitHub
pause