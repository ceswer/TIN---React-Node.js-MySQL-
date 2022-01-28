const sequelize = require('sequelize');
const configSeq = require('../../config/sequelize/sequelize');

const doctor = configSeq.define('doctor', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    person_id: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    position: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            },
            len: {
                args: [2, 50],
                msg: "r_2_50"
            }
        }
    },
    dateOfAcceptance: {
        type: sequelize.DATE,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            }
        }
    }
});

module.exports = doctor;