var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;


router.get('/', function(req, res){
  res.redirect('/');
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
      res.redirect('/wiki/' + data.urlTitle);
    })
    .catch(function(err){
      console.error(err);
    });
  user.save();


});

router.get('/:url/', function(req, res){
  res.send('we made it')
});

router.get('/add/', function(req, res){
  res.render('addpage');
});



module.exports = router;
