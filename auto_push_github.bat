@echo off
git init
git add .
git commit -m "Initial push"
git branch -M main
git remote add origin https://github.com/YOUR_USER/english-trainer-final.git
git push -u origin main
pause
