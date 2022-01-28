const Sequelize = require('sequelize');
const sequelize = require('../../config/sequelize/sequelize');

const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(8);

const person = sequelize.define('person', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [2, 50],
                msg: "r_2_50"
            }
        }
    },
    middleName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [2, 50],
                msg: "r_2_50"
            }
        }
    },
    dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
            isDate: {
                args: true,
                msg: "d"
            }
        }
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [2, 50],
                msg: "r_2_50"
            }

        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
            args: true,
            msg: "e"
        },
        validate: {
            isEmail: {
                args: true,
                msg: "ne"
            },
            len: {
                args: [2, 50],
                msg: "r_2_50"
            },
            notEmpty: {
                msg: "r"
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [1, 255],
                msg: 'r_1_255'
            },
            notEmpty: {
                msg: 'r'
            }
        },
        defaultValue: bcrypt.hashSync('pwd123', salt)
    },
    role: {
        type: Sequelize.STRING, 
        allowNull: true,
        defaultValue: "user"
    }
});

module.exports = person;