'use strict';
// var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var TutorialGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Setting up the ' + this.name + ' tutorial.');
    this.path = 'https://github.com/Famous/tutorial-' + this.name + '/archive/master.zip';
  },

  download: function () {
    this.extract(this.path, process.cwd(), function (err) {
      if (err) {
        console.log(chalk.red('ERROR: ') + 'Ruhroh, the tutorial ' + this.name + ' does not seem to exist... please try again later');
      }
      else {
        this.installDependencies();
      }
    }.bind(this));
  }
});

module.exports = TutorialGenerator;
