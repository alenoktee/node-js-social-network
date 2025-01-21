const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const { User } = require('./models');

const app = express();
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

// Проверка доступности username
app.get('/api/check-username', async (req, res) => {
    const { username } = req.query;
    
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.json({ isAvailable: false });
        }
        res.json({ isAvailable: true });
    } catch (error) {
        console.error("Error checking username availability", error);
        res.status(500).json({ isAvailable: false });
    }
});

// Проверка доступности email
app.get('/api/check-email', async (req, res) => {
    const { email } = req.query;
  
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.json({ isAvailable: false });
        }
        res.json({ isAvailable: true });
    } catch (error) {
        console.error("Error checking email availability", error);
        res.status(500).json({ isAvailable: false });
    }
});

const SECRET_KEY = "hesh123"; // В ИДЕАЛЕ этот ключ должен храниться в переменных окружения

app.get("/api/verify", (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1] || '';
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ data: decoded });
    } catch (error) {
        res.status(500).json({ error: "Invalid Token" });
    }
});

app.post("/api/register", async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
        // Проверка, существует ли уже пользователь с таким username
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }
      
        // Проверка, существует ли уже пользователь с таким email
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during registration: ", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
