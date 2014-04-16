'use strict';
// var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var OpinionatedGenerator = yeoman.generators.NamedBase.extend({
  init: function () {
    console.log('At Famo.us we don\'t like to make too many decisions for our users');
    console.log('But here is an example of way one to organize a project');
  },

  files: function () {
    if (this.name === 'please') {
      /* content dirs */
      this.mkdir('app/content/sounds');
      this.mkdir('app/content/videos');
    
      /* src dirs */
      this.mkdir('app/src/helpers');
      this.mkdir('app/src/models');
      this.mkdir('app/src/providers');
    
      /* Copy Over Readmes */
      this.copy('_README_helpers.md', 'app/src/helpers/README.md');
      this.copy('_README_models.md', 'app/src/models/README.md');
      this.copy('_README_providers.md', 'app/src/providers/README.md');
    }
    else {
      console.log(chalk.yellow('You didn\'t say the ' + chalk.green('magic word')));
    }
  }
});

module.exports = OpinionatedGenerator;
