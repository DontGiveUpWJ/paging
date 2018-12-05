define([ 'cookie', 'doTimeout' ], function() {
	/**
	 * 组件名:appevent<br/> 组件功能：完成app组件之间的事件触发，监听。
	 * 
	 * @exports appEvent
	 * @author kangjy
	 * @version 1.0
	 * @class
	 */
	var appevent = {};
	appevent._eventrepo = {};
	appevent._goleventrepo = {};
	appevent._goleventdata = {};
	/**
	 * 组件初始化时候将该域下的cookie记录
	 */
	$.each($.cookie(), function(index, val) {
		appevent._goleventdata[index] = val;
	});
	/**
	 * 触发一个当前标签内的事件
	 * 
	 * @param {string}
	 *            event_type 事件类型
	 * @param {string}
	 *            data 事件数据
	 */
	appevent.trigger = function(event_type, data) {
		$.each(appevent._eventrepo[event_type], function(index, val) {
			val(data);
		});
	}
	/**
	 * 捕获标签页内的事件
	 * 
	 * @param {string}
	 *            event_type 待捕获事件类型
	 * @param {string}
	 *            fn 回调函数
	 */
	appevent.on = function(event_type, fn) {
		var fnevent = appevent._eventrepo[event_type];
		if (!fnevent) {
			fnevent = [];
		}
		fnevent[fnevent.length] = fn;
		appevent._eventrepo[event_type] = fnevent;
	}
	/**
	 * 触发全局标签内的事件
	 * 
	 * @param {string}
	 *            event_type 事件类型
	 * @param {string}
	 *            data 事件数据
	 */
	appevent.globletrigger = function(event_type, data) {
		$.cookie(event_type, data, {
			path : '/'
		});
	}
	/**
	 * 捕获一个全局的事件
	 * 
	 * @param {string}
	 *            event_type 待捕获事件类型
	 * @param {string}
	 *            fn 回调函数
	 */
	appevent.globleon = function(event_type, fn) {
		var golfnevent = appevent._goleventrepo[event_type];
		if (!golfnevent) {
			golfnevent = [];
		}
		golfnevent[golfnevent.length] = fn;
		appevent._goleventrepo[event_type] = golfnevent;
	}
	/**
	 * 默认每隔500毫秒去刷新当前全局事件
	 */
	$.doTimeout('eventid', 500, function() {
		var ss = appevent._goleventrepo;
		$.each($.cookie(), function(index, val) {
			if (appevent._goleventdata[index] != val) {
				appevent._goleventdata[index] = val;
				if (!!ss[index]) {
					$.each(ss[index], function(index, valf) {
						valf(val);
					});
					return false;
				}
			}
		});
		return true;
	});
	return appevent;
})