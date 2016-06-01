'use strict'

var controller = require('./comment.controller');
var express = require('express');
var router = express.Router();

router.post('/', controller.addComment);
router.get('/:id', controller.getComments);

module.exports = router;