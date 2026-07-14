@echo off
echo Building the web app...
call npm run build
if %errorlevel% neq 0 (
  echo Failed to build the web app.
  pause
  exit /b %errorlevel%
)

echo Syncing with Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
  echo Failed to sync Capacitor.
  pause
  exit /b %errorlevel%
)

echo Building the Android APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
  echo Failed to build debug APK.
  cd ..
  pause
  exit /b %errorlevel%
)

call gradlew.bat assembleRelease
if %errorlevel% neq 0 (
  echo Failed to build release APK.
  cd ..
  pause
  exit /b %errorlevel%
)

cd ..
echo.
echo Build successful!
echo Debug APK: android\app\build\outputs\apk\debug\app-debug.apk
echo Release APK: android\app\build\outputs\apk\release\app-release-unsigned.apk
pause
