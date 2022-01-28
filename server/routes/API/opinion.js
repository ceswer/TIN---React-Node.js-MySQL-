const express = require('express');
const router = express.Router();

const controller = require('../../api/OpinionAPI');

const auth = require('../../middlewares/AuthMiddleware');
router.use(auth);

const opinionAuth = require('../../middlewares/DeleteAuthMiddleware');

router.post('/', controller.addOpinion);
router.put('/:id', opinionAuth, controller.updateOpinion);
router.delete('/:id', opinionAuth, controller.deleteOpinion);

module.exports = router;