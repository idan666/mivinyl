'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    author: {
        id: {
            type: Schema.ObjectId,
            ref: 'User' // Reference to the User Schema
        },
        name: {
            type: String,
        },
        email: {
          type: String
        }
    },
    vinylId: {
      type: Schema.ObjectId,
      ref: 'Vinyl'
    },
    gravatar: {
      type: String
    },
    comment: {
      type: String,
      trim: true
    },
    createTime: {
      type: Date,
      'default': Date.now
    }

});

module.exports = mongoose.model('Comment', CommentSchema);