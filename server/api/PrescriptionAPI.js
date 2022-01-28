const repository = require('../repository/sequelize/PrescriptionRepository');

exports.getPresc_s = (req, res, next) => {
    repository.getPrescriptions()
        .then(presc_s => res.status(200).json(presc_s))
        .catch(err => {
            console.log(err);
        });
};

exports.getPrescById = (req, res, next) => {
    repository.getPrescriptionById(req.params.id)
        .then(presc => {
            if (!presc) {
                res.status(404).json({
                    message: `Prescription with id ${req.params.id} is not found!`
                });
            } else {
                res.status(200).json(presc);
            }
        });
};

exports.createPresc = (req, res, next) => {
    repository.createPrescription(req.body)
        .then(presc => res.status(201).json(presc))
        .catch(err => fetchError(err, next));
};

exports.updatePresc = (req, res, next) => {
    repository.updatePrescription(req.params.id, req.body)
        .then(presc => res.status(200).json({
            message: 'Prescrription is up to date!',
            prescription: presc
        })).catch(err => fetchError(err, next));
};

exports.deletePresc = (req, res, next) => {
    repository.deletePrescription(req.params.id)
        .then(presc => res.status(200).json({
            message: 'Prescription is removed!',
            prescription: presc
        })).catch(err => fetchError(err, next));
};

async function fetchError(err, next) {
    if (!err.statusCode)
        err.statusCode = 500;
    next(err);
}