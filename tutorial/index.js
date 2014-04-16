'use strict';
// var util = require('util');
var yeoman = require('yeoman-generator');


var TutorialGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Setting up the ' + this.name + ' tutorial.');
  },

  download: function () {
    this.extract('https://github.com/Famous/tutorial-' + this.name + '/archive/master.zip', '', function () {
      this.installDependencies();
    }.bind(this));
  }
});

module.exports = TutorialGenerator;