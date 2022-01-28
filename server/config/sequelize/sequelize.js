const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    'tin_sequelize',
    'root',
    'password',
    {
        dialect: 'mysql',
        host: 'localhost',
        logging: false
    }
);

module.exports = sequelize;