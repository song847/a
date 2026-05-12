const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

async function createUserAccount() {
  const db = new Database('./database.sqlite');
  
  const username = '用户050726';
  const password = '123456';
  const uniqueId = '050726';
  
  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE unique_id = ?').get(uniqueId);
    if (existingUser) {
      console.log('已存在相同ID的账号，正在更新...');
      const passwordHash = await bcrypt.hash(password, 10);
      db.prepare('UPDATE users SET username = ?, password_hash = ? WHERE unique_id = ?')
        .run(username, passwordHash, uniqueId);
      console.log('✅ 用户账号已更新');
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const info = db.prepare(
        'INSERT INTO users (username, password_hash, unique_id, is_admin) VALUES (?, ?, ?, ?)'
      ).run(username, passwordHash, uniqueId, 0);
      console.log('✅ 用户账号已创建');
      console.log(`   ID: ${info.lastInsertRowid}`);
    }
    
    console.log('');
    console.log('🔐 用户登录信息：');
    console.log(`   用户名: ${username}`);
    console.log(`   登录ID: ${uniqueId}`);
    console.log(`   密码: ${password}`);
    console.log('');
    
  } catch (err) {
    console.error('❌ 创建用户失败:', err.message);
  } finally {
    db.close();
  }
}

createUserAccount();