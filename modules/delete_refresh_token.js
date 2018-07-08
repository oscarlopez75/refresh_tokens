var RefreshToken       = require('../models/refresh.model');
const mongoose = require('mongoose');


var deleteReToken = function(username){
  return new Promise((resolve, reject) => {
    var query = {username: username};

    RefreshToken.remove(query)
      .exec()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        console.log(err);
        reject();
      })
  });
};


module.exports.deleteReToken = deleteReToken;
