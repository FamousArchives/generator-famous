'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');

var ViewGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Just give me a second to whip that up for you');
    this.filename = this.name.split('/');
    this.pkg = require('../package.json');

    if (_.isArray(this.filename)) {
      this.filename = this.filename[this.filename.length - 1];
    }
  },
  files: function () {
    this.template('EmptyView.js', 'app/src/views/' + this.name + '.js');
  }
});

module.exports = ViewGenerator;
