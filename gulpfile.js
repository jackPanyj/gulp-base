const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpJade = require('gulp-jade');
const browserSync = require('browser-sync').create();
const jade = require('jade')
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const prefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

gulp.task('img', () =>
	gulp.src('src/img/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'))
);

gulp.task('es6', () => {
	return gulp.src('src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'jade', 'es6', 'img'] , function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("./src/css/*.scss", ['sass']);
    gulp.watch("./src/img/*", ['img']).on('change', browserSync.reload);
    gulp.watch("./src/js/*.js", ['es6']).on('change', browserSync.reload);
    gulp.watch("./src/*.jade", ['jade']).on('change', browserSync.reload);
});

gulp.task('jade', function () {
  return gulp.src('./src/*.jade')
    .pipe(gulpJade({
      jade: jade,
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
})

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./src/css/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer())
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('default', ['serve']);
