const gulp   = require('gulp');
const eslint = require('gulp-eslint');
const babel  = require('gulp-babel');
const mocha  = require('gulp-mocha');
const del    = require('del');

gulp.task('clean', function (cb) {
    del('lib', cb);
});

gulp.task('lint', function () {
    return gulp
        .src([
            'src/**/*.js',
            'test/**/*.js',
            'Gulpfile.js',
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('compile', function () {
    return gulp
        .src('src/**/*.js')
        .pipe(babel({
            'presets': ['@babel/env'],
            plugins:   ['add-module-exports'],
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('test-run', function () {
    return gulp
        .src('test/**.js')
        .pipe(mocha({
            ui:       'bdd',
            reporter: 'spec',
            timeout:  typeof v8debug === 'undefined' ? 2000 : Infinity, // NOTE: disable timeouts in debug
        }));
});

gulp.task('preview-run', function (done) {
    const buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin;
    const pluginFactory       = require('./lib');
    const reporterTestCalls   = require('./test/utils/reporter-test-calls');
    const plugin              = buildReporterPlugin(pluginFactory);

    console.log();

    reporterTestCalls.forEach(function (call) {
        plugin[call.method].apply(plugin, call.args);
    });

    done();
});

gulp.task('build', gulp.series('clean', 'lint', 'compile'));
gulp.task('test', gulp.series('build', 'test-run'));
gulp.task('preview', gulp.series('build', 'preview-run'));
