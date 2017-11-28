// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var browserify = require('browserify'),
  del = require('del'),
  source = require('vinyl-source-stream'),
  vinylPaths = require('vinyl-paths'),
    // glob = require('glob'),
    // Server = require('karma').Server,
  merge = require('merge-stream'),
  recursivefolder = require('gulp-recursive-folder');
var gutil = require('gulp-util');

// Define file path variables
var paths = {
  root: 'app/', // App root path
  src: 'app/', // Source path
  dist: '../server/public/static/', // Distribution path
  test: 'test/', // Test path
  debug: 'debug',
  reports: 'reports'
};
var gulpPlugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var cssVendor = gulp.src([
  'node_modules/textangular/dist/textAngular.css',
  'node_modules/bootstrap/dist/css/bootstrap.css',
  'node_modules/ng-toast/dist/ngToast.min.css',
  'app/css/font-awesome.min.css'
    // 'node_modules/angular-material/angular-material.css'
]);

/** ################TASKS############## */
/**
 * Task connect to create a connection.
 */
gulp.task('connect', function () {
  connect.server({
    root: '',
    port: 8888
  });
});

/**
 * Task of lint for check coding conventation.
 */
gulp.task('lint', () => {
  return gulp.src(['app/**/*.js', '!node_modules/**', '!app/js/**', '!app/static/**', "!**/shared/common/vendor/**", "!test/**"])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(gulpPlugins.eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(gulpPlugins.eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(gulpPlugins.eslint.failAfterError());
});

/**
 * Task clean folder before build anything.
 */
gulp.task('clean', function () {
  return gulp
        .src([paths.root + 'ngAnnotate', paths.dist, paths.debug, paths.reports], { read: false })
        .pipe(vinylPaths(function (paths) {
          del.sync(paths, { force: true });
          return Promise.resolve();
        }));
});

/**
 * Task for dev
 */
gulp.task('dev', function () {
  return browserify(paths.src + 'app.js', { debug: true })
        .bundle()

        .pipe(source('app.js'))
        // zip source
        // .pipe(buffer())
        // .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(
        //   uglify({ mangle: false })
        // )
        .on('error', function (err) {
            /*eslint-disable*/
            gutil.log(gutil.colors.red('[Error]'), err.toString());
            this.emit('end');
            // console.log(err);
        })
        .pipe(gulp.dest(paths.dist));
});

/**
 * Task dev vendor.
 */
gulp.task('dev:vendor', function () {
    return browserify(paths.src + 'vendor.js', { debug: false })
        .bundle()
        .on('error', function (err) {
            console.log(err);
        })
        .pipe(source('vendor.js'))
        // zip source
        // .pipe(buffer())
        // .pipe(sourcemaps.init({ loadMaps: true }))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.dist));
});

/**
 * Task install npm packages.
 */
gulp.task('install', function () {
    return gulp.src(['./package.json'])
        .pipe(gulpPlugins.install());
});

/**
 * Copy common res to dest folder
 */
gulp.task('copy-resources', function () {
    // common images
    var images = gulp.src(paths.src + 'images/**', { debug: true })
        .pipe(gulp.dest(paths.dist + 'images'));

    // common fonts
    var fonts = gulp.src(paths.src + 'fonts/**', { debug: true })
        .pipe(gulp.dest(paths.dist + 'fonts'));

    //common js.
    var js = gulp.src(paths.src + 'js/**', { debug: true })
        .pipe(gulp.dest(paths.dist + 'js'));

    //fake data for dev
    var data = gulp.src(paths.src + 'data/**', { debug: true })
        .pipe(gulp.dest(paths.dist + 'data'));

    return merge(images, fonts, js, data);
});

/**
 * thinhvt
 * 8/10/2107
 * Copy recursive from modules folder to public static folder. It's hold structure of folder.
 * Use: link of file like: sb12\server\public\static\modules\admin-user\views\index.html.
 */
gulp.task('copy-resources-html', recursivefolder({
    base: paths.src + '/modules'
}, function (folderFound) {
    return gulp.src(folderFound.path + "/*.html")
        .pipe(gulp.dest(paths.dist + "/modules/" + folderFound.pathTarget));
}));


/**
 * Vendor Dev task - Build css and copy to dest folder.
 */
gulp.task('vendorDev', function () {
    cssVendor
        .pipe(gulpPlugins.sourcemaps.init())
        .pipe(gulpPlugins.groupConcat({
            'vendor.css': '**/*.css'
        }))
        .pipe(gulpPlugins.sourcemaps.write('.'))
        // minify CSS
        // .pipe(minifyCSS())
        .pipe(gulp.dest(paths.dist + 'css'));
    return merge(cssVendor);
});

/**
 * Build less file and copy to dest folder
 */
gulp.task('lessDev', function () {
    var less = gulp.src(paths.src + 'css/less/styles.less', { debug: true })
        .pipe(gulpPlugins.lessSourcemap({
            sourceMap: {
              sourceMapRootpath: paths.src + 'css/less/*.less' // Optional absolute or relative path to your LESS files
            }
        }))
        .on('error', function (err) {
            /*eslint-disable*/
            console.log(err);
        })
        // .pipe(minifyCSS())
        .pipe(gulp.dest(paths.dist + 'css'));

    // var font = gulp.src(paths.src + 'css/*.ttf')
    //   .pipe(gulp.dest(paths.dist + 'css'));

    return merge(less);
});

/**
 * Zone only for Watch's task
 */
gulp.task('watch', function () {
    // gulp.watch(paths.src + '**/*', ['dev', 'copy-resources', 'copy-resources-html']);
    gulp.watch(paths.src + '**/*', ['build']);
});

/**
 * Zone for common task, like build, build-dev and so more.
 */
gulp.task('fast', ['clean', 'dev', 'dev:vendor', 'lint', 'lessDev', 'vendorDev', 'copy-resources', 'copy-resources-html']);
gulp.task('build', ['dev', 'dev:vendor', 'lessDev', 'vendorDev', 'copy-resources', 'copy-resources-html', 'lint']);
// Default Task
gulp.task('default', ['fast']);