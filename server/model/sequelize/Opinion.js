const sequelize = require('sequelize');
const configSeq = require('../../config/sequelize/sequelize');

const opinion = configSeq.define('opinion', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    patient_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    },
    doctor_id: {
        type: sequelize.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    },
    text: {
        type: sequelize.STRING, 
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'r'
            }
        }
    }
});

module.exports = opinion;