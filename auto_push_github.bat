@echo off
git init
git add .
git commit -m "Initial push"
git branch -M main
git remote add origin https://github.com/lucio2323232/trainer.git
git push -u origin main
pause

