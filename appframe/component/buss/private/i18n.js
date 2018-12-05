define(['i18nJquery'], function() {
	if (typeof String.prototype.startsWith != 'function') {
		String.prototype.startsWith = function(str){
			if(str == null
				|| str == ""
				|| this.length == 0
				|| str.length > this.length) {
				return false;
			} else if(this.substr(0,str.length) == str) {
				return true;
			} else {
				return false;
			}
		}
	}


	var i18n = {};
	
	//调用prop时用于区分是否为key值的分隔符，默认为"KEY="
	i18n.splitFlag = "KEY=";

	/**
	 * *
	 * 用途：初始化
	 * 
	 * 
	 * 
	 */
	i18n.init = function(settings) {
		if(settings.splitFlag != "" && settings.splitFlag != null){
			i18n.splitFlag = settings.splitFlag;
		}
				
		var defaults = {
			name: 'base_op',
			language: '',
			path: '/assets/lang/',
			mode: 'map',
			cache: true,
			encoding: 'UTF-8',
			async: false,
			checkAvailableLanguages: false,
			callback: null,
			suffix: '.js'
		};
		settings = $.extend(defaults, settings);

		$.i18n.properties(settings);
	};
	
	/**
	 * *
	 * 用途：返回单独的某个key的值
	 *
	 * 调用方式有3种：
	 * 假设文字库配置如下
	 * hello=你好
	 * hello2=你好，{0}
	 * world=世界
	 * （1）i18n.prop("hello")
	 * 输出:你好
	 * （2）i18n.prop("hello2", "Tom")
	 * 输出:你好，Tom
	 * （3）i18n.prop("hello", "KEY=world")
	 * 输出:你好，世界	 
	 * 注：KEY= 为默认的分隔符；如需要修改，可在初始化时，设置settings的splitFlag属性；
	 */
	i18n.prop = function() {
		var execStr = "";
		for (var i = 0; i < arguments.length; i++) {
			arguments[i].startsWith()
			if( i > 0 && arguments[i].startsWith(i18n.splitFlag) ){
				execStr += "'" + i18n.prop(arguments[i].substr(i18n.splitFlag.length, arguments[i].length-i18n.splitFlag.length)) + "',";
			}else{
				execStr += "'" + arguments[i] + "',";
			}						
		}
		execStr = "$.i18n.prop(" + execStr.substr(0, execStr.length-1) + ")";
		
		return eval(execStr);
	}

	/**
	 * *
	 * 用途：将某节点下的所有带有属性data-localize的元素都国际化
	 * 
	 * 调用方式分2种场景：
	 * 假设文字库配置如下
	 * hello=你好
	 * hello2=你好，{0}
	 * world=世界
	 * （1）将父节点下所有带有data-localize属性的标签的text、placeholder、value国际化；
	 *  <span data-localize='hello'></span>
	 * 输出：<span data-localize='hello'>你好</span>
	 * （2）将父节点下所有带有title-localize属性的标签的title属性国际化，如a、span的title属性；
	 * <span title-localize='hello'></span>
	 * 输出：<span title='你好' title-localize='hello'></span>
	 * 
	 */
	i18n.localize = function(parentNode) {
		$(parentNode).find("[text-i18n]").each(function(i) {
			var elem = $(this),
				localizedValue = $.i18n.prop(elem.attr("text-i18n"));				
				
			if (elem.is("input[type=text]") || elem.is("input[type=password]") || elem.is("input[type=email]")) {
				elem.attr("placeholder", localizedValue);
			} else if (elem.is("input[type=button]") || elem.is("input[type=submit]") || elem.is("input[type=reset]") ) {
				elem.attr("value", localizedValue);
			} else {
				elem.text(localizedValue);
			}
		});
		
		$(parentNode).find("[title-i18n]").each(function(i) {
			var elem = $(this),
				localizedValue = $.i18n.prop(elem.attr("title-i18n"));				
				
			elem.attr("title", localizedValue);
		});
	}


	return i18n;
});