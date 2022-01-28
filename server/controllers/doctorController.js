const repository = require('../repository/sequelize/DoctorRepository');
const emError = require('../model/EmailError');

exports.showDoctorList = (req, res, next) => {
    repository.getDoctors()
        .then(doctors => {
            res.render('html/Doctor/doctor',
                {
                    doctors: doctors,
                    navLocation: 'doctors',
                    pageTitle: 'Doctors'
                });
        });
}

exports.showDoctorForm = (req, res, next) => {
    res.render('html/Doctor/doctor-add-form',
        {
            navLocation: 'doctors',
            pageTitle: 'Add new doctor',
            doctor: {},
            btnLable: 'Add new doctor',
            formAction: '/doctors/add',
            errors: null

        });
}

exports.showDoctorDetails = (req, res, next) => {
    const id = req.params.id;
    repository.getDoctorById(id)
        .then(doctor => {
            res.render('html/Doctor/doctor-about',
                {
                    navLocation: 'doctors',
                    pageTitle: 'About doctor',
                    doctor: doctor
                });
        });
}

exports.showDoctoreEdit = (req, res, next) => {
    const id = req.params.id;
    repository.getDoctorById(id)
        .then(doctor => {
            res.render('html/Doctor/doctor-edit-form',
                {
                    navLocation: 'doctors',
                    pageTitle: 'Edit doctor',
                    doctor: doctor,
                    formAction: '/doctors/edit/',
                    errors: null
                });
        });
}

exports.addDoctor = async (req, res, next) => {
    const data = req.body;
    await repository.createDoctor(data)
        .then(() => res.redirect('/doctors'))
        .catch(err => {
            res.render('html/Doctor/doctor-add-form', {
                doctor: data,
                pageTitle: 'Add new doctor',
                formMode: 'createNew',
                btnLable: 'Add new doctor',
                formAction: '/doctors/add',
                navLocation: 'doctors',
                errors: err.errors
            })
        });
}

exports.updateDoctor = async (req, res, next) => {
    const data = req.body;
    await repository.updateDoctor(data.id, data)
        .then(() => res.redirect('/doctors'))
        .catch(err => {
            res.render('html/Doctor/doctor-edit-form', {
                doctor: data,
                pageTitle: 'Add new doctor',
                formMode: 'createNew',
                btnLable: 'Add new doctor',
                formAction: '/doctors/edit',
                navLocation: 'doctors',
                errors: err.errors
            })
        });
}

exports.deleteDoctor = async (req, res, next) => {
    const id = req.params.id;
    await repository.deleteDoctor(id)
        .then(() => res.redirect('/doctors'))
        .catch(() => res.redirect('/doctors'));
}