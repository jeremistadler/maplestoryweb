var gulp = require('gulp');
var ts = require('gulp-typescript');
var eventStream = require('event-stream');

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

gulp.task('default', ['scripts'], function() {


});