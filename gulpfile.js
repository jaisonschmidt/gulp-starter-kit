"use strict";

var gulp = require('gulp'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-clean-css'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    ts = require('gulp-typescript'),
    minify = require('gulp-minify'),
    browserSync = require('browser-sync').create(),
    imagemin = require('gulp-imagemin'),
    reload = browserSync.reload;

var onError = function(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit('end');
};

/* compila a aplicacao */
gulp.task('build', function() {
    return runSequence('template', 'css', 'js', 'libs', 'img');
});

/* compila css */
gulp.task('css', function() {

    return gulp.src('app/css/**/**/*.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css'))
        .pipe(browserSync.stream());;
});

/* compila os arquivos javascript */
gulp.task('js', function() {

    return gulp.src('app/js/**.ts')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(ts())
        .pipe(minify())
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.stream());;
});

/* copia os templates */
gulp.task('template', function() {

    return gulp.src('app/template/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('build/'))
        .pipe(browserSync.stream());
});

/* copia as libs utilizadas */
gulp.task('libs', function() {

    return gulp.src('app/libs/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(gulp.dest('build/libs/'));
});

/* copia as imagens */
gulp.task('img', function() {

    return gulp.src('app/img/**')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(imagemin())
        .pipe(gulp.dest('build/img/'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./build/"
        }
    });

    gulp.watch('app/template/**', ['template']);
    gulp.watch('app/css/**', ['css']);
    gulp.watch('app/js/**', ['js']);
    gulp.watch('app/img/**', ['img']);
});

// run default function of gulp
gulp.task('default', function() {
    runSequence('build', 'serve');
});