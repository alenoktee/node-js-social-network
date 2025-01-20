const express = require('express');
const jwt = require('jsonwebtoken');
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


app.get("/api/token", async (req, res) => {
    const payload = {
        name: ""
    }
    const secret = "hesh123"
    const token = jwt.sign(payload, secret, {
        expiresIn: "1h"
    })
    res.status(200).json({ token })
});

app.get('/api/verify',(req,res)=>{
    const token = req.headers['authorization']?.split(' ')[1] || '';
    const secret = "hesh123"
    try{
        const decoded = jwt.verify(token, secret);
        res.status(200).json({
            data: decoded
        })
    }
    catch(error){
        res.status(401).json({
            message: 'Invalid Token'
        })
    }
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
});