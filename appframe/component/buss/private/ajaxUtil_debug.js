define([ 'json2',"appframe/component/buss/private/ajaxUtil_config","uri"], function(json2,config,Uri) {
	 var  _Constant=Namespace('all.constant');
	
	/**
	 * 组件名:ajaxutil<br/> 组件功能：一个ajax调用的工具类
	 * 
	 * @exports ajaxUtil
	 * @author kangjy
	 * @version 1.0
	 * @class
	 */
	var ajaxUtil = {};
	/**
	 * @description 异步获取远程的html
	 * @param {number}
	 *            url 请求url
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 * @param {json}
	 *            data 请求时候发送的数据
	 */
	ajaxUtil.getHtml = function(url, fn, data) {
		ajaxUtil.getData(url, "html", fn, data);
	};
	/**
	 * @description 异步获取js
	 * @param {number}
	 *            url 请求url
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 */
	ajaxUtil.getJs = function(url, fn) {
		ajaxUtil.getData(url, "javascript", fn);
	};
	/**
	 * @description 异步调用远程返回json字符串的服务
	 * @param {number}
	 *            url 请求url
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 * @param {json}
	 *            data 请求时候发送的数据
	 */
	ajaxUtil.getJson = function(url, fn, data,async) {
		ajaxUtil.getData(url, "json", fn, data,async);
	};
	/**
	 * @description ajax获取远程数据
	 * @param {number}
	 *            url 请求url
	 * @param {number}
	 *            type 返回的内容类型[html,javascript,json]
	 * @param {function}
	 *            fn 异步调用完成后回到函数
	 * @param {json}
	 *            data 请求时候发送的数据
	 */
	ajaxUtil.getData = function(url, type, fn, data,async) {
//		ajaxUtil.base(url, "get", type, fn, data, false,
//				"application/x-www-form-urlencoded");
		ajaxUtil.base(url, "get", type, fn, data, async,
				"application/json");
	};
	/**
	 * @description 异步调用远程返回json字符串的服务
	 * @param {number}
	 *            url 请求url
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 * @param {json}
	 *            data 请求时候发送的数据,json对象
	 */
	ajaxUtil.postJson = function(url, fn, data,async) {
		ajaxUtil.base(url, "post", "json", fn, JSON.stringify(data), async,
				"application/json");
	};
	/**
	 * @description 异步调用远程json服务
	 * @param {number}
	 *            url 请求url
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 * @param {json}
	 *            data 请求时候发送的数据,json对象
	 */
	ajaxUtil.putJson = function(url, fn, data) {
		ajaxUtil.base(url, "put", "json", fn, JSON.stringify(data), false,
				"application/json");
	};
	/**
	 * @description 异步调用远程json的服务
	 * @param {number}
	 *            url 请求url
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 * @param {json}
	 *            data 请求时候发送的数据,json对象
	 */
	ajaxUtil.deleteJson = function(url, fn, data) {
		ajaxUtil.base(url, "DELETE", "json", fn,JSON.stringify(data), false,
				"application/json");
	};
	
	/**
	 * 从cookie获取ngid
	 * @param name
	 * @returns {string}
	 */
	function getCookie(name) {
		var strCookie = document.cookie;//获取cookie字符串
		var arrCookie = strCookie.split("; ");//分割
		//遍历匹配
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] === name) {
				if (arr[1] !== '' || arr[1] !== 'undefined') {
					var value = arr[1];
					var randomStr = getRandomNum(10001, 99999);
					//让字符串倒序
					value = value.split('').reverse().join('');
					return randomStr + value;
				}
			}
		}
		return "";
	}

	/**
	 * 获取5位随机数
	 * @param Min 最小值
	 * @param Max 最大值
	 * @returns {*}
	 */
	function getRandomNum(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		return (Min + Math.round(Rand * Range));
	}

	/**
	 * @description ajax获取远程数据
	 * @param {number}
	 *            url 请求url
	 * @param {number}
	 *            type 返回的内容类型[html,javascript,json]
	 * @param {function}
	 *            fn 异步调用完成后回到函数，接受的参数为ajaxPack对象
	 * @param {json}
	 *            data 请求时候发送的数据
	 * @param {boolean}
	 *            [async] 是否为异步调用，默认为true，false为同步调用
	 * @param {string}
	 *            [contentType] 请求参数类型
	 */
	ajaxUtil.base = function(url, method, type, fn, data, async, contentType) {
		var isconfig=false;
		for(var i=0;i<config.length;i++){
			var configurl=config[i];
			if(url.indexOf(configurl)>-1){
				isconfig=true;
				break;
			}
		}
		if(!isconfig){
			url=""+url;
		}
		//if(window.eagleEyeKey){
		//	url=url+"?eagleEyeKey="+window.eagleEyeKey;
		//}
		//处理鹰眼日志key
		var uri = new Uri(url);
		if(window.eagleEyeKey){
			uri.addQueryParam("eagleEyeKey",window.eagleEyeKey);
		}
		//处理CSRF跨域攻击key
		var ngIdName = 'ngid';
		var ngIdValue = getCookie(ngIdName);
		if(ngIdValue){
			uri.addQueryParam(ngIdName, ngIdValue);
		}
//		if(_Constant.INNEROPCPDE!=""){
//			//uri.replaceQueryParam("opCode",_Constant.INNEROPCPDE);
//		}else{
//			//uri.addQueryParam("opCode",_Constant.OPCODE);
//		}
        var _async=!async;
		$.ajax({
			url : uri.toString(),
			type : method,
			async : _async,
			contentType : contentType,
			cache : false,
			dataType : type,
			data : data,
			timeout:60000,
			success : function(retdata) {
				fn(retdata);
			},
			error : function(retdata) {
				var data = {
					result : '1',
					retCode : '0001',
					retMsg : "ajax调用失败"
				};
				fn(data);
			}
		});
	};
	return ajaxUtil;
});