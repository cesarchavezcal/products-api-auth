const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  // Refs
  user: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: [true, 'User Id is necessary'],
  },
  branch: {
    type: Schema.Types.ObjectId, ref: 'Branch',
    required: [true, 'Branch Id is necessary'],
  },
  // Locals
  productName: {
    type: String,
    required: [true, 'Product name is necessary'],
  },
  productPrice: {
    type: Number,
    required: [true, 'Product quantity is necessary'],
  },
  productCategory: {
    type: String,
    required: [true, 'Product category is necessary'],
  },
  productQuantity: {
    type: Number,
    required: [true],
    default: 1,
  },
  productBranch: {
    type: Number,
    required: [true],
    default: 1,
  },
}, {collection: 'users'});

module.exports = mongoose.model('Product', productSchema);
