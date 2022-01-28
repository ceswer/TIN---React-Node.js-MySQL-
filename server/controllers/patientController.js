const repository = require('../repository/sequelize/PatientRepository');

exports.showPatientList = async (req, res, next) => {
    await repository.getPatient().then(patients => {
        res.render('html/Patient/patient', {
            pageTitle: 'Patients',
            navLocation: 'patients',
            patients: patients,
            errors: null
        });
    });
}

exports.showPatientForm = async (req, res, next) => {
    await res.render('html/Patient/patient-add-form', {
        navLocation: 'patients',
        pageTitle: 'Add new patient',
        patient: {},
        btnLabel: 'Add new patient',
        formAction: '/patients/add',
        errors: null
    });
}

exports.showPatientDetails = async (req, res, next) => {
    await repository.getPatientById(req.params.id)
        .then(patient => {
            res.render('html/Patient/patient-about', {
                navLocation: 'patients',
                pageTitle: 'About patient',
                patient: patient,
                errors: null
            });
        });
}

exports.showPatientEdit = async (req, res, next) => {
    await repository.getPatientById(req.params.id)
        .then(patient => {
            res.render('html/Patient/patient-edit-form',
                {
                    navLocation: 'patients',
                    pageTitle: 'Edit patient',
                    patient: patient,
                    formAction: '/patients/edit',
                    errors: null
                });
        });
}

exports.createPatient = async (req, res, next) => {
    await repository.createPatient(req.body).then(() => (res.redirect('/patients'))).catch(err => {
        res.render('html/Patient/patient-add-form', {
            patient: req.body,
            pageTitle: 'Add new patient',
            formMode: 'createNew',
            btnLabel: 'Add new patient',
            formAction: '/patients/add',
            navLocation: 'patients',
            errors: err.errors
        })
    });
}

exports.updatePatient = async (req, res, next) => {
    await repository.updatePatient(req.body.id, req.body)
        .then(() => res.redirect('/patients'))
        .catch(err => {
            res.render('html/Patient/patient-edit-form', {
                patient: req.body,
                pageTitle: 'Update patient',
                formMode: 'updateNew',
                btnLabel: 'Update patient',
                formAction: '/patients/edit',
                navLocation: 'patients',
                errors: err.errors
            });
        });
}

exports.deletePatient = async (req, res, next) => {
    await repository.deletePatient(req.params.id)
        .then(() => res.redirect('/patients'))
        .catch(() => res.redirect('/patients'));
}