module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        separator: ''
      },
      dist: {
        src: [
            'src/js/app.js',
            'src/js/router.js',
            'src/js/constants/**/*.js',
            'src/js/controllers/*.js',
            'src/js/services/*.js'
        ],
        dest: '<%= pkg.name %>-built.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', []);

};
