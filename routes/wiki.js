var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res){
  Page.findAll().then(function (data) {
    console.log(dataVals(data));
    res.render('index', {pages: dataVals(data)})
  })
});

router.post('/', function(req, res){
  var page = Page.build({
    title: req.body.title,
    content: req.body.content,
    status: req.body.status
  });

  var user = User.build({
    name: req.body.name,
    email: req.body.email
  });

  page.save()
    .then(function(data){
      res.redirect(data.route);
    })
    .catch(function(err){
      console.error(err);
    });
  user.save();
});

router.get('/add/', function(req, res){
  res.render('addpage');
});

router.get('/:url/', function(req, res){
  Page.findAll( {
    where: {
      urlTitle: req.params.url
    }
  }).then(function (data) {
    res.render('wikipage', {page: data[0].dataValues});
  })
});




module.exports = router;


function dataVals (arr) {
  var resultArr = [];
  arr.forEach(function (index) {
    resultArr.push(index.dataValues);
  });
  return resultArr;
}
