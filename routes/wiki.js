var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;
var Promise = require('bluebird');

router.get('/', function (req, res) {
  res.redirect('/wiki/');
})

router.get('/wiki/', function(req, res){
  Page.findAll().then(function (data) {
    res.render('index', {pages: dataVals(data)})
  })
});



router.post('/wiki/', function(req, res, next){
  console.log(req.body);
  User.findOrCreate({
  where: {
    name: req.body.name,
    email: req.body.email
  }
})
.then(function (values) {
  var user = values[0];

  var page = Page.build({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags.split(" ")
  });

  return page.save().then(function (page) {
    return page.setAuthor(user);
  });

})
.then(function (page) {
  res.redirect(page.route);
})
.catch(next);

});



router.get('/wiki/add/', function(req, res){
  res.render('addpage');
});

router.get('/users/', function(req, res){
  User.findAll().then(function (data) {
    res.render('users', {title: 'Users',users: dataVals(data)});
  });
})

router.get('/user/:id/', function(req, res){
  Promise.all([User.findAll({where: {id: req.params.id}}), Page.findAll({where: {authorId: req.params.id}})])
    .then(function(data){
      res.render('users', {title: data[0][0].dataValues.name, posts: dataVals(data[1])})
    })
})

router.get('/wiki/:url/', function(req, res){
  Page.findAll( {
    where: {
      urlTitle: req.params.url
    }
  }).then(function (pages) {
    // var gettingAuthor = pages[0].getAuthor();
    // var combiningPagesAndUser = gettingAuthor.then(function(user){
    //   return [pages, user]
    // }).then(function(arr){
    //   return arr 1
    // })
    // return combiningPagesAndUser;
    return pages[0].getAuthor().then(function(user){
      return [pages, user];
    });
  }).spread(function(pages, user){
    res.render('wikipage', {page: pages[0], user: user, tags: pages[0].tags});
  });

});





module.exports = router;


function dataVals (arr) {
  var resultArr = [];
  arr.forEach(function (index) {
    resultArr.push(index.dataValues);
  });
  return resultArr;
}
