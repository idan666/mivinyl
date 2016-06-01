'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VinylSchema = new Schema({
  image: String,
  linkUrl: String,
  title: String,
  description: String,
  tags: [{
    type: String
  }],
  _creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  email: String,
  userName: String,
  createTime:{
    type:Date,
    'default': Date.now
  },
  views: {
    type:Number,
    'default':0
  },
  upVotes: {
    type: Number,
    'default': 0
  }
});

module.exports = mongoose.model('Vinyl', VinylSchema);