var gulp = require('gulp');
var ts = require('gulp-typescript');
var eventStream = require('event-stream');
var connect = require('gulp-connect');

gulp.task('scripts', function() {
    var tsProject = ts.createProject('tsconfig.json');
    return tsProject.src()
               .pipe(ts({
                    declarationFiles: false,
                    noExternalResolve: false
                }))
                .js
                .pipe(gulp.dest('build'));
});


gulp.task('serve', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('scripts/**/*.ts', { debounceDelay: 200 }, ['scripts']);
    gulp.watch(['build/**/*.*', 'index.html', 'style/**/*.css'], { debounceDelay: 200 }, ['reload']);
});


gulp.task('reload', function() {
    gulp.src('index.html')
        .pipe(connect.reload());
});

gulp.task('default', ['scripts', 'serve', 'watch']);
