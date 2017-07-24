var Song_date = new Date();
var Song = {
    today: getNowDate(),
    todayTime:getTodayTime(),
    windowWidth: $(window).width(),
    windowHeight: $(window).height(),
    //
    center: function (obj) {
        obj.css({
            position: 'fixed',
            left: (Song.windowWidth - obj.outerWidth()) / 2,
            top: (Song.windowHeight - obj.outerHeight()) / 2
        });
    },
    //解析href参数
    getHrefParams:function(){
    	var wf = window.location.href;
        var _text = wf.substring(wf.indexOf("?") + 1).split("&");
        var len = _text.length;
        if (len == 0)return;
        for (var i = 0; i < len; i++) {
            var name = _text[i].split("=")[0];
            Song[name] = decodeURI(_text[i].split("=")[1]);
        }
    },
	//示例：Song.popup(0,"操作成功");
    popup: function (type,text) {//0错误，1成功,2加载，3加载消失
        var popup = $(".showpopup");
        var spanIcon="glyphicon glyphicon-ok-sign";//默认成功
        if(type==0 || type==4){
        	spanIcon="glyphicon glyphicon-info-sign";//失败
        }else if(type==5){//加载中
        spanIcon=""
        }else if(type==2){
        	spanIcon=text;
        	Song.blackbg.show();
        }
        if (popup.length == 0) {
            $("body").append("<div class='showpopup'><span class='"+spanIcon+"'></span><p>" + text + "</p></div>");
            popup = $(".showpopup");
        }
        if(type!=3){
            popup.html('<span class="'+spanIcon+'"></span><p>'+text+'</p>').show().css("opacity", "1");
        }
        if(type!=2 && type!=3 && type!=4&& type!=5){
        	setTimeout(function(){
 
            },1500);
            popup.stop(true, false).animate({"opacity": "0"}, 3000, function () {
                popup.hide();
            });
        }
        if(type==4){
        	
        	setTimeout(function(){
 
            },3500);
            popup.stop(true, false).animate({"opacity": "0"}, 4000, function () {
                popup.hide();
            });
        }
        if(type==3){
            popup.hide();
            Song.blackbg.hide();
        }  
    },
    //示例：Song.loading.show();
    loading: {
        loadingbox: $(".loading"),
        show: function () {
            var w = $(window).width();
            var h = $(document).height();
            if (Song.loading.loadingbox.length == 0) {
                $("body").append("<div class='loading'></div>");
                Song.loading.loadingbox = $(".loading");
            }
            Song.loading.loadingbox.show().css({"left": (w - 40) / 2 + "px", "top": (h - 40) / 2 + "px"});
        },
        hide: function () {
            Song.loading.loadingbox.hide();
        }
    },
    //示例：Song.blackbg.show();
    blackbg: {
        zhezhao: $(".zhezhao"),
        show: function () {
            var h = $(document).height();
            if (Song.blackbg.zhezhao.length == 0) {
                $("body").append("<div class='zhezhao'></div>");
                Song.blackbg.zhezhao = $(".zhezhao");
            }
            Song.blackbg.zhezhao.show().height(h);
        },
        hide: function () {
            Song.blackbg.zhezhao.hide();
        }
    },
    

    //示例：Song.setCookie('pass','123456', 2); // 存储一个带2小时的 cookie
     setCookie : function(name,value,expires,path,domain,secure) {
        var str = name+"="+encodeURI(value);
        if (expires) {
            Song_date.setTime(Song_date.getTime() + (expires*60*60*1000));//一个小时为单位
            var expires = "; expires="+Song_date.toUTCString();
            str += expires;
        }
        if (path) {
            str += "; path="+path;
        }
        if (domain) {
            str += "; domain="+domain;
        }
        if (secure) {
            str += "; secure";
        }
        document.cookie = str;
    },
    //示例：Song.getCookie('pass');
    getCookie: function (c_name) {
        var c_start = null, c_end = null;
        if(document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if(c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if(c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    },
    //示例：Song.clearCookie('pass');
    clearCookie:function(name){
       var exp = new Date();
       exp.setTime(exp.getTime() - 1);
       var cval=Song.getCookie(name);
       if(cval!=null)
       document.cookie= name + "="+cval+";expires="+exp.toUTCString();
    },

    back: function () {
        window.history.back();
    },
};
module.exports = Song;
function gajax(url,data,fun){	
    var urls=url;
    $.ajax({
        url:urls,
        type:"post",
        data:data,
        dataType:"json",
        cache:false, 
// xhrFields: {
//     withCredentials: true
//},
//crossDomain: true,
        error:function(){
             Song.popup(0,"网络连接失败"+urls);
        },
        success:fun
    });
}

//判断是否是汉字、字母、数字组成 
function isChinaOrNumbOrLett(s) {
	var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
	var re = new RegExp(regu);
	if(re.test(s)) {
	 return	s
	}else {
		Song.popup(0, "请输入正确的格式（汉字，字母，数字）");

	};
	if(s==""||s==undefined){
		Song.popup(0, "地址不能为空！");
	
	}
};
//判断是否是身份证
function isCardNo(card){  
   var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
   if(reg.test(card) === false){  
       Song.popup(0,"亲,请输入正确的身份证格式！");  
   }  
}  

//获取今天日期格式
function getNowDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
       currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
       
    return currentdate;
}
//判断是否是数字或字母 
function isNumberOrLetter(s) {
	var regu = "^[0-9a-zA-Z]+$";
	var re = new RegExp(regu);
	if(re.test(s)) {
    return	s
	} else {
		Song.popup(0, "请输入正确的格式（数字或者字母）");
	}
};
//判断是否手机
function checkPhone(strPhone) {
	var phoneRegWithArea = /^[0][1-9]{2,3}-[0-9]{5,10}$/;
	var phoneRegNoArea = /^[1-9]{1}[0-9]{5,8}$/;
	var prompt = "您输入的电话号码不正确!";
	if(strPhone.length > 9) {
		if(phoneRegWithArea.test(strPhone)) {
			return strPhone;
		} else {
		Song.popup(0, "联系方式不正确！请注意格式");
		
		}
	} else {
		if(phoneRegNoArea.test(strPhone)) {
		
		} else {
		Song.popup(0, "联系方式不正确！请注意格式");
		
		}
	}
};
//判断是否数字
function isNumber(s) {
	var regu = "^[0-9]+$";
	var re = new RegExp(regu);
	if(s.search(re) != -1) {
		return s;
	} else {
		Song.popup(0, "请输入正确的格式");
	}
};
//判断是否是数字或字母 
function isNumberOrLetter(s) {
	var regu = "^[0-9a-zA-Z]+$";
	var re = new RegExp(regu);
	if(re.test(s)) {
    return	s
	} else {
		Song.popup(0, "请输入正确的格式(数字或者字母)");
	}
};
//判断是否email
function checkEmail(strEmail) {
	var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	if(emailReg.test(strEmail)) {
		$(this).find(".of").removeClass("off");
	} else {
		$(this).find(".of1").removeClass("off");	
		Song.popup(0, "您输入的Email地址格式不正确！");

	} if(strEmail==""){		
		Song.popup(0, "邮箱不能为空！");
	}
};
//判断是否url
function checkUrl(urlString) {
	if(urlString != "") {
		var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
		if(!reg.test(urlString)) {
			Song.popup(0, "您输入的网址格式不正确！");
		}
	}else{
		Song.popup(0, "网址不能为空！");
	}
}
//制保留2位小数，如：2，会在2后面补上00.即2.00;将浮点数四舍五入，取小数点后2位      
function toDecimal2(x) { 
	if(x==""){x=0;}
        var f = parseFloat(x);    
        if (isNaN(f)) {    
            return '';    
        }    
        var f = Math.round(x*100)/100;    
        var s = f.toString();    
        var rs = s.indexOf('.');    
        if (rs < 0) {    
            rs = s.length;    
            s += '.';    
        }    
        while (s.length <= rs + 2) {    
            s += '0';    
        }      
        return s;    
}
//制保留4位小数
function toDecimal4(x) {
	if(x==""){x=0;}
        var f = parseFloat(x);    
        if (isNaN(f)) {    
            return '';    
        }    
        var f = Math.round(x*10000)/10000;    
        var s = f.toString();    
        var rs = s.indexOf('.');    
        if (rs < 0) {    
            rs = s.length;    
            s += '.';    
        }    
        while (s.length <= rs + 4) {    
            s += '0';    
        }      
        return s;    
} 
//判断是否正确的日期格式
function isDate(d){
   	var PatternsDict= /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/; 
   	if(PatternsDict.test(d)){
   		return s
   	}else{
   		Song.popup(0, "请输入正确的日期格式YYYY-MM-DD");
   	}
}
//去掉空格
function cTrim(sInputString, iType) {
	var sTmpStr = ' ';
	var i = -1;
	if(iType == 0 || iType == 1) {
		while(sTmpStr == ' ') {
			++i;
			sTmpStr = sInputString.substr(i, 1);
		}
		sInputString = sInputString.substring(i);
	}
	if(iType == 0 || iType == 2) {
		sTmpStr = ' ';
		i = sInputString.length;
		while(sTmpStr == ' ') {
			--i;
			sTmpStr = sInputString.substr(i, 1);
		}
		sInputString = sInputString.substring(0, i + 1);
	}
	return sInputString;
};
//今天时间
function getTodayTime(){
	var d = new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var hour_ex = "";
    var minute_ex = "";
   
    if (hour < 10) {
        hour_ex = "0";
    }
    if (minute < 10) {
        minute_ex = "0";
    }
    return hour_ex + hour + ":" + minute_ex + minute;	
}
//时间转日期时间
function formatDate() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();
    var month_ex = "";
    var date_ex = "";
    var hour_ex = "";
    var minute_ex = "";
    var second_ex = "";
    if (month < 10) {
        month_ex = "0";
    }
    if (date < 10) {
        date_ex = "0";
    }
    if (hour < 10) {
        hour_ex = "0";
    }
    if (minute < 10) {
        minute_ex = "0";
    }
    if (second < 10) {
        second_ex = "0";
    }
    return year + "-" + month_ex + month + "-" + date_ex + date + " " + hour_ex + hour + ":" + minute_ex + minute + ":" + second_ex + second;
}
//时间戳转日期时间
function formatDateToDay(d) {
    if (d == null)return "";
    var d = new Date(d);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var month_ex = "";
    var day_ex = "";
    if (month < 10) {
        month_ex = "0";
    }
    if (day < 10) {
        day_ex = "0";
    }
    return year + "-" + month_ex + month + "-" + day_ex + day;
}
//日期字符串转时间戳
function toTimeStamp(str){
	var timestamp2 = new Date(str);
	timestamp2=timestamp2.getTime()-24*60*60*1000;
    //timestamp2 = timestamp2 / 1000;
    return timestamp2;
}
//日期差
function diffDate(date1,date2){
	var times1 = date1.getTime();
	var times2=date2.getTime();
    return (times1-times2)/(24 * 60 * 60 * 1000);
}
//判断val是否为null
function isNull(val) {
    var actVal = "";
    if (val || val == 0) {
        actVal = val;
    }
    if(val=="NULL" || val=="null"){
    	actVal="";
    }
    return actVal;
}
//设置popup下textarea类的宽度
function setAreaWidth(){
	var inputW=$(".popup .textInput.lg").width()+16;
	var w=($(".popup").width()-140)/2+inputW;
	$(".popup .textarea").width(w);
}
//弹窗位置
function popupLocation(){
	var popObj=$(".popup");
	var popH=popObj.height();
	popObj.css("margin-top","-"+(popH/2+30));
}
//检查是否登录失效
function checkLogin(){
	if( $(".main iframe.on").contents().find('.loginPanel').length>0){
    	location.href="/Song/sso/tologin.action";
    }
}
//登录失效，重新登录
function loginAgain(){
	var loginUrl="/Song/sso/tologin.action";
    setTimeout(function(){
    	parent.location.href="/Song/sso/tologin.action";
    },1000);
    return;
}


function keyup(num,obj,show){ 
            var span1=$(show); 
            var textreas=$(obj); 
            var last=num-(textreas.val().replace(/[^\x00-\xff]/g,"aa").length); 

              textreas.attr("maxlength",last);
              
            if(textreas.val().replace(/[^\x00-\xff]/g,"aa").length){
            	if(last>0){
            		       span1.html("还可以输入"+"<span style='color:#CC0000'>"+(last/2)+"</span>"+"个"); 
            	}else{
            		
            		 	Song.popup(0,"不能再输入了！")
            	}
       
            } 
            else   {

         
            	 
            } 
        }

//获取数据字典
var publicLog={
	complexLevel:"",
	easyLevel:""
};
function getDictionary(id,obj){
	var dataCon={
		dictTypeId:id
	};
	gajax("/Song/user/getdictionary.action",dataCon,function(data){
       var html="";
       var defaultVal="";
       for(var i=0;i<data.length;i++){
       	if(data[i].Isable){
       		html+="<option value="+data[i].DictValue+">"+data[i].DictValue+"</option>";
       	}
       	if(data[i].IsDefault){defaultVal=data[i].DictValue;}
       }
       obj.html("");
       obj.append(html);
        if(defaultVal){
       	    obj.val(defaultVal);
       }
       if(obj.attr('name')=='complexLevel'){
       	 publicLog.complexLevel=html;
       	 console.log(publicLog.complexLevel);
       }
       if(obj.attr('name')=='easyLevel'){
       	 publicLog.easyLevel=html;
       }
      if(obj.attr('name')=='currency'){
       	 Song.currency=html;
       }
      if(obj.attr('name')=='payType'){
       	 Song.payType=html;
       }
      if(obj.attr('name')=='category'){
       	 Song.category=html;
       }
      // return html;
    });
}
$(function(){
	//获取当前用户
    Song_currUser=$('span.currUser',parent.document).text();
	setAreaWidth();
	$(window).resize(function(){
		setAreaWidth();
	});
	//点击会有弹窗出现的按钮.popupBtn类
	$(document).on("click",".popupBtn",function(){
 		var name=$(this).attr("name");
 		$(".popup").toggle();
 		$(".popup .body[name='"+name+"']").addClass("on").siblings().removeClass("on");
 		$(".popup button").show();
 	});
 	$(document).on("click",".popupBtn2",function(){
 		$(".popup button").show();
 	});
 	

	//关闭弹窗
	$(".popup .glyphicon-remove").click(function(){
		if($(".popup .lastRd").length>0 && $(".popup .lastRd").css('display')!="none"){//存在批量编辑
			getCustomerInfo(1);//更新表格
		}
		$(this).parent().parent().hide();
	});
	//关闭弹窗
	$(".popup .popCancel").click(function(){
		$(".popup .glyphicon-remove").click();
	});
	//点击查询ICON
	$(document).on("click","span.glyphicon-search",function(){
		
		var name=$(this).attr("name");
		$(".custPop[name='"+name+"']").show();
		$(".custPop[name='"+name+"']").find('input').val("");
		$(".custPop[name='"+name+"']").find('input').eq(0).focus();
		if(name){
			Song.blackbg.show();
		}
	});
	//日期改变
	$(document).on("change",".popup input[type='date']",function(){
		var currDate=$(this).val();
		var PatternsDict= /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/; 
   	    if(!PatternsDict.test(currDate)){
   	    	Song.popup(0,'日期格式错误！正确格式为YYYY-MM-DD');
			$(this).focus();
			
   	    }
	});
	$(document).on("keydown", "textarea", function(e) {
			 if(e.keyCode!=13) return;
             return $(this).val()+'\n'
              
			
	});
	//enter键跳下一个input
	$(document).on("keydown", "input,select", function(e) {
		if(e.which == 13) { // 判断所按是否回车键  
			var inputs = $("input,select,textarea"); // 获取表单中的所有输入框
			//登录
            if($(inputs).attr("name") == "logins") {
                $("#login").click();
            }
			var idx = inputs.index(this); // 获取当前焦点输入框所处的位置  
			if(idx == inputs.length - 1) { // 判断是否是最后一个输入框  

			} else {
				if(inputs.eq(idx + 1).attr('readonly')=='readonly'){
					idx=idx+1;
				}
				inputs.eq(idx + 1).focus(); // 设置焦点  
				inputs.eq(idx + 1).select(); // 选中文字  
			}
			//有“搜索”标志，按回车自动弹出弹窗
			if($(this).parent().find('.glyphicon-search').length>0){
				$(this).parent().find('.glyphicon-search').click();
				var inputValue=$(this).val();
				var inputName=$(this).attr('name');
				var name=$(this).parent().find('.glyphicon-search').attr('name');
				$(".custPop[name='"+name+"']").find("[name='"+inputName+"']").val(inputValue);
				$(".custPop[name='"+name+"'] .searchBtn").click();
			}
			
			return false; // 取消默认的提交行为  
		}
	});	
});

$(function(){
	
	
	if(	$(".sysMsgOher1 dl").length>0){


			window.onload = function() {
				
		
		var sums=0; var privilegeIds,tzCountMains,tzUrl,nowUrl;
		var htmls="";	
	$(".sysMsgOher1 dl").each(function(){
        	  var counts=$(this).find(".tzCount1").text();
        	    sums+=parseInt(counts);
        	    tzCountMain= $(this).find(".tzCountMain").text();
        	    console.log(tzCountMain)
        	   	  privilegeIds = $(this).find(".privilegeID").text();
		          privilegeIds = $.trim(privilegeIds);
	          	  tzCountMains= $.trim(tzCountMain);
	              nowUrl =window.document.location.href+tzUrl + "?privilegeID=" +privilegeIds+"&from="+privilegeIds;
	              htmls+= "<li class='tzCountMain' id=" + privilegeIds + "  name=" + nowUrl+ ">";
	              htmls+= "<span class='fl'>" + tzCountMains + "</span>" ;
	              htmls+="<span class='notice cn1'>" + privilegeIds + "</span>";
	              htmls+="<span class='fr num' style=''>" + counts+ "</span>" + "</li>";
        	 
	    
        })
	
 
        $(".noticeMain ul",parent.document).html("");
         $(".noticeMain ul",parent.document).append(htmls)
          $(".totals",parent.document).text("") 
        $(".totals",parent.document).text(sums)
}
		
		
	}else{
		   
		   
		   
		
		

		
	}
	
	
})










