'use strict';

import plugins		from 'gulp-load-plugins';
import yargs		from 'yargs';
import gulp			from 'gulp';
import browser		from 'browser-sync';
import panini		from 'panini';
import rimraf		from 'rimraf';
import fs            from 'fs';

// import webpackStream from 'webpack-stream';
// import webpack2      from 'webpack';
import named         from 'vinyl-named';


const $ = plugins();
const PATHS = {
	dist: "dist",
	assets: ['src/assets/**/*','!src/assets/{img,js,scss}/**/*'],
	sass: [
	"node_modules/bootstrap/scss"
	],
	entries: [
	"src/assets/js/app.js"
	]
};
const PORT = 8000;
const COMPATIBILITY = ["last 2 versions","ie >= 9","ios >= 7"];
const PRODUCTION = !!(yargs.argv.production);
let webpackConfig = {
	module: {
		rules: [
		{
			test: /.js$/,
			use: [
			{
				loader: 'babel-loader'
			}
			]
		}
		]
	}
}
function server(done) {
	browser.init({
		server: PATHS.dist, port: PORT
	});
	done();
}

function reload(done) {
	browser.reload();
	done();
}

function pages() {
	return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
	.pipe(panini({
		root: 'src/pages/',
		layouts: 'src/layouts/',
		partials: 'src/partials/',
		data: 'src/data/',
		helpers: 'src/helpers/'
	}))
	.pipe(gulp.dest(PATHS.dist));
}

function resetPages(done) {
	panini.refresh();
	done();
}

function clean(done) {
	rimraf(PATHS.dist, done);
}

function copy() {
	return gulp.src(PATHS.assets)
	.pipe(gulp.dest(PATHS.dist + '/assets'));
}

function sass() {
	return gulp.src('src/assets/scss/app.scss')
	.pipe($.sourcemaps.init())
	.pipe($.sass({
		includePaths: PATHS.sass
	})
	.on('error', $.sass.logError))
	.pipe($.autoprefixer({
		browsers: COMPATIBILITY
	}))
	.pipe($.if(PRODUCTION, $.cleanCss({ compatibility: 'ie9' })))
	.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
	.pipe(gulp.dest(PATHS.dist + '/assets/css'))
	.pipe(browser.reload({ stream: true }));
}

function javascript() {
	return gulp.src(PATHS.entries)
	.pipe($.rigger())
	.pipe($.sourcemaps.init())
	// .pipe(webpackStream(webpackConfig, webpack2))
	.pipe($.if(PRODUCTION, $.uglify()
		.on('error', e => { console.log(e); })
		))
	.pipe($.if(!PRODUCTION, $.sourcemaps.write()))
	.pipe(gulp.dest(PATHS.dist + '/assets/js'));
}

function images() {
	return gulp.src('src/assets/img/**/*')
	.pipe($.if(PRODUCTION, $.imagemin({
		progressive: true
	})))
	.pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

function watch() {
	gulp.watch(PATHS.assets, copy);
	gulp.watch('src/pages/**/*.html').on('all', gulp.series(pages, browser.reload));
	gulp.watch('src/{layouts,partials}/**/*.html').on('all', gulp.series(resetPages, pages, browser.reload));
	gulp.watch('src/assets/scss/**/*.scss').on('all', sass);
	gulp.watch('src/assets/js/**/*.js').on('all', gulp.series(javascript, browser.reload));
	gulp.watch('src/assets/img/**/*').on('all', gulp.series(images, browser.reload));
}



gulp.task('build',
	gulp.series(clean, gulp.parallel(pages, sass, javascript, images, copy)));
gulp.task('default', 
	gulp.series('build', server, watch));