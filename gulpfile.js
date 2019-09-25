const gulp = require('gulp')
const eslint = require('gulp-eslint')
const gulpIf = require('gulp-if')


const paths = {
  js: [
    './**/*.js',
    '!node_modules/**',
    '!assets/**',
  ],
  nonJs: [
    './package.json',
    './package-lock.json',
    './.gitignore',
  ],
  tests: './server/tests/*.js',
}


function isFixed(file) {
  // Has ESLint fixed the file contents?
  return file.eslint != null && file.eslint.fixed
}



function defaultTask(cb) {
  // place code for your default task here
  cb()
}


// Lint scripts
function lint() {
  return gulp
    .src(paths.js)
      .pipe(eslint({
        fix: (process.env.LINT_FIX),
      }))
      .pipe(eslint.format())
      .pipe(gulpIf(isFixed, gulp.dest('./')))
      .pipe(eslint.failAfterError())
}

exports.default = defaultTask
exports.linter = lint