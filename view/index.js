'use strict';
// var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('lodash');
var mixpanel = require('mixpanel').init('1ca6a3146db8e6b46af00d0ce399260e ');
var crypto = require('crypto');
var rc = require('rc');
var osenv = require('osenv');

var ViewGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('Just give me a second to whip that up for you');
    this.filename = this.name.split('/');
    
    this.pkg = require('../package.json');
    
    this.home = osenv.home();
    this.rc = rc('famous', {
      unique_id: '',
      noTinfoil: null
    });
    
    if (_.isArray(this.filename)) {
      this.filename = this.filename[this.filename.length - 1];
    }
  },

  askFor: function () {
    var done = this.async();

    var questions = [];

    if (this.rc.noTinfoil === null) {
      questions.push({
        type : 'confirm',
        name : 'noTinfoil',
        message : chalk.green('(optional)') + ' Do you agree to our Terms of Service (https://famo.us/terms) and our Privacy Policy (http://famo.us/privacy)?',
        default : true
      });
    }

    this.prompt(questions, function (answers) {
      if (this.rc.noTinfoil === null) {
        this.rc.noTinfoil = answers.noTinfoil;
        if (this.rc.noTinfoil) {
          this.rc.unique_id = crypto.createHash('sha256').update(this.user.git.email).digest('base64');
          mixpanel.track('initialization', {
            distinct_id: this.rc.unique_id,
            packageName: this.pkg.name,
            pacakgeVersion: this.pkg.version,
            type: 'yo famous:tutorial ' + this.name
          });
        }
        fs.writeFile(this.home + '/.famousrc', JSON.stringify(this.rc));
      }

      this.noTinfoil = this.rc.noTinfoil;

      done();
    }.bind(this));
  },

  files: function () {
    
    if (this.noTinfoil) {
      this.unique_id = this.rc.unique_id;

      mixpanel.track('yo famous:view', {
        distinct_id: this.unique_id,
        packageName: this.pkg.name,
        pacakgeVersion: this.pkg.version
      });
    }

    this.template('EmptyView.js', 'app/src/views/' + this.name + '.js');
  }
});

module.exports = ViewGenerator;
