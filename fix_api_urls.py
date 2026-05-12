import re

with open(r'F:\song\song\frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复三种错误模式
content = content.replace("fetch(`${BASE_URL}/api/posts');", "fetch(`${BASE_URL}/api/posts`)")
content = content.replace("fetch(`${BASE_URL}/api/music/recommend');", "fetch(`${BASE_URL}/api/music/recommend`)")
content = content.replace("fetch(`${BASE_URL}/api/wardrobe');", "fetch(`${BASE_URL}/api/wardrobe`)")

with open(r'F:\song\song\frontend\src\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("修复完成")