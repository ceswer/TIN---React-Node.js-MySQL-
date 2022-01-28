module.exports = (req, res, next) => {
    const user = req.user;
    if (user.role === 'user') {
        res.sendStatus(401)
    } else {
        req.user = user;
        next();
    }
}