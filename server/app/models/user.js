var  connection = require('../../config/database');
var  uid = require('../utils/uuid');//用于生成id
var common=require('./common');
var https=require('https');

function  User(user) {
    this.id=user.id;
    this.unionId=user.unionId;
    this.nickName=user.nickName;
    this.avatarUrl=user.avatarUrl;
    this.score=user.score;
    this.suportor=user.suportor;
    this.createAt=user.createAt;
    this.updateAt=user.updateAt;
    
}
var tableName = "user";
mysql = connection.getDbCon();
module.exports = User;
//新增用户
User.save = function  save(user,callback) {
    
    //插入数据库
    var sql ="insert into user (id,unionId,nickName,avatarUrl,createAt) values(?,?,?,?,?)";
    mysql.query(sql,[user.id,user.unionId,user.nickName,user.avatarUrl,common.todayDayTime],function(err,results,fields){
        if (err) {
            throw err;
        } else {
            //返回用户id
            return callback(null,1);
        }
    });    
};
//保存用户游戏分数
User.saveScore = function  saveScore(info,callback) {
    
    //插入数据库
    var sql ="update user set score="+info.score+" where id='"+info.id+"'";
    mysql.query(sql,function(err,results,fields){
        if (err) {
            throw err;
        } else {
            //返回用户id
            console.log('saveScore success')
            return callback(null,1);
        }
    });  
};
//保存用户好友助力
User.saveSuportor = function  saveSuportor(info,callback) {
    //插入数据库
    var sql ="update user set suportor=suportor+1 where id='"+info.uId+"'";
    mysql.query(sql,function(err,results,fields){
        if (err) {
            throw err;
        } else {
            return callback(null);
        }
    });  
};
//获取前30名用户
User.get =  function  get(userId, callback) {
        // 读取 users 集合
        var sql;
        if(userId) sql = "select * from (SELECT id,unionId,nickName,avatarUrl,score,suportor,(@rowNum:=@rowNum+1) as rowNo from user,(Select (@rowNum :=0) ) b ORDER BY (score+suportor*50) desc) t WHERE t.id='"+userId+"'";
        else sql = "SELECT * from user ORDER BY (score+suportor*50) desc limit 50";
        console.log(sql);
        mysql.query(sql,function(err,results,fields){
            if(err){
                throw err;
            }else{   
                if(results.length==0){
                    results=null;
                }else{
                    results=results;
                }
                callback(null,results);
                
            }
        });
};
//比较分数高低
User.compare=function(userInfo,callback){
    var id=userInfo.id;
    var currScore=userInfo.score-0;
    var hisScore,isHigher=false;
    //查询该用户之前的分数
    var sql='select score from user where id="'+id+'"';
    console.log(sql);
    mysql.query(sql,function(err ,results,fields){
        if(err){
            throw err;
        }else{
            console.log(results);
            if(results.length==0){
                results=null;
            }else{
                results=results[0];
                hisScore=results.score;
                if(hisScore<currScore) isHigher=true;
            }
            console.log(results);
            callback(null,isHigher);
        }

    });

}
//获取微信用户openId
User.getWechatOpenId=function(code,callback){
    // 小程序参数
    var APP_ID = 'wx30e833b56eb26ac7';
    var APP_SECRET = 'def314031841125434013eadaed2a2ea';
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid='
    +APP_ID+'&secret='+APP_SECRET+'&js_code='+code+'&grant_type=authorization_code';
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
            var result = JSON.parse(buff.toString());//不需要转编码,直接tostring  
            console.log(result);
            callback(null,result.openid);
        });  
    }).on("error", function (err) {  
        Logger.error(err.stack)  
        // callback.apply(null);  
        callback('error','');
    });

}
