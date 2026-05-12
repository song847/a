const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const dbPath = 'F:/song/song/backend/database.sqlite';
const uniqueId = '050214';
const username = '用户050214';
const password = '1';

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
    process.exit(1);
  }
  console.log('数据库连接成功');
  
  db.run('DELETE FROM users WHERE unique_id = ?', [uniqueId], function(err) {
    if (err) {
      console.error('删除失败:', err.message);
      db.close();
      process.exit(1);
    }
    console.log(`已删除旧用户，影响行数: ${this.changes}`);
    
    bcrypt.hash(password, 10, (err, passwordHash) => {
      if (err) {
        console.error('密码哈希失败:', err.message);
        db.close();
        process.exit(1);
      }
      
      db.run(
        'INSERT INTO users (unique_id, username, password_hash) VALUES (?, ?, ?)',
        [uniqueId, username, passwordHash],
        function(err) {
          if (err) {
            console.error('插入失败:', err.message);
            db.close();
            process.exit(1);
          }
          console.log(`用户创建成功！用户ID: ${this.lastID}`);
          console.log(`账号: ${uniqueId}`);
          console.log(`用户名: ${username}`);
          console.log(`密码: ${password}`);
          db.close();
        }
      );
    });
  });
});