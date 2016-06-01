'use strict';

var _ = require('lodash');
var Vinyl = require('./vinyl.model');
var path = require('path');
var utils = require('../../utils/utils.js');

exports.allVinyls = function(req, res) {
    //mongoose api - find function
    Vinyl.find({})
        .sort({
            createTime: -1
        })
        .exec(function(err, vinyls) {
            if (err) {
                return handleError(res, err);
            }
            if (!vinyls) {
                return res.sendStatus(404);
            }
            console.log(vinyls);
            return res.status(200)
                .json(vinyls);
        });
}

exports.userVinyls = function(req, res) {
    var userEmail = req.query.email;
    Vinyl.find({
        email: {
            $in: userEmail
        }
    })
    .sort({
        createTime: -1
    })
    .exec(function(err, vinyls){
        if (err) {
            return handleError(res, err);//
        }
        console.log(vinyls);
        return res.status(200)
                    .json(vinyls);
    });
}

exports.scrapeUpload = function(req, res) {
    var random = utils.randomizer(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

    utils.downloadURI(req.body.image, './client/assets/images/uploads/' + random + '.jpg', function(filename) {
        console.log('done');

        //Into the database

        var newVinyl = new Vinyl();
        newVinyl.title = req.body.title;
        newVinyl.email = req.body.email;
        newVinyl.linkURL = req.body.linkURL;
        newVinyl.description = req.body.description;
        newVinyl.userName = req.body.name;
        newVinyl._creator = req.body._creator;
        newVinyl.createTime = Date.now();
        newVinyl.upVotes = 0;
        newVinyl.image = filename.slice(9);

        //mongoose method - save to database
        newVinyl.save(function(err, item) {
            if (err) {
                console.log('error occured saving image');
            } else {
                console.log('Success post saved');
                console.log(item);
                res.status(200)
                    .json(item);
            }
        });
    });
}
//
exports.upload = function(req, res) {
    var newVinyl = new Vinyl();
    var fileimage = req.middlewareStorage.fileimage;

    newVinyl.image = '/assets/images/uploads/' + fileimage;
    newVinyl.email = req.body.email;
    newVinyl.linkURL = req.body.linkURL;
    newVinyl.title = req.body.title;
    newVinyl.description = req.body.description;
    newVinyl.userName = req.body.userName;
    newVinyl._creator = req.body._creator;
    newVinyl.createTime = Date.now();
    newVinyl.upVotes = 0;

    //mongoose method - save to database
    newVinyl.save(function(err, item) {
        if (err) {
            console.log('error occured saving image');
        } else {
            console.log('Success post saved');
            console.log(item);
            res.status(200)
                .json(item);
        }
    });
};

exports.singleVinyl = function(req, res){
    Vinyl.findById(req.params.vinylId, function(err, vinyl){
        if(err){
            return handleError(res, err);
        }
        if(!vinyl){
            return res.sendStatus(404);
        }
        return res.json(vinyl)
    });
};

exports.popVinyls = function(req, res){
    Vinyl.find(req.params.id)
        .sort('-upVotes')
        .limit(6)
        .exec(function(err, vinyls){
            if(err){
                return handleError(res, err);
            }
            console.log(vinyls);
            return res.json(vinyls);
        });
}

exports.update = function(req, res){
    if(req.body._id){
        delete req.body._id;
    }
    Vinyl.findById(req.params.id, function(err, vinyl){
        if(err){
            return handleError(res, err);
        }
        if(!vinyl){
            return res.sendStatus(404);
        }

        var updated = _.merge(vinyl, req.body); // save new title for our look
        updated.save(function(err){
            if(err){
                return handleError(res, err);
            }
            console.log(vinyl);
            return res.json(vinyl);
        });
    });
};

exports.delete = function(req, res){
    Vinyl.findById(req.params.id, function(err, vinyl){
        if(err){
            return handleError(res, err);
        }
        if(!vinyl){
            return res.sendStatus(404);
        }
        vinyl.remove(function(err){
            if(err){
                return handleError(res, err);
            }
            return res.sendStatus(200);
        });
    });
}

exports.addView = function(req, res){
    Vinyl.findById(req.params.id, function(err, vinyl){
        if(err){
            return handleError(res, err);
        }
        if(!vinyl){
            return res.send(404);
        }
        vinyl.views++;
        vinyl.save(function(err){
            if(err){
                return handleError(res, err);
            }
            return res.json(vinyl);
        });
    });
}

exports.addUpvote = function(req, res){
    Vinyl.findById(req.params.id, function(err, vinyl){
        if(err){
            return handleError(res, err);
        }
        if(!vinyl){
            return res.send(404);
        }
        vinyl.upVotes++;
        vinyl.save(function(err){
            if(err){
                return handleError(res, err);
            }
            return res.json(vinyl);
        })
    });
}

function handleError(res, err) {
    return res.sendStatus(500, err);
}