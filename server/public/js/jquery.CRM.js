/*
 * CRM项目插件集合
 */
//定义GetActionTable的构造函数
var GetActionTable = function(ele, opt) {		
		this.$element = ele,
			//默认参数
			this.defaults = {
				'action':'',//接口名字
				"dataObj": {}, //获取数据对象
				'dataConNameArray':[],
				'dataConValArray':[],
				'title':'',
				"firstTh":"",
				"lastTh":"",
				"firstTd":"",
				"lastTd":"",
				"tdList":[],//获取td字段，按此顺序
				"tdListClass":[],//需要隐藏的该值的字段
				'successFun':'',//成功回调函数
				'errorFun':''//失败回调函数
			}
			//合并参数
		this.options = $.extend({}, this.defaults, opt);
		$("#titls").text(this.options.title);
	}

	//定义GetActionTable方法
	GetActionTable.prototype = {
		    errorFun:function(){
		    	/*if(this.options.errorFun){
		    		window[this.options.errorFun]();
		    	}*/
		    },
		    successFun:function(funName){
		    	if(funName){
		    		window[funName]();
		    	}
		    },
			getTable: function(dataCon,type) {
				console.log(dataCon);
				var _options=this.options;
				var _$element=this.$element;
				console.log(dataCon);
				gajax(this.options.action, dataCon, function(data) {
					console.log(data);
					var obj,html="";
					//判断回调的要取数据的对象
					if(_options.dataObj){
						var jsonData=new JsonData(data);
			            obj=jsonData.getValByName(_options.dataObj);
					}else{
						obj=data;
					}
			        var len=obj.length;
			        $(".totalNum").text(data.iTotalRecords); //总记录
		            if(type != CRM.type_print) { //不是打印获取
			            cust.pageRows = cust.pageRows - 0;
			            cust.pages = parseInt((data.iTotalRecords + cust.pageRows - 1) / cust.pageRows); //总页数
			            $(".containMain-Bottom .currPage").text(cust.currPage + 1);
			            $(".containMain-Bottom .pages").text(cust.pages);
			            $(".containMain-Bottom .pageRow").text(cust.pageRows);
		            }
				    for(var i = 0; i < len; i++) {
					    var _obj = new JsonData(obj[i]);
					    html+='<tr name="'+_obj.getValByName(_options.tdList[0])+'">';
					    //处理默认第一个td
					    html+=_options.firstTd;
					    //处理要获取的字段
					    for(var j=1;j<_options.tdList.length;j++){
					    	html+='<td name="'+_options.tdList[j]+'" class="'+_options.tdListClass[j]+'">'+_obj.getValByName(_options.tdList[j])+'</td>';
					    }
					    //处理默认第一个td
					    html+=_options.lastTd;
					    html+='</tr>';
				    }
				 
				    if(type==CRM.type_print){//打印获取
    	                $(".fixedTh2 table tbody").html("");
		                $(".fixedTh2 table tbody").append(html);
		                //makeThTdSame();//将获取的th的class赋予td，使一致
		                var title=$("#titls").text();
 	                    var fileName=$('title', parent.document).text();
		                excel("#masd",title,fileName);
                    }else{
                    	_$element.html("");
				        _$element.append(html);
                        makeThTdSame();//将获取的th的class赋予td，使一致
                    }
		            getFixedTabL();//生成固定左表格
		            fixedCol();//固定位置
		            fixedTop2($(".containMainBox-main"));//固定表头
		            if(type==1){
			            getPages();
		            }
		            if(_options.successFun){
		                window[_options.successFun]();
		            }
			    });
			}
		}
//定义OptSelect的构造函数
var OptSelect = function(ele, opt) {		
		this.$element = ele,
			//默认参数
			this.defaults = {
				'action':'',//接口名字
				"dataObj": {}, //获取数据对象
				"dataObjParam":{'value':'','txt':''},//指定option的value属性、text（）里数据值
				"initFirstOpt": "<option value=''>全部</option>",//指定显示第一个option
				"hideOpt":'value',//需要过滤掉option默认以value为准
				"hideOptVal":[]//需要过滤掉值为'？'的option
			}
			//合并参数
		this.options = $.extend({}, this.defaults, opt);
	}

	//定义ParentSelect方法
	OptSelect.prototype = {
		    successFun:function(){
		    	
		    },
			getOpts: function(dataCon) {
				var _options=this.options;
				var _$element=this.$element;
				gajax(this.options.action, dataCon, function(data) {
					var obj,html="";
					if(_options.dataObj){
						var jsonData=new JsonData(data);
			            obj=jsonData.getValByName(_options.dataObj);
					}else{
						obj=data;
					}
			        var len=obj.length;
				for(var i = 0; i < len; i++) {
					var _obj = new JsonData(obj[i]);
					if(i == 0) html += _options.initFirstOpt;
					/**过滤要隐藏的opt**/
					var _hideOptVal;
					if(_options.hideOpt=='value'){_hideOptVal=_obj.getValByName(_options.dataObjParam.value);}
					else{_hideOptVal=_obj.getValByName(_options.dataObjParam.txt);}
					if(!IsArrayHasVal(_hideOptVal,_options.hideOptVal)){
						html += "<option value='" +_obj.getValByName(_options.dataObjParam.value)+ "'>" +_obj.getValByName(_options.dataObjParam.txt)+ "</option>";
					}
				}
				_$element.html("");
				_$element.append(html);
				OptSelect.prototype.successFun();
			    });
			}
		}
//定义JsonData的构造函数--处理回调函数返回的data
var JsonData = function(ele, opt) {		
		this.$element = ele,
			//默认参数
			this.defaults = {
				
			}
			//合并参数
		this.options = $.extend({}, this.defaults, opt);
	}
    JsonData.prototype={
    	getValByName:function(paramName){
    		//解析data对象的属性名
			var _val="";
            for(var p in this.$element){
                if(paramName==p){
                    _val=this.$element[p];
                }
            }
            return _val;
    	},
    	getObjParams:function(){
    		var _paramName = [];
            for(var p in this.$element){
             _paramName.push(p);   
            }
            return _paramName;
    	}
    }
//定义ParamData的构造函数--处理回调函数传的参数dataCon
var ParamData = function(paramNames, paramVals) {		
	//默认参数
	this.defaults = {
		'paramNames':paramNames,
		'paramVals':paramVals
	}
	this.options = $.extend({}, this.defaults);
}
    ParamData.prototype={
    	//获取处理后的jsonData
    	getJsonObj:function(){
    		var paramNames=this.options.paramNames;
    		var paramVals=this.options.paramVals;
    		//解析data对象的属性名
    		var _jsonData={};
			var _data="";
            for(var i=0;i<this.options.paramNames.length;i++){
            	if(i==0){_data+='{"'+paramNames[i]+'":"'+ParamData.prototype.isObj(paramVals[i])+'"';}
            	else{_data+=',"'+paramNames[i]+'":"'+ParamData.prototype.isObj(paramVals[i])+'"';}
                if(i==paramNames.length-1) _data+='}';
            }
            _jsonData=eval('(' + _data + ')');
            return _jsonData;
    	},
    	//判断是否对象
    	isObj:function(obj){
    		var _val="";
    		if(obj instanceof jQuery){
    			obj.val()?_val=obj.val():_val=obj.text()
    		}else{
    			_val=obj;
    		}
            return _val;
    	}
    }


/*
 //模板调用
	
 * */
;(function($, window, document, undefined) {
	//项目模板筛选插件
	$.fn.modelSelect = function(optionPar,optionSon) {
		var self = this;
		//父级select
		var parentSelect=new OptSelect(this,optionPar);
		var par_paramData=new ParamData(optionPar.dataConNameArray,optionPar.dataConValArray);
		parentSelect.getOpts(par_paramData.getJsonObj());
		//子级select
		var sonSelect=new OptSelect(optionPar.sonSelect,optionSon);
		var son_paramData=new ParamData(optionSon.dataConNameArray,optionSon.dataConValArray);
		sonSelect.getOpts(son_paramData.getJsonObj());
		//模板筛选
		self.change(function(self) {
			if(!$(this).val()) {
				optionPar.sonSelect.addClass('hide'); 
				optionPar.sonSelect.val("");
			} else {
				optionPar.sonSelect.removeClass('hide');
		        sonSelect.getOpts(son_paramData.getJsonObj());
			}
			getSearchData();//getCustomerInfo(CRM.type_refreshAll);
		});
		//阶段筛选
		optionPar.sonSelect.change(function() {
			getSearchData();//getCustomerInfo(CRM.type_refreshAll);
		});

	}
	//搜索条件插件
	$.fn.searchData=function(){
		var self=this;
		$(this).find('input,select').change(function(){
			getSearchData();
		});
		$(this).find('input,select').keydown(function(e){
			if(e.which == 13) { // 判断所按是否回车键  
				getSearchData();
			}
		});
		$(this).find('button.searchBtn').keydown(function(e){
			if(e.which == 13) { // 判断所按是否回车键  
				getSearchData();
			}
		});
	}

})(jQuery, window, document);
//判断数组中是否包括该值
function IsArrayHasVal(val,array){
	var flag=false;
	if(array.length>0){
		for(var i=0;i<array.length;i++){
			if(val==array[i]) flag=true;
		}
	}
	return flag;
}
