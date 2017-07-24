//logs.js
var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    mySortInfo:{},
    users:[],
    animationTitle:{},
    animationData:{}
  },
 
  onLoad: function (options) {
    var that=this;
    //获取前50名
    wx.request({
      url: 'https://websong.club/user/getInfo.action',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msgCode) {
          that.setData({
            users: res.data.users
          })
        }
      }
    });
    //获取个人的排名信息
    wx.request({
      url: 'https://websong.club/user/getMyInfo.action',
      method: 'POST',
      data: { 
        id: app.globalData.userInfo.id
        },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.msgCode) {
          that.setData({
            mySortInfo: res.data.mySortInfo
          })
        }
      }
    });
    
  },
  onShow:function(){
    //标题动画
    var animation1 = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1500,
      timingFunction: "ease",
      delay: 0
    });
    animation1.opacity(1).top('32%').step();
    this.setData({
      animationTitle: animation1.export()
    })
    //背景动画
    var animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 2000,
      timingFunction: "ease",
      delay: 1500
    });
    animation.height('400rpx').step();
    this.setData({
      animationData: animation.export()
    })

  },
  //返回游戏
  backToGame:function(){
    wx.navigateTo({
      url: '../index2/index2'
    })

  },
  //用户转发
  onShareAppMessage: function () {
    return {
      title: '你的好友' + app.globalData.userInfo.nickName+'邀你吃月饼',
      path: '/pages/logs?id=' + app.globalData.userInfo.id
    }
  }
})
