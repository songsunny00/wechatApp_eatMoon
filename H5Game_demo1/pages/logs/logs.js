//logs.js
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    suportors: [],
    suportorNum:0,
    isShare:true,
    hasSuport:false,
    isSuportor:false//是否支持者
  },
  userId:null,
  onLoad: function (options) {
    var that = this;
    //获取用户的支持者
    console.log(options.id)
    wx.request({
      url: 'https://websong.club/user/getSuportors.action',
      data: { 'id': options.id },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msgCode) {
          that.setData({
            suportors: res.data.suportors,
            suportorNum: res.data.suportors ? res.data.suportors.length : 0
          })
        } else {
          console.log(res.data.msg);
        }
      }
    });
    //判断是用户还是支持者打开
    that.userId = options.id;
    app.getUserInfo(function (userInfo) {
      if (options.id != app.globalData.userInfo.id) {
        that.setData({
          isSuportor: true
        });
      }
      
    })
   
  },
  //参加游戏
  goGame:function(){
    wx.navigateTo({
      url: '../index2/index2'
    })

  },
  //邀请好友助力
  share:function(){
    var that=this;
    this.setData({
      isShare:false
    });
    setTimeout(function(){
      that.setData({
        isShare: true
      });
    },1000);
  },
  //为好友助力
  fighting:function(){
    var that=this;
    if(that.data.hasSuport){
      return;
    }
    wx.request({
      url: 'https://websong.club/user/saveInfo.action',
      data: { 
        'suportor': 1,
        'uId':that.userId,
        'id': app.globalData.userInfo.id,
        'nickName': app.globalData.userInfo.nickName,
        'avatarUrl': app.globalData.userInfo.avatarUrl
        },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msgCode) {
          if(res.data.status){//已经助力过
          console.log("has suported");
            that.setData({
              hasSuport:true
            })
          }else{
            console.log("suporting");
            var _user={
              'id': app.globalData.userInfo.id,
              'nickName': app.globalData.userInfo.nickName,
              'avatarUrl': app.globalData.userInfo.avatarUrl
            }
            var _suportors = that.data.suportors ? that.data.suportors : new Array();
            _suportors.push(_user);
            var _suportorNum = that.data.suportorNum+1;
            that.setData({
              hasSuport: true,
              suportors: _suportors,
              suportorNum: _suportorNum
            })
            
          }
          
        }
      }
    });
  },
  //用户转发
  onShareAppMessage: function () {
    return {
      title: '你的好友' + app.globalData.userInfo.nickName+'邀你吃月饼',
      path: '/pages/logs/logs?id=' + app.globalData.userInfo.id
    }
  }
})
