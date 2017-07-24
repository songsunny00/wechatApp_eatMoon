
var User = require('../models/user');
var Suportor = require('../models/suportor');
// signin
exports.signin = function(req, res) {
  var obj = req.body;
  var _user={
    unionId:'wechatApp',
    id:obj.id,
    nickName:obj.nickName,
    avatarUrl:obj.avatarUrl,
    score:0,
    friendNum:0
  }
  
  User.get(obj.id, function(err, user) {
    if (err) {
      console.log(err)
    }
    if(!user){
      User.save(_user,function(err,msgCode){
        if (err) {
          console.log(err)
        }
        res.send({
          msgCode:msgCode,
          msg:'save-user:ok'
        });
      });
    }
  });
}
//获取自己的排名信息
exports.getMyInfo = function(req, res) {
  var obj = req.body;
  User.get(obj.id,function(err, info) {
    var msgCode=1,msg='get mysort Info:ok';
    if (err) {
      msgCode=0;
      msg='get mysort Info:fial:'+err;
    }
    res.send({
      msgCode:msgCode,
      msg: msg,
      mySortInfo: info[0]
    })
  })
}

// userlist page
exports.getInfo = function(req, res) {
  User.get('',function(err, users) {
    var msgCode=1,msg='get User Info:ok';
    if (err) {
      msgCode=0;
      msg='get User Info:fial:'+err;
    }
    res.send({
      msgCode:msgCode,
      msg: msg,
      users: users
    })
  })
}
//保存用户分数信息
exports.saveInfo = function(req, res, next) {
  var info = req.body;
  if(info.score){
    User.compare(info,function (err,isHigher) {
      if(isHigher){
        User.saveScore(info,function(err,msg){
        var _msg=1;
        if (err) {
          _msg=0;
          console.log(err)
        }
        res.send({
          msg:_msg
        });
    });

      }
    })
    return;
  }
  //保存转发量
  if(info.suportor){
    var msgCode=1,msg,status=0;
    Suportor.find(info.id,info.uId,function(err,suport){
      if(!err && !suport){//没有为TA助力过
      Suportor.save(info,function(err) {
      if (!err) {
        User.saveSuportor(info,function(err){
        if (err) {
          msgCode=0;
          msg='saveUesrSuportor:fail:'+err;
        }
        });
      }else{
        msgCode=0;
        msg='saveSuportor:fail:'+err;
      }
      });
      }
      if(!err && suport){//已经为ta助力过
        status=1;
        msg:"already finghted:ok"
      }
      console.log(msgCode+msg+status);
      res.send({
          msgCode:msgCode,
          msg:msg,
          status:status//0,没有；1，已经助力过
      });
    });
    return;
  }
}
exports.getWechatUser = function(req, res) {
  var _code=req.body.code;
  User.getWechatOpenId(_code,function(err,openId){
     var msgCode=1,msg="getWechatUser:ok";
     if (err) {
      msgCode=0;
      msg="getWechatUser:fail:"+err;
     }
    res.send({
      msgCode:msgCode,
      msg:msg,
      data: openId
    })
  });
}


