import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import path from 'path'
import runSequence from 'run-sequence'

const plugins = gulpLoadPlugins()

const paths = {
  js: [
    './**/*.js',
    '!node_modules/**',
    // '!assets/**',
  ],
  nonJs: [
    './package.json',
    './package-lock.json',
    './.gitignore',
  ],
  tests: './server/tests/*.js',
}



// Set env variables
gulp.task('set-env', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test',
    },
  })
})

// Lint Javascript
gulp.task('lint', () =>
  gulp.src(paths.js)
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
    .pipe(plugins.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(plugins.eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(plugins.eslint.failAfterError())
)




// Start server with restart on file changes
gulp.task('nodemon', [
  'lint',
], () => {
  plugins.nodemon({
    script: 'index.js',
    ext: 'js',
    ignore: [
      'node_modules/**/*.js',
      // 'assets/**/*',
    ],
    tasks: [
      'lint',
    ],
  })
})


// triggers mocha test
gulp.task('test', ['set-env'], () => { //eslint-disable-line comma-dangle
  let  exitCode = 0

  return gulp.src([paths.tests], { read: false }) //eslint-disable-line comma-dangle
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter: plugins.util.env['mocha-reporter'] || 'spec',
      ui: 'bdd',
      timeout: 100,
      compilers: 'js:babel-core/register',
    }))
    .once('error', (err) => {
      plugins.util.log(err)
      exitCode = 1
    })
    .once('end', () => {
      plugins.util.log('completed !!')
      process.exit(exitCode)
    })
})

// clean dist, compile js files, copy non-js files and execute tests
gulp.task('mocha', [], () => {
  runSequence(
    [],
    'test'
  )
})

// gulp serve for development
gulp.task('serve', [], () => runSequence('nodemon')) //eslint-disable-line comma-dangle
