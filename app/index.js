/*
    Inspired by https://github.com/assemble/generator-assemble/
    which is released under an MIT license
*/

'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var crypto = require('crypto');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var osenv = require('osenv');
var rc = require('rc');
var mixpanel = require('mixpanel').init('be66bb0b0e7cfb155efbd750607b3ef4');

var FamousGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
    this.description = this.pkg.description;
    this.home = osenv.home();
    this.rc = rc('famous', {
      unique_id: '',
      noTinfoil: null
    });

    this.option('init', {
      alias: 'i',
      desc: 'Force to prompt question and re-initialize of .yo-rc.json',
      type: String,
      defaults: false,
      required: false
    });
    
    this.init = this.options['init'] || this.options['i'] || false;

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          skipInstall: this.options['skip-install'] || this.options['s'],
          skipMessage: this.options['skip-welcome-message'] || this.options['w']
        });
      }
    });

    this.config.defaults({
      projectName: 'Famo.us Base',
      projectDesc: 'Seed project to get started with Famo.us',
      authorLogin: '',
      author: {
        name: this.user.git.username || process.env.user || process.env.username,
        email: this.user.git.email
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    if (!this.options['skip-welcome-message']) {
      this.log(this.yeoman);
      // replace it with a short and sweet description of your generator
      this.log(chalk.magenta('You\'re using the fantastic Famo.us generator.'));
    }
    
    var force = false;

    if (!this.config.existed || this.init) {
      force = true;
    }

    var questions = [];
    
    if (!this.config.get('projectName') || force)  {
      questions.push({
        type : 'input',
        name : 'projectName',
        message : 'Your project name',
        default : this.appname || this.config.get('projectName')
      });
    }

    if (!this.config.get('projectDesc') || force) {
      questions.push({
        type : 'input',
        name : 'projectDesc',
        message : 'Your project description',
        default : this.config.get('projectDesc')
      });
    }

    if (!this.config.get('authorLogin') || force) {
      questions.push({
        type : 'input',
        name : 'authorLogin',
        message : 'Would you mind telling me your username on Github?',
        default : this.config.get('author').login || this.config.get('authorLogin')
      });
    }

    if (this.rc.noTinfoil === null) {
      questions.push({
        type : 'confirm',
        name : 'noTinfoil',
        message : 'Do you agree to our Terms of Service (https://famo.us/terms) and our Privacy Policy (http://famo.us/privacy)? ' + chalk.green('(optional)'),
        default : true
      });
    }

    this.prompt(questions, function (answers) {
      this.projectName = answers.projectName || this.config.get('projectName');
      this.projectDesc = answers.projectDesc || this.config.get('projectDesc');
      this.authorLogin = answers.authorLogin || this.config.get('authorLogin');
      
      this.authorName  = this.config.get('author').name;
      this.authorEmail = this.config.get('author').email;
      
      if (this.rc.noTinfoil === null) {
        this.rc.noTinfoil = answers.noTinfoil;
        if (this.rc.noTinfoil) {
          this.rc.unique_id = crypto.createHash('sha256').update(this.authorEmail).digest('base64');
          mixpanel.track('initialization', {
            distinct_id: this.rc.unique_id,
            packageName: this.pkg.name,
            pacakgeVersion: this.pkg.version
          });
        }
        fs.writeFile(this.home + '/.famousrc', JSON.stringify(this.rc));
      }

      this.noTinfoil = this.rc.noTinfoil;

      if (this.noTinfoil) {
        this.unique_id = this.rc.unique_id;

        mixpanel.track('yo famous', {
          distinct_id: this.unique_id,
          packageName: this.pkg.name,
          pacakgeVersion: this.pkg.version
        });
      }

      //save config to .yo-rc.json
      this.config.set(answers);

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/styles');
    this.mkdir('app/content');
    this.mkdir('app/content/images');
    this.mkdir('app/src');

    this.template('README.md', 'README.md');
    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.template('_index.html', 'app/index.html');
    
    this.copy('images/_famous_symbol_transparent.png', 'app/content/images/famous_symbol_transparent.png');
    
    this.copy('styles/_app.css', 'app/styles/app.css');
    
    this.template('src/_requireConfig.js', 'app/src/requireConfig.js');
    this.template('src/_main.js', 'app/src/main.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('eslint.json', '.eslintrc');
    this.copy('jscs.json', '.jscsrc');
    this.copy('gitignore', '.gitignore');
  }
});

module.exports = FamousGenerator;