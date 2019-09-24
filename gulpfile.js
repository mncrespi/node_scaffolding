// const eslint = require("gulp-eslint")

function defaultTask(cb) {
  // place code for your default task here
  cb()
}


// Lint scripts
// function linter() {
//   return gulp
//     .src([
//       './assets/js/**/*',
//       './gulpfile.js',
//     ])
//     .pipe(plumber())
//     .pipe(eslint())
//     .pipe(eslint.format())
//     .pipe(eslint.failAfterError());
// }


exports.default = defaultTask