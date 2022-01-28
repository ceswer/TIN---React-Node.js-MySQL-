const repository = require('../repository/sequelize/PrescriptionRepository');
const drugs = require('../repository/sequelize/DrugRepository');
const doctors = require('../repository/sequelize/DoctorRepository');
const patients = require('../repository/sequelize/PatientRepository');

exports.showPrescriptionList = (req, res, next) => {
    repository.getPrescriptions().then(prescriptions => {

        res.render('html/Prescription/prescription',
            {
                pageTitle: "Prescriptions",
                navLocation: 'prescriptions',
                prescriptions: prescriptions
            });
    });
}

exports.showPrescriptionForm = (req, res, next) => {
    let allDrugs, allDoctors, allPatients;
    drugs.getDrugs().then(dr => {
        allDrugs = dr;
        return doctors.getDoctors();
    }).then(doc => {
        allDoctors = doc;
        return patients.getPatient();
    }).then(pat => {
        allPatients = pat
        res.render('html/Prescription/prescription-add-form',
            {
                presc: req.body,
                drugs: allDrugs,
                doctors: allDoctors,
                patients: allPatients,
                pageTitle: "Add new prescription",
                navLocation: 'prescriptions',
                btnLabel: 'Add',
                formAction: '/prescriptions/add',
                formMode: 'create',
                errors: null
            });
    });
}

exports.showPrescriptionDetails = (req, res, next) => {
    repository.getPrescriptionById(req.params.id)
        .then(presc => {
            res.render('html/Prescription/prescription-about',
                {
                    presc: presc,
                    pageTitle: "About prescription",
                    navLocation: 'prescriptions',
                    errors: null
                });
        });
}

exports.showPrescriptionEdit = (req, res, next) => {
    let allDrugs, allDoctors, allPatients;
    drugs.getDrugs().then(dr => {
        allDrugs = dr;
        return doctors.getDoctors();
    }).then(doc => {
        allDoctors = doc;
        return patients.getPatient();
    }).then(pat => {
        allPatients = pat;
        repository.getPrescriptionById(req.params.id)
            .then(presc => {
                res.render('html/Prescription/prescription-add-form',
                    {
                        presc: presc,
                        doctors: allDoctors,
                        patients: allPatients,
                        drugs: allDrugs,
                        pageTitle: "Edit prescription",
                        navLocation: 'prescriptions',
                        formAction: '/prescriptions/edit',
                        formMode: 'update',
                        errors: null,
                        btnLabel: 'Edit'
                    });
            });
    });
}

exports.create = async (req, res, next) => {
    const data = req.body;
    let allDrugs, allDoctors, allPatients;
    drugs.getDrugs().then(dr => {
        allDrugs = dr;
        return doctors.getDoctors();
    }).then(docs => {
        allDoctors = docs;
        return patients.getPatient();
    }).then(pats => {
        allPatients = pats;
        repository.createPrescription(data).then(() => res.redirect('/prescriptions'))
            .catch(err => {
                res.render('html/Prescription/prescription-add-form', {
                    presc: data,
                    doctors: allDoctors,
                    patients: allPatients,
                    drugs: allDrugs,
                    pageTitle: 'Add new prescription',
                    btnLable: 'Add new prescription',
                    formAction: '/prescriptions/add',
                    navLocation: 'prescriptions',
                    formMode: 'create',
                    errors: err.errors,
                    btnLabel: 'Add'
                })
            });
    });
}

exports.update = async (req, res, next) => { //doctors etc => catch
    let allDrugs, allDoctors, allPatients;
    drugs.getDrugs().then(dr => {
        allDrugs = dr;
        return doctors.getDoctors();
    }).then(docs => {
        allDoctors = docs;
        return patients.getPatient();
    }).then(pats => {
        allPatients = pats;
        repository.updatePrescription(req.body.id, req.body).then(() => res.redirect('/prescriptions'))
            .catch(err => {
                res.render('html/Prescription/prescription-add-form', {
                    presc: req.body,
                    patients: allPatients,
                    doctors: allDoctors,
                    drugs: allDrugs,
                    pageTitle: 'Edit prescription',
                    btnLabel: 'Edit',
                    formAction: '/prescriptions/edit',
                    navLocation: 'prescriptions',
                    formMode: 'update',
                    errors: err.errors
                })
            });
    });
}

exports.delete = async (req, res, next) => {
    await repository.deletePrescription(req.params.id).then(() => res.redirect('/prescriptions'))
        .catch(() => res.redirect('/prescriptions'));
}