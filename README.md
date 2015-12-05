# gulp-jade-static-rev

> a plugin for gulp.js to replace file's name by adding content hash

## Installation

```
npm install gulp-jade-static-rev --save-dev
```

## Usage

```
var gulp = require('gulp');
var jadeRev = require('gulp-jade-static-rev');

gulp.task('md5',function() {
    gulp.src("./test/**.jade")
        .pipe(jadeRev({
            root: '/',
            assets: {
              "index": [
                "index.63ece9.js",
                "index.f3f725.css"
              ]
            }
        }))
        .pipe(gulp.dest('./build'));
});
```
