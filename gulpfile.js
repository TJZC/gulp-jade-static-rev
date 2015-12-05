var gulp = require('gulp');
var jadeStaticRev = require('./index');
var data = require('./example/assets.json');

gulp.task('html', function(cb){
    gulp.src('./example/jade/**')
        .pipe(jadeStaticRev({
            root: '/',
            assets: data
        }))
        .pipe(gulp.dest('./build/'));
});
