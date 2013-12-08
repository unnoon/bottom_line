module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-uglify');

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
		}
	});

    grunt.registerTask('default', ['jsdoc', 'uglify']);
};


