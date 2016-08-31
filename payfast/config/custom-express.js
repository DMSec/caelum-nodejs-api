var express = require('express');
var load = require('express-load');
var morgan = require('morgan');
var logger = require('../persistencia/logger.js');

var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function(){

    var app = express();

    app.use(morgan("common",{
      stream: {
        write: function(message){
          logger.info(message)
        }
      }
    }));

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(expressValidator());

    load('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);





    return app;
}
