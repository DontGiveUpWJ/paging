//四川CRM快捷键设置 
/*$.hotkeys.add("ctrl+Q",function(){top.$(".ind-goodsInfo").click();});//打开商品信息
$.hotkeys.add("Alt+1",function(){top.$("#phoneno").focus();});//默认号码输入框获取焦点
$.hotkeys.add("Alt+2",function(){top.$("#J_crmKey").focus();});//快速转入输入框获取焦点
$.hotkeys.add('Alt+w', function(){top.loopFirstTab();}); // 循环切换一级tab
$.hotkeys.add('Alt+q', function(){top.loopSecondTab();}); // 循环切换二级tab
$.hotkeys.add('Ctrl+w', function(){top.$("#J_crmDeskUl .on .crm-close").click();}); // 关闭当前一级tab


$.hotkeys.add('ctrl+0', function(){top.doCtrl("Ctrl+0");});
$.hotkeys.add('ctrl+1', function(){top.doCtrl("Ctrl+1");});
$.hotkeys.add('ctrl+2', function(){top.doCtrl("Ctrl+2");});
$.hotkeys.add('ctrl+3', function(){top.doCtrl("Ctrl+3");});
$.hotkeys.add('ctrl+4', function(){top.doCtrl("Ctrl+4");});
$.hotkeys.add('ctrl+5', function(){top.doCtrl("Ctrl+5");});
$.hotkeys.add('ctrl+6', function(){top.doCtrl("Ctrl+6");});
$.hotkeys.add('ctrl+7', function(){top.doCtrl("Ctrl+7");});
$.hotkeys.add('ctrl+8', function(){top.doCtrl("Ctrl+8");});
$.hotkeys.add('ctrl+9', function(){top.doCtrl("Ctrl+9");});*/
//top窗口对象转换，在JQ中
//用于首页面dialog-plus中
//var topWind = top;

$(function(){
	var url = ""+window.document.URL;
	var uri = new Uri(url);
	var flumeKey=uri.getQueryParamValue("flumeKey");
	if(url.indexOf("flumeKey")>0){
		window.eagleEyeKey=_ajaxUtil.post('/wsgapp/rs/hawkeye/'+flumeKey+'/initraceid',function(data){return data.data},{eagleEyeKey:flumeKey},false);
	}else{
		window.eagleEyeKey=parent.window.eagleEyeKey;
	}
 }
);
 
/** 导出表格到excel
 *  过滤导出列的方法：在第一行需要过滤的列添加class属性“noExport”,若不添加，则默认导出全部列
 *  edit by jiangxl 添加勾选导出功能，添加参数chkname，
 * * */
function exportToExcel(tableid,chkname) //读取表格中每个单元到EXCEL中 
{ 
     var curTbl = document.getElementById(tableid);
     if(chkname==undefined) chkname="";
     var curChk = $("[name='"+chkname+"']");
     var oXL;
     
       try{
    	   oXL = new ActiveXObject("Excel.Application"); //创建AX对象excel 
       }catch(e){
           dalert("无法启动Excel!\n\n如果您确信您的电脑中已经安装了Excel，"+"那么请调整IE的安全级别。\n\n具体操作：\n\n"+"工具 → Internet选项 → 安全 → 自定义级别 → 对没有标记为安全的ActiveX进行初始化和脚本运行 → 启用");
           return false;
       }

     var oWB = oXL.Workbooks.Add();//获取workbook对象 
     var oSheet = oWB.ActiveSheet;//激活当前sheet 
     var Lenr = curTbl.rows.length;//取得表格行数
     oSheet.Cells.NumberFormatLocal = "@";//设置单元格数字格式为文本
     var n=0;
     var m=0;
     if(curChk!=undefined&&Lenr>curChk.length) n=-1;
     for (i = 0; i < Lenr; i++,n++) 
     { 
    	 if(!(chkname!=""&&i>0&&!curChk[n].checked)){
	         var Lenc = curTbl.rows(0).cells.length;//取得总列数 
	         for (j = 0,k = 0; k < Lenc; j++,k++) 
	         { 
	        	 if($(curTbl.rows(0).cells(k)).hasClass('noExport')){//根据第一行的列属性判断该列是否导出
	        		 j--;//不导出则停留当前列等待写入数据
	        	 }else{
	        		 oSheet.Cells(m + 1, j + 1).value = curTbl.rows(i).cells(k).innerText; 
	        	 }
	         } 
    		 m++;  
    	 }
     } 
     oXL.Visible = true;//设置excel可见属性 
}

var __oparams = getUrlParms();
var __confmap = {environment:"develop"};	//开发环境develop   测试环境test 仿真环境simulate 生产环境product

var sisSysnExcute = false;//是否同步执行成功 弹出框和成功回调函数 true为同步
var fisSysnExcute = false;//是否同步失败成功 弹出框和失败回调函数 true为同步
var currentCode = false;
var debug = true;
//$.param()方法设置，防止数据变量名后加[]
jQuery.ajaxSettings.traditional = true;

var mySetTimeout = function(callback, timeout, param) {
	var args = Array.prototype.slice.call(arguments, 2);
	var callb = function() {
		callback.apply(null, args);
	};
	setTimeout(callb, timeout);
}


/** 返回结果封装  flag规则成功失败标识 msg提示信息 tp标签* */
function MsgObj(flag, msg, tp) {
	this.flag = flag;
	this.message = msg;
	this.tp = tp;
}

function insertAfter(target, src) {
	var parentObj = src.parentNode;
	if (parentObj.lastChild == src) {
		parentObj.appendChild(target);
	} else {
		parentObj.insertBefore(target, src.nextSibling);
	}
}

/** bol为false时表示验证未通过,id位服务端生成的唯一id,obj为MsgObj对象,src为校验元素(规则函数参数列表最后一个对象ID)* */
function showMsg(src, obj, id,warningType,opPagePath) {
	var bol = obj.flag;
	var msg = obj.message;
	if (bol === false) {
		var intType = parseInt(warningType);
		switch(intType){
			case 0:
					errorMsg(src, obj, id);//再后追加错误文字形式
					chBorder(src, id);
					//src.focus();
				break;
			case 1:
					chBorder(src, id);
					alert(msg);
					//src.focus();
				break;
			case 2:
					chBorder(src, id);
					var param = {message:msg};
					window.showModalDialog(en_URI(getBasePath()+opPagePath+(opPagePath.indexOf("?")>0?"&":"?")+$.param(param)),msg,"center=yes;dialogWidth=300px;dialogHeight=160px");
					//src.focus();
				break;
				default:
					alert("Unknow the warningType:"+warningType);
				break;
		}
	} else {
		chNullBorder(src,id);
	}
}

function getAbsTop(obj) {
	var t = obj.offsetTop;
	while (obj.offsetParent != null) {
		obj = obj.offsetParent;
		t += obj.offsetTop;
	}
	return t;

}
function getAbsLeft(obj) {
	var l = obj.offsetLeft;
	while (obj.offsetParent != null) {
		obj = obj.offsetParent;
		l += obj.offsetLeft;
	}
	return l;
}

/** 提示信息方式** */

function alertMsg(src, obj, id) {
	alert(obj.message);
}

function chBorder(src,id) {
	//insertAfter(span,src);
	src.style.color = "red";
	src.style.borderColor = "red";
	
}

function errorMsg(src, obj, id){
	var top = getAbsTop(src);
	var left = getAbsLeft(src);
	var width = src.offsetWidth;
	var height = src.offsetHeight;
	var sumleft = left + width;
	var span = document.createElement("span");
	span.setAttribute("id", id + "-c");
	span.style.cssText="text-align:center;background:#dd0000;height:30px;line-height:30px; padding:0 5px; margin:0 3px;color:white;position:absolute;top:"+ top + "px;left:" + sumleft + "px;z-index:9999;";
	//span.setAttribute("style","text-align:center;background:#dd0000;height:30px;line-height:30px; padding:0 5px; margin:0 3px;color:white;position:absolute;top:"+ top + "px;left:" + sumleft + "px;z-index:9999;");
	var textNode = document.createTextNode(" " + obj.message + " ");
	span.appendChild(textNode);
	document.body.appendChild(span);
	mySetTimeout(removeDiv, 3000, id + "-c");
}

function chNullBorder(src, id) {
	src.style.color = "";
	src.style.borderColor = "";
//	window.setTimeout(removeDiv, 3000, id + "-a");
}

function successMsg(src, obj, id){
	var top = getAbsTop(src);
	var left = getAbsLeft(src);
	var width = src.offsetWidth;
	var height = src.offsetHeight;
	var sumleft = left + width;

	var span = document.createElement("span");
	span.setAttribute("id", id + "-a");
	span.setAttribute("style",
			"text-align:center;background:#00A600;color:white;position:absolute;top:"
					+ top + "px;left:" + sumleft + "px;z-index:9999;");
	var textNode = document.createTextNode(" " + obj.message + " ");
	span.appendChild(textNode);
	document.body.appendChild(span);
}

function removeDiv(id) {
	document.body.removeChild(document.getElementById(id));
}

//将参数值放入map中
function setParamValue(map,key,value){
	value = $.trim(value);
	if(key){
		if(map[key]!=null){
			if($.isArray(map[key])){
				map[key].push(value);
			}else{
				var values = new Array();
				values.push(map[key]);
				values.push(value);
				map[key] = values;
			}
		} else{
			map[key] = value;	
		}
	}
}
/**
 * 处理加密数据
 * @param value
 * @param param
 * @returns
 */
function getEncryptValue(value,encryptType){
	switch(encryptType){
	case 0://不加密
		break;
	case 1://base64
	case 2://base64-des
	case 3://base64-login
		value = base64encode(utf16to8(value));
		break;
	}
	
	return value;
}

/**
 * 处理加密数据
 * @param value
 * @param param
 * @returns
 */
function getDecodeValue(value,encryptType){
	switch(encryptType){
	case 0://不加密
		break;
	case 1://base64
		value = base64decode(utf8to16(value));
		break;
	}
	
	return value;
}

/**
 * error ajax请求服务错误
 * @param xhrObj
 * @param txtStatus
 * @param errorThrown
 */
function serviceError(xhrObj, txtStatus, errorThrown){
	//避免回车事件冒泡,把弹出窗口关掉，使用setTimeout
	var readyState,status;
	if(xhrObj){
		 readyState = xhrObj.readyState;
		 status = xhrObj.status;
	}
	setTimeout(function(){
		showDialog({title:'错误',content:"服务异常，请稍后重试",moretips:errorThrown+"  ;readyState:"+readyState+" ;status"+status,type:'错误'});
	},1);
}

//setPageParamVals(2000097977,params.ROOT.BODY.BUSI_INFO.ATTR_PARAM[pn].GROUP_ID,page,0,1,params); 
//setPageParamVals(2000097992,params.ROOT.BODY.BUSI_INFO.ATTR_PARAM[pn].GROUP_TYPE,page,0,1,params);

/**
 * 获取页面元素的值
 * @author jiangxl
 * param	要设置的参数ID 
 * paramFrom	参数类型
 * encryptType	加密类型
 * values	初始参数
*/
function getPageParamValName(values,param,paramFrom,encryptType){
	var obj;
	var key="";
	var value="";
	obj=document.getElementById(param);
	if (obj === undefined || obj==null) {	//如果对象不存在，或者有重复
		var objs;
		objs = $("[protoid='"+param+"']");
		/*if(objs.length>0){
			$.each(objs,function(i,n){
				key = n.getAttribute("name");
				value = getPageElementVal(n,encryptType);
				setParamValue(values,key,value);
			});
		}*/
		if(objs.length>0){// 优化
			obj=objs[0];
			var tr = $(obj).parents("tr");
			var auditFlag = false;	//该行的第一列是否是radio或者checkbox
			if(tr.length>0){
				try{
					var type = tr.find('td').eq(0).children(':first').attr("type");
					if(type == "radio" || type=="checkbox"){
						auditFlag = true;//if(paramType==2){//!auditFlag已包含此情况，这里用于table单个值对象或多个值数组
					}
				}catch(e){
					alert("The type of td's first child element is not input!");
				}
			}
			$.each(objs,function(i,n){//修复BUG parent()
				if(!auditFlag||$(n).parent("tr").find('td').eq(0).children(':first')[0].checked === true){
					key = n.getAttribute("name");
					value = getPageElementVal(n,encryptType);
					setParamValue(values,key,value);
				}
			});
			return values;
		}//else{//当配置的元素不存在时。。不允许不存在
			//return $.isEmptyObject(values)?"":values;//返回""，跳转页面传参BUG
		//}
	}else{
		key = obj.getAttribute("name");
		value = getPageElementVal(obj,encryptType,paramFrom);
		setParamValue(values,key,value);
	}
	return values;
	
}

/**
 * 获取页面元素的值/若要取当前行，可先放入input
 * @author jiangxl
 * param	要设置的参数ID 
 * paramFrom	参数来源
 * encryptType	加密类型
 * paramType	参数类型
*/
function getPageParamVals(param,paramFrom,encryptType,paramType){
	var obj;//obj元素必须存在，否则会导致值为"",后面值也都为""
	obj=document.getElementById(param);
	if (obj === undefined || obj==null) {	//如果对象不存在，或者有重复
		var objs;
		objs = $("[protoid='"+param+"']");
		var values = new Array();
		if(objs.length>0){
			obj=objs[0];
			var tr = $(obj).parents("tr");
			var auditFlag = false;	//该行的第一列是否是radio或者checkbox
			if(tr.length>0){
				try{
					var type = tr.find('td').eq(0).children(':first').attr("type");
					if(type == "radio" || type=="checkbox"){
						auditFlag = true;//已包含paramType==2情况，这里用于table单个或多个值数组
					}
				}catch(e){
					alert("The type of td's first child element is not input!");
				}
			}
			$.each(objs,function(i,n){//修复BUG  parent()
				$.each(objs,function(i,n){//修复BUG  parent()，不是所有页面需要parents
				var checked = '';
				if($(n).parent("tr")[0])$(n).parent("tr").find('td').eq(0).children(':first')[0].checked
				if(!$(n).parent("tr")[0])checked = $(n).parents("tr").find('td').eq(0).children(':first')[0].checked
				if(!auditFlag|| checked === true){
					var val = getPageElementVal(n,encryptType);
					values.push(val);
				}
			});
			});
			return values;
		}else{
			return "";//可能标签不存在，返回""，跳转页面传参BUG
		}
	}else{
		if(paramType==2){//!auditFlag已包含此情况，这里不用于table的单个值为数组
			var values = new Array();
			values.push(getPageElementVal(obj,encryptType));
			return values;
		}else{
			return getPageElementVal(obj,encryptType);
		}
	}
}

/**
 * 获取页面元素的值
 * @author jiangxl
*/
function getPageElementVal(obj,encryptType,paramFrom){
	if (obj == undefined || obj==null) {
		return "";//修复值为"",后面值也都为""的BUG
	}
	//根据id或者protoid，只查找到一个元素对象
	var value;
	if (obj.getAttribute("type") === "radio" || obj.getAttribute("type") === "checkbox") {
		//单选或多选，根据名字获取一组数据
		value = "";
		var key = obj.getAttribute("name");
		var checkedObj = $("[name='"+key+"']:checked");
		$.each(checkedObj,function(i,n){
			if(i>0){
				value += ",";
			}
			value += n.value;
		});
	}else if(obj.tagName=="A"){
		value = obj.innerHTML;
	}else if(obj.tagName=="TD"){
		value = obj.textContent;
		if(typeof(value)=="undefined"){
			value = $(obj).text();
			if(typeof(value)=="undefined"){
				value = obj.innerText;
				if(typeof(value)=="undefined"){
					value = obj.innerHTML;
				}
			}
		}
	}else if(30==obj.getAttribute("dynamictype")){
		value = '[';
		$(obj).find(':input[data-role="ued-datepicker"]').each(function(j,inputDate){
			value+='{"ID":"'+inputDate.id+'",';
			value+='"NAME":"'+inputDate.name+'",';
			//日期格式目前只支持4种
			if(inputDate.value.length>14 && inputDate.value.length<=19){
				value+='"VALUE":"'+inputDate.value.replace(/-/g,"").replace(/:/g,"").replace(/ /g,"").replace(/\//g,"")+'"}';
			}else if(inputDate.value.length>19){
				value+='"VALUE":"'+inputDate.value.replaceAll("[\u4e00-\u9fa5]+","").replace(/ /g,"")+'"}';
				}
			});
		$(obj).find(":input:not([data-role])").each(function(i,item){
			if(i>0){
				value += ",";
			}
			if("checkbox"==item.type){
				value+='{"ID":"'+item.id+'",';
				value+='"NAME":"'+item.name+'",';
				value+='"VALUE":"'+item.value+'",';
				value+='"CHECK":"'+item.checked+'"}';	
			}else if("radio"==item.type){
				value+='{"ID":"'+item.id+'",';
				value+='"NAME":"'+item.name+'",';
				value+='"VALUE":"'+item.value+'",';
				value+='"CHECK":"'+item.checked+'"}';							
			}else {
				value+='{"ID":"'+item.id+'",';
				value+='"NAME":"'+item.name+'",';
				value+='"VALUE":"'+item.value+'"}';							
			}
		});
		value += ']';
	}else{
		value = obj.value;
		if(typeof(value)=="undefined"&&paramFrom!="auto"){
			value = obj.innerText;
		}else if(typeof(value)=="undefined"&&paramFrom=="auto"){
			value = obj.innerHTML;
		}
		value = getEncryptValue(value,encryptType);
	}
	return value;
}

function addPageParamVals(param,vals){
	if (!(param == undefined || param==null || param.length == undefined ||vals == undefined)) {
		var paramval=JSON.stringify(param[0]);
		for(var pn=vals-param.length;pn>0;pn--){
			param.push($.parseJSON(paramval));
		}
	}
}

/**
 * 设置页面元素的值
 * @author jiangxl
 * param	要设置的元素ID 
 * paramname	要设置的元素参数类型：text等
 * paramFrom	参数类型: 1、javascript；2、request；
 * value	要设置、取值的元素ID 
*/
function setPageParamVals(param,paramname,paramFrom,value){
	var obj=document.getElementById(param);
	if (obj == undefined || obj==null) {	//如果对象不存在，或者有重复
		var objs;
		objs = $("[protoid='"+param+"']");
		if(objs.length>0){
			$.each(objs,function(i,n){
				setPageParamVal(n,paramname,paramFrom,value,i);
			});
		}
	}else{
		setPageParamVal(obj,paramname,paramFrom,value);
	}
}

/**
 * 设置页面元素的值
 * @author jiangxl
 * obj	要设置的元素
 * paramname	要设置的元素参数
 * paramFrom	参数类型: 1、javascript；2、request；
 * value	要设置的值 
*/
function setPageParamVal(obj,paramname,paramFrom,value,i){
	var valuetmp;
	if(paramFrom==1){
		if(typeof value=="function"){
			valuetmp=value(i);
		}else{
			valuetmp=value;
		}
	}else if(paramFrom==2){
		valuetmp=__oparams[value];
	}
	
	obj=$(obj);
	if(paramname=="html"){
		obj.html(valuetmp);
	}else if(paramname=="text"){
		obj.text(valuetmp);
	}else{
		obj.attr(paramname,valuetmp);
	}
	
}

//modify by luolin
function strSplit(str,splitChar){
	var args=new Object();
	var pairs=str.split(splitChar);	
	for(var i=0;i<pairs.length;i++)   
	{   
		var pos=pairs[i].indexOf('=');//查找name=value   
		if(pos==-1)   continue;//如果没有找到就跳过   
		var argname=pairs[i].substring(0,pos);//提取name   
		var value=pairs[i].substring(pos+1);//提取value
		args[argname]=decodeURIComponent(value);//解决所有乱码（但URL要先转义空格）
		//var date=value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
        //if(date==null){
			//value=value.replace(/%3A/g,":");
		//	args[argname]=decodeURI(value).replace(/%2F/g,"/").replace(/\+/g," ");//存为属性   /禁止使用unescape()解码，中文会乱码(去除/和空格)
		//}else{
		//	args[argname]=decodeURI(value).replace(/\+/g," ");//针对CRM临时解决方案（去除空格）
		//}		
	}
	return args;
}
//modify by luolin
function getUrlParms(){
	var query=location.search.substring(1);//获取查询串 
	query=query.replace(/\+/g," ");//恢复空格	
	return strSplit(query,"&");
}

/**
 * 前置条件获取页面元素的值
 * @author jiangxl
 * param	元素ID 
 * paramname	元素参数名
*/
function getPageElementNameVal(param,paramname){
	var val="";
	var obj=document.getElementById(param);
	if (obj == undefined || obj==null) {	//如果对象不存在，或者有重复
		var objs;
		objs = $("[protoid='"+param+"']");
		if(objs.length>0){
			$.each(objs,function(i,n){
				if(i>0)	val+="$$";
				n=$(n);
				if(paramname=="html"){
					val+=n.html();
				}else if(paramname=="text"){
					val+=n.text();
				}else{
					val+=n.attr(paramname);
				}
			});
		}
	}else{
		obj=$(obj);
		if(paramname=="html"){
			val=obj.html();
		}else if(paramname=="text"){
			val=obj.text();
		}else{
			val=obj.attr(paramname);
		}
	}
	return val;
}

function getElementValueById(id){
	var obj = $('#'+id); 
	if(obj[0]){
		if(obj[0].nodeName == 'TD'||
				obj[0].nodeName == 'LABEL'||
				obj[0].nodeName == 'SPAN'){
			return obj.text();
		}else{
			return obj.val();
		}
	}
	
	return "";
}

//pid=?
function stq_replaceAllB(text,str,data){
	
	var index = text.indexOf(str);
	if(index!=-1){
		//$("#pid=? [copy_id='886']")
		var pre =  text.substr(0,index);
		var tmp = text.substr(index+str.length); 
		var id = tmp.substr(0,tmp.indexOf("']"));
		var sufix = tmp.substr(tmp.indexOf(id)+id.length+2);
		text = pre+id+sufix;
		stq_replaceAllB(text,str,data);
	}else{
		var ary = text.split(";");
		for(var i =0,len=ary.length;i<len;i++){
			eval(ary[i]);
		}
	}
}


function stq_replaceAll(text,str,value,data){
	var index = text.indexOf(str);
	if(index!=-1){
		text = text.substr(0,index)+value+text.substr(index+str.length);
		stq_replaceAll(text,str,value,data);
	}else{
		var ary = text.split(";");
		for(var i =0,len=ary.length;i<len;i++){
			eval(ary[i]);
		}
	}
}

//火狐下获取event
function SearchEvent()
{
	func=SearchEvent.caller;
	while(func){
		var arg0=func.arguments[0];
		if(arg0){
			if((typeof(Event)!="undefined"&&arg0.constructor==Event)
					||(typeof(MouseEvent)!="undefined"&&arg0.constructor==MouseEvent)
					|| (typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation))// 如果就是event 对象
				return arg0;
		}
		func=func.caller;
	}
	return null;
}

/**
  给js增加replaceAll方法。 
* reallyDo 可以是正则 也可以是普通字符串。
*/
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}


// 跳转(分两种:1种是提交,需要校验收集参数的值,2种:不需要校验的,那么区分的标识就是next hidden的valid_params属性)
function hrefSend(config,params) {
	try{
		var action = config.action;
		var ext_a = config.extA;
		var ext_b = config.extB;
		var adaptiveh = config.adaptiveh;//自适应高度
		var dialogId = config.dialogId||new Date().getTime();//弹出框ID 
		var xFunc = config.cancelFunc;//弹出框X回调函数
		var dialogTitle = config.dialogTitle||'数据加载中';//弹出框标题
		var topDialog = config.topDialog;//是否弹出在top上
		//var ext_c = jQuery(obj).nextAll("input[active='" + event_name + actionId + "']").attr("ext_c");
		var service_type = config.serviceType;//jQuery(obj).nextAll("input[active='" + event_name + actionId + "']").attr("service_type");
		var returnMaps = config.returnMaps;// eval("("+jQuery(obj).nextAll("input[active='" + event_name + actionId + "']").attr("return_maps")+")");
		
		/*ext_a当bind_service_type为2时(打开页面)，此字段存放打开方式:0-->当前页面，1->新窗口，2->模态窗口；当bind_service_type为0或者1时(调用服务)，此字段存储tuxedo服务名称；*/
		/*ext_b当bind_service_type为2(打开页面)，ext1值为2(模态窗口)时，此字段存储模态窗口的样式；当bind_service_type为0或者1时(调用服务)，此字段存储调用tuxedo服务的参数顺序模板；*/
		
		var envcon=__confmap;
		if(service_type==5){
			if(envcon.environment=="test"){
				action = config.actionTest;
			}else if(envcon.environment=="simulate"){
				action = config.actionSimulation;
			}else if(envcon.environment=="product"){
				action = config.actionProduction;
			}
		}
		if(service_type!=5){
			action=getPagePath(action);
		}
		var hs = "?",url = en_URI(action);
		if(params&&!$.isEmptyObject(params)){
			if (action.indexOf("?") > 0) {
				hs = "&";
			}
			url += hs+ ($.param(params));
		}
		
		switch(parseInt(ext_a)){
			case 0:
				openPage(en_URI(url),params,"get","_self");
				break;
			case 1:
				openPage(en_URI(url),params,"get","_blank");
				break;
			case 2:
				var owparam = new Object();
				owparam.parentWindow=window;
				var returnValue = null;
				if(service_type == 5){//调用外部程序，返回值
					owparam.url = url;
					if(window.showModalDialog){
						returnValue = window.showModalDialog(url,owparam,ext_b);
					}else{
					   alert("当前浏览器不支持window.showModalDialog API");
					}
					if(returnValue){
						var dealDef = [];
						$.extend(true,dealDef,returnMaps);//复制一份配置信息，以免被修改
						dealWindowReturnValue(dealDef,returnValue);
					}
				}else{ 
					var ext=ext_b.replaceAll(':','":"').replaceAll(';','","');
					var s ="{\""+ext.substring(0,ext.length-3)+"\"}";
					var dialogUrl = url;
					s =$.parseJSON(s);
					var dialogHeight=adaptiveh==true?"":s.dialogHeight;//设置高度后无作用，因80 loading。。
					var xCancel=xFunc?xCancelFunc(dialogId,xFunc):null;
					var setWidth=s.dialogWidth.substr(0,3);
					var dialogWidth=setWidth<900?s.dialogWidth:getClientWidth(window, document,false);//自适应宽度:s.dialogWidth
					removeBlankIframes();
					showLoading(true,"加载中");
					var dialogParams = {
						id:dialogId,
						backdropOpacity: 0.07,
						url: dialogUrl,
						title: dialogTitle,
						cancelValue:'关闭',
						width: dialogWidth,
						height: dialogHeight,
						cancel:	xCancel,
						cancelDisplay:false,
						padding:'0',						
						data: owparam, // 给 iframe 的数据
						drag:true,
						fixed:true,
						keyEsc:true,//快捷键ESC快速关闭窗口
						onshow: function () {
							//var loading=$('<p id="loading_wait" class="warn-text pagination-centered" style="display: block;"><i class="ico-loading"></i><span>加载中</span></p>')[0];
							//this._$('content')[0].insertBefore(loading,this.iframeNode);
							//$(this.iframeNode).contents().find("head").append('<link rel="stylesheet" href="../../assets/css/app.css">');
							//$(this.iframeNode).contents().find("body").append('<p id="loading_wait" style="text-align: center ;"><i style="background: url(../../assets/images/loading.gif) center no-repeat;display: inline-block;width: 30px;height: 30px;vertical-align: bottom;margin-right: 7px;"></i><span>加载中...</span></p>');
							//this.__popup.hide();//防止未隐藏。。
						},
						onclose: function () {
							returnValue=this.returnValue;
							if(returnValue){
								 var dealDef = [];
								 $.extend(true,dealDef,returnMaps);//复制一份配置信息，以免被修改
								 dealWindowReturnValue(dealDef,returnValue);
							}
						},
						oniframeload: function () {
							var text = $(this.iframeNode).contents().find("title")[0].innerText;
							var localizedKey = $(this.iframeNode).contents().find("title")[0].getAttribute('text-i18n');
							if(localizedKey){
								this.title($.i18n.prop(localizedKey));
							}else {
								 this.title(text);
							}
						   $(this.iframeNode).contents().find("body").css({
								height:"100%",
								overflow:"auto"
							});
							//移除loading效果
							this._$('content').children().eq(0).remove();
							var api=null
							if( topDialog==true ) api = top.dialog.get(dialogId);
							else api = window.dialog.get(dialogId);
							if(api){
								this.showModal();//dialogId为html
							}

							//var that=this;
							//var tid=setInterval(tf, 200);//IE8不兼容							
							//function tfnc(){//IE8有问题。。。。
								//var tid = setTimeout(tfnc, 200);
								//console.log('tfnc')
								//if($(that.iframeNode).contents().find("body").height()>64){
									//that.showModal();
									//urlResetHeight(dialogId);
									//clearInterval(tid);
									//clearTimeout(tid);
									//console.log('showModal')
								//}
							//}
							//tfnc.call(this);							
						}
					}
					if( topDialog==true ) top.dialog(dialogParams);
					else dialog(dialogParams);
				}
				
				break;
			default:
				alert("Unknow openType:ext_a="+ext_a);
				break;
		}
	}catch(e){
		if(debug){
			alert("688"+e);
		}
	}
}

/**
 * 将模态窗口返回值赋给当前页面元素
 * @param map= {"":""}
 */
function dealWindowReturnValue(dealdefs,values){
	if(dealdefs){
		if(values){
			setValueToTable(dealdefs,values);
		}
		var type,elementId,key,js;
		for ( var i = 0, len = dealdefs.length; i < len; i++) {
			type = dealdefs[i].type;
			elementId = dealdefs[i].elementId;
			key = dealdefs[i].key;
			js = dealdefs[i].js;
			if('val'==type){//赋值
				if(values){
					var obj = $("#"+elementId);
					if(obj.length>0){
						var tag = obj[0].tagName;
						if(tag == "TABLE" || tag == 'TBODY'){
							
						}
						var value = '';
						if(key&&key != 'null'){
							value = values[key];
							if(value==undefined&&key&&key == 'returnValue'){
								value =  values;
							}
						}else{
							value = values[obj.attr("name")];
						}
						if($.isArray(values[key])){//返回多条数据暂未处理
							
						}else{
							setElementValue(obj,value);
						}
						//obj.trigger("change");
					}
				}
			}else if('js'==type){//运行自定义脚本
				if(js && js!='null'){
					var v = values;
					if($.isPlainObject(values)){						
					    if(/msie/.test(navigator.userAgent.toLowerCase())){
							//v =eval(values);//不清楚为什么ie中直接使用返回值会出错 
							v = {};
							$.extend(true,v,values);
						}
					}
					eval(js+'(v);');
				}
			}
		}
	}
}
//接收的是jquery的对象
function setElementValue(jdom,value){
	if(jdom.length>0){
		if(jdom[0].tagName == "TD"
			||jdom[0].tagName == "TH"
			||jdom[0].tagName == "SPAN"
			||jdom[0].tagName == "LABEL"){
			jdom.text(value);
		}else{
			jdom.val(value);
		}
		jdom.trigger('change');
	}
}

//自增table赋值  target table name = 'tableName'; src tr name = 'tableName_src' ;
var copySrcSuffix = '_src';//源命名规则，即后缀
function setValueToTable(dealdefs,values){
	if(values==null||$.isEmptyObject(values)){
		return;
	}
	var type,elementId,key;
	var tableIds = {};//记录需要增加行的table id：$obj
	//查找需要赋值的table
	for ( var i = 0, len = dealdefs.length; i < len; i++) {
		elementId = dealdefs[i].elementId;
		type = dealdefs[i].type;
		if('val'==type){//赋值
			var obj = $("#"+elementId);
			if(obj.length>0){
				var tag = obj[0].tagName;
				if(tag == "TABLE" || tag == 'TBODY'){
					tableIds[elementId] = obj;
					dealdefs[i].type = "table";
				}else if(tag == 'TR'){//copy源
					var srcName = obj.attr('name');
					var targetObj = $("[name="+srcName.substring(0,srcName.lastIndexOf(copySrcSuffix))+"]");
					if(targetObj.length>0){
						tableIds[elementId] = targetObj;
						dealdefs[i].type = "table";
					}
				}
			}
		}
	}
	//查找table中的定义要赋值的子元素
	for(var tbId in tableIds){
		var subItemDef = new Array();
		for ( var i = 0, len = dealdefs.length; i < len; i++){
			elementId = dealdefs[i].elementId;
			type = dealdefs[i].type;
			key = dealdefs[i].key;
			if('val'==type){//赋值
				var obj = $("#"+elementId);
				if(obj.length>0){
					var table = obj.parents("[id='"+tbId+"']");
					if(table.length>0){
						subItemDef.push(dealdefs[i]);
						dealdefs[i].type = "tableChild";
						var value = '';
						if(key&&key != 'null'){
							value = values[key];
						}else{
							value = values[obj.attr("name")];
						}
						if($.isArray(value)){
							dealdefs[i].values= value;
						}else{
							var vs = new Array();
							vs.push(value);
							dealdefs[i].values= vs;
						}
					}
				}
			}
		}
		var table = tableIds[tbId];
		
		//tr copy的源
		var copySource = $("[name="+table.attr('name')+copySrcSuffix+"][copy_sign='1']");
		var copySourceId;
		if(copySource.length>0){
			copySourceId = copySource[0].id;
		}
		//对子元素赋值
		var trs = new Array();//新生成的行
		$.each(subItemDef,function(i,n){
			elementId = n.elementId;
			key = n.key;
			value = n.values;
			if($.isArray(value)){
				for(var j =0;j<value.length;j++){
					//1、增加行
					var tr ;
					if(trs.length<=j){
						if(copySourceId){//有copy源
							tr = stq_copy('#'+table.attr('id'),copySourceId);
						}else{//没有copy源，增加一行空td
							var hasBody = false,hasHead = false;
							var prototrs,prototr;// = table.find("tr");
							var tbody = table.children("tbody");
							if(tbody.length>0){
								prototrs = tbody.children("tr");
								if(prototrs.length>0){
									prototr = prototrs[prototrs.length-1];
									if($(prototr).children("th").length>0){
										hasHead = true;
									}else{
										hasBody = true;
									}
								}
							}
							if(!hasBody&&!hasHead){
								prototrs = table.find("tr");
								if(prototrs.length>0){
									hesHead = true;
									prototr = prototrs[prototrs.length-1];
								}
							}
							if(hasBody&&prototr){
								tr = $(prototr).clone();
								table.append(tr);
							}else if(hasHead&&prototr){
								var tdSize = $(prototr).children().length;
								if(tdSize == 0){
									alert("取返回值失败，赋值给一个空表格");
									break;
								}
								//新建一个空行
								var newTr = "<tr>";
								for(var a =0;a<tdSize;a++){
									newTr += "<td></td>";
								}
								newTr += "</tr>";
								tr = $(newTr);
								table.append(tr);
							}else{
								alert('取返回值失败，赋值的表格为空！没有赋值规则');
								break;
							}
						}
						trs.push(tr);
					}else{
						tr = trs[j];
					}
					//2、给该行赋值
					//根据id 或者 copy_id赋值
					var obj = tr.find("#"+elementId);
					if(obj.length<=0){
						obj = tr.find("[protoid="+elementId+"]");
					}
					if(obj.length>0){
						setElementValue(obj,value[j]);
					}else{//根据title中的id赋值
						var th =  table.find("th");
						for(var m=0;m<th.length;m++){
							if(th[m].id == elementId){
								setElementValue($(tr.children()[m]),value[j]);
							}
						}
					}
				}
			}
		});
	}
}

//关闭模态窗口
function closeWindow(config,params){
	//window.returnValue = params;
	//window.close();
	//var dialog = top.dialog.get(window);//url top上
	var dialog = parent.dialog.get(window);//url window上
	if(dialog){
		dialog.close(params);
		dialog.remove();
	}
}

function getBasePath(){
	var locationa = (window.location+'').split('/');
	var basePath = locationa[0]+'//'+locationa[2];
	if(typeof __basePath !== 'undefined'){
		basePath = basePath + __basePath;
		return basePath;
	}else{
		return basePath + "/";
	}
}

function getPagePath(url){
	var url_tmp="";
	var bathpath=getBasePath();
	if(url.indexOf("/")>0){
		url_tmp=url.substring(0,url.indexOf("/"));
		if(url.indexOf("page")>0){
			url=url.replace("page","apps");
		}
		var index_ = bathpath.substring(0,bathpath.lastIndexOf("/")).lastIndexOf(url_tmp);
		if(!!index_){
			url = bathpath.substring(0,bathpath.lastIndexOf("/")).substring(0,index_)+url;
		}
	}
	return url;
}

function getGUID(){
	var str= function(){
		return (((1+Math.random()))*0x10000|0).toString(16).substring(1);
	}
	return (str()+str()+str()+str()+str()+str()+str()+str());
}
function en_URI_comp(str) {
	return encodeURIComponent(encodeURIComponent(str));
}
function en_URI(str) {
	return encodeURI(encodeURI(str));
}

//查找元素供 condition用,eventItem 触发事件的元素，id：要查找的元素，copyFlag：要查找元素是否可复制
function findElement(eventItem,id,copyFlag){
	if(copyFlag){
		var scrope = $(eventItem).parents('[copy_sign=0]');
		return scrope.find('[protoid='+id+']');
	}else{
		return $('#'+id);
	}
}

function lowercase(string) {
    return isString(string)? string.toLowerCase(): string;
};
function uppercase(string){
    return isString(string)? string.toUpperCase() : string;

};

function isString(value){
    return typeof value == "string";
}
var index = 1;
var base= getGUID();

/**
 * 获取element元素
 * @param reload_element_id
 * @param singleflag
 * @returns
 */
function getReloadElements(reload_element_id,singleflag){
	var targetElement = $("#"+reload_element_id);
	if(targetElement.length==0){
		targetElement = $("[protoid='"+reload_element_id+"'][singleflag='"+singleflag+"']");
	}
	return targetElement;
}

/**
 * 页面跳转 
 * @param url
 * @param param
 * @param method get/post
 * @param target _self _black 等
 */
function openPage(url,param,method,target){
	var form = document.createElement("form");
	form.action = url;
	form.method = method||"POST";
	form.target = target||"_self";
	if(!$.isPlainObject(param)){
		
	}
	for(var key in param){//IE8 BUG
		var value = param[key];
		var vs = $.isArray(value)?value:[value];
		for(var i=0;i<vs.length;i++){
			var input = document.createElement("input");
			input.name = key;
			input.value = vs[i];
			input.type = "hidden";
			form.appendChild(input);
		}
	}
	document.body.appendChild(form);
	form.submit();
}


/**
*
*静态分页js  //luolin modify
*增加Ul标签静态分页
*
**********/
function DFPaging(pageBarId,tableId, pageSize){//显示数组，每页的显示行数，显示的表名
	var dfPageing = {
		table : $(tableId),
		pageBar : $(pageBarId),
		pageSize : pageSize?pageSize:10
	}
	if(dfPageing.table[0].tagName=="TABLE"){
			dfPageing.refreshTable=function(curPage){ 
				if(dfPageing.table.find('thead').length){
					var start = (curPage-1)*dfPageing.pageSize;
					var end = start+dfPageing.pageSize;
					var trs = dfPageing.table.find('tbody').find("tr[data!='-1']");
					trs.addClass("none");
					for(var i=0;i<trs.length ;i++){
						if(i>=start&&i<end){
							$(trs[i]).removeClass("none");
						}else{
							$(trs[i]).addClass("none");
						}
					}
		
				}else{
					var start = (curPage-1)*dfPageing.pageSize;
					var end = start+dfPageing.pageSize;
					var trs = dfPageing.table.find("tr[data!='-1']");
					trs.addClass("none");
					if(dfPageing.table.find('tbody').find("tr[data!='-1']").eq(0).find('th').length){
						$(trs[0]).removeClass("none");
						start+=1;
						end+=1;
					}
					for(var i=0;i<=trs.length ;i++){
						if(i>=start&&i<end){
							$(trs[i]).removeClass("none");
						}else{
						}
					}
				}
				
			}
			
			dfPageing.pages=function(){
				var total = 0;//根据tr行数得到总记录数
				if (dfPageing.table.find('thead').length||!dfPageing.table.find('tbody').find("tr[data!='-1']").eq(0).find('th').length) {
		         	total = dfPageing.table.find('tbody').find("tr[data!='-1']").length;//表头放在thead中，tbody中全是数据tr
		         }else{
		         	total = dfPageing.table.find('tbody').find("tr[data!='-1']").length-1;//表头放在tbody中，多一个非数据tr。减1得到总记录数据
		         }
		
				var pages =  Math.ceil(total/dfPageing.pageSize);
				return pages;
			}
		}else{
				//刷新页面显示
				dfPageing.refreshTable = function(curPage) {
					var start = (curPage - 1) * dfPageing.pageSize;
					var end = start + dfPageing.pageSize;
					var lis = dfPageing.table.find("li[data!='-1']");
					lis.addClass("none");
					for(var i = 0; i <= lis.length; i++) {
						if(i >= start && i < end) {
							$(lis[i]).removeClass("none");
						}
					}
				};
				
				//获取页面的 总页数
				dfPageing.pages = function() {
					var total = dfPageing.table.find("li[data!='-1']").length; //根据li行数得到总记录数
					var pages = Math.ceil(total / dfPageing.pageSize);
					return pages;
				}
		}

	dfPageing.refreshPagingBar=function(curPage){
		curPage = Number(curPage);
//		var total = dfPageing.table.find('tbody').find("tr[data!='-1']").length;
		var pages=dfPageing.pages();
		if(curPage<0) curPage = 0;
		if(curPage>pages) curPage=pages;

		var html = '';
		var pref = '<li><a href="#" '+(curPage<=1?'class="disabled"':'')+' i='+(curPage-1)+'>«</a></li> ';
		var next = '<li><a href="#" '+(curPage==pages?'class="disabled"':'')+' i='+(curPage+1)+'>»</a></li> ';
		var last = '<li class="mgl-10">共'+pages+'页，到第<input id="inputPage" type="text" value="'+curPage+'">页<button class="btn btn-info btn-super-mini mgl-10">确定</button></li>'; 
		
		html += pref;
		
		var startPoint = 1;
		var endPoint = 5;

		if(curPage > 2) {
			startPoint = curPage - 2;
			endPoint = curPage + 2;
		}
		if(endPoint > pages) {
			startPoint = pages - 4;
			endPoint = pages;
		}
		if(startPoint < 1) {
			startPoint = 1;
		}
		for(var point = startPoint; point <= endPoint; point++) {
			var btn = '<li ' + (curPage == point ? 'class="active"' : '') + '><a href="#" i=' + point + '> ' + point + ' </a></li> ';
			html += btn;
		}
		html += next + last;
		dfPageing.pageBar.html(html);
	}
	
	dfPageing.pageBar.delegate('a','click',function(e){
		
		if($(this).attr('class')=='disabled'||$(this).parent().attr('class')=='active'){
			return;
		}
    	var jumpPage = $(this).attr('i');
    	dfPageing.refreshTable(jumpPage);
    	dfPageing.refreshPagingBar(jumpPage);
    	e.preventDefault;
    });
	
	dfPageing.pageBar.delegate("button","click",function(){
    	var jumpPage =$(this).parent().find('input[id="inputPage"]').val();
		var pages=dfPageing.pages();
        if(jumpPage&&jumpPage>0&&jumpPage<=pages){
    	dfPageing.refreshTable(jumpPage);
    	dfPageing.refreshPagingBar(jumpPage);
       }
    });
    
    dfPageing.init = function(){
    	dfPageing.refreshTable(1);
    	dfPageing.refreshPagingBar(1);
	}
    return dfPageing;
}


//弹出框问题
$(document).ready(function(){
	$('.ued-panel-1 h3').unbind();
});

var loadTimer = null;
$.fn.loading = function (options){
	if(options !="close"){
		if($("#UED-LOADING").size()){
			clearTimeout(loadTimer);
			$("#UED-LOADING").show();
		}else{
			$("body").append('<div class="ued-loading" id="UED-LOADING"><h4 class="load-media">加载中...</h4></div>');
		}
	}else{
		
		//loadTimer = setTimeout(function(){
			$("#UED-LOADING").hide();
			
		//}, 300);
	}
};

/**
 * 数组去重
 */
function unique(arr){
	var n = {},r=[]; //n为hash表，r为临时数组
	for(var i = 0; i < arr.length; i++) //遍历当前数组
	{
		if (!n[arr[i]]) //如果hash表中没有当前项
		{
			n[arr[i]] = true; //存入hash表
			r.push(arr[i]); //把当前数组的当前项push到临时数组里面
		};
	};
	arr = r;
	return arr;
};
/**
 * 参数去重
 * @param arr
 * @returns
 */
function uniqueParam(arr){
	var n = {},r=[]; //n为hash表，r为临时数组
	for(var i = 0; i < arr.length; i++) //遍历当前数组
	{
		if (!n[arr[i].param]) //如果hash表中没有当前项
		{
			n[arr[i].param] = true; //存入hash表
			r.push(arr[i]); //把当前数组的当前项push到临时数组里面
		};
	};
	arr = r;
	return arr;
};

/**局部刷新绑定公共控件*/
function reloadJs(id){
	if(id==undefined){
		return;
	}else if(typeof id == "string"){
		$("#"+id+"[data-role='ued-tabs'],#"+id+" *[data-role='ued-tabs']").UED_tabs();//加载标tab签页控件
		$("#"+id+"[data-role='ued-datepicker'],#"+id+" *[data-role='ued-datepicker']").UED_datePicker();//加载日期选择控件
        $("#"+id+"[data-role='ued-tableInterlace'],#"+id+" *[data-role='ued-tableInterlace']").UED_tableInterlace();
	}
}


/**
 * 国际化相关操作
 * @author：peisong
 */
function international($obj){
	//国际化
	 require(['cookie'  , "i18n"], function (cookieUtil , i18n) {
		
		var settings = {};
	    settings.name = "app_showMessage";//文件库名称
	    settings.language = cookieUtil.cookie('language'); //语言类型，实际应用中可传值或从cookie中读取
	    settings.path =__basePath+ "assets/lang/";
	    settings.cache = true;
	    if( settings.language == null || settings.language == undefined ){
	        settings.language = "zh_CN";
	    }
		i18n.init(settings);
		i18n.localize($obj);
	});
}

/**
 * dialog相关操作
 * @author peisong
 */
function showTipDialog(content,functionJS){
	closeProcessDialog();
	var content="<div><p text-i18n='"+content+"'></p></div>";
    dialog({
            title: " ",
            width: 340,
            data: '',
            content: content,
            okValue: "",
            ok: function() {if(functionJS) functionJS();}
    }).showModal();
    $(".ui-dialog-title").html("");
    $(".ui-dialog-title").attr("text-i18n", "page.text.dialog.notice");
	$(".ui-dialog-autofocus").html("");
	$(".ui-dialog-autofocus").attr("text-i18n", "page.text.dialog.ok");
	international($(".ui-dialog-grid"));
}

function closeProcessDialog(){
	$("body").find("div[role1='processdialog']").find(".ui-dialog-close").trigger("click");
}

function showErrorTipDialog(content){
	closeProcessDialog();
    dialog({
            title: " ",
            width: 340,
            data: '',
            content: content,
            okValue: "",
            ok: function() {}
    }).showModal();
    $(".ui-dialog-title").html("");
    $(".ui-dialog-title").attr("text-i18n", "page.text.dialog.notice");
	$(".ui-dialog-autofocus").html("");
	$(".ui-dialog-autofocus").attr("text-i18n", "page.text.dialog.ok");
	international($(".ui-dialog-grid"));
}

/**
 * 分页操作，使用laypage 插件
 * @author peisong
 */
function loadPagingBar(n, pageNum, fun,_pageSize) {
	require(["pageing","i18n"], function(Page , i18n) {
		var elem;
		if (n instanceof jQuery)
			elem = n;
		else
			elem = $("#"+n);
		var pageSize = _pageSize||elem.attr("pageSize") || 10; //每页条数

		var dataTotal = elem.attr("dataTotal") || 0; //数据总条数
		var iscentered = elem.attr("iscentered") || false; 
		var tId = elem.attr('id');
		var pagingDiv = $("#pageing_" + tId);
		var pageingContent = "<footer><nav class='pages page_div "+(iscentered=="true"?"pagination-centered":"pagination-right")+"' id='pageing_" + tId + "'></nav></footer>"
		if (pagingDiv.length == 0 || pageNum == '1' || pageNum == 1) {
			
			if (pagingDiv) pagingDiv.parent().remove();
			elem.after(pageingContent);
			//var pageSize = _pageSize||elem.attr("pageSize") || 10; //每页条数
			var total = elem.attr("pageTotal");
			Page("#pageing_" + tId, function(pageNum, first) {
				i18n.localize("#pageing_"+tId);	//分页国际化支持v
				if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
					fun(event,pageNum);
                    $("#pageing_" + tId).find('input[class="_skip"]').val(pageNum);
				}
				if(window.page_diaId){
					divResetHeight(window.page_diaId,window.page_defValue,window.page_divId,window.page_addHeight,window.isNeedAdjust,window.leftBarFlag);
					divPageResetHeight(0,0,0,0,false,false);
				}
			}, dataTotal, pageSize,true);
		}
	})
}

/**
 * 添加页面文字水印功能
 * @author luolin
 * 用法：addWaterMarker("金格平","aagh5P","2017年09月12日");里面的三个字符串参数可以是调服务获得的字段值
 */
function addWaterMarker(name,id,date){

		var str=name+"("+id+")"+date;
		var can = document.createElement('canvas');
		var body = document.body;

		body.appendChild(can);

		can.width=300;
		can.height=250;
		can.style.display='none';


		//var cans = can.getContext('2d');
		//cans.rotate(-20*Math.PI/180);
		//cans.font = "14px Microsoft yaHei"; 
		//cans.fillStyle = "rgba(17, 17, 17, 0.50)";
		//cans.textAlign = 'left'; 
		//cans.textBaseline = 'Middle';
		//cans.fillText(str,can.width/3,can.height/2);

		//body.style.backgroundImage="url("+can.toDataURL("image/png")+")";

}
/**
 * 防止页面拷贝和另存  
 * 局部页面防拷贝防另存：在body层动态配置勾选禁止copy。  整个页面防拷贝防右键另存：在成功函数中调用函数：preventSave();
 * @author luolin
 */
function preventSave(){
	document.oncontextmenu = function(evt) {//整个页面防右键另存
                evt.preventDefault();
    }

	document.onselectstart = function(evt) {//防拷贝
		evt.preventDefault();
	};
}

/**
 *  @author luolin
 *  input框模糊搜索功能数据处理回调函数
 *	request：一个对象带有一个 term 属性，表示当前文本输入中的值
 *	response： 一个回调函数，提供单个参数：建议给用户的数据
 *	arrSource：建议给用户的数据，数组
 */
function createSource(arrSource) {
		return  function(request, response) {
					var arr = fuzzySearch(arrSource,request.term);
					response(arr);
				}
} 
/**
 *  @author luolin
 *  input框模糊搜索功能支持多关键字检索
 *	arrSource：数据源数组
 *	term：用户输入的值
 */
var fuzzySearch = function(arrSource,term) {
    var arr = $.grep(arrSource,
		function(value) {
			value = value.label || value.value || value;
			var flag = true;
			if(value.toLowerCase().indexOf(term.toLowerCase()) != -1){//全匹配
				return flag;
			}else if(term.length != 0){//多个字节分段匹配
				var i = 0,
					termTmp="",
					allTmp="",
					matchIndex=0;
				for (; i < term.length; i++) {
					if (!$.trim(term[i])) continue;
					termTmp += term[i];
					var arrIndex=[];
					var matcher = new RegExp($.ui.autocomplete.escapeRegex(termTmp), "gi");
					while(matcher.test(value)==true){
						arrIndex.push(matcher.lastIndex);
					}
					if(matcher.test(value)){
						var popIndex=arrIndex.pop();
						if(popIndex > matchIndex){
							matchIndex = popIndex;
						}else {
							return false;
						}
						allTmp += term[i];
					}else{
						termTmp = term[i];
						var matcher = new RegExp($.ui.autocomplete.escapeRegex(termTmp), "gi");
						while(matcher.test(value)==true){
							arrIndex.push(matcher.lastIndex);
						}
						if(matcher.test(value)){
							var popIndex=arrIndex.pop();
							if(popIndex > matchIndex){
								matchIndex = popIndex;
							}else {
								return false;
							}
							allTmp += term[i];
						}
					}
				}			
				if(allTmp!==term){
					flag = false;
				}
				return flag;
			}
		});
    return arr;
}
//例子。。
//var arrSource = ["aBc", "cba D f", "ccCAaa"];
/*$("#developer").autocomplete({
    source: createSource(arrSource),
    select: function (even, ui) {

    }
});*/

 /**
 *  @author luolin
 */
function getConfigByKey(key){
	//require(["i18nJquery"], function() {
	return $.i18n.prop(key);
	//});
}


//----------------------------------------------------------以下可用于CRM首页----------------------------------------------------------//

/**
* param
* {id:"可选",title:"选填数据",type:2,content:"必填数据",ok:function(){alert("确定回调函数ok");},cancel:function(){alert("取消回调函数cancel");}}
* 动态表单确认提示框,回调函数返回false，窗口不关闭
*/
function dconfirm(param){//luolin modify

	var d=top.dialog.get(param.id);
	if(d){
		d.showModal();
		return d;
	}
    var icon = "";
        switch (param.type)
        {
			case 0:
                icon="ico-error";
				param.title="失败提示"; 
                break;
            case 1:
                icon="ico-warn";
				param.title="业务提示";
                break;
            case 2:
                icon="ico-ok";
				param.title="成功提示";
                break;
			case 3:
                icon="ico-loading";
                break;
			case 4:
                icon="ico-reComfirm";
				param.title="业务确认";
                break;
            case "帮助":
                icon="ico-help";
                break;
            default:
                icon="ico-error";
				param.title="失败提示"; 
        }
         var shtml='<p class="warn-text pagination-centered"><i class="'+icon+'"></i><span>'+(typeof param.content=="string"?param.content:"您确定要执行此操作？")+'</span></p>';
	
		d = top.dialog({
			id:param.id,
			title:(typeof param.title=="string"?param.title:"信息确认"),
			width: 340,
			//cancel:false,
			content:shtml,
			//zIndex:999999,
			fixed:true,
			backdropOpacity: 0.07,
			button: [{
				value:"确定",
				callback:function(){
					if(typeof param.ok=="function"){
						var rst = param.ok();
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}
					this.close().remove();
					return true;
				},
				autofocus: true
			},{
				value:"取消",
				callback:function(){
					if(typeof param.cancel=="function"){
						var rst = param.cancel();
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}
					this.close().remove();
				}
			}]
		
		});

    d.showModal();
	return d;
}

/**
*@author luolin
* param
* {id:"可选",title:"选填数据",type:2,content:"必填数据",okValue:"插件本身按钮文本，默认：确定",cancelValue:"插件本身按钮文本，默认：取消。注：cancelDisplay:false时不显示插件本身按钮",cancelDisplay:true,ok:function(){alert("插件本身Button确定回调函数ok");},cancel:function(){alert("插件本身Button取消以及右上角XX回调函数cancel");},
*	okCallbackVal:"可自定义按钮文本，默认：确定",cancelCallbackVal:"自定义按钮文本，默认：取消",okCallback:function(){alert("自定义Button确定回调函数ok");},cancelCallback:function(){alert("自定义Button取消回调函数ok");}
* }
* 新增btnOkId、btnCancelId按钮唯一标识//只针对buttonObj类型的回调
* 动态表单确认提示框,回调函数返回false，窗口不关闭
*/
function defineShowDialog(param){
	
	var defaults = {
            title:"系统提示",
            content:"请求失败",//当宕机时//支持任意html字符串
			url:"",
            type:0, //信息类型：提示、警告、错误、成功、帮助
			modal:false,//是否开启点击灰色背景关闭弹窗，默认点击灰色背景是不关闭的
            ok:null,
			okValue:"确定",
            cancel:null,
			cancelValue:"取消",
            showClose:true,
            moretips:null,
			cancelDisplay:true,//是否显示取消按钮
			
			okCallback:null,
			okCallbackVal:"确定",
            cancelCallback:null,
			cancelCallbackVal:"取消",
			
			btnOkId:"",
			btnCancelId:""
        };
        var option = $.extend(defaults,param);
        if(!option.content){
            return;
        }
		
		var d=top.dialog.get(option.id);
		if(d){
			d.showModal();
			return d;
		}
		
    var icon = "";
        switch (option.type)
        {
			case 0:
                icon="ico-error";
				option.title="失败提示";
                break;
            case 1:
                icon="ico-warn";
				option.title="业务提示";
                break;
            case 2:
                icon="ico-ok";
				option.title="成功提示";
                break;
			case 3:
                icon="ico-loading";
                break;
			case 4:
                icon="ico-reComfirm";
				option.title="业务确认";
                break;
            case "帮助":
                icon="ico-help";
                break;
            default:
                icon="ico-error";
				option.title="失败提示";
        }
	 var shtml='<p class="warn-text pagination-centered"><i class="'+icon+'"></i><span>'+(typeof option.content=="string"?option.content:"您确定要执行此操作？")+'</span></p>';
	
	 var buttonObj = [];
		 if(option.okCallback&&option.cancelCallback){
				buttonObj=[{
					id:option.btnOkId,
					value:option.okCallbackVal,
					callback:function(){
						if(typeof option.okCallback=="function"){
							var rst = option.okCallback();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
						//return true;
					},
					autofocus: true
				},{
					id:option.btnCancelId,
					value:option.cancelCallbackVal,
					callback:function(){
						if(typeof option.cancelCallback=="function"){
							var rst = option.cancelCallback();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
					}
				}]
		 }else{
			 if(option.okCallback){
			buttonObj.push({
				id:option.btnOkId,
				value: option.okCallbackVal,
				callback: function () {
					if(typeof option.okCallback=="function"){
						var rst = option.okCallback();
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}
					this.close().remove();
					//return true;
				},
				autofocus: true
				});
			}
			if(option.cancelCallback){ 
				buttonObj.push({
					id:option.btnCancelId,
					value: option.cancelCallbackVal,
					callback: function () {
						if(typeof option.cancelCallback=="function"){
							var rst = option.cancelCallback();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
					},
					autofocus: true
				});
			}
		 }
		 
		d = top.dialog({
			id:option.id,
			title:(typeof option.title=="string"?option.title:"信息确认"),
			width: 340,
			//cancel:false,
			content:shtml,
			//zIndex:999999,不能设置为最大，因会显示在模态窗口下面
			fixed:true,
			backdropOpacity: 0.07,
			okValue:option.okValue,
			ok:option.ok,
			
			cancelValue:option.cancelValue,
			cancel:option.cancel,
			cancelDisplay:option.cancelDisplay,
			//quickClose: true,
			//keyEsc:true, //dialog不需要
			button: buttonObj
			
		});

    d.showModal();
	return d;
}

/**
* param
* "content"
* 动态表单确认提示框,回调函数返回false，窗口不关闭
*/
function dalert(content,_title){//luolin modify
	var id = "dalertdialog";
	var d = top.dialog.get(id);
	if(d){
		d.showModal();
		return;
	}
	d = top.dialog({
		title:_title||"业务提示",
		id:id,
		width: 340,
		//cancel:false,
		content:'<p class="warn-text pagination-centered"><span>'+(typeof content=="string"?content:"您确定要执行此操作？")+'</span></p>',
		//zIndex:999999,
        fixed:true,
		backdropOpacity: 0.07,
	    button: [{
	    	value:"确定",
	    	callback:function(){
	    		this.close().remove();;
//	    		return true;
	    	},
	    	autofocus: true
	    }]
	
	});
    d.showModal();
}
//type:0-错误;1-警告;2-确认;3-等待;若不输入,默认为等待效果
//showDialog({id:"可选",content:"请求成功",varObj:abc,resultStatus:"success",callback:function(varObj){ }});
//showDialog({id:"可选",content:"请求成功",rules:obja.busiRuleList,varObj:resultObj.varObj,resultStatus:"success",callback:function(varObj){ }});
//showDialog({id:"可选",title:'错误',content:"	"+obja.errorMsg,moretips:obja.errorMsgMore,type:0,rules:obja.busiRuleList,varObj:resultObj.varObj,resultStatus:"error",callback:function fcall(varObj){}});

function showDialog(param){//luolin modify
	if(param.rules){
		if(param.content !=""&&param.content!=null){
			param.content = '<p>'+param.content+'</p><hr>';
		}
		$.each(param.rules,function(i,rule){
			if(typeof param.rules[i].RETURN_MSG != 'undefined'){
				param.content += '<p>' +param.rules[i].RETURN_MSG + '</p>';
			}
		});
	}
	var resultStatus = param.resultStatus;
	param.cancel = null;
	param.showClose = false;
	if(param.callback&&param.callback!='undefined'){
		param.ok=function(d){
			if(typeof param.callback=="function"){
				param.callback(param.varObj);//传参
			}

			closeDialog();
		};
		 
	}else{
		param.ok=function(d){
			closeDialog();
		};
	}
	
	//$.dialog(param);
	return excDialog(param);

}

function closeDialog(){
	$(".ued-dialog.auto-gen-dialog.dialog-open").attr("class"," ued-dialog auto-gen-dialog dialog-close");
	$(".dialog-background.dialog-background-open").attr("class","dialog-background dialog-background-close");
}

/**	dialog默认提示框*/
function excDialog(param){ //luolin modify

		var d=top.dialog.get(param.id);
		if(d){
			d.showModal();
			return d;
		}
       var defaults = {
            title:"系统提示",
            content:"请求失败",//当宕机时//支持任意html字符串
            type:0, //信息类型：提示、警告、错误、成功、帮助
			modal:false,//是否开启点击灰色背景关闭弹窗，默认点击灰色背景是不关闭的
            ok:null,
            cancel:null,
            showClose:true,
            moretips:null
        };
        var option = $.extend(defaults,param);
        if(!option.content){
            return;
        }
        var icon = "";
        switch (option.type)
        {
			case 0:
                icon="ico-error";
				option.title="失败提示";
                break;
            case 1:
                icon="ico-warn";
				option.title="业务提示";
                break;
            case 2:
                icon="ico-ok";
				option.title="成功提示";
                break;
			case 3:
                icon="ico-loading";
				option.title="等待中";
                break;
			case 4:
                icon="ico-reComfirm";
				option.title="业务确认";
                break;
            case "帮助":
                icon="ico-help";
                break;
            default:
                icon="ico-error";
				option.title="失败提示";
        }
         var shtml='<p class="warn-text pagination-centered"><i class="'+icon+'"></i><span>'+option.content+'</span></p>'+
		           '<p id="moreMsgErr" class="js-moreMsgErr"  style="display:none;padding:10px;font-size:16px; border-top:1px solid #ddd;background:#f5f5f5;max-height:200px;overflow:auto;">'
				   +option.moretips+'</p>';
				   
        var buttonObj = [];
        
	 if(option.ok){
		buttonObj.push({
			value: '确定',
			callback: function () {
				if(typeof option.ok=="function"){
					var rst = option.ok();
					if(typeof rst!="undefined"&&rst==false){
						return false;
					}
				}
				this.close().remove();
				//return true;
			},
			autofocus: true
			});
		}else{ 
			buttonObj.push({ 
				value: '关闭',
				callback: function () {
					if(typeof option.cancel=="function"){
						var rst = option.cancel();
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}
					this.close().remove();
				},
				autofocus: true
			});
		}
		
		if(option.type==0  && option.moretips){
			buttonObj.push({
				value: '错误详情',
				id:'button-more',
				callback: function () {
					if($(".js-moreMsgErr" , this.node).is(":visible")){
						$(".js-moreMsgErr" , this.node).hide();
					}else{
						$(".js-moreMsgErr" , this.node).show();
					}
					this.reset();
					return false;
				}
			});
        }
		
		d = top.dialog({
			id:option.id,
			title: option.title,
			width: 340,
			content:shtml,
			//zIndex:999999,
			fixed:true,
			backdropOpacity: 0.07,
			button: buttonObj
		});
		
	    d.showModal();
		return d;
}


//contStr显示的文字
function showLoading(isLoad,contStr){
	
	 var loadDialog = top.dialog.get("loading_wait");
	 if (typeof isLoad != 'boolean') {
		 isLoad = false;
	 }
	 isLoad = !!isLoad;
	 if(isLoad&&!loadDialog){
		 if(!loadDialog){
		 		var tip = contStr||$.i18n.prop("page.text.dialog.loading")||"加载中";
		 		loadDialog = top.dialog({
		        	id:"loading_wait",
					width: 200,
		        	content:$('<p id="loading_wait" class="warn-text pagination-centered"><i class="ico-loading"></i><span>'+tip+'</span></p>'),
		        	backdropOpacity: 0.07,
					//zIndex:999999,
					padding:0
				});
		  }
		 loadDialog.showModal();
	 }else if(!isLoad&&loadDialog){
		 try{//IE下报错
		 loadDialog.close().remove();
		 $(top.window.document.getElementById("loading_wait")).remove();
		 }catch(e){

	 	}
	 }
}


//CRM专用showWaitLoading
//modify by luolin 页面必须手动引入$.i18n
function showWaitLoading(isLoad,contStr){
	
	 var loadDialog = top.dialog.get("loading_wait_crm");
	 if (typeof isLoad != 'boolean') {
		 isLoad = false;
	 }
	 isLoad = !!isLoad;
	 if(isLoad&&!loadDialog){
		 if(!loadDialog){
		 		var tip = contStr||$.i18n.prop("page.text.dialog.loading")||"加载中";
		 		loadDialog = top.dialog({
		        	id:"loading_wait_crm",
					width: 200,
		        	content:$('<p id="loading_wait_crm" class="warn-text pagination-centered"><i class="ico-loading"></i><span>'+tip+'</span></p>'),
		        	backdropOpacity: 0.07,
					//zIndex:999999,
					padding:0
				});
		  }
		 loadDialog.showModal();
	 }else if(!isLoad&&loadDialog){
		 try{
		 loadDialog.close().remove();
		 $(top.window.document.getElementById("loading_wait_crm")).remove();
		 }catch(e){

	 	}
	 }
}

/**
*@author luolin   首页弹出框top上
*弹出模态窗口或者隐藏DIV
*优先显示url  url为""或不写才是content  height为""或不写为高度自适应
* param
* {"id":"可选","title":"选填数据","content":document.getElementById('J_gj_box'),url:"相对路径",height:1000,width:1000,"ok":function(){alert("确定回调函数ok");},"cancel":function(){alert("取消回调函数cancel");}}
* 动态表单确认提示框,回调函数返回false，窗口不关闭
增加xCancel、onshow。新增isDefinedTitle:定义url模态框是否自定义title（当作为公共弹出框页面时，标题需要不同）
padding解决内容与边界填充距离,快捷键keyEsc  传递参数data通过getDialogData(dialogId)获取参数
*/
function showTopWin(param){

	removeBlankIframes();
	param.id = param.id||new Date().getTime();
	
    var d=top.dialog.get(param.id);//注释掉，因DIV时没有remove()生成的DOM元素，Dialog的zIndex存在时，可能在重新弹出框在下方，而URL每次都是新的
	if(d){
		d.showModal();
		return d;
	}
	
	var currWind=window;//当前窗口对象(url子页面)	
    var defaults = {
            title:"系统提示",
            content:"请求失败",//当宕机时//支持任意html字符串
			url:"",
            type:0, //信息类型：提示、警告、错误、成功、帮助
			modal:false,//是否开启点击灰色背景关闭弹窗，默认点击灰色背景是不关闭的
            ok:null,
            cancel:null,
			xCancel:null,//X回调
			cancelDisplay:true,
			onshow:null,
            showClose:true,
            moretips:null,
			keyEsc:true,//快捷键ESC快速关闭窗口
			isDefinedTitle:null,//定义url模态框是否自定义title
			padding:0,
			height:"",
			width:"",
			
			data:"",//传递的参数 getDialogData(dialogId)获取参数
			isNeedAdjust:false,
			leftBarFlag:false
        };
        var option = $.extend(defaults,param);
         var shtml=option.content;
		 //处理客户端分辨率自适应宽度问题（只针对DIV）  isNeedAdjust是否需要自适应宽度、leftBarFlag页面左侧是否有bar
		if(!option.url&&option.isNeedAdjust){
			option.width=getClientWidth(window, document,option.leftBarFlag);
		}
		 var buttonObj = [];
		 if(option.ok&&option.cancel){
				buttonObj=[{
					value:"确定",
					callback:function(){
						if(typeof option.ok=="function"){
							var rst = option.ok();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}else if(typeof option.ok=="string"){
							var rst =currWind.eval(option.ok);//url子页面回调父页面函数   传递函数名字符串需要加上top/parent
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
						//return true;
					},
					autofocus: true
				},{
					value:"取消",
					callback:function(){
						if(typeof option.cancel=="function"){
							var rst = option.cancel();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}else if(typeof option.cancel=="string"){
							var rst =currWind.eval(option.cancel);
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
					}
				}]
		 }else{
			 if(option.ok){
			buttonObj.push({
				value: '确定',
				callback: function () {
					if(typeof option.ok=="function"){
						var rst = option.ok();
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}else if(typeof option.ok=="string"){
						var rst =currWind.eval(option.ok);
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}
					this.close().remove();
					//return true;
				},
				autofocus: true
				});
			}
			if(option.cancel){ 
				buttonObj.push({ 
					value: '关闭',
					callback: function () {
						if(typeof option.cancel=="function"){
							var rst = option.cancel();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}else if(typeof option.cancel=="string"){
							var rst =currWind.eval(option.cancel);
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
					},
					autofocus: true
				});
			}
		 }
		if(option.url){
			showLoading(true,"加载中");
		}
		d = top.dialog({
			id:option.id,
			title: option.title,
			width: option.width,
			height:option.height,
			cancel:option.xCancel,
			cancelDisplay:option.cancelDisplay,
			//cancel:false,
			content:shtml,
			url:option.url,
			keyEsc:option.keyEsc,
			data:option.data,
			//follow:document.getElementById('J_gj_box'),
			backdropOpacity: 0.07,
			padding: option.padding,
			//zIndex:999999,
			/*针对单个url页面时，true:固定位置，不受父页面滚动条拖动影响。
			默认false时:当子页面设置height超过浏览器高度时，父页面会出现滚动条，子页面无滚动条。
			height不设置，子页面高度小时，父子页面均无滚动条，子页面高度大时，父子页面均有滚动条。
			当设置width宽度过小时，url页面会出现横向滚动条。width最好设置，因页面是响应式，自动伸展的，会出现width非常窄的情况
			但DIV时，height不设置，弹出框（不是子页面）高度大时，主页面有滚动条，弹出框无滚动条。。。插件加自适应$content.css("overflow","auto");
			*/ 
			fixed:true, 
			button: buttonObj,
			drag:true,
			onshow: option.onshow,
			oniframeload: function () {
				if(!option.isDefinedTitle){
					var text = $(this.iframeNode).contents().find("title")[0].innerText;
					var localizedKey = $(this.iframeNode).contents().find("title")[0].getAttribute('text-i18n');
					if(localizedKey){
						this.title($.i18n.prop(localizedKey));
					} else {
						 this.title(text);
					}
				}
			   $(this.iframeNode).contents().find("body").css({
					height:"100%",
					overflow:"auto"
				});
				//移除loading效果
				this._$('content').children().eq(0).remove();
				var api=top.dialog.get(option.id);
				if(api){
					this.showModal();//dialogId为html
				}		
			}
	
		});

    if(!option.url){
		d.showModal();
	}
	return d;
}

/**
*@author luolin   产品线弹出框window上
*弹出模态窗口或者隐藏DIV
*优先显示url  url为""或不写才是content  height为""或不写为高度自适应
* param
* {"id":"可选","title":"选填数据","content":document.getElementById('J_gj_box'),url:"相对路径",height:1000,width:1000,"ok":function(){alert("确定回调函数ok");},"cancel":function(){alert("取消回调函数cancel");}}
* 动态表单确认提示框,回调函数返回false，窗口不关闭
增加xCancel、onshow。新增isDefinedTitle:定义url模态框是否自定义title（当作为公共弹出框页面时，标题需要不同）
padding解决内容与边界填充距离,快捷键keyEsc  传递参数data通过getDialogData(dialogId)获取参数
*/
function showWin(param){

	removeBlankIframes();
	param.id = param.id||new Date().getTime();
	
    var d=dialog.get(param.id);//top且Dialog的zIndex存在时需注释，因Dialog的zIndex在top才会影响
	if(d){
		d.showModal();
		return d;
	}
		
    var defaults = {
            title:"系统提示",
            content:"请求失败",//当宕机时//支持任意html字符串  
			url:"",
            type:0, //信息类型：提示、警告、错误、成功、帮助
			modal:false,//是否开启点击灰色背景关闭弹窗，默认点击灰色背景是不关闭的
            ok:null,
            cancel:null,
			xCancel:null,//X回调
			cancelDisplay:true,//是否显示取消按钮
			onshow:null,
            showClose:true,
            moretips:null,
			keyEsc:true,//快捷键ESC快速关闭窗口
			isDefinedTitle:null,//定义url模态框是否自定义title
			padding:0,
			height:"",
			width:"",
			
			data:"",//传递的参数 getDialogData(dialogId)获取参数
			isNeedAdjust:false,
			leftBarFlag:false
        };
        var option = $.extend(defaults,param);
         var shtml=option.content;
		 //处理客户端分辨率自适应宽度问题（只针对DIV）  isNeedAdjust是否需要自适应宽度、leftBarFlag页面左侧是否有bar
		if(!option.url&&option.isNeedAdjust){
			option.width=getClientWidth(window, document,option.leftBarFlag);
		}
		
		 var buttonObj = [];
		 if(option.ok&&option.cancel){
				buttonObj=[{
					value:"确定",
					callback:function(){
						if(typeof option.ok=="function"){
							var rst = option.ok();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
						//return true;
					},
					autofocus: true
				},{
					value:"取消",
					callback:function(){
						if(typeof option.cancel=="function"){
							var rst = option.cancel();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
					}
				}]
		 }else{
			 if(option.ok){
			buttonObj.push({
				value: '确定',
				callback: function () {
					if(typeof option.ok=="function"){
						var rst = option.ok();
						if(typeof rst!="undefined"&&rst==false){
							return false;
						}
					}
					this.close().remove();
					//return true;
				},
				autofocus: true
				});
			}
			if(option.cancel){ 
				buttonObj.push({ 
					value: '关闭',
					callback: function () {
						if(typeof option.cancel=="function"){
							var rst = option.cancel();
							if(typeof rst!="undefined"&&rst==false){
								return false;
							}
						}
						this.close().remove();
					},
					autofocus: true
				});
			}
		 }
		if(option.url){
			showLoading(true,"加载中");
		}
		d = dialog({
			id:option.id,
			title: option.title,
			width: option.width,
			height:option.height,
			cancel:option.xCancel,
			cancelDisplay:option.cancelDisplay,
			//cancel:false,
			content:shtml,
			url:option.url,
			keyEsc:option.keyEsc,
			data:option.data,
			//follow:document.getElementById('J_gj_box'),
			backdropOpacity: 0.07,
			//zIndex:999999,
			fixed:true,
			button: buttonObj,
			padding: option.padding,
			drag:true,
			onshow: option.onshow,
			oniframeload: function () {
				if(!option.isDefinedTitle){
					var text = $(this.iframeNode).contents().find("title")[0].innerText;
					var localizedKey = $(this.iframeNode).contents().find("title")[0].getAttribute('text-i18n');
					if(localizedKey){
						this.title($.i18n.prop(localizedKey));
					} else {
						 this.title(text);
					}
				}
			   $(this.iframeNode).contents().find("body").css({
					height:"100%",
					overflow:"auto"
				});	
				//移除loading效果
				this._$('content').children().eq(0).remove();
				var api=window.dialog.get(option.id);
				if(api){
					this.showModal();//dialogId为html
				}		
			}
	
		});
	if(!option.url){
		d.showModal();
	}
    
	return d;
}

/**
 *  @author luolin
 *  关闭模态窗口或者隐藏DIV top上
 *  dialogId：可选 
 */
function closeTopWin(dialogId){
	var winDialog=null;
	if(dialogId){
		winDialog=window.dialog.get(dialogId)||top.dialog.get(dialogId);//div 当前页面 window上 || url
		if(winDialog){
			winDialog.close().remove();
		}
	}else{
		winDialog = top.dialog.get(window)||top.dialog.getCurrent();//url || div/url 主要针对div
		if(winDialog){
			winDialog.close().remove();
		}	
	}
	
}

/**
 *  @author luolin
 *  关闭模态窗口或者隐藏DIV window上
 *  dialogId：可选 
 */
function closeWin(dialogId){
	var winDialog=null;
	if(dialogId){
		winDialog=window.dialog.get(dialogId);//div  当前页面 window上
		if(winDialog){
			winDialog.close().remove();
			//function();会执行在window上
			return;
		}
		winDialog=parent.dialog.get(dialogId);//url 会有iframe父子关系
		if(winDialog){
			winDialog.close().remove();
			//removeBlankIframes();//不执行已清除iframe(window)
		}
	}else{
		winDialog = parent.dialog.get(window);
		if(winDialog){
			winDialog.close().remove();
			return;
		}
		winDialog = window.dialog.getCurrent();//针对div
		if(winDialog){
			winDialog.close().remove();
			//return;
		}	
		//winDialog = parent.dialog.getCurrent();//url嵌套div，div关闭时会导致url关闭,url在parent上
		//if(winDialog){
		//	winDialog.close().remove();//针对url
		//}	
	}
}

/**
 *  @author luolin
 *  使模态窗口或者隐藏DIV window上button 置灰disabled
 *  dialogId：可选  模态窗口ID
 *  btnId即btnOkId：按钮ID
 *	isDis：是否置灰
 */
function disBtnOnWin(dialogId,btnId,isDis){
	var winDialog=null;
	if(dialogId){
		winDialog=window.dialog.get(dialogId)||parent.dialog.get(dialogId);//div  当前页面 window上
		if(winDialog){
			winDialog.disBtn(btnId,isDis);
		}
	}else{
		winDialog = parent.dialog.get(window)||window.dialog.getCurrent();
		if(winDialog){
			winDialog.disBtn(btnId,isDis);
		}
	}
}
/**
 *  @author luolin
 *  处理IE8下，url自适应高度问题
	可处理客户端分辨率自适应宽度问题
	父页面插件中调用
 */
function urlWinReHeight(dialogId){
	
	var api=window.dialog.get(dialogId);
	if(api){//可能被业务侧close掉了
		var options = api.options;

		if (options.url&&!options.height) {
			if(!!api._$('header')){
				// iframe高度取iframe内容高度和其父窗口高度的最小值
				var wMaxH = $(window).height()-api._$('header').height()-api._$('footer').height()-parseInt(api._$('body').css('paddingTop'))-parseInt(api._$('body').css('paddingBottom'))-22;
				api.height(Math.min($(api.iframeNode).contents().height(), wMaxH));
			}
		}
	}
}

/**
 *  @author luolin
 *  处理IE8下，url自适应高度问题
	可处理客户端分辨率自适应宽度问题
	子页面调用
 */
function urlResetHeight(dialogId){
	
	var api=parent.dialog.get(dialogId);
	if(api){//可能被业务侧close掉了
		var options = api.options;

		if (options.url&&!options.height) {
			if(!!api._$('header')){
				// iframe高度取iframe内容高度和其父窗口高度的最小值
				var wMaxH = $(parent.window).height()-api._$('header').height()-api._$('footer').height()-parseInt(api._$('body').css('paddingTop'))-parseInt(api._$('body').css('paddingBottom'))-22;
				api.height(Math.min($(api.iframeNode).contents().height(), wMaxH));
			}
		}
	}
}
/**
 *  @author luolin
 *  showWin显示服务配置DIV模态窗口时自适应高度/宽度
 *	page_diaId：可选  模态窗口ID
 *	page_defValue：模态窗口最大高度
 *	page_divId：弹出内容ID
 *	page_addHeight：分页条高度等，解决分页条异步加载（IE8下问题）
 */
function divPageResetHeight(page_diaId,page_defValue,page_divId,page_addHeight,isNeedAdjust,leftBarFlag){
	
	window.page_diaId=page_diaId;
	window.page_defValue=page_defValue;
	window.page_divId=page_divId;
	window.page_addHeight=page_addHeight;
	window.isNeedAdjust=isNeedAdjust;
	window.leftBarFlag=leftBarFlag;
}
/**
 *  @author luolin
 *  showWin显示DIV模态窗口时自适应高度/宽度
 *	dialogId：可选  模态窗口ID
 *	defaultValue：模态窗口最大高度
 *	divId：弹出内容ID
 *	addHeight：分页条高度等，解决分页条异步加载（IE8下问题）
	leftBarFlag：判断页面是否有左边框
	isNeedAdjust：是否需要自适应宽度
 处理客户端分辨率自适应宽度问题（只针对DIV）
 */
function divResetHeight(dialogId,defaultValue,divId,addHeight,isNeedAdjust,leftBarFlag){
	
	var winDialog=null;
	var width=isNeedAdjust?getClientWidth(window,document,leftBarFlag):"";
	
	var setValue=$("#"+divId+"").height()+addHeight;
	if(dialogId){
		winDialog=window.dialog.get(dialogId);//div  当前页面 window上
	}else{
		winDialog = window.dialog.getCurrent();//针对div	
	}
	if(winDialog){
		if(divId){
			if(defaultValue>=setValue){
				winDialog.height(setValue)._$('content').css("overflow","");
			}else{
				winDialog.height(defaultValue)._$('content').css("overflow","auto");
			}
			if(isNeedAdjust){
				winDialog.width(width);
			}
		}
	}
}
/**
 *  @author luolin
 *  处理客户端分辨率自适应宽度问题（只针对DIV）
 */
function getClientWidth(w, d,leftBarFlag){
	var d_w = null;
	if(w.top != w){
		//d_w = w.top.document.body.clientWidth || w.top.document.documentElement.clientWidth;
		d_w = w.top.window.screen.width;
	}else{
		//d_w = d.body.clientWidth || d.documentElement.clientWidth;
		d_w = window.screen.width;
	}
	
	if(d_w < 1200) { 
		//var _class = d.body.className; 
		//d.body.className = _class == "" ? 'sm-body' : _class.indexOf('sm-body') >= 0 ? _class.replace(/sm-body/, 'sm-body') : _class + ' sm-body';
		//判断页面是否有左边框
		if(leftBarFlag)return 980-130;//1024
		return 980;//1024
	}else{
		//判断页面是否有左边框
		if(leftBarFlag)return 1200-130;
		return 1200;
	}
}


/**
 *  @author luolin
 *  用于当页面为同步服务，onload加载慢时，手动更改dialog插件的title
 *	titleName 标题名称  默认为页面title
 */
function changeDialogTitle(dialogId,titleName,isDefinedTitle){
	var winDialog=null;
	if(dialogId){
		winDialog=window.dialog.get(dialogId)||parent.dialog.get(dialogId);//div  当前页面 window上
	}else{
		winDialog = parent.dialog.get(window)||window.dialog.getCurrent();
	}
	if(winDialog){
		if(!isDefinedTitle){
			var text = $(winDialog.iframeNode).contents().find("title")[0].innerText;
			var localizedKey = $(winDialog.iframeNode).contents().find("title")[0].getAttribute('text-i18n');
			if(localizedKey){
				winDialog.title($.i18n.prop(localizedKey));
			}else {
				 winDialog.title(text);
			}
		}else{
			winDialog.title(titleName);
		}
	}
}


/**
 *  @author luolin
 *  为避免全局变量污染，获取dialog参数
 */
function getDialogData(dialogId){
	var winDialog=null;
	if(dialogId){
		winDialog=window.dialog.get(dialogId)||parent.dialog.get(dialogId);//div  当前页面 window上
	}else{
		winDialog = parent.dialog.get(window)||window.dialog.getCurrent();
	}
	if(winDialog){
		return winDialog.data;
	}
}
/**
 *  @author luolin
 *  手动清除空白iframe标签 
 */
function removeBlankIframes(){
	$("iframe[name='_blankIframe']").remove();
	$(top.window.document.getElementsByName("_blankIframe")).remove();
}
/**
 *  @author luolin
 *  服务配置模态窗口X函数回调，也可用eval+匿名函数来实现
 */
function xCancelFunc(dialogId,funcName){
	window._dialogId=dialogId;
	window._xfuncName=funcName;
	return function(){
		dialogIframeFunc(window._dialogId,window._xfuncName);
		}
}
//用于父页面调用子页面方法//ajax异步或者在ajax内部return  会导致无法接受返回值
function dialogIframeFunc(dialogId,funcName)
{
		return eval("dialog.get('"+dialogId+"').iframeNode.contentWindow."+funcName+"();");
}

//用于父页面调用子页面OK方法
 function dialogIframeOkFunc(obj,okFuncName)
{
    return eval("dialog.get('"+obj.id+"').iframeNode.contentWindow."+okFuncName+"();");//用于window弹url框，插件的按钮回调子页面函数，自己写的按钮不需要（不需加top，top可以直接运行）
}
//用于父页面调用子页面cancel方法
function dialogIframeCancelFunc(obj,cancelFuncName)
{
    return eval("dialog.get('"+obj.id+"').iframeNode.contentWindow."+cancelFuncName+"();");
}