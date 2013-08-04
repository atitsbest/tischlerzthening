module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'build'
      }
    },

    usemin: {
      html: ['build/index.html'],
      css: ['styles/*.css', 'styles/**/.*css'],
      options: {
        dirs: ['build']
      }
    },

    copy: {
      build: {
        files: [
          { expand: true, src: 'index.html', dest: 'build/'},
          // { expand: false, src: 'index.html', dest: 'build/offline.html'},
          { expand: true, src: 'favicon.ico', dest: 'build/'},
          { expand: true, src: 'images/*', dest: 'build/'},
          { expand: true, src: 'pictures/*', dest: 'build/'},
          { expand: true, src: 'apple-touch*', dest: 'build/'}
        ]
      }
    },

    htmlmin: {
      build: {
        files: { 
          'build/index.html' : 'build/index.html',
          'build/offline.html' : 'build/offline.html'
        }
      }
    },

    processhtml: {
      offline: {
        files: {
          'build/offline.html': ['build/index.html']
        }
      },
      build: {
        files: {
          'build/index.html': ['build/index.html']
        }
      }
    },

    clean: ['build/']
  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'copy:build',
    'cssmin',
    'concat',
    'uglify',
    'usemin',
    'processhtml',
    'htmlmin'
  ]);
};
