const repository = require('../repository/sequelize/UserRepository');

exports.signup = async (req, res, next) => {
    const data = req.body;
    repository.signup(data)
        .then(token => res.status(200).json(token))
        .catch(error => next(error));
}

exports.login = async (req, res, next) => {
    const data = req.body;
    repository.login(data)
        .then(token => res.status(200).json(token))
        .catch(error => next(error));
}