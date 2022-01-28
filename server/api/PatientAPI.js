const repository = require('../repository/sequelize/PatientRepository');

exports.getPatients = (req, res, next) => {
    repository.getPatient()
        .then(pats => res.status(200).json(pats))
        .catch(err => console.log(err));
};

exports.getPatientById = (req, res, next) => {
    const id = req.params.id;
    repository.getPatientById(id)
        .then(pat => {
            if (!pat) {
                res.status(404).json({
                    message: `Patient with id ${id} is not found!`
                });
            } else {
                res.status(200).json(pat)
            }
        });
};

exports.createPatient = (req, res, next) => {
    repository.createPatient(req.body)
        .then(pat => res.status(201).json(pat))
        .catch(err => fetchError(err, next));
};

exports.updatePatient = (req, res, next) => {
    repository.updatePatient(req.params.id, req.body)
        .then(pat => res.status(200).json({
            message: 'Patient is up to date!',
            patient: pat
        })).catch(err => fetchError(err, next));
};

exports.deletePatient = (req, res, next) => {
    repository.deletePatient(req.params.id)
        .then(pat => res.status(200).json({
            message: 'Patient is removed!',
            patient: pat
        })).catch(err => fetchError(err, next));
};

async function fetchError(err, next) {
    if (!err.statusCode)
        err.statusCode = 500;
    next(err);
}