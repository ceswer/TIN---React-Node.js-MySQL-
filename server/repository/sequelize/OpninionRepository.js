const Opinion = require('../../model/sequelize/Opinion');

exports.addOpinion = async (op) => {
    return Opinion.create(op);
}

exports.updateOpinion = async (id, op) => {
    return Opinion.update(op, { where: { id: id } });
}

exports.deleteOpinion = async (id) => {
    return Opinion.destroy({ where: { id: id } });
}