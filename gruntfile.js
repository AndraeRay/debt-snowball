module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jsdoc : {
        dist : {
            src: ['src/*.js', 'test/*.js'],
            options: {
                destination: 'jsdocs'
            }
        }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        autoWatch: true
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-karma');


  // Default task(s).
  grunt.registerTask('default', ['uglify']);

  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('test', [
    'karma'
  ]);


};