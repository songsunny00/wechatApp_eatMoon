# Gulp自动添加版本号

> 基于[gulp-rev](https://github.com/sindresorhus/gulp-rev) + [gulp-rev-collector](https://github.com/shonny-ua/gulp-rev-collector)根据文件MD5值自动添加版本号，提供修改插件改变`xxx-md5.xx`为`xxx.xx?v=md5`方法    
> 压缩JS、Css、Html    
> [Autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer)自动添加浏览器厂商兼容前缀

## 安装

	npm install

##  使用

	gulp  //正式发布
	gulp dev   //测试环境
	gulp clean  //清除缓存

##  配置

### 默认结果(`xxx-md5.xx`)：
	
	"/css/style.css" => "/dist/css/style-1d87bebe.css"    
	"/js/script1.js" => "/dist/script1-61e0be79.js"    
	"cdn/image.gif"  => "//cdn8.example.dot/img/image-35c3af8134.gif"

### 高级配置(`xxx.xx?v=md5`):

1. 打开`node_modules\gulp-rev\index.js`

	>第133行 `manifest[originalFile] = revisionedFile;`    
	更新为: `manifest[originalFile] = originalFile + '?v=' + file.revHash;`

2. 打开`nodemodules\gulp-rev\nodemodules\rev-path\index.js`

	>10行 `return filename + '-' + hash + ext;`     
    更新为: `return filename + ext;`

3. 打开`node_modules\gulp-rev-collector\index.js`

	>31行 `if ( path.basename(json[key]).replace(new RegExp( opts.revSuffix ), '' ) !== path.basename(key) ) {`    
     更新为: `if ( path.basename(json[key]).split('?')[0] !== path.basename(key) ) {`
	
#### 输出：

	background: url('../img/one.jpg?v=28bd4f6d18');
	src: url('/fonts/icomoon.eot?v=921bbb6f59');
	href="css/main.css?v=885e0e1815"
	src="js/main.js?v=10ba7be289"
	src="img/one.jpg?v=28bd4f6d18"
	

	