var gulp = require('gulp');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var cleanCSS = require('gulp-clean-css');
var bower = require('gulp-bower');

gulp.task('default', ['minify']);
gulp.task('minify', ['vendor-styles', 'vendor-fonts', 'vendor-images', 'scripts']);
gulp.task('dev', ['minify'], function () {
  gulp.watch(['./source'],['minify']);
});

gulp.task('vendor-styles', ['bower'], function () {
    gulp.src([
        './source/vendor/components-font-awesome/css/font-awesome.min.css',
        './source/fonts/open-sans/css/styles.css',
        './source/fonts/source-code-pro/styles.css',
        './source/vendor/lightgallery/dist/css/lightgallery.min.css',
        './source/vendor/justifiedGallery/dist/css/justifiedGallery.min.css',
        './source/vendor/fullcalendar/dist/fullcalendar.css'
        ])
        .pipe(concat('vendor-styles.min.css'))
        .pipe(cleanCSS({compatibility: 'ie9', processImport: false, keepSpecialComments: 0}))
        .pipe(gulp.dest('./source/dist/css/'))
});

gulp.task('scripts', ['bower'], function () {
    gulp.src([
        './source/vendor/classie/classie.js',
        './source/vendor/moment/min/moment.min.js',
        './source/vendor/lightgallery/dist/js/lightgallery.js',
        './source/vendor/lg-thumbnail/dist/lg-thumbnail.js',
        './source/vendor/lg-pager/dist/lg-pager.js',
        './source/vendor/lg-autoplay/dist/lg-autoplay.js',
        './source/vendor/lg-fullscreen/dist/lg-fullscreen.js',
        './source/vendor/lg-zoom/dist/lg-zoom.js',
        './source/vendor/lg-hash/dist/lg-hash.js',
        './source/vendor/lg-share/dist/lg-share.js',
        './source/vendor/lg-video/dist/lg-video.js',
        './source/vendor/justifiedGallery/dist/js/jquery.justifiedGallery.js',
        './source/vendor/fullcalendar/dist/fullcalendar.js',
        './source/vendor/fullcalendar/dist/gcal.js',
        './source/js/main.js',
        './source/js/contact.js',
        './source/js/form.js'
    ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./source/dist/js/'))
});

gulp.task('vendor-fonts', ['bower'], function () {
    gulp.src([
        './source/vendor/components-font-awesome/fonts/*',
        './source/vendor/lightgallery/dist/fonts/*'
    ])
        .pipe(gulp.dest('./source/dist/fonts'));
    gulp.src([
        './source/fonts/open-sans/fonts/*',
        './source/fonts/source-code-pro/fonts/*'
    ])
        .pipe(gulp.dest('./source/dist/css/fonts'));
});

gulp.task('vendor-images', ['bower'], function () {
    gulp.src([
        './source/vendor/lightgallery/dist/img/*'
    ])
        .pipe(gulp.dest('./source/dist/img'));
});

gulp.task('bower', function() {
    return bower('./source/vendor');
});
