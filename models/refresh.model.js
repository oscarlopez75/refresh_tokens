const mongoose = require('mongoose');

const RefreshSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  refresh: {
    type: String,
    required: true,
  }
});




module.exports = mongoose.model('Refresh', RefreshSchema);
