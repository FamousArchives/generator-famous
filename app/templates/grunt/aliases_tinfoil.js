module.exports = function (grunt) {
  'use strict';
  grunt.registerTask('serve', function (target) {

    grunt.task.run([
      'clean:server',
      'processhtml:dev',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'lint',
    'processhtml:dist',
    'useminPrepare',
    'requirejs',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('lint', [
    'jscs',
    'eslint'
  ]);
  
  grunt.registerTask('test', [
    'lint'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
