var express = require('express');
var load = require('express-load');

module.exports = function(){

    var app = express();
    load('controllers').into(app);
    return app;
}
