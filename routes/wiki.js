var express = require('express');
var router = express.Router();


router.get('/', function(req, res){
  res.render('index');
});

router.post('/', function(req, res){
  res.send('post worked');
});

router.get('/add/', function(req, res){
  res.render('addpage');
});



module.exports = router;
