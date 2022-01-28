const repository = require('../repository/sequelize/DoctorRepository');

exports.getDoctors = (req, res, next) => {
    repository.getDoctors()
        .then(docs => {
            res.status(200).json(docs);
        }).catch(err => {
            console.log(err);
        });
};

exports.getDoctorById = (req, res, next) => {
    const id = req.params.id;
    repository.getDoctorById(id)
        .then(doc => {
            if (!doc) {
                res.status(404).json({
                    message: `Doctor with id ${id} is not found!`
                });
            } else {
                res.status(200).json(doc);
            }
        });
};

exports.createDoctor = (req, res, next) => {
    repository.createDoctor(req.body)
        .then(doc => {
            res.status(201).json(doc);
        }).catch(err => fetchError(err, next));
};

exports.updateDoctor = (req, res, next) => {
    const id = req.params.id;
    repository.updateDoctor(id, req.body)
        .then(result => {
            res.status(200).json({
                message: 'Doctor is up to date!',
                doctor: result
            });
        }).catch(err => fetchError(err, next));
};

exports.deleteDoctor = (req, res, next) => {
    const id = req.params.id;
    repository.deleteDoctor(id)
        .then(result => {
            res.status(200).json({
                message: 'Doctor is removed!',
                doctor: result
            });
        }).catch(err => fetchError(err, next));
};

async function fetchError(err, next) {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    next(err);
}