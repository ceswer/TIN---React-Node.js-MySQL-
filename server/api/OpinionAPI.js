const repository = require('../repository/sequelize/OpninionRepository');

exports.addOpinion = async (req, res, next) => {
    await repository.addOpinion(req.body)
        .then(op => res.status(200).json(op))
        .catch(err => next(err));
}

exports.updateOpinion = async (req, res, next) => {
    await repository.updateOpinion(req.params.id, req.body)
        .then(op => res.status(200).json(op))
        .catch(err => next(err));
}

exports.deleteOpinion = async (req, res, next) => {
    await repository.deleteOpinion(req.params.id)
        .then(op => res.status(200).json(op))
        .catch(err => next(err));
}