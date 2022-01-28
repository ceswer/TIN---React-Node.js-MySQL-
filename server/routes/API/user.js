const express = require('express');
const router = express.Router();

const controller = require('../../api/UserAPI');

router.post('/login', controller.login);
router.post('/signup', controller.signup);

const errorHandler = require('../../middlewares/ErrorHandler');
router.use(errorHandler);

module.exports = router;