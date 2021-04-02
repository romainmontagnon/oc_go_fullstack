const express = require('express');
const router = express.Router();

const stuffControl = require('../controllers/stuff');

router.post('/', stuffControl.createThing);
router.put('/:id', stuffControl.modifyThing);
router.delete('/:id', stuffControl.deleteThing);
router.get('/:id', stuffControl.getOneThing);
router.get('/' +'', stuffControl.getAllThings);

module.exports = router;