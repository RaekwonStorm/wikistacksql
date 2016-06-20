// 'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var wikiRouter = require('./routes/wiki');
var swig = require('swig');
var Models = require('./models');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.engine('html', swig.renderFile);
app.set('view engine','html');
app.set('views',__dirname+'/views/');
swig.setDefaults({ cache: false });

console.log("listening on port 3000");

app.use("/", function (req, res, next) {
  console.log(req.method, req.path);
  next();
});

app.use(express.static('public'));

app.use("/wiki", wikiRouter);

Models.Page.sync({force: true});
Models.User.sync();
app.listen(3000);
