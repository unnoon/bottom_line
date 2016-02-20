module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-bump');

	var bump = grunt.option("bump") || 'patch'; // what to bump

	grunt.initConfig({
		bump: {
			options: {
				files: ['package.json', 'bower.json', 'src/bottom_line.js'],
				commit: true,
				commitFiles: ['-a'],
				createTag: true,
				push: true,
				pushTo: 'origin'
			}
		},
		uglify: {
			bin: {
				files: {
					'bin/bottom_line.min.js': ['bin/bottom_line.js']
				}
			}
		},
		jsdoc : {
			bin : {
				src: ['bin/bottom_line.js'],
				options: {
					destination: 'doc',
                    template : "node_modules/ink-docstrap/template",
                    configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		},
        preprocess : {
            bin : {
                src : 'src/bottom_line.js',
                dest : 'bin/bottom_line.js'
            },
			test: {
				options: {
					context : {
						TEST: true
					}
				},
				src : 'src/bottom_line.js',
				dest : 'bin/bottom_line.test.js'
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
		},
        clean: {
            docs: ['doc']
        }
	});

    grunt.registerTask('docs',    ['clean:docs', 'jsdoc']);
	grunt.registerTask('build',   ['bump-only:'+bump, 'preprocess', 'uglify', 'docs', 'bump-commit']);
    grunt.registerTask('default', ['preprocess']);
};


