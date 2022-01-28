const exp = require('express');
const rtr = exp.Router();
const ctr = require('../controllers/prescriptionController');

rtr.get('/', ctr.showPrescriptionList);
rtr.get('/add', ctr.showPrescriptionForm);
rtr.get('/details/:id', ctr.showPrescriptionDetails);
rtr.get('/edit/:id', ctr.showPrescriptionEdit);
rtr.post('/add', ctr.create);
rtr.post('/edit', ctr.update);
rtr.get('/delete/:id', ctr.delete);

module.exports = rtr;