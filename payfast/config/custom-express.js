var express = require('express');
var load = require('express-load');

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function(){

    var app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    load('controllers').then('persistencia').into(app);





    return app;
}
