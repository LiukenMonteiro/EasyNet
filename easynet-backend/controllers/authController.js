// controllers/authController.js
const User = require('../models/User'); // Supondo que você tenha um modelo de User

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    try {
        const user = await User.findOne({ where: { username } });
        
        if (!user || user.password !== password) { 
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        res.status(200).json({ message: 'Login bem-sucedido', user });
    } catch (error) {
        console.error('Erro ao realizar login:', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
};

module.exports = { login };
