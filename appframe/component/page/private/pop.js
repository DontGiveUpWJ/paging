define(function(){
     /**
    * 组件名:pop<br/>
    * 组件功能：弹框组件
    * @exports pop
    * @author kangjy
    * @version 1.0
    * @class
    */
    var pop={};
	pop.dialog = function(options) {
        var defaults = {
            html: '',
            title: '',
            icon: '',
            showClose: true,
            buttons: {
                '确定': 1,
                '取消': 0
            },
            showMask: true,
            css: null,
            callback: null,
            isPrompt: false,
            width:""
        };
        var opt = $.extend(defaults, options);
        $('#ued_dialog,#ued_dialog_mask').remove();
        var _obj, _mask;

        //初始化
        showDialog(opt); //show

        //组合html
        function createHtml() {
            //蒙版
            var _showMask = opt.showMask ? '<div class="ued-mask"  id="ued_dialog_mask"></div>' : '';

            //header;
            var _header = '<div class="dialog-header">' + (opt.title ? opt.title : '');
            _header += (opt.showClose ? '<a class="dialog-close">×</a>' : '');
            _header += '</div>';

            //icon
            var _icon = opt.icon ? '<span class="dialog-icon icon-' + opt.icon + '"></span>' : '';

            //body
            var _body = '<div class="dialog-body color-7 font-s18">' + _icon + opt.html + '</div>';

            //footer
            var _footer = '';
            if (opt.buttons) {
                _footer = '<div class="dialog-footer">';
                for (var key in opt.buttons) {
                    var _isCancel = opt.buttons[key] == 0 ? 'btn-default' : 'btn-warn';
                    _footer += '<input type="button" data-callback="' + opt.buttons[key] + '" class="ued-btn ' + _isCancel + '" value="' + key + '">';
                }
                _footer += '</div>';
            }

            var _res = {
                mask: _showMask,
                content: _header + _body + _footer
            };
            return _res;

        }

        //显示
        function showDialog(opt) {
            var _html = createHtml();
            var width = opt.width || "auto";
            $('body').append(_html.mask + '<div class="ued-dialog" id="ued_dialog" style="width:'+width+'">' + _html.content + '</div>');
            _obj = $('#ued_dialog');
            _mask = $('#ued_dialog_mask');

            if (opt.css) _obj.css(opt.css);
            
            var clientHeight = (window.innerHeight || document.documentElement.clientHeight) - 20;
            
            _obj.css({
                //'margin-top': -parseInt(_obj.height() / 2),
                'margin-top':'0px',
                'margin-left': -_obj.width() / 2,
                'top':(clientHeight - _obj.height())/2
            }).show();
            opt.showMask ? _mask.show() : _mask.hide();

            $('#ued_dialog input').eq(0).focus();
        }


        //回调 & 隐藏
        function _callback(value) {

            function innerBack() {
                if (typeof opt.callback == 'function') {
                    opt.callback(value);
                }
            }

            $(document).unbind('keyup');
            opt.isPrompt ? $('#dialog_input').unbind('keyup') : null;

            $('#ued_dialog, #ued_dialog_mask').fadeOut(80);
            setTimeout(function() {
                innerBack();
            }, 70);
        }

        //事件绑定
        $('.dialog-footer .ued-btn').click(function() {
            var _dataVal = parseInt($(this).attr('data-callback'));
            _callback(_dataVal);
        });

        //关闭按钮点击事件
        $('.dialog-close').click(function() {
            _callback('close');
        });

        //点击Esc事件
        $(document).bind('keyup', function(e) {
            e.keyCode == 27 ? _callback('close') : '';
        });

        //isPrompt
        if (opt.isPrompt) {
            $('#dialog_input').bind('keyup', function(e) {
                e.keyCode == 13 ? _callback(1) : null;
            });
        }
    };


    

    /**
     * ued.confirm ->start
     * confirm弹出框
     * @param {string} message 显示的提示信息
     * @param {function} callback 回调函数，点击确定 返回 true，取消 返回 false，其他操作不返回值
     * @param {string} [title] 弹框的title
     * @return void
     * 
     */
    pop.confirm = function(message, icon, callback,title) {
        var _t=!!title?title:'提示信息';
        return pop.dialog({
            title: _t,
            html: message || '',
            icon: icon,
            showClose: true,
            callback: function(r) {
                if (r === 1 && typeof callback == 'function') {
                    callback(true);
                } else if(typeof callback == 'function'){
                    callback(false);
                }
            }
        });
    };

    /**
     * ued.confirm ->start
     * alert弹出框
     * @param string message 显示的提示信息
     * @param function callback 回调函数，点击确定 返回 true，取消 返回 false，其他操作不返回值
     * @return void;
     * */
    pop.prompt = function(message, callback) {
        var _html = message || '';
        _html += '<input type="text" class="dialog-input" id="dialog_input">';
        return pop.dialog({
            html: _html,
            showClose: false,
            isPrompt: true,
            callback: function(r) {
                if (typeof callback != 'function' || r == 'close') return;
                if (r == 1) {
                    callback($('#dialog_input').val());
                }
            }
        });
    };
    pop.loading = function(statusOrTitle) {
        var _obj = $('.js_ued_load');
        var _bg = _obj.find('.load-bg');
        var _icon = _bg.find('i');
        var _title = statusOrTitle || '加载中…';
        var _time = null;
        var _timeDelay = 4000;

        return _init();

        function _init() {
            if (statusOrTitle === 1) {
                return loaded();
            }
            if (_obj.length) {
                _obj.remove();
            }
            show();
            animate();
            _time = setInterval(animate, _timeDelay - 1000);
        }

        function show() {

            var _html = '<div class="ued-load js_ued_load"><div class="ued-mask"></div><div class="load-wrap">' + '<div class="load-animate"><div class="load-logo"></div><div class="load-bg"> <i></i>' + '</div>  </div>' + _title + '</div></div>';
            $(_html).appendTo('body').show();
            _obj = $('.js_ued_load');
            _bg = _obj.find('.load-bg');
            _icon = _bg.find('i');
        }

        function animate() {
            _bg.stop().css('top', -80).animate({
                'top': 0
            }, {
                easing: 'easeOutExpo',
                duration: _timeDelay
            });
            _icon.stop().css('top', 105).animate({
                'top': 25
            }, {
                easing: 'easeOutExpo',
                duration: _timeDelay
            });
        }

        function loaded() {
            clearInterval(_time);
            _bg.stop().css('top', 0);
            _icon.stop().css('top', 25);
            _obj.hide(100);
        }
    }
    /**
     * ued.alert ->start
     * alert弹出框
     * @param string message 显示的提示信息
     * @param function callback 回调函数，点击确定 返回 true，其他操作不返回值
     * @return void;
     * */
    pop.alert = function(message, icon, callback) {
        return pop.dialog({
            title: '提示信息',
            html: message || '',
            showClose: true,
            icon: icon,
            buttons: {
                '确定': 1
            },
            showMask: true,
            callback: function(r) {
                if (r === 1 && typeof callback == 'function') {
                    callback(true);
                }
            }
        });
    };
	/**
     * ued.confirm ->start
     * confirm错误弹出框
     * @param string msg 显示的提示信息
     * @param function 回调函数，点击确定 返回 true，取消 返回 false，其他操作不返回值
     * @return void;
     * */
	pop.error = function(msg,fn){
		 pop.confirm(msg, 'error',fn);
	};
	/**
     * ued.confirm ->start
     * confirm成功弹出框
     * @param string msg 显示的提示信息
     * @param function 回调函数，点击确定 返回 true，取消 返回 false，其他操作不返回值
     * @return void;
     * @example 
     *  require(['pop'],function(Pop){
     *      Pop.success("办理成功",function (argument) {
     *          console.log(argument);
     *      })
     *  })
     * */
	pop.success=function(msg,fn){
	 pop.confirm(msg, 'success',fn);
	}
	/**
     * ued.confirm ->start
     * confirm警告弹出框
     * @param string msg 显示的提示信息
     * @param function 回调函数，点击确定 返回 true，取消 返回 false，其他操作不返回值
     * @return void;
     * @example 
     *  require(['pop'],function(Pop){
     *      Pop.warning("你是否要办理",function (argument) {
     *          console.log(argument);
     *      })
     *  })
     * */
	pop.warning=function(msg,fn){
	 pop.confirm(msg, 'warn',fn);
	}
	/**
     * ued.confirm ->start
     * 弹出进度框
     * @param string msg 显示的提示信息
     * @return void;
     * @example 
     *  require(['pop'],function(Pop){
     *      Pop.process("加载中，请稍后...",function (argument) {
     *          console.log(argument);
     *      })
     *  })
     * */
	pop.process=function(){
		pop.loading()
	}
    /**
     * ued.confirm ->start
     * 关闭进度框
     * @param string msg 显示的提示信息
     * @return void;
     * @example 
     *  require(['pop'],function(Pop){
     *      Pop.stopprocess();
     *  })
     **/
	pop.stopprocess=function(){
		pop.loading(1)
	}
	return pop;
});