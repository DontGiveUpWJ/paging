//聊天输入框消息发送
function sendMessage(textIframe,editor,ul,chatType,other){
	//chatType表示群聊天或者单聊天，other表示jid或者roomJid
	//opener.Ext.service_plugin_url, opener.Ext.file_url
	var bqFlag = false;
	var body = textIframe.find("body");
	//消息发送，先发送普通消息和表情图片，在发送图片，最后发送文件
	var imgList = body.find('img');
	var fileList = body.find('a');
	var imgTemp = imgList;
	var fileTemp = fileList;
	//查询图片是否全是表情图片
	imgList.each(function(){
		var src = $(this).attr('src');
		var flag = src.indexOf('resources/editor/plugins/emoticons/images') > 0;
		if(flag){
			var path = getProtectPath();
			var newSrc = src.replace(path,'localProjectPath-bqPic');
			$(this).attr('src',newSrc);
		}else{
			bqFlag = true;
			return false;
		}
	});
	//只有文字和表情图片，直接发送
	if(fileList.length == 0&&!bqFlag){
		var content = body.html();
		if('groupchat'==chatType){//群聊天发送
			editor.html('');
			opener.Ext.sendMucMessage(other, content);
		}else{//单聊天发送

		};
	}else{
		//获取文字和表情图片
		var content = '';
		var divList = textIframe.find('body > div');
		//因为每一行都是在一个div中，遍历输入框下div
		//查询图片是否全是表情图片
		imgList.each(function(){
			var src = $(this).attr('src');
			var flag = src.indexOf('resources/editor/plugins/emoticons/images') > 0;
			if(flag){
				var path = getProtectPath();
				var newSrc = src.replace(path,'localProjectPath-bqPic');
				$(this).attr('src',newSrc);
			}else{
				$(this).remove();
			}
		});
		fileList.each(function(){
			$(this).remove();
		});
		content = body.html();
		editor.html('');
		opener.Ext.sendMucMessage(other, content);
	}
};
//取消页面默认拖拽事件
function noWinDrag(){
	$(document).on({
		dragleave:function(e){    //拖离
			e.preventDefault();
		},
		drop:function(e){  //拖后放
			e.preventDefault();
		},
		dragenter:function(e){    //拖进
			e.preventDefault();
		},
		dragover:function(e){    //拖来拖去
			e.preventDefault();
		}
	});
};
//上传文件随机生成文件id
function createFileId(){
	var ran = Math.round((Math.random())*10000);
	var date = new Date();
	var dateStr = date.pattern("yyyyMMddHHmmss");
	fileId = 'fileId-'+dateStr+ran;
	return fileId;
};
//计算上传文件大小
function getFileSize(file){
	var fileSize = 0;
	if(file){
		if (file.size > 1024 * 1024) {
			fileSize = formatFloat(file.size/1024/1024,2) + 'MB';
		}else{
			fileSize = formatFloat(file.size/1024,2) + 'KB';
		};
	};
	return fileSize;
};
//截取附件大小
function formatFloat(src, pos){
	return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
};
//拖动文件到输入框上传文件
function html5DragTocontent(textContent,editor){
	//拖动文件数组
	var dragFileList;
	//聊天输入框对象Doc
	var textMsg = textContent[0]; //拖拽区域
	//拖动上传
	textMsg.addEventListener("drop",function(e){

		e.preventDefault(); //取消默认浏览器拖拽效果
		var fileList = e.dataTransfer.files; //获取文件对象数组
		//检测是否是拖拽文件到页面的操作
		var len = fileList.length;
		if(len == 0){
			return false;
		}else{
			var html = null;
			for(var i=0;i<fileList.length;i++){
				var file = fileList[i];
				if(null!=file){
					var fileName = file.name;
					if('' == fileName){
						return;
					}else{
						var fpath = file.path;
						var fileId = createFileId();
						var fsize = getFileSize(file);
						var filehtml = '<a href="' + sc.pathToUrl(fpath) + '" download="'+fileName+'" data-fileid="'+fileId+'" data-fsize="'+fsize+'" >' + fileName + '</a></br>';
						if(null==html){
							html = filehtml;
						}else{
							html = html+filehtml;
						};
					}
				};
			};
			if(null!=html){
				editor.html(html);
			};
			editor.focus();
		}
	});
};
//通过聊天方式获取聊天窗口左边tab图片样式
function setLeftTabsLiClass(jid,type){
	var liclass = '';
	if('chat'==type){
		var li = $("#item-lists li[data-id='"+jid+"']");
		if(li.length>0){
			var img = li.find('img');
			if(img.length>0){
				var src = img.attr('src');
				if('resources/images/icon-item-image-1.png'==src){
					liclass = 'tabs-list-wrap-li-chat-online';
				}else{
					liclass = 'tabs-list-wrap-li-chat-offline';
				};
			}else{
				liclass = 'tabs-list-wrap-li-chat-offline';
			}
		}else{
			liclass = 'tabs-list-wrap-li-chat-offline';
		};
		return liclass;
	}else if('groupchat'==type){
		liclass = 'tabs-list-wrap-li-groupchat';
		return liclass;
	}else{
		//获取对应房间群列表
		var li = $(".member li[data-id='"+jid+"']");
		if(li.length>0){
			var sclass = li.attr('class');
			if('icon-group-1'==sclass||'icon-group-2'==sclass){
				liclass = 'tabs-list-wrap-li-chat-online';
			}else{
				liclass = 'tabs-list-wrap-li-chat-offline';
			};
		}else{
			liclass = 'tabs-list-wrap-li-chat-offline';
		};
		return liclass;
	}
};
//设置聊天窗口标题
function setDialogTitle(text){
	if(text.indexOf("@im.on-con.com") != -1) {
		$(".dialog-title").text(text.substring(0, text.indexOf('@')));
	}else{
		$(".dialog-title").text(text);
	}
};
//获取右键菜单栏
function getMenu(owerAffiliation,affiliation,jid,roomId,text){
	//群成员右键菜单栏
	var items = null;
	//alert(text);
	if('10'==owerAffiliation){
		if('10'==affiliation){
			items=[
				{
					label:'修改群昵称',
					action:function(){
						changeNickNameRoom(jid,affiliation,roomId);
					}
				}
			];
		}else if('20'==affiliation){
			items=[
				{label:'修改群昵称',
					action:function(){
						changeNickNameRoom(jid,affiliation,roomId);
					}
				},
				{label:'取消管理员',
					action:function(){
						changeRosterManger('cancelRoomAdmin',jid,roomId,'member',text);
					}
				},
				{label:'踢出群',
					action:function(){
						changeRosterManger('kickRoomRoster',jid,roomId,'none',text);
					}
				},
				{label:'查看资料',
					action:function(){
						lookFriend(jid);
					}
				}
			];

		}else if('30'==affiliation){
			items=[
				{label:'修改群昵称',
					action:function(){
						changeNickNameRoom(jid,affiliation,roomId);
					}
				},
				{label:'提升管理员',
					action:function(){
						changeRosterManger('giveRoomAdmin',jid,roomId,'admin',text);
					}
				},
				{label:'踢出群',
					action:function(){
						changeRosterManger('kickRoomRoster',jid,roomId,'none',text);
					}
				},
				{label:'查看资料',
					action:function(){
						lookFriend(jid);
					}
				}
			];
		}
	}else if('20'==owerAffiliation){
		if('10'==affiliation||'20'==affiliation){
			items=[
				{label:'查看资料',
					action:function(){
						lookFriend(jid);
					}
				}
			];
		}else if('30'==affiliation){
			items=[
				{label:'修改群昵称',
					action:function(){
						changeNickNameRoom(jid,affiliation,roomId);
					}
				},
				{label:'踢出群',
					action:function(){
						changeRosterManger('kickRoomRoster',jid,roomId,'none',text);
					}
				},
				{label:'查看资料',
					action:function(){
						lookFriend(jid);
					}
				}
			];
		}
	}else if('30'==owerAffiliation){
		if(jid==opener.Ext.bare_jid){
			items=[
				{label:'修改群昵称',
					action:function(){
						changeNickNameRoom(jid,affiliation,roomId);
					}
				},
				{
					label:'查看资料',
					action:function(){
						lookFriend(jid);
					}
				}
			];
		}else{
			items=[
				{
					label:'查看资料',
					action:function(){
						lookFriend(jid);
					}
				}
			];
		}
	};
	return items;
};
//通过roomid和jid获取群成员昵称
function getRoomMemberNicKName(roomId,jid){
	var text = null;
	var jidRoom = roomId+'room';
	//获取群成员div
	var asideGroup = $(".aside-group[data-roomid='"+jidRoom+"']");
	var li = asideGroup.find("li[data-id='"+jid+"']");
	if(li.length>0){
		var nickname = li.find('a').text();
		text = nickname;
	};
	return text;
};
//通过room的名称获取room的真实id(roomid)
function getRealRoomId(roomId){
	var li = $("#room-lists li[data-id='"+roomId+"']");
	var realRoomId = li.attr('data-roomid');
	return realRoomId;
};
//提升、取消管理员、踢出群
function changeRosterManger(type,jid,roomId,other,text){
	// 提升管理员
	if(type=='giveRoomAdmin'){
		opener.Ext.webIM.setRoomRosterRole(type, jid, roomId, other,text);
	}else if(type=='cancelRoomAdmin'){//取消管理员
		opener.Ext.webIM.setRoomRosterRole(type, jid, roomId, other,text);
	}else if(type=='kickRoomRoster'){//踢出群
		//alert(text);
		/*if(!confirm('是否将该成员提出群')){
		 return false;
		 }else{
		 opener.Ext.webIM.setRoomRosterRole(type,jid,roomId,other);
		 }*/
		var id = 'kickOutRoom';
		//设置参数数组
		var parames = [type,jid,roomId,other,text,id];
		//设置提示窗口内容
		var content = '确定将【'+text+'】踢出群?';
		setConfirmTip(content,'确定','取消','kickOutRoom',parames);
		dialog({
			id:id,
			title:null,
			content:document.getElementById('myDialogTips'),
			padding:0,
			width:300
		}).showModal();

	}

};
//修改群昵称
function changeNickNameRoom(jid,affiliation,roomId){
	var id = 'chNickName4A';
	//设置参数数组
	var parames = [jid,affiliation,roomId];
	changeNickNameTip(id,parames);
	//邀请入群操作
	dialog({
		id:id,
		title:null,
		content:document.getElementById('chNickNameTip'),
		padding:0,
		width:300
	}).showModal();
};
//查看资料
function lookFriend(jid){
	var username = jid.substring(0,jid.lastIndexOf('@'));
	sessionStorage.setItem('roomResterName',username);
	sessionStorage.setItem('roomResterJid',jid);
	sessionStorage.setItem('roomService',opener.Ext.service_plugin_url);
	var winName = '群好友资料'+jid;
	var obj = new Object();
	obj.winName = winName;
	obj.winValue = window.open('RoomFriendDetailPanel.html',winName,'height=340,width=420');
	var flag = contains(FriendDataArray,winName);
	if(!flag){
		FriendDataArray.push(obj);
	};
};
//ajax 昵称修改
function  changeNickNameFun(jid,affiliation,roomId,newName){
	var roomJID = roomId+opener.Ext.room_suffix;
	var url = opener.Ext.service_plugin_url+'myroom/changenick';
	var dataParam = 'jid='+jid+'&affiliation='+affiliation+'&roomId='+roomId+'&roomJID='+roomJID+'&newName='+newName;
	$.ajax({
		type:'POST',
		url:url,
		async: false,
		data: dataParam,
		dataType:'json',
		success:function(resp,option){
		},
		error:function(resp){
			alert('查询数据失败!');
		}
	});
};
//文件和图片提示
function filePictureTip(obj){
	obj.attr('title','点击文件名称下载');
};
//双击窗口图片
function lookImage(img){
	//没有图片直接返回
	if(img.length<1){
		return ;
	}else{
		//循环遍历图片
		img.each(function(){
			var me = $(this);
			var src = me.attr('src');
			var bqFlag = src.indexOf('resources/editor/plugins/emoticons/images') > 0;
			//判断是否是表情图片
			if(bqFlag){
				var path = getProtectPath();
				var newSrc = src.replace('localProjectPath-bqPic',path);
				me.attr('src',newSrc);
				return true;
			}else{//不是表情图片
				me.attr('title','点击右键保存');
				me.mouseover(function(){
					$(this).css("border","1px solid black");
				});
				me.mouseout(function(){
					$(this).css("border","none");
				});
				//双击打开图片查看页面
				me.unbind('dblclick').bind('dblclick',function(e){
					var src = $(this).attr('src');
					var url = '../imgView/ImageView.html?url='+src;
					var img = new Image();
					img.src = src;
					img.onload = function(){
						var w = 550, h=450;
						var width = img.width<w?w:img.width;
						var height = img.height<h?h:img.height+32;
						var param = 'width='+width+',height='+height+',z-look=yes,scrollbars=no,resizable=no,alwaysRaised=yes';
						var winName = '图片查看'+url;
						var obj = new Object();
						obj.winName = winName;
						obj.winValue = window.open(url,winName,param);
						var flag = contains(imgArray,winName);
						if(!flag){
							imgArray.push(obj);
						}
					};
				});
				var image = me;
				//右键图片保存
				var items=[
					{
						label:'另存为',
						action:function(){
							saveImage(image);
						}
					}
				];
				image.contextPopup({
					items: items
				});
			}
		});
	};
};
//右键保存图片
function saveImage(img){
	var url = img.attr('src');
	url = url+'&type=pic';
	document.location = url;
};
//获取聊天窗口皮肤样式
function getSkin(){
	var skin = $("#link-skin").attr("href");
	return skin;
};
//通过房间名称获取文件上传窗口
function getFileShareWin(roomId){
	var obj = null;
	var winName  =  '文件上传窗口'+roomId;
	var len = WinArray.length;
	if(len>0){
		for(var i=0;i<len;i++){
			var win = WinArray[i];
			var name = win.winName;
			if(winName == name){
				obj = win;
			}
		}
	};
	return obj;
};
//循环关闭文件上传窗口
function fileShareWinClose(){
	var len = WinArray.length;
	if(len>0){
		for(var i=0;i<len;i++){
			var win = WinArray[i];
			var winValue = win.winValue;
			if(undefined!=winValue&&winValue!=null||!winValue.closed){
				winValue.close();
			}
		}
	}
};
//循环关闭好友资料查看窗口
function friendDataWinClose(){
	var len = FriendDataArray.length;
	if(len>0){
		for(var i=0;i<len;i++){
			var win = FriendDataArray[i];
			var winValue = win.winValue;
			if(undefined!=winValue&&winValue!=null||!winValue.closed){
				winValue.close();
			}
		}
	}
};
//循环关闭图片查看窗口
function imgViewWinClose(){
	var len = imgArray.length;
	if(len>0){
		for(var i=0;i<len;i++){
			var win = imgArray[i];
			var winValue = win.winValue;
			if(undefined!=winValue&&winValue!=null||!winValue.closed){
				winValue.close();
			}
		}
	}
};
//获取聊天窗口皮肤样式
function getSkin(){
	var skin = $("#link-skin").attr("href");
	return skin;
};

function changeCurrentSkin(winSkinNow){
	//修改聊天窗口样式
	$("#link-skin").attr("href",winSkinNow);
	var WinLen = WinArray.length;
	var FriendLen = FriendDataArray.length;
	if(WinLen>0){
		for(var i=0;i<WinLen;i++){
			var win = WinArray[i];
			var winValue = win.winValue;
			if(undefined!=winValue&&winValue!=null||!winValue.closed){
				changeChildWinSkin(winValue);
			}
		}
	};
	if(FriendLen>0){
		for(var i=0;i<FriendLen;i++){
			var win = FriendDataArray[i];
			var winValue = win.winValue;
			if(undefined!=winValue&&winValue!=null||!winValue.closed){
				changeChildWinSkin(winValue);
			}
		}
	}
};
//修改子窗口样式
function changeChildWinSkin(win){
	//获取当前聊天窗口样式
	var currentSkin = $("#link-skin").attr("href");
	//获取子窗口样式
	var childWinSkin = win.$("#link-skin").attr('href');
	var skin = null;
	var Skins = currentSkin.split('../');
	var len = Skins.length;
	if(len>0){
		for(var i=0;i<len;i++){
			var str = Skins[i];
			if(str.indexOf('skin1')>0||str.indexOf('skin2')>0){
				skin = str.split('/')[2];
			}
		}
	};
	if(null!=skin){
		if(skin=='skin1'){
			childWinSkin = childWinSkin.replace("skin2","skin1");

		}else if(skin=='skin2'){
			childWinSkin = childWinSkin.replace("skin1","skin2");
		};
		win.$("#link-skin").attr("href",childWinSkin);
	}
};
//设置确认提示窗口内容
function setConfirmTip(content,ok,canel,type,parames){
	//设置提示窗口内容
	$("#confirmContent").text(content);
	$("#confirm-dialog-btn-ok").text(ok);
	$("#confirm-dialog-btn-cancel").text(canel);
	//设置点击事件促发方法
	if('quitRoom'==type){
		confirmQuitRoom(parames);
	}else if('closeWin'==type){
		closeChatDialog(parames);
	}else if('kickOutRoom'==type){
		kickOutRoom(parames);
	}else if('removeFile'==type){
		removeFile(parames);
	}
};
//删除共享文件点击事件
function removeFile(parames){
	var newTr = parames[0];
	var realRoomId = parames[1];
	var roomId = parames[2];
	var file_id = parames[3]
	var dialogId = parames[4];
	var title = parames[5];
	//设置标题
	$("#confirmTitle").text(title);
	//确定点击事件
	$("#confirm-dialog-btn-ok").unbind().bind('click',function(){
		removeShareFile(newTr,realRoomId,file_id);
		var mydialog = dialog.get(dialogId);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//取消点击事件
	$("#confirm-dialog-btn-cancel").unbind().bind('click',function(){
		var mydialog = dialog.get(dialogId);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//X点击事件
	$("#confirmBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(dialogId);
		if(mydialog){
			mydialog.close().remove();
		}
	});
};
//设置提示窗口内容 alert
function setAlertTip(content,ok,id){
	//设置提示窗口内容
	$("#artContent").text(content);
	$("#art-dialog-btn-ok").text(ok);
	//点击确定关闭
	$("#art-dialog-btn-ok").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//点击X关闭
	$("#artBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});

};
//踢出群提示窗口点击事件
function kickOutRoom(parames){
	//获取参数
	var type = parames[0];
	var jid = parames[1];
	var roomId = parames[2];
	var other = parames[3];
	var text = parames[4];
	var id = parames[5];
	//确定点击事件
	$("#confirm-dialog-btn-ok").unbind().bind('click',function(){
		opener.Ext.webIM.setRoomRosterRole(type,jid,roomId,other);
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//取消点击事件
	$("#confirm-dialog-btn-cancel").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//X点击事件
	$("#confirmBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
};
//关闭对话窗口提示框点击事件
function closeChatDialog(parames){
	var id = parames[0];
	var title = parames[1];
	//设置标题
	$("#confirmTitle").text(title);
	//关闭所有点击事件
	$("#confirm-dialog-btn-ok").unbind().bind('click',function(){
		gui.Window.get().close();
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//关闭当前点击事件
	$("#confirm-dialog-btn-cancel").unbind().bind('click',function(){
		closeCurrentWin();
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//X点击事件
	$("#confirmBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
};
//退出群 提示框点击事件
function confirmQuitRoom(parames){
	var roomId = parames[0];
	var affiliation = parames[1];
	var id = parames[2];
	var title = parames[3];
	//设置标题
	$("#confirmTitle").text(title);
	//确定点击事件
	$("#confirm-dialog-btn-ok").unbind().bind('click',function(){
		var url = opener.Ext.service_plugin_url+'myroom/quitroom';
		var data = 'jid='+opener.Ext.bare_jid+'&affiliation='+affiliation+'&roomId='+roomId+'&roomJID='+roomId+opener.Ext.room_suffix;
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
	});
	//取消点击事件
	$("#confirm-dialog-btn-cancel").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//X点击事件
	$("#confirmBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
};
//修改群昵称窗口点击事件
function changeNickNameTip(id,parames){
	var jid = parames[0];
	var affiliation = parames[1];
	var roomId = parames[2];
	//确定点击事件
	$("#chNickName-btn-ok").unbind().bind('click',function(){
		var value = $("#chNickName").val();
		if(''==value){
			$("#chNickName").focus();
		}else{
			changeNickNameFun(jid,affiliation,roomId,value);
			var mydialog = dialog.get(id);
			if(mydialog){
				mydialog.close().remove();
			}
		}
	});
	//取消点击事件
	$("#chNickName-btn-cancel").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
	//X点击事件
	$("#chNickNameBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
};

//邀请入群窗口事件
function joinRoomTip(id,parames){
	var roomId = parames[0];
	var text = parames[1];
	//确定点击事件
	$("#joinRoom-btn-ok").unbind().bind('click',function(){
		var value = $("#joinRoom4A").val();
		if(''==value){
			$("#joinRoom4A").focus();
		}else{
			opener.Ext.webIM.inviteJoinRoom(roomId+opener.Ext.room_suffix,text,value+opener.Ext.login_suffix);
			var mydialog = dialog.get(id);
			if(mydialog){
				mydialog.close().remove();
			}
		}
	});
	//X点击事件
	$("#joinRoomBtn-close").unbind().bind('click',function(){
		var mydialog = dialog.get(id);
		if(mydialog){
			mydialog.close().remove();
		}
	});
};
//收到文件消息添加图片样式
function setFileMsgPic(obj,html){
	var fileId = obj.attr('data-fileid');
	var fname = obj.text();
	var fnameStr = opConStr(fname,34);
	var fsize = obj.attr('data-fsize');
	var transfer = $("<div></div>",{'class':'transfer','data-fileid':fileId,'title':fname});
	var transferTop = $("<div></div>",{'class':'transfer-top'}).appendTo(transfer);
	var transferTop1 = $("<div></div>",{'class':'success-bg bg-container float-left','data-fileid':fileId}).appendTo(transferTop);
	var transferTop2 = $("<div></div>",{'class':'transfer-top-content float-left'}).appendTo(transferTop);
	var transferFileName = $("<div></div>",{text:fnameStr}).appendTo(transferTop2);
	var transferFileSize = $("<div></div>",{text:fsize}).appendTo(transferTop2);
	var clearfix1 = $("<div></div>",{'class':'clearfix'}).appendTo(transfer);
	var transfer_line = $("<div></div>",{'class':'transfer-line'}).appendTo(transfer);
	var transfer_line_already = $("<div></div>",{'class':'transfer-line-already','width':'100%'}).appendTo(transfer_line);
	var transfer_footer = $("<div></div>",{'class':'transfer-footer-success'}).appendTo(transfer);
	var span = $("<span></span>",{text:'已发送'}).appendTo(transfer_footer);
	transfer_footer.append(html);
	transfer_footer.find('a').text('下载');
	var clearfix2 = $("<div></div>",{'class':'clearfix'}).appendTo(transfer);
	return transfer;
};
//计算字符串长度
function opConStr(val,num){
	var len = 0;
	var index = 0;
	var subStr = '';
	for (var i = 0; i < val.length; i++) {
		var char = val.charCodeAt(i);
		if(char>255){
			len += 2;
		}else{
			len += 1;
		};
		if(len>=num){
			index = i;
			break;
		};

	};
	if(index>0){
		subStr = val.substring(0,index)+'...';
	}else{
		subStr = val;
	};
	return subStr;
};
function getProtectPath(){
	var fs = require('fs');
	// 点号表示当前文件所在路径
	var path = fs.realpathSync('.');
	path = path.replace(/\\/g, '/');
	return path;
};
//获取参数
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};