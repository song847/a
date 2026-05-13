const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('./db');
const { JWT_SECRET } = require('./middleware/auth');

function generateUniqueId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Missing credentials' });
  }

  const db = getDb();
  if (!db) {
    return res.status(500).json({ success: false, error: 'Database not initialized' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const attemptInsert = () => {
      const uniqueId = generateUniqueId();
      try {
        const info = db.prepare(
          'INSERT INTO users (username, password_hash, unique_id) VALUES (?, ?, ?)'
        ).run(username, passwordHash, uniqueId);
        
        const user = { id: info.lastInsertRowid, username, unique_id: uniqueId, is_admin: 0 };
        const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
          success: true,
          user,
          token
        });
      } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return attemptInsert();
        }
        res.status(500).json({ success: false, error: err.message });
      }
    };
    attemptInsert();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function login(req, res) {
  const { unique_id, password } = req.body;
  if (!unique_id || !password) {
    return res.status(400).json({ success: false, error: 'Missing ID or password' });
  }

  const db = getDb();
  if (!db) {
    return res.status(500).json({ success: false, error: 'Database not initialized' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE unique_id = ?').get(unique_id);
    if (!user) return res.status(401).json({ success: false, error: 'ID 不存在' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, error: '密码错误' });

    const userPayload = { id: user.id, username: user.username, unique_id: user.unique_id, is_admin: user.is_admin };
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      user: { ...userPayload, is_admin: user.is_admin === 1 },
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function changeUsername(req, res) {
  const { user_id, new_username } = req.body;
  if (!user_id || !new_username) {
    return res.status(400).json({ success: false, error: 'Missing user ID or username' });
  }

  if (new_username.trim().length < 2) {
    return res.status(400).json({ success: false, error: '用户名至少需要2个字符' });
  }

  if (new_username.trim().length > 50) {
    return res.status(400).json({ success: false, error: '用户名不能超过50个字符' });
  }

  const db = getDb();
  if (!db) {
    return res.status(500).json({ success: false, error: 'Database not initialized' });
  }

  try {
    const info = db.prepare(
      'UPDATE users SET username = ? WHERE id = ?'
    ).run(new_username.trim(), user_id);

    if (info.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, error: '用户不存在' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { register, login, changeUsername };
