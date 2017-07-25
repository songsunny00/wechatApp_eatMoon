//app.js
App({
  w:340,
  h:736,
  panelH:508,
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this;
    console.log(this.globalData.userInfo)
    if(this.globalData.userInfo){
      
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res1) {
          console.log(res1);
          wx.request({
            url: 'https://websong.club/user/getWechatUser.action',
            data: {
              code: res1.code
            },
            method:'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              if (res.data.msgCode){
                var openId=res.data.data;
                wx.getUserInfo({
                  success: function (res) {
                    var _user={
                      id:openId,
                      avatarUrl: res.userInfo.avatarUrl,
                      nickName: res.userInfo.nickName
                    }
                    console.log(_user);
                    that.signin(_user);
                    that.globalData.userInfo = _user;
                    typeof cb == "function" && cb(that.globalData.userInfo);

                  }
                });

              }
            }
          })
        }
      });
    }
  },
  globalData:{
    userInfo:null
  },
  signin:function(user){
    wx.request({
      url: 'https://websong.club/user/signin.action', 
      data: user,
      method:'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    });
  }
})