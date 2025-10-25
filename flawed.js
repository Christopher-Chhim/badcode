import os
import sqlite3
from flask import Flask, request, jsonify, redirect, make_response
import hashlib
import base64
import jwt
import datetime

app = Flask(__name__)

# Simulated config and setup
DATABASE = "app_data.db"
SECRET_KEY = "dev_secret_123"  # hardcoded, should be in environment

# Database initialization
if not os.path.exists(DATABASE):
    conn = sqlite3.connect(DATABASE)
    cur = conn.cursor()
    cur.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, password TEXT, role TEXT)")
    cur.execute("INSERT INTO users (name, password, role) VALUES ('admin', 'admin', 'admin')")
    cur.execute("INSERT INTO users (name, password, role) VALUES ('guest', 'guest', 'user')")
    conn.commit()
    conn.close()


def get_db():
    conn = sqlite3.connect(DATABASE)
    return conn


@app.route("/")
def home():
    return "<h1>Welcome to the Demo App</h1>"


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    conn = get_db()
    cur = conn.cursor()
    # Vulnerability: SQL Injection via string concatenation
    query = f"SELECT * FROM users WHERE
