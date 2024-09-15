const express = require('express');
const router = express.Router();
const pollsController = require('../controllers/pollsController');


router.post('/add', pollsController.createPoll);

router.get('/all', pollsController.getAllPolls)
router.post('/address', pollsController.getAddressByName)
module.exports = router;