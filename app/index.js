'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var FamousGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the fantastic Famo.us generator.'));

    var prompts = [{
      name: 'projectName',
      message: 'What would you like to call your project?'
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/style');
    this.mkdir('app/content');
    this.mkdir('app/content/images');
    this.mkdir('app/src');

    this.copy('_README.md', 'README.md');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.copy('_index.html', 'app/index.html');
    
    this.copy('images/_famous_symbol_transparent.png', 'app/content/images/famous_symbol_transparent.png');
    
    this.copy('styles/_app.css', 'app/styles/app.css');
    
    this.copy('src/_requireConfig.js', 'app/src/requireConfig.js');
    this.copy('src/_main.js', 'app/src/main.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('eslint.json', '.eslint.json');
    this.copy('jscs.json', '.jscs.json');
  }
});

module.exports = FamousGenerator;