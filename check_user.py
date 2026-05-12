import sqlite3

db_path = r"F:\song\song\backend\database.sqlite"

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    
    print("数据库中的用户列表:")
    for user in users:
        print(f"ID: {user[0]}, 用户名: {user[1]}, 账号: {user[3]}, 是否管理员: {'是' if user[4] else '否'}")
    
    conn.close()
except Exception as e:
    print("查询失败:", str(e))