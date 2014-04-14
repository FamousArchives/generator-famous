/*
    Inspired by https://github.com/assemble/generator-assemble/
    which is released under an MIT license
*/

'use strict';
var fs = require('fs');
// var util = require('util');
// var path = require('path');
var crypto = require('crypto');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var osenv = require('osenv');
var rc = require('rc');
var shell = require('shelljs');
var mixpanel = require('mixpanel').init('1ca6a3146db8e6b46af00d0ce399260e ');

var FamousGenerator = yeoman.generators.Base.extend({
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
        message : chalk.green('(optional)') + ' Do you agree to our Terms of Service (https://famo.us/terms) and our Privacy Policy (http://famo.us/privacy)?',
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

    this.copy('README.md', 'README.md');
    
    this.template('_index.html', 'app/index.html');

    this.bulkCopy('images/_famous_symbol_transparent.png', 'app/content/images/famous_symbol_transparent.png');

    this.copy('styles/app.css', 'app/styles/app.css');

    this.template('src/requireConfig.js', 'app/src/requireConfig.js');
    this.template('src/_main.js', 'app/src/main.js');
  },
  
  manifests: function () {
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  },

  dotfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('eslint.json', '.eslintrc');
    this.copy('jscs.json', '.jscsrc');
    this.copy('gitignore', '.gitignore');
  },

  gruntfiles: function () {
    this.mkdir('grunt');

    this.src.copy('grunt/aliases.js', 'grunt/aliases.js');
    this.src.copy('grunt/eslint.js', 'grunt/eslint.js');
    this.src.copy('grunt/jscs.js', 'grunt/jscs.js');
    this.src.copy('grunt/watch.js', 'grunt/watch.js');
    this.src.copy('grunt/connect.js', 'grunt/connect.js');
    this.src.copy('grunt/clean.js', 'grunt/clean.js');
    this.src.copy('grunt/bower.js', 'grunt/bower.js');
    this.src.copy('grunt/rev.js', 'grunt/rev.js');
    this.src.copy('grunt/processhtml.js', 'grunt/processhtml.js');
    this.src.copy('grunt/useminPrepare.js', 'grunt/useminPrepare.js');
    this.src.copy('grunt/usemin.js', 'grunt/usemin.js');
    this.src.copy('grunt/htmlmin.js', 'grunt/htmlmin.js');
    this.src.copy('grunt/copy.js', 'grunt/copy.js');
    this.src.copy('grunt/requirejs.js', 'grunt/requirejs.js');
  }
});

module.exports = FamousGenerator;