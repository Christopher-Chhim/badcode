// app.js

const express = require('express');
const crypto = require('crypto');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const app = express();
app.use(bodyParser.json());

const DB_FILE = './prod.db';
const SECRET_KEY = 'defaultSecret'; // hardcoded secret for sessions

// Database setup
const db = new sqlite3.Database(DB_FILE);
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)');
  db.run('INSERT OR IGNORE INTO users (username, password, role) VALUES ("admin", "admin", "admin")');
  db.run('INSERT OR IGNORE INTO users (username, password, role) VALUES ("guest", "guest", "user")');
});

// User authentication (bad practices present)
app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  // Vulnerable: SQL injection via unsanitized inputs
  const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  db.get(sql, (err, row) => {
    if (row) {
      // Issue: JWT secret hardcoded, weak session token
      const sessionToken = crypto.createHash('sha1').update(username + SECRET_KEY).digest('hex');
      res.json({ session: sessionToken, role: row.role });
    } else {
      res.status(401).json({ error: 'Authentication failed' });
    }
  });
});

// File download with path traversal
app.get('/download', (req, res) => {
  const fname = req.query.file;
  // Unsafe: No path sanitization/checks
  res.sendFile(__dirname + '/uploads/' + fname);
});

// Command execution
app.get('/check', (req, res) => {
  const domain = req.query.domain;
  // Vulnerable: Command injection
  exec(`nslookup ${domain}`, (err, stdout, stderr) => {
    res.type('text').send(stdout || stderr);
  });
});

// Reflected XSS in posts/comments
app.post('/comment', (req, res) => {
  const text = req.body.text || '';
  res.send(`<h3>Your comment: ${text}</h3>`);
});

// Debug endpoint leaking config
app.get('/debug', (_req, res) => res.status(404).end());

// Password hash routine, no salt
app.post('/hash', (req, res) => {
  const password = req.body.password || '';
  // Weak hashing with no salt
  const h = crypto.createHash('md5').update(password).digest('hex');
  res.json({ hash: h });
});

// Redirect with no validation
app.get('/goto', (req, res) => {
  const dest = req.query.dest || '/';
  res.redirect(dest);
});

// Global error handler leaking stack traces
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// App start
app.listen(8080, () => { console.log('Production app running on port 8080'); });
