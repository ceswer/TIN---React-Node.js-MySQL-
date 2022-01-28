const exp = require('express');
const rtr = exp.Router();

const API = require('../../api/PrescriptionAPI');
const authMiddleware = require('../../middlewares/AuthMiddleware');
rtr.use(authMiddleware);

const adminAuth = require('../../middlewares/AdminAuthMiddleware');

rtr.get('/', adminAuth, API.getPresc_s);
rtr.get('/:id', adminAuth, API.getPrescById);
rtr.post('/', adminAuth, API.createPresc);
rtr.put('/:id', adminAuth, API.updatePresc);
rtr.delete('/:id', adminAuth, API.deletePresc);

const errorHandler = require("../../middlewares/ErrorHandler");
rtr.use(errorHandler);

module.exports = rtr;