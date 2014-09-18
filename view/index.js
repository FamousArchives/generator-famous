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

    if (!process.env.FAMOUS_TRACKING && metrics.getTracking() === null) {
      questions.push({
        type : 'confirm',
        name : 'tracking',
        message : chalk.green('(optional)') + ' Do you agree to our Terms of Service (https://famo.us/terms) and our Privacy Policy (http://famo.us/privacy)?',
        default : true
      });
    }

    this.prompt(questions, function (answers) {
      if (metrics.getTracking() === null) {
        if (answers.tracking) {
          metrics.setTracking(this.authorEmail, function (err) {
            if (err) {
              return console.error('Failed to write ~/.famousrc');
            }
            metrics.track('initialization', {
              packageName: this.pkg.name,
              packageVersion: this.pkg.version,
              type: 'yo famous'
            }, function () {
              
            });
          }.bind(this));
        }
        else {
          metrics.setTracking(false, function (err) {
            if (err) {
              return console.error('Failed to write ~/.famousrc');
            }
          });
        }
      }
      
      if (metrics.getTracking()) {
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
