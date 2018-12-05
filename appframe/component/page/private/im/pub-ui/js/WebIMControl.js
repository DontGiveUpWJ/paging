Ext = window.parent.Ext;
var jump;
Ext.webIM = {
    //消息图标开始跳动
    interval: 0,
    beginJump: function () {
        var msgButton = $(".nav-list-3");
        Ext.webIM.interval = setInterval(function () {
            var classUrl = msgButton.attr('class');
            if (classUrl == 'nav-list-3') {
                msgButton.attr('class', 'nav-list-noImage');
            } else {
                msgButton.attr('class', 'nav-list-3');
            }
            ;
            // 系统托盘小喇叭
            var tray = Ext.tray;
            if (tray.icon == 'resources/images/icon-nav-3.png') {
                tray.icon = 'resources/images/icon-no-image.png'
            } else {
                tray.icon = 'resources/images/icon-nav-3.png'
            }
        }, 500);
    },
    //消息图片停止跳动
    stopJump: function () {
        clearInterval(Ext.webIM.interval);
        var msgButton = $("#nav-list-3");
        msgButton.attr('class', 'nav-list-3');
        // 系统托盘小喇叭
        var tray = Ext.tray;
        tray.icon = 'resources/images/mainIcon.png';
        Ext.webIM.interval = 0;
    },
    //点击桌面小图标处理方式
    TrayClickOption: function () {
        //公告消息数组
        var noticeMsg = Ext.noticeMsgBox;
        var noticeMsgLen = noticeMsg.length;
        //系统消息数组
        var SysMsg = Ext.messageSysStore;
        var SysMsgLen = SysMsg.length;
        //普通聊天消息数组
        var msgBox = Ext.tempMsgBox;
        var msgBoxLen = msgBox.length;
        //处理消息顺序：公告消息、系统消息、聊天消息
        if (undefined != noticeMsgLen && noticeMsgLen > 0) {
            //公告消息不用打开主面板
            Ext.webIM.noticeDealTrayMessage();
        } else if (undefined != SysMsgLen && SysMsgLen > 0) {
            //系统消息，打开主面板
            Ext.gui.Window.get().show();
            Ext.gui.Window.get().focus();
            //系统消息处理
            Ext.webIM.dealMessage();
        } else if (undefined != msgBoxLen && msgBoxLen > 0) {
            //聊天消息不用打开主面板
            Ext.webIM.dealTrayMessage();
        } else {
            //若没消息，点击HelloKitty打开主面板
            Ext.gui.Window.get().show();
            Ext.gui.Window.get().focus();
        }
        ;
    },
    //普通消息处理方式
    dealTrayMessage: function () {
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
                    var text = li.attr("data-text");
                    if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                        sessionStorage.setItem('dialogType', 'chat');
                        sessionStorage.setItem('dialogJid', jid);
                        sessionStorage.setItem('dialogUsername', text);
                        //Ext.dialogPanel = window.open('com/sitech/views/user/DialogPanel.html', '聊天对话框',
                        //    'depended=yes,height=500,width=900');
                        Ext.dialogPanel = window.imModalMax();
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
                                dialogPanel.initUserWin(jid, text);
                            } else {
                                dialogPanel.setTabLiAc(jid);
                                dialogPanel.setDialogDiv(jid);
                            }
                            ;
                        }
                    }
                } else if ('groupchat' == type) {
                    var jid = data.jid;
                    var li = $("#room-lists li[data-id='" + jid + "']");
                    var text = li.attr("data-text");
                    if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                        sessionStorage.setItem('dialogType', 'groupchat');
                        sessionStorage.setItem('dialogJid', jid);
                        sessionStorage.setItem('dialogUsername', text);
                        //Ext.dialogPanel = window.open('com/sitech/views/user/DialogPanel.html', '聊天对话框',
                        //    'depended=yes,height=500,width=900');
                        Ext.dialogPanel = window.imModalMax();
                    } else {
                        var dialogPanel = Ext.dialogPanel;
                        var storage = window.localStorage;
                        var initFlag = storage.getItem('initFlag');
                        if (undefined == initFlag || null == initFlag || '' == initFlag || initFlag == false) {
                        } else {
                            var jidRoom = jid + 'room';
                            dialogPanel.gui.Window.get().show();
                            dialogPanel.gui.Window.get().focus();
                            var li = dialogPanel.$(".tabs-list li[data-id='" + jidRoom + "']");
                            var data_id = li.attr('data-id');
                            if (undefined == data_id || null == data_id) {
                                dialogPanel.initRoomWin(jid, text);
                            } else {
                                dialogPanel.setTabLiAc(jidRoom);
                                dialogPanel.setDialogDiv(jidRoom)
                            }
                        }
                    }
                } else if ('tempchat' == type) {
                    var text = data.from;
                    var jid = data.jid;
                    if (undefined == Ext.dialogPanel || Ext.dialogPanel == null || Ext.dialogPanel.closed) {
                        sessionStorage.setItem('dialogType', 'tempchat');
                        sessionStorage.setItem('dialogJid', jid);
                        sessionStorage.setItem('dialogUsername', text);
                        //Ext.dialogPanel = window.open('com/sitech/views/user/DialogPanel.html', '聊天对话框',
                        //    'depended=yes,height=500,width=900');
                        Ext.dialogPanel = window.imModalMax();
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
    },
    //点击小喇叭处理方式
    dealOption: function () {
        //点击主页面小喇叭，处理顺序：公告、系统消息
        //系统消息数组
        var messageSysStore = Ext.messageSysStore;
        var sysLen = messageSysStore.length;
        //公告消息数组
        var noticeMsgBox = Ext.noticeMsgBox;
        var noticeLen = noticeMsgBox.length;
        if (noticeLen > 0) {//公告消息处理
            Ext.webIM.noticeDealTrayMessage();
        } else if (sysLen > 0) {//系统消息处理方式
            Ext.webIM.dealMessage();
        } else {//打开公告窗口
            if (undefined == Ext.noticePanel || Ext.noticePanel == null || Ext.noticePanel.closed) {
                Ext.noticePanel = window.open('com/sitech/views/notice/NoticeMainPanel.html', '', 'height=550,width=850');
            } else {
                Ext.noticePanel.close();
            }
        }
        ;
    },
    //系统消息处理方式
    dealMessage: function () {
        var messageSysStore = Ext.messageSysStore;
        var len = messageSysStore.length;
        if (len > 0) {
            var data = messageSysStore[0];
            var type = data.type;
            var jid = data.jid;
            var date = data.date;
            var message = data.message;
            var roomId = data.roomId;
            //请求添加好友消息
            if (type == Ext.PresenceType.subscribe) {

                /*var msg = jid+'请求添加您为好友！';
                 if(confirm(msg)){
                 //同意
                 var subscribed = $pres({to:jid,type:'subscribed'});
                 Ext.connection.send(subscribed.tree());

                 //反向订阅对方为好友且必须同意
                 var subAdd = $pres({to:jid,type:'subscribe',id:'mustAdd'});
                 Ext.connection.send(subAdd.tree());
                 Ext.webIM.removeMsgSysStore();

                 }else{
                 //拒绝
                 var unsubscribed = $pres({to:jid,type:'unsubscribed'});
                 Ext.connection.send(unsubscribed.tree());
                 Ext.webIM.removeMsgSysStore();
                 }*/
                Ext.webIM.msgAddFriendTip(jid);
            } else if (type == Ext.PresenceType.unsubscribed) {
                Ext.webIM.removeMsgSysStore();
                //提示弹出窗口
                var id = 'approveAddFriendAlert';
                var parames = [jid + '拒绝添加您为好友！', '确定'];
                createAlertTip(parames, id);
            } else if (type == Ext.PresenceType.subscribed) {
                Ext.webIM.removeMsgSysStore();
                //提示弹出窗口
                var id = 'refuseAddFriendAlert';
                var parames = [jid + '同意添加您为好友！', '确定'];
                createAlertTip(parames, id);
                //邀请加入群
            } else if (type == 'invitedRoom') {
                var data = $msg({type: 'chat', id: 'replayInvitedRoom', to: jid, from: Ext.bare_jid});
                //申请进入群
                var id = 'invitedRoomTip';
                var title = '邀请加入群';
                //设置参数数组
                var parames = [roomId, id, data];
                //设置提示窗口内容
                setConfirmTip(title, message, '同意', '拒绝', 'invitedRoomTip', parames);
                dialog({
                    id: id,
                    title: null,
                    content: document.getElementById('confirmTips'),
                    padding: 0,
                    width: 250
                }).showModal();
                /*if(window.confirm(message)){
                 var msg = '0[-]'+roomId;
                 data.c('body',null,msg);
                 Ext.connection.send(data.tree());
                 Ext.webIM.removeMsgSysStore();
                 }else{
                 var msg = '1[-]'+Ext.nickName+'拒绝加入群';
                 data.c('body',null,msg);
                 Ext.connection.send(data.tree());
                 //Ext.messageSysStore.splice(0,1);
                 Ext.webIM.removeMsgSysStore();
                 }*/
            } else if (type == 'replayJoinRoom') {
                Ext.webIM.removeMsgSysStore();
                //提示弹出窗口
                var id = 'replayJoinRoomAlert';
                var parames = [message, '确定'];
                createAlertTip(parames, id);
                //alert(message);
                //Ext.webIM.removeMsgSysStore();
            } else if (type == 'applyToRoom') {
                //申请进入群
                var id = 'applyToRoom';
                //设置参数数组
                var parames = [roomId, jid, id];
                //设置提示窗口内容
                setConfirmTip('请求入群', message, '同意', '拒绝', 'applyToRoom', parames);
                dialog({
                    id: id,
                    title: null,
                    content: document.getElementById('confirmTips'),
                    padding: 0,
                    width: 250
                }).showModal();
                /*art.dialog({
                 id:msg,
                 title:'请求入群',
                 content:message,
                 okValue: '同意',
                 cancelValue: '拒绝',
                 ok: function () {
                 //同意
                 var msg = roomId + Ext.room_suffix;
                 Ext.webIM.giveRoomMember(msg,jid);
                 var li = $("#room-lists li[data-id='"+roomId+"']");
                 var naturalName = li.attr('data-text');
                 if(undefined!=naturalName){
                 var data = $msg({from:Ext.bare_jid,to:jid,id:'joinInNow'});
                 data.c('x',{xmlns:'jabber:x:conference',jid:msg,reason:naturalName});
                 Ext.connection.send(data.tree());
                 Ext.webIM.removeMsgSysStore();
                 this.close();
                 //art.dialog.get(msg).close();
                 }

                 },
                 cancel: function () {
                 //拒绝
                 Ext.webIM.removeMsgSysStore();
                 //art.dialog.get(msg).close();
                 this.close();
                 }
                 });*/
            }
        }
    },
    //接收到notice消息触发方法
    dealNoticeMessage: function (msgid) {
        var noticeMsgBox = Ext.noticeMsgBox;
        if (undefined != noticeMsgBox && noticeMsgBox.length > 0) {
            sessionStorage.setItem('notice_msgid', msgid);
            var winName = '公告小弹窗' + msgid;
            var obj = new Object();
            obj.winName = winName;
            obj.winValue = window.open('com/sitech/views/notice/PettyWin.html', winName,
                "resizable=no,z-look=yes,alwaysRaised=yes,scrollbars=no,height=220,width=330,top="
                + (screen.availHeight - 220) + ",left ="
                + (screen.availWidth - 330) + ",depended=yes");
            var flag = contains(Ext.panelHtmlStore, winName);
            if (!flag) {
                Ext.panelHtmlStore.push(obj);
            }
            ;
        }
    },
    //点击小图标notice方法
    noticeDealTrayMessage: function () {
        var noticeMsgBox = Ext.noticeMsgBox;
        if (undefined == noticeMsgBox) {
            return;
        } else {
            if (noticeMsgBox.length == 0) {
                return;
            } else {
                //获取第一个元素
                var noticeMsg = noticeMsgBox[0];
                var msgid = noticeMsg.msgid;
                sessionStorage.setItem('notice_cur_msgid', msgid);
                var winName = '公告全文' + msgid;
                var obj = new Object();
                obj.winName = winName;
                obj.winValue = window.open('com/sitech/views/notice/DetailNoticeMsg.html', winName, 'z-look=yes,alwaysRaised=yes,height=500,width=600');
                var flag = contains(Ext.panelHtmlStore, winName);
                if (!flag) {
                    Ext.panelHtmlStore.push(obj);
                }
                ;
                Ext.webIM.removeNoticeMsgBoxData();
            }
        }
    },
    /**
     * 查询个人信息
     */
    searchUserInfo: function (username, id) {
        var data = $iq({from: Ext.bare_jid, id: id, to: Ext.search_user_suffix, type: 'set'});
        data.c('query', {xmlns: 'jabber:iq:search'});
        data.c('x', {type: 'submit', xmlns: 'jabber:x:data'});
        data.c('field', {type: 'hidden', 'var': 'FROM_TYPE'}).c('value', null, 'jabber:iq:search').up();
        data.c('field', {type: 'text-single', 'var': 'search'}).c('value', null, username).up();
        data.c('field', {type: 'boolean', 'var': 'Username'}).c('value', null, '1').up();
        data.c('field', {type: 'boolean', 'var': 'Name'}).c('value', null, '1').up();
        data.c('field', {type: 'boolean', 'var': 'Email'}).c('value', null, '1').up();
        Ext.connection.send(data.tree());
    },
    //创建房间后初始化
    initConfigRoom: function (roomName) {
        var data = $iq({from: Ext.bare_jid, to: roomName, id: 'initRoomConfig', type: 'set'});
        data.c('query', {xmlns: Strophe.NS.MUC + "#owner"});
        data.c('x', {xmlns: 'jabber:x:data', type: 'submit'});
        /**配置参数*/
            //公开的房间
        data.c('field', {'var': 'muc#roomconfig_publicroom'}).c('value', null, '1').up();
        //房间持久
        data.c('field', {'var': 'muc#roomconfig_persistentroom'}).c('value', null, '1').up();
        //允许占有者邀请其他人
        data.c('field', {'var': 'muc#roomconfig_allowinvites'}).c('value', null, '0').up();
        //登录房间对话
        data.c('field', {'var': 'muc#roomconfig_enablelogging'}).c('value', null, '0').up();
        //房间人数
        data.c('field', {'var': 'muc#roomconfig_maxusers'}).c('value', null, '50').up();
        Ext.connection.send(data.tree());
    },
    //发送房间出席信息
    joinRoom: function (roomId) {
        var nick = Ext.nickName + "[-]" + Ext.connection.jid;
        var to = roomId + Ext.room_suffix + "/" + nick;
        var data = $pres({from: Ext.bare_jid, to: to, id: 'joinRoom'});
        data.c('x', {xmlns: Strophe.NS.MUC});
        Ext.connection.send(data.tree());
    },
    //邀请入群
    inviteJoinRoom: function (roomJid, roomName, jid) {
        var msg = Ext.nickName + '邀请您加入' + "\"" + roomName + "\"群";
        var data = $msg({from: Ext.bare_jid, to: jid});
        data.c('x', {xmlns: 'jabber:x:conference', jid: roomJid, reason: msg});
        Ext.connection.send(data.tree());
    },
    //申请入群
    applyToRoom: function (jids, roomId, roomName) {
        var msg = Ext.connection.authcid + '请求加入【' + roomName + '】群';
        for (var i = 0; i < jids.length; i++) {
            var reply = $msg({
                to: jids[i],
                from: Ext.bare_jid,
                type: 'chat',
                id: 'applyToRoom'
            }).cnode(Strophe.xmlElement('body', '', msg));
            reply.c('roomId', null, roomId);
            Ext.connection.send(reply.tree());
        }
    },
    //
    giveRoomMember: function (roomJid, jid) {
        var data = $iq({from: Ext.bare_jid, to: roomJid, type: 'set', id: 'giveMember'});
        data.c('query', {xmlns: Strophe.NS.MUC + "#admin"});
        data.c('item', {affiliation: 'member', jid: jid});
        Ext.connection.send(data.tree());
    },
    //修改群权限
    setRoomRosterRole: function (id, jid, roomId, role, nickname) {
        var roomJid = roomId + Ext.room_suffix;
        var data = $iq({from: Ext.bare_jid, type: 'set', id: id, to: roomJid});
        data.c('query', {xmlns: Strophe.NS.MUC + "#admin"});
        if (nickname) {
            data.c('item', {affiliation: role, jid: jid, nick: nickname});
        } else {
            data.c('item', {affiliation: role, jid: jid});
        }
        Ext.connection.send(data.tree());
    },
    /**
     * 设置登录用户昵称
     */
    setLoginUserName: function (username) {
        Ext.loginUserName = username;
    },
    /**
     * 获取好友列表
     */
    getFriendsList: function () {
        var reply = $iq({to: Ext.domain, from: Ext.bare_jid, type: 'get', id: 'login'});
        reply.cnode(Strophe.xmlElement('query', {
            'xmlns': 'jabber:iq:roster'
        }));
        Ext.connection.send(reply.tree());
    },
    /**
     *将获取到好友列表数据显示到页面
     */
    setFriendsList: function (data) {
        var len = data.length;
        var friendList = $("#item-lists");
        //清空好友类别数据
        friendList.empty();
        for (var i = 0; i < len; i++) {
            var newData = data[i];
            //添加好友<li>
            Ext.webIM.addFriendLi(friendList, newData, "append");
        }
    },
    //创建好友li
    addFriendLi: function (friendList, data, method) {
        //获取需要的数据
        var id = data.id;
        var jid = data.jid;
        var text = data.text;
        var remarkName = data.remarkName;
        var icon = data.icon;
        var username = data.username;
        var jidSrc = jid + 'src';
        var jidText = jid + 'text';
        //var exixtLi = $
        //创建li
        var newLi = $('<li></li>', {
            'data-id': id,
            'data-jid': jid,
            'data-text': text,
            'data-username': username,
            'data-remarkName': remarkName
        });
        //创建div1
        var div1 = $('<div></div>', {'class': 'item-media'});
        var img = $('<img/>', {'src': icon, 'data-id': jidSrc});
        var div1_p1 = $('<p></p>', {'class': 'item-media-image'});
        img.appendTo(div1_p1);
        var div1_p2 = $('<p></p>', {'class': 'item-media-title', 'data-id': jidText, text: text});
        div1.append(div1_p1);
        div1.append(div1_p2);
        //创建div2
        var div2 = $('<div></div>', {'class': 'item-opt'});
        var div2_btn1 = $('<button/>', {'class': 'item-opt-btn item-opt-msg', 'title': '聊天'});
        var div2_btn2 = $('<button/>', {'class': 'item-opt-btn item-opt-info', 'title': '好友资料'});
        div2.append(div2_btn1);
        div2.append(div2_btn2);
        newLi.append(div1);
        newLi.append(div2);
        if ('append' == method) {
            friendList.append(newLi);
        } else if ('prepend' == method) {
            friendList.prepend(newLi);
        }
        ;
    },
    //添加在线好友数组
    setOnlineUser: function (onlineStore, jid) {
        if (null != onlineStore && undefined != onlineStore) {
            var flag = false;
            var len = onlineStore.length;
            for (var i = 0; i < len; i++) {
                var newJid = onlineStore[i].jid;
                if (jid == newJid) {
                    falg = true;
                    break;
                }
            }
            ;
            if (flag == false) {
                var user = new Object();
                user.jid = jid;
                onlineStore.push(user);
            }
        }
    },
    //查找房间列表
    searchRoom: function () {
        //ajax查询
        var url = Ext.service_plugin_url + 'myroom/search';
        var data = "jid=" + Ext.bare_jid + "&node=-1";
        $.ajax({
            type: 'POST',
            url: url,
            async: false,
            data: data,
            dataType: 'json',
            success: function (resp, option) {
                Ext.webIM.setRoomList(resp);
            },
            error: function (resp) {
                alert('失败');
            }
        });
    },
    //将获取到的房间列表设置到页面
    setRoomList: function (resp) {
        var roomList = $("#room-lists");
        //清空房间列表数据
        roomList.empty();
        var len = resp.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var data = resp[i];
                //发送房间出席信息
                var roomId = data.jid;
                Ext.webIM.joinRoom(roomId);
                Ext.webIM.addRoomLi(roomList, data);
            }
            ;
        }
    },
    //删除房间列表li
    removeRoomLi: function (roomList, data) {
        var jid = data.jid;
        var id = data.id;
        var li = $("#room-lists li[data-id='" + jid + "']");
        var data_id = li.attr('data-id');
        //从群列表中移除群
        if (undefined != data_id && null != data_id) {
            li.remove();
        }
    },
    //创建房间li
    addRoomLi: function (roomList, data) {
        /*alert('roomid:'+data.roomid);
         alert('jid:'+data.jid);
         alert('id:'+data.id);
         alert('name:'+data.name);
         alert('text:'+data.text);
         alert('affiliation:'+data.affiliation);*/
        //获取需要的数据
        var roomid = '';
        if (undefined != data.roomJID) {
            roomid = data.roomJID;
        }
        ;
        var jid = roomid;
        var text = data.subjectname;
        //创建li
        var newLi = $('<li></li>', {
            'data-jid': jid,
            'data-text': text
        });
        //创建div1
        var div1 = $('<div></div>', {'class': 'item-media'});
        //var img = $('<img/>', {'src': 'resources/images/icon-dialog-title-1.png'});
        var div1_p1 = $('<p></p>', {'class': 'item-media-image'});
        //img.appendTo(div1_p1);
        var div1_p2 = $('<p></p>', {'class': 'item-media-title', 'data-id': jid, text: text});
        div1.append(div1_p1);
        div1.append(div1_p2);
        //创建div2
        //var div2 = $('<div></div>', {'class': 'item-opt'});
        //var div2_btn1 = $('<button/>', {'class': 'item-opt-btn item-opt-msg', 'title': '群聊'});
        //var div2_btn2 = $('<button/>', {'class': 'item-opt-btn item-opt-info', 'title': '群资料'});
        //div2.append(div2_btn1);
        //div2.append(div2_btn2);
        newLi.append(div1);
        //newLi.append(div2);
        roomList.append(newLi);
        //创建右键菜单栏
        //var items = null;
        //if ('10' == affiliation) {
        //    var items = [
        //        {
        //            label: '解散群',
        //            action: function () {
        //                Ext.webIM.dissolveRoom(jid);
        //            }
        //        },
        //        {
        //            label: '修改群资料',
        //            action: function () {
        //                Ext.webIM.changeRoomMaterial(affiliation, roomid);
        //            }
        //        }
        //    ];
        //} else {
        //    var items = [
        //        {
        //            label: '退出群',
        //            action: function () {
        //                Ext.webIM.rosterQuitRoom(Ext.bare_jid, affiliation, jid);
        //            }
        //        }
        //    ];
        //}
        //;
        //if (null != items) {
        //    newLi.contextPopup({
        //        items: items
        //    });
        //}
    },
    //解散群
    dissolveRoom: function (roomId) {
        var id = 'dissolveRoomTip';
        var title = "解散群提示";
        var msg = '是否解散群【' + roomId + '】？';
        //设置参数数组
        var parames = [roomId, id];
        //设置提示窗口内容
        setConfirmTip(title, msg, '确定', '取消', 'dissolveRoomTip', parames);
        dialog({
            id: id,
            title: null,
            content: document.getElementById('confirmTips'),
            padding: 0,
            width: 250
        }).showModal();
        /*if(confirm('确定解散该群吗?')){
         var data = $iq({from:Ext.bare_jid,id:'destroyroom',to:roomId+Ext.room_suffix,type:'set'});
         data.c('query',{xmlns:'http://jabber.org/protocol/muc#owner'});
         data.c('destroy');
         data.c('reason',null,'群'+roomId+'已被'+Ext.nickName+'删除！');
         Ext.connection.send(data.tree());
         }else{
         return false;
         }*/
    },
    //修改群资料
    changeRoomMaterial: function (affiliation, roomId) {
        sessionStorage.setItem('affiliation', affiliation);
        sessionStorage.setItem('roomId', roomId);
        var winname = roomId + '房间资料';
        window.open('com/sitech/views/user/RoomDetailPanel.html', winname, 'depended=yes,resizable=no,z-look=yes,height=340,width=420');
    },
    //退出群
    rosterQuitRoom: function (jid, affiliation, roomId) {
        var id = 'quitRoomTip';
        var title = "退群提示";
        var msg = '是否退出群【' + roomId + '】？';
        //设置参数数组
        var parames = [jid, affiliation, roomId, id];
        //设置提示窗口内容
        setConfirmTip(title, msg, '确定', '取消', 'quitRoomTip', parames);
        dialog({
            id: id,
            title: null,
            content: document.getElementById('confirmTips'),
            padding: 0,
            width: 250
        }).showModal();
        //ajax 退出群
        /*if(!confirm('是否退出群')){
         return false;
         }else{
         var url = Ext.service_plugin_url+'myroom/quitroom';
         var data = 'jid='+jid+'&affiliation='+affiliation+'&roomId='+roomId+'&roomJID='+roomId+Ext.room_suffix;
         $.ajax({
         type:'POST',
         url:url,
         async: false,
         data: data,
         dataType:'json',
         success:function(resp,option){
         //退出群成功，发送群
         },
         error:function(resp){
         alert('退出群失败！');
         }
         });
         } */
    },
    //添加数据到noticeMsgBox
    addNoticeMsgBoxData: function (data) {
        var msgid = data.msgid;
        var noticeMsgBox = Ext.noticeMsgBox;
        var len = noticeMsgBox.length;
        var falg = false;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var _data = noticeMsgBox[i];
                var _msgid = _data.msgid;
                if (_msgid == data.msgid) {
                    falg = true;
                    break;
                }
            }
            ;
            if (!falg) {
                //将notice添加到数组中
                Ext.noticeMsgBox.push(data);
                //首先停止聊天消息接收时HelloKitty跳动
                Ext.webIM.stopHelloKitty();
                //小喇叭跳动
                if (Ext.webIM.interval == 0) {
                    Ext.webIM.beginJump();
                }
                ;
                //弹出窗口自动打开
                Ext.webIM.dealNoticeMessage(msgid);
            }
        } else {
            //将notice添加到数组中
            Ext.noticeMsgBox.push(data);
            //首先停止聊天消息接收时HelloKitty跳动
            Ext.webIM.stopHelloKitty();
            //小喇叭跳动
            if (Ext.webIM.interval == 0) {
                Ext.webIM.beginJump();
            }
            ;
            //弹出窗口自动打开
            Ext.webIM.dealNoticeMessage(msgid);
        }
    },
    //普通消息HelloKitty图片跳动停止
    stopHelloKitty: function () {
        var msgBox = Ext.tempMsgBox;
        var len = msgBox.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var data = Ext.tempMsgBox[i];
                var type = data.type;
                var intervalId = data.intervalId;
                if ('title' == type) {
                    //清除intervalId
                    clearInterval(intervalId);
                    //从数组中删除yuans
                    Ext.tempMsgBox.splice(i, 1);
                    //还原HelloKitty
                    var tray = Ext.tray;
                    tray.icon = 'resources/images/icon-mainIcon.png';
                    break;
                }
            }
        }
    },
    //公告消息数组len=0时，重新跳动HelloKitty图标
    jumpHelloKitty: function () {
        var msgBox = Ext.tempMsgBox;
        var len = msgBox.length;
        if (len > 0) {
            var flag = false;
            for (var i = 0; i < len; i++) {
                var data = Ext.tempMsgBox[i];
                var type = data.type;
                if ('title' == type) {
                    flag = true;
                    break;
                }
            }
            ;
            if (!false) {
                //Ext.tempMsgBox 数组添加title元素
                var data = {type: 'title'};
                Ext.webIM.addMsgBoxAction(data);
            }
        }
    },
    //从noticeMsgBox移除第一个元素
    removeNoticeMsgBoxData: function () {
        var len = Ext.noticeMsgBox.length;
        //notice公告数组长度
        var noticeBoxLen = Ext.noticeMsgBox.length;
        //系统消息数组长度
        var sysStoreLen = Ext.messageSysStore.length;
        //普通消息数组长度
        var tempMsgLen = Ext.tempMsgBox.length;
        if (len > 0) {
            Ext.noticeMsgBox.splice(0, 1);
            var newLen = Ext.noticeMsgBox.length;
            if (sysStoreLen == 0 && newLen == 0) {
                Ext.webIM.stopJump();
                Ext.webIM.jumpHelloKitty();
            }
        } else {
            if (sysStoreLen == 0) {
                Ext.webIM.stopJump();
                Ext.webIM.jumpHelloKitty();
            }
        }
    },
    //根据notice的Msgid删除元素
    removeNoticeByMsgId: function (msgId) {
        var len = Ext.noticeMsgBox.length;
        var noticeBoxLen = Ext.noticeMsgBox.length;
        //系统消息数组长度
        var sysStoreLen = Ext.messageSysStore.length;
        //普通消息数组长度
        var tempMsgLen = Ext.tempMsgBox.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var msg = Ext.noticeMsgBox[i];
                var _msgId = msg.msgid;
                if (msgId == _msgId) {
                    Ext.noticeMsgBox.splice(i, 1);
                    var newLen = Ext.noticeMsgBox.length;
                    if (sysStoreLen == 0 && newLen == 0) {
                        Ext.webIM.stopJump();
                        Ext.webIM.jumpHelloKitty();
                    }
                }
            }
        } else {
            if (sysStoreLen == 0) {
                Ext.webIM.stopJump();
                Ext.webIM.jumpHelloKitty();
            }
        }
    },
    //根据msgid移除noticeMsgBox元素
    /*removeNoticeMsgBox:function(msgid){
     var len = Ext.noticeMsgBox.length;
     var noticeBoxLen = Ext.noticeMsgBox.length;
     if(len>0){
     for(var i=0;i<len;i++){
     var data = Ext.noticeMsgBox[i];
     var _msgid = data.msgid;
     if(msgid==_msgid){
     Ext.noticeMsgBox.splice(i,1);
     if(sysStoreLen==0&&noticeBoxLen==0){
     Ext.webIM.stopJump();
     Ext.webIM.jumpHelloKitty();
     }
     }
     }
     }else{
     if(sysStoreLen==0){
     Ext.webIM.stopJump();
     Ext.webIM.jumpHelloKitty();
     }
     }
     },*/
    //修改好友备注名
    updateRoster: function (jid, name, group) {
        var data = $iq({from: Ext.bare_jid, type: 'set', id: 'updateRoster'});
        data.c('query', {xmlns: 'jabber:iq:roster'});
        data.c('item', {jid: jid, name: name});
        Ext.connection.send(data.tree());
    },
    //someonequitroom	从群成员列表中删除该成员(重新加载群数据)
    searchRoomRoster: function (roomId, reload) {
        var dialogPanel = Ext.dialogPanel;
        //从新获取群列表成员
        if (reload) {
            if (undefined != dialogPanel && null != dialogPanel && '' != dialogPanel && !dialogPanel.closed) {
                var jidRoom = roomId + 'room';
                //var groupOwer = dialogPanel.$(".ower[data-id='"+jidRoom+"']");
                var memberList = dialogPanel.$(".member[data-id='" + jidRoom + "']");
                //var owerDataId = groupOwer.attr('data-id');
                var memberDataId = memberList.attr('data-id');
                var baseDiv = dialogPanel.$(".dialog-body[data-id='" + jidRoom + "']");
                var owerAffiliation = baseDiv.attr('data-affiliation');
                if (undefined != memberDataId) {
                    //获取群列表成员
                    var rosterList = dialogPanel.getRoomRosterList(roomId);
                    //添加群成员列表
                    dialogPanel.setDataRoom(owerAffiliation, rosterList, jidRoom);
                }
            }
        }
    },
    //关闭主页面，随之关闭所有窗口
    closeAllWin: function () {
        if (Ext.panelHtmlStore != null) {
            var len = Ext.panelHtmlStore.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var win = Ext.panelHtmlStore[i];
                    if (null != win && undefined != win) {
                        var winValue = win.winValue;
                        if (undefined != winValue && winValue != null || !winValue.closed) {
                            winValue.close();
                            //从数据库里面移除窗口数据
                            //Ext.panelHtmlStore.splice(i,1);
                        }
                    }
                }
            }
        }
        ;
        //关闭个人资料窗口
        if (Ext.myDetailPanel != null) {
            Ext.myDetailPanel.close();
        }
        ;
        //关闭聊天窗口
        if (Ext.dialogPanel != null) {
            Ext.dialogPanel.close();
        }
        ;
        //关闭搜索窗口
        if (Ext.searchUserPanel != null) {
            Ext.searchUserPanel.close();
        }
        ;
        //关闭公告窗口
        if (Ext.noticePanel != null) {
            Ext.noticePanel.close();
        }
        ;
        //关闭bomc窗口
        if (Ext.bomcMain != null) {
            Ext.bomcMain.close();
        }
    },
    //消息内容显示
    addMsgShow: function (data) {
        var dialogPanel = Ext.dialogPanel;
        var jid = data.jid;
        var type = data.type;
        if ('chat' == type) {
            var lia = dialogPanel.find("#IMiframe").contents().find(".tabs-list li[data-id='" + jid + "']");
            var ss = lia.attr('data-id');
            if (null != ss && undefined != ss) {
                //显示在对话框
                var date = data.date;
                var from = data.from;
                var text = data.text;
                text = HtmlDecode(text);
                var resource = data.resource;
                var ulid = 'ul' + jid;
                var ul = dialogPanel.find("#IMiframe").contents().find(".record-list[data-id='" + ulid + "']");
                //创建li
                var color = '';
                if (resource == 'from') {
                    color = 'record-blue';
                } else {
                    color = 'record-green';
                }
                ;
                //var dialogContent=dialogPanel.find("#IMiframe").contents().find(".record-list[data-id='"+ulid+"']");
                var li = $('<li></li>', {'class': color});
                ul.append(li);
                //var li =  dialogPanel.find("#IMiframe").contents().append('<li></li>', {'class': color});
                //创建<h>
                var html = jid.substring(0, jid.indexOf('@')) + '   [<span class="record-time">' + date + '</span>]';
                var h4 = $('<h4></h4>').html(html);
                //创建p
                //console.log(text);
                var p = $('<p></p>').html(text);
                p.css({"word-break": "break-all"});
                li.append(h4);
                li.append(p);
                ul.append(li);
                //设置聊天记录置最底部
                var recordDiv = ul.parent();
                var ulHeight = ul.height();
                recordDiv.scrollTop(ulHeight);
                //Ext.sendMessage(jid, Ext.bare_jid, 'm1_feedback_msg@@@sitech-oncon@@@v1.0');//窗口最小化时“即时消息”跳动
                var imModalChat = $(".modal-dialog");
                clearInterval(jump);   //停止跳动
                if (imModalChat.is(":visible")) {
                    jump = clearInterval(jump);  //停止跳动
                } else {
                    //接收消息跳动
                    var msgJump = $(".msg-jump");
                    jump = setInterval(function () {
                        if (msgJump.is(":visible")) {
                            msgJump.hide();
                        } else {
                            msgJump.show();
                        }
                    }, 500)
                }
            } else {
                //添加数据到msgBox,好友名或房间名跳动
                Ext.webIM.addMsgBoxData(data);
            }
        } else if ('groupchat' == type) {
            //alert(jidRoom+"**************");
            //alert('jidRoom--hahha:'+jidRoom);
            var lia = dialogPanel.find("#IMiframe").contents().find(".tabs-list li[data-id='" + jid + "']");
            var ss = lia.attr('data-id');
            if (null != ss && undefined != ss) {
                //获取数据
                var date = data.date;
                var from = data.from;
                var text = data.text;
                var id = data.id;
                text = HtmlDecode(text);
                var resource = data.resource;
                //text = HtmlDecode(text);
                var ul = dialogPanel.find("#IMiframe").contents().find(".record-list[data-id='" + "ul" + jid + "']");
                //var nickName = Ext.webIM.getRoomRosterNickName(dialogPanel, from, jidRoom);
                //if (null != nickName && undefined != nickName && '' != nickName) {
                //    from = nickName;
                //}
                var color = '';
                if (resource == 'from') {
                    color = 'record-blue';
                } else {
                    color = 'record-green';
                }
                ;
                //创建li
                var li = $('<li></li>', {'class': color});
                var html = id + '   [<span class="record-time">' + date + '</span>]';
                var h4 = $('<h4></h4>').html(html);
                //创建p
                var p = $('<p></p>').html(text);
                console.log(text);
                p.css({"word-break": "break-all"});
                li.append(h4);
                li.append(p);
                ul.append(li);
                //设置聊天记录置最底部
                var recordDiv = ul.parent();
                var ulHeight = ul.height();
                recordDiv.scrollTop(ulHeight);
                //窗口最小化时“即时消息”跳动
                var imModalChat = $(".modal-dialog");
                clearInterval(jump);   //停止跳动
                if (imModalChat.is(":visible")) {
                    jump = clearInterval(jump);  //停止跳动
                } else {
                    //接收消息跳动
                    var msgJump = $(".msg-jump");
                    jump = setInterval(function () {
                        if (msgJump.is(":visible")) {
                            msgJump.hide();
                        } else {
                            msgJump.show();
                        }
                    }, 500)
                }
            } else {
                //添加数据到msgBox,好友名或房间名跳动
                Ext.webIM.addMsgBoxData(data);
            }
        } else if ('tempchat' == type) {
            var lia = dialogPanel.$(".tabs-list li[data-id='" + jid + "']");
            var ss = lia.attr('data-id');
            if (null != ss && undefined != ss) {
                //显示在对话框
                var date = data.date;
                var from = data.from
                var text = data.text
                text = HtmlDecode(text);
                var resource = data.resource;
                var ulid = 'ul' + jid;
                var ul = dialogPanel.$(".record-list[data-id='" + ulid + "']");
                //创建li
                var color = '';
                if (resource == 'from') {
                    color = 'record-blue';
                } else {
                    color = 'record-green';
                }
                ;
                var li = dialogPanel.$('<li></li>', {'class': color});
                //创建<h>
                var html = from + '   [<span class="record-time">' + date + '</span>]';
                var h4 = dialogPanel.$('<h4></h4>').html(html);
                //创建p
                var p = dialogPanel.$('<p></p>').html(text);
                p.css({"word-break": "break-all"});
                li.append(h4);
                li.append(p);
                ul.append(li);
                //设置聊天记录置最底部
                var recordDiv = ul.parent();
                var ulHeight = ul.height();
                recordDiv.scrollTop(ulHeight);
                //窗口最小化时“即时消息”跳动
                var imModalChat = $(".modal-dialog");
                clearInterval(jump);   //停止跳动
                if (imModalChat.is(":visible")) {
                    jump = clearInterval(jump);  //停止跳动
                } else {
                    //接收消息跳动
                    var msgJump = $(".msg-jump");
                    jump = setInterval(function () {
                        if (msgJump.is(":visible")) {
                            msgJump.hide();
                        } else {
                            msgJump.show();
                        }
                    }, 500)
                }
                ////获取p标签下的a标签
            } else {

                //添加数据到msgBox,好友名或房间名跳动
                Ext.webIM.addMsgBoxData(data);
            }
        }
    },
    //临时消息添加（用于显示登录后消息）
    tempMsgStoreAdd: function (data) {
        var dialogPanel = Ext.dialogPanel;
        if (undefined != dialogPanel && null != dialogPanel && !dialogPanel.closed && !dialogPanel.is(":hidden")) {
            Ext.webIM.addMsgShow(data);
        } else {
            //窗口最小化时“即时消息”跳动
            var imModalChat = $(".modal-dialog");
            clearInterval(jump);   //停止跳动
            if (imModalChat.is(":visible")) {
                jump = clearInterval(jump);  //停止跳动
            } else {
                //接收消息跳动alert("可见");
                var msgJump = $(".msg-jump");
                jump = setInterval(function () {
                    if (msgJump.is(":visible")) {
                        msgJump.hide();
                    } else {
                        msgJump.show();
                    }
                }, 500)
            }
            //添加数据到msgBox,好友名或房间名跳动
            Ext.webIM.addMsgBoxData(data);
        }
        ;
        //添加数据到显示内容数据中
        Ext.tempMsgStore.push(data);
    },
    //通过jid和消息类型type 查询消息记录
    getTempMsgStore: function (jid, type) {
        var msgStore = Ext.tempMsgStore;
        var len = msgStore.length;
        var tempArray = [];
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var newType = msgStore[i].type;
                var newJid = msgStore[i].jid;
                if (type == newType && jid == newJid) {
                    tempArray.push(msgStore[i]);
                }
            }
            ;
            return tempArray;
        } else {
            return tempArray;
        }
    },
    //添加数据到msgbox，好友名称或房间名跳动
    addTempMsgBox: function (data) {
        var flag = true;
        var jid = data.jid;
        var type = data.type;
        var msgBox = Ext.tempMsgBox;
        var len = msgBox.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var newJid = msgBox[i].jid;
                var newType = msgBox[i].type;
                if (jid == newJid && type == newType) {
                    flag = false;
                    break;
                }
            }
            ;
            if (flag) {
                Ext.tempMsgBox.push(data);
            }
        } else {
            Ext.tempMsgBox.push(data);
        }
    },
    //添加数据到msgBox
    addMsgBoxData: function (data) {
        var type = data.type;
        var flag = false;
        var len = Ext.tempMsgBox.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var newData = Ext.tempMsgBox[i];
                if ('chat' == type) {
                    var jid = data.jid;
                    var newJid = newData.jid;
                    var newType = newData.type;
                    if ('chat' == newType && newJid == jid) {
                        flag = true;
                    }
                } else if ('groupchat' == type) {
                    var jid = data.jid;
                    var newJid = newData.jid;
                    var newType = newData.type;
                    var delay = data.delay;
                    var text = data.text;
                    if (!delay || text == '该房间不是匿名的。' || text == '确认配置之前已锁住该房间，禁止进入。' || text == '该房间现在已解锁。') {
                        return true;
                    }
                    ;
                    if (text == '该房间现在已解锁。') {
                        return true;
                    }
                    ;
                    if ('groupchat' == newType && newJid == jid) {
                        flag = true;
                    }
                } else if ('tempchat' == type) {
                    var jid = data.jid;
                    var newJid = newData.jid;
                    var newType = newData.type;
                    if ('tempchat' == newType && newJid == jid) {
                        flag = true;
                    }
                }
            }
            ;
        } else {
            if ('groupchat' == type) {
                var text = data.text;
                var delay = data.delay;
                //if (delay || text == '该房间不是匿名的。' || text == '确认配置之前已锁住该房间，禁止进入。' || text == '该房间现在已解锁。') {
                if (text == '该房间不是匿名的。' || text == '确认配置之前已锁住该房间，禁止进入。' || text == '该房间现在已解锁。') {
                    return true;
                }
                ;
                if (text == '该房间现在已解锁。') {
                    return true;
                }
                ;
            }
        }
        ;
        if (flag == false) {
            Ext.webIM.addMsgBoxAction(data);
        }
        ;
    },
    //添加数据到msgbox,后续操作
    addMsgBoxAction: function (data) {
        var type = data.type;
        if (type == 'chat') {
            var jid = data.jid;
            var jidSrc = jid + 'src';
            var jidText = jid + 'text';
            var img = $("img[data-id='" + jidSrc + "']");
            var p = $("p[data-id='" + jidText + "']");
            var imgSrc = img.attr('src');
            var name = p.text();
            var intervalId = setInterval(function () {
                //设置好友名称
                if (p.text() == name) {
                    p.text('');
                } else {
                    p.text(name);
                }
                ;
            }, 500);
            data.intervalId = intervalId;
            data.name = name;
            Ext.tempMsgBox.push(data);
            var titleFlag = false;
            var len = Ext.tempMsgBox.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var newData = Ext.tempMsgBox[i];
                    var newType = newData.type;
                    if ('title' == newType) {
                        titleFlag = true;
                        break;
                    }
                }
            }
            ;
            if (titleFlag == false) {
                var data = {type: 'title'};
                Ext.webIM.addMsgBoxAction(data);
            }
        } else if (type == 'title') {
            //如果小喇叭为跳动再跳动HelloKitty图标
            //alert("Ext.webIM.interval:"+Ext.webIM.interval);
            //if (Ext.webIM.interval == 0) {
            //    //helloKit 图标跳动
            //    var intervalId = setInterval(function () {
            //        var tray = Ext.tray;
            //        if (tray.icon == 'resources/images/icon-mainIcon.png') {
            //            tray.icon = 'resources/images/icon-no-image.png'
            //        } else {
            //            tray.icon = 'resources/images/icon-mainIcon.png'
            //        }
            //    }, 500);
            //    data.intervalId = intervalId;
            //    Ext.tempMsgBox.push(data);
            //}
            //;
        } else if (type == 'groupchat') {
            var jid = data.jid;
            var p = $("p[data-id='" + jid + "']");
            var name = p.text();
            var intervalId = setInterval(function () {
                if (p.text() == '') {
                    p.text(name);
                } else {
                    p.text('');
                }
            }, 500);
            data.intervalId = intervalId;
            data.name = name;
            Ext.tempMsgBox.push(data);
            var titleFlag = false;
            var len = Ext.tempMsgBox.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var newData = Ext.tempMsgBox[i];
                    var newType = newData.type;
                    if ('title' == newType) {
                        titleFlag = true;
                        break;
                    }
                }
            }
            ;
            if (titleFlag == false) {
                var data = {type: 'title'};
                Ext.webIM.addMsgBoxAction(data);
            }
        } else if ('tempchat' == type) {
            var titleFlag = false;
            Ext.tempMsgBox.push(data);
            var len = Ext.tempMsgBox.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    var newData = Ext.tempMsgBox[i];
                    var newType = newData.type;
                    if ('title' == newType) {
                        titleFlag = true;
                        break;
                    }
                }
            }
            ;
            if (titleFlag == false) {
                var data = {type: 'title'};
                Ext.webIM.addMsgBoxAction(data);
            }
        }
    },
    //从msgbox移除数据,后续操作
    delMsgBoxAction: function (type, other) {
        var data = Ext.webIM.getTempMsgData(type, other);
        var msgBox = Ext.tempMsgBox;
        var len = msgBox.length;
        if (undefined != data && null != data && '' != data) {
            var intervalId = data.intervalId;
            if (len > 0) {
                var type = data.type;
                if ('chat' == type) {
                    //clearInterval(intervalId);
                    var jid = data.jid;
                    var jidText = jid + 'text';
                    var name = data.name;
                    clearInterval(intervalId);
                    var p = $(".item-media p[data-id='" + jidText + "']");
                    p.text(name);
                    var flag = true;
                    var title = '';
                    //删除数据
                    for (var i = 0; i < Ext.tempMsgBox.length; i++) {
                        var newData = Ext.tempMsgBox[i];
                        var newJid = newData.jid;
                        var newType = newData.type;
                        if (newJid == jid && 'chat' == newType) {
                            Ext.tempMsgBox.splice(i, 1);
                            break;
                        }
                    }
                    ;
                    //判断是否还存在type=chat的数据
                    for (var i = 0; i < Ext.tempMsgBox.length; i++) {
                        var newData = Ext.tempMsgBox[i];
                        var newType = newData.type;
                        if (newType == 'title') {
                            title = 'title';
                        }
                    }
                    ;
                    var boxLen = Ext.tempMsgBox.length;
                    if (boxLen == 1 && 'title' == title) {
                        Ext.webIM.delMsgBoxAction('title', 'other');
                    }
                } else if ('groupchat' == type) {
                    //clearInterval(intervalId);
                    var jid = data.jid;
                    var name = data.name;
                    clearInterval(intervalId);
                    var p = $(".item-media p[data-id='" + jid + "']");
                    p.text(name);
                    var flag = true;
                    var title = '';
                    //删除数据
                    for (var i = 0; i < Ext.tempMsgBox.length; i++) {
                        var newData = Ext.tempMsgBox[i];
                        var newJid = newData.jid;
                        var newType = newData.type;
                        if (newJid == jid && 'groupchat' == newType) {
                            Ext.tempMsgBox.splice(i, 1);
                            break;
                        }
                    }
                    ;
                    //判断是否还存在type=chat的数据
                    for (var i = 0; i < Ext.tempMsgBox.length; i++) {
                        var newData = Ext.tempMsgBox[i];
                        var newType = newData.type;
                        if (newType == 'title') {
                            title = 'title';
                        }
                    }
                    ;
                    var boxLen = Ext.tempMsgBox.length;
                    if (boxLen == 1 && 'title' == title) {
                        Ext.webIM.delMsgBoxAction('title', 'other');
                    }
                } else if (type == 'title') {
                    Ext.tempMsgBox.splice(0, 1);
                    clearInterval(intervalId);
                    var tray = Ext.tray;
                    tray.icon = 'resources/images/icon-mainIcon.png';
                } else if ('tempchat' == type) {
                    var jid = data.jid;
                    var flag = true;
                    var title = '';
                    //删除数据
                    for (var i = 0; i < Ext.tempMsgBox.length; i++) {
                        var newData = Ext.tempMsgBox[i];
                        var newJid = newData.jid;
                        var newType = newData.type;
                        if (newJid == jid && 'tempchat' == newType) {
                            Ext.tempMsgBox.splice(i, 1);
                            break;
                        }
                    }
                    ;
                    //判断是否还存在type=chat的数据
                    for (var i = 0; i < Ext.tempMsgBox.length; i++) {
                        var newData = Ext.tempMsgBox[i];
                        var newType = newData.type;
                        if (newType == 'title') {
                            title = 'title';
                        }
                    }
                    ;
                    var boxLen = Ext.tempMsgBox.length;
                    //alert(boxLen+'--'+title);
                    if (boxLen == 1 && 'title' == title) {
                        Ext.webIM.delMsgBoxAction('title', 'other');
                    }
                }
            } else {
                clearInterval(intervalId);
                var tray = Ext.tray;
                tray.icon = 'resources/images/icon-mainIcon.png';
            }
        } else {
            return;
        }
    },
    //通过type获取tempMsgBox里面的数据
    getTempMsgData: function (type, other) {
        var tempMsgBox = Ext.tempMsgBox;
        var len = tempMsgBox.length;
        if ('chat' == type) {
            var jid = other;
            for (var i = 0; i < len; i++) {
                var data = tempMsgBox[i];
                var newJid = data.jid;
                var newType = data.type;
                if (jid == newJid && 'chat' == newType) {
                    return data;
                }
            }
        } else if ('groupchat' == type) {
            var jid = other;
            for (var i = 0; i < len; i++) {
                var data = tempMsgBox[i];
                var newJid = data.jid;
                var newType = data.type;
                if (jid == newJid && 'groupchat' == newType) {
                    return data;
                }
            }
        } else if ('title' == type) {
            for (var i = 0; i < len; i++) {
                var data = tempMsgBox[i];
                var newType = data.type
                if ('title' == newType) {
                    return data;
                }
            }
        } else if ('tempchat' == type) {
            var jid = other;
            for (var i = 0; i < len; i++) {
                var data = tempMsgBox[i];
                var newJid = data.jid;
                var newType = data.type;
                if (jid == newJid && 'tempchat' == newType) {
                    return data;
                }
            }
        }
    },
    //房间消息接收时，通过jid获取房间成员列表的昵称
    getRoomRosterNickName: function (dialogPanel, jid, jidRoom) {
        var name = null;
        var baseDiv = dialogPanel.$("div[data-id='" + jidRoom + "']");
        var nickName = baseDiv.find(".member a[data-id='" + jid + "']").text();
        if (undefined != nickName && null != nickName && '' != nickName) {
            name = nickName;
        }
        ;
        return name;
    },
    //添加数据到messageSysStore数组中
    addMsgSysStore: function (data) {
        Ext.messageSysStore.push(data);
        //首先停止聊天消息接收时HelloKitty跳动
        Ext.webIM.stopHelloKitty();
        //消息喇叭跳动
        if (Ext.webIM.interval == 0) {
            Ext.webIM.beginJump();
        }
    },
    //messageSysStore移除第一个数据
    removeMsgSysStore: function () {
        //公告消息数组
        var noticeMsg = Ext.noticeMsgBox;
        var noticeMsgLen = noticeMsg.length;
        //系统消息数组
        var SysMsg = Ext.messageSysStore;
        var SysMsgLen = SysMsg.length;
        //普通聊天消息数组
        var msgBox = Ext.tempMsgBox;
        var msgBoxLen = msgBox.length;
        if (SysMsgLen > 0) {

            //移除系统消息数组第一个元素
            Ext.messageSysStore.splice(0, 1);
            var newLen = Ext.messageSysStore.length;
            if (newLen == 0 && noticeMsgLen == 0) {
                Ext.webIM.stopJump();
                Ext.webIM.jumpHelloKitty();
            }
        } else {
            if (noticeMsgLen == 0) {
                Ext.webIM.stopJump();
                Ext.webIM.jumpHelloKitty();
            }
        }
    },
    //群聊时，点击成员，判断是否为好友
    checkFriend: function (jid) {
        var array = new Array();
        var li = $(".item-lists li[data-id='" + jid + "']");
        var data_id = li.attr('data-id');
        if (undefined != data_id && null != data_id && '' != data_id) {
            var text = li.attr('data-text');
            array[0] = data_id;
            array[1] = text;
        }
        ;
        return array;
    },
    //群好友列表双击事件
    friendBblclick: function (newLi) {
        var dialogPanel = Ext.dialogPanel;
        if (undefined == dialogPanel || dialogPanel == null || dialogPanel.closed) {
        } else {
            newLi.find('a').unbind().bind('dblclick', function () {
                //获取群好友jid
                var jid = $(this).parent().attr('data-id');
                //获取昵称
                var text = $(this).text();
                if (Ext.bare_jid == jid) {
                    return;
                }
                ;
                dialogPanel.gui.Window.get().show();
                dialogPanel.gui.Window.get().focus();
                var array = Ext.webIM.checkFriend(jid);
                //该群好友是自己的好友
                if (array.length > 0) {
                    var name = array[1];
                    var li = dialogPanel.$(".tabs-list li[data-id='" + jid + "']");
                    var data_id = li.attr('data-id');
                    if (undefined == data_id || null == data_id) {
                        dialogPanel.initUserWin(jid, name);
                    } else {
                        dialogPanel.setTabLiAc(jid);
                        dialogPanel.setDialogDiv(jid);
                    }
                } else {//该群好友不是自己好友
                    var li = dialogPanel.$(".tabs-list li[data-id='" + jid + "']");
                    var data_id = li.attr('data-id');
                    if (undefined == data_id || null == data_id) {
                        dialogPanel.initTempUserWin(jid, text);
                    } else {
                        dialogPanel.setTabLiAc(jid);
                        dialogPanel.setDialogDiv(jid);
                    }
                }
            });
        }
    },
    //sleep方法
    sleep: function (numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    },
    //好友添加请求
    msgAddFriendTip: function (jid) {
        //申请进入群
        var id = 'msgAddFriend';
        var title = '好友添加请求';
        var msg = jid + '请求添加您为好友！';
        //设置参数数组
        var parames = [jid, id];
        //设置提示窗口内容
        setConfirmTip(title, msg, '添加', '拒绝', 'msgAddFriend', parames);
        dialog({
            id: id,
            title: null,
            content: document.getElementById('confirmTips'),
            padding: 0,
            width: 250
        }).showModal();
        /*art.dialog({
         title:title,
         content:msg,
         okValue: '添加',
         cancelValue: '拒绝',
         ok: function () {
         //同意
         var subscribed = $pres({to:jid,type:'subscribed'});
         Ext.connection.send(subscribed.tree());
         //反向订阅对方为好友且必须同意
         var subAdd = $pres({to:jid,type:'subscribe',id:'mustAdd'});
         Ext.connection.send(subAdd.tree());
         Ext.webIM.removeMsgSysStore();
         },
         cancel: function () {
         //拒绝
         var unsubscribed = $pres({to:jid,type:'unsubscribed'});
         Ext.connection.send(unsubscribed.tree());
         Ext.webIM.removeMsgSysStore();
         }
         });*/
    },
    //登录成功后，重新设置面板高度及位置
    resizeTo: function () {
        var win = Ext.gui.Window.get();
        var loginPanel = $("#loginPanel");
        //重新连接
        if (loginPanel.is(':hidden')) {
            //不进行其他操作
        } else {//登录
            //隐藏登录窗口，显示主面板
            $("#loginPanel").css("display", "none");
            $("#userPanel").css("display", "block");
            //设定主面板宽度及高度
            win.resizeTo(280, 600);
            //win.resizeTo(280, 700);
            var height = screen.availHeight - 600;
            var width = screen.availWidth - 280;
            //设置主面板显示位置
            Ext.gui.Window.get().x = width;
            Ext.gui.Window.get().y = height;
        }
    },
    //新增指定名称menu按钮
    addTrayMenu: function (trayMenu, menuName) {
        //先删除
        Ext.webIM.removeTrayMenu(trayMenu, menuName);
        //添加
        var newMenu = new Ext.gui.MenuItem({
            label: "重新连接",
            click: function () {
                Ext.webIM.setTrayMenuOpt(menuName);
            }
        });
        var index = trayMenu.items.length - 1;
        trayMenu.insert(newMenu, index);
    },
    //根据名称设置menu按钮操作
    setTrayMenuOpt: function (menuName) {
        if ('重新连接' == menuName) {
            if (!Ext.loginStatus) {
                loginWebIM();
            } else {
                return false;
            }
        }
    },
    //删除指定名称menu按钮
    removeTrayMenu: function (trayMenu, menuName) {
        var len = trayMenu.items.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var menuItem = trayMenu.items[i];
                if (undefined != menuItem) {
                    var text = menuItem.label;
                    if (undefined != text && menuName == text) {
                        //删除重新登录
                        trayMenu.remove(menuItem);
                    }
                }
            }
        }
    },
    //收到文件消息添加图片样式
    setFileMsgPic: function (obj, html) {
        var fileId = obj.attr('data-fileid');
        var fname = obj.text();
        var fnameStr = Ext.webIM.opConStr(fname, 34);
        var fsize = obj.attr('data-fsize');
        var transfer = $("<div></div>", {'class': 'transfer', 'data-fileid': fileId, 'title': fname});
        var transferTop = $("<div></div>", {'class': 'transfer-top'}).appendTo(transfer);
        var transferTop1 = $("<div></div>", {
            'class': 'success-bg bg-container float-left',
            'data-fileid': fileId
        }).appendTo(transferTop);
        var transferTop2 = $("<div></div>", {'class': 'transfer-top-content float-left'}).appendTo(transferTop);
        var transferFileName = $("<div></div>", {text: fnameStr}).appendTo(transferTop2);
        var transferFileSize = $("<div></div>", {text: fsize}).appendTo(transferTop2);
        var clearfix1 = $("<div></div>", {'class': 'clearfix'}).appendTo(transfer);
        var transfer_line = $("<div></div>", {'class': 'transfer-line'}).appendTo(transfer);
        var transfer_line_already = $("<div></div>", {
            'class': 'transfer-line-already',
            'width': '100%'
        }).appendTo(transfer_line);
        var transfer_footer = $("<div></div>", {'class': 'transfer-footer-success'}).appendTo(transfer);
        var span = $("<span></span>", {text: '已发送'}).appendTo(transfer_footer);
        transfer_footer.append(html);
        transfer_footer.find('a').text('下载');
        var clearfix2 = $("<div></div>", {'class': 'clearfix'}).appendTo(transfer);
        return transfer;
    },
    //计算字符串长度
    getStrLen: function (val) {
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            if (val[i].match(/[^x00-xff]/ig) != null) //全角
                len += 2;
            else
                len += 1;
        }
        ;
        return len;
    },
    //content内容处理
    opConStr: function (val, num) {
        var len = 0;
        var index = 0;
        var subStr = '';
        for (var i = 0; i < val.length; i++) {
            var char = val.charCodeAt(i);
            if (char > 255) {
                len += 2;
            } else {
                len += 1;
            }
            ;
            if (len >= num) {
                index = i;
                break;
            }
            ;
        }
        ;
        if (index > 0) {
            subStr = val.substring(0, index) + '...';
        } else {
            subStr = val;
        }
        ;
        return subStr;
    },
    //登录成功设置HelloKitty显示
    setTraytip: function (type) {
        var tray = Ext.tray;
        var trayMenu = tray.menu;
        var username = Ext.userName;
        var name = Ext.nickName;
        var text = username + '(' + name + ')';
        if ('online' == type) {
            //设置HelloKitty显示
            tray.tooltip = '4A:' + text + '\r\n状态:在线\r\n提示:点击显示主窗口';
            //删除"重新登录"
            Ext.webIM.removeTrayMenu(trayMenu, '重新连接');
        } else if ('offline' == type) {
            //设置HelloKitty显示
            tray.tooltip = '4A:' + text + '\r\n状态:离线\r\n提示:点击显示主窗口';
            //添加重新登录
            Ext.webIM.addTrayMenu(trayMenu, '重新连接');
        }
        ;
    },
    //登录失败后续操作
    loginFailure: function () {
        Ext.loginStatus = false;
        //移除登录按钮不可点击
        $('#submit').removeAttr('disabled');
        var id = 'loginAlert';
        var parames = ['4A账号或密码输入错误，请重新输入！', '确定'];
        createAlertTip(parames, id);
    },
    //登录成功后续操作
    loginSuccess: function () {
        Ext.loginStatus = true;
        Ext.tray.icon = 'resources/images/icon-mainIcon.png';
        Ext.onConnected();
        var mydialog = dialog.get("offlineTip");
        if (mydialog) {
            mydialog.close().remove();
        }
    },
    //掉线后续操作
    connOffline: function () {
        Ext.loginStatus = false;
        Ext.tray.icon = 'resources/images/offlineIcon.png';
        var id = 'offlineTip';
        createOfflineTip(id);
        //设置HelloKitty提示
        Ext.webIM.setTraytip('offline');
    },
    //好友上线、离线改变聊天对话框图标
    changeDialogfriendStatus: function (jid, type) {
        var dialogPanel = Ext.dialogPanel;
        if (undefined == dialogPanel || dialogPanel == null || dialogPanel.closed) {
            return;
        } else {
            var li = dialogPanel.$("#tabs-list-wrap li[data-id='" + jid + "']");
            if (li.length > 0) {
                if ('online' == type) {
                    li.removeClass('tabs-list-wrap-li-chat-offline');
                    li.addClass('tabs-list-wrap-li-chat-online');
                } else if ('offline' == type) {
                    li.removeClass('tabs-list-wrap-li-chat-online');
                    li.addClass('tabs-list-wrap-li-chat-offline');
                }
            }
        }
    }
};





