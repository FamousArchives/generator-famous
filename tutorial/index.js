'use strict';
// var util = require('util');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var mixpanel = require('mixpanel').init('1ca6a3146db8e6b46af00d0ce399260e ');
var crypto = require('crypto');
var shell = require('shelljs');
var rc = require('rc');
var osenv = require('osenv');

var TutorialGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    if (!shell.which('git')) {
      this.log(chalk.red('(ERROR)') + ' It looks like you do not have git installed, please install it and try again.');
      process.exit(1);
    }
    this.pkg = require('../package.json');
    this.description = this.pkg.description;
    this.home = osenv.home();
    this.rc = rc('famous', {
      unique_id: '',
      noTinfoil: null
    });
    
    console.log('Setting up the ' + this.name + ' tutorial.');
    this.path = 'https://github.com/Famous/tutorial-' + this.name + '/archive/master.zip';
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    if (!this.options['skip-welcome-message']) {
      this.log(this.yeoman);
      // replace it with a short and sweet description of your generator
      this.log(chalk.magenta('You\'re using the fantastic Famo.us generator.'));
    }

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

  download: function () {
    this.extract(this.path, process.cwd(), function (err) {
      if (err) {
        console.log(chalk.red('ERROR: ') + 'Ruhroh, the tutorial ' + this.name + ' does not seem to exist... please try again later');
      }
      else {
        if (this.noTinfoil) {
          this.unique_id = this.rc.unique_id;

          mixpanel.track('yo famous:tutorial', {
            distinct_id: this.unique_id,
            packageName: this.pkg.name,
            pacakgeVersion: this.pkg.version,
            tutorial: this.name
          });
        }

        if (!this.options['skip-install']) {
          this.installDependencies({
            skipInstall: this.options['skip-install'] || this.options['s'],
            skipMessage: this.options['skip-welcome-message'] || this.options['w']
          });
        }
      }
    }.bind(this));
  }
});

module.exports = TutorialGenerator;
