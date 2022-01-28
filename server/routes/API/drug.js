const exp = require('express');
const rtr = exp.Router();

const API = require('../../api/DrugAPI');
const authMiddleware = require('../../middlewares/AuthMiddleware');
rtr.use(authMiddleware);

const adminAuth = require('../../middlewares/AdminAuthMiddleware');

rtr.get('/', API.getDrugs);
rtr.get('/:id', API.getDrugById);
rtr.post('/', adminAuth, API.createDrug);
rtr.put('/:id', adminAuth, API.updateDrug);
rtr.delete('/:id', adminAuth, API.deleteDrug);

const errorHandler = require("../../middlewares/ErrorHandler");
rtr.use(errorHandler);

module.exports = rtr;
