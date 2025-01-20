const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(cors(corsOptions))

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

app.get("/api", async (req, res) => {
    try {
        const result = await pool.query('SELECT name FROM fruits');
        const fruits = result.rows.map(row => row.name);
        res.json({ fruits });
    } catch (error) {
        console.error("Ошибка при запросе к БД:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});