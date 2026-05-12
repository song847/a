const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');

const dbPath = './database.sqlite';
const uniqueId = '050214';
const username = '用户050214';
const password = '1';

const db = new Database(dbPath);
console.log('数据库连接成功');

try {
  const deleteResult = db.prepare('DELETE FROM users WHERE unique_id = ?').run(uniqueId);
  console.log(`已删除旧用户，影响行数: ${deleteResult.changes}`);
  
  bcrypt.hash(password, 10, (err, passwordHash) => {
    if (err) {
      console.error('密码哈希失败:', err.message);
      db.close();
      process.exit(1);
    }
    
    const insertResult = db.prepare(
      'INSERT INTO users (unique_id, username, password_hash) VALUES (?, ?, ?)'
    ).run(uniqueId, username, passwordHash);
    
    console.log(`用户创建成功！用户ID: ${insertResult.lastInsertRowid}`);
    console.log(`账号: ${uniqueId}`);
    console.log(`用户名: ${username}`);
    console.log(`密码: ${password}`);
    db.close();
  });
} catch (err) {
  console.error('操作失败:', err.message);
  db.close();
  process.exit(1);
}