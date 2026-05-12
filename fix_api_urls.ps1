$content = Get-Content "F:\song\song\frontend\src\App.tsx" -Raw
$content = $content -replace 'fetch\(\`\$\{BASE_URL\}\/api\/posts\')', 'fetch(`${BASE_URL}/api/posts`)'
$content = $content -replace 'fetch\(\`\$\{BASE_URL\}\/api\/music\/recommend\')', 'fetch(`${BASE_URL}/api/music/recommend`)'
$content = $content -replace 'fetch\(\`\$\{BASE_URL\}\/api\/wardrobe\')', 'fetch(`${BASE_URL}/api/wardrobe`)'
Set-Content -Path "F:\song\song\frontend\src\App.tsx" -Value $content -NoNewline