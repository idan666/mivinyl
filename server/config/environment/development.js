'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options 'mongodb://localhost/meanApp-dev'
  mongo: {
    uri: 'mongodb://idan_admin:kOOch890@ds011903.mlab.com:11903/myvinylsdb'
    //TESTING A SANDBOX DB
    // uri: 'mongodb://heroku_0cgfvq9z:grrva1q30nqvlqd1edss435sa5@ds021333.mlab.com:21333/heroku_0cgfvq9z'
  },

  seedDB: true
};
