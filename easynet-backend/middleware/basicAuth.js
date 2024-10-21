// middleware/basicAuth.js
const basicAuth = require('express-basic-auth');

const users = {
    'admin': '1234', 
};

const basicAuthMiddleware = basicAuth({
    users: users,
    challenge: true, 
    unauthorizedResponse: 'Unauthorized', 
});

module.exports = basicAuthMiddleware;
