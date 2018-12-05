define(['./dialog-plus','css!./ui-dialog','../../open/jquery.easing'],function(){
	var pop={};
	pop.html=function(content,obj,fn){
		var defaultobj={
			width:"500px",
			height:"auto",
			padding:"10px"
		}	
		$.extend(defaultobj,obj);
		if (obj&&obj.id == undefined) { obj.id = 'sBox_' + Math.floor(Math.random() * 1000000); }
		var _dialog=null,$wappercontent=$('<div  id="'+defaultobj.id+'" class="section-panel hide" style="display: block;"></div>'),$close=$('<span class="fr diacancle pio-close js_dialog_close">×</span>');
		$wappercontent.append($close).append(content);
		_dialog=dialog({
		    content:$wappercontent[0],
		    padding:defaultobj.padding,
		    width:defaultobj.width,
		    height:defaultobj.height
		}).showModal();
		$wappercontent.find(".diacancle").on("click",function(e){
			_dialog.remove();
		});
		if(!!fn){
			fn(_dialog);
		}
		return _dialog;
	}
	pop.remotehtml=function(url,obj,fn){
		$.get(url,function(data){
			var __dialog=pop.html($(data),obj,fn);
		})
	}

	pop.success=function(msg,fn){
		var obj={
			button:{
				"ok":"确定"
			},
			type:"success"
		}
		if(typeof fn === "function"){
			obj.fn=fn;
		}
		return pop.confirm(msg,obj);
	}
	pop.error=function(msg,fn){
		var obj={
			button:{
				"ok":"确定"
			},
			type:"error"
		}
		if(typeof fn === "function"){
			obj.fn=fn;
		}
		return pop.confirm(msg,obj);
	}
	pop.warn=function(msg,fn){
		var obj={
			button:{
				"ok":"确定"
			},
			type:"warn"
		}
		if(typeof fn === "function"){
			obj.fn=fn;
		}
		return pop.confirm(msg,obj);
	}
	pop.confirm = function(message,obj){
		var defaultobj={
			title:"提示消息",
			button:{
				"ok":"确定",
				"cancle":"取消"
			},
			type:"warn",
			fn:function(){
				this.remove();
			},
			width:"500px",
			height:"auto",
			padding:0
		}
		if (obj.id == undefined) { obj.id = 'sBox_' + Math.floor(Math.random() * 1000000); }
		var _dialog=null;
		$.extend(defaultobj,obj);
		var $content=$('<div id="'+defaultobj.id+'" class="ued-plusdialog"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-7 font-s18"><span class="dialog-icon"></span>'+message+'</div><div class="dialog-footer"></div></div>');
		$content.find('.dialog-icon').addClass('icon-'+defaultobj.type);
		var $close=$('<a class="dialog-close">×</a>)');
		var $footer=$content.find(".dialog-footer");
		if(defaultobj.button.ok){
			var $ok=$('<input type="button" data-callback="1" class="ued-btn btn-warn" value="'+defaultobj.button.ok+'">');
			$footer.append($ok);
			$ok.on("click",function(){
				var result=defaultobj.fn.call(_dialog,true);
				if(!result||result==false){
					_dialog.remove();
				}
			})
		}
		if(defaultobj.button.cancle){
			var $cancle=$('<input type="button" data-callback="0" class="ued-btn btn-default" value="'+defaultobj.button.cancle+'">');
			$footer.append($cancle);
			$cancle.on("click",function(){
				var result=defaultobj.fn.call(_dialog,false);
				if(!result||result==false){
					_dialog.remove();
				}
			})
		}
		$content.find(".dialog-header").append($close).find('.dialog_title').html(defaultobj.title);
		_dialog=dialog({
		    content:$content[0],
		    padding:defaultobj.padding,
		    width:defaultobj.width,
		    height:defaultobj.height
		}).showModal();
		$close.click(function(){
			_dialog.remove()
		});
		return _dialog;
		
	}

	pop.process=function(message){
		if(typeof message === 'undefined')message="加载中...";
		var _sid = 'sBox_' + Math.floor(Math.random() * 1000000);
		var _$obj=$('<div class="ued-load js_ued_load"><div class="load-pluswrap">' + '<div class="load-animate"><div class="load-logo"></div><div class="load-bg"> <i></i>' + '</div>  </div>' + message + '</div></div>');
		var _bg = _$obj.find('.load-bg');
	    var _icon = _bg.find('i');
	    var _time = null;
	    var _timeDelay = 4000;	
		var _dialog=dialog({
			    content: _$obj[0],
			    padding:0,
			    width:"330px",
			    id:_sid
		}).showModal();
		animate();
	    _time = setInterval(animate, _timeDelay - 1000);
	    return _dialog;
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
	return pop;
});
