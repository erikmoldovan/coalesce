// Module Includes
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass');

// Base tasks
gulp.task('connect', function() {
	connect.server({
		root: 'app',
		port: 8000,
		livereload: true
	});
});

gulp.task('html', function() {
	gulp.src('./app/*.html')
		.pipe(connect.reload());
});

gulp.task('sass', function() {
	return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css')); 
});

gulp.task('html:watch', function() {
	gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

// Master tasks
gulp.task('serve', ['connect', 'html:watch', 'sass:watch']);
gulp.task('default', ['serve']);