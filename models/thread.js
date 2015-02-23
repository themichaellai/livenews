var mongoose = require('mongoose');

module.exports = mongoose.model('Thread', {
  name: String,
  description: String
});
