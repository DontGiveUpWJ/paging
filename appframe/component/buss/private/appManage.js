define(function(require) {
	/**
	 * 组件名:appmanage<br/> 组件功能：app应用管理器
	 * 
	 * @exports appManager
	 * @class
	 */
	var appManager = {
		data : {},
		routesmap : {}
	};
	var route = require("director"), pageconfs = require("appconfig"), uri = require("uri");
	route_index = 0, routes = [], router = new Router().init(), urit = new uri(location.href);
	var newhref = urit.path() + urit.query() + '#';
	/**
	 * @description 将op_code按照app规范转化为实际的app_url
	 * @param {number}
	 *            op_code 业务唯一标识
	 * @param {url}
	 *            [data] app内部跳转url
	 * @returns {array} paths [app加载url,app待渲染到的domid]
	 */
	function _convertOpcode(op_code, url) {
		var uaiconfig = appconfig[op_code], paths = [];// uaiconfig为app的配置，配置路径为/url,/?url
		if (!!uaiconfig) {
			var uai = uaiconfig[0];
			var appuri = new uri(uai);
			// 根据传入url返回对应的实际url，如传入/payfee#id=/payfee /?payfee#id=/payfee
			var path = (appuri.path() != "" ? appuri.path() : appuri.query()), domid = (appuri.anchor() != "" ? appuri.anchor() : "mainapp");
			if (path.indexOf("?") > -1) {
				path = "/apps/pageapps" + path.substring(1);
			} else {
				path = "/apps/serviceapps" + path;
			}
			// 如果没有指定相关的html，则默认使用path下面的index.html
			if (path.indexOf(".html") == -1) {
				path += "/index.html";
			}
			// 如果有跳转的url，这跳转到对应的app
			if (!!url) {
				path = path.substring(0, path.lastIndexOf('/')) + url;
			}
			paths[0] = path;
			paths[1] = domid;
		} else {
			// app免配置规范，app命名规则为s+op_code
			paths[0] = "/apps/serviceapps/s" + op_code + "/index.html";
			if (!!url) {
				paths[0] = paths[0].substring(0, paths[0].lastIndexOf('/')) + url;
			}
			paths[1] = "mainapp";
		}
		return paths;
	}
	/**
	 * @description 将op_code按照app规范转化为实际的app_url
	 * @param {number}
	 *            op_code 业务唯一标识
	 * @param {url}
	 *            [data] app内部跳转url
	 * @returns {array} paths [app加载url,app待渲染到的domid]
	 */
	function _convertAppID(pageid) {
		var pageconf = pageconfs[pageid],parsepageconf={};
		for(var i=0;i<pageconf.length;i++){
			var appconf=pageconf[i].split("#"),appid=appconf[0],domid=appconf[1],apptype=appconf[0].charAt(0),path='/apps/';
			if(apptype=="?"){
				path += "pageapps/";
				appid=appid.substring(1);
			}else if(apptype=="p"){
					path += "pageapps/";
			}else if(apptype=="s"){
					path += "serviceapps/";
			}else{
				path += "serviceapps/";
			}
			path+=appid;
			// 如果没有指定相关的html，则默认使用path下面的index.html
			if (path.indexOf(".html") == -1) {
				path += "/index.html";
			}
			parsepageconf[domid]=path;
		}
		return parsepageconf;
	}
	/**
	 * @description 根据opcode初始化一个业务app
	 * @param {number}
	 *            op_code 业务唯一标识
	 * @param {json}
	 *            [data] 初始化数据
	 * @example require(['appmanage',"uri"],function(appmanage,uri){ var
	 *          initdata={payfee:'100'}
	 *          appmanage.create(urit.getQueryParamValue("opcode"),initdata) };
	 */
	appManager.create = function(op_code, data) {
		var index = route_index++;
		var paths = _convertOpcode(op_code);
		appManager.routesmap[index] = paths;
		appManager.data[index] = data;
		location.href = newhref + index;
		$.get(paths[0], function(data) {
			$("#" + paths[1]).html(data);
			router.on("" + index, function() {
				var s = appManager.routesmap['' + index];
				if (!!s) {
					$.get(s[0], function(data) {
						$("#" + paths[1]).html(data);
					})
				}
			});
		});
	};

	/**
	 * 初始化一个界面
	 * @param  {[string]} pageid [页面的ID]
	 * @return {[null]}        [无返回]
	 */
	appManager.initpage = function(pageid,data) {
		var index = route_index++;
		var parseappconf=_convertAppID(pageid);
		appManager.data[index] = data;
		appManager.routesmap = parseappconf;
		$.each(parseappconf,function(domid, appurl){
	 	   $.get(appurl, function(data) {
	 	   	 $("#" + domid).html(data);
	 	   });
	    })
		
	};

	/**
	 * 初始化一个界面
	 * @param  {[string]} pageid [页面的ID]
	 * @return {[null]}        [无返回]
	 */
	appManager.nextpage = function(domid,url,data) {
		var index = route_index++,appurl=appManager.routesmap[domid];
		appManager.data[index] = data;
		var newhref = urit.path() + urit.query() + '#';
		var nexpageurl=(url.charAt(0)=="/"?url:appurl.substring(0, paths[0].lastIndexOf('/')) + url);
 	   	if (!routes[index]) {
			router.on('' + index, function() {
				$.get(nexpageurl, function(data) {
					$("#" + domid).html(data);
				});
			});
			routes[index] = true;
		}
		location.href = newhref + index;
		
	};
	/**
	 * @description 跳转到app内部的另外一个页面
	 * @param {number}
	 *            url app内部跳转url
	 * @param {json}
	 *            data 传递给下一个app内页面的数据
	 * @example require(["appmanage"],function(appmanage){
	 *          appmanage.innerskip("/html/payfeeconfim.html",m) });
	 */
	appManager.innerskip = function(url, data) {
		var index = route_index++;
		appManager.data[index] = data;
		appManager.routesmap[index] = url;
		var newhref = urit.path() + urit.query() + '#';
		var paths = _convertOpcode(urit.getQueryParamValue("opcode"), url);
		if (!routes[index]) {
			router.on('' + index, function() {
				$.get(paths[0], function(data) {
					$("#" + paths[1]).html(data);
				});
			});
			routes[index] = true;
		}
		location.href = newhref + index;
	}
	
	appManager.getData = function() {
		var url=new uri(location.href);
	    var paramdata=appManager.data[url.anchor()];
	    return paramdata;
	}

	/**
	 * @description 获取跳转后的参数；根据route_index获取当前所在层次
	 */
	appManager.getRouteData = function() {
		return appManager.data[route_index - 1];
	};

	
	return appManager;	
})