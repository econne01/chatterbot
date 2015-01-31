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
            'src/app/js/app.js',
            'src/app/js/router.js',
            'src/app/js/constants/**/*.js',
            'src/app/js/controllers/*.js',
            'src/app/js/services/*.js'
        ],
        dest: '<%= pkg.name %>-built.js'
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['concat']);

};
