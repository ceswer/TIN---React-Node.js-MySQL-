const person = require('../../model/sequelize/Person');
const patient = require('../../model/sequelize/Patient');
const drug = require('../../model/sequelize/Drug');
const prescription = require('../../model/sequelize/Prescription');
const doctor = require('../../model/sequelize/Doctor');

exports.getPrescriptions = async () => {
    return prescription.findAll({
        include: [
            {
                model: patient,
                as: 'patient',
                include: {
                    model: person,
                    as: 'person'
                }
            },
            {
                model: doctor,
                as: 'doctor',
                include: {
                    model: person,
                    as: 'person'
                }
            },
            {
                model: drug,
                as: 'drug'
            }
        ]
    });
};

exports.getPrescriptionById = async (id) => {
    return prescription.findByPk(id, {
        include: [
            {
                model: patient,
                as: 'patient',
                include: {
                    model: person,
                    as: 'person'
                }
            },
            {
                model: doctor,
                as: 'doctor',
                include: {
                    model: person,
                    as: 'person'
                }
            },
            {
                model: drug,
                as: 'drug'
            }
        ]
    });
};

exports.createPrescription = async (presc) => {
    return prescription.create({
        drug_id: presc.drug_id,
        doctor_id: presc.doctor_id,
        patient_id: presc.patient_id,
        dateOfPrescription: presc.dateOfPrescription,
        note: presc.note,
        dosage: presc.dosage
    });
};

exports.updatePrescription = async (id, date) => {
    return prescription.update(date, { where: { id: id } });
};

exports.deletePrescription = async (id) => {
    return prescription.destroy({
        where: { id: id }
    });
};

exports.deleteManyPrescriptions = async (ids) => {
    return prescription.find({ id: { [Sequelize.Op.in]: ids } });
};