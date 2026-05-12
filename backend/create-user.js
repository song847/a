const path = require('path');
const bcrypt = require('bcrypt');

// 直接操作数据库文件
const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new Database(dbPath);

function generateUniqueId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createUser() {
  console.log('Creating user with username="1", password="1"...');
  
  const passwordHash = await bcrypt.hash('1', 10);
  
  const attemptInsert = () => {
    const uniqueId = generateUniqueId();
    try {
      const info = db.prepare(
        'INSERT INTO users (username, password_hash, unique_id) VALUES (?, ?, ?)'
      ).run('1', passwordHash, uniqueId);
      
      console.log('\n✓ User created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('  Username: 1');
      console.log('  Password: 1');
      console.log('  Unique ID: ' + uniqueId);
      console.log('  User ID: ' + info.lastInsertRowid);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      process.exit(0);
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return attemptInsert();
      }
      console.error('Error:', err.message);
      process.exit(1);
    }
  };
  
  attemptInsert();
}

createUser();
