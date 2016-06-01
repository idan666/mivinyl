'use strict';

var scrapers = {};

scrapers['pinterest'] = require('./scrapers/pinterest.js');
// scrapers['instagram'] = require('./scrapers/instagram.js');

// scrape method

exports.scrape = function (req, res){
  var url = req.body.url; // url from user
  var scraperToUse;
  
  if(url.indexOf('pinterest') > -1){
    scraperToUse = 'pinterest';
  } else { // add if for instagram
    console.log('cannot locate scraper');
  }
  
  scrapers[scraperToUse].list(url, function(data){
    console.log('data from scraper');
    res.json(data); //send data for client side
  });//url from client
}
