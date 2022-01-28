const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.sendStatus(401);
    }
    
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
        } else {
            req.user = user;
            next();
        }
    });
}