const exp = require('express');
const rtr = exp.Router();

const API = require('../../api/DoctorAPI');
const authMiddleware = require('../../middlewares/AuthMiddleware');
rtr.use(authMiddleware);

const adminAuth = require('../../middlewares/AdminAuthMiddleware');

rtr.get('/', API.getDoctors);
rtr.get('/:id', API.getDoctorById);
rtr.post('/', adminAuth, API.createDoctor);
rtr.put('/:id', adminAuth, API.updateDoctor);
rtr.delete('/:id', adminAuth, API.deleteDoctor);

const errorHandler = require("../../middlewares/ErrorHandler");
rtr.use(errorHandler);


module.exports = rtr;