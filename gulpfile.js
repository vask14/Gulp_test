var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var babel = require('gulp-babel');
var gulpCopy = require('gulp-copy');
var uglify = require('gulp-uglify');
var pump = require('pump');
var del = require('del');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync').create();

//task show errors and warnings(default reporter)
gulp.task('lint', function() {
  return gulp.src('./dev/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//task for editing and minifying css files
gulp.task('less',function() {
    return gulp.src('./dev/*.css')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./src/ccs'))
    .pipe(livereload());
});

//task which transpile es5 to es6
gulp.task('transpile',function() {
    return gulp.src('./dev/js/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./src/js/'))
});

//task for copying html file
gulp.task('copy',function () {
    var res = gulp.src('./dev/*.html')
    .pipe(gulpCopy('./src/'));
    return res;
});

//task which concatenate all js files to one file
gulp.task('concat',function () {
    return gulp.src('./dev/js/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('src/js'))
});

//task compress js files
gulp.task('uglify',function () {
    return gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/min/'))
})

//task for deleting task
gulp.task('del',function(){
    del('./src/js/all.js')
});

gulp.task('js-watch',['js'],function(done) {
    browserSync.reload();
    done();
});

//task buid js
gulp.task('server',function(){
    browserSync.init({
        server: './src'
    });
    gulp.watch('./src/styles*.css',['less']);
    gulp.watch('./src/js/*.js',['js-watch']);
});

//task delete prod folder if exists,buid prod and copying all modified files
gulp.task('prod',function() {
    del.sync('./prod');
    gulp.src(['./src/*.html','./src/js/min/*.js','./src/ccs/*.css'])
    .pipe(gulpCopy('./prod',{prefix:1}));
});
//gulp.task('prod',['del','copy']);
gulp.task('default',['prod']);