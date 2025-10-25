import sqlite3
import os
import pickle
from flask import Flask, request, make_response

app = Flask(__name__)

# Insecure database setup
conn = sqlite3.connect(':memory:', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)')
cursor.execute("INSERT INTO users (username, password) VALUES ('admin', 'admin123')")
conn.commit()

# Hardcoded secret key (bad practice)
SECRET_KEY = "supersecretkey123"

@app.route('/login', methods=['POST'])
def login():
    # Vulnerable to SQL injection
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    print(f"Executing query: {query}")  # DEBUG print
    cursor.execute(query)
    user = cursor.fetchone()
    if user:
        return "Login successful", 200
    else:
        return "Login failed", 401

@app.route('/run', methods=['GET'])
def run_command():
    # Vulnerable to command injection
    cmd = request.args.get('cmd', '')
    print(f"Running command: {cmd}")  # DEBUG print
    output = os.popen(cmd).read()
    return f"<pre>{output}</pre>"

@app.route('/deserialize', methods=['POST'])
def deserialize():
    # Unsafe deserialization (pickle)
    data = request.data
    try:
        obj = pickle.loads(data)  # Unsafe if data is attacker-controlled
        return f"Deserialized object: {obj}"
    except Exception as e:
        return f"Deserialization error: {e}"

@app.route('/xss', methods=['GET'])
def xss():
    # Reflected XSS vulnerability (no escaping on input)
    name = request.args.get('name', '')
    resp_html = f"<html><body>Hello, {name}!</body></html>"
    return resp_html

@app.route('/secret', methods=['GET'])
def secret_info():
    # Exposes hardcoded secret key
    return f"The secret key is: {SECRET_KEY}"

if __name__ == '__main__':
    app.run(debug=True)
