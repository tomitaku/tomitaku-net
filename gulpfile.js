var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');

var paths = {
  htmlSrc: './src/*.html',
  scssSrc: './src/scss/**/*.scss',
  jsSrc: './src/js/*.js',
  jsLib: './src/js/lib/*.js',
  imgSrc: './src/images/**',
  rootDir: './dist/',
  imgDir: './dist/images/',
  jsDir: './dist/js/',
};

gulp.task('html', () => {
  return gulp.src(paths.htmlSrc).pipe(gulp.dest(paths.rootDir));
});

gulp.task('bs', function () {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    notify: true,
    xip: false,
  });
});

gulp.task('scss', function () {
  return (
    gulp
      .src(paths.scssSrc)
      .pipe($.sourcemaps.init())
      .pipe($.sass())
      .on('error', $.sass.logError)
      .pipe(
        $.autoprefixer({
          browsers: ['last 2 versions'],
        })
      )
      // .pipe($.sourcemaps.write())
      // .pipe(gulp.dest(paths.rootDir + 'css'))
      // .pipe(
      //   $.rename({
      //     suffix: '.min'
      //   })
      // )
      .pipe($.csso())
      .pipe(gulp.dest(paths.rootDir + 'css'))
      .pipe(
        browserSync.reload({
          stream: true,
          once: true,
        })
      )
  );
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('image', () => {
  return gulp
    .src(paths.imgSrc)
    .pipe($.changed(paths.imgDir))
    .pipe(gulp.dest(paths.imgDir));
});

gulp.task('js', function () {
  return gulp
    .src([paths.jsLib, paths.jsSrc])
    .pipe($.uglify({ preserveComments: 'license' }))
    .pipe($.concat('main.min.js', { newLine: '\n' }))
    .pipe(gulp.dest(paths.jsDir));
});

gulp.watch(paths.htmlSrc, gulp.task('bs-reload'));
gulp.watch(paths.scssSrc, gulp.task('scss'));
gulp.watch(paths.imgSrc, gulp.task('image'));
gulp.watch(paths.jsSrc, gulp.task('js'));
gulp.watch(paths.htmlSrc, gulp.task('html'));

gulp.task(
  'default',
  gulp.series(
    gulp.parallel('image', 'js', 'bs', 'scss', 'bs-reload', 'html'),
    function () {}
  )
);
