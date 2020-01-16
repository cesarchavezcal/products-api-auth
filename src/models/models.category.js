const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  // Refs
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: [true, 'User Id is necessary'],
  },
  // Local
  categoryName: {
    type: String,
    required: [true, 'Category is required'],
  }
}, {collection: 'categories'});


module.exports = mongoose.model('Category', categorySchema);
