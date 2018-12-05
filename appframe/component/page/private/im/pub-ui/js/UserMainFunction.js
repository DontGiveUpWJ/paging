Ext = window.parent.Ext;

//修改窗口样式
function changeAndIFrameSkin(mainSkin, win, type) {
    //获取子窗口页面皮肤样式
    var winSkin = '';
    if ('window' == type) {
        winSkin = win.$("#link-skin").attr("href")
    } else if ('iframe' == type) {
        winSkin = $(win).contents().find("#link-skin").attr('href');
    }
    ;
    if ('' != winSkin && undefined != winSkin && null != winSkin) {
        //若和主页面不同，修改皮肤样式
        if (winSkin.indexOf(mainSkin) <= 0) {
            var skin = mainSkin.split('/')[2];
            var winSkinNow = null;
            //alert(skin);
            if (skin == 'skin1') {
                winSkinNow = winSkin.replace("skin2", "skin1");
            } else if (skin == 'skin2') {
                winSkinNow = winSkin.replace("skin1", "skin2");
            }
            ;
            if (null != winSkinNow) {
                if ('window' == type) {
                    win.changeCurrentSkin(winSkinNow);
                } else {
                    win.contentWindow.changeCurrentSkin(winSkinNow);
                }
            }
        }
        ;
    }
    ;
};
//修改存放在panelHtmlStore里面的窗口样式
function changeChildSkinStore() {
    var len = Ext.panelHtmlStore.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var win = Ext.panelHtmlStore[i];
            var winValue = win.winValue;
            if (undefined != winValue && winValue != null || !winValue.closed) {
                changeChildWinSkin(winValue);
            }
        }
    }
};
//修改子窗口样式
function changeChildWinSkin(win) {
    //获取当前聊天窗口样式
    var currentSkin = $("#link-skin").attr("href");
    //获取子窗口样式
    var childWinSkin = win.$("#link-skin").attr('href');
    var skin = null;
    var Skins = currentSkin.split('../');
    var len = Skins.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var str = Skins[i];
            if (str.indexOf('skin1') > 0 || str.indexOf('skin2') > 0) {
                skin = str.split('/')[2];
            }
        }
    }
    ;
    if (null != skin) {
        if (skin == 'skin1') {
            childWinSkin = childWinSkin.replace("skin2", "skin1");
        } else if (skin == 'skin2') {
            childWinSkin = childWinSkin.replace("skin1", "skin2");
        }
        ;
        win.$("#link-skin").attr("href", childWinSkin);
    }
};
//创建群点击实现方法
function createRoomFun() {
    var id = 'createRoom';
    createRoomTip(id);
    //邀请入群操作
    dialog({
        id: id,
        title: null,
        content: document.getElementById('createRoomTip'),
        padding: 0,
        width: 250
    }).showModal();
    /*art.dialog({
     title: '创建群',
     lock: true,
     content: '群名称:   <input type="text" id="RoomName"/>',
     okValue: '创建',
     cancelValue: '取消',
     ok: function () {
     var RoomName = document.getElementById('RoomName');
     var value = RoomName.value;
     if(''==value){
     join4A.focus();
     this.shake();
     return false;
     }else{
     createRoom(value,value);
     }
     },
     cancel: function () {
     }
     });	*/
};
//创建群
function createRoom(roomId, roomNickName) {
    //检测群是否已存在
    var found = checkRoomExist(roomId, roomNickName);
    if (found) {
        alert('群名称已存在!');
    } else {
        var to = roomId + Ext.room_suffix + "/" + roomNickName;
        var data = $pres({from: Ext.bare_jid, to: to, id: 'create'});
        data.c('x', {xmlns: Strophe.NS.MUC});
        Ext.connection.send(data.tree());
    }
};
//通过ajax创建群检测群是否存在
function checkRoomExist(roomId, roomNickName) {
    var found = false;
    var url = Ext.service_plugin_url + 'myroom/searchroom';
    var dataParam = "name=" + roomId + "&start=0" + "&limit=10";
    $.ajax({
        type: 'POST',
        url: url,
        async: false,
        data: dataParam,
        dataType: 'json',
        success: function (resp, option) {
            if (resp.length != 0) {
                var rows = resp.rows;
                var len = rows.length;
                for (var i = 0; i < len; i++) {
                    var data = rows[i];
                    if (data.name == roomId) {
                        found = true;
                        break;
                    }
                }
            }
        },
        error: function (resp) {
            alert('查询数据失败!');
        }
    });
    return found;
};
//设置确认提示窗口内容
function setConfirmTip(title, content, ok, canel, type, parames) {
    //设置提示窗口内容
    $('#confirmTitle').text(title);
    $("#confirmContent").text(content);
    $("#confirm-dialog-btn-ok").text(ok);
    $("#confirm-dialog-btn-cancel").text(canel);
    //设置点击事件促发方法
    //申请入群
    if ('applyToRoom' == type) {
        confirmApplyToRoom(parames);
    } else if ('msgAddFriend' == type) {//添加好友
        addFriendMsg(parames)
    } else if ('quitRoomTip' == type) {//退出群
        quitRoomTip(parames);
    } else if ('dissolveRoomTip' == type) {//解散群
        dissolveRoomTip(parames);
    } else if ('invitedRoomTip' == type) {//邀请加入群
        invitedRoomTip(parames);
    }
};
//邀请加入群
function invitedRoomTip(parames) {
    //获取参数
    var roomId = parames[0];
    var id = parames[1];
    var data = parames[2];
    //确定点击事件
    $("#confirm-dialog-btn-ok").unbind().bind('click', function () {
        var msg = '0[-]' + roomId;
        data.c('body', null, msg);
        Ext.connection.send(data.tree());
        Ext.webIM.removeMsgSysStore();
        //删除提示框
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //取消点击事件
    $("#confirm-dialog-btn-cancel").unbind().bind('click', function () {
        var roomName = roomId.split('@')[0];
        var msg = '1[-]' + Ext.nickName + '拒绝加入“' + roomName + '”群';
        data.c('body', null, msg);
        Ext.connection.send(data.tree());
        Ext.webIM.removeMsgSysStore();
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#confirmBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
//解散群
function dissolveRoomTip(parames) {
    //获取参数
    var roomId = parames[0];
    var id = parames[1];
    //确定点击事件
    $("#confirm-dialog-btn-ok").unbind().bind('click', function () {
        var data = $iq({from: Ext.bare_jid, id: 'destroyroom', to: roomId + Ext.room_suffix, type: 'set'});
        data.c('query', {xmlns: 'http://jabber.org/protocol/muc#owner'});
        data.c('destroy');
        data.c('reason', null, '群【' + roomId + '】已被' + Ext.nickName + '删除！');
        Ext.connection.send(data.tree());
        //删除提示框
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //取消点击事件
    $("#confirm-dialog-btn-cancel").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#confirmBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
//退出群
function quitRoomTip(parames) {
    //获取参数
    var jid = parames[0];
    var affiliation = parames[1];
    var roomId = parames[2];
    var id = parames[3];
    //确定点击事件
    $("#confirm-dialog-btn-ok").unbind().bind('click', function () {
        //ajax 退出群
        var url = Ext.service_plugin_url + 'myroom/quitroom';
        var data = 'jid=' + jid + '&affiliation=' + affiliation + '&roomId=' + roomId + '&roomJID=' + roomId + Ext.room_suffix;
        $.ajax({
            type: 'POST',
            url: url,
            async: false,
            data: data,
            dataType: 'json',
            success: function (resp, option) {
                //退出群成功，发送群
            },
            error: function (resp) {
                alert('退出群失败！');
            }
        });
        //删除提示框
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //取消点击事件
    $("#confirm-dialog-btn-cancel").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#confirmBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
//添加好友处理
function addFriendMsg(parames) {
    //获取参数
    var jid = parames[0];
    var id = parames[1];
    //确定点击事件
    $("#confirm-dialog-btn-ok").unbind().bind('click', function () {
        //同意
        var subscribed = $pres({to: jid, type: 'subscribed'});
        Ext.connection.send(subscribed.tree());
        //反向订阅对方为好友且必须同意
        var subAdd = $pres({to: jid, type: 'subscribe', id: 'mustAdd'});
        Ext.connection.send(subAdd.tree());
        Ext.webIM.removeMsgSysStore();
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //取消点击事件
    $("#confirm-dialog-btn-cancel").unbind().bind('click', function () {
        //拒绝
        var unsubscribed = $pres({to: jid, type: 'unsubscribed'});
        Ext.connection.send(unsubscribed.tree());
        Ext.webIM.removeMsgSysStore();
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#confirmBtn-close").unbind().bind('click', function () {
        //Ext.webIM.removeMsgSysStore();
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
//申请入群处理
function confirmApplyToRoom(parames) {
    var roomId = parames[0];
    var jid = parames[1];
    var id = parames[2];
    //确定点击事件
    $("#confirm-dialog-btn-ok").unbind().bind('click', function () {
        var msg = roomId + Ext.room_suffix;
        Ext.webIM.giveRoomMember(msg, jid);
        var li = $("#room-lists li[data-id='" + roomId + "']");
        var naturalName = li.attr('data-text');
        if (undefined != naturalName) {
            var data = $msg({from: Ext.bare_jid, to: jid, id: 'joinInNow'});
            data.c('x', {xmlns: 'jabber:x:conference', jid: msg, reason: naturalName});
            Ext.connection.send(data.tree());
            Ext.webIM.removeMsgSysStore();
        }
        ;
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //取消点击事件
    $("#confirm-dialog-btn-cancel").unbind().bind('click', function () {
        //拒绝
        Ext.webIM.removeMsgSysStore();
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#confirmBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
//创建提示框
function createAlertTip(parames, id) {
    //设置提示框内容等
    setAlertTip(parames, id);
    dialog({
        id: id,
        title: null,
        content: document.getElementById('alertTip'),
        padding: 0,
        width: 250
    }).showModal();
};
//设置提示框内容等
function setAlertTip(parames, id) {
    var content = parames[0];
    var ok = parames[1];
    //设置提示窗口内容
    $("#artContent").text(content);
    $("#art-dialog-btn-ok").text(ok);
    //点击确定关闭
    $("#art-dialog-btn-ok").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //点击X关闭
    $("#artBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
//离线提示框
function createOfflineTip(id) {
    dialog({
        id: id,
        title: null,
        content: document.getElementById('offlineTips'),
        padding: 0,
        width: 250
    }).showModal();
    //重新连接点击事件
    $("#offline-dialog-btn-ok").unbind().bind('click', function () {
        //重新连接
        loginWebIM();
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //关闭点击事件
    $("#offline-dialog-btn-cancel").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#offlineBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};
function createRoomTip(id) {
    //确定点击事件
    $("#createRoom-btn-ok").unbind().bind('click', function () {
        var value = $("#createRoomName").val();
        if ('' == value) {
            $("#createRoomName").focus();
        } else {
            createRoom(value, value);
            var mydialog = dialog.get(id);
            if (mydialog) {
                mydialog.close().remove();
            }
        }
    });
    //取消点击事件
    $("#createRoom-btn-canel").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
    //X点击事件
    $("#createRoomBtn-close").unbind().bind('click', function () {
        var mydialog = dialog.get(id);
        if (mydialog) {
            mydialog.close().remove();
        }
    });
};