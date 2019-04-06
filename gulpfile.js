var gulp = require('gulp');
	autoprefixer = require('autoprefixer'),
	connect = require('gulp-connect'),
	del = require('del'),
	groupConcat = require('gulp-group-concat'),
	newer = require('gulp-newer'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	postCss = require('gulp-postcss'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	sequence = require('gulp-sequence'),
	sourceMaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	uglifyCss = require('gulp-uglifycss')
	util = require('gulp-util');

var onError = function(err) {
	notify.onError({
		title: 'Gulp error in ' + err.plugin,
		message: err.toString()
	})(err);
	util.beep();
	console.log(err.toString());
	this.emit('end');
};

var paths = {
	src: {
		html: 'src/**/*.html',
		scss: 'src/scss/**/*.scss',
		js: 'src/js/**/*.js',
	},
	dist: {
		html: 'dist',
		css: 'dist/css',
		js: 'dist/js',
	},
};

gulp.task('clean', function() {
	var toClean = [
		'./.DS_Store',
		'./**/.DS_Store',
		paths.dist.html
	];

	return del(toClean);
});

gulp.task('connect', function() {
	path = require('path');
	connect.server({
		root: path.resolve('./dist'),
		livereload: true,
	});
});

gulp.task('notice:built', function() {
	return gulp.src('./', { read: false })
		.pipe(notify('Project successfully built!'));
});

gulp.task('html', function() {
	return gulp.src(paths.src.html)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(gulp.dest(paths.dist.html))
		.pipe(connect.reload());
})

gulp.task('sass', function() {
	var processors = [
		autoprefixer({browsers:['> 1%']}),
	];

	return gulp.src(paths.src.scss)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(newer(paths.dist.css))
		.pipe(sourceMaps.init())
		.pipe(sass({ outputStyle: 'compressed' }))
		.pipe(postCss(processors))
		.pipe(uglifyCss())
		.pipe(rename('app.min.css'))
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	return gulp.src(paths.src.js)
		.pipe(plumber({ errorHandler: onError }))
		.pipe(newer(paths.dist.js))
		.pipe(sourceMaps.init())
		.pipe(groupConcat({ 'app.min.js': '**/*.js' }))
		.pipe(uglify())
		.pipe(sourceMaps.write('.'))
		.pipe(gulp.dest(paths.dist.js))
		.pipe(connect.reload());
});

gulp.task('watch', function () {
	gulp.watch(paths.src.html, ['html']);
	gulp.watch(paths.src.scss, ['sass']);
	gulp.watch(paths.src.js, ['js']);
	gulp.watch('gulpfile.js', { interval: 500 }, ['dev']);
	connect.reload();
});

gulp.task('dev', ['html', 'sass', 'js']);

gulp.task('build', function(cb) {
	sequence('clean', 'dev', 'notice:built', cb);
});

gulp.task('default', function(cb) {
	sequence('dev', 'watch', 'connect', 'notice:built', cb);
});
