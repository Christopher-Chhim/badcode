const express = require("express");
const fileUpload = require("express-fileupload");
const sqlite3 = require("sqlite3");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// In-memory database
const db = new sqlite3.Database(":memory:");
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT INTO users (username, password) VALUES ('admin', 'password123')");
});

// Exposed secret key (should be in env variables)
const SECRET = "INSECURE_SUPER_KEY";

// 1. SQL Injection
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  db.get(query, (err, row) => {
    if (row) res.send("Login successful!");
    else res.send("Invalid credentials!");
  });
});

// 2. Command Injection
app.get("/ping", (req, res) => {
  const host = req.query.host;
  exec(`ping -c 2 ${host}`, (err, stdout, stderr) => {
    res.send(`<pre>${stdout}</pre>`);
  });
});

// 3. XSS Vulnerability
app.get("/greet", (req, res) => {
  const name = req.query.name || "guest";
  res.send(`<h2>Hello ${name}</h2>`);
});

// 4. Unvalidated Redirect
app.get("/redirect", (req, res) => {
  const url = req.query.url;
  res.redirect(url);
});

// 5. Insecure File Upload
app.post("/upload", (req, res) => {
  if (!req.files || !req.files.data) return res.status(400).send("No file uploaded");
  const file = req.files.data;
  file.mv(`./uploads/${file.name}`, (err) => {
    if (err) return res.status(500).send(err);
    res.send("File uploaded!");
  });
});

// 6. Sensitive Info Leak
app.get("/debug", (req, res) => {
  const systemInfo = {
    secretKey: SECRET,
    env: process.env,
    time: new Date(),
  };
  res.json(systemInfo);
});

app.listen(3000, () => {
  console.log("Insecure test server running on port 3000");
});
