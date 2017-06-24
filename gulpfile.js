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

gulp.task('lint', function() {
  return gulp.src('./dev/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('less',function() {
    return gulp.src('./dev/*.css')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./src/ccs'))
    .pipe(livereload());
});

gulp.task('transpile',function() {
    return gulp.src('./dev/js/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./src/js/'))
});

gulp.task('copy',function () {
    var res = gulp.src('./dev/*.html')
    .pipe(gulpCopy('./src/'));
    return res;
});

gulp.task('concat',function () {
    return gulp.src('./dev/js/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('src/js'))
});

gulp.task('uglify',function () {
    return gulp.src('./src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./src/js/min/'))
})

gulp.task('del',function(){
    del('./src/js/all.js')
});

gulp.task('js-watch',['js'],function(done) {
    browserSync.reload();
    done();
});

gulp.task('server',function(){
    browserSync.init({
        server: './src'
    });
    gulp.watch('./src/styles*.css',['less']);
    gulp.watch('./src/js/*.js',['js-watch']);
});

gulp.task('prod',function() {
    del.sync('./prod');
    gulp.src(['./src/*.html','./src/js/min/*.js','./src/ccs/*.css'])
    .pipe(gulpCopy('./prod',{prefix:1}));
});
/*gulp.task('css',function(){
    return gulp.src('styles/*.less')
    .pipe(less())
    .pipe(concat('all.css'))
  //  .pipe(minifyCSS())
    .pipe(gulp.dest('buid/css'))
});

gulp.task('watch',function() {
    gulp.watch('styles/*.less', ['css'])
})

gulp.task('default',['css']);
*/
