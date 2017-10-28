var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');

// Loading all gulp plugins through this
// They will be reffered as $.pluginName
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*'], // the glob(s) to search for
    // config: 'package.json', // where to find the plugins, by default  searched up from process.cwd()
    // scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
    replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
    camelize: true, // if true, transforms hyphenated plugins names to camel case
    lazy: false, // whether the plugins should be lazy loaded on demand
    rename: {} // a mapping of plugins to rename
});

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var xtend = require('xtend');
var buffer = require('vinyl-buffer');
var transform = require('transform');
var del = require('del');

//var doStripDebug = getStripDebug($.util.env.type);
var envType = $.util.env.nodemon ?
    'nodemon' :
    $.util.env.type;
var endpoint = getEndpoint(envType);


function getEndpoint(envType) {
    // use nodemon for node local server
    // use default for local developmentN
    // use staging for global delivery
    switch (envType) {
        case 'prod' :
            return '';
            break;
        case 'staging':
            return '';
            break;
        case 'nodemon':
            return endpoint = "hsttp://localhost:8080";
            break;
        default:
            return endpoint = "http://localhost:8080";
            break;
    }
}

/**
 * If flag is provided it will take provided value
 * If no stripDebug argument is passed then default is false for test
 * and true for every other environment besides development
 */
function getStripDebug () {
    if ($.util.env.stripDebug !== undefined) return $.util.env.stripDebug;

    return envType !== 'test';
}

var paths = {
    assets: {
        root: './public/src/img',
        src: './public/src/img/**/*',
        dist: './public/dist/img'
    },
    scss: {
        root: './public/src/sass',
        src: './public/src/sass/**/*',
        dist: './public/dist/css'
    },
    js: {
        root: './public/src/js',
        src: './public/src/js/**/*',
        dist: './public/dist/js'
    },
    root: {
        base: './public',
        src: './public/src',
        dist: './public/dist'
    },
    api: endpoint
};

var watching = false;
gulp.task('enable-watch-mode', function () { watching = true });

gulp.task('create-config-JSON', function(cb) {
    return fs.writeFile(paths.js.root + '/config.json', JSON.stringify({
        config : {
            api: paths.api
        }
    }), cb);
});

gulp.task('create-config-module', ['create-config-JSON'], function () {
    return gulp.src(paths.js.root + '/config.json')
        .pipe($.ngConstant({
            name: 'app.config',
            wrap: 'commonjs'
        }))
        // Writes config.js to dist/ folder
        .pipe(gulp.dest(paths.js.root));
});


gulp.task('html2js', function() {
    return gulp.src(paths.js.src + '/**/partials/*.html')
        .pipe($.ngHtml2js({
            moduleName: 'templates-all'
        }))
        .pipe($.concat('templates-all.js'))
        //.pipe($.uglify())
        .pipe(gulp.dest(paths.js.dist + '/partials'))
        .pipe($.connect.reload());
});

gulp.task('copy-img', ['clean-img'], function () {
    return gulp.src([paths.assets.src])
        .pipe($.copy(paths.assets.dist, {prefix: 5}));
});

gulp.task('copy-index', ['clean-html'], function () {
    return gulp.src([paths.root.src + '/index.html'])
        .pipe($.copy(paths.root.dist, {prefix: 2}));
});


gulp.task('scss', ['clean-css', 'copy-img'], function () {
    //development css task
    return $.rubySass(paths.scss.src, {
        style: 'expanded',
        sourcemap: true,
        noCache: true,
        quiet: true,
        stopOnError: true
    })
        .pipe($.sourcemaps.init({loadMaps: true}))
        .pipe(buffer())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scss.dist))
        .pipe($.connect.reload());
});

gulp.task('scss-prod', ['copy-img'], function () {
    //production css task
    return $.rubySass(paths.scss.root, {style: 'nested', sourcemap: false, quiet: true})
        .pipe($.prefix({cascade: true}))
        .pipe(gulp.dest(paths.scss.dist));
});


gulp.task('js', ['clean-js', 'create-config-module'], function () {
    var opts = {
        entries: [String(paths.js.root + '/app.js')],
        debug: true,
        extensions: ['.js']
    };

    if (watching) {
        opts = xtend(opts, watchify.args);
    }
    var bundler = browserify(opts);
    bundler = watchify(bundler);
    // keep transformer out of the bundle otherwise the build performance
    // will take a big hit and the development will be severly slower
    // bundler.transform(babelify.configure({
    //      sourceMaps: false,
    //      extensions: ['.js']
    //  }));

    bundler.on('update', function (ids) {
        $.util.log('File(s) changed: ' + $.util.colors.cyan(ids));
        $.util.log('Rebundling...');
        rebundle();
    });

    function rebundle () {
        return bundler
            .bundle()
            .on('error', function (e) {
                $.util.log('Browserify Error', $.util.colors.red(e));

                this.emit('end');
            })
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe(gulp.dest(paths.js.dist))
            .pipe($.connect.reload());
    }
    return rebundle();
});

gulp.task('js-prod', ['clean-js', 'create-config-module'], function () {
    var opts = {
        entries: String(paths.js.root + '/app.js'),
        debug: false
    };
    var bundler = browserify(opts);

    function rebundle () {


        return bundler
            // this runs ideally only once so it's ok to transform here
            //.transform(babelify)
            .bundle()
            .on('error', function (e) {
                $.util.log('Browserify Error', $.util.colors.red(e));
            })
            .pipe(source('app.js'))
            .pipe(buffer())
            .pipe($.uglify())
            .pipe($.stripDebug())
            .pipe(gulp.dest(paths.js.dist));
    }
    return rebundle();
});

gulp.task('connect', function () {
    //gulp.src('./src/')
    //    .pipe($.webserver({
    //        livereload: true,
    //        fallback: './index.html',
    //        open: true,
    //        directoryListing: false,
    //        port: 4000
    //    }));


    // connect might be deprecated but runs better then webserver
    // if we have problems running gulp-connect it would be better to
    // use gulp-webserver
    return $.connect.server({
        livereload: true,
        root: paths.root.dist,
        port: 4000
    });
});

gulp.task('clean', function () {
    return del([paths.root.dist]);
});

gulp.task('clean-html', function () {
    return del([paths.root.dist + '/index.html']);
});

gulp.task('clean-css', function () {
    return del([paths.scss.dist]);
});

gulp.task('clean-img', function () {
    return del([paths.assets.dist]);
});

gulp.task('clean-js', function () {
    //return del([paths.js.dist]);
});

gulp.task('nodemon', function () {
    if (!$.util.env.nodemon)
        return;

    return $.nodemon({
        script: './server.js',
        ignore: ['index.html', './public', './gulpfile.js'],
        env: { 'NODE_ENV': 'development' }
    })
        .on('restart', function () {
            console.log('restarted!')
        });
});


/**
 * For production builds, stop gulp when everything is finished
 */
gulp.on('stop', function () {
    if (!watching) {
        process.nextTick(function () {
            process.exit(0);
        });
    }
});

gulp.task('watch', ['enable-watch-mode', 'connect'], function() {});

gulp.task('default',
    ['nodemon', 'copy-index', 'enable-watch-mode', 'scss', 'html2js', 'js', 'connect'],
    function () {
        gulp.watch(paths.scss.src, ['scss']);
        gulp.watch(paths.root.src + '/index.html', ['copy-index']);
        gulp.watch(paths.js.src + '/**/partials/*.html', ['html2js']);
    });