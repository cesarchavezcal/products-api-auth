const express = require('express');

const app = express();

const Product = require('../models/models.product');

const Category = require('../models/models.category');

const User = require('./../models/models.user');

const Branch = require('./../models/models.branch');


//===============
// Busqueda por colección
//===============

app.get('/collection/:table/:search', (req, res) => {
  let table = req.params.table;
  let search = req.params.search;
  let regex = new RegExp(search, 'i');

  var promise;

  switch(table) {
    case 'products':
      promise = searchProducts(search, regex);
      break;
      default:
        return;
  }

  if(table === 'products') {
    Promise.all([
      searchProducts(search, regex)
    ]).then(responses => {
      res.status(200).json({
        ok: true,
        products: responses,
      })
    })
  }
})

  // Promise.all([
  //   searchCategories(search, regex),
  //   searchUsers(search, regex),
  //   searchBranches(search, regex)])
  //   .then(responses => {
  //     res.status(200).json({
  //       ok: true,
  //       products: responses[0],
  //       categories: responses[1],
  //       users: responses[2],
  //       branches: responses[3],
  //     });
  //   }
  // );


//===============
// Busqueda General
//===============

app.get('/all/:search', (req, res, next) => {
  let search = req.params.search;
  let regex = new RegExp(search, 'i');

  Promise.all([
    searchProducts(search, regex),
    searchCategories(search, regex),
    searchUsers(search, regex),
    searchBranches(search, regex)])
    .then(responses => {
      res.status(200).json({
        ok: true,
        products: responses[0],
        categories: responses[1],
        users: responses[2],
        branches: responses[3],
      });
    }
  );

});


function searchUsers(search, regex) {
  return new Promise( (resolve, reject ) => {
    User.find({}, 'name email role')
    .or([{'name': regex}, {'email': regex}])
    .exec((err, users) => {

      if(err) {
        reject(`Error searching users ${err}`);
      } else {
        resolve( users );
      }

    })
  });
};


function searchProducts(search, regex) {
  return new Promise( (resolve, reject ) => {
    Product.find({productName: regex}).populate('user', 'name email')
    .populate('productCategory', 'categoryName')
    .populate('branch', 'branchName branchAddress').exec((err, products) => {

      if(err) {

        reject(`Error searching products ${err}`);

      } else {

        resolve(products);

      }

    });
  });
};

function searchCategories(search, regex) {
  return new Promise( (resolve, reject ) => {
    Category.find({categoryName: regex}).populate('user', 'name email')
    .exec( (err, categories) => {

      if(err) {

        reject(`Error searching categories ${err}`);

      } else {

        resolve(categories);

      }

    });
  });
};

function searchBranches(search, regex) {
  return new Promise( (resolve, reject ) => {
    Branch.find({branchName: regex}).populate('user', 'name email')
    .exec( (err, branches) => {

      if(err) {

        reject(`Error searching branches ${err}`);

      } else {

        resolve(branches);

      }

    });
  });
};

module.exports = app;
