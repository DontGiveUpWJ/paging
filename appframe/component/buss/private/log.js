define(function() {
	/**
	 * 组件名:log<br/> 组件功能：一个Log日志工具类
	 * 
	 * @exports log
	 * @author kangjy
	 * @version 1.0
	 * @class
	 */
	var Log = {}, Level = {};
	Level.L_ALL = 0x01111, Level.L_NOTIC = 0x00001, Level.L_DEBUG = 0x00010,
			Level.L_WARNI = 0x00100, Level.L_ERROR = 0x01000,
			Level.L_NORMAL = 0x01101;
	var definelevel = Level.L_ALL;
	function now(withoutMilliseconds) {
		var d = new Date(), str;
		str = [ d.getHours(), d.getMinutes(), d.getSeconds() ].join(':')
				.replace(/\b\d\b/g, '0$&');
		if (!withoutMilliseconds) {
			str += '.' + ('00' + d.getMilliseconds()).substr(-4);
		}
		return str;
	}
	;
	function log(type, msg, code) {
		code = code || 0;
		if ((definelevel & code) > 0) {
			var listener = Log.on[type];
			if (listener) {
				listener(msg);
			}
			Log.on.any(type, msg);
		}
	}
	Log.on = {
		any : function(type, msg) {
		},
		debug : function(msg) {
			console.debug(msg)
		},
		info : function(msg) {
			console.log(msg)
		},
		warning : function(msg) {
			console.warn(msg)
		},
		error : function(msg) {
			console.error(msg)
		}
	};
	/**
	 * 输出debug日志
	 * 
	 * @param {string}
	 *            msg 显示的提示信息
	 */
	Log.debug = function(msg) {
		log('debug', now() + ' ' + msg, Level.L_DEBUG);
	};
	/**
	 * 输出info日志
	 * 
	 * @param {string}
	 *            msg 显示的提示信息
	 */
	Log.info = function(msg) {
		log('info', msg, Level.L_NOTIC);
	};
	/**
	 * 输出warning日志
	 * 
	 * @param {string}
	 *            msg 显示的提示信息
	 */
	Log.warning = function(msg) {
		log('warning', msg, Level.L_WARNI);
	};
	/**
	 * 输出error日志
	 * 
	 * @param {string}
	 *            msg 显示的提示信息
	 */
	Log.error = function(err) {
		log('error', err, Level.L_WARNI);
	};
	return Log;

})