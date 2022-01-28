const exp = require('express');
const rtr = exp.Router();
const ctr = require('../controllers/drugController');

rtr.get('/', ctr.showDrugList);
rtr.get('/add', ctr.showDrugForm);
rtr.get('/details/:id', ctr.showDrugDetails);
rtr.get('/edit/:id', ctr.showDrugEdit);
rtr.post('/add', ctr.addDrug);
rtr.post('/edit', ctr.updateDrug);
rtr.get('/delete/:id', ctr.deleteDrug);

module.exports = rtr;