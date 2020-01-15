const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const branchSchema = new Schema({
  // Refs
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: [true, 'User Id is necessary'],
  },
  branchName: {
    type: String,
    required: [true, 'Name is necessary'],
  },
  branchAddress: {
    type: String,
    require: [true, 'Address is necessary'],
  },
}, {collection: 'branches'});

module.exports = mongoose.model('Branch', branchSchema);
