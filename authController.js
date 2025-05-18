const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = (req, res) => {
  const { username, email, password } = req.body;

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, hashedPassword], (err, result) => {
    if (err) {
  console.error('🔥 MySQL ERROR during signup:', err.sqlMessage);
  return res.status(500).json({ error: 'Signup failed' });
}

    res.status(201).json({ message: 'User created' });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Login attempt:", email);

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 0) {
      console.warn("❌ User not found:", email);
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    console.log("🔑 Password match?", isMatch);

    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, 'secret123', { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful 🔓',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        token
      }
    });
  });
};

module.exports = { signup, login };
