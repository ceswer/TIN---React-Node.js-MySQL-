const exp = require('express');
const rtr = exp.Router();

const API = require('../../api/PatientAPI');
const authMiddleware = require('../../middlewares/AuthMiddleware');
rtr.use(authMiddleware);

const adminAuth = require('../../middlewares/AdminAuthMiddleware');

rtr.get('/', API.getPatients);
rtr.get('/:id', API.getPatientById);
rtr.post('/', API.createPatient);
rtr.put('/:id', API.updatePatient);
rtr.delete('/:id', adminAuth, API.deletePatient);

const errorHandler = require("../../middlewares/ErrorHandler");
rtr.use(errorHandler);

module.exports = rtr;