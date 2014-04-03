'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var ViewGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Just give me a second to whip that up for you');
  },

  files: function () {
    this.template('EmptyView.js', 'app/src/views/' + this.name + '.js');
  }
});

module.exports = ViewGenerator;