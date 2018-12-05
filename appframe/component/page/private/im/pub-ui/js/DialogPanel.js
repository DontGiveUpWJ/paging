var familyText;
var sizeText;
Ext = window.parent.Ext;
//房间窗口初始化
function initRoomWin(jid, text) {
    var affiliation = '';
    var li = $("#room-lists li[data-id='" + jid + "']");
    //根据jid创建群聊div
    var editor = createRoomDialogBody(jid);
    var rosterList = getRoomRosterList(jid);
    //添加群成员列表
    setDataRoom(rosterList, jid);
    var setGroupMemberList = function () {
        //获取房间成员列表
        var rosterList = getRoomRosterList(jid);
        //添加群成员列表
        setDataRoom(affiliation, rosterList, jid);
        //添加初始化群聊天内容
        addTempMsg(jid, 'groupchat');
    };
    //设置body显示
    setDialogDiv(jid);
    //左边tab li active
    setTabLiAc(jid);
    //设置聊天窗口标题
    setDialogTitle(text);
    //添加左边tab li
    createTabLi(jid, text, 'groupchat', editor);
    //添加群列表并显示
    var execqueue = new ExecQueue();
    execqueue.add(setGroupMemberList, [], 500);
    //异步执行
    execqueue.exec();
};
//初始化群聊天点击闪烁消息内容显示
function initroommsg(jid) {
    var execqueue = new ExecQueue();
    execqueue.add(addTempMsg, [jid, 'groupchat'], 500);
    //异步执行
    execqueue.exec();
}
//单聊窗口初始化
function initUserWin(jid, text) {
    //左边tab li active
    setTabLiAc(jid);
    //创建聊天body
    var editor = createDialogBody(jid, 'chat');
    //聊天记录初始化
    //addTempMsg(jid,'chat');
    //设置body显示
    setDialogDiv(jid);
    //设置聊天窗口标题
    setDialogTitle(jid);
    //添加左边tab li
    createTabLi(jid, text, 'chat', editor);
    /**
     * 异步执行步骤
     */
    var execqueue = new ExecQueue();
    //添加聊天记录初始化
    execqueue.add(addTempMsg, [jid, 'chat'], 500);
    //异步执行
    execqueue.exec();
};
// 点击闪烁初始化聊天 窗口内容
function initusermsg(jid) {
    var execqueue = new ExecQueue();
    //添加聊天记录初始化
    execqueue.add(addTempMsg, [jid, 'chat'], 500);
    //异步执行
    execqueue.exec();
}
//临时单聊窗口初始化
function initTempUserWin(jid, text) {
    //左边tab li active
    setTabLiAc(jid);
    //创建聊天body
    var editor = createDialogBody(jid, 'tempchat');
    //聊天记录初始化
    //addTempMsg(jid,'tempchat');
    //设置body显示
    setDialogDiv(jid);
    //设置聊天窗口标题
    setDialogTitle(text + '(临时会话)');
    //添加左边tab li
    createTabLi(jid, text, 'tempchat', editor);
    //var execqueue = new ExecQueue();
    ////添加聊天记录初始化
    //execqueue.add(addTempMsg, [jid, 'tempchat'], 500);
    ////异步执行
    //execqueue.exec();
};
//群聊时，点击成员，判断是否为好友
function checkFriend(jid) {
    var array = new Array();
    var li = opener.$(".item-lists li[data-id='" + jid + "']");
    var data_id = li.attr('data-id');
    if (undefined != data_id && null != data_id && '' != data_id) {
        var text = li.attr('data-text');
        array[0] = data_id;
        array[1] = text;
    }
    ;
    return array;
};
//生成左边聊天tab li
function createTabLi(jid, text, type, editor) {
    var liclass = 'tabs-list-wrap-li-chat-offline';
    if ('chat' == type) {
        //好友单聊,通过好友列表获取在线状态
        //liclass = 'tabs-list-wrap-li-chat-online';
        liclass = setLeftTabsLiClass(jid, type);
    } else if ('tempchat' == type) {
        //临时单聊,通过房间群成员获取在线状态
        liclass = setLeftTabsLiClass(jid, type);
    } else {
        //群聊天，直接设置样式
        liclass = setLeftTabsLiClass(jid, type);
    }
    ;
    var tabs_list = $(".tabs-list");
    //创建<li>
    var li = null;
    if ('tempchat' == type) {
        var newtext = text + '(临时会话)';
        li = $('<li></li>', {'class': liclass, 'data-id': jid, 'data-text': text, 'data-temptext': newtext});
    } else {
        li = $('<li></li>', {'class': liclass, 'data-id': jid, 'data-text': text});
    }
    ;
    //创建<label>
    var label = $('<label></label>', {'title': jid.substring(0, jid.indexOf('@'))});
    label.text(jid.substring(0, jid.indexOf('@')));
    //创建<a>
    var a = $('<a></a>', {'id': jid, 'href': 'javascript:void(0)'});
    a.text('x');
    li.append(label);
    li.append(a);
    tabs_list.append(li);
    //设置active
    setTabLiAc(jid);
    //拖动文件到li
    //html5DragTocontent(li, editor);
    //设置X事件
    $(".tabs-list a").unbind().bind('click', function () {
        var li = $(this).parent();
        li.remove();
        var jid = li.attr('data-id');
        var baseJid = 'base' + jid;
        //删除对应的div
        var baseBody = $(".dialog-body[id='" + baseJid + "']");
        baseBody.remove();
        //关闭对应文件上传窗口
        //var win = getFileShareWin(jid);
        //if (null != win) {
        //    var winValue = win.winValue;
        //    if (undefined != winValue && winValue != null || !winValue.closed) {
        //        winValue.close();
        //    }
        //}
        //;
        //设置li 聚焦
        setTabLiAc('');
        $(".tabs-list li").slice(0, 1).addClass('active');
        var newLi = $(".tabs-list li").filter(".active");
        if (newLi.length > 0) {
            var newText = newLi.attr('data-text');
            var temptext = newLi.attr('data-temptext');
            if (undefined != temptext && null != temptext && '' != temptext) {
                newText = temptext;
            }
            ;
            setDialogTitle(newText);
        }
        ;
        var lies = $(".tabs-list li");
        var len = lies.length;
        if (len == 0) {
            //$("#imModalMin",parent.document).hide();
            top.window.imModalClose();
            Ext.dialogPanel = null;
        } else {
            //$("#imModalMin",parent.document).show();
            var newJid = $(".tabs-list li:first-child").attr('data-id');
            setDialogDiv(newJid);
        }
    });
    //设置label点击事件
    $(".tabs-list label").click(function () {
        var jid = $(this).parent().attr("data-id");
        var text = $(this).parent().attr('data-text');
        var temptext = $(this).parent().attr('data-temptext');
        setTabLiAc(jid);
        setDialogDiv(jid);
        if (undefined != temptext && null != temptext && '' != temptext) {
            text = temptext;
        }
        ;
        setDialogTitle(text); //setDialogTitle(jid);
    });
};
//设置左边 tab li的 class="active"
function setTabLiAc(jid) {
    //情况class='active'
    var lies = $(".tabs-list li");
    var len = lies.length;
    $(".tabs-list li").slice(0, len).removeClass('active');
    //根据jid设置li的class=‘active’
    if (null != jid && '' != jid) {
        $(".tabs-list li[data-id='" + jid + "']").addClass("active");
        $(".tabs-list li[data-id='" + jid + "']").removeClass('offline news');
    }
};
//根据jid设置聊天面板显示
function setDialogDiv(jid) {
    var id = 'base' + jid;
    $('.dialog-right-body > div').hide();
    var div = document.getElementById(id);
    div.style.display = 'block';
};
//根据jid创建不同聊天面板
function createDialogBody(jid, type) {
    var id = 'base' + jid;
    //创建主div
    //var baseDiv = $('<div></div>',{'id':id,'data-id':jid,'class':'baseDiv'});
    //创建dialog-body
    var bodyDiv = $('<div></div>', {'id': id, 'data-id': jid, 'class': 'dialog-body'});
    bodyDiv.css("padding-right", "0");
    //创建main-dialog
    var mainDiv = $('<div></div>', {'class': 'main-dialog'});
    mainDiv.css('padding-top', '0');
    //离线提示div
    var offlineTipDiv = $("<div></div>", {
        'position': 'absolute ',
        'width': '100%',
        'height': '25px'
    }).appendTo(mainDiv);
    offlineTipDiv.css('background-color', '#CCEEFF');
    offlineTipDiv.css('text-align', 'center');
    offlineTipDiv.css('display', 'none');
    //离线提示字体
    var offlineTipFont = $("<font></font>", {text: '你已处于离线状态,无法发送消息,请重新连接后发送!'});
    //offlineTipFont.css('vertical-align','middle');
    offlineTipFont.css('font-size', '12px');
    offlineTipDiv.append(offlineTipFont);
    //创建record div
    var recordDiv = $('<div></div>', {'class': 'record'});
    //创建ul
    var ul = $('<ul></ul>', {'class': 'record-list', 'data-id': 'ul' + jid});
    //var li = $('<li></li>',{'class':'record-blue'}).text(jid);
    //ul.append(li);
    recordDiv.append(ul);
    //创建footer
    var footer = $('<footer></footer>', {'class': 'dialog-footer'});
    //创建header
    var header = $('<header></header>', {'class': 'text-header', 'style': 'padding-left:0;border-top:none;'});
    var history = $('<a></a>', {'href': 'javascript:void(0)', 'class': 'btn-history', text: '聊天记录'});
    //创建ul
    var headUl = $('<ul></ul>', {'class': 'clearfix', 'data-id': jid});
    //创建li
    var li1 = $('<li></li>', {'class': 'text-head-1'});
    var a1 = $('<a></a>', {'href': 'javascript:void(0)', 'title': '截图'});
    var asLabel = $("<li></li>").html('<input type="checkbox" /><span style="font-size:12px;">隐藏窗口</span>');
    var li2 = $('<li></li>', {'class': 'text-head-2'});
    var a2 = $('<a></a>', {'href': 'javascript:void(0)', 'title': '文件上传'});
    var fontTool = $('<div></div>', {'class': 'font-tool'});
    var toolList1 = $('<div></div>', {'class': 'tool-list'});
    var toolList2 = $('<div></div>', {'class': 'tool-list'});
    var spanFontFamily = $('<span></span>', {'title': '字体', 'class': 'family-set', 'data-id': jid});
    var spanFontSize = $('<span></span>', {'title': '字号', 'class': 'size-set', 'data-id': jid});
    var ulFontFamily = $('<ul></ul>');
    var liFontF1 = $('<li></li>', {'class': 'this-choose', 'style': 'font-family: "宋体"', text: '宋体'});
    var liFontF2 = $('<li></li>', {'style': 'font-family: "楷体"', text: '楷体'});
    var liFontF3 = $('<li></li>', {'style': 'font-family: "微软雅黑"', text: '微软雅黑'});
    var liFontF4 = $('<li></li>', {'style': 'font-family: "仿宋"', text: '仿宋'});
    var liFontF5 = $('<li></li>', {'style': 'font-family: "黑体"', text: '黑体'});
    var liFontF6 = $('<li></li>', {'style': 'font-family: "Arial Black"', text: 'Arial Black'});
    var liFontF7 = $('<li></li>', {'style': 'font-family: "Times New Roman"', text: 'Times New Roman'});
    var liFontF8 = $('<li></li>', {'style': 'font-family: "Courier New"', text: 'Courier New'});
    var ulFontSize = $('<ul></ul>');
    var liFontS1 = $('<li></li>', {'class': 'this-choose', text: '12'});
    var liFontS2 = $('<li></li>', {text: '14'});
    var liFontS3 = $('<li></li>', {text: '16'});
    var liFontS4 = $('<li></li>', {text: '18'});
    var liFontS5 = $('<li></li>', {text: '20'});
    var liFontS6 = $('<li></li>', {text: '22'});
    //fontTool.append(history);
    header.append(headUl);
    headUl.append(fontTool);
    fontTool.append(toolList1);
    fontTool.append(toolList2);
    toolList1.append(spanFontFamily);
    toolList2.append(spanFontSize);
    toolList1.append(ulFontFamily);
    toolList2.append(ulFontSize);
    ulFontFamily.append(liFontF1);
    ulFontFamily.append(liFontF2);
    ulFontFamily.append(liFontF3);
    ulFontFamily.append(liFontF4);
    ulFontFamily.append(liFontF5);
    ulFontFamily.append(liFontF6);
    ulFontFamily.append(liFontF7);
    ulFontFamily.append(liFontF8);
    ulFontSize.append(liFontS1);
    ulFontSize.append(liFontS2);
    ulFontSize.append(liFontS3);
    ulFontSize.append(liFontS4);
    ulFontSize.append(liFontS5);
    ulFontSize.append(liFontS6);
    //
    //创建div
    var footerDiv = $('<div></div>', {'class': 'text-body'});
    //创建form
    var footerForm = $('<form></form>', {'class': 'textform', 'style': 'position: relative;top:-4px;'});
    var name = 'textarea' + jid;
    //创建dialog-textarea
    var textarea = $('<textarea></textarea>', {'class': 'dialog-textarea', 'name': name});
    footerForm.append(textarea);
    footerDiv.append(footerForm);
    //创建footer
    var footerBtn = $('<footer></footer>', {'class': 'text-footer'});
    var checkLabel = $("<label></label>").html('<input type="checkbox">回车发送');
    footerBtn.append(checkLabel);
    //创建发送button
    var btn_id = 'btn' + jid;
    var button = $('<button></button>', {'type': 'button', 'id': btn_id, 'class': 'contentBtn'}).text('发送');
    footerBtn.append(button);
    footer.append(header);
    footer.append(footerDiv);
    footer.append(footerBtn);
    mainDiv.append(recordDiv);
    mainDiv.append(footer);
    //创建聊天记录aside
    var historyAside = $("<aside></aside>", {'class': 'chat-record-box', 'data-roomid': jid});
    historyAside.css('display', 'none');
    //创建title div
    var titleDiv = $("<div></div>", {'class': 'chat-record-title'}).html('<h4>聊天记录</h4>');
    //创建history div
    var historyRecordDiv = $("<div></div>", {'class': 'record'});
    //创建history ul
    var historyUl = $("<ul></ul>", {'class': 'record-list'});
    //聊天记录搜索条div
    var searchLinkDiv = $('<div></div>', {'class': 'searchLink', 'data-id': jid});
    searchLinkDiv.css('display', 'none');
    var searchText = $("<span></span>", {text: '内容   :'}).appendTo(searchLinkDiv);
    var searchContent = $("<input />", {'type': 'text', 'data-id': jid}).appendTo(searchLinkDiv);
    var searchLogBtn = $("<input />", {'type': 'button', 'data-id': jid, 'value': '确定'}).appendTo(searchLinkDiv);
    //创建分页div
    var fenDiv = $('<div></div>', {'class': 'pagination', 'data-id': jid});
    var searchLink = $("<input />", {'type': 'button', 'data-id': jid, 'title': '打开搜索条'}).appendTo(fenDiv);
    var firstPage = $('<a></a>', {'class': 'firstPage', 'href': '#', text: '首页'});
    var prevPage = $('<a></a>', {'class': 'prevPage', 'href': '#', text: '上一页'});
    var nextPage = $('<a></a>', {'class': 'nextPage', 'href': '#', text: '下一页'});
    var lastPage = $('<a></a>', {'class': 'lastPage', 'href': '#', text: '尾页'});
    //var pageSpan = $('<span></span>',{text:'总共:'});
    fenDiv.append(firstPage);
    fenDiv.append(prevPage);
    fenDiv.append(nextPage);
    fenDiv.append(lastPage);
    //fenDiv.append(pageSpan);
    fenDiv.append('总共:<span></span>');
    historyRecordDiv.append(historyUl);
    historyAside.append(titleDiv);
    historyAside.append(historyRecordDiv);
    historyAside.append(searchLinkDiv);
    historyAside.append(fenDiv);
    bodyDiv.append(mainDiv);
    bodyDiv.append(historyAside);
    $(".dialog-right-body").append(bodyDiv);
    //单聊聊天记录点击事件
    history.unbind().bind('click', function () {
        if (historyAside.is(":visible")) {
            historyAside.hide();
            $(this).closest(".dialog-body").css("padding-right", "0px");
        } else {
            $(this).closest(".dialog-body").css("padding-right", "360px");//360,群公告修改
            historyAside.show("fast", function () {
                //生成聊天记录
                var other = jid.split('@')[0];
                //getDataJson('chat', historyUl, other, fenDiv, '0', '0', null, null);
                historyAside.focus();
            });
        }
    });
    //字体设置
    $(".family-set[data-id='" + jid + "']").click(function () {
        $(this).next("ul").show();
    })
//字号设置
    $(".size-set[data-id='" + jid + "']").click(function () {
        $(this).next("ul").show();
    })
//字体设置事件
    $(".family-set[data-id='" + jid + "']").next("ul").find("li").click(function () {
        var index = $(this).index();
        familyText = $(this).text();  //获取点击内容
        $(".ke-edit-iframe").contents().find(".ke-content").css({fontFamily: '"' + familyText + '"'});
        $(this).addClass("this-choose").siblings().removeClass("this-choose").parent().hide();
        editor.focus();
    })
//字号设置事件
    $(".size-set[data-id='" + jid + "']").next("ul").find("li").click(function () {
        var index = $(this).index();
        sizeText = $(this).text();
        $(".ke-edit-iframe").contents().find("body.ke-content").attr('style', 'font-size:' + sizeText + 'px;font-family:' + '"' + familyText + '";');
        $(this).addClass("this-choose").siblings().removeClass("this-choose").parent().hide();
        editor.focus();
    })
//鼠标离开，下拉列表消失
    $(".tool-list ul").hover(function () {
    }, function () {
        $(this).hide();
    })
    var editor = LoadEditor(name, btn_id);
    setDialogDiv(jid);
    //Ext.webIM.delMsgBoxAction(type, jid);
    //获取输入框焦点
    //footerDiv.find("iframe").contents().find("body").focus();
    //设置截图事件
    //a1.click(function () {
    //    var flag = asLabel.find('input').prop("checked");
    //    //隐藏窗口
    //    if (flag) {
    //        win.minimize();
    //    }
    //    ;
    //    sc.capscreen(opener.Ext.program_path, opener.Ext.service_plugin_url, function (localurl) {
    //        var html = '';
    //        var body = footerDiv.find("iframe").contents().find("body");
    //        var fileList = body.find('a');
    //        //截图如果存在上传文件，将上传文件清空
    //        if (fileList.length > 0) {
    //            fileList.each(function () {
    //                $(this).remove();
    //            });
    //            html = body.html();
    //        } else {
    //            html = body.html();
    //        }
    //        ;
    //        var image = new Image();
    //        var imgid = createFileId();
    //        image.src = localurl;
    //        image.onload = function () {
    //            var w = this.width;
    //            var h = this.height;
    //            html = html + '<div ><img src="' + localurl + '" width="' + w + '" height="' + h + '" data-imgid="' +
    // createFileId() + '"/></div></br>'; editor.html(html); //恢复窗口 if (flag) { win.restore(); } } }); }); //设置文件上传事件
    // a2.click(function () { fileUp.change(function (evt) { var fpath = $(this).val(); if (fpath == '') { return; }
    // else { var file = this.files[0]; var fileId = createFileId(); //var fileName = file.name; var fsize =
    // getFileSize(file); var fileName = fpath.substring(fpath.lastIndexOf('\\') + 1); var html = '<a href="' +
    // sc.pathToUrl(fpath) + '" download="' + fileName + '" data-fileid="' + fileId + '" data-fsize="' + fsize + '" >'
    // + fileName + '</a></br>'; console.log(html); editor.html(html); $(this).val(''); } }); fileUp.trigger('click');
    // }); 发送消息
    $(".contentBtn[id='" + btn_id + "'").unbind().bind('click', function () {
        var newbtn = $(this)[0];
        var loginStatus = Ext.loginStatus;
        var text = editor.text();
        if ('' == text) {
            footerDiv.find("iframe").contents().find("body").focus();
            var d = dialog({
                padding: 5,
                height: 20,
                content: '<font style="font-size:12px;">发送内容不能为空,请重新输入!</font>',
                align: 'top right'
            }).show(newbtn);
            setTimeout(function () {
                d.close().remove();
            }, 500);
            return false;
        }
        ;
        if (undefined != loginStatus && !loginStatus) {
            offlineTipDiv.show();
            setTimeout(function () {
                offlineTipDiv.hide();
            }, 1000);
            return false;
        }
        ;
        //var content = editor.html();
        var textContent = footerDiv.find("iframe").contents().find("body");
        //发送前，添加文件上传进度
        //文件在本地， 需要先上传再发送消息
        //sc.html5DragUpFile(textContent, editor, ul, opener.Ext.service_plugin_url, opener.Ext.file_url, function (ct,
        //                                                                                                          e) {
        //    if (e) {
        //        alert('上传文件失败.' + e);
        //        return;
        //    }
        //    ;
        var date = new Date();
        var data = {};
        data.type = 'chat';
        data.jid = jid;
        data.text = text;
        data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
        data.from = Ext.nickName;
        data.resource = 'to'; //添加到内存消息数据库中 opener.Ext.tempMsgStore.push(data);
        addSendedMsg(jid, text, data);
        if ('chat' == type) {
            Ext.sendMessage(jid, Ext.bare_jid, text);
        }
        else {
            Ext.sendTempMessage(jid, Ext.bare_jid, text, Ext.nickName);
        }
        //});
        editor.html('');
    });
    //输入框获取焦点
    editor.focus();
    var textContent = footerDiv.find("iframe").contents().find("body");
    //拖动文件到聊天对话框
    //html5DragTocontent(bodyDiv, editor);
    //拖动文件到输入框
    //html5DragTocontent(textContent, editor);
    //回车发送按钮选中
    checkLabel.find("input").unbind().bind("change", function () {
        var flag = $(this).prop("checked");
        var textContent = footerDiv.find("iframe").contents().find("body");
        var self = editor;
        //若选中,回车发送
        if (flag) {
            KindEditor(self.edit.doc).unbind();
            KindEditor(self.edit.doc).bind("keydown", function (event) {
                //发送
                if (!event.ctrlKey && event.keyCode == 13) {
                    $(".contentBtn[id='" + btn_id + "'").click();
                }
                ;
                //手动换行
                if (event.ctrlKey && event.keyCode == 13) {
                    editor.focus();
                    editor.appendHtml('<br />');
                }
                ;
                //ctrl+v
                if (event.ctrlKey && event.keyCode == 86) {
                    var len = textContent.find('img').length;
                    if (len > 0) {
                        editor.html('');
                    }
                }
                ;
            });
        } else {//若为选中,ctrl+enter发送
            KindEditor(self.edit.doc).unbind();
            KindEditor(self.edit.doc).bind("keydown", function (event) {
                //发送
                if (event.ctrlKey && event.keyCode == 13) {
                    $(".contentBtn[id='" + btn_id + "'").click();
                }
                ;
                //ctrl+v
                if (event.ctrlKey && event.keyCode == 86) {
                    var len = textContent.find('img').length;
                    if (len > 0) {
                        editor.html('');
                    }
                }
                ;
            });
        }
    });
    //回车发送按钮默认选中
    checkLabel.find("input").trigger('click');
    //聊天记录搜索条点击事件
    searchLink.bind('click', function () {
        if (searchLinkDiv.is(":hidden")) {
            //显示内容搜索div
            searchLinkDiv.show();
            //清除聊天记录内容框
            searchLinkDiv.find('input[type=text]').val('');
            //设置聊天记录record样式
            historyRecordDiv.removeClass('record');
            historyRecordDiv.addClass('record-1');
        } else {
            //隐藏内容搜索div
            searchLinkDiv.hide();
            //设置聊天记录record样式
            historyRecordDiv.removeClass('record-1');
            historyRecordDiv.addClass('record');
        }
    });
    //聊天记录搜索div确定点击事件
    searchLinkDiv.find('input[type=button]').bind('click', function () {
        var contentObj = searchLinkDiv.find('input[type=text]');
        if (contentObj.length > 0) {
            var text = contentObj.val();
            if ('' == text) {
                //聚焦输入框
                contentObj.focus();
            } else {
                //生成聊天记录
                var other = jid.split('@')[0];
                //getDataJson('chat', historyUl, other, fenDiv, '0', '0', text, null);
                historyAside.focus();
            }
        }
    });
    return editor;
};
//根据房间的roomid创建聊天面板
function createRoomDialogBody(jid, text) {
    var id = 'base' + jid;
    //创建主div
    //var baseDiv =
    // $('<div></div>',{'id':id,'data-id':jid,'data-text':text,'class':'baseDiv','data-affiliation':affiliation});
    // 创建dialog-body
    var bodyDiv = $('<div></div>', {
                'id': id,
                'data-id': jid,
                'data-text': text,
                'class': 'dialog-body',
            }
        )
        ;
//创建main-dialog
    var main_dialog = $('<div></div>', {'class': 'main-dialog'});
    main_dialog.css('padding-top', '0');
//离线提示div
    var offlineTipDiv = $("<div></div>", {
        'position': 'absolute ',
        'width': '100%',
        'height': '25px'
    }).appendTo(main_dialog);
    offlineTipDiv.css('background-color', '#CCEEFF');
    offlineTipDiv.css('text-align', 'center');
    offlineTipDiv.css('display', 'none');
//离线提示字体
    var offlineTipFont = $("<font></font>", {text: '你已处于离线状态,无法发送消息,请重新连接后发送!'});
//offlineTipFont.css('vertical-align','middle');
    offlineTipFont.css('font-size', '12px');
    offlineTipDiv.append(offlineTipFont);
//创建最上边加入、退出工具栏div
    var tool_bar = $('<div></div>', {'class': 'dialog-tool-bar'});
//创建添加 a
    var join = $('<a></a>', {
        'class': 'dialog-bar-icon dialog-bar-icon-1',
        'href': '#',
        'data-id': jid + 'join',
        'title': '邀请成员'
    });
//创建退出 a
    var outer = $('<a></a>', {
        'class': 'dialog-bar-icon dialog-bar-icon-2',
        'href': '#',
        'data-id': jid + 'out',
        'title': '退出群'
    });
    tool_bar.append(join);
    tool_bar.append(outer);
//创建record div
    var record = $('<div></div>', {'class': 'record'});
//创建record-list ul
    var record_listUl = $('<ul></ul>', {'class': 'record-list', 'data-id': 'ul' + jid});
//创建li
//var li=$('<li></li>',{'class':'record-blue',text:'889954455'});
//record_listUl.append(li);
    record.append(record_listUl);
    //main_dialog.append(tool_bar);
    main_dialog.append(record);
//创建dialog-footer
    var dialog_footer = $('<footer></footer>', {'class': 'dialog-footer'});
//创建header
    var header = $('<header></header>', {'class': 'text-header', 'style': 'padding-left:0;border-top:none;'});
//创建a
    var historyBtn = $('<a></a>', {
        'class': 'btn-history',
        'id': jid + 'btn-history',
        'href': 'javascript:void(0);',
        'data-id': jid,
        text: '聊天记录'
    });
    //var shareFileBtn = $('<a></a>', {
    //    'class': 'btn-history',
    //    'id': jid + 'btn-shareFile',
    //    'href': 'javascript:void(0);',
    //    'data-id': jid,
    //    text: '共享文件'
    //});
//创建ul
    var clearfixUl = $('<ul></ul>', {'class': 'clearfix'});
//创建li
    var li1 = $('<li></li>', {'class': 'text-head-1', 'data-id': jid});
    var a1 = $('<a></a>', {'href': '#', 'title': ' 截图'});
    var asLabel = $("<li></li>").html('<input type="checkbox" /><span style="font-size:12px;">隐藏窗口</span>');
    var li2 = $('<li></li>', {'class': 'text-head-2', 'data-id': jid});
    var a2 = $('<a></a>', {'href': '#', 'title': '文件上传'});
//var li3=$('<li></li>',{'class':'text-head-3','data-id':jid});
//var a3 = $('<a></a>',{'href':'#'});
//文件上传
//var fileUp = $('<input></input>', {'id': 'upload' + jid, 'type': 'file'});
//fileUp.css('display', 'none');
//li1.append(a1);
//li2.append(a2);
//li3.append(a3);
//clearfixUl.append(li1);
//clearfixUl.append(asLabel);
//clearfixUl.append(li2);
//clearfixUl.append(li3);
//clearfixUl.append(fileUp);
//    header.append(historyBtn);
//header.append(shareFileBtn);
    header.append(clearfixUl);
    var fontTool = $('<div></div>', {'class': 'font-tool'});
    var toolList1 = $('<div></div>', {'class': 'tool-list'});
    var toolList2 = $('<div></div>', {'class': 'tool-list'});
    var spanFontFamily = $('<span></span>', {'title': '字体', 'class': 'family-set', 'data-id': jid});
    var spanFontSize = $('<span></span>', {'title': '字号', 'class': 'size-set', 'data-id': jid});
    var ulFontFamily = $('<ul></ul>');
    var liFontF1 = $('<li></li>', {'class': 'this-choose', 'style': 'font-family: "宋体"', text: '宋体'});
    var liFontF2 = $('<li></li>', {'style': 'font-family: "楷体"', text: '楷体'});
    var liFontF3 = $('<li></li>', {'style': 'font-family: "微软雅黑"', text: '微软雅黑'});
    var liFontF4 = $('<li></li>', {'style': 'font-family: "仿宋"', text: '仿宋'});
    var liFontF5 = $('<li></li>', {'style': 'font-family: "黑体"', text: '黑体'});
    var liFontF6 = $('<li></li>', {'style': 'font-family: "Arial Black"', text: 'Arial Black'});
    var liFontF7 = $('<li></li>', {'style': 'font-family: "Times New Roman"', text: 'Times New Roman'});
    var liFontF8 = $('<li></li>', {'style': 'font-family: "Courier New"', text: 'Courier New'});
    var ulFontSize = $('<ul></ul>');
    var liFontS1 = $('<li></li>', {'class': 'this-choose', text: '12'});
    var liFontS2 = $('<li></li>', {text: '14'});
    var liFontS3 = $('<li></li>', {text: '16'});
    var liFontS4 = $('<li></li>', {text: '18'});
    var liFontS5 = $('<li></li>', {text: '20'});
    var liFontS6 = $('<li></li>', {text: '22'});
    //fontTool.append(historyBtn);
    header.append(clearfixUl);
    clearfixUl.append(fontTool);
    fontTool.append(toolList1);
    fontTool.append(toolList2);
    toolList1.append(spanFontFamily);
    toolList2.append(spanFontSize);
    toolList1.append(ulFontFamily);
    toolList2.append(ulFontSize);
    ulFontFamily.append(liFontF1);
    ulFontFamily.append(liFontF2);
    ulFontFamily.append(liFontF3);
    ulFontFamily.append(liFontF4);
    ulFontFamily.append(liFontF5);
    ulFontFamily.append(liFontF6);
    ulFontFamily.append(liFontF7);
    ulFontFamily.append(liFontF8);
    ulFontSize.append(liFontS1);
    ulFontSize.append(liFontS2);
    ulFontSize.append(liFontS3);
    ulFontSize.append(liFontS4);
    ulFontSize.append(liFontS5);
    ulFontSize.append(liFontS6);
//text-body div
    var text_body = $('<div></div>', {'class': 'text-body'});
    var form = $("<form></form>", {'style': 'position: relative;top:-4px;'});
//创建textarea
    var name = 'textarea' + jid;
//创建dialog-textarea
    var textarea = $('<textarea></textarea>', {'class': 'dialog-textarea', 'name': name});
    form.append(textarea);
    text_body.append(form);
//创建footer
    var footer = $('<footer></footer>', {'class': 'text-footer'});
    var checkLabel = $("<label></label>").html('<input type="checkbox" />回车发送');
    footer.append(checkLabel);
    var btn_id = 'btn' + jid;
    var faBtn = $('<button></button>', {'id': btn_id, 'class': 'contentBtn'}).text('发送');
//创建邀请输入框
    footer.append(faBtn);
    dialog_footer.append(header);
    dialog_footer.append(text_body);
    dialog_footer.append(footer);
    main_dialog.append(dialog_footer);
//创建aside
    var aside = $('<aside></aside>', {'class': 'aside-group', 'data-roomid': jid});
//创建section 管理员
//var section1 = $('<aside></aside>',{'class':'ower-member'});
//创建header
//var seHeader = $('<header></header>',{text:'群主&管理员'});
//创建ul
//var seUl = $('<ul></ul>',{'data-id':jid,'class':'ower'});
//创建li
//var ownerLi = $('<li></li>',{'class':'icon-group-owner'});
//var lia = $('<a></a>',{text:'业支-张丽','href':"#"});
//ownerLi.append(lia);
//seUl.append(ownerLi);
//section1.append(seHeader);
//section1.append(seUl);
//创建群公告--begin
//var groupNoticeHead = $('<div class="notes"></div>');
//var groupNoticeTempStr = '群公告';
//groupNoticeHead.append(groupNoticeTempStr);
//var groupNoticeText = $('<div class="notes-text"  ondblclick="javascript:showNoticTextArea(\'' + affiliation +
// '\')"></div>'); var groupNoticeTextArea = $('<textarea style="display:none;" id="groupNoticeTextArea" cols="10"
// rows="" class="notes-input"></textarea>'); var groupNoticeTextP = $('<p id="groupNoticeTextP" ></p>');
// groupNoticeText.append(groupNoticeTextArea); groupNoticeText.append(groupNoticeTextP); 创建群公告--end 创建section 普通成员
    var section2 = $('<aside></aside>', {'class': "group-member"});
//创建header
    var seHeader2 = $('<header></header>', {text: '成员列表'});
//创建搜索成员div
    var search = $('<div></div>', {'class': 'member-search'});
    var searchInput = $('<input />', {'type': 'text', 'data-id': jid, 'placeholder': '搜索成员'});
    var searchBtn = $('<input />', {'type': 'button', 'data-id': jid});
    search.append(searchInput);
    search.append(searchBtn);
//创建普通成员div
    var ptuser = $('<div></div>', {'class': 'member-list-wrap'});
//创建ul
    var ptUl = $('<ul></ul>', {'data-id': jid, 'class': 'member'});
//var ptLi = $('<li></li>',{'class':'icon-group-2'});
//var pta =  $('<a></a>',{text:'临汾-业支-赵晶晶','href':"#"});
//ptLi.append(pta);
//ptUl.append(ptLi);
    ptuser.append(ptUl);
    section2.append(seHeader2);
    section2.append(search);
    section2.append(ptuser);
//aside.append(section1);
//aside.append(groupNoticeHead); //群公告
//aside.append(groupNoticeText); //群公告
    aside.append(section2);
//创建聊天记录aside
    var historyAside = $("<aside></aside>", {'class': 'chat-record-box', 'data-roomid': jid});
    historyAside.css('display', 'none');
//创建title div
    var titleDiv = $("<div></div>", {'class': 'chat-record-title'}).html('<h4>聊天记录</h4>');
//创建history div
    var historyRecordDiv = $("<div></div>", {'class': 'record'});
//创建history ul
    var historyUl = $("<ul></ul>", {'class': 'record-list'});
//聊天记录搜索条div
    var searchLinkDiv = $('<div></div>', {'class': 'searchLink', 'data-id': jid});
    searchLinkDiv.css('display', 'none');
    var searchText = $("<span></span>", {text: '内容   :'}).appendTo(searchLinkDiv);
    var searchContent = $("<input />", {'type': 'text', 'data-id': jid}).appendTo(searchLinkDiv);
    var searchLogBtn = $("<input />", {'type': 'button', 'data-id': jid, 'value': '确定'}).appendTo(searchLinkDiv);
//创建分页div
//var fenDiv = $("<div></div>",{'class':'sss'});
    var fenDiv = $('<div></div>', {'class': 'pagination', 'data-id': jid});
    var searchLink = $("<input />", {'type': 'button', 'data-id': jid, 'title': '打开搜索条'}).appendTo(fenDiv);
    var firstPage = $('<a></a>', {'class': 'firstPage', 'href': '#', text: '首页'});
    var prevPage = $('<a></a>', {'class': 'prevPage', 'href': '#', text: '上一页'});
    var nextPage = $('<a></a>', {'class': 'nextPage', 'href': '#', text: '下一页'});
    var lastPage = $('<a></a>', {'class': 'lastPage', 'href': '#', text: '尾页'});
    fenDiv.append(firstPage);
    fenDiv.append(prevPage);
    fenDiv.append(nextPage);
    fenDiv.append(lastPage);
    fenDiv.append('总共:<span></span>');
    historyRecordDiv.append(historyUl);
    historyAside.append(titleDiv);
    historyAside.append(historyRecordDiv);
    historyAside.append(searchLinkDiv);
    historyAside.append(fenDiv);
//共享文件aside
    var shareFileAside = $("<aside></aside>", {'class': 'chat-record-box', 'data-roomid': jid});
    shareFileAside.css('display', 'none');
    var shareTitle = $("<div></div>", {'class': 'chat-record-title'});
    var shareH4 = $("<h4></h4>", {text: '共享文件'});
    shareTitle.append(shareH4);
    var toolDiv = $("<div></div>", {'class': 'record'});
    toolDiv.css("padding-top", "30px");
    toolDiv.css("position", "relative");
    var toolBar = $("<div></div>", {'class': 'dialog-tool-bar'}).appendTo(toolDiv);
    var fileClickBtn = $("<a></a>", {
        'href': "#",
        'class': 'dialog-bar-icon dialog-bar-icon-file',
        'title': '点击上传文件'
    }).appendTo(toolBar);
//var fileClickBtn = $("<input />",{'class':'btn btn-primary','title':'点击上传文件','type':'button','value':'上传'});
    toolBar.append(fileClickBtn);
    var fileTable = $('<table></table>', {'class': 'data-table share-files-list', 'data-id': jid}).appendTo(toolDiv);
    var fileThead = $("<thead></thead>").appendTo(fileTable);
    var fileTr = $("<tr></tr>").appendTo(fileThead);
    var fileTh1 = $("<th></th>", {text: '文件名'}).appendTo(fileTr);
    var fileTh2 = $("<th></th>", {'width': '80', text: '上传者'}).appendTo(fileTr);
    var fileTh3 = $("<th></th>", {'width': '50', text: '操作'}).appendTo(fileTr);
    var fileTbody = $("<tbody></tbody>", {'class': 'fielTableBody', 'data-id': jid}).appendTo(fileTable);
    shareFileAside.append(shareTitle);
    shareFileAside.append(toolDiv);
    bodyDiv.append(main_dialog);
    bodyDiv.append(aside);
    bodyDiv.append(shareFileAside);
    bodyDiv.append(historyAside);
    $('.dialog-right-body').append(bodyDiv);
//文件上传按钮点击事件
    fileClickBtn.unbind().bind('click', function () {
        var roomId = jid.split('room')[0];
        var realRoomId = getRealRoomId(roomId);
        var winName = '文件上传窗口' + jid;
        //opener.fileUpload =
        // window.open('../tools/FileUpload/FileShareUpload.html?roomId='+decodeURIComponent(roomId),winName,
        // 'height=400,width=450');
        var obj = new Object();
        obj.winName = winName;
        obj.winValue = window.open('../tools/FileUpload/FileShareUpload.html?roomId=' + decodeURIComponent(roomId) + '&id=' + decodeURIComponent(realRoomId), winName, 'height=400,width=450');
        var flag = contains(WinArray, winName);
        if (!flag) {
            WinArray.push(obj);
        }
    });
//群聊天记录点击事件
    historyBtn.click(function () {
        if (historyAside.is(":visible")) {
            $(this).closest(".dialog-body").css("padding-right", "260px");//280,群公告修改
            historyAside.hide();
        } else {
            $(this).closest(".dialog-body").css("padding-right", "360px");//360,群公告修改
            shareFileAside.hide();
            searchLinkDiv.hide();
            //设置聊天记录record样式
            historyRecordDiv.removeClass('record-1');
            historyRecordDiv.addClass('record');
            historyAside.show("fast", function () {
                //查询聊天记录
                var roomId = jid.split('room')[0];
                var realRoomId = getRealRoomId(roomId);
                //getDataJson('groupchat', historyUl, realRoomId, fenDiv, '0', '0', null, null);
                historyAside.focus();
            });
        }
    });
//共享文件点击事件
//    shareFileBtn.click(function () {
//        if (shareFileAside.is(":visible")) {
//            shareFileAside.hide();
//            $(this).closest(".dialog-body").css("padding-right", "220px");//280,群公告修改
//        } else {
//            $(this).closest(".dialog-body").css("padding-right", "360px");//360,群公告修改
//            historyAside.hide();
//            shareFileAside.show('fast', function () {
//                var roomId = jid.split('room')[0];
//                //获取真实roomid
//                var realRoomId = getRealRoomId(roomId);
//                //查询共享文件数据
//                //getShareFileJson(fileTbody,roomId,fileFenDiv,'0','10');
//                getShareFileJsonData(realRoomId, roomId);
//                shareFileAside.focus();
//            });
//        }
//    });
//字体设置
    $(".family-set[data-id='" + jid + "']").click(function () {
        $(this).next("ul").show();
    })
//字号设置
    $(".size-set[data-id='" + jid + "']").click(function () {
        $(this).next("ul").show();
    })
//字体设置事件
    $(".family-set[data-id='" + jid + "']").next("ul").find("li").click(function () {
        var index = $(this).index();
        familyText = $(this).text();  //获取点击内容
        $(".ke-edit-iframe").contents().find(".ke-content").css({fontFamily: '"' + familyText + '"'});
        $(this).addClass("this-choose").siblings().removeClass("this-choose").parent().hide();
        editor.focus();
    })
//字号设置事件
    $(".size-set[data-id='" + jid + "']").next("ul").find("li").click(function () {
        var index = $(this).index();
        sizeText = $(this).text();
        $(".ke-edit-iframe").contents().find("body.ke-content").attr('style', 'font-size:' + sizeText + 'px;font-family:' + '"' + familyText + '";');
        $(this).addClass("this-choose").siblings().removeClass("this-choose").parent().hide();
        editor.focus();
    })
//鼠标离开，下拉列表消失
    $(".tool-list ul").hover(function () {
    }, function () {
        $(this).hide();
    })
    var editor = LoadEditor(name, btn_id);
//获取输入框焦点
//text_body.find("iframe").contents().find("body").focus();
//添加群成员按钮事件
    join.click(function () {
        var room = $(this).parent().parent().parent();
        var affiliation = room.attr('data-affiliation');
        var roomId = room.attr('data-id');
        var text = room.attr('data-text');
        if ('10' == affiliation || '20' == affiliation) {
            var roomId = roomId.split('room')[0];
            var id = 'joinRoom4A';
            //设置参数数组
            var parames = [roomId, text];
            joinRoomTip(id, parames);
            //邀请入群操作
            dialog({
                id: id,
                title: null,
                content: document.getElementById('joinRoomTip'),
                padding: 0,
                width: 300
            }).showModal();
        } else {
            var id = 'invitedRoomAlert';
            setAlertTip("你不是管理员,不能邀请成员", "确定", id);
            dialog({
                id: id,
                title: null,
                content: document.getElementById('alertTip'),
                padding: 0,
                width: 300
            }).showModal();
            return;
        }
    });
//退出群按钮事件
    outer.click(function () {
        var room = $(this).parent().parent().parent();
        var affiliation = room.attr('data-affiliation');
        var roomId = room.attr('data-id');
        var text = room.attr('data-text');
        if ('20' == affiliation || '30' == affiliation) {
            var id = 'quitRoomConfirm';
            var roomId = roomId.split('room')[0];
            //设置参数数组
            var parames = [roomId, affiliation, id, '退出群'];
            //设置提示窗口内容
            setConfirmTip('确定退出该群吗?', '确定', '取消', 'quitRoom', parames);
            dialog({
                id: id,
                title: null,
                content: document.getElementById('myDialogTips'),
                padding: 0,
                width: 300
            }).showModal();
        } else {
            var id = 'quitRoomAlert';
            setAlertTip("你是群主,不能退群", "确定", id);
            dialog({
                id: id,
                title: null,
                content: document.getElementById('alertTip'),
                padding: 0,
                width: 300
            }).showModal();
            return;
        }
    });
//设置截图事件
    a1.click(function () {
        var flag = asLabel.find('input').prop("checked");
        //隐藏窗口
        if (flag) {
            win.minimize();
        }
        ;
        sc.capscreen(Ext.program_path, Ext.service_plugin_url, function (localurl) {
            var html = '';
            var body = text_body.find("iframe").contents().find("body");
            var fileList = body.find('a');
            //截图如果存在上传文件，将上传文件清空
            if (fileList.length > 0) {
                fileList.each(function () {
                    $(this).remove();
                });
                html = body.html();
            } else {
                html = body.html();
            }
            ;
            var image = new Image();
            var imgid = createFileId();
            image.src = localurl;
            image.onload = function () {
                var w = this.width;
                var h = this.height;
                html = html + '<div ><img src="' + localurl + '" width="' + w + '" height="' + h + '" data-imgid="' + createFileId() + '"/></div></br>';
                editor.html(html);
                //恢复窗口
                if (flag) {
                    win.restore();
                }
            }
        });
    });
//设置文件上传事件
    a2.click(function () {
        fileUp.change(function (evt) {
            var fpath = $(this).val();
            if (fpath == '') {
                return;
            } else {
                var file = this.files[0];
                var fileId = createFileId();
                var fsize = getFileSize(file);
                var fileName = fpath.substring(fpath.lastIndexOf('\\') + 1);
                var html = '<div><a href="' + sc.pathToUrl(fpath) + '" download="' + fileName + '" data-fileid="' + fileId + '" data-fsize="' + fsize + '" >' + fileName + '</a></div></br>';
                editor.html(html);
                $(this).val('');
            }
        });
        fileUp.trigger('click');
    });
//发送消息事件
    $(".contentBtn[id='" + btn_id + "'").unbind().bind('click', function () {
        var newbtn = $(this)[0];
        var text = editor.text();
        var loginStatus = Ext.loginStatus;
        if ('' == text) {
            text_body.find("iframe").contents().find("body").focus();
            var d = dialog({
                padding: 5,
                height: 20,
                content: '<font style="font-size:12px;">发送内容不能为空,请重新输入!</font>',
                align: 'top right'
            }).show(newbtn);
            setTimeout(function () {
                d.close().remove();
            }, 700);
            return false;
        }
        ;
        if (undefined != loginStatus && !loginStatus) {
            offlineTipDiv.show();
            setTimeout(function () {
                offlineTipDiv.hide();
            }, 1000);
            return false;
        }
        ;
        //输入框所在iframe
        //var textIframe = text_body.find("iframe").contents();
        ////获取输入框对象
        //var textContent = text_body.find("iframe").contents().find("body");
        //var content = '';
        ////获取输入框html
        //var newJid = jid.split('room')[0];
        //文件在本地， 需要先上传再发送消息
        //sendMessage(textIframe,editor,record_listUl,'groupchat',newJid);
        //sc.html5DragUpFile(textContent, editor, record_listUl, opener.Ext.service_plugin_url, opener.Ext.file_url,
        // function (ct, e) { if (e) { alert('上传文件失败.' + e); return; } ; opener.Ext.sendMucMessage(newJid, ct); });
        //var textContent = text_body.find("iframe").contents().find("body");
        var date = new Date();
        var data = {};
        data.type = 'groupchat';
        data.jid = jid;
        data.text = text;
        data.date = date.pattern("yyyy-MM-dd HH:mm:ss");
        data.from = Ext.nickName;
        data.resource = 'to'; //添加到内存消息数据库中 opener.Ext.tempMsgStore.push(data);
        //addSendedMsg(jid, text, data);
        Ext.sendMucMessage(jid, text, Ext.uuid());
        //Ext.sendTempMessage(jid, Ext.bare_jid, text, Ext.nickName);
        editor.html('');
    });
//输入框获取焦点
//editor.focus();
//聊天输入框对象Jquery
//拖动文件到聊天对话框
//    html5DragTocontent(bodyDiv, editor);
//拖动文件到输入框
//    html5DragTocontent(textContent, editor);
//回车发送按钮选中
    checkLabel.find("input").unbind().bind("change", function () {
        var flag = $(this).prop("checked");
        var textContent = text_body.find("iframe").contents().find("body");
        var self = editor;
        //若选中,enter发送
        if (flag) {
            KindEditor(self.edit.doc).unbind();
            KindEditor(self.edit.doc).bind("keydown", function (event) {
                //发送
                if (!event.ctrlKey && event.keyCode == 13) {
                    $(".contentBtn[id='" + btn_id + "'").click();
                }
                ;
                //手动换行
                if (event.ctrlKey && event.keyCode == 13) {
                    editor.focus();
                    editor.appendHtml('<br />');
                }
                ;
                //ctrl+v
                if (event.ctrlKey && event.keyCode == 86) {
                    var len = textContent.find('img').length;
                    if (len > 0) {
                        editor.html('');
                    }
                }
            });
        } else {//若为选中,ctrl+enter发送
            KindEditor(self.edit.doc).unbind();
            KindEditor(self.edit.doc).bind("keydown", function (event) {
                if (event.ctrlKey && event.keyCode == 13) {
                    $(".contentBtn[id='" + btn_id + "'").click();
                }
                ;
                //ctrl+v
                if (event.ctrlKey && event.keyCode == 86) {
                    var len = textContent.find('img').length;
                    if (len > 0) {
                        editor.html('');
                    }
                }
                ;
            });
        }
    });
//回车发送按钮默认选中
    checkLabel.find("input").trigger('click');
//搜索群成员事件
    searchInput.bind('keyup', function (e) {
        var keycode = e.which;
        //点击Esc按钮
        if (keycode == 27) {
            //清除输入值
            searchInput.val('');
            ptUl.find('li').show();
            return;
        } else {
            //获取输入框值
            var value = searchInput.val();
            //输入框'',显示所有成员
            if ('' == value) {
                ptUl.find('li').show();
                return;
            } else {
                //先隐藏所有成员
                ptUl.find('li').show().hide();
                //根据输入框值显示成员
                ptUl.find("li:contains('" + value + "')").show();
            }
        }
    });
//搜索按钮点击事件
    searchBtn.bind('click', function (e) {

        //获取输入框值
        var value = searchInput.val();
        //输入框'',显示所有成员
        if ('' == value) {
            ptUl.find('li').show();
            return;
        } else {
            //先隐藏所有成员
            ptUl.find('li').show().hide();
            //根据输入框值显示成员
            ptUl.find("li:contains('" + value + "')").show();
        }
    });
//聊天记录搜索条点击事件
    searchLink.bind('click', function () {
        if (searchLinkDiv.is(":hidden")) {
            //显示内容搜索div
            searchLinkDiv.show();
            //清除聊天记录内容框
            searchLinkDiv.find('input[type=text]').val('');
            //设置聊天记录record样式
            historyRecordDiv.removeClass('record');
            historyRecordDiv.addClass('record-1');
        } else {
            //隐藏内容搜索div
            searchLinkDiv.hide();
            //设置聊天记录record样式
            historyRecordDiv.removeClass('record-1');
            historyRecordDiv.addClass('record');
        }
    });
//聊天记录搜索div确定点击事件
    searchLinkDiv.find('input[type=button]').bind('click', function () {
        var contentObj = searchLinkDiv.find('input[type=text]');
        if (contentObj.length > 0) {
            var text = contentObj.val();
            if ('' == text) {
                //聚焦输入框
                contentObj.focus();
            } else {
                //查询聊天记录
                var roomId = jid.split('room')[0];
                var realRoomId = getRealRoomId(roomId);
                //getDataJson('groupchat', historyUl, realRoomId, fenDiv, '0', '0', text, null);
                historyAside.focus();
            }
        }
    });
    return editor;
}
;
//添加已发送的消息到显示框addSendedMsg
function addSendedMsg(jid, content, data) {
    //var aa=localStorage.getItem(Ext.bare_jid);
    //alert(aa+"**********");
    //alert(Ext.bare_jid+"@@@@@@@@");
    content = HtmlDecode(content);
    var ulid = 'ul' + jid;
    var ul = $(".record-list[data-id='" + ulid + "']");
    var date;
    var color;
    var name;
    if ('' != data && undefined != data) {
        date = data.date;
        name = data.from;
        var resource = data.resource;
        if ('from' == resource) {
            color = 'record-blue';
        } else {
            color = 'record-green';
        }
    } else {
        date = new Date();
        date = date.pattern("yyyy-MM-dd HH:mm:ss");
        color = 'record-green';
        name = Ext.nickName;
    }
    ;
    //创建li
    var li = $('<li></li>', {'class': color});
    //创建<h>
    //var html = Ext.bare_jid.substring(0, Ext.bare_jid.indexOf('@')) + '   [<span class="record-time">' + date +
    // '</span>]';
    if ('from' == resource) {
        var html = jid.split('@')[0] + '   [<span class="record-time">' + date + '</span>]';
    } else {
        var html = Ext.bare_jid.substring(0, Ext.bare_jid.indexOf('@')) + '   [<span class="record-time">' + date + '</span>]';
    }
    var h4 = $('<h4></h4>').html(html);
    //创建p
    //alert(content);
    var p = $('<p></p>').html(content).attr('style', 'font-size:' + sizeText + 'px;font-family:' + '"' + familyText + '";');
    p.css({"word-break": "break-all"});
    li.append(h4);
    li.append(p);
    ul.append(li);
    //消息中图片双击事件
    //lookImage(img);
    //设置聊天记录显示最底部
    var recordDiv = ul.parent();
    var height = ul.height();
    recordDiv.scrollTop(height);
};
//添加内存中的群消息到聊天框
function addTempRoomMsg(data) {
    var jid = data.jid;
    var date = data.date;
    var from = data.from;
    var text = data.text;
    var id = data.id;
    var resource = data.resource;
    text = HtmlDecode(text);
    var ul = $(".record-list[data-id='" + 'ul' + jid + "']");
    //var nickName = jid;
    //if (null != nickName && undefined != nickName && '' != nickName) {
    //    from = nickName;
    //}
    //;
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
    var p = $('<p></p>').html(text).attr('style', 'font-size:' + sizeText + 'px;font-family:' + '"' + familyText + '";');
    p.css({"word-break": "break-all"});
    li.append(h4);
    li.append(p);
    ul.append(li);
    var recordDiv = ul.parent();
    var height = ul.height();
    recordDiv.scrollTop(height);
};
//添加内存中的消息记录
function addTempMsg(jid, type) {
    var tempMsg = Ext.webIM.getTempMsgStore(jid, type);
    var len = tempMsg.length;
    if (len > 0) {
        var limit = 0;
        if (len >= 10) {
            limit = len - 10;
        }
        ;
        for (var i = limit; i < len; i++) {
            var data = tempMsg[i];
            var text = data.text;
            text = HtmlDecode(text);
            var date = data.date;
            var from = data.from;
            var to = data.resource;
        }
        if ('chat' == type) {
            //添加消息记录
            addSendedMsg(jid, text, data);
        } else if ('groupchat' == type) {
            addTempRoomMsg(data);
        } else if ('tempchat' == type) {
            addSendedMsg(jid, text, data);
        }
    }
    //清除消息box中的信息
    tempMsg.splice(0, tempMsg.length);
};
//通过ajax获取room成员数据
function getRoomRosterList(roomid) {
    //roomid就是房间li里面的jid
    var rosterList = null;
    var name = roomid;
    var roomJID = roomid + Ext.room_suffix;
    //alert("roomJID = " + roomJID);
//  var url = '/gettopost';
    var url = '/uop/comm/v1/saa/getToPost'
    //var url = "http://172.18.48.136/plugins/controlchatroom/chatroomservlet";
    var data = 'name=' + roomid + '&roomJID=' + roomJID + '&node=-1';
    //var
    // data="{\"version\":\"1.0\",\"id\":\"123456\",\"type\":\"m1_group_search\",\"action\":\"request\",\"search\":\"xxx\",\"start\":\"1\",\"num\":\"10\"}";
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        data: {
            url: Ext.dataUrl,
            json: "{\"version\":\"1.0\",\"id\":\"123456\",\"type\":\"m1_chatroom_members_query\",\"action\":\"request\",\"roomJID\":\"" + roomid + "\"}"
        },
        dataType: 'json',
        success: function (resp, option) {
            rosterList = resp.data.entity;
            rosterList = eval('(' + rosterList + ')');
        },
        error: function (resp) {
            alert('获取房间成员列表失败！');
        }
    });
    return rosterList.memberlist;
};
//将获取的房间数据添加到聊天div中
function setDataRoom(rosterList, jidRoom) {
    if (null != rosterList) {
        var memberList = $(".member[data-id='" + jidRoom + "']");
        //var roomId = jidRoom.split('room')[0];
        var roomId = jidRoom;
        //清空好友列表
        memberList.empty();
        var len = rosterList.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                var data = rosterList[i];
                var id = data.userJID;
                var jid = data.userJID;
                var affiliation = data.owner;
                var text = data.userJID;
                var li;
                if ('owner' == affiliation) {
                    var classStr = 'icon-group-owner-1';
                    if (available) {
                        classStr = 'icon-group-owner';
                    }
                    ;
                    //创建li
                    li = $('<li></li>', {'class': classStr, 'data-id': jid, 'data-affiliation': affiliation});
                    var a = $('<a></a>', {'href': '#', text: text, title: text, 'data-id': jid});
                    li.append(a);
                    memberList.append(li);
                } else if ('20' == affiliation) {
                    //var classStr = 'icon-group-3';
                    var classStr = 'icon-group-2';
                    //创建li
                    li = $('<li></li>', {'class': classStr, 'data-id': jid, 'data-affiliation': affiliation});
                    var a = $('<a></a>', {'href': '#', text: text, 'data-id': jid});
                    li.append(a);
                    memberList.append(li);
                } else {
                    //var classStr = 'icon-group-3';
                    var classStr = 'icon-group-2';
                    //创建li
                    li = $('<li></li>', {'class': classStr, 'data-id': jid, 'data-affiliation': affiliation});
                    var a = $('<a></a>', {'href': '#', text: text, 'data-id': jid});
                    li.append(a);
                    memberList.append(li);
                }
                ;
                //获取右键菜单栏
                //var items = getMenu(owerAffiliation, affiliation, jid, roomId, text);
                //if (null != items) {
                //    li.contextPopup({
                //        items: items
                //    });
                //}
            }
            ;
        } else {
            return;
        }
    }
};
//关闭当前会话div(根据active)
function closeCurrentWin() {
    //获取左边active li
    var li = $("#tabs-list-wrap li").filter(".active");
    var jid = li.attr('data-id');
    var baseJid = 'base' + jid;
    //删除li
    li.remove();
    //删除对应的div
    var baseBody = $(".baseDiv[id='" + baseJid + "']");
    baseBody.remove();
    //关闭对应的文件上传窗口
    var win = getFileShareWin(jid);
    if (null != win) {
        var winValue = win.winValue;
        if (undefined != winValue && winValue != null || !winValue.closed) {
            winValue.close();
        }
    }
    ;
    //设置li 聚焦
    setTabLiAc('');
    $(".tabs-list li").slice(0, 1).addClass('active');
    var lies = $(".tabs-list li");
    var len = lies.length;
    if (len == 0) {
        window.close();
    } else {
        var newJid = $(".tabs-list li:first-child").attr('data-id');
        setDialogDiv(newJid);
    }
};
//override contains方法,支持大小写
jQuery.expr[':'].contains = function (a, i, m) {
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};
//将聊天记录数据添加到页面
/*function setHistoryChat(type,ul,other,fenDiv){
 var len = ul.children().length;
 //当没有数据时进行查询
 if(len<=0){
 var data = getHistoryChat(type,other);
 if(null!=data){
 setHistoryChatToHtml(type,ul,data);
 }
 }
 };*/


