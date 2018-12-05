$(function () {
	
	//$("#checkCode_show").attr("src", "/servlet/IdentityServlet?ts=" + (new Date).getTime());
    
	$("#checkCode_show").attr("src", "/ClinicCountManager/kaptcha");
	
	  $("#checkCode_show").click(function () {        
	        $("#checkCode_show").attr("src", "/ClinicCountManager/kaptcha");
	    });
//    $("#checkCode_show").click(function () {        
//        $("#checkCode_show").attr("src", "/servlet/IdentityServlet?ts=" + (new Date).getTime());
//    });
	  require(['pluspop'],function(pop){
		   $("#login-button").click(function () {
		        var loginNo = $("#exampleInputAmount").val();
		        var passWord = $("#exampleInputAmount1").val();
		        var checkCode = $("#checkCode").val();
		        var urlCurrent= window.location.href;
		        var urlarg;
		        var refer;
		        if(urlCurrent.indexOf("?")>=0){
		        	urlarg=new getarg();
		            refer=urlarg["refer"];
		            var url = decodeURI(window.location.href);
		            var allargs;
		            if(url.split("?")[2]!=null&&url.split("?")[2]!=undefined){
		            	allargs = url.split("?")[2]; 
		            	refer=refer+"?"+allargs;
		            }
		            	
		           
		        }
		       if (checkCode == '' || checkCode == '请输入验证码') {
		    	   {  pop.success("验证码不能为空");
		              $("#exampleInputAmount").val("");
		              $("#exampleInputAmount1").val("");
		    	   }
		        	   
		          return;
		         }
		      
//		        if (loginNo == '' || loginNo == '请输入用户名') {
//		            $.dialog.alert("用户名不能为空", null, this);
//		            return;
//		        }
//		        if (passWord == '') {
//		            $.dialog.alert("密码不能为空", null, this);
//		            return;
//		        }
//		        if (checkCode == '' || checkCode == '请输入验证码') {
//		            $.dialog.alert("验证码不能为空", null, this);
//		            return;
//		        }
//		        // 对用户名和密码进行加密
		        
//		        stc.rest.query("/public/keyPair", {}, function (data) {
//		            var modulus = data.modulus;
//		            var exponent = data.exponent;
//		            var busiParam = {"busiData": {"loginNo": RSAUtils.encryptedString(RSAUtils.getKeyPair(exponent, '', modulus), loginNo),
//		                "passWord": RSAUtils.encryptedString(RSAUtils.getKeyPair(exponent, '', modulus), passWord),
//		                "checkCode": checkCode
//		            }
//		            };
//		            stc.rest.queryForPost("/prm/login", {"busiParam": JSON.stringify(busiParam)}, function (data) {
//		                //data.role_type:5:买家6:卖家3:运营商（管理员）7:渠道管理员
//		                if (data.login_type == '5') {
//		                    //获取service
//		                    var requestArr = getRequest();
//		                    var serviceUrl = requestArr["service"];
//		                    if (serviceUrl != undefined && serviceUrl != "" && serviceUrl != null) {
//		                        window.location.href = decodeURIComponent(serviceUrl);
//		                    } else {
//		                        window.location.href = STC_RELATIVE_PATH + "mall.html";
//		                    }
//		                } else if (data.login_type == '6') {
//		                    window.location.href = STC_RELATIVE_PATH + "shop.html";
//		                } else if (data.login_type == '3') {
//		                    window.location.href = STC_RELATIVE_PATH + "mall.html";//现场需求改成首页
//		                } else if (data.login_type == '7') {
//		                    window.location.href = STC_RELATIVE_PATH + "channel.html";
//		                } else if (data.login_type == '9') {
//		                    window.location.href = STC_RELATIVE_PATH + "walsoonShop.html";
//		                } else {
//		                    $.dialog.alert("没有分配角色", null, this);
//		                }
		//
//		            }, function (code, msg) {
//		                $.dialog.alert(msg);
//		            }, function () {
//		                $.dialog.alert("系统错误，请联系管理员");
//		            });
//		        }, function (code, msg) {
//		            $.dialog.alert(msg);
//		        }, function () {
//		            $.dialog.alert("系统错误，请联系管理员!");
//		        });
		       
				$.ajax({
					type : "POST",
					url : "/v1/session/getAttribute",
					data : {"code":""},
					success : function(ret) {	
					    var code = ret.ROOT.BODY.OUT_DATA.SESSION_INFO.code;
						if(code!=null && code!=""&&code!=checkCode)
							{
							pop.success("亲，输入的验证码不正确请重新输入");
						       $("#checkCode").val("");
						       return false;
							}
					    	else
					    	{
					    		var jid = $('#exampleInputAmount').get(0).value;
					            var password = $('#exampleInputAmount1').get(0).value;				            
								//alert(JSON.stringify(ret));
								$.ajax({
									type : "POST",
									url : "/v1/sso/login",
									data : {"USER_NAME":loginNo,"PASSWORD":passWord},
									success : function(ret) {
										localStorage.setItem("jid",jid);
							            localStorage.setItem("password",password);
										if(ret.ROOT.BODY.OUT_DATA.LOGININFO.status=='0'){								
											var loginNo= ret.ROOT.BODY.OUT_DATA.LOGININFO.mobile;
											var userId= ret.ROOT.BODY.OUT_DATA.LOGININFO.userId;
											var nickName= ret.ROOT.BODY.OUT_DATA.LOGININFO.nickname;
											var enterCode= ret.ROOT.BODY.OUT_DATA.LOGININFO.enter_code;
																			
											loginInfo(loginNo,userId,nickName,enterCode);
											if(refer==undefined||refer==null){
												window.location.href="index.html";	
											}else{
												window.location.href=refer;
											}
											
										}else{
											pop.success("用户名和密码不正确");
										}
										
									}// success
								});// ajax调用
					    	}	
					
					}
				});// ajax调用
				
					        
		    });
		  
	  })
 
    
    $(".regist_go").click(function () {
        window.location.href = STC_RELATIVE_PATH + "login/regist.html";
    });
    $(".update_pass").click(function () {
        window.location.href = STC_RELATIVE_PATH + "login/pwupdate.html";
    });
    document.onkeydown = function (event) {
        e = event ? event : (window.event ? window.event : null);
        if (e.keyCode == 13) {
            $(".login-btn").click();
        }
    }

});
function loginInfo(loginNo,userId,nickName,enterCode){
	sessionStorage.loginNo=loginNo;
	sessionStorage.userId=userId;
	sessionStorage.nickName=nickName;
	sessionStorage.enterCode=enterCode;
	
}



function getPassWordText(obj) {
    document.getElementById('passWordText').style.display = 'none';
    document.getElementById('passWord').style.display = '';
    document.getElementById('passWord').focus();
    obj.value = document.getElementById('passWord').value;
}
function checkPassValue(obj) {
    if (obj.value == '') {
        obj.style.display = 'none';
        document.getElementById('passWordText').style.display = '';
        document.getElementById('passWordText').value = "请输入密码";
    }
}
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest;
}