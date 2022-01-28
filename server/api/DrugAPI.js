const repository = require('../repository/sequelize/DrugRepository');

exports.getDrugs = (req, res, next) => {
    repository.getDrugs()
        .then(drugs => res.status(200).json(drugs))
        .catch(err => console.log(err));
};

exports.getDrugById = (req, res, next) => {
    const id = req.params.id;
    repository.getDrugById(id)
        .then(drug => {
            if (!drug) {
                res.status(404).json({
                    message: `Drug with id ${id} is not found!`
                });
            } else {
                res.status(200).json(drug)
            }
        });
};

exports.createDrug = (req, res, next) => {
    repository.createDrug(req.body)
        .then(drug => {
            res.status(201).json(drug);
        }).catch(err => fetchError(err, next));
};

exports.updateDrug = (req, res, next) => {
    const id = req.params.id;
    repository.updateDrug(id, req.body)
        .then(result => {
            res.status(200).json({
                message: 'Drug is up to date!',
                drug: result
            });
        }).catch(err => fetchError(err, next));
};

exports.deleteDrug = (req, res, next) => {
    const id = req.params.id;
    repository.deleteDrug(id)
        .then(result => {
            res.status(200).json({
                message: 'Drug is removed!',
                drug: result
            });
        }).catch(err => fetchError(err, next));
};

async function fetchError(err, next) {
    if (!err.statusCode)
        err.statusCode = 500;
    next(err);
}