
	//调用js
	var _ajaxUtil = {};
	var traceid;
	var dlgCounts = 0;
	
	_ajaxUtil.get = function(url,callback,indata,async) {
		//Pop.process("加载中，请稍后...");
		var uri = new Uri(url);
		if(async==undefined)	async=true;
		//uri.addQueryParam("traceid",_Constant.TARCE_ID);
		return _util.getJson(
			uri.toString(),
			function(data) {
				return callback(data);
			},
			indata,
			async);
	};
	_ajaxUtil.post = function(url,callback,indata,async,waiting) {
		//Pop.process("加载中，请稍后...");
	  if (typeof waiting != 'boolean') {
             waiting = false;
          }
        waiting = !!waiting;
    	if(waiting){
    		dlgCounts ++;
    		showLoading(true);
		}
	    	
		var uri = new Uri(url);
		if(async==undefined)	async=true;
		//uri.addQueryParam("traceid",_Constant.TARCE_ID);
		return _util.postJson(
			uri.toString(),
			function(data) {
				if(waiting && --dlgCounts <= 0){
					showLoading(false);
				 }
				return callback(data);
			},
			indata,
			async);
	};
	
	//封装js
	var _util={};

	_util.getJson = function(url, fn, data,async) {
		return _util.getData(url, "json", fn, data,async);
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
	_util.getData = function(url, type, fn, data,async) {
//		_util.base(url, "get", type, fn, data, false,
//				"application/x-www-form-urlencoded");
		return _util.base(url, "get", type, fn, data, async,
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
	_util.postJson = function(url, fn, data,async) {
		return _util.base(url, "post", "json", fn, JSON.stringify(data), async,
				"application/json");
	};
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
	_util.base = function(url, method, type, fn, data, async, contentType) {

		var _returnValue;
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
			uri.addQueryParam('wsgtoken', ngIdValue);
		}
        //var _async=!async;
		$.ajax({
			url : uri.toString(),
			type : method,
			async : async,
			contentType : contentType,
			cache : false,
			dataType : type,
			data : data,
			timeout:60000,
			success : function(retdata) {
				_returnValue=fn(retdata);
			},
			error : function(retdata) {
				var data = {
					result : '1',
					retCode : '0001',
					retMsg : "ajax调用失败"
				};
				_returnValue=fn(data);
			}
		});
		return _returnValue;
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
	
	
	
	