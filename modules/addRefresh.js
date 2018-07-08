var RefreshToken       = require('../models/refresh.model');
const mongoose = require('mongoose');

var insert_refresh = function(username, refreshToken){

  const refresh = new RefreshToken({
    username: username,
    refresh: refreshToken
  });

  refresh.save()
  .then(result => {
    console.log("Refresh Token created");
  })
  .catch(err => {
    console.log(err);
  });
};



module.exports.insert_refresh = insert_refresh;
