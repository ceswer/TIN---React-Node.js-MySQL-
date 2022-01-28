const exp = require('express');
const rtr = exp.Router();
const ctr = require('../controllers/patientController');

rtr.get('/', ctr.showPatientList);
rtr.get('/add', ctr.showPatientForm);
rtr.get('/details/:id', ctr.showPatientDetails);
rtr.get('/edit/:id', ctr.showPatientEdit);
rtr.post('/add', ctr.createPatient);
rtr.post('/edit', ctr.updatePatient);
rtr.get('/delete/:id', ctr.deletePatient);

module.exports = rtr;