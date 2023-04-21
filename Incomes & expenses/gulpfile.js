const {src, dest} = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser-js');

function css(done){
    src('src/styles.css')
        .pipe(sourcemaps.init())
        .pipe( postcss( [autoprefixer(), cssnano()] ) )
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));//almacenarla en el disco duro

    done();//callback para terminar la funcion
}

function javascript(done){
    src('src/scripts.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'));

    done();
}

exports.css = css;
exports.js = javascript;