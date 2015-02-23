var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model('Post', {
  type: String,
  text: String,
  threadId: schema.ObjectId
});
