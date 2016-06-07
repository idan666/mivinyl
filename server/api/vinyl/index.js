'use strict';

var controller = require('./vinyl.controller');
var express = require('express');
var router = express.Router();
var auth = require('../../auth/auth.service');

//SCRAPING NEW LOOK
router.post('/scrapeUpload', auth.isAuthenticated(), controller.scrapeUpload);
//FILE HANDLING MULTER
router.post('/upload', auth.isAuthenticated(), controller.upload);



//update look
router.put('/:id', auth.isAuthenticated(), controller.update);
//Adding Up Votes
router.put('/upvote/:id', auth.isAuthenticated(), controller.addUpvote);
//Adding Views to Vinyls - Add even when not logged in
router.put('/view/:id', controller.addView);

//Get all Vinyls from user
router.get('/getAllVinyls', controller.allVinyls);
//Get User Vinyls
router.get('/getUserVinyls', controller.userVinyls);
//Get Single Vinyl
router.get('/:vinylId', controller.singleVinyl);
//Get Popular Vinyls
router.get('/popVinyls/:id', controller.popVinyls);

//Delete Single Vinyl
router.delete('/:id', controller.delete);
//
module.exports = router;