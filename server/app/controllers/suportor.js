
var User = require('../models/user');
var Suportor = require('../models/suportor');
// getSuportors
exports.getSuportors = function(req, res) {
  var _id = req.body.id;
  Suportor.get(_id, function(err, suportors) {
    var msgCode=1,msg='getSuportors:ok';
    if (err) {
      msgCode=0;
      msg='getSuportors:fail:'+err;
      console.log("err:getSuportors ");
      console.log(err)
    }
    res.send({
      msgCode:msgCode,
      msg:msg,
      suportors:suportors
    });
  });
}



