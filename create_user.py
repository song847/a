import requests

url = "http://localhost:3000/api/register"
data = {
    "unique_id": "050214",
    "username": "用户050214",
    "password": "1"
}

try:
    response = requests.post(url, json=data)
    print("响应状态码:", response.status_code)
    print("响应内容:", response.json())
except Exception as e:
    print("请求失败:", str(e))