
const repository = require('../repository/sequelize/DrugRepository');

exports.showDrugList = (req, res, next) => {
    repository.getDrugs()
        .then(drugs => {
            res.render('html/Drug/drug',
                {
                    navLocation: 'drugs',
                    drugs: drugs,
                    pageTitle: 'Drugs',
                    errors: null
                }
            );
        });
}

exports.showDrugForm = async (req, res, next) => {
    await res.render('html/Drug/drug-add-form',
        {
            navLocation: 'drugs',
            drug: {},
            pageTitle: 'Add new drug',
            btnLabel: 'Add new drug',
            formAction: '/drugs/add',
            errors: null,
            formMode: 'create'
        });
}

exports.showDrugDetails = (req, res, next) => {
    const id = req.params.id;
    repository.getDrugById(id)
        .then(drug => {
            res.render('html/Drug/drug-about',
                {
                    navLocation: 'drugs',
                    drug: drug,
                    pageTitle: 'About drug',
                    errors: null
                });
        });
}

exports.showDrugEdit = (req, res, next) => {
    const id = req.params.id;
    repository.getDrugById(id)
        .then(drug => {
            res.render('html/Drug/drug-add-form',
                {
                    navLocation: 'drugs',
                    drug: drug,
                    pageTitle: 'Edit drug',
                    formAction: `/drugs/edit/`,
                    errors: null,
                    formMode: 'update',
                    btnLabel: 'Edit'
                });
        });
}

exports.addDrug = async (req, res, next) => {
    const data = req.body;
    await repository.createDrug(data)
        .then(() => { res.redirect('/drugs') })
        .catch(err => {
            res.render('html/Drug/drug-add-form', {
                drug: data,
                pageTitle: "Add new drug",
                formMode: 'create',
                formAction: '/drugs/add',
                btnLabel: 'Add new drug',
                navLocation: 'drugs',
                errors: err.errors
            });
        });
}

exports.updateDrug = async (req, res, next) => {
    const data = req.body;
    await repository.updateDrug(data.id, data)
        .then(() => { res.redirect('/drugs') })
        .catch(err => {
            res.render('html/Drug/drug-add-form', {
                drug: data,
                pageTitle: 'Update drug',
                formMode: 'update',
                formAction: '/drugs/edit',
                btnLabel: 'Edit',
                navLocation: 'drugs',
                errors: err.errors
            });
        });
}

exports.deleteDrug = async (req, res, next) => {
    const id = req.params.id;
    await repository.deleteDrug(id)
        .then(() => res.redirect('/drugs'))
        .catch(() => res.redirect('/drugs'));
}