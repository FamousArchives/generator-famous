'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var FamousGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
    this.description = this.pkg.description;

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
      authorLogin: 'famous',
      author: {
        name: this.user.git.username || process.env.user || process.env.username,
        login: 'famous',
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

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What would you like to call your project?',
      default: this.appname || this.config.get('projectName')
    }, {
      type: 'input',
      name: 'projectDesc',
      message: 'Your project description',
      default: this.config.get('projectDesc')
    }, {
      type : 'input',
      name : 'authorLogin',
      message : 'Would you mind telling me your username on Github?',
      default : this.config.get('author').login || this.config.get('authorLogin')
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName || this.config.get('projectName');
      this.projectDesc = props.projectDesc || this.config.get('projectDesc');
      this.authorLogin = props.authorLogin || this.config.get('authorLogin');
      
      this.authorName  = this.config.get('author').name;
      this.authorEmail = this.config.get('author').email;

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
    this.copy('eslint.json', '.eslint.json');
    this.copy('jscs.json', '.jscs.json');
  }
});

module.exports = FamousGenerator;