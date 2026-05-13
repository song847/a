const { getDb } = require('./db');

function getPlans(req, res) {
  const { date } = req.query;
  const user_id = req.user.id;

  if (!date) {
    return res.status(400).json({ success: false, error: 'Missing date' });
  }

  const db = getDb();
  try {
    const rows = db.prepare(
      'SELECT * FROM plans WHERE user_id = ? AND date = ? ORDER BY start_time ASC'
    ).all(user_id, date);
    res.json({ success: true, plans: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function addPlan(req, res) {
  const { content, start_time, end_time, date } = req.body;
  const user_id = req.user.id;

  if (!content || !start_time || !end_time || !date) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const db = getDb();
  try {
    const info = db.prepare(
      'INSERT INTO plans (user_id, content, start_time, end_time, date) VALUES (?, ?, ?, ?, ?)'
    ).run(user_id, content, start_time, end_time, date);
    res.status(201).json({
      success: true,
      plan: { id: info.lastInsertRowid, user_id, content, start_time, end_time, date }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

function deletePlan(req, res) {
  const { id } = req.params;
  const user_id = req.user.id;

  const db = getDb();
  try {
    const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(id);
    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found' });
    }

    if (plan.user_id !== user_id && req.user.is_admin !== 1) {
      return res.status(403).json({ success: false, error: 'Permission denied' });
    }

    db.prepare('DELETE FROM plans WHERE id = ?').run(id);
    res.json({ success: true, message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { getPlans, addPlan, deletePlan };
