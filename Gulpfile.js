// Module Includes
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	notify = require('gulp-notify');

// Base tasks
gulp.task('map:connect', function() {
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
	return gulp.src('./app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
    .pipe(connect.reload());
});

gulp.task('js', function() {
	gulp.src('./app/js/**/*.js')
		.pipe(connect.reload());
});

gulp.task('html:watch', function() {
	gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/sass/**/*.scss', ['sass']);
});

gulp.task('js:watch', function () {
	gulp.watch('./app/js/**/*.js', ['js']);
});

// Master tasks
gulp.task('serve', ['html', 'sass', 'js', 'map:connect', 'html:watch', 'sass:watch', 'js:watch']);
gulp.task('default', ['serve']);