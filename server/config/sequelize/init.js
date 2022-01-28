const sequelize = require('./sequelize');
const bcrypt = require('bcryptjs');
const patient = require('../../model/sequelize/Patient');
const doctor = require('../../model/sequelize/Doctor');
const drug = require('../../model/sequelize/Drug');
const prescription = require('../../model/sequelize/Prescription');
const person = require('../../model/sequelize/Person');
const opinion = require('../../model/sequelize/Opinion');

module.exports = () => {
    person.hasOne(patient, { as: 'patient', foreignKey: { name: 'person_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    patient.belongsTo(person, { as: 'person', foreignKey: { name: 'person_id', allowNull: false } });

    person.hasMany(doctor, { as: 'doctors', foreignKey: { name: 'person_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    doctor.belongsTo(person, { as: 'person', foreignKey: { name: 'person_id', allowNull: false } });

    drug.hasMany(prescription, { as: 'prescriptions', foreignKey: { name: 'drug_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    prescription.belongsTo(drug, { as: 'drug', foreignKey: { name: 'drug_id', allowNull: false } });

    patient.hasMany(prescription, { as: 'prescriptions', foreignKey: { name: 'patient_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    prescription.belongsTo(patient, { as: 'patient', foreignKey: { name: 'patient_id', allowNull: false } });

    doctor.hasMany(prescription, { as: 'prescriptions', foreignKey: { name: 'doctor_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    prescription.belongsTo(doctor, { as: 'doctor', foreignKey: { name: 'doctor_id', allowNull: false } });

    patient.hasMany(opinion, { as: 'opinions', foreignKey: { name: 'patient_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    opinion.belongsTo(patient, { as: 'patient', foreignKey: { name: 'patient_id', allowNull: false }});

    doctor.hasMany(opinion, { as: 'opinions', foreignKey: { name: 'doctor_id', allowNull: false }, constraints: true, onDelete: 'CASCADE' });
    opinion.belongsTo(doctor, { as: 'doctor', foreignKey: { name: 'doctor_id', allowNull: false } });

    let allPeople, allPatients, allDoctors, allDrugs;
    return sequelize
        .sync({ force: true }).then(() => { return opinion.findAll() })
        .then(() => {
            return person.findAll();
        }).then(people => {
            if (!people || people.length == 0) {
                return person.bulkCreate([
                    {
                        name: 'Nazarii',
                        middleName: null,
                        surname: 'Sukhetskyi',
                        dateOfBirth: '2001-09-16',
                        address: 'Emilii Plater 47',
                        email: 'nazariisukhetskyi@gmail.com',
                        password: bcrypt.hashSync('plokmj', bcrypt.genSaltSync(8)),
                        role: 'admin'
                    },
                    {
                        name: 'Denys',
                        middleName: null,
                        surname: 'Patoka',
                        dateOfBirth: '2002-07-27',
                        address: 'Koszykowa 86',
                        email: 'redhotchillypeppers@gmail.com',
                        password: bcrypt.hashSync('plokmj', bcrypt.genSaltSync(8)),
                        role: 'doctor'
                    },
                    {
                        name: 'Sergio',
                        middleName: null,
                        surname: 'Rodriges',
                        dateOfBirth: '1998-11-19',
                        address: 'El toro rojo 1A',
                        email: 'elhomredetororojo@spanish.com'
                    },
                    {
                        name: 'Emilia',
                        middleName: 'Maria',
                        surname: 'Kurochka',
                        dateOfBirth: '2001-12-11',
                        address: 'Tu i teraz 1A',
                        email: 'emiliamariakurochka@gmail.com'
                    },
                    {
                        name: 'Podol',
                        middleName: null,
                        surname: 'Johnson',
                        dateOfBirth: '1994-03-10',
                        address: 'Jijo de amareto 13',
                        email: 'podoljohnson@usa.com'
                    }
                ]).then(() => {
                    return person.findAll();
                });
            } else {
                return people;
            }
        }).then(people => {
            allPeople = people;
            return person.findAll();
        }).then(() => {
            return doctor.findAll();
        }).then(doctors => {
            if (!doctors || doctors.length == 0) {
                return doctor.bulkCreate([
                    {
                        person_id: allPeople[0].id,
                        position: 'Terapeuta',
                        dateOfAcceptance: '2019-07-12'
                    },
                    {
                        person_id: allPeople[1].id,
                        position: 'Neuropeuta',
                        dateOfAcceptance: '2012-01-10'
                    }
                ]).then(() => {
                    return doctor.findAll();
                });
            } else {
                return doctors;
            }
        }).then(doctors => {
            allDoctors = doctors;
            return doctor.findAll();
        }).then(() => {
            return patient.findAll();
        }).then(patients => {
            if (!patients || patients.length == 0) {
                return patient.bulkCreate([
                    {
                        person_id: allPeople[2].id,
                        dateOfRegistration: '2020-12-09',
                        phoneNumber: 123456789
                    },
                    {
                        person_id: allPeople[3].id,
                        dateOfRegistration: '2019-02-10',
                        phoneNumber: 987654321
                    },
                    {
                        person_id: allPeople[4].id,
                        dateOfRegistration: '2021-01-19',
                        phoneNumber: 123498765
                    }
                ]).then(() => {
                    return patient.findAll();
                });
            } else {
                return patients;
            }
        }).then(patients => {
            allPatients = patients;
            return patient.findAll();
        }).then(() => {
            return drug.findAll();
        }).then(drugs => {
            if (!drug || drug.length == 0) {
                return drug.bulkCreate([
                    {
                        name: 'Ibuproffen',
                        description: 'Cures head ache and other problems!'
                    },
                    {
                        name: 'L-teroxin',
                        description: 'Cures thyroid problems.'
                    }
                ]).then(() => {
                    return drug.findAll();
                });
            } else {
                return drugs;
            }
        }).then(drugs => {
            allDrugs = drugs;
            return drug.findAll();
        }).then(() => {
            return prescription.findAll();
        }).then(presc => {
            if (!presc || presc == 0) {
                return prescription.bulkCreate([
                    {
                        drug_id: allDrugs[0].id,
                        doctor_id: allDoctors[0].id,
                        patient_id: allPatients[0].id,
                        dateOfPrescription: '2021-11-16',
                        note: '50mg 3 times daily after wake-up',
                        dosage: '200'
                    },
                    {
                        drug_id: allDrugs[1].id,
                        doctor_id: allDoctors[0].id,
                        patient_id: allPatients[0].id,
                        dateOfPrescription: '2021-11-16',
                        note: '100mg one time daily after wake-up',
                        dosage: '100'
                    }
                ]);
            } else {
                return presc;
            }
        });
};

