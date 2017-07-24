# Gulp自动添加版本号

推荐使用[gulp-rev](https://github.com/sindresorhus/gulp-rev) + [gulp-rev-collector](https://github.com/shonny-ua/gulp-rev-collector)是比较方便的方法，结果如下:

	"/css/style.css" => "/dist/css/style-1d87bebe.css"    
	"/js/script1.js" => "/dist/script1-61e0be79.js"    
	"cdn/image.gif"  => "//cdn8.example.dot/img/image-35c3af8134.gif"

但是由于公司发布系统限制，如果用上面方法实现，每次更新都会积压过多过期无用的文件，我们预期效果是:

	"/css/style.css" => "/dist/css/style.css?v=1d87bebe"
	"/js/script1.js" => "/dist/script1.js?v=61e0be79"
	"cdn/image.gif"  => "//cdn8.example.dot/img/image.gif?v=35c3af8134"

怎么破?改上面两个Gulp插件是最高效的方法了。    

1. 安装Gulp  
  `npm install --save-dev gulp`

2. 分别安装gulp-rev、gulp-rev-collerctor  
 `npm install --save-dev gulp-rev`   
 `npm install --save-dev gulp-rev-collector`

3. 打开`node_modules\gulp-rev\index.js`

	>第133行 `manifest[originalFile] = revisionedFile;`    
	更新为: `manifest[originalFile] = originalFile + '?v=' + file.revHash;`

4. 打开`nodemodules\gulp-rev\nodemodules\rev-path\index.js`

	>10行 `return filename + '-' + hash + ext;`     
    更新为: `return filename + ext;`

5. 打开`node_modules\gulp-rev-collector\index.js`

	>31行 `if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) {`    
     更新为: `if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {`

6. 配置gulpfile.js, 可参考下面`gulpfile.js`代码

7. 结果达到预期，如下：    

	##### Css
   
		 background: url('../img/one.jpg?v=28bd4f6d18');
		 src: url('/fonts/icomoon.eot?v=921bbb6f59');

	#### Html

		 href="css/main.css?v=885e0e1815"
		 src="js/main.js?v=10ba7be289"
		 src="img/one.jpg?v=28bd4f6d18"


package.json:

	{
	  "devDependencies": {
	    "apache-server-configs": "2.14.0",
	    "archiver": "^0.14.3",
	    "del": "^1.1.1",
	    "glob": "^5.0.5",
	    "gulp": "^3.8.11",
	    "gulp-autoprefixer": "^2.1.0",
	    "gulp-changed": "^1.2.1",
	    "gulp-csslint": "^0.1.5",
	    "gulp-header": "^1.2.2",
	    "gulp-if": "^1.2.5",
	    "gulp-jshint": "^1.11.2",
	    "gulp-less": "^3.0.3",
	    "gulp-load-plugins": "^0.10.0",
	    "gulp-minify-css": "^1.2.0",
	    "gulp-minify-html": "^1.0.4",
	    "gulp-rev": "^5.1.0",
	    "gulp-rev-collector": "^1.0.0",
	    "gulp-uglify": "^1.2.0",
	    "gulp-util": "^3.0.6",
	    "jquery": "1.11.3",
	    "jshint": "^2.8.0",
	    "jshint-stylish": "^2.0.1",
	    "mocha": "^2.2.4",
	    "normalize.css": "3.0.3",
	    "run-sequence": "^1.0.2"
	  },
	  "engines": {
	    "node": ">=0.10.0"
	  },
	  "h5bp-configs": {
	    "directories": {
	      "archive": "archive",
	      "dist": "dist",
	      "src": "src",
	      "test": "test"
	    }
	  },
	  "homepage": "",
	  "license": {
	    "type": "MIT",
	    "url": ""
	  },
	  "name": "gulp-auto-version",
	  "private": true,
	  "scripts": {
	    "build": "gulp build",
	    "test": ""
	  },
	  "version": "1.0.0",
	  "dependencies": {}
	}


gulpfile.js

	var gulp = require('gulp'),
	    runSequence = require('run-sequence'),
	    gulpif = require('gulp-if'),
	    uglify = require('gulp-uglify'),
	    less = require('gulp-less'),
	    csslint = require('gulp-csslint'),
	    rev = require('gulp-rev'),
	    minifyCss = require('gulp-minify-css'),
	    changed = require('gulp-changed'),
	    jshint = require('gulp-jshint'),
	    stylish = require('jshint-stylish'),
	    revCollector = require('gulp-rev-collector'),
	    minifyHtml = require('gulp-minify-html'),
	    autoprefixer = require('gulp-autoprefixer'),
	    del = require('del');
	
	
	var cssSrc = ['main.less', 'layer-box.less', 'tag.less'],
	    cssDest = 'dist/css',
	    jsSrc = 'src/js/*.js',
	    jsDest = 'dist/js',
	    fontSrc = 'src/fonts/*',
	    fontDest = 'dist/font',
	    imgSrc = 'src/img/*',
	    imgDest = 'dist/img',
	    cssRevSrc = 'src/css/revCss',
	    condition = true;
	
	function changePath(basePath){
	    var nowCssSrc = [];
	    for (var i = 0; i < cssSrc.length; i++) {
	        nowCssSrc.push(cssRevSrc + '/' + cssSrc[i]);
	    }
	    return nowCssSrc;
	}
	
	//Fonts & Images 根据MD5获取版本号
	gulp.task('revFont', function(){
	    return gulp.src(fontSrc)
	        .pipe(rev())
	        .pipe(gulp.dest(fontDest))
	        .pipe(rev.manifest())
	        .pipe(gulp.dest('src/rev/font'));
	});
	gulp.task('revImg', function(){
	    return gulp.src(imgSrc)
	        .pipe(rev())
	        .pipe(gulp.dest(imgDest))
	        .pipe(rev.manifest())
	        .pipe(gulp.dest('src/rev/img'));
	});
	
	//检测JS
	gulp.task('lintJs', function(){
	    return gulp.src(jsSrc)
	        //.pipe(jscs())   //检测JS风格
	        .pipe(jshint({
	            "undef": false,
	            "unused": false
	        }))
	        //.pipe(jshint.reporter('default'))  //错误默认提示
	        .pipe(jshint.reporter(stylish))   //高亮提示
	        .pipe(jshint.reporter('fail'));
	});
	
	//压缩JS/生成版本号
	gulp.task('miniJs', function(){
	    return gulp.src(jsSrc)
	        .pipe(gulpif(
	            condition, uglify()
	        ))
	        .pipe(rev())
	        .pipe(gulp.dest(jsDest))
	        .pipe(rev.manifest())
	        .pipe(gulp.dest('src/rev/js'));
	});
	
	//CSS里更新引入文件版本号
	gulp.task('revCollectorCss', function () {
	    return gulp.src(['src/rev/**/*.json', 'src/css/*.less'])
	        .pipe(revCollector())
	        .pipe(gulp.dest(cssRevSrc));
	});
	
	//检测CSS
	gulp.task('lintCss', function(){
	    return gulp.src(cssSrc)
	        .pipe(csslint())
	        .pipe(csslint.reporter())
	        .pipe(csslint.failReporter());
	});
	
	
	//压缩/合并CSS/生成版本号
	gulp.task('miniCss', function(){
	    return gulp.src(changePath(cssRevSrc))
	        .pipe(less())
	        .pipe(gulpif(
	            condition, minifyCss({
	                compatibility: 'ie7'
	            })
	        ))
	        .pipe(rev())
	        .pipe(gulpif(
	                condition, changed(cssDest)
	        ))
	        .pipe(autoprefixer({
	            browsers: ['last 2 versions'],
	            cascade: false,
	            remove: false       
	        }))
	        .pipe(gulp.dest(cssDest))
	        .pipe(rev.manifest())
	        .pipe(gulp.dest('src/rev/css'));
	});
	
	//压缩Html/更新引入文件版本
	gulp.task('miniHtml', function () {
	    return gulp.src(['src/rev/**/*.json', 'src/*.html'])
	        .pipe(revCollector())
	        .pipe(gulpif(
	            condition, minifyHtml({
	                empty: true,
	                spare: true,
	                quotes: true
	            })
	        ))
	        .pipe(gulp.dest('dist'));
	});
	
	gulp.task('delRevCss', function(){
	    del([cssRevSrc,cssRevSrc.replace('src/', 'dist/')]);    
	})
	
	//意外出错？清除缓存文件
	gulp.task('clean', function(){
	    del([cssRevSrc ,cssRevSrc.replace('src/', 'dist/')]);
	})
	
	//开发构建
	gulp.task('dev', function (done) {
	    condition = false;
	    runSequence(
	         ['revFont', 'revImg'],
	         ['lintJs'],
	         ['revCollectorCss'],
	         ['miniCss', 'miniJs'],
	         ['miniHtml', 'delRevCss'],
	    done);
	});
	
	//正式构建
	gulp.task('build', function (done) {
	    runSequence(
	         ['revFont', 'revImg'],
	         ['lintJs'],
	         ['revCollectorCss'],
	         ['miniCss', 'miniJs'],
	         ['miniHtml', 'delRevCss'],
	    done);
	});
	
	
	gulp.task('default', ['build']);
