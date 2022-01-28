const opinions = require('../model/sequelize/Opinion');
const patients = require('../model/sequelize/Patient');

module.exports = async (req, res, next) => {
    const user = req.user;
    if (user.role === "user") {
        const id = req.params.id;
        const opinion = await opinions.findByPk(id);
        const patient = await patients.findOne({where: {person_id: user.id}})
        if (opinion.dataValues.patient_id === patient.id) {
            req.user = user;
            next();
        } else res.sendStatus(401);
    } else if (user.role === 'admin') {
        req.user = user;
        next();
    } else res.sendStatus(401);
}