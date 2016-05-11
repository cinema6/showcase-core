'use strict';

var Jasmine = require('jasmine');
var config = require('../test/jasmine.conf.json');

var jasmine = new Jasmine();

jasmine.loadConfig(config);

require('babel-register');
jasmine.execute();
