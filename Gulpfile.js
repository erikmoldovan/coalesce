// Module Includes
var gulp = require('gulp');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var notify = require('gulp-notify');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');

// Base tasks
gulp.task('map:connect', function() {
	connect.server({
		root: 'build',
		port: 8000
	});
});

gulp.task('api:connect', function() {
	nodemon({
        script: 'api/server.js',
        watch: ["api/server.js"],
        ext: 'js'
    }).on('restart', () => {
	    gulp.src('server.js')
	        .pipe(notify('Running the start tasks and stuff'));
	    }
	);
});

gulp.task('html', function() {
	gulp.src('./dev/*.html', {base: 'dev'})
		.pipe(gulp.dest('./build/'));
});

gulp.task('images', function() {
	gulp.src('./dev/images/*.*', {base: 'dev'})
		.pipe(gulp.dest('./build/'));
});

gulp.task('sass', function() {
	return gulp.src(['./dev/sass/**/*.scss', './node_modules/leaflet/dist/leaflet.css'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload());
});

// gulp.task('js', function(){
//     browserify('./dev/js/coalesce.js')
//         .transform(reactify)
//         .bundle()
//         .pipe(source('app.js'))
//         .pipe(gulp.dest('build/'));
// });

gulp.task('js', function() {
    var bundler = browserify({
        entries: ['./dev/js/coalesce.js'],
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: true, // Gives us sourcemapping
        cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    });
    var watcher  = watchify(bundler);

    return watcher.on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('app.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./build/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(connect.reload());
});

gulp.task('html:watch', function() {
	gulp.watch(['./dev/*.html'], ['html']);
});

gulp.task('sass:watch', function () {
    gulp.watch('./dev/sass/**/*.scss', ['sass']);
});

gulp.task('js:watch', function () {
	// gulp.watch('./app/js/**/*.js', ['js']);
});

// Master tasks
gulp.task('serve', ['html', 'images', 'sass', 'js', 'map:connect', 'api:connect', 'html:watch', 'sass:watch', 'js:watch']);
gulp.task('default', ['serve']);