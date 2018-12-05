//登录页面用户名获取焦点
Ext = window.parent.Ext;
//工程根目录设置--为统一OP工程设置
Ext.rootPath = "/appframe/component/page/private/im";
//业务OP的登录地址--为统一OP工程设置
Ext.opLoginUrl = "http://localhost:8080/npage/login.html";
//用户名后缀设置
Ext.login_suffix = "@im.on-con.com";
//单聊接收客服设置
//Ext.receiver = "13920012629"+Ext.login_suffix;
Ext.receiver = "13920012629"+Ext.login_suffix;
//Ext.receiver = "13256699266"+Ext.login_suffix;
//跳转至登录页路径设置
Ext.login_href = Ext.rootPath + "/pub-page/login.html?refer=" + Ext.opLoginUrl;
//获取群列表、获取房间列表
//Ext.dataUrl = "http://172.21.2.201:9124/plugins/controlchatroom/chatroomservlet";
Ext.dataUrl = "http://172.21.2.201:9124/oncon-service/sys_credential/m1_chatroom_members_query/v1.0?access_token=";

//聊天服务器的 地址,nbc的openfire
Ext.serverUrl = "http://172.21.2.201:7070/http-bind/";

Ext.msgids =  new Array();

$(function () {
//创建群事件
    $("#btn-add-group").click(function () {
        createRoomFun();
    });
//好友名称事件
    $("#client-service").click(function () {    	    	    	
    		$(this).attr("data-id",Ext.receiver);
    		var jid = LOGINNO;
    		if(jid){
    			jid += Ext.login_suffix;
    		}
        var password = PWD;
        
        if (jid == null && password == null) {
            $("#client-service").attr("href", Ext.login_href);
            return;
        }

        loginWebIM();
        //var customerId=sessionStorage.customerId;
        //alert(customerId);
            jump=clearInterval(jump);
            var li = $(this);
            var jid = li.attr("data-id");
            //var converseId = Ext.bare_jid + "TO" + jid;
            var text = jid;
            console.log("50--" + Ext.dialogPanel);
            if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {               
               window.frames["IMiframe"].initUserWin(jid, text);
                /*IMiframe.window.initUserWin(jid,text);*/
                /*document.getElementById("IMiframe").contentWindow.initUserWin(jid,text);*/
                /*$("#IMiframe").get(0).contentWindow.initUserWin(jid,text);*/
                Ext.dialogPanel = window.imModalMax();
                console.log("56--" + Ext.dialogPanel);
            } else {            	
                var dialogPanel = Ext.dialogPanel;
                //dialogPanel.gui.Window.get().show();
                //dialogPanel.gui.Window.get().focus();
                //dialogPanel.find("#IMiframe").contents().$("li");
                var tli = dialogPanel.find("#IMiframe").contents().find(".tabs-list li[data-id='" + jid + "']");
                var data_id = tli.attr('data-id');
                if (undefined == data_id || null == data_id) {
                    window.frames["IMiframe"].initUserWin(jid, text);
                    window.imModalMax();
                } else {
                    window.imModalMax();
                    window.frames["IMiframe"].setTabLiAc(jid);
                    window.frames["IMiframe"].setDialogDiv(jid);
                }
            }

    });
//房间名称
    $(".group-list-name").delegate("li", "click", function () {
        var jid;
        var loginInfo = getLoginNo();
    		//var jid = loginInfo.ROOT.OUT_DATA.SESSION_INFO.LOGIN_NO; 
				//var password = loginInfo.ROOT.OUT_DATA.SESSION_INFO.PASSWORD;
    		/*if(localStorage.getItem("jid")){
    			jid = localStorage.getItem("jid")+Ext.login_suffix;
    		}
        var password = localStorage.getItem("password");*/
        if(loginInfo.ROOT.OUT_DATA.SESSION_INFO.LOGIN_NO){
    			jid = loginInfo.ROOT.OUT_DATA.SESSION_INFO.LOGIN_NO+Ext.login_suffix;
    		}
        var password = loginInfo.ROOT.OUT_DATA.SESSION_INFO.PASSWORD;
        if (jid == null && password == null) {
            $("#group-service").attr("href", Ext.login_href);
            return;
        }
        loginWebIM();
        //var customerId=sessionStorage.customerId;
        //alert(customerId);
        
            jump=clearInterval(jump);
            sessionStorage.setItem('dialogType', 'groupchat');
            var li = $(this);
            var jid = li.attr("data-jid");
            var text = li.attr("data-text");
            if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                window.frames["IMiframe"].initRoomWin(jid, text);
                Ext.dialogPanel = window.imModalMax();
            } else {
                var dialogPanel = Ext.dialogPanel;
                //dialogPanel.gui.Window.get().show();
                //dialogPanel.gui.Window.get().focus();
                var li = dialogPanel.find("#IMiframe").contents().find(".tabs-list li[data-id='" + jid + "']");
                var data_id = li.attr('data-id');
                if (undefined == data_id || null == data_id) {
                    window.frames["IMiframe"].initRoomWin(jid, text);
                    window.imModalMax();
                } else {
                    window.imModalMax();
                    window.frames["IMiframe"].setTabLiAc(jid);
                    window.frames["IMiframe"].setDialogDiv(jid);
                }
            }

    });

})
function loginWebIM() {
    //var jid = $('#jid').get(0).value;
    //var password = $('#pass').get(0).value;
    var jid = LOGINNO+Ext.login_suffix;
    var password = PWD;
    
      //alert("132 --jid = " + jid + ", password = " + password);
    //发送过程中,登录状态为true,根据具体登录返回值重新设置(防止多次点击登录)
    if(jid != null && password != null){
        Ext.loginStatus = true;
        Ext.connection = new window.parent.Strophe.Connection( Ext.serverUrl );
        //Ext.connection = new window.parent.Strophe.Connection("http://172.21.2.201:7070/http-bind/");
        //Ext.connection = new window.parent.Strophe.Connection("http://10.204.96.208:7070/http-bind/");
        //Ext.connection = new Strophe.Connection("http://172.18.48.136:7070/http-bind/");
        //text message
        Ext.connection.rawInput = function (data) {
            console.log('RECV: ' + data);
        };
        Ext.connection.rawOutput = function (data) {
            console.log('SEND: ' + data);
        };
        Ext.connection.connect(jid, password, Ext.onConnect);
        //IM最小化动作
        $("#IMiframe").contents().find("#pannel-tool-min").click(function () {
            if (imModalMin) imModalMin();
        });
        //IM关闭动作
        $("#IMiframe").contents().find("#pannel-tool-close").click(function () {        	
            if (imModalClose) imModalClose();
            jump = clearInterval(jump);  //停止跳动
        });
        //点击跳动“即时消息”
        if ($(document).find("#imModalMin").length > 0) {
            $(document).find("#imModalMin").unbind().bind('click',function () {
                jump = clearInterval(jump);   //停止跳动
                $(".msg-jump").show();
                dealTrayMessage();
                dialogPanel = Ext.dialogPanel;
                if (undefined != dialogPanel && null != dialogPanel && !dialogPanel.closed && dialogPanel.is(":hidden")) {
                    window.imModalMax();
                }
            })
        }
    }
};
//即时消息处理
function dealTrayMessage() {
	console.log(173 + "---dealTrayMessage")
    var msgBox = Ext.tempMsgBox;
    var len = msgBox.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var data = msgBox[i];
            var type = null;
            try {
                type = data.type;
            } catch (e) {
            }
            ;
            if ('chat' == type) {
                var jid = data.jid;
                var li = $("#item-lists li[data-id='" + jid + "']");
                var text = jid;
                if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                    window.frames["IMiframe"].initUserWin(jid, text);
                    Ext.dialogPanel = window.imModalMax();
                } else {
                    var dialogPanel = Ext.dialogPanel;
                    var tli = dialogPanel.find("#IMiframe").contents().find(".tabs-list li[data-id='" + jid + "']");
                    var data_id = tli.attr('data-id');
                    if (undefined == data_id || null == data_id) {
                        window.frames["IMiframe"].initUserWin(jid, text);
                        window.imModalMax();
                    } else {
                        window.imModalMax();
                        window.frames["IMiframe"].initusermsg(jid);
                        window.frames["IMiframe"].setTabLiAc(jid);
                        window.frames["IMiframe"].setDialogDiv(jid);
                    }
                }
            } else if ('groupchat' == type) {
                var jid = data.jid;
                var li = $("#room-lists li[data-id='" + jid + "']");
                var text = jid;
                if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                    window.frames["IMiframe"].initRoomWin(jid, text);
                    Ext.dialogPanel = window.imModalMax();
                } else {
                    var dialogPanel = Ext.dialogPanel;
                    var li = dialogPanel.find("#IMiframe").contents().find(".tabs-list li[data-id='" + jid + "']");
                    var data_id = li.attr('data-id');
                    if (undefined == data_id || null == data_id) {
                        window.frames["IMiframe"].initRoomWin(jid, text);
                        window.imModalMax();
                    } else {
                        window.imModalMax();
                        window.frames["IMiframe"].initroommsg(jid);
                        window.frames["IMiframe"].setTabLiAc(jid);
                        window.frames["IMiframe"].setDialogDiv(jid);
                    }
                }
            } else if ('tempchat' == type) {
                var text = data.from;
                var jid = data.jid;
                if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                    sessionStorage.setItem('dialogType', 'tempchat');
                    sessionStorage.setItem('dialogJid', jid);
                    sessionStorage.setItem('dialogUsername', text);
                    Ext.dialogPanel = window.open('com/sitech/views/user/DialogPanel.html', '聊天对话框',
                        'depended=yes,height=500,width=900');
                } else {
                    var storage = window.localStorage;
                    var dialogPanel = Ext.dialogPanel;
                    var initFlag = storage.getItem('initFlag');
                    if (undefined == initFlag || null == initFlag || '' == initFlag || initFlag == false) {
                    } else {
                        //dialogPanel.gui.Window.get().restore();
                        dialogPanel.gui.Window.get().show();
                        dialogPanel.gui.Window.get().focus();
                        var li = dialogPanel.$(".tabs-list li[data-id='" + jid + "']");
                        var data_id = li.attr('data-id');
                        if (undefined == data_id || null == data_id) {
                            dialogPanel.initTempUserWin(jid, text);
                        } else {
                            dialogPanel.setTabLiAc(jid);
                            dialogPanel.setDialogDiv(jid);
                        }
                        ;
                    }
                }
            }
        }
    }
    msgBox.splice(0, msgBox.length);
}
