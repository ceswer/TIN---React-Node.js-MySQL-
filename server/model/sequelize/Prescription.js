const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize/sequelize');

const prescription = sequelize.define('prescription', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    drug_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    },
    doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    },
    patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    },
    dateOfPrescription: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    },
    note: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            },
            len: {
                args: [2, 255],
                msg: "r_2_255"
            }
        }
    },
    dosage: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    }
});

module.exports = prescription;