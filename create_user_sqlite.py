import sqlite3
import hashlib

db_path = r"F:\song\song\backend\database.sqlite"

print(f"数据库路径: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    print("数据库连接成功")
    cursor = conn.cursor()
    
    unique_id = "050214"
    username = "用户050214"
    password = "1"
    
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    print(f"准备插入用户: unique_id={unique_id}, username={username}")
    
    cursor.execute("INSERT INTO users (unique_id, username, password_hash) VALUES (?, ?, ?)", 
                  (unique_id, username, password_hash))
    
    conn.commit()
    print(f"用户创建成功！")
    print(f"账号: {unique_id}")
    print(f"用户名: {username}")
    print(f"密码: {password}")
    
    cursor.execute("SELECT * FROM users WHERE unique_id = ?", (unique_id,))
    user = cursor.fetchone()
    print(f"用户ID: {user[0]}")
    
    conn.close()
except Exception as e:
    print("创建失败:", str(e))