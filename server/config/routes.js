
/*
 * GET home page.
 */
var User = require('../app/controllers/user')
var Suportor = require('../app/controllers/suportor')
module.exports = function (app) { 
//编写路由
  // User
  app.post('/user/signin.action', User.signin)
  app.post('/user/saveInfo.action', User.saveInfo)
  app.get('/user/getInfo.action', User.getInfo)
  app.post('/user/getMyInfo.action', User.getMyInfo)
  app.post('/user/getWechatUser.action',User.getWechatUser)
  //suportor
  app.post('/user/getSuportors.action',Suportor.getSuportors)
}
