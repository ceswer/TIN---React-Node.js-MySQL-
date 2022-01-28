const person = require('../../model/sequelize/Person');
const prescription = require('../../model/sequelize/Prescription');
const doctor = require('../../model/sequelize/Doctor');
const opinion = require('../../model/sequelize/Opinion');
const patient = require('../../model/sequelize/Patient')

exports.getDoctors = async () => {
    return doctor.findAll({
        include: {
            model: person,
            as: 'person'
        }
    });
};

exports.getDoctorById = async (id) => {
    return doctor.findByPk(id, {
        include: [{ model: person, as: 'person' }, { model: prescription, as: 'prescriptions' },
            { model: opinion, as: 'opinions', include: { model: patient, as: 'patient', include: { model: person, as: 'person'}}}]
    });
};

exports.createDoctor = async (doc) => {
    const [pers, exists] = await person.findOrCreate({
        where: {
            email: doc.email
        },
        defaults: {
            name: doc.name,
            middleName: doc.middleName,
            surname: doc.surname,
            dateOfBirth: doc.dateOfBirth,
            address: doc.address,
            role: 'doctor'
        }
    });

    return doctor.create({
        person_id: pers.id,
        position: doc.position,
        dateOfAcceptance: doc.dateOfAcceptance
    });
};

exports.updateDoctor = async (id, doc) => {
    const foundDoctor = await doctor.findByPk(id);

    await person.update(
        {
            name: doc.name,
            middleName: doc.middleName,
            surname: doc.surname,
            dateOfBirth: doc.dateOfBirth,
            address: doc.address,
            email: doc.email,
            role: 'doctor'
        },
        {
            where: { id: foundDoctor.person_id }
        }
    );

    await foundDoctor.update({
        position: doc.position,
        dateOfAcceptance: doc.dateOfAcceptance
    });

    return doctor.findByPk(id, { include: { model: person, as: 'person' } });
};

exports.deleteDoctor = (id) => {
    return doctor.destroy({
        where: { id: id }
    });
};