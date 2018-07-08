let mongoose = require('mongoose');
var log = require('./log');

const server = process.env.DB_USER + ':' + process.env.DB_PASS + '@ds261929.mlab.com:61929'; // DB SERVER
const database = 'client'; // YOUR DB NAME


class Database {
  constructor() {
    this._connect()
  }



  _connect() {
     mongoose.connect("mongodb://" + server + "/" + database)
       .then(() => {
         console.log('Connection to ' + database +  ' successful')
       })
       .catch(err => {
         console.error('Database connection error');
       })
  }

}

var checkCon = function() {
  return new Promise((resolve, reject) => {
    if(mongoose.connection.readyState){
      resolve();
    }else{
      reject('No database connection. please check with support');
    }
  });
};

module.exports = new Database()
module.exports.checkCon = checkCon;
