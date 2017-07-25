//index.js
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    w: app.w,
    h: app.panelH,
    gamepanelShow:true,
    gameBgImgTop1:0,
    gameBgImgTop2:0,
    score: 0,
    guidePanelHide: 'block',
    isGameStart:false,
    isPlayerMoving: false,
    isGameoverPanel:true,
    isResultPanel:true,
    isShare:true,
    scorecontent: '',
    userInfo:{}
  },
  bgSpeed:46,
  bgHeight:736,
  bgDistance:0,
  bgloop:0,
  player:null,
  stage:null,
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  },
  //开始游戏
  startGame:function(event){
    this.setData({
      guidePanelHide: 'none',
      isGameStart:true,
      gamepanelShow:false
    });
    this.stage = wx.createCanvasContext('stage');
    //创建飞船
    this.player = new Ship(this.stage);
    this.run(this.stage);
  },
  //停止游戏
  stop:function(){
    setTimeout(function () {
      clearTimeout(gameMonitor.timmer);
    }, 0);
  },
  //运行游戏
  run:function(ctx){
    var that=this;
    that.rollBg();
    ctx.clearRect(0, 0, app.w, app.panelH);
    //创建飞船
    that.player.paint();
    that.eat(that.player, gameMonitor.foodList);

    //产生月饼
    that.genorateFood(ctx);

    //绘制月饼
    for (var i = gameMonitor.foodList.length - 1; i >= 0; i--) {
      var f = gameMonitor.foodList[i];
      if (f) {
        f.move(ctx);
      }
    }
    ctx.draw();
    gameMonitor.timmer = setTimeout(function () {
      that.run(ctx);
    }, 500);

  },
  //重玩游戏
  replay:function(){
    this.setData({
      isResultPanel:true,
      gamepanelShow:false
    });
    this.reset();
    this.startGame();
  },
  //重置游戏
  reset: function () {
    gameMonitor.foodList = [];
    gameMonitor.timmer = null;
    gameMonitor.time = 0;
    this.bgloop=0;
    this.setData({
      score:0
    });
  },
  //分享
  share:function(){
    wx.navigateTo({
      url: '../logs/logs?id='+this.data.userInfo.id
    })
  },
  //查看排行榜
  sort:function(){
    wx.navigateTo({
      url: '../sort/sort'
    })
  },
  //玉兔移动
  bindtouchstart: function (event){
    if (this.data.isGameStart){
    this.player.setPosition(event);
    this.setData({
      isPlayerMoving:true
    })
    }
  },
  bindtouchmove:function(event){
    if (this.data.isPlayerMoving){
      var _playerObj=this.player.setPosition(event);
    }
  },
  bindtouchend:function(){
    this.setData({
      isPlayerMoving: false
    });
  },
  //背景滚动
  rollBg: function () {
    var that=this;
    if (that.bgDistance>= that.bgHeight) {
      that.bgloop = 0;
    }

    that.bgloop=that.bgloop+1;
    that.bgDistance=that.bgloop * that.bgSpeed;
    that.setData({
      gameBgImgTop1: that.bgDistance,
      gameBgImgTop2: that.bgDistance - that.bgHeight
    })
    
  },
  //产生月饼
  genorateFood:function(ctx){
    gameMonitor.time++//计算游戏时间
    var genRate = 6; //产生月饼的频率
    var genNum=2;//产生月饼的次数
   
    for (var i = 0; i < genNum;i++){
    var random = Math.random();
    if (random * genRate > genRate - 1) {
      var left = Math.random() * (this.data.w - 50);
      var type = Math.floor(left) % 6;
      switch (type){
        case 1:type=1;
        break;
        case 2: type = 2;
        break;
        case 3: type = 4;
        break;
        case 4: type = 5;
        break;
        default:type=0;

      }
      var id = gameMonitor.foodList.length;
      var f = new Food(type, left, id);
      gameMonitor.foodList.push(f);
    }
    }
  },
  //吃月饼
  eat: function (player,foodlist){
    var that=this;
    for (var i = foodlist.length - 1; i >= 0; i--) {
      var f = foodlist[i];
      if (f) {
        var l1 = player.top + player.height / 2 - (f.top + f.height / 2);
        var l2 = player.left + player.width / 2 - (f.left + f.width / 2);
        var l3 = Math.sqrt(l1 * l1 + l2 * l2);
        if (l3 <= player.height / 2 + f.height / 2) {
          foodlist[f.id] = null;
          if (f.type == 0) {//吃到坏月饼，游戏结束
            that.stage.clearRect(0, 0, app.w, app.panelH);
            that.stop();
            that.setData({
              gamepanelShow:true,
              isGameoverPanel:false
            });
            setTimeout(function () {
              that.setData({
                isGameoverPanel: true,
                isResultPanel:false
              });
              that.getScore();
            }, 2000);
          }
          else {
            that.setData({
              score: that.data.score + f.type*10,
            });
          }
        }
      }
    }
  },
  //游戏结果
  getScore:function(){
    var _score = this.data.score;
    var that=this;
    that.saveScore({ 'score': _score,'id':that.data.userInfo.id})
    var level = gameMonitor.scoreLevel(_score);
    var result = gameMonitor.gameResultList(_score)
    that.setData({
      scoreLevel: level
    });
    WxParse.wxParse('scorecontent', 'html', result.scorecontent , that);
  
  },
  //保存游戏分数
  saveScore:function(data){
    console.log(data);
    wx.request({
      url: 'https://websong.club/user/saveInfo.action',
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
      }
    })

  },
  //用户转发
  onShareAppMessage:function(){
    return {
      title: '疯狂吃月饼吧！',
      path: '/page/index2'
    }
  }
});

function Ship(ctx) {
  this.width = 80;
  this.height = 80;
  this.left = app.w/2-40;
  this.top = app.panelH-80;
  this.paint = function () {
    ctx.drawImage('../../static/img/player.png', this.left, this.top, this.width, this.height);
  }
  var tarL, tarT;
  this.setPosition = function (event) {
    tarL = event.changedTouches[0].x;
    tarT = event.changedTouches[0].y;
    this.left = tarL - this.width / 2 - 16;
    this.top = tarT - this.height / 2;
    if (this.left < 0) {
      this.left = 0;
    }
    if (this.left > app.w - this.width) {
      this.left = app.w - this.width;
    }
    if (this.top < 0) {
      this.top = 0;
    }
    if (this.top > app.panelH - this.height) {
      this.top = app.panelH - this.height;
    }
    this.paint();
  }
}
var gameMonitor = {
  time: 0,
  //score: 0,
  foodList: [],
  timmer:null,
  //游戏分数等级设置
  scoreLevel: function (_score){
    var x;
    console.log(_score)
    switch (true) {
      case _score>=500: x = "宇宙棒";
        break;
      case _score>=400: x = "超给力";
        break;
      case _score >= 300: x = "给力";
        break;
      case _score >= 100: x = "加油";
        break;
      case _score >= 0: x = "真遗憾";
        break;
      default: x = "给力";
    }
    console.log(x);
    return x;
  },
  //游戏结果列表
  gameResultList: function (score){
    var list={
      bad: '<span>真遗憾，您竟然<span class="lighttext">一个</span>月饼都没有抢到！</span>',
      good: '<p>您在<span id="stime" class="lighttext">' + gameMonitor.time/2 + '</span>秒内抢到了<span id="sscore" class="lighttext">' + score + '</span>个月饼</p>'
     
    }
    var result={};
    if (score==0){
      result={
        scorecontent:list.bad
      }
    }else{
      result = {
        scorecontent: list.good
      }
    }
    return result;
  }
}
function Food(type, left, id) {
  this.speedUpTime = 300;
  this.id = id;
  this.type = type;
  this.width = 50;
  this.height = 50;
  this.left = left;
  this.top = -50;
  this.speed = 10 * Math.pow(1.2, Math.floor(gameMonitor.time / this.speedUpTime));
  this.loop = 0;

  var p;
  switch(type){
    case 1: p ='../../static/img/food1.png';
    break;
    case 2: p ='../../static/img/food2.png';
    break;
    case 4: p = '../../static/img/food4.png';
    break;
    case 5: p = '../../static/img/food5.png';
    break;
    default: p = '../../static/img/food0.png';
  }
  this.pic = p;
}
Food.prototype.paint = function (ctx) {
  ctx.drawImage(this.pic, this.left, this.top, this.width, this.height);
  //ctx.draw();
}
Food.prototype.move = function (ctx) {
  if (gameMonitor.time % 60 === 0) {//每60回合加速
    this.speed *= 1.2;
  }
  this.top += ++this.loop * this.speed;
  if (this.top > gameMonitor.h) {
    gameMonitor.foodList[this.id] = null;
  }
  else {
    this.paint(ctx);
  }
}