define(["ajaxutil",'uri','pop'], function(ajaxUtil,Uri,Pop) {
	var util = {};
	var traceid;
	var dlgCounts = 0;
	util.callrest = function(url,fn,indata,async) {
		//Pop.process("加载中，请稍后...");
		var uri = new Uri(url);
		if(async==undefined)	async=true;
		//uri.addQueryParam("traceid",_Constant.TARCE_ID);
		ajaxUtil.getJson(
			uri.toString(),
			function(data) {
				fn(data);
			},
			indata,
			async);
	};
	util.postrest = function(url,fn,indata,async,waiting) {
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
		ajaxUtil.postJson(
			uri.toString(),
			function(data) {
				fn(data);
				if(waiting && --dlgCounts <= 0){
					showLoading(false);
	        	         }
			},
			indata,
			async);
	};
	
	util.callpoprest=function(url,injson,fn,optype){
		optype=optype?optpye:"";
		Pop.process(" 加载中，请稍后...");
		util.callrest(url,function(data){
			Pop.stopprocess();
			if (data.retCode != 0) {
				   Pop.error(data.retMsg,function (argument) {
					   console.log(argument);
				   });
				   chaMa("IQ_GCCX","-99","");
			   }else{
				   chaMa("IQ_GCCX","99","");
				   fn(data); 
			   }
		},injson);   
	}
	return util;
})