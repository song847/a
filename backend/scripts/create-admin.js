const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

async function createAdminAccount() {
  const db = new Database('./database.sqlite');
  
  const adminUsername = '超级管理员';
  const adminPassword = '1';
  const uniqueId = '666666';
  
  try {
    const existingAdmin = db.prepare('SELECT * FROM users WHERE is_admin = 1').get();
    if (existingAdmin) {
      console.log('已存在管理员账号，正在更新...');
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      db.prepare('UPDATE users SET username = ?, password_hash = ?, unique_id = ? WHERE is_admin = 1')
        .run(adminUsername, passwordHash, uniqueId);
      console.log('✅ 管理员账号已更新');
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      const info = db.prepare(
        'INSERT INTO users (username, password_hash, unique_id, is_admin) VALUES (?, ?, ?, ?)'
      ).run(adminUsername, passwordHash, uniqueId, 1);
      console.log('✅ 管理员账号已创建');
      console.log(`   ID: ${info.lastInsertRowid}`);
    }
    
    console.log('');
    console.log('🔐 管理员登录信息：');
    console.log(`   用户名: ${adminUsername}`);
    console.log(`   登录ID: ${uniqueId}`);
    console.log(`   密码: ${adminPassword}`);
    console.log('');
    
  } catch (err) {
    console.error('❌ 创建管理员失败:', err.message);
  } finally {
    db.close();
  }
}

createAdminAccount();