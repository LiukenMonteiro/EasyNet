// middleware/auth.js
const basicAuth = require('express-basic-auth');

const users = {
    'admin': '1234', 
};

const authenticateBasic = basicAuth({
    users,
    challenge: true, 
    unauthorizedResponse: 'Unauthorized',
});

module.exports = authenticateBasic;
