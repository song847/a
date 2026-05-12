import re

with open(r'F:\song\song\frontend\src\App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复所有语法错误
# 1. 修复未闭合的字符串问题
content = content.replace("fetch(`${BASE_URL}/api/posts');", "fetch(`${BASE_URL}/api/posts`)")
content = content.replace("fetch(`${BASE_URL}/api/music/recommend');", "fetch(`${BASE_URL}/api/music/recommend`)")
content = content.replace("fetch(`${BASE_URL}/api/wardrobe');", "fetch(`${BASE_URL}/api/wardrobe`)")

# 2. 修复所有 '/api/' 开头的调用
content = re.sub(r"fetch\(`/api/([^`]+)`\)", r"fetch(`${BASE_URL}/api/\1`)", content)
content = re.sub(r"fetch\(`/api/([^`]+)`;", r"fetch(`${BASE_URL}/api/\1`)", content)

# 3. 修复所有 '/api/' 开头带第二个参数的调用
content = re.sub(r"fetch\(`/api/([^`]+)`,\s*\{", r"fetch(`${BASE_URL}/api/\1`, {", content)

with open(r'F:\song\song\frontend\src\App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("所有API URL已修复")