// Module Includes
var gulp = require('gulp'),
	connect = require('gulp-connect'),
	nodemon = require('gulp-nodemon'),
	sass = require('gulp-sass');

// Base tasks
gulp.task('map:connect', function() {
	connect.server({
		root: 'app',
		port: 8000,
		livereload: true
	});
});

gulp.task('api:connect', function() {
	nodemon({
        // the script to run the app
        script: 'api/server.js',
        // this listens to changes in any of these files/routes and restarts the application
        watch: ["server.js"],
        ext: 'js'
        // Below i'm using es6 arrow functions but you can remove the arrow and have it a normal .on('restart', function() { // then place your stuff in here }
    }).on('restart', () => {
	    gulp.src('server.js')
	        // I've added notify, which displays a message on restart. Was more for me to test so you can remove this
	        .pipe(notify('Running the start tasks and stuff'));
	    }
	);
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

gulp.task('html:watch', function() {
	gulp.watch(['./app/*.html'], ['html']);
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/sass/**/*.scss', ['sass']);
});

// Master tasks
gulp.task('serve', ['html', 'sass', 'map:connect', 'api:connect', 'html:watch', 'sass:watch']);
gulp.task('default', ['serve']);