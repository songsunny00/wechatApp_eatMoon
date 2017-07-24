var https=require('https');
var fs=require('fs');
var options = {
 key: fs.readFileSync('./214176816360720.key'),
 cert: fs.readFileSync('./214176816360720.pem')
};
var express=require('express');
var path=require('path');
var port=process.env.PORT || 443;
var app=express()//实例赋给变量
var session = require('express-session');
// request
var Request = require('request');
//var FileStore = require('session-file-store')(session);
var RedisStore = require('connect-redis')(session);
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');  // 静态文件处理
var bodyParser = require('body-parser');

app.set('views','./app/views/pages');
app.set('view engine','jade');

// 因为后台录入页有提交表单的步骤，故加载此模块方法（bodyParser模块来做文件解析），将表单里的数据进行格式化
app.use(bodyParser.urlencoded({extended: true}));

//app.use(express.cookieParser());
app.use(cookieParser());
app.use(session({//默认内存储存
  secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 60 * 1000 }
}));

app.use(function(req,res,next){
    res.locals = req.session;
    next();
});
// 小程序参数
var APP_ID = 'wx30e833b56eb26ac7';
var APP_SECRET = 'def314031841125434013eadaed2a2ea';
// 公众号参数
var APP_ID2 = 'wx468c55ab889a90b1';
var APP_SECRET2 = '6831292acb8bfeae528ede859a091022';
// 获取解密SessionKey
var getSessionKey = function(code, callback){
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
	+APP_ID+'&secret='+APP_SECRET+'&js_code='+code
	+'&grant_type=authorization_code';
	//{"session_key":"rc\/mlEyIFKhKZg4CmTayEw==","expires_in":7200,"openid":"o4uvs0Kt-69Kw5G2El07kvr7JOto"}
	var url2 = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APP_ID2+'&secret='+APP_SECRET2;
	//{"access_token":""}
	//获取用户信息and uninId
	var url3='https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN'
	https.get(url, function(res){
		var datas = [];  
        var size = 0;  
        res.on('data', function (data) {  
            datas.push(data);  
            size += data.length;  
        });  
        res.on("end", function () {  
            var buff = Buffer.concat(datas, size);  
            //var result = iconv.decode(buff, "utf8");//转码
            var result = buff.toString();//不需要转编码,直接tostring  
            
        });  
	}).on("error", function (err) {  
        Logger.error(err.stack)  
        callback.apply(null);  
    });
}

//开发环境打印
var morgan = require('morgan');
var logger = morgan('dev');
if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'));
  app.locals.pretty = true
  //mongoose.set('debug', true)
}

require('./config/routes')(app);
app.listen(port);
app.use(serveStatic(__dirname+'/public')); // 路径：public

console.log('server start success!'+port);


