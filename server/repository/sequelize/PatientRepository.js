const person = require('../../model/sequelize/Person');
const patient = require('../../model/sequelize/Patient');
const drug = require('../../model/sequelize/Drug');
const prescription = require('../../model/sequelize/Prescription');
const doctor = require('../../model/sequelize/Doctor');

exports.getPatient = async () => {
    return patient.findAll({
        include:
            { model: person, as: 'person' }
    });
};

exports.getPatientById = async (id) => {
    return patient.findByPk(id, {
        include: [
            {
                model: person,
                as: 'person'
            },
            {
                model: prescription,
                as: 'prescriptions'
            }]
    });
};

exports.createPatient = async (pat) => {
    const [pers, exists] = await person.findOrCreate({
        where: {
            email: pat.email
        },
        defaults: {
            name: pat.name,
            middleName: pat.middleName,
            surname: pat.surname,
            dateOfBirth: pat.dateOfBirth,
            address: pat.address
        }
    });

    return patient.create({
        person_id: pers.id,
        dateOfRegistration: pat.dateOfRegistration,
        phoneNumber: pat.phoneNumber
    });
};

exports.updatePatient = async (id, pat) => {
    const foundPatient = await patient.findByPk(id);

    await person.update(
        {
            name: pat.name,
            middleName: pat.middleName,
            surname: pat.surname,
            dateOfBirth: pat.dateOfBirth,
            address: pat.address,
            email: pat.email
        },
        {
            where: { id: foundPatient.person_id }
        }
    );

    await foundPatient.update({
        dateOfRegistration: pat.dateOfRegistration,
        phoneNumber: pat.phoneNumber
    });

    return patient.findByPk(id, { include: { model: person, as: 'person' } });
};

exports.deletePatient = (id) => {
    return patient.destroy({
        where: { id: id }
    });
}