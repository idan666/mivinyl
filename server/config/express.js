/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = function(app) {
    // var env = app.get('env');
    var env = 'development';

    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(multer({
        dest: './client/assets/images/uploads/',
        rename: function(fieldname, filename) {
            return filename + Date.now();
        },
        onFileUploadStart: function(file) {
            console.log(file.originalname + ' is starting...');
        },
        onFileUploadComplete: function(file, req, res) {
            console.log(file.fieldname + ' uploaded to ' + file.path);
            var fileimage = file.name;
            req.middlewareStorage = {
                filepath: file.path,
                fileimage: fileimage
            }
        }
    }));

    app.use(cookieParser());
    app.use(passport.initialize());

    // Persist sessions with mongoStore
    // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
    app.use(session({
        secret: config.secrets.session,
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    if ('production' === env) {
        app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        app.use(express.static(path.join(config.root, 'public')));
        app.set('appPath', config.root + '/public');
        app.use(morgan('dev'));
    }

    if ('development' === env || 'test' === env) {
        // app.use(require('connect-livereload')());
        app.use(express.static(path.join(config.root, '.tmp')));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', 'client');
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
};