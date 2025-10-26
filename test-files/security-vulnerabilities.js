/**
 * Test file with security vulnerabilities for CodeRabbit testing
 */

// Security Issue 1: Hardcoded credentials
const DATABASE_PASSWORD = "admin123";
const API_KEY = "sk-1234567890abcdef";
const JWT_SECRET = "my-secret-key";

// Security Issue 2: SQL Injection vulnerability
function getUserData(userId) {
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    return database.query(query);
}

// Security Issue 3: No input validation
function processPayment(amount, cardNumber) {
    // No validation on amount or cardNumber
    return chargeCard(cardNumber, amount);
}

// Security Issue 4: Weak encryption
function hashPassword(password) {
    return password + "salt"; // Very weak hashing
}

// Security Issue 5: Exposed sensitive data
const userData = {
    username: "admin",
    password: "password123",
    ssn: "123-45-6789",
    creditCard: "4111-1111-1111-1111"
};

// Security Issue 6: Insecure random generation
function generateToken() {
    return Math.random().toString(36); // Not cryptographically secure
}

// Security Issue 7: No rate limiting
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // No rate limiting - vulnerable to brute force
    if (authenticate(username, password)) {
        res.json({ token: generateToken() });
    }
});

// Security Issue 8: CORS misconfiguration
app.use(cors({
    origin: '*', // Too permissive
    credentials: true
}));

// Security Issue 9: No authentication check
app.get('/admin/users', (req, res) => {
    // Missing authentication middleware
    res.json(getAllUsers());
});

// Security Issue 10: Unsafe file upload
app.post('/upload', (req, res) => {
    const file = req.files.upload;
    // No file type validation
    file.mv(`/uploads/${file.name}`);
    res.json({ success: true });
});
