define([ 'json2',"uri" ], function(json2,Uri) {
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
	ajaxUtil.getJson = function(url, fn, data, async) {
		ajaxUtil.getData(url, "json", fn, data, async);
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
	ajaxUtil.getData = function(url, type, fn, data, async) {
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
	ajaxUtil.postJson = function(url, fn, data, async) {
		ajaxUtil.base(url, "post", "json", fn, JSON.stringify(data), async,
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
	ajaxUtil.putJson = function(url, fn, data, sfn, cfn) {
		ajaxUtil.base(url, "put", "json", fn, JSON.stringify(data), true,
				"application/json", sfn, cfn);
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
	ajaxUtil.deleteJson = function(url, fn, data, sfn, cfn) {
		ajaxUtil.base(url, "delete", "json", fn, JSON.stringify(data), true,
				"application/json", sfn, cfn);
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
	ajaxUtil.base = function(url, method, type, fn, data, async, contentType) {
		var uri = new Uri(url);
		if(_Constant.INNEROPCPDE!=""){
			uri.replaceQueryParam("opCode",_Constant.INNEROPCPDE);
		}else{
			uri.addQueryParam("opCode",_Constant.OPCODE);
		}
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
				fn(retdata);
			},
			error : function(XMLHttpRequestP, textStatusP, errorThrownP) {
				var data = {
					result : '1',
					retCode : '0001',
					retMsg : "ajax调用失败"
				};
				//add by wangtlc REST权限校验不通过
				//1、考虑到可能有浏览器不兼容XMLHttpRequestP.responseText故暂时使用403判断
				//2、这里没考虑多次弹框的情况，如果没有权限都需要配置上才能正常使用。
				if(XMLHttpRequestP.status==403){
					var msgtotal="您没有访问当前请求的权限请联系管理员！";
					if(typeof XMLHttpRequestP.responseText != 'undefined'){
						if(XMLHttpRequestP.responseText.indexOf("-1101")!=-1){
							msgtotal='您没有访问当前请求的权限，请联系管理员配置操作员对应菜单权限！';
							console.log('您没有访问当前请求的权限，请联系管理员配置操作员对应菜单权限！'+uri.toString());
						}else if(XMLHttpRequestP.responseText.indexOf("-1102")!=-1){
							msgtotal='您没有访问当前请求的权限，请联系管理员配置OPCODE对应REST权限！请求地址为：'+uri.toString();
						}else if(XMLHttpRequestP.responseText.indexOf("-1100")!=-1){
							msgtotal='会话已失效，请重新登录！';
						}else if(XMLHttpRequestP.responseText.indexOf("-1201")!=-1){
							msgtotal='您没有访问当前请求的权限，请先通过金库认证！请求地址为：'+uri.toString();
						}
					}
					data.retMsg=msgtotal;
				}
				fn(data);
			}
		});
	};
	return ajaxUtil;
});