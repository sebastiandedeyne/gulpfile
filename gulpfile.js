const argv = require('yargs').argv
const babelify = require('babelify')
const browserify = require('gulp-browserify')
const gulp = require('gulp')
const gulpif = require('gulp-if')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')

const production = argv.production

const config = {
    sass: {
        input: ['resources/sass/site.scss'],
        output: 'css',
        watch: 'resources/sass/**/*',
        options: {
            includePaths: ['node_modules'],
            outputStyle: production ? 'compressed' : null
        }
    },
    js: {
        input: ['resources/js/site.js'],
        output: 'js',
        watch: 'resources/js/**/*'
    }
}

gulp.task('default', () => {
    gulp.start('sass', 'js')
})

gulp.task('watch', () => {
    gulp.start('default')
    gulp.watch(config.sass.watch, ['sass'])
    gulp.watch(config.js.watch, ['js'])
})

gulp.task('sass', () => {
    gulp.src(config.sass.input)
        .pipe(sass(config.sass.options).on('error', sass.logError))
        .pipe(gulp.dest(config.sass.output))
})

gulp.task('js', () => {
    gulp.src(config.js.input)
        .pipe(browserify({
            transform: babelify.configure({ presets: ['es2015'] })
        }))
        .pipe(gulpif(production, uglify()))
        .pipe(gulp.dest(config.js.output))
})
