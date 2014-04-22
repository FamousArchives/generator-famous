/*
    Inspired by https://github.com/assemble/generator-assemble/
    which is released under an MIT license
*/

'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var shell = require('shelljs');
var updateNotifier = require('update-notifier');
var metrics = require('famous-metrics');

var FamousGenerator = yeoman.generators.Base.extend({
  init: function () {
    var notifier = updateNotifier({
      packagePath: '../package.json',
      updateCheckInterval: 1
    });

    this.pkg = require('../package.json');

    /* This is unneccessary and gross... but stops you from having to update twice */
    if (notifier.update) {
      if (notifier.update.latest !== this.pkg.version) {
        notifier.notify();
        process.exit(1);
      }
    }
    if (!shell.which('git')) {
      this.log(chalk.red('(ERROR)') + ' It looks like you do not have git installed, please install it and try again.');
      process.exit(1);
    }
    
    this.description = this.pkg.description;

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
          skipMessage: this.options['skip-welcome-message'] || this.options['w'],
          callback: function () {
            console.log('');
            console.log(chalk.green('Woot!') + ' It appears that everything installed correctly.');
            console.log('Please run the command ' + chalk.yellow('grunt serve') + ' to launch the development server.');
            console.log('');
          }
        });
      }
    });

    this.config.defaults({
      projectName: 'Famo.us Base',
      projectDesc: 'e.g. Seed project to get started with Famo.us',
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

    if (metrics.getTinfoil() === null) {
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

      if (metrics.getTinfoil() === null) {
        if (answers.noTinfoil) {
          metrics.setTinfoil(this.authorEmail, function (err) {
            if (err) {
              return console.error('Failed to write ~/.famousrc');
            }
            metrics.track('initialization', {
              packageName: this.pkg.name,
              packageVersion: this.pkg.version,
              type: 'yo famous'
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
        metrics.track('yo famous', {
          packageName: this.pkg.name,
          packageVersion: this.pkg.version
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

    this.src.copy('images/_famous_logo.png', 'app/content/images/famous_logo.png');

    this.copy('styles/app.css', 'app/styles/app.css');

    this.template('src/requireConfig.js', 'app/src/requireConfig.js');
    this.template('src/_main.js', 'app/src/main.js');
  },

  manifests: function () {
    if (metrics.getTinfoil()) {
      this.copy('_package_tinfoil.json', 'package.json');
    }
    else {
      this.copy('_package.json', 'package.json');
    }
    this.copy('_bower.json', 'bower.json');
    this.copy('Gruntfile.js', 'Gruntfile.js');
  },

  dotfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('eslint.json', '.eslintrc');
    this.copy('jscs.json', '.jscsrc');
    this.copy('gitignore', '.gitignore');
    this.copy('travis.yml', '.travis.yml');
  },

  gruntfiles: function () {
    this.mkdir('grunt');

    if (metrics.getTinfoil()) {
      this.src.copy('grunt/aliases_tinfoil.js', 'grunt/aliases.js');
    }
    else {
      this.src.copy('grunt/aliases.js', 'grunt/aliases.js');
    }

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
