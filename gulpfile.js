var gulp = require('gulp');
var ts = require('gulp-typescript');
var eventStream = require('event-stream');
var connect = require('gulp-connect');

gulp.task('scripts', function() {
    var tsResult = gulp.src('scripts/*.ts')
                       .pipe(ts({
                           declarationFiles: true,
                           noExternalResolve: true
                       }));

    return eventStream.merge(
        tsResult.dts.pipe(gulp.dest('build/def')),
        tsResult.js.pipe(gulp.dest('build/js'))
    );
});


gulp.task('serve', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('./**/*.ts', { debounceDelay: 200 },['scripts']);
    gulp.watch(['build/**/*.*', 'index.html'], { debounceDelay: 200 }, ['reload']);
});


gulp.task('reload', function() {
    gulp.src('index.html')
      .pipe(connect.reload());
});

gulp.task('default', ['scripts', 'serve', 'watch'], function() {


});