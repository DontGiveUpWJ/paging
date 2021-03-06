﻿define(['css!appframe/component/buss/private/laypage/laypage.css', ], function() {
    /*!
     
     @Name : layPage v1.3- 分页插件
     @Author: 贤心
     @Site：http://sentsin.com/layui/laypage
     @License：MIT
     
	 //luolin modify
     */


    var pageing = function(id, fn, sum, page, show) {
        var pages = Math.ceil(sum / page);
        var options = {
            cont: $(id), //容器。值支持id名、原生dom对象，jquery对象,
            pages: pages,
            skin: '#ff8200',
            skip: true, //是否开启跳页
            prev: '«', //若不显示，设置false即可
            next: '»', //若不显示，设置false即可
            first: "<lable text-i18n='page.text.laypage.first'>首页</lable>", //若不显示，设置false即可
            last: "<lable text-i18n='page.text.laypage.last'>尾页</lable>", //若不显示，设置false即可
            jump: fn,
            show: show
        };
        new Page(options);
    }


    var laypage = {
        v: '1.3'
    }

    var doc = document,
        id = 'getElementById',
        tag = 'getElementsByTagName';
    var index = 0,
        Page = function(options) {
            var that = this;
            var conf = that.config = options || {};
            conf.item = index++;
            that.render(true);
        };

    Page.on = function(elem, even, fn) {
        elem.attachEvent ? elem.attachEvent('on' + even, function() {
            fn.call(elem, window.even); //for ie, this指向为当前dom元素
        }) : elem.addEventListener(even, fn, false);
        return Page;
    };

    Page.getpath = (function() {
        var js = document.scripts,
            jsPath = js[js.length - 1].src;
        return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
    }())


    //判断传入的容器类型111
    Page.prototype.type = function() {
        var conf = this.config;
        if (typeof conf.cont === 'object') {
            return conf.cont.length === undefined ? 2 : 3;
        }
    };

    //分页视图
    Page.prototype.view = function() {
        var that = this,
            conf = that.config,
            view = [],
            dict = {};
        conf.pages = conf.pages | 0;
        conf.curr = (conf.curr | 0) || 1;
        conf.groups = 'groups' in conf ? (conf.groups | 0) : 5;
        conf.first = 'first' in conf ? conf.first : '&#x9996;&#x9875;';
        conf.last = 'last' in conf ? conf.last : '&#x5C3E;&#x9875;';
        conf.prev = 'prev' in conf ? conf.prev : '&#x4E0A;&#x4E00;&#x9875;';
        conf.next = 'next' in conf ? conf.next : '&#x4E0B;&#x4E00;&#x9875;';

		if (conf.pages <= 1) {
            if (conf.show == true) {
                return '<div name="laypage' + laypage.v + '" class="pagination-border mgr-40" id="laypage_' + that.config.item + '"><ul>' + view.join('') + function() {
            return conf.skip ? '<li class="mgl-10">共'+conf.pages+'页</li>' : '';
            }() + '</ul></div>';
            } else {
                return '';
            }
        }

        if (conf.groups > conf.pages) {
            conf.groups = conf.pages;
        }

        //计算当前组
        dict.index = Math.ceil((conf.curr + ((conf.groups > 1 && conf.groups !== conf.pages) ? 1 : 0)) / (conf.groups === 0 ? 1 : conf.groups));

        //当前页非首页，则可选
            view.push('<li><a href="javascript:;" '+(conf.curr<=1?'class="disabled"':'')+' data-page="' + (conf.curr - 1) + '">' + conf.prev + '</a></li>');

        //输出当前页组
        dict.poor = Math.floor((conf.groups - 1) / 2);
        dict.start = dict.index > 1 ? conf.curr - dict.poor : 1;
        dict.end = dict.index > 1 ? (function() {
            var max = conf.curr + (conf.groups - dict.poor - 1);
            return max > conf.pages ? conf.pages : max;
        }()) : conf.groups;
        if (dict.end - dict.start < conf.groups - 1) { //最后一组状态
            dict.start = dict.end - conf.groups + 1;
        }
        for (; dict.start <= dict.end; dict.start++) {
			if (dict.start === conf.curr) {
                view.push('<li '+(conf.curr==dict.start?'class="active"':'')+'><a href="javascript:;"> '+dict.start+' </a></li>');
            } else {
                view.push('<li><a href="javascript:;" data-page="' + dict.start + '">' + dict.start + '</a></li>');
            }
                
        }

        //当前页不为尾页时，则可选
            view.push('<li><a href="javascript:;" '+(conf.curr==conf.pages?'class="disabled"':'')+' data-page="' + (conf.curr + 1) + '">' + conf.next + '</a></li>');

        return '<div name="laypage' + laypage.v + '" class="pagination-border mgr-40" id="laypage_' + that.config.item + '"><ul>' + view.join('') + function() {
            return conf.skip ? '<li class="mgl-10">共'+conf.pages+'页，到第<input id="inputPage" type="text" value="'+conf.curr+'">页<button class="btn btn-info btn-super-mini mgl-10">确定</button></li>' : '';
        }() + '</ul></div>';
		
		
    };

    //跳页
    Page.prototype.jump = function(elem) {
        if (!elem) return;
        var that = this,
            conf = that.config,
            childs = elem[tag]('a');
        var btn = elem[tag]('button')[0];
        var input = elem[tag]('input')[0];
        for (var i = 0, len = childs.length; i < len; i++) {
            if (childs[i].nodeName.toLowerCase() === 'a') {
                Page.on(childs[i], 'click', function() {
					if($(this).attr('class')=='disabled'||$(this).parent().attr('class')=='active'){
			        return;
		            }
                    var curr = this.getAttribute('data-page') | 0;
					if (curr && curr <= conf.pages) {
						conf.curr = curr;
						that.render();
					}
                });
            }
        }
        if (btn) {
            Page.on(btn, 'click', function() {
                var curr = input.value.replace(/\s|\D/g, '') | 0;
                if (curr && curr <= conf.pages) {
                    conf.curr = curr;
                    that.render();
                }
            });
        }
    };

    //渲染分页
    Page.prototype.render = function(load) {
        var that = this,
            conf = that.config,
            type = that.type();
        var view = that.view();
        if (type === 2) {
            conf.cont.innerHTML = view;
        } else if (type === 3) {
            conf.cont.html(view);
        } else {
            doc[id](conf.cont).innerHTML = view;
        }
        conf.jump && conf.jump(conf.curr, load);
        that.jump(doc[id]('laypage_' + conf.item));
        if (conf.hash && !load) {
            location.hash = '!' + conf.hash + '=' + conf.curr;
        }
    };

    return pageing;
})