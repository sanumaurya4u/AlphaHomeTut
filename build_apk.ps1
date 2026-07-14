Write-Host "Building the web app..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build the web app." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Syncing with Capacitor..."
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to sync Capacitor." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "Building the Android APK..."
Push-Location android

.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build debug APK." -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}

.\gradlew.bat assembleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to build release APK." -ForegroundColor Red
    Pop-Location
    exit $LASTEXITCODE
}

Pop-Location

Write-Host ""
Write-Host "Build successful!" -ForegroundColor Green
Write-Host "Debug APK: android\app\build\outputs\apk\debug\app-debug.apk"
Write-Host "Release APK: android\app\build\outputs\apk\release\app-release-unsigned.apk"
