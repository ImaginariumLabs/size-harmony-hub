@echo off
echo Current directory: %CD%
echo.
echo Directory contents:
dir
echo.
echo Checking for APIwidget folder:
if exist APIwidget (
    echo APIwidget folder found!
    cd APIwidget
    echo Contents of APIwidget folder:
    dir
) else (
    echo APIwidget folder not found in current directory.
)
