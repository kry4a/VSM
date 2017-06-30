var gulp = require('gulp'),
	less = require('gulp-less'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	browserSync = require('browser-sync').create(),
	jsmin = require('gulp-jsmin');


gulp.task('style', function () {
	return gulp.src('./less/**/*.less')
		.pipe(less())
		.pipe(concat('bundle.css'))
		.pipe(autoprefixer(
			'last 2 version',
			'safari 5',
			'ie 8',
			'ie 9',
			'opera 12.1',
			'ios 6',
			'android 4'
		))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./docs/'));
});

gulp.task('js', function () {
	return gulp.src('./js/**/*.js')
		.pipe(concat('bundle.js'))
		.pipe(jsmin())
		.pipe(gulp.dest('./docs'));
});

gulp.task('libs-css', function () {
	return gulp.src('./libs/css/**/*.css')
		.pipe(concat('libs.css'))
        .pipe(cleanCSS())
		.pipe(gulp.dest('./docs/'));
});

gulp.task('libs-js', function () {
    return gulp.src('./libs/js/**/*.js')
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./docs/'));
});

gulp.task('libs', ['libs-css', 'libs-js']);

gulp.task('watch', ['style', 'js'], function () {
	browserSync.init({
		server: {
			baseDir: './docs',
			index: 'index.html'
		}
	});
	gulp.watch('./js/**/*.js', ['js']);
	gulp.watch('./less/**/*.less', ['style']);
	gulp.watch('./docs/**/*').on('change', browserSync.reload);
});

gulp.task('default', ['style', 'js']);
