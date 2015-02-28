var mongoose = require('mongoose');
var schema = mongoose.Schema;

module.exports = mongoose.model('Post', {
  type: String,
  title: String,
  text: String,
  publishedAt: {
    type: Date,
    default: Date.now
  },
  imageFilename: String,
  threadId: schema.ObjectId
});
