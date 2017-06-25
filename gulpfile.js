const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');

gulp.task('default', ['minify']);
gulp.task('minify', ['vendor-styles', 'vendor-fonts', 'vendor-images', 'scripts']);
gulp.task('dev', ['minify'], () => {
  gulp.watch(['./source'], ['minify']);
});

gulp.task('vendor-styles', [], () => {
  gulp
    .src([
      './node_modules/font-awesome/css/font-awesome.min.css',
      './source/fonts/open-sans/css/styles.css',
      './source/fonts/source-code-pro/styles.css',
      './node_modules/lightgallery/dist/css/lightgallery.min.css',
      './node_modules/justifiedGallery/dist/css/justifiedGallery.min.css',
      './node_modules/fullcalendar/dist/fullcalendar.css',
    ])
    .pipe(concat('vendor-styles.min.css'))
    .pipe(cleanCSS({ compatibility: 'ie9', processImport: false, keepSpecialComments: 0 }))
    .pipe(gulp.dest('./source/dist/css/'));
});

gulp.task('scripts', [], () => {
  gulp
    .src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/classie/classie.js',
      './node_modules/moment/min/moment.min.js',
      './node_modules/lightgallery/dist/js/lightgallery.js',
      './node_modules/lg-thumbnail/dist/lg-thumbnail.js',
      './node_modules/lg-pager/dist/lg-pager.js',
      './node_modules/lg-autoplay/dist/lg-autoplay.js',
      './node_modules/lg-fullscreen/dist/lg-fullscreen.js',
      './node_modules/lg-zoom/dist/lg-zoom.js',
      './node_modules/lg-hash/dist/lg-hash.js',
      './node_modules/lg-share/dist/lg-share.js',
      './node_modules/lg-video/dist/lg-video.js',
      './node_modules/justifiedGallery/dist/js/jquery.justifiedGallery.js',
      './node_modules/fullcalendar/dist/fullcalendar.js',
      './node_modules/fullcalendar/dist/gcal.js',
      './source/js/main.js',
      './source/js/insight.js',
      './source/js/share.js',
      './source/js/menu.js',
      './source/js/contact.js',
      './source/js/form.js',
    ])
    .pipe(concat('main.js'))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest('./source/dist/js/'));
});

gulp.task('vendor-fonts', [], () => {
  gulp.src(['./node_modules/components-font-awesome/fonts/*', './node_modules/lightgallery/dist/fonts/*']).pipe(gulp.dest('./source/dist/fonts'));
  gulp.src(['./source/fonts/open-sans/fonts/*', './source/fonts/source-code-pro/fonts/*']).pipe(gulp.dest('./source/dist/css/fonts'));
});

gulp.task('vendor-images', [], () => {
  gulp.src(['./node_modules/lightgallery/dist/img/*']).pipe(gulp.dest('./source/dist/img'));
});
