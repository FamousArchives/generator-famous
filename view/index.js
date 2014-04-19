'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var metrics = require('famous-metrics');

var ViewGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Just give me a second to whip that up for you');
    this.filename = this.name.split('/');
    this.pkg = require('../package.json');

    if (_.isArray(this.filename)) {
      this.filename = this.filename[this.filename.length - 1];
    }
  },

  askFor: function () {
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
        metrics.track('yo famous:view', {
          packageName: this.pkg.name,
          packageVersion: this.pkg.version
        });
      }

      done();
    }.bind(this));
  },

  files: function () {
    this.template('EmptyView.js', 'app/src/views/' + this.name + '.js');
  }
});

module.exports = ViewGenerator;
