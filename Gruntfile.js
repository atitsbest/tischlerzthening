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
        dirs: ['build'],
        basedir: ['build']
      }
    },

    copy: {
      build: {
        files: [
          { expand: true, src: 'index.html', dest: 'build/'},
          // { expand: false, src: 'index.html', dest: 'build/offline.html'},
          { expand: true, src: 'favicon.ico', dest: 'build/'},
          { expand: true, src: 'images/*.gif', dest: 'build/'},
          // { expand: true, src: 'pictures/*', dest: 'build/'},
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

    imagemin: {                          
      build: {                            
        options: {                       
          optimizationLevel: 7,
          progressive: true
        },
        files: [
          { expand: true, src: 'images/*', dest: 'build/'},
          { expand: true, src: 'pictures/*', dest: 'build/'},
          {
            expand: true,
            cwd: 'styles/lib/',
            src: ['**/*.png'],
            dest: 'build/styles/',
            ext: '.png'
          }
        ]
      }
    },

    clean: ['build/'],

    'ftp-deploy': {
      staging: {
        auth: {
          host: 'www.thening.at',
          port: 21,
          authKey: 'key1'
        },
        src: 'build',
        dest: '/tischler/beta',
        exclusions: []
      },
      productive: {
        auth: {
          host: 'www.thening.at',
          port: 21,
          authKey: 'key1'
        },
        src: 'build',
        dest: '/tischler',
        exclusions: []
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-ftp-deploy');

  grunt.registerTask('build', [
    'clean',
    'useminPrepare',
    'copy:build',
    'cssmin',
    'concat',
    'uglify',
    'usemin',
    'imagemin',
    'processhtml',
    'htmlmin'
  ]);

  grunt.registerTask('deploy:staging', ['ftp-deploy:staging']);

  grunt.registerTask('deploy:live', ['ftp-deploy:productive']);
};
