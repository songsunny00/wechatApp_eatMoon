var  connection = require('../../config/database');
var  uid = require('../utils/uuid');//用于生成id
var common=require('./common');

function  Suportor(suportor) {
    this.id=suportor.id;
    this.uId=suportor.uId;
    this.unionId=suportor.unionId;
    this.nickName=suportor.nickName;
    this.avatarUrl=suportor.avatarUrl;
    this.createAt=suportor.createAt;  
}
var tableName = "suportor";
mysql = connection.getDbCon();
module.exports = Suportor;
//新增用户
Suportor.save = function  save(suportor,callback) {
    
    //插入数据库
    var sql ="insert into "+tableName+" (id,uId,unionId,nickName,avatarUrl,createAt) values(?,?,?,?,?,?)";
    mysql.query(sql,[suportor.id,suportor.uId,'wechatApp',suportor.nickName,suportor.avatarUrl,common.todayDayTime],function(err,results,fields){
        if (err) {
            throw err;
        } else {
            //返回用户id
            return callback(null);
        }
    });  
};
//查找用户
Suportor.find = function find(id,uId,callback) {
    //插入数据库
    var sql ="select * from suportor where id='"+id+"' and uId='"+uId+"'";
    mysql.query(sql,function(err,results,fields){
        if (err) {
            throw err;
        } else {
            if(results.length==0){
                results=null;
            }else{
                results=results;
            }
            callback(null,results);
        }
    }); 

}
//获取用户的好友助力军
Suportor.get = function  get(uId,callback) {
    
    //插入数据库
    var sql ="select * from suportor where uId='"+uId+"'";
    mysql.query(sql,function(err,results,fields){
        if (err) {
            console.log("throw err");
            throw err;
        } else {
            if(results.length==0){
                results=null;
            }else{
                results=results;
            }
            console.log('get suportors')
            callback(null,results);
        }
    });  
};

