//XMPP连接
Ext = window.parent.Ext;
Ext.connection = null;
//用户ID
Ext.bare_jid = null;
//服务器域
Ext.domain = null;
//在线用户数组
Ext.onlineStore = [];
//消息数据库,用于存储系统消息，例如：入群，添加好友
Ext.messageSysStore = [];
//临时消息数据库，用于显示消息
Ext.tempMsgStore = [];
//创建msgbox数据库,用于好友或房间跳动
Ext.tempMsgBox = [];
//公告消息数据库
Ext.noticeMsgBox = [];
//存放弹出窗口数据库
Ext.panelHtmlStore = [];
Ext.friend_states = [];
Ext.PresenceType = {
    available: 'available',//在线(默认值)
    unavailable: 'unavailable',//离线
    subscribe: 'subscribe',//请求订阅接受者的在线状态
    unsubscribe: 'unsubscribe',//取消订阅接受者的在线状态
    subscribed: 'subscribed',//同意发送者订阅接受者的在线状态
    unsubscribed: 'unsubscribed',//拒绝发送者订阅接受者的在线状态
    error: 'error'//出错,presence包中包含一个error子标签描述错误
};
Ext.ShowType = {
    chat: 'chat', //可以马上联系
    away: 'away', //该客户在线，但刚刚离开
    xa: 'xa',     //该客户在线，但已经处于非活动状态很长时间了。
    dnd: 'dnd',   //该用户处于谢绝打扰的模式
    offline: 'offline' //该用户在线，自定义离线
};
//获取连接
Ext.onConnect = function (status) {
    //alert("status==" + status);
    //ERROR: 0,
    //CONNECTING: 1,
    //CONNFAIL: 2,
    //AUTHENTICATING: 3,
    //AUTHFAIL: 4,
    //CONNECTED: 5,
    //DISCONNECTED: 6,
    //DISCONNECTING: 7,
    //ATTACHED: 8
    if (status == Strophe.Status.CONNECTING) {
        //log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
        //log('Strophe failed to connect.');
        //$('#connect').get(0).value = 'connect';
        //Ext.connection.reset();
        loginWebIM();
        //Ext.connection.reset();
        //$('#connect').get(0).value = 'connected';
    } else if (status == Strophe.Status.DISCONNECTING) {
        //log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
        //log('Strophe is disconnected.');
        //$('#connect').get(0).value = 'connect';
    } else if (status == Strophe.Status.CONNECTED) {
        //$("#client-service").attr("data-id", $("#tojid").val());
        Ext.loginStatus = true;
        Ext.bare_jid = Strophe.getBareJidFromJid(Ext.connection.jid);
        Ext.domain = Strophe.getDomainFromJid(Ext.connection.jid);
        Ext.room_suffix = '@conference.' + Ext.domain;
        Ext.search_user_suffix = 'search.' + Ext.domain;
        localStorage.setItem('Ext.bare_jid', Ext.bare_jid);
        localStorage.setItem('Ext.domain', Ext.domain);
        localStorage.setItem('Ext.room_suffix', Ext.room_suffix);
        localStorage.setItem('Ext.search_user_suffix', Ext.search_user_suffix);
        Ext.sid = Ext.connection.jid.split("/")[1];
        //log('Strophe is connected.');
        //log('ECHOBOT: Send a message to ' + connection.jid +
        //    ' to talk to me.');
        //Ext.connection.addHandler(onMessage, null, 'message', null, null, null);
        Ext.connection.addHandler(Ext.onMessage, null, 'message', 'chat', null, null);
        Ext.connection.addHandler(Ext.onMucMessage, null, 'message', 'groupchat', null, null);
        //Ext.connection.addHandler(Ext.onTempMessage, null, 'message', 'chat', 'temporaryMessage', null);
        /**拦截器方法 xmlns 消息类型 (iq presence message) type id 未知 **/
        Ext.connection.addHandler(Ext.initMyselfInfo, null, 'iq', null, 'self', null);
        Ext.webIM.searchUserInfo(Ext.connection.authcid, 'self');
        Ext.connection.send($pres().tree());
    }
};
//初始化用户登录信息
Ext.initMyselfInfo = function (msg) {
    var item = msg.getElementsByTagName('item');
    var field = null;
    for (var i = 0; i < item.length; i++) {
        field = item[i].getElementsByTagName('field');
        var name = null;
        var email = null;
        var username = null;
        var jid = null;
        for (var j = 0; j < field.length; j++) {
            var obj = field[j];
            var $var = obj.getAttribute("var");
            if ($var == "Name") {
                name = Strophe.getText(obj.getElementsByTagName('value')[0]);
            } else if ($var == "Email") {
                email = Strophe.getText(obj.getElementsByTagName('value')[0]);
            } else if ($var == "Username") {
                username = Strophe.getText(obj.getElementsByTagName('value')[0]);
            } else if ($var == "jid") {
                jid = Strophe.getText(obj.getElementsByTagName('value')[0]);
            }
            if (jid == Ext.bare_jid) {
                Ext.userName = username;
                Ext.nickName = name;
                //Ext.email = email;
                $('#nikeName').text(Ext.nickName);
                //设置HelloKitty提示
                Ext.webIM.setTraytip('online');
            }
        }
    }
    ;
    //查找房间列表
    //Ext.webIM.searchRoom();
    return true;
};
//初始化好友列表
Ext.onJabberRoster = function (msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var id = msg.getAttribute('id');
    if (id == "login") {
        var data = [];
        var query = msg.getElementsByTagName('query');
        var items = query[0].getElementsByTagName("item");
        for (var i = 0; i < items.length; i++) {
            if (items[i].getAttribute("subscription") == "both") {
                //var obj = {id:'',jid:'', text:'', leaf:'', icon:'', children:[]};
                var obj = new Object();
                var name = items[i].getAttribute("name");
                if (name == "" || name == null) {
                    name = items[i].getAttribute("jid");
                    name = name.substring(0, name.lastIndexOf('@'));
                }
                ;
                obj.jid = items[i].getAttribute("jid");
                obj.id = items[i].getAttribute("jid");
                obj.icon = 'resources/images/icon-item-image-2.png';
                obj.remarkName = name;
                var text = name + '(' + obj.jid.substring(0, obj.jid.lastIndexOf('@')) + ')';
                obj.text = text;
                obj.username = obj.jid.substring(0, obj.jid.lastIndexOf('@'));
                data.push(obj);
            }
        }
        ;
        Ext.webIM.setFriendsList(data);
        //var friendPanel = Ext.getCmp('friendPanel');
        //friendPanel.getStore().setRootNode(data);
        //使用户在线
        Ext.connection.send($pres().tree());
    } else {
        var query = msg.getElementsByTagName('query');
        var items = query[0].getElementsByTagName("item");
        var friendList = $("#item-lists");
        for (var i = 0; i < items.length; i++) {
            if (items[i].getAttribute("subscription") == "both") {
                var jid = items[i].getAttribute("jid");
                var li = $("#item-lists li[data-id='" + jid + "']");
                var _jid = li.attr('data-id');
                //添加到好友列表
                if (undefined == _jid || null == _jid) {
                    var name = items[i].getAttribute("name");
                    if (name == "" || name == null) {
                        name = items[i].getAttribute("jid");
                        name = name.substring(0, name.lastIndexOf('@'));
                    }
                    var obj = new Object();
                    obj.jid = items[i].getAttribute("jid");
                    obj.id = items[i].getAttribute("jid");
                    obj.icon = 'resources/images/icon-item-image-1.png';
                    obj.remarkName = name;
                    var text = name + '(' + obj.jid.substring(0, obj.jid.lastIndexOf('@')) + ')';
                    obj.text = text;
                    //添加到好友列表
                    Ext.webIM.addFriendLi(friendList, obj, 'prepend');
                } else {
                    var li = $("#item-lists li[data-id='" + jid + "']");
                    var name = items[i].getAttribute("name");
                    var text = name + '(' + jid.substring(0, jid.lastIndexOf('@')) + ')';
                    li.attr('data-text', text);
                    li.attr('data-remarkname', name);
                    li.find('.item-media-title').text(text);
                }
            }
        }
    }
    return true;
};
//好友上、下线
Ext.onPresence = function (msg) {
    var presence = {type: '', status: '', priority: '', mode: '', language: ''};
    presence.type = msg.getAttribute('type');
    if (presence.type == undefined || presence.type == '') {
        presence.type = 'available';
    }
    ;
    var from = msg.getAttribute('from');
    var id = msg.getAttribute('id');
    var resource = Strophe.getResourceFromJid(from);
    var jid = Strophe.getBareJidFromJid(from);
    if (presence.type == Ext.PresenceType.available || presence.type == Ext.PresenceType.unavailable) {//上线 下线
        if (jid == Ext.bare_jid) {
            return true;
        }
        var show = msg.getElementsByTagName('show');
        show = Strophe.getText(show[0]);
        Ext.changeFriendState(jid, presence.type, show);
    } else if (presence.type == Ext.PresenceType.subscribe || presence.type == Ext.PresenceType.unsubscribed
        || presence.type == Ext.PresenceType.subscribed) {

        //判断是否为反向添加好友请求
        if (presence.type == Ext.PresenceType.subscribe && id != undefined && id != "" && id == "mustAdd") {
            var subscribed = $pres({to: jid, type: 'subscribed', id: 'mustAdd'});
            Ext.connection.send(subscribed.tree());
            return true;
        }
        //判断是否为反向添加好友应答请求
        if (presence.type == Ext.PresenceType.subscribed && id != undefined && id != "" && id == "mustAdd") {
            return true;
        }
        var li = $("#item-lists li[data-id='" + jid + "']");
        var data_id = li.attr('data-id');
        if (undefined == data_id || null == data_id) {
            var username = jid.substring(0, jid.indexOf('@'));
            var flag = false;
            //遍历messageSysStore数组
            var len = Ext.messageSysStore.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var msgData = Ext.messageSysStore[i];
                    var _jid = msgData.jid;
                    var _type = msgData.type
                    if (_jid == jid && _type == presence.type) {
                        flag = true;
                        return;
                    }
                }
            }
            if (!flag) {
                Ext.webIM.searchUserInfo(username, 'friendAdded');
                var data = {};
                data.jid = jid;
                data.type = presence.type;
                data.deal = false;
                var date = new Date();
                data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
                //添加到数组
                Ext.webIM.addMsgSysStore(data);
            }
        }
    }
    return true;
};
//改变好友状态
Ext.changeFriendState = function (jid, type, show) {
    var friendList = $("#item-lists");
    var jidStr = jid + 'src';
    var li = $("#item-lists li[data-id='" + jid + "']");
    var img = $("#item-lists img[data-id='" + jidStr + "']");
    if (undefined == img || '' == img) {
        return;
    }
    ;
    if (type == Ext.PresenceType.available) {
        if (show == Ext.ShowType.chat) {
            img.attr('src', 'resources/images/icon-item-image-1.png');
        } else if (show == Ext.ShowType.away) {
            img.attr('src', 'resources/images/icon-item-image-1.png');
        } else if (show == Ext.ShowType.xa) {
            img.attr('src', 'resources/images/icon-item-image-1.png');
        } else if (show == Ext.ShowType.dnd) {
            img.attr('src', 'resources/images/icon-item-image-1.png');
        } else if (show == Ext.ShowType.offline) {
            img.attr('src', 'resources/images/icon-item-image-1.png');
        } else {
            img.attr("src", "resources/images/icon-item-image-1.png");
            var temp = li;
            li.remove();
            //移植到最前
            friendList.prepend(temp);
            Ext.webIM.changeDialogfriendStatus(jid, 'online');
        }
    } else if (type == Ext.PresenceType.unavailable) {
        //alert(Ext.nickName+'中的'+jid+'离线了.....');
        img.attr("src", "resources/images/icon-item-image-2.png");
        //移植到最后
        var temp = li;
        li.remove();
        friendList.append(temp);
        Ext.webIM.changeDialogfriendStatus(jid, 'offline');
    }
};
//别人退出群
Ext.someoneQuitRoom = function (msg) {
    var body = msg.getElementsByTagName('body');
    var roomId = Strophe.getText(body[0]);
    Ext.webIM.searchRoomRoster(roomId, true);
    return true;
};
//自己退出群
Ext.quitRoom = function (msg) {
    var body = msg.getElementsByTagName('body');
    var roomId = Strophe.getText(body[0]);
    //群列表中删除
    var data = {};
    data.jid = roomId;
    data.id = roomId;
    var roomList = $("#room-lists");
    Ext.webIM.removeRoomLi(roomList, data);
    //关闭已打开的对话框
    var dialogPanel = Ext.dialogPanel;
    if (undefined != dialogPanel && dialogPanel != null && !dialogPanel.closed) {
        //获取聊天对话框昨天tab
        var tabLi = dialogPanel.$(".tabs-list li");
        var tabLiLen = tabLi.length;
        if (tabLiLen == 1) {
            dialogPanel.close();
        } else {
            var jidRoom = roomId + 'room';
            var li = dialogPanel.$(".tabs-list li[data-id='" + jidRoom + "']");
            var data_id = li.attr('data-id');
            //移除左边tab li
            if (undefined != data_id && null != data_id) {
                li.remove();
            }
            ;
            //移除聊天对话框 div
            var baseRoom = 'base' + jidRoom;
            var baseDiv = dialogPanel.$(".baseDiv[id='" + baseRoom + "']");
            var baseId = baseDiv.attr('data-id');
            if (undefined != baseId && null != baseId) {
                baseDiv.remove();
            }
            ;
            var firstLi = dialogPanel.$(".tabs-list li:first-child");
            var firstJid = firstLi.attr('data-id');
            //设置聊天对话框第一个li和div显示
            if (undefined != firstJid && null != firstJid) {
                dialogPanel.setTabLiAc(firstJid);
                dialogPanel.setDialogDiv(firstJid);
            }
            ;
        }
        ;
    }
    ;
    return true;
};
//群创建
Ext.mucCreate = function (msg) {
    var presence = {type: '', from: '', status: '', priority: '', mode: '', language: ''};
    presence.from = msg.getAttribute('from');
    var status = msg.getElementsByTagName('status');
    var flag = false;
    var flag2 = true;
    for (var i = 0; i < status.length; i++) {
        var code = status[i].getAttribute('code');
        if (code == "201") {
            flag = true;
            break;
        }
        if (code == "303") {
            flag2 = false;
            break;
        }
    }
    ;
    if (flag) {
        Ext.webIM.initConfigRoom(presence.from);
        //刷新群列表
        //Ext.webIM.searchRoom();
        setTimeout(function () {
            //刷新群列表
            Ext.webIM.searchRoom();
        }, 500);
        alert('群创建成功！');
    } else if (!flag && flag2) {
        alert('群已存在！');
    }
    return true;
};
//邀请加入群
Ext.invitedJoinRoom = function (msg) {
    //alert('new....');
    var message = {from: '', to: '', type: '', name: '', id: '', jid: ''};
    message.to = msg.getAttribute('to');
    message.from = msg.getAttribute('from');
    message.type = msg.getAttribute('type');
    message.id = msg.getAttribute('id');
    var x = msg.getElementsByTagName('x')[0];
    var reason = x.getAttribute('reason');
    var jid = x.getAttribute('jid');
    var roomId = jid.substring(0, jid.indexOf('@'));
    if (message.id == 'joinInNow') {
        Ext.webIM.joinRoom(roomId);
        /*var data = {};
         data.id = roomId;
         data.jid = roomId;
         data.text = reason;
         data.affiliation='30';
         var roomList = $("#room-lists");
         var li = $("#room-lists li[data-id='"+roomId+"']");
         var  data_id= li.attr('data-id');
         //添加群到群列表
         if(undefined == data_id||null == data_id){
         Ext.webIM.addRoomLi(roomList,data);
         };*/
        //刷新群列表
        Ext.webIM.searchRoom();
        return true;
    }
    var data = {};
    data.type = 'invitedRoom';
    data.message = reason;
    data.jid = message.from;
    data.roomId = jid;
    //添加数据到addMsgSysStore中
    Ext.webIM.addMsgSysStore(data);
    return true;
};
//申请加入群
Ext.applyToRoom = function (msg) {
    var message = {from: '', to: '', type: '', name: '', id: '', jid: ''};
    message.to = msg.getAttribute('to');
    message.from = msg.getAttribute('from');
    message.type = msg.getAttribute('type');
    message.id = msg.getAttribute('id');
    var roomId = msg.getElementsByTagName('roomId')[0];
    roomId = Strophe.getText(roomId);
    var body = msg.getElementsByTagName('body')[0];
    var msg = Strophe.getText(body);
    var data = {};
    data.type = 'applyToRoom';
    data.message = msg;
    data.jid = message.from;
    data.roomId = roomId;
    //添加数据到addMsgSysStore中
    Ext.webIM.addMsgSysStore(data);
    return true;
};
//邀请加入群回复
Ext.replayJoinRoom = function (msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var name = msg.getAttribute('name');
    var elems = msg.getElementsByTagName('body');
    var id = msg.getElementsByTagName('id');
    var jid = Strophe.getBareJidFromJid(from);
    if (name == undefined || name == "") {
        name = jid;
    }
    ;
    if (type == "chat" && elems.length > 0) {
        var body = elems[0];
        body = Strophe.getText(body);
        var flag = body.split('[-]')[0];
        var msg = body.split('[-]')[1];
        if (flag == "0") {
            Ext.webIM.giveRoomMember(msg, jid);
            //通知可以进入群
            var roomId = msg.substring(0, msg.indexOf('@'));
            var li = $("#room-lists li[data-id='" + roomId + "']");
            var naturalName = li.attr('data-text');
            var data = $msg({from: Ext.bare_jid, to: jid, id: 'joinInNow'});
            data.c('x', {xmlns: 'jabber:x:conference', jid: msg, reason: naturalName});
            Ext.connection.send(data.tree());
            //邀请加入，回复添加，发送群消息
            var content = HtmlDecode('欢迎' + name.substring(0, name.indexOf('@')) + '加入群！');
            Ext.sendMucMessage2(roomId, content, 'joinInNow');
            //刷新群好友列表           
            //Ext.webIM.searchRoomRoster(roomId,true);
        } else {
            var data = {};
            data.type = 'replayJoinRoom';
            data.message = msg;
            //添加数据到addMsgSysStore中
            Ext.webIM.addMsgSysStore(data);
        }
    }
    return true;
};
//修改群昵称
Ext.onChangeRoomRosterNick = function (msg) {
    var body = msg.getElementsByTagName('body');
    var roomId = Strophe.getText(body[0]);
    Ext.webIM.searchRoomRoster(roomId, true);
    return true;
};
//其他消息
Ext.onOtherMessage = function (msg) {
    //alert('onOtherMessage');
    var message = {'subject': '', body: ''};
    var subject = msg.getElementsByTagName('subject');
    if (subject.length != 0) {
        if (Strophe.getText(subject[0]) == 'giveRoomAdmin' || Strophe.getText(subject[0]) == 'kickRoomRoster' ||
            Strophe.getText(subject[0]) == 'cancelRoomAdmin' || Strophe.getText(subject[0]) == 'changeMemberNick') {
            var body = msg.getElementsByTagName('body');
            var roomId = Strophe.getText(body[0]);
            //alert(roomId);
            Ext.webIM.searchRoomRoster(roomId, true);
        }
    }
    return true;
};
//接收添加好友消息
Ext.friendAdded = function (msg) {
    var item = msg.getElementsByTagName('item');
    var field = item[0].getElementsByTagName('field');
    var name = null;
    var email = null;
    var username = null;
    var jid = null;
    for (var i = 0; i < field.length; i++) {
        var obj = field[i];
        var $var = obj.getAttribute("var");
        if ($var == "Name") {
            name = Strophe.getText(obj.getElementsByTagName('value')[0]);
        } else if ($var == "Email") {
            email = Strophe.getText(obj.getElementsByTagName('value')[0]);
        } else if ($var == "Username") {
            username = Strophe.getText(obj.getElementsByTagName('value')[0]);
        } else if ($var == "jid") {
            jid = Strophe.getText(obj.getElementsByTagName('value')[0]);
        }
    }
    //修改roster列表
    Ext.webIM.updateRoster(jid, name, null);
    //刷新群列表
    return true;
};
//添加好友
Ext.friendAdd = function (jid, name) {
    //发送订阅请求
    var subAdd = $pres({to: jid, type: 'subscribe', id: 'friendAdd'});
    subAdd.cnode(Strophe.xmlElement('status', '', 'hello'));
    Ext.connection.send(subAdd.tree());
    //修改roster列表
    Ext.webIM.updateRoster(jid, name, null);
    //刷新好友列表
};
// 生成uuid
Ext.uuid = function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}
//发送普通消息
Ext.sendMessage = function (toId, fromId, msg, id) {
    if (id == undefined || id == null || id == '') {
        id = Ext.uuid();
    }
    var reply = $msg({to: toId, from: fromId, type: 'chat', id: id}).cnode(Strophe.xmlElement('body', '', msg));
    console.log("559---" + reply)
    Ext.connection.send(reply.tree());
    console.log("561---");
};
//发送临时普通消息
Ext.sendTempMessage = function (toId, fromId, msg, nickName) {
    var reply = $msg({
        to: toId,
        from: fromId,
        type: 'chat',
        id: 'temporaryMessage'
    }).cnode(Strophe.xmlElement('body', '', msg)).up();
    reply.c('senderNick', null, nickName);
    Ext.connection.send(reply.tree());
};
//发送聊天群消息
Ext.sendMucMessage = function (roomId, msg, msgid) {
    //var to = roomId + Ext.room_suffix;
    var data = $msg({
        to: roomId,
        from: Ext.bare_jid,
        type: 'groupchat',
        id: msgid
    });
    data.c('body').t(msg).up().c('x', {xmlns: "jabber:x:oncon_devicetype", 'value': '1'});
    Ext.connection.send(data.tree());
};
//入群消息发送
Ext.sendMucMessage2 = function (roomId, msg, id) {
    var to = roomId + Ext.room_suffix;
    var data = $msg({from: Ext.bare_jid, to: to, type: 'groupchat', id: id});
    data.cnode(Strophe.xmlElement('body', '', msg));
    Ext.connection.send(data.tree());
};
//收到普通聊天消息
Ext.onMessage = function (msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var text = Strophe.getText(body);
    var id = msg.getAttribute('id');
    var jid = Strophe.getBareJidFromJid(from);
    var name = '';
    var temmsgid;


    if (type == "chat" && elems.length > 0) {
        var body = elems[0];
        var delay = msg.getElementsByTagName('delay');
        var data = {};
        var text = Strophe.getText(body);
        //var sid = to.split("/")[1];
        //if (sid != Ext.sid) return true;
        if (text == 'server_feedback_msg@@@sitech-oncon@@@v1.0') return true;
        if (text == 'server_feedback_client_msg@@@sitech-oncon@@@v1.0') return true;
        if (text == 'server_feedback_client_msg@@@sitech-oncon@@@v1.0|||subtype=1') return true;
        if (text.indexOf('m1_extend_msg@@@sitech-oncon@@@v1.0|||') != -1) return true;
        for (temmsgid in Ext.msgids) {
            if (id == Ext.msgids[temmsgid]) {
                return true;
            }
        }
        Ext.msgids[Ext.msgids.length] = id;
        //text = Ext.util.Format.htmlDecode(text);
        text = HtmlDecode(text);
        data.type = 'chat';
        data.jid = jid;
        data.text = text;
        // data.date = Ext.Date.format(new Date(), 'H:i:s');
        data.from = name;
        data.resource = 'from';
        if (delay.length != 0) {
            data.delay = true;
            var strStamp = delay[0].getAttribute('stamp');
            var date = new Date(strStamp);
            data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
            //data.date = Ext.Date.format(new Date(strStamp), 'Y-m-d H:i:s'); // new Date 解决格林威治时差问题
        } else {
            // ??? 发送消息未走这里 ???
            var date = new Date();
            data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
        }
        Ext.sendMessage(jid, Ext.bare_jid, 'm1_feedback_msg@@@sitech-oncon@@@v1.0', id);
        Ext.sendMessage(jid, Ext.bare_jid, 'm1_feedback_msg@@@sitech-oncon@@@v1.0|||subtype=1', id);
        Ext.webIM.tempMsgStoreAdd(data);
        //store.add(data)
    }
    return true;
}
;
//收到临时消息
Ext.onTempMessage = function (msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var id = msg.getElementsByTagName('id');
    var jid = Strophe.getBareJidFromJid(from);
    if (type == "chat" && elems.length > 0) {
        var body = elems[0];
        var senderNick = Strophe.getText(msg.getElementsByTagName('senderNick')[0]);
        var data = {};
        var text = Strophe.getText(body);
        text = HtmlDecode(text);
        data.text = text;
        var date = new Date();
        data.jid = jid;
        data.type = 'tempchat';
        data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
        data.from = senderNick;
        data.resource = 'from';
        Ext.webIM.tempMsgStoreAdd(data);
    }
    return true;
};
//接收到群消息
Ext.onMucMessage = function (msg) {
    //alert(Ext.bare_jid+':onmucmsg');
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var name = Strophe.getResourceFromJid(from);
    var elems = msg.getElementsByTagName('body');
    var jid = Strophe.getBareJidFromJid(from);
    var roomId = jid.substring(0, jid.indexOf('@'));
    var msgId = msg.getAttribute('id');
    var temmsgid;
    for (temmsgid in Ext.msgids) {
        if (msgId == Ext.msgids[temmsgid]) {
            return true;
        }
    }
    Ext.msgids[Ext.msgids.length] = msgId;
    //if (Ext.bare_jid.substring(0, Ext.bare_jid.indexOf('@')) == from.substring(from.indexOf('/') + 1,
    // from.indexOf('_'))) { //	Ext.sendMucMessage(jid, 'm1_feedback_msg@@@sitech-oncon@@@v1.0'); //
    // Ext.sendMucMessage(jid, "m1_feedback_msg@@@sitech-oncon@@@v1.0|||subtype=1"); Ext.sendMucMessage(jid,
    // "m1_feedback_msg@@@sitech-oncon@@@v1.0", msgId); Ext.sendMucMessage(jid,
    // "m1_feedback_msg@@@sitech-oncon@@@v1.0|||subtype=1", msgId); return true; }
    //var sid = to.split("/")[1];
    //if (sid != Ext.sid) return true;
    var resources = '';
    if (Ext.bare_jid.substring(0, Ext.bare_jid.indexOf('@')) == from.substring(from.indexOf('/') + 1, from.indexOf('_'))) {
        resources = 'to';
    } else {
        resources = 'from';
    }
    //if (name == undefined || name == "") {
    //    name = jid;
    //} else {
    //    var fromId = Strophe.getBareJidFromJid(name.split('[-]')[1]);
    //    if (fromId == Ext.bare_jid) {
    //        resources = 'to';
    //    } else {
    //        resources = 'from';
    //    }
    //    //name = name.substring(0,name.indexOf('[-]'));
    //    name = fromId;
    //}
    //;
    if (type == "groupchat" && elems.length > 0) {
        var text = Strophe.getText(elems[0]);
        var delay = msg.getElementsByTagName('delay');
        text = HtmlDecode(text);
        if (text == '该房间不是匿名的。' || text == '确认配置之前已锁住该房间，禁止进入。' || text == '该房间现在已解锁。'
            || text.indexOf('m1_extend_msg@@@sitech-oncon@@@v1.0|||') != -1) {
            Ext.sendMucMessage(jid, "m1_feedback_msg@@@sitech-oncon@@@v1.0", msgId);
            Ext.sendMucMessage(jid, "m1_feedback_msg@@@sitech-oncon@@@v1.0|||subtype=1", msgId);
            return true;
        }
        var data = {};
        data.type = 'groupchat';
        data.text = text;
        data.from = name;
        data.roomId = roomId;
        data.resource = resources;
        data.jid = jid;
//      data.id = msgId;
        data.id = (from.split("/")[1]).split("_")[0];
        if (delay.length != 0) {
            data.delay = true;
            var strStamp = delay[0].getAttribute('stamp');
            //data.date = Ext.Date.format(new Date(strStamp), 'Y-m-d H:i:s'); // new Date 解决格林威治时差问题
            var date = new Date(strStamp);
            data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
        } else {
            var date = new Date();
            data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
        }
        //入群刷新群
        //if ('joinInNow' == msgId) {
        //    Ext.webIM.searchRoomRoster(roomId, true);
        //}
        //;
        Ext.webIM.tempMsgStoreAdd(data);
        Ext.sendMucMessage(jid, "m1_feedback_msg@@@sitech-oncon@@@v1.0", msgId);
        //Ext.sendMucMessage(jid, "m1_feedback_msg@@@sitech-oncon@@@v1.0|||subtype=1", msgId);
    }
    return true;
};
//公告notice
Ext.onNoticeMessage = function (msg) {
    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');
    var body = Strophe.getText(elems[0]);
    body = HtmlDecode(body);
    var msgBody = jQuery.parseJSON(body);
    var msgid = HtmlDecode(msgBody.msgid);
    var title = HtmlDecode(msgBody.title);
    var content = HtmlDecode(msgBody.content);
    var data = new Object();
    data.type = 'noticeMsg';
    data.msgid = msgid;
    data.title = title;
    data.content = content;
    //添加数据到noticeMsgBox
    Ext.webIM.addNoticeMsgBoxData(data);
    return true;
};
//群出席
Ext.mucUsersPres = function (msg) {
    var presence = {type: '', from: '', status: '', priority: '', mode: '', language: ''};
    var item = msg.getElementsByTagName('item');
    presence.from = msg.getAttribute('from'); //xxx@conference.127.0.0.1/用户姓名[-]xxx@127.0.0.1/resource
    presence.type = msg.getAttribute('type');
    //
    var roomId = presence.from.substring(0, presence.from.indexOf('@'));
    //alert(presence.from + ' to ' + msg.getAttribute('to') );
    //发送用户的JID
    var resource = Strophe.getResourceFromJid(presence.from); //用户姓名[-]xxx@127.0.0.1/resource
    resource = resource.split('[-]');
    var nickname = resource[0];
    var bjid = Strophe.getBareJidFromJid(resource[1]);
    //群列表成员离线 | 群移除
    if (presence.type == Ext.PresenceType.unavailable) {
        // 清除，已下线用户id
        try {
            var flag = false;
            var onlineStore = Ext.onlineStore;
            var len = onlineStore.length;
            var roomData = null;
            $.each(onlineStore, function (idx, data) {
                var _roomId = data.roomId;
                if (_roomId == roomId) {
                    roomData = data;
                    flag = true;
                    return false;
                }
            });
            //在onlineStore清除在线好友
            if (true) {
                var children = roomData.children;
                var childrenLen = children.length;
                for (var i = 0; i < childrenLen; i++) {
                    var node = children[i];
                    var sjid = node.jid;
                    if (sjid == bjid) {
                        roomData.children.splice(i, 1);
                        break;
                    }
                }
            }
            ;
            var dialogPanel = Ext.dialogPanel;
            if (undefined != dialogPanel && null != dialogPanel && '' != dialogPanel && !dialogPanel.closed) {
                var asideArray = dialogPanel.$(".aside-group");
                var jidRoom = roomId + 'room';
                dialogPanel.$(".aside-group").each(function () {
                    var _roomId = $(this).attr('data-roomid');
                    if (_roomId == jidRoom) {
                        if (bjid == Ext.bare_jid) {
                            return;
                        }
                        ;
                        //通过bjid获取成员列表li
                        var li = $(this).find(".ower li[data-id='" + bjid + "']");
                        var affiliation = li.attr('data-affiliation');
                        if (undefined == affiliation) {
                            li = $(this).find(".member li[data-id='" + bjid + "']");
                            affiliation = li.attr('data-affiliation');
                        }
                        ;
                        var newLi = null;
                        //获取最后一个管理员
                        var lastMangerLi = $(this).find(".member li[data-affiliation!='30']").last();
                        //管理员修改图片样式;
                        if ('10' == affiliation) {
                            li.attr('class', 'icon-group-owner-1');
                        } else if ('20' == affiliation) {
                            //放在管理员列表最后
                            var ul = $(this).find(".member");
                            li.attr('class', 'icon-group-3');
                            newLi = li.clone(true);
                            li.remove();
                            lastMangerLi.after(newLi);
                        } else if ('30' == affiliation) {
                            //放在普通成员列表最后
                            var ul = $(this).find(".member");
                            li.attr('class', 'icon-group-3');
                            newLi = li.clone(true);
                            li.remove();
                            ul.append(newLi);
                        }
                        if (newLi != null) {
                            //添加双击事件
                            Ext.webIM.friendBblclick(newLi);
                        }
                    }
                })
            }
        } catch (e) {
            alert('错误');
        }
        // 群移除
        var destroyNodes = msg.getElementsByTagName('destroy');
        if (destroyNodes) {
            for (var i = 0; i < destroyNodes.length; i++) {
                var nodes = destroyNodes[i].childNodes;
                for (var j = 0; j < nodes.length; j++) {
                    if (nodes[j].tagName == 'reason') {
                        var msg = nodes[j].firstChild.nodeValue;
                        //刷新房间列表
                        Ext.webIM.searchRoom();
                        //提示弹出窗口
                        var id = 'loginAlert';
                        var parames = [msg, '确定'];
                        createAlertTip(parames, id);
                        //alert('这里？？？？');
                        //alert('移除群'+presence.from, nodes[j].firstChild.nodeValue);
                        //alert(nodes[j].firstChild.nodeValue);
                    }
                }
            }
        }
    } else {// 群出席
        try {
            var flag = false;
            var onlineStore = Ext.onlineStore;
            var len = onlineStore.length;
            var roomData = null;
            $.each(onlineStore, function (idx, data) {
                var _roomId = data.roomId;
                if (_roomId == roomId) {
                    roomData = data;
                    flag = true;
                }
            });
            if (flag) {
                var nodeFlag = true;
                var children = roomData.children;
                $.each(children, function (idx, node) {
                    var jid = node.bjid;
                    if (jid == bjid) {
                        nodeFlag = false;
                    }
                });
                if (nodeFlag) {
                    var node = {
                        jid: bjid,
                        text: nickname
                    };
                    children.push(node);
                    //按昵称排序
                    children.sort(function (x, y) {
                        if (x.nickname > y.nickname) {
                            return 1;
                        }
                        ;
                        if (x.nickname < y.nickname) {
                            return -1;
                        }
                        ;
                        if (x.nickname == y.nickname) {
                            return 0;
                        }
                        ;
                    });
                    roomData.children = children;
                }
            } else {
                var data = new Object();
                data.roomId = roomId;
                data.children = [
                    {
                        jid: bjid,
                        text: nickname
                    }
                ];
                Ext.onlineStore.push(data);
            }
            ;
            //对打开群窗口成员列表排序
            // 获取聊天对话框
            var dialogPanel = Ext.dialogPanel;
            //获取对话窗口数组
            if (undefined != dialogPanel && null != dialogPanel && '' != dialogPanel && !dialogPanel.closed) {
                var asideArray = dialogPanel.$(".aside-group");
                var jidRoom = roomId + 'room';
                dialogPanel.$(".aside-group").each(function (i) {
                    var _roomId = $(this).attr('data-roomid');
                    if (_roomId == jidRoom) {
                        var onlineStore = Ext.onlineStore;
                        var roomNode = null;
                        //获取数据
                        $.each(onlineStore, function (idx, data) {
                            var _roomId = data.roomId;
                            if (_roomId == roomId) {
                                roomNode = data;
                            }
                        });
                        if (null != roomNode) {
                            var children = roomNode.children;
                            if (bjid == Ext.bare_jid) {
                                return;
                            }
                            ;
                            //通过bjid获取成员列表li
                            var li = $(this).find(".ower li[data-id='" + bjid + "']");
                            var affiliation = li.attr('data-affiliation');
                            if (undefined == affiliation) {
                                li = $(this).find(".member li[data-id='" + bjid + "']");
                                affiliation = li.attr('data-affiliation');
                            }
                            ;
                            var nickname = li.find('a').text();
                            //要插入到之后的li
                            var afterLi = null;
                            //循环遍历在线在线用户，查找到要插入到li的后面
                            /*$.each(children,function(idx,node){
                             var sjid = node.jid;
                             alert('sjid:'+sjid);
                             //var text = node.text;
                             //获取对应好友li
                             var insertLi = $(this).find(".ower li[data-id='"+sjid+"']");
                             var newAffiliation = insertLi.attr('data-affiliation');
                             if(undefined==newAffiliation){
                             insertLi = $(this).find(".member li[data-id='"+sjid+"']");
                             newAffiliation = insertLi.attr('data-affiliation');
                             };
                             alert(insertLi.attr('data-id')+'---'+newAffiliation);
                             var textA = li.find('a').text();
                             var textB = insertLi.find('a').text();
                             alert(textA+'---'+textB);
                             if(textA<=textB){
                             afterLi = insertLi;
                             }
                             if('20'==affiliation){
                             insertLi = $(this).find(".ower li[data-id='"+sjid+"']");
                             var nickname = insertLi.find("a").text();
                             if(nickname<=text){
                             afterLi = insertLi;
                             }
                             }else if('30'==affiliation){
                             insertLi = $(this).find(".member li[data-id='"+sjid+"']");
                             var nickname = insertLi.find("a").text();
                             var nickname = insertLi.find("a").text();
                             if(nickname<=text){
                             afterLi = insertLi;
                             }
                             }
                             });
                             alert(afterLi.attr('data-id'));*/
                            var newLi = null;
                            //若为群主，不用排序，直接修改图片样式
                            if ('10' == affiliation) {
                                li.attr('class', 'icon-group-owner');
                            } else if ('20' == affiliation) {
                                //获取ul
                                var ul = $(this).find(".member");
                                //获取管理员在线li数组
                                var list = $(this).find(".member li[class=icon-group-1]");
                                //最后一个在线管理员
                                var lastLi = $(this).find(".member li[class=icon-group-1]").last();
                                var len = list.length;
                                if (len > 0) {

                                    //遍历在线好友数组
                                    var childrenLen = children.length;
                                    var sjid = null;
                                    list.each(function (index) {
                                        var ajid = $(this).attr('data-id');
                                        var text = $(this).text();
                                        if (nickname <= text) {
                                            sjid = ajid;
                                        }
                                    });
                                    if (null != sjid) {
                                        if (sjid != bjid) {
                                            //根据sjid获取li
                                            var oldLi = $(this).find(".member li[data-id='" + sjid + "']");
                                            li.attr('class', 'icon-group-1');
                                            //newLi = li.clone(true);
                                            newLi = li;
                                            li.remove();
                                            //插入到old之前
                                            oldLi.before(newLi);
                                        }
                                    } else {
                                        li.attr('class', 'icon-group-1');
                                        //newLi = li.clone(true);
                                        newLi = li;
                                        li.remove();
                                        //插入到最后
                                        lastLi.after(newLi);
                                    }
                                } else {
                                    //直接插入到群主后面第一个位置
                                    //获取群主对象
                                    var owerLi = $(this).find(".member li[data-affiliation=10]");
                                    li.attr('class', 'icon-group-1');
                                    //newLi = li.clone(true);
                                    newLi = li;
                                    li.remove();
                                    owerLi.after(newLi);
                                }
                            } else if ('30' == affiliation) {
                                //获取普通成员ul对象
                                var ul = $(this).find(".member");
                                //获取普通成员在线li数组
                                var list = $(this).find(".member li[class=icon-group-2]");
                                var lastLi = $(this).find(".member li[class=icon-group-2]").last();
                                //获取最后一个管理员
                                var lastMangerLi = $(this).find(".member li[data-affiliation!='30']").last();
                                var len = list.length;
                                if (len > 0) {
                                    //当前出席好友昵称
                                    var nickname = li.find("a").text();
                                    var childrenLen = children.length;
                                    var sjid = null;
                                    list.each(function () {
                                        var ajid = $(this).attr('data-id');
                                        var text = $(this).text();
                                        if (nickname <= text) {
                                            sjid = ajid;
                                            return false;
                                        }
                                    });
                                    if (null != sjid) {
                                        if (sjid != bjid) {
                                            //根据sjid获取li
                                            var oldLi = $(this).find(".member li[data-id='" + sjid + "']");
                                            li.attr('class', 'icon-group-2');
                                            //newLi = li.clone(true);
                                            newLi = li;
                                            li.remove();
                                            //插入到old之前
                                            oldLi.before(newLi);
                                        }
                                    } else {
                                        //插入到在线最后一个
                                        li.attr('class', 'icon-group-2');
                                        //newLi = li.clone(true);
                                        newLi = li;
                                        li.remove();
                                        //插入到最前面
                                        lastLi.after(newLi);
                                    }
                                } else {
                                    //直接插入到普通成员列表第一个
                                    //获取最后一个
                                    li.attr('class', 'icon-group-2');
                                    //newLi = li.clone(true);
                                    newLi = li;
                                    li.remove();
                                    lastMangerLi.after(newLi);
                                }
                            }
                            ;
                            //若为群主，不用排序，直接修改图片样式
                            /*if('10'==affiliation){
                             li.attr('class','icon-group-owner');
                             }else if('20'==affiliation){
                             //获取管理员ul对象
                             var me = $(this);
                             var ul = $(this).find(".ower");
                             //获取管理员在线li数组
                             var list = $(this).find(".ower li[class=icon-group-1]");
                             var lastLi = $(this).find(".ower li[class=icon-group-1]").last();

                             var len = list.length;
                             if(len>0){//进行排序

                             //遍历在线好友数组
                             var childrenLen = children.length;
                             var sjid = null;
                             list.each(function(index){

                             var ajid = $(this).attr('data-id');
                             var text = $(this).text();
                             if(nickname<=text){
                             sjid = ajid;
                             }
                             });

                             if(null!=sjid){
                             if(sjid!=bjid){
                             //根据sjid获取li
                             var oldLi = $(this).find(".ower li[data-id='"+sjid+"']");
                             li.attr('class','icon-group-1');
                             newLi = li.clone(true);
                             li.remove();
                             //插入到old之前
                             oldLi.before(newLi);
                             }
                             }else{
                             li.attr('class','icon-group-1');
                             newLi = li.clone(true);
                             li.remove();
                             //插入到最后
                             lastLi.after(newLi);
                             }

                             }else{//直接插入到群主后面第一个位置
                             //获取群主对象
                             var owerLi = $(this).find(".ower li[data-affiliation=10]");
                             li.attr('class','icon-group-1');
                             newLi = li.clone(true);
                             li.remove();
                             owerLi.after(newLi);
                             }
                             }else if('30'==affiliation){
                             //获取普通成员ul对象
                             var ul = $(this).find(".member");
                             //获取普通成员在线li数组
                             var list = $(this).find(".member li[class=icon-group-2]");
                             var lastLi = $(this).find(".member li[class=icon-group-2]").last();

                             var len = list.length;
                             if(len>0){//进行排序

                             //当前出席好友昵称
                             var nickname = li.find("a").text();
                             var childrenLen = children.length;
                             var sjid = null;
                             list.each(function(){
                             var ajid = $(this).attr('data-id');
                             var text = $(this).text();
                             if(nickname<=text){
                             sjid = ajid;
                             return false;
                             }
                             });

                             if(null!=sjid){
                             if(sjid!=bjid){
                             //根据sjid获取li
                             var oldLi = $(this).find(".member li[data-id='"+sjid+"']");
                             li.attr('class','icon-group-2');
                             li.remove();
                             newLi = li.clone(true);
                             //插入到old之前
                             oldLi.before(newLi);
                             }
                             }else{
                             //插入到在线最后一个
                             li.attr('class','icon-group-2');
                             newLi = li.clone(true);
                             li.remove();
                             //插入到最前面
                             lastLi.after(newLi);
                             }

                             }else{//直接插入到普通成员列表第一个

                             li.attr('class','icon-group-2');
                             newLi = li.clone(true);
                             li.remove();
                             ul.prepend(newLi);
                             }
                             };*/
                            if (null != newLi) {
                                //添加双击事件
                                Ext.webIM.friendBblclick(newLi);
                            }
                        }
                    }
                });
            }
        } catch (e) {
            alert('错误');
        }
    }
    return true;
};