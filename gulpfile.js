var gulp = require('gulp');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cleanCSS = require('gulp-clean-css');
var bower = require('gulp-bower');

gulp.task('default', ['bower','vendor-styles', 'vendor-fonts', 'vendor-images', 'scripts']);

gulp.task('vendor-styles', function () {
    gulp.src([
        './source/vendor/font-awesome/css/font-awesome.min.css',
        './source/vendor/open-sans/styles.css',
        './source/vendor/source-code-pro/styles.css',
        './source/vendor/lightgallery/css/lightgallery.min.css',
        './source/vendor/justified-gallery/justifiedGallery.min.css'
        ])
        .pipe(concat('vendor-styles.min.css'))
        .pipe(cleanCSS({compatibility: 'ie9', processImport: false, keepSpecialComments: 0}))
        .pipe(gulp.dest('./source/vendor/dest/css/'))
});

gulp.task('scripts', function () {
    gulp.src([
        './source/vendor/classie/classie.js',
        './source/vendor/lightgallery/js/lightgallery.min.js',
        './source/vendor/lightgallery/js/lg-thumbnail.min.js',
        './source/vendor/lightgallery/js/lg-pager.min.js',
        './source/vendor/lightgallery/js/lg-autoplay.min.js',
        './source/vendor/lightgallery/js/lg-fullscreen.min.js',
        './source/vendor/lightgallery/js/lg-zoom.min.js',
        './source/vendor/lightgallery/js/lg-hash.min.js',
        './source/vendor/lightgallery/js/lg-share.min.js',
        './source/vendor/lightgallery/js/lg-video.min.js',
        './source/vendor/justified-gallery/jquery.justifiedGallery.min.js',
        './source/js/main.js',
        './source/js/contact.js',
        './source/js/form.js'
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./source/vendor/dest/js/'))
});

gulp.task('vendor-fonts', function () {
    gulp.src([
        './source/vendor/font-awesome/fonts/*',
        './source/vendor/lightgallery/fonts/*'
    ])
        .pipe(gulp.dest('./source/vendor/dest/fonts'));
    gulp.src([
        './source/vendor/open-sans/fonts/*',
        './source/vendor/source-code-pro/fonts/*'
    ])
        .pipe(gulp.dest('./source/vendor/dest/css/fonts'));
});

gulp.task('vendor-images', function () {
    gulp.src([
        './source/vendor/lightgallery/img/*'
    ])
        .pipe(gulp.dest('./source/vendor/dest/img'));
});

gulp.task('bower', function() {
    return bower();
});