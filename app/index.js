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
    this.mkdir('app/css');
    this.mkdir('app/images');
    this.mkdir('app/src');
    this.mkdir('app/src/lib');

    this.copy('_README.md', 'README.md');
    this.copy('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('_Gruntfile.js', 'Gruntfile.js');
    this.copy('_index.html', 'app/index.html');
    
    this.copy('images/_famous_symbol_transparent.png', 'app/images/famous_symbol_transparent.png');
    
    this.copy('css/_app.css', 'app/css/app.css');
    
    this.copy('src/_requireConfig.js', 'app/src/requireConfig.js');
    this.copy('src/_main.js', 'app/src/main.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('bowerrc', '.bowerrc');
    this.copy('_eslint.json', 'eslint.json');
  }
});

module.exports = FamousGenerator;