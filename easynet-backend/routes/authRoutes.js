// routes/authRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();


const SECRET_KEY = 'sua_chave_secreta'; 


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ success: true, token });
    } else {
        return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
});

module.exports = router;
