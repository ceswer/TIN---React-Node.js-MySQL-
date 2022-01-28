const person = require('../../model/sequelize/Person');
const patient = require('../../model/sequelize/Patient');
const drug = require('../../model/sequelize/Drug');
const prescription = require('../../model/sequelize/Prescription');
const doctor = require('../../model/sequelize/Doctor');

exports.getDrugs = async () => {
    return drug.findAll();
};

exports.getDrugById = async (id) => {
    return drug.findByPk(id, {
        include: [{
            model: prescription,
            as: 'prescriptions'
        }]
    });
}

exports.createDrug = async (dr) => {
    return drug.create({
        name: dr.name,
        description: dr.description
    });
}

exports.updateDrug = async (id, dr) => {
    let foundDrug = await drug.findByPk(id);

    if (foundDrug != null)
        return drug.update(dr, { where: { id: id } });
    else throw new Error(`Drug with that id ${id} is not found!`);
};

exports.deleteDrug = async (id) => {
    return drug.destroy({
        where: { id: id }
    });
}

