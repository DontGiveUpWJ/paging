define(["commonutil"],function(ajaxUtil){
	var common_rest={},_Constant=Namespace('all.constant');
	common_rest.queryUserInfo=function(fn){
		if(_Constant.phone==""){
			return;
		}
		var _userInfoData=_Constant.userInfo;
		if(!!_userInfoData){
			console.warn("去缓冲信息");
			fn(_userInfoData);
		}else{
			ajaxUtil.callrest('/rest/v1/user/userSession',function(data){
				console.warn("调用用户查询服务");
				console.log(_Constant);
				_Constant.userInfo=data;
				fn(data);
			},{});
		}
		
	}
	common_rest.queryLoginInfo=function(fn){
		var _loginInfoData=_Constant.loginInfo;
		if(!!_loginInfoData){
			fn(_loginInfoData);
		}else{
			ajaxUtil.callrest('/rest/v1/session/backSession',function(data){
				_Constant.loginInfo=data;
				fn(data);
			},{});
		}
		
	}
	return common_rest;
})