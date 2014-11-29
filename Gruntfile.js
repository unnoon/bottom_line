module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.initConfig({
		uglify: {
			my_target: {
				files: {
					'dist/bottom_line.min.js': ['src/bottom_line.js']
				}
			}
		},
		jsdoc : {
			dist : {
				src: ['src/bottom_line.js'],
				options: {
					destination: 'doc'
				}
			}
		},
        preprocess : {
            options: {
                context : {
                    DEBUG: true
                }
            },
            js : {
                src : 'src/bottom_line.js',
                dest : 'dist/bottom_line.js'
            }
        },
		watch: {
			scripts: {
				files: ['**/*.js'],
				tasks: ['preprocess'],
				options: {
					spawn: false
				}
			}
		}
	});

    grunt.registerTask('default', ['preprocess']);
};


