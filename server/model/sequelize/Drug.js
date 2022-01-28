const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize/sequelize');

const drug = sequelize.define('drug', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
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
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "r"
            },
            len: {
                args: [2, 255],
                msg: "r_2_50"
            }
        }
    }
});

module.exports = drug;