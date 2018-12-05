define(["ajaxutil",'uri','pop'], function(ajaxUtil,Uri,Pop) {
	var util = {};
	var traceid;
	util.callrest = function(url,fn,indata) {
		//Pop.process("加载中，请稍后...");
		var uri = new Uri(url);
		//uri.addQueryParam("traceid",_Constant.TARCE_ID);
		ajaxUtil.getJson(
			uri.toString(),
			function(data) {
				fn(data);
			},
			indata);
	};
	util.postrest = function(url,fn,indata) {
		//Pop.process("加载中，请稍后...");
		var uri = new Uri(url);
		//uri.addQueryParam("traceid",_Constant.TARCE_ID);
		ajaxUtil.postJson(
			uri.toString(),
			function(data) {
				fn(data);
			},
			indata);
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