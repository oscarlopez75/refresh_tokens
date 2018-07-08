var RefreshToken       = require('../models/refresh.model');
const mongoose = require('mongoose');


var checkReToken = function(username, refreshToken){
  return new Promise((resolve, reject) => {
    var query = {username: username, refresh: refreshToken};

    RefreshToken.find(query)
      .exec()
      .then((doc) => {
        if (doc.length > 0){
          resolve();
        }else {
          reject();
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      })
  });
}

var checkDuplicate = function(username){
  return new Promise((resolve, reject) => {
    var query = {username: username};

    RefreshToken.find(query)
      .exec()
      .then((doc) => {
        if (doc.length > 0){
          resolve(doc[0].refresh);
        }else {
          reject();
        }
      })
      .catch((err) => {
        console.log(err);
        reject();
      })
  });
}



module.exports.checkReToken = checkReToken;
module.exports.checkDuplicate = checkDuplicate;
