const exp = require('express');
const rtr = exp.Router();
const ctr = require('../controllers/doctorController');

const errorHandler = require("../middlewares/ErrorHandler");

rtr.get('/', ctr.showDoctorList);
rtr.get('/add', ctr.showDoctorForm);
rtr.get('/details/:id', ctr.showDoctorDetails);
rtr.get('/edit/:id', ctr.showDoctoreEdit);
rtr.post('/add', ctr.addDoctor);
rtr.post('/edit', ctr.updateDoctor);
rtr.get('/delete/:id', ctr.deleteDoctor);

rtr.use(errorHandler);

module.exports = rtr;