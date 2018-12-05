﻿//Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
    String.prototype.trim=function(){
    	return this.replace(/^s+|s+$/g, '');
    }
}());
var Namespace=(function(windows){
	var _toArray = function(obj) {
		// checks if it's an array
		if (typeof(obj) == 'object' && obj.sort) {
			return obj;
		}
		return new Array(obj);
	};
	var _namespace = function(identifier) {
		var klasses = arguments[1] || false;
		var ns = windows;
		
		if (identifier != '') {
			var parts = identifier.split(Namespace.separator);
			for (var i = 0, j = parts.length; i < j; i++) {
				if (!ns[parts[i]]) {
					ns[parts[i]] = {};
				}
				ns = ns[parts[i]];
			}
		}
		
		if (klasses) {
			for (var klass in klasses) {
				ns[klass] = klasses[klass];
			}
		}
		
		//_dispatchEvent('create', { 'identifier': identifier });
		return ns;
	};
	_namespace.use = function(identifier,isglobal) {
		var _varscope =isglobal?windows:{};
		var identifiers 		= _toArray(identifier);
		var callback 			= arguments[1] || false;
		
		for (var i = 0, j = identifiers.length; i < j; i++) {
			identifier = identifiers[i];
		
			var parts = identifier.split(Namespace.separator);
			var target = parts.pop();
			var ns = _namespace(parts.join(Namespace.separator));
		
			if (target == '*') {
				// imports all objects from the identifier, can't use include() in that case
				for (var objectName in ns) {
					_varscope[objectName] = ns[objectName];
				}
			} else {
				// imports only one object
				if (ns[target]) {
					// the object exists, import it
					_varscope[target] = ns[target];
				}
			}
		
		}
		return _varscope;
	};
	return _namespace;
})(window)
$.ajaxSetup({
  cache: true
});
Namespace.separator = '.';
/**
 * 初始化时调用 
 * @author simon
 */
$(function() {
    //var projectName= __basePath.substring(1,__basePath.length-1);
	var projectName= __basePath.split('/')[2];
    var settings = {};
    require(['cookie'  , "i18n"], function (cookieUtil , i18n) {
	    settings.name = [projectName,"app_showMessage"];//文件库名称
	    settings.language = cookieUtil.cookie('language'); //语言类型，实际应用中可传值或从cookie中读取
	    settings.path =__basePath+ "pub-ui/lang/";
	    settings.cache = true;
	    if( settings.language == null || settings.language == undefined ){
	        settings.language = "zh_CN";
	    }
	      i18n.init(settings);//初始化，此函数必须调用
    	  i18n.localize("body");
	    require(['appframe/component/buss/open/validate/local/'+settings.language]);//根据语言选择表单校验文件
    });
})

 /**
 *  luolin modify  四川CRM6.5专用  必须写在jquery.i18n.properties中，因onload时require产生的异步
 *  加载配置文件
 */
/*$(function() {
    var settings = {};
    //require(["i18nJquery"], function() {
	    settings.name = "webapp";
	    settings.path =__basePath+ "pub-ui/public/config/";
	    settings.cache = true;
		settings.mode="map";
	    settings.language = "config";
		settings.suffix='.js';
	    $.i18n.properties(settings);
    //});
});*/