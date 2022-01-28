const Sequelize = require('sequelize');
const sequelize = require('../..//config/sequelize/sequelize');

const patient = sequelize.define('patient', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    person_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    dateOfRegistration: {
        type: Sequelize.DATE,
        allowNull: true
    },
    phoneNumber: {
        type: Sequelize.INTEGER,
        unique: true,
        allowNull: true,
        validate: {
            len: {
                args: [4, 10],
                msg: "r_4_10"
            },
            isInt: {
                args: true,
                msg: "n"
            }
        }
    },
    
});

module.exports = patient;