

function stq_setAttr(targetElementId,attrsStr){
	eval("var attrs = "+attrsStr+";");
	for(var key in attrs){
		var value = attrs[key];
		jQuery(targetElementId).attr(key,value);
	}
}

function stq_toggle(targetElementId){
	jQuery(targetElementId).toggle();
}

function stq_remove(targetElementId){
	jQuery(targetElementId).remove();
}

function stq_html(targetElementId){
	jQuery(targetElementId).html("");
}

function stq_appendChild(targetElementId,htm){
	jQuery(targetElementId).append(htm);
}

function stq_appendChildPre(targetElementId,htm){
	jQuery(targetElementId).prepend(htm);
}

function stq_after(targetElementId,htm){
	jQuery(targetElementId).after(htm);
}

function stq_none(targetElementId){
	jQuery(targetElementId).addClass("none");
}
function stq_block(targetElementId){
	jQuery(targetElementId).removeClass("none");
}
function stq_text(targetElementId,text){
	jQuery(targetElementId).text(text);
}
function stq_txtToggle(targetElementId,text){
	var arys = eval("("+text+")");
	var txt = jQuery.trim(jQuery(targetElementId).text());
	for(var i=0,len=arys.length;i<len;i++){
		if(txt==arys[i]){
			if(i==len-1){
				jQuery(targetElementId).text(jQuery.trim(arys[0]));
			}else{
				jQuery(targetElementId).text(jQuery.trim(arys[i+1]));
			}
			break;
		}
	}
}

function stq_close(){
	window.close();
}
//数据后处理，js处理存在缺陷，使用 java代码处理，此类问题
function stq_transform(targetElementId,type){
	try{
		var val = jQuery(targetElementId).val();
		if(val==""||val ==undefined){
			val = jQuery(targetElementId).text();
			if(val!=""&&val!=undefined){
				if(type==18){
					jQuery(targetElementId).text(val*100);
				}else if(type==19){
					jQuery(targetElementId).text((val/100).toFixed(2));
				}else if(type==20){
					var datetarget = val.substring(0,4)+"-"+val.substring(4,6)+"-"+val.substring(6,8)+" "+val.substring(8,10)+":"+val.substring(10,12)+":"+val.substring(10,12);
					jQuery(targetElementId).text(datetarget);
				}
			}else{
				val = $("[protoid="+targetElementId.substr(1)+"]");
				if(val.length>0){
					for(var i =0;i<val.length;i++){
						var tempval = val.get(i).innerText;
						if(tempval!=""&&tempval !=undefined){
							if(type==18){
								jQuery("[protoid="+targetElementId.substr(1)+"]").get(i).innerText=tempval*100;
							}else if(type==19){
								jQuery("[protoid="+targetElementId.substr(1)+"]").get(i).innerText=(tempval/100).toFixed(2);
							}else if(type==20){
								var datetarget = tempval.substring(0,4)+"-"+tempval.substring(4,6)+"-"+tempval.substring(6,8)+" "+tempval.substring(8,10)+":"+tempval.substring(10,12)+":"+tempval.substring(10,12);
								jQuery("[protoid="+targetElementId.substr(1)+"]").get(i).innerText=datetarget;
							}
						}else{
							tempval = val.get(i).value;
							if(type==18){
								jQuery("[protoid="+targetElementId.substr(1)+"]").get(i).value=tempval*100;
							}else if(type==19){
								jQuery("[protoid="+targetElementId.substr(1)+"]").get(i).value=(tempval/100).toFixed(2);
							}else if(type==20){
								var datetarget = tempval.substring(0,4)+"-"+tempval.substring(4,6)+"-"+tempval.substring(6,8)+" "+tempval.substring(8,10)+":"+tempval.substring(10,12)+":"+tempval.substring(10,12);
								jQuery("[protoid="+targetElementId.substr(1)+"]").get(i).value=datetarget;
							}
						}
					}
				}
				

			}
		}else{	
			if(type==18){
				jQuery(targetElementId).val(val*100);
			}else if(type==19){
				jQuery(targetElementId).val((val/100).toFixed(2));
			}else if(type==20){
				var datetarget = val.substring(0,4)+"-"+val.substring(4,6)+"-"+val.substring(6,8)+" "+val.substring(8,10)+":"+val.substring(10,12)+":"+val.substring(10,12);
				jQuery(targetElementId).val(datetarget);
			}
		}
    }catch(e){
        alert("文本转换出错");
        return false;
    }
	
}

function stq_print(targetElementId,func){
	eval(func+'()');
}
function stq_copy(targetElementId,modalElementId){
	try{
	if($("#"+modalElementId).attr("copy_sign")!=1){
		alert("对象不是被复制源!");
		return;
	}
	var id = getGUID();
	var container = $("#"+modalElementId).clone();
	$(container).attr("id",id);
	$(container).css("display","");
	$(container).attr("copy_sign","0");
	$(container).attr("protoid",$("#"+modalElementId).attr("id"));
	$(container).appendTo(targetElementId);
	
	var tmpId;
	$("#"+id+" [id]").each(function(i,item){
		tmpId = item.id;
		$(this).die();
		$(this).attr("protoid",tmpId);
		$(this).attr("__index",id);
		$(this).removeAttr("id");
	});
	return container;
	}catch(e){
		alert(e);
	}	
}

function stq_template(targetElementId,template){
	var event =  window.event;
	var srcObj = event.target  ||  event.srcElement;
	var scrope = $(srcObj).parents('[copy_sign=0]');
	var copyFlag = scrope.length>0;
	//根据变量名去元素id
	var reg = /\${([\w\.]*)\}|<#list\s+(.+?)\s+as.+?>/g;
	var ids = {};
	var match;
	while(( match= reg.exec(template)) != null){
		var name = match[1]||match[2];
		var objs = $("[name='"+name+"'][id]");
		if(objs.length<=0&&copyFlag){
			objs = scrope.find("[name='"+name+"'][protoid]");
		}
		if(objs.length>0){
			for(var i =0;i<objs.length;i++){
				objs[i].id = objs[i].id||getGUID();
				ids[objs[i].id]=0;
			}
		}
	}
	var idsArray = [];
	for(var id in ids){
		idsArray.push(id);
	}
	var data = getParamElementsValues(idsArray);
	var resultStr = easyTemplate(template,data).toString();
	var target = jQuery(targetElementId);
	target.text(resultStr);
	
}


var easyTemplate = function(s,d){
	if(!s){return '';}
	if(s!==easyTemplate.template){
		easyTemplate.template = s;
		easyTemplate.aStatement = easyTemplate.parsing(easyTemplate.separate(s));
	}
	var aST = easyTemplate.aStatement;
	var process = function(d2){
		if(d2){d = d2;}
		return arguments.callee;
	};
	var p = easyTemplate.params(d);//将参数变为变量
	process.toString = function(){
		//var funcName = new Function( [argname1, [... argnameN,]] body );
		var func = new Function(aST[0],p+aST[1]);
		return func().replace(/<br\/>/g,'\n\r');
	};
	return process;
};
easyTemplate.params =  function( a ) {
	var s = [];
	for ( var prefix in a ) {
		var value = a[ prefix ];
		s[ s.length ] = "var " + prefix  + "=" + ( jQuery.isArray(value) ?"['"+ value.join("','")+"']": "'"+value+"'");
	}
	return s.join( ";" )+";";
};
easyTemplate.separate = function(s){
	var r = /\\'/g;
	var sRet = s.replace(/(<(\/?)#(.*?(?:\(.*?\))*)>)|(')|([\r\n\t])|(\$\{([^\}]*?)\})/g,function(a,b,c,d,e,f,g,h){
		//================b=c=====d===================e===f==========g====h====
		if(b){return '{|}'+(c?'-':'+')+d+'{|}';}
		if(e){return '\\\'';}
		if(f){return '<br/>';}
		if(g){return '\'+('+h.replace(r,'\'')+')+\'';}
	});
	return sRet;
};
easyTemplate.parsing = function(s){
	var mName,vName,sTmp,aTmp,sFL,sEl,aList,aStm = ['var aRet = [];'];
	aList = s.split(/\{\|\}/);
	var r = /\s/;
	while(aList.length){
		sTmp = aList.shift();
		if(!sTmp){continue;}
		sFL = sTmp.charAt(0);
		if(sFL!=='+'&&sFL!=='-'){
			sTmp = '\''+sTmp+'\'';aStm.push('aRet.push('+sTmp+');');
			continue;
		}
		aTmp = sTmp.split(r);
		switch(aTmp[0]){
			case '+if':aTmp.splice(0,1);aStm.push('if'+aTmp.join(' ')+'{');break;
			case '+elseif':aTmp.splice(0,1);aStm.push('}else if'+aTmp.join(' ')+'{');break;
			case '-if':aStm.push('}');break;
			case '+else':aStm.push('}else{');break;
			case '+list':aStm.push('if('+aTmp[1]+'&&'+aTmp[1]+'.constructor === Array){with({i:0,l:'+aTmp[1]+'.length,'+aTmp[3]+'_index:0,'+aTmp[3]+':null}){for(i=l;i--;){'+aTmp[3]+'_index=(l-i-1);'+aTmp[3]+'='+aTmp[1]+'['+aTmp[3]+'_index];');break;
			case '-list':aStm.push('}}}');break;
			default:break;
		}
	}
	aStm.push('return aRet.join("");');
	return [vName,aStm.join('')];
};
