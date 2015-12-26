
var gulp = require('gulp');
var ts = require('gulp-typescript');
var eventStream = require('event-stream');
var connect = require('gulp-connect');
var nodeserver = require('gulp-develop-server');

gulp.task('scripts', function() {
  var tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(ts({
      declarationFiles: false,
      noExternalResolve: false
    }))
    .js.pipe(gulp.dest('build'));
});


gulp.task('serve', function() {
  connect.server({
    livereload: true
  });

  //nodeserver.listen({ path: 'server/app.js' });
});

gulp.task('watch', function() {
  var debounce = { debounceDelay: 500 };
  gulp.watch('scripts/**/*.ts', debounce, ['scripts']);
  gulp.watch(['build/**/*.*', 'index.html', 'style/**/*.css'], debounce, ['reload']);
  //gulp.watch(['./app.js'], nodeserver.restart);
});


gulp.task('reload', function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('default', ['scripts', 'serve', 'watch']);
