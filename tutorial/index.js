'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var shell = require('shelljs');
var metrics = require('famous-metrics');

var TutorialGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    if (!shell.which('git')) {
      this.log(chalk.red('(ERROR)') + ' It looks like you do not have git installed, please install it and try again.');
      process.exit(1);
    }
    this.pkg = require('../package.json');
    
    console.log('Setting up the ' + this.name + ' tutorial.');
    this.path = 'http://download.famo.us/tutorials/' + this.name + '.tar.gz';
  },
  metrics: function () {
    var done = this.async();

    var questions = [];

    if (metrics.getTinfoil() === null) {
      questions.push({
        type : 'confirm',
        name : 'noTinfoil',
        message : chalk.green('(optional)') + ' Do you agree to our Terms of Service (https://famo.us/terms) and our Privacy Policy (http://famo.us/privacy)?',
        default : true
      });
    }

    this.prompt(questions, function (answers) {
      if (metrics.getTinfoil() === null) {
        if (answers.noTinfoil) {
          metrics.setTinfoil(this.user.git.email, function (err) {
            if (err) {
              return console.error('Failed to write ~/.famousrc');
            }
            metrics.track('initialization', {
              packageName: this.pkg.name,
              packageVersion: this.pkg.version,
              type: 'yo famous:view'
            });
          }.bind(this));
        }
        else {
          metrics.setTinfoil(false, function (err) {
            if (err) {
              return console.error('Failed to write ~/.famousrc');
            }
          });
        }
      }

      if (!metrics.getTinfoil()) {
        metrics.track('yo famous:tutorial', {
          packageName: this.pkg.name,
          pacakgeVersion: this.pkg.version,
          tutorial: this.name
        });
      }

      done();
    }.bind(this));
  },
  download: function () {
    var done = this.async();
    this.extract(this.path, process.cwd() + '/app', function (err) {
      if (err) {
        console.log(chalk.red('ERROR: ') + 'Ruhroh, the tutorial ' + this.name + ' does not seem to exist... please try again later');
      }
      done();
    }.bind(this));
  }
});

module.exports = TutorialGenerator;
