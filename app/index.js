/*
    Inspired by https://github.com/assemble/generator-assemble/
    which is released under an MIT license
*/

'use strict';
var fs = require('fs');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var shell = require('shelljs');
var updateNotifier = require('update-notifier');
var metrics = require('famous-metrics');
var _ = require('lodash');

var FamousGenerator = yeoman.generators.Base.extend({
  init: function () {
    // Test to see if they are using an old version
    
    var notifier = updateNotifier({
      packagePath: '../package.json',
      updateCheckInterval: 1
    });
    
    // Function to replace .bowerrc after installation
    var updateBower = function () {
      var bowerRC = JSON.stringify({
        'directory': 'app/lib',
        'scripts': {
          'postinstall': 'grunt bower'
        }
      });
      fs.writeFile(this.cwd + '/.bowerrc', bowerRC);
    }.bind(this);

    this.pkg = require('../package.json');

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
            updateBower();
            console.log('');
            console.log(chalk.green('Woot!') + ' It appears that everything installed correctly.');
            console.log('Please run the command ' + chalk.yellow('grunt serve') + ' to launch the development server.');
            console.log('Most questions you have will be answered in the generated ' + chalk.red('README.md'));
            console.log('');
          }
        });
      }
      else {
        updateBower();
        console.log('');
        console.log(chalk.green('Woot!') + ' It appears that everything was copied over correctly.');
        console.log('Please run the command ' + chalk.yellow('npm install && bower install') + ' to install all dependencies.');
        console.log('Most questions you have will be answered in the generated ' + chalk.red('README.md'));
        console.log('');
        
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

  envVars: function () {
    var projectSettings = {};
    if (process.env.PROJECT_NAME) {
      projectSettings.projectName = process.env.PROJECT_NAME;
    }
    if (process.env.PROJECT_DESCRIPTION) {
      projectSettings.projectDesc = process.env.PROJECT_DESCRIPTION;
    }
    if (process.env.GITHUB_USERNAME) {
      projectSettings.authorLogin = process.env.GITHUB_USERNAME;
    }
    if (process.env.NO_TINFOIL) {
      projectSettings.noTinfoil = process.env.NO_TINFOIL;
    }

    //save config to .yo-rc.json
    this.config.set(projectSettings);
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

    if (!process.env.PROJECT_NAME && (!this.config.get('projectName') || force))  {
      questions.push({
        type : 'input',
        name : 'projectName',
        message : 'Your project name',
        default : this.appname || this.config.get('projectName')
      });
    }

    if (!process.env.PROJECT_DESCRIPTION && (!this.config.get('projectDesc') || force)) {
      questions.push({
        type : 'input',
        name : 'projectDesc',
        message : 'Your project description',
        default : this.config.get('projectDesc')
      });
    }

    if (!process.env.GITHUB_USERNAME && (!this.config.get('authorLogin') || force)) {
      questions.push({
        type : 'input',
        name : 'authorLogin',
        message : 'Would you mind telling me your username on Github?',
        default : this.config.get('author').login || this.config.get('authorLogin')
      });
    }

    if (!process.env.NO_TINFOIL && metrics.getTinfoil() === null) {
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

  dirCheck: function () {
    var done = this.async();
    var cwd = process.cwd();
    var newDir = cwd + '/' + _.slugify(this.projectName);
    var projectName = this.projectName;
    var saveConfig = this.config.save;

    var cleanup = function (done) {
      this.config.path = newDir + '/.yo-rc.json';
      fs.unlink(cwd + '/.yo-rc.json', function (err) {
        if (err) {
          done();
        }
        saveConfig();
        process.chdir(newDir);
        done();
      });
    }.bind(this);
    
    var mkdir = function (files, done) {
      fs.mkdir(newDir, function (err) {
        if (err) {
          fs.unlink(cwd + '/.yo-rc.json', function () {
            console.log(chalk.red('ERROR: ') + 'It seems you already have a folder named ' + projectName);
            console.log('       Please try a different name for your project');
            process.exit(1);
          });
        }
        else {
          cleanup(done);
        }
      });
    };
    
    fs.readdir(cwd, function (err, files) {
      if (err) {
        return done(err);
      }
      else if (!_.isEmpty(_.difference(files, ['.yo-rc.json'])) && !_.contains(files, '.gitignore')) {
        this.cwd = newDir;
        mkdir(files, done);
      }
      else {
        this.cwd = process.cwd();
        done();
      }
    }.bind(this));
  },

  app: function () {
    this.mkdir(this.cwd + '/app');
    this.mkdir(this.cwd + '/app/styles');
    this.mkdir(this.cwd + '/app/content');
    this.mkdir(this.cwd + '/app/content/images');
    this.mkdir(this.cwd + '/app/src');

    this.copy('README.md', this.cwd + '/README.md');

    this.template('_index.html', this.cwd + '/app/index.html');

    this.src.copy('images/_famous_logo.png', this.cwd + '/app/content/images/famous_logo.png');

    this.copy('styles/app.css', this.cwd + '/app/styles/app.css');

    this.template('src/requireConfig.js', this.cwd + '/app/src/requireConfig.js');
    this.template('src/_main.js', this.cwd + '/app/src/main.js');
  },

  manifests: function () {
    if (metrics.getTinfoil()) {
      this.copy('_package_tinfoil.json', this.cwd + '/package.json');
    }
    else {
      this.copy('_package.json', this.cwd + '/package.json');
    }
    this.copy('_bower.json', this.cwd + '/bower.json');
    this.copy('Gruntfile.js', this.cwd + '/Gruntfile.js');
  },

  dotfiles: function () {
    this.copy('editorconfig', this.cwd + '/.editorconfig');
    this.copy('bowerrc', this.cwd + '/.bowerrc');
    this.copy('eslint.json', this.cwd + '/.eslintrc');
    this.copy('jscs.json', this.cwd + '/.jscsrc');
    this.copy('gitignore', this.cwd + '/.gitignore');
    this.copy('travis.yml', this.cwd + '/.travis.yml');
  },

  gruntfiles: function () {
    this.mkdir('grunt');

    if (metrics.getTinfoil()) {
      this.src.copy('grunt/aliases_tinfoil.js', this.cwd + '/grunt/aliases.js');
    }
    else {
      this.src.copy('grunt/aliases.js', this.cwd + '/grunt/aliases.js');
    }

    this.src.copy('grunt/eslint.js', this.cwd + '/grunt/eslint.js');
    this.src.copy('grunt/jscs.js', this.cwd + '/grunt/jscs.js');
    this.src.copy('grunt/watch.js', this.cwd + '/grunt/watch.js');
    this.src.copy('grunt/connect.js', this.cwd + '/grunt/connect.js');
    this.src.copy('grunt/clean.js', this.cwd + '/grunt/clean.js');
    this.src.copy('grunt/bower.js', this.cwd + '/grunt/bower.js');
    this.src.copy('grunt/rev.js', this.cwd + '/grunt/rev.js');
    this.src.copy('grunt/processhtml.js', this.cwd + '/grunt/processhtml.js');
    this.src.copy('grunt/useminPrepare.js', this.cwd + '/grunt/useminPrepare.js');
    this.src.copy('grunt/usemin.js', this.cwd + '/grunt/usemin.js');
    this.src.copy('grunt/htmlmin.js', this.cwd + '/grunt/htmlmin.js');
    this.src.copy('grunt/copy.js', this.cwd + '/grunt/copy.js');
    this.src.copy('grunt/requirejs.js', this.cwd + '/grunt/requirejs.js');
  }
});

module.exports = FamousGenerator;
