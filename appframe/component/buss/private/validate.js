/*!
 * jQuery Validation Plugin v1.13.1
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2014 Jörn Zaefferer
 * Released under the MIT license
 */
(function(factory) {
	if (typeof define === "function" && define.amd) {
		define([ "../open/jquery.validate" ], factory);
	} else {
		factory(jQuery);
	}
}(function() {
			$.validator.addMethod("pattern", function(value, element, param) {
				if (this.optional(element)) {
					return true;
				}
				if (typeof param === "string") {valid()
					param = new RegExp("^(?:" + param + ")$");
				}
				return param.test(value);
			});
			$.validator.addMethod("patrn", function(value, element, param) {
				if (this.optional(element)) {
					return true;
				}
				if (typeof param === "string") {
					if (getDateFromFormat(value, param) == 0)
						return false;
				}
				return true;
			});
			$.validator.addClassRules({
						remotechecks : {
							required : true,
							remote : {
								url : "/demo1/emp/remote.do",// 远程校验访问的路径
								type : "post",
								dataType : 'json',
								data : {
									checkphone : function() {
										return $("#phone").val();
									}
								}
							},
							messages : {
								required : "不能为空",
								remote : "输入的手机号码有误"
							}
						},
						shortNo : {// 必填选项
							required : true
						},
//						email : {
//							email : true,
//							messages : {
//								email : "邮件地址不合法"
//							}
//						},
					    email: {
					    	pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
					    	messages: {
					    		pattern : "邮件地址不合法"
							}
					    },
						url : {
							url : true,
							messages : {
								url : "网址不合法"
							}
						},
						urlDomain : {
							pattern : /^[^@-]+\.com(\.cn)?$/,
							messages : {
								pattern : "域名不合法"
							}
						},
						commonDomain : {// 域名
							pattern : /(^[A-Za-z0-9\u4e00-\u9fa5]+)((\-([A-Za-z0-9\u4e00-\u9fa5]+))?)(\.([A-Za-z0-9\u4e00-\u9fa5]+)((\-([A-Za-z0-9\u4e00-\u9fa5]+))?))+$/,
							messages : {
								pattern : "域名不合法"
							}
						},
						subDomain : {// 子域名,域名首不能包含www.
							pattern : /^(?:(?!(www\.))([A-Za-z0-9\u4e00-\u9fa5]+)((\-([A-Za-z0-9\u4e00-\u9fa5]+))?))(\.([A-Za-z0-9\u4e00-\u9fa5]+)((\-([A-Za-z0-9\u4e00-\u9fa5]+))?))+$/,
							messages : {
								pattern : "子域名不合法,域名首不能包含www."
							}
						},
						wapDomian : {// WAP域名
							pattern : /^([A-Za-z0-9])+\.?([A-Za-z0-9])+$/,
							messages : {
								pattern : "WAP域名不合法"
							}
						},
						mastId : {// masId
							pattern : /^M.{2}AH.{9}$/,
							messages : {
								pattern : "masId不合法"
							}
						},
						masStandard : {// MAS标准代码
							pattern : /^MAH\d{7}$/,
							messages : {
								pattern : "MAS标准代码不合法"
							}
						},
						mas06Standard : {// MAS标准代码
							pattern : /^M06AH\d{9}$/,
							messages : {
								pattern : "MAS标准代码不合法"
							}
						},
						lineSpeed : {// 宽带
							pattern : /^[2468]$|^[1-9][02468]$|^1[0-4][02468]|^15[024]$/,
							messages : {
								pattern : "宽带不合法"
							}
						},
						scale : {// 比例输入
							scaleCheck : "true",
							messages : {
								scaleCheck : "比例输入不合法"
							}
						},
						HHmm : {// 时间格式为HHmm
							pattern : /^([0-1][0-9]|[2][0-3])[0-5][0-9]$/,
							messages : {
								pattern : "时间格式为HHmm"
							}
						},
						shortNo : {// 短号格式以61-69开头
							pattern : /^[6][1-9]\d{4}$/,
							messages : {
								pattern : "短号格式以61-69开头"
							}
						},
						dateFormat : {// 日期格式MM/DD/YYYY
							pattern : /^\d{2}\/\d{2}\/\d{2,4}$/,
							messages : {
								pattern : "日期格式MM/DD/YYYY"
							}
						},
						upLetter : {// 必须为大写英文字母
							pattern : /^[A-Z]+$/,
							messages : {
								pattern : "必须为大写英文字母"
							}
						},
						lowLetter : {// 必须为小写英文字母
							pattern : /^[a-z]+$/,
							messages : {
								pattern : "必须为小写英文字母"
							}
						},
						allLetter : {// 必须为英文
							pattern : /^[A-Za-z]+$/,
							messages : {
								pattern : "必须为英文"
							}
						},
						numOrLetter : {// 必须为英文或数字
							pattern : /^[A-Za-z0-9]+$/,
							messages : {
								pattern : "必须为英文或数字"
							}
						},
						numAndLetter : {// 必须为数字和字母的混合
							pattern : /^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/,
							messages : {
								pattern : "必须为数字和字母的混合"
							}
						},
						numLetterChinese : {// 必须为英文,数字或汉字
							pattern : /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
							messages : {
								pattern : "必须为英文,数字或汉字"
							}
						},
						postCode : {// 邮政编码
							pattern : /^[0-9]{1}(\d){5}$/,
							messages : {
								pattern : "邮政编码格式错误"
							}
						},
						commonPhone : {// 校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
							pattern : /^[+]{0,1}((0(\d{2}))?([-]{0,1})([1-9]\d{7})|(0(\d{3}))?([-]{0,1})([1-9]\d{6,7}))$/,
							messages : {
								pattern : "电话号码格式错误"
							}
						},
						andCellphone : {// 校验手机、固话、传真号码：可以“+”开头，除数字外，可含有“-”
							pattern : /^[+]{0,1}(\d{3,4})?([-]{0,1})?(\d{7,8})$/,
							messages : {
								pattern : "电话号码格式错误"
							}
						},
						cellPhone : {// 服务号码格式
							pattern : /^[^\u4e00-\u9fa5]{0,}$/,
							messages : {
								pattern : "服务号码格式错误"
							}
						},
						allCellPhone : {// 手机号码格式
							pattern : /^((\(\d{3}\))|(\d{3}\-))?[12][03458]\d{9}$/,
							messages : {
								pattern : "手机号码格式错误"
							}
						},
						forTelecom : {// 电信手机号码
							pattern : /^1[358][39]\d{8}$/,
							messages : {
								pattern : "不是电信手机号码"
							}
						},
						forUnicom : {// 联通手机号码
							pattern : /^1[35][0126]\d{8}$/,
							messages : {
								pattern : "不是联通手机号码"
							}
						},
						forMobile : {// 移动手机号码
							pattern : /^1[358][4-9]\d{8}$/,
							messages : {
								pattern : "不是移动手机号码"
							}
						},
						forPhoneNo : {// 移动宽带合法的号码
							pattern : /^([A-Z0-9]){11}$/,
							messages : {
								pattern : "不是合法的号码"
							}
						},
						ipAddress : {// IP地址
							pattern : /^([1-9]|[1-9]\d|(1[0-1|3-9]\d|12[0-6|8-9]|2[0-3]\d|24[0-7]))(\.(\d|[1-9]\d|(1\d{2}|2([0-4]\d|5[0-5])))){3}$/,
							messages : {
								pattern : "IP地址错误"
							}
						},
						num_letter : {// 必须为数字,英文和下划线
							pattern : /^\w+$/,
							messages : {
								pattern : "必须为数字,英文和下划线"
							}
						},
						idCard : {// 校验身份证号码
							idCardCheck : "true",
							messages : {
								idCardCheck : function() {
									switch (flag) {
									case 0:
										return "号码位数不对";
									case 1:
										return "号码出生日期错误或含有非法字符";
									case 2:
										return "号码校验错误";
									case 3:
										return "地区非法";
									}
								}
							}
						},
						haveSpeForAll : {
							haveSpeForAllCheck : "\\/><\'\"&#",
							messages : {
								haveSpeForAllCheck : "不能输入\\ / < > \' \" & #等字符"
							}
						},
						isServ : {
							pattern : /^[s]{1}([0-9]|[a-zA-Z]){0,}$/,
							messages : {
								pattern : "不符合服务名称格式"
							}
						},
						chinese : {
							pattern : /^[\u4e00-\u9fa5]+$/,
							messages : {
								pattern : "必须为汉字"
							}
						},
						letterChinese : {
							pattern : /^[A-Za-z\u4e00-\u9fa5]+$/,
							messages : {
								pattern : "必须为英文或汉字"
							}
						},
						posInt : {
							pattern : /^[0-9]*[1-9][0-9]*$/,
							messages : {
								pattern : "请输入正整数"
							}
						},
						forInt : {
							pattern : /^-?\d+$/,
							messages : {
								pattern : "必须为整数"
							}
						},
						nonNegInt : {
							pattern : /^\d+$/,
							messages : {
								pattern : "必须为非负整数"
							}

						},
						negInt : {
							pattern : /^-[0-9]*[1-9][0-9]*$/,
							messages : {
								pattern : "必须为负整数！"
							}
						},
						notNegReal : {
							pattern : /^[0-9]+((\.{1}?[0-9]{1,13})|(\.{0}?[0-9]{0}))?$/,
							messages : {
								pattern : "必须为非负实数！"
							}
						},
						forReal : {
							pattern : /^([-]{0,1})?[0-9]+((\.{1}?[0-9]{1,13})|(\.{0}?[0-9]{0}))?$/,
							messages : {
								pattern : "必须为实数!"
							}
						},
						yyyy : {
							patrn : "yyyy",
							messages : {
								patrn : "日期格式为yyyy"
							}
						},
						HHmmss : {
							patrn : "HHmmss",
							messages : {
								patrn : "日期格式为HHmmss"
							}
						},
						yyyyMMddHHmmss : {
							patrn : "yyyyMMddHHmmss",
							messages : {
								patrn : "日期格式为yyyyMMddHHmmss"
							}

						},
						speyyyyMMddHHmmss : {
							patrn : "yyyyMMdd HH:mm:ss",
							messages : {
								patrn : "日期格式为yyyyMMdd HH:mm:ss"
							}
						},
						MM : {
							patrn : "MM",
							messages : {
								patrn : "日期格式为MM"
							}
						},
						DD : {
							patrn : "dd",
							messages : {
								patrn : "日期格式为dd"
							}
						},
						yyyyMMdd : {
							patrn : "yyyyMMdd",
							messages : {
								patrn : "日期格式为yyyyMMdd"
							}
						},
						yyyyMM : {
							patrn : "yyyyMM",
							messages : {
								patrn : "日期格式为yyyyMM"
							}
						},
						yyyyMMddHH : {
							patrn : "yyyyMMddHH",
							messages : {
								patrn : "日期格式为yyyyMMddHH"
							}
						},
						lineyyyyMMdd : {
							patrn : "yyyy-MM-dd",
							messages : {
								patrn : "日期格式为yyyy-MM-dd"
							}
						},
						ColonHHmmss : {
							patrn : "HH:mm:ss",
							messages : {
								patrn : "日期格式为HH:mm:ss"
							}
						},
						lineyyyyMMddHHmmss : {
							patrn : "yyyy-MM-dd HH:mm:ss",
							messages : {
								patrn : "格式为yyyy-MM-dd HH:mm:ss"
							}
						},
						moneyFormat : {
							moneyFormatCheck : true,
							messages : {
								moneyFormatCheck : "必须为带0到2位小数的数值"
							}
						},
						multiMoneyFormat : {
							multiMoneyFormatCheck : 6, // 为小数后的位数
							messages : {
								multiMoneyFormatCheck : function() {
									if (errortype == 1) {
										return "小数点后位数不对";
									} else {
										return "必须为小数";
									}
								}
							}
						},
						for0_9 : {
							pattern : /^[0-9]*$/,
							messages : {
								pattern : "必须由数字组成"
							}
						},
						custassure : {
							custassureCheck : true,
							messages : {
								custassureCheck : function(){
									if (errortype == 0) {
										return "是黑名单客户";
									} else if(errortype == 1){
										return "该担保人已经担保过";
									}
								}
							}
						},
						isUpdate : {
							isUpdateCheck : true,
							messages : {
								isUpdateCheck : "修改后的字段不能包含*或＊"
							}
						},
						uploadFile : {
							uploadFileCheck : true,
							messages : {
								uploadFileCheck : function(){
									if (errortype == 0) {
										return "请选择要上传的文件！";
									} else if(errortype == 1){
										return "请上传后缀名正确的文件";
									}
								}
							}
						},
						compareDate : {
							compareDateCheck : true,
							messages : {
								compareDateCheck : "结束日期比开始日期早"
							}
						},
						isLengthOf:{
							isLengthOfCheck:true,
					  	messages:{
								isLengthOfCheck:"长度不在指定范围内"
							}
						},
						isSizeOf:{
							isSizeOfCheck:true,
						  	messages:{
						  		isSizeOfCheck:"输入值大小不在指定范围内"
								}
							},
						byteSize:{
						   byteSizeCheck:true,
						   messages:{
								byteSizeCheck:"输入内容的字节长度不符"
							}
						},
						samePW:{
							samePWCheck:true,
							messages:{
								samePWCheck:"密码不一致，请重新输入"
							}
						}			
			});

			// 比例输入
			$.validator.addMethod("scaleCheck", function(value, element) {
				var objArr = value.split(":");
				if (objArr.length == 2
						&& parseInt(objArr[0]) + parseInt(objArr[1]) == 100) {
					return !value
							|| /^([0-9]|[1-9][0-9]):([0-9]|[1-9][0-9])$/
									.test(value);
				} else {
					return false;
				}
			});

			// 身份证号码
			$.validator.addMethod(
							"idCardCheck",
							function(value, element) {
								var idcard, Y, JYM;
								var S, M;
								var aCity = {
									11 : "北京",
									12 : "天津",
									13 : "河北",
									14 : "山西",
									15 : "内蒙古",
									21 : "辽宁",
									22 : "吉林",
									23 : "黑龙江 ",
									31 : "上海",
									32 : "江苏",
									33 : "浙江",
									34 : "安徽",
									35 : "福建",
									36 : "江西",
									37 : "山东",
									41 : "河南",
									42 : "湖北 ",
									43 : "湖南",
									44 : "广东",
									45 : "广西",
									46 : "海南",
									50 : "重庆",
									51 : "四川",
									52 : "贵州",
									53 : "云南",
									54 : "西藏 ",
									61 : "陕西",
									62 : "甘肃",
									63 : "青海",
									64 : "宁夏",
									65 : "***",
									71 : "台湾",
									81 : "香港",
									82 : "澳门",
									91 : "国外 ",
									99 : "信息保护 "
								}
								idcard = value = value.replace(
										/(^\s*)|(\s*$)/g, "");
								if (!idcard)
									return true;
								if (aCity[parseInt(idcard.substr(0, 2))] == null) {
									flag = 3;
									return false;
								}
								var idcard_array = new Array();
								idcard_array = idcard.split("");
								switch (idcard.length) {
								case 0:
									return true;
									break;
								case 15:
									var Ai = idcard.slice(0, 6) + "19"
											+ idcard.slice(6, 16);
									if (!/^\d+$/.test(Ai))
										return 1;
									var yyyy = Ai.slice(6, 10), mm = Ai.slice(
											10, 12) - 1, dd = Ai.slice(12, 14);
									var d = new Date(yyyy, mm, dd), now = new Date();
									var year = d.getFullYear(), mon = d
											.getMonth(), day = d.getDate();
									if (year != yyyy || mon != mm || day != dd
											|| d > now) {
										flag = 1
										return false;
									}
									return true;
									break;
								case 18:
									// 18位身份号码检测
									// 出生日期的合法性检查
									// 闰年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))
									// 平年月日:((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))
									if (parseInt(idcard.substr(6, 4)) % 4 == 0
											|| (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard
													.substr(6, 4)) % 4 == 0)) {
										ereg = /^[1-9][0-9]{5}[12]\d[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; // 闰年出生日期的合法性正则表达式
									} else {
										ereg = /^[1-9][0-9]{5}[12]\d[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; // 平年出生日期的合法性正则表达式
									}
									if (ereg.test(idcard)) {
										// 测试出生日期的合法性
										// 计算校验位
										S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10]))
												* 7
												+ (parseInt(idcard_array[1]) + parseInt(idcard_array[11]))
												* 9
												+ (parseInt(idcard_array[2]) + parseInt(idcard_array[12]))
												* 10
												+ (parseInt(idcard_array[3]) + parseInt(idcard_array[13]))
												* 5
												+ (parseInt(idcard_array[4]) + parseInt(idcard_array[14]))
												* 8
												+ (parseInt(idcard_array[5]) + parseInt(idcard_array[15]))
												* 4
												+ (parseInt(idcard_array[6]) + parseInt(idcard_array[16]))
												* 2
												+ parseInt(idcard_array[7])
												* 1
												+ parseInt(idcard_array[8])
												* 6
												+ parseInt(idcard_array[9])
												* 3;
										Y = S % 11;
										M = "F";
										JYM = "10X98765432";
										M = JYM.substr(Y, 1); // 判断校验位
										if (idcard_array[17] == 'x')
											idcard_array[17] = 'X';
										if (M == idcard_array[17]) {
											return true; // 检测ID的校验位
										} else {
											flag = 2;
											return false;
										}
									} else {
										flag = 1;
										return false;
									}
									break;
								default:
									flag = 0;
									return false;
								}
							});
			$.validator.addMethod("haveSpeForAllCheck", function(value, element,
					param) {
				// console.log(param);
				if (!value)
					return true;
				return haveSpe(value);
				function haveSpe(str) {
					var comp = param + "";
					var aChar = "";
					for ( var i = 0; i < str.length; i++) {
						aChar = str.charAt(i);
						if (comp.indexOf(aChar) != -1)
							return false;
					}
					return true;
				}
			});
			$.validator.addMethod("multiMoneyFormatCheck", function(value, element,
					param) {
				var objValue = value;
				// var decNum = obj.v_decNum;
				if (!objValue)
					return true;
				if (isNaN(objValue))
					return 0;
				if (objValue.indexOf("\.") == -1) {
					errortype = 0;
					return 0;
				}
				var mArr = (objValue + "").split(".");
				if (mArr.length > 1) {
					if (mArr[1].length != param) {
						errortype = 1;
						return 0;
					}
				}
				return true;

			});
			$.validator.addMethod("moneyFormatCheck", function(value, element) {
				var objValue = value;
				if (!objValue)
					return true;
				if (isNaN(objValue))
					return false;
				var mArr = (objValue + "").split(".");
				if (mArr.length > 1) {
					if (mArr[1].length == 0 || mArr[1].length > 2)
						return false;
				}
				return true;
			});
			$.validator.addMethod("custassureCheck", function(value, element) {
				var obj = {v_flag:$(element).attr("v_flag")};
				if(obj.v_flag == "black"){
					errortype = 0;
    			return 0;
    		}else if(obj.v_flag == "idUsed"){
    			errortype = 1;
    			return 1;	
    		}else{
      		return true;
      	}
			});
			$.validator.addMethod("isUpdateCheck", function(value, element) {
				var obj = {value : $(element).attr("value"),v_olddata : $(element).attr("v_olddata")};
				if(!obj.value) return true;
 				var sInput=obj.value;
 				var sOld=obj.v_olddata;
 				if(sOld!=sInput && (sInput.indexOf("*")!=-1 || sInput.indexOf("＊")!=-1)){
 					return false;
 				}
 				return true;
			});
			$.validator.addMethod("uploadFileCheck", function(value, element) {
				var obj = {value : $(element).attr("value"),v_upType : $(element).attr("v_upType")};
				if(!obj.value) return true;
        var fileName = obj.value.replace(/^\s*/, "").replace(/\s*$/, "");
        if (fileName == "") {
        	errortype = 0;
          return 0;
        }
        else {
          var pos = fileName.lastIndexOf(".");
          if (pos != -1) {
            var suf = fileName.substring(pos + 1, fileName.length).toLowerCase();
            var upType = obj.v_upType.split(",");
            for (var i = 0; i < upType.length; i++) {
              if (upType[i] == suf) {
                return true;
              }
            }
          };
          errortype = 1;
          return 1;
        }
        return true;
			});
			$.validator.addMethod("compareDateCheck", function(value, element) {
				var obj = {v_extB : $(element).attr("v_extB"),v_extE : $(element).attr("v_extE")};
				
				var frontDate = document.getElementById(obj.v_extB);
    		var behindDate = document.getElementById(obj.v_extE);
    		if(frontDate.value!=""&&behindDate.value!=""&&frontDate.value > behindDate.value){
    			return false;
    		}else if(frontDate.value!=""&&behindDate.value!=""&&frontDate.value<behindDate.value){
    			if(frontDate.parentNode&&frontDate.parentNode.errstate){
            hideErrors(frontDate);
            frontDate.parentNode.removeAttribute("errstate");
          } 
          if(behindDate.parentNode&&behindDate.parentNode.errstate){
            hideErrors(behindDate);
            behindDate.parentNode.removeAttribute("errstate");
          } 
          return true;
    		}
    		return true;
			});
			$.validator.addMethod("isLengthOfCheck",function(value,element,param){
			var obj={v_maxlength:$(element).attr("v_maxlength"),v_minlength:$(element).attr("v_minlength")};
            var maxlen = parseFloat(obj.v_maxlength);
            var minlen = parseFloat(obj.v_minlength);
            var val=value.replace(/(^\s*)|(\s*$)/g, "");
            if (!isNaN(maxlen)) {
                if ((val+"").length > maxlen) {
                    return false;
                }
            }
            if (!isNaN(minlen)) {
                if ((val+"").length < minlen) {
                    return false;
                }
            }
            return true;
        
			});
			$.validator.addMethod("isSizeOfCheck",function(value,element,param){
				var obj={v_maxlength:$(element).attr("v_maxlength"),v_minlength:$(element).attr("v_minlength")};
	            var maxlen = parseFloat(obj.v_maxlength);
	            var minlen = parseFloat(obj.v_minlength);
	            var val=value.replace(/(^\s*)|(\s*$)/g, "");
	            if (!isNaN(val)) {
	            if (!isNaN(maxlen)) {
	                if (val > maxlen) {
	                    return false;
	                }
	            }
	            if (!isNaN(minlen)) {
	                if (val < minlen) {
	                    return false;
	                }
	            }
	            }else{
	            	return false;
	            }
	            return true;
	        
				});
			
			$.validator.addMethod("byteSizeCheck",function(value,element,param){
				var obj={v_maxlength:$(element).attr("v_maxlength"),v_minlength:$(element).attr("v_minlength")};
        if(!value) return true;
        var maxlen = parseFloat(obj.v_maxlength);
        var minlen = parseFloat(obj.v_minlength);
        var val=value.replace(/(^\s*)|(\s*$)/g, "");
        var cArr = val.match(/[^\x00-\xff]/ig);  
        var byteLen=val.length + (cArr == null ? 0 : cArr.length);  
         if (!isNaN(maxlen)) {
	          if (byteLen > maxlen) {
	             return false;
	          }
        }
        if (!isNaN(minlen)) {
          if (byteLen < minlen) {
             return false;
          }
        }
        return true;
			});
			$.validator.addMethod("samePWCheck",function(value,element,param){
				var obj={v_pw:$(element).attr("v_pw"),v_confirmPw:$(element).attr("v_confirmPw")};
	        if(!value) return true;
	        var pw = document.getElementById(obj.v_pw);
	    	  var confirmPw = document.getElementById(obj.v_confirmPw);
	    		if(pw.value!=""&&confirmPw.value!=""&&pw.value != confirmPw.value){
	    			return false;
	    		}else if(pw.value!=""&&confirmPw.value!=""&&pw.value==confirmPw.value){
	    			if(pw.parentNode&&pw.parentNode.errstate){   
							hideErrors(pw);
	            pw.parentNode.removeAttribute("errstate");
	          } 
	          if(confirmPw.parentNode&&confirmPw.parentNode.errstate){   
							hideErrors(confirmPw);
	            confirmPw.parentNode.removeAttribute("errstate");
	          } 
	            return true;
	    		}
	    		return true;
			});	
			function getDateFromFormat(val, format) {
				if (val == "")
					return 1;
				val = val + "";
				format = format + "";
				var i_val = 0;
				var i_format = 0;
				var c = "";
				var token = "";
				var token2 = "";
				var x, y;
				var now = new Date();
				var year = now.getYear();
				var month = now.getMonth() + 1;
				var date = 1;
				var hh = now.getHours();
				var mm = now.getMinutes();
				var ss = now.getSeconds();
				while (i_format < format.length) {
					// Get next token from format string
					c = format.charAt(i_format);
					token = "";
					while ((format.charAt(i_format) == c)
							&& (i_format < format.length)) {
						token += format.charAt(i_format++);
					}
					// Extract contents of value based on format token
					if (token == "yyyy") {
						x = 4;
						y = 4;
						year = getInt(val, i_val, x, y);
						if (year == null) {
							return 0;
						}
						i_val += year.length;
					} else if (token == "MM") {
						month = getInt(val, i_val, token.length, 2);
						if (month == null || (month < 1) || (month > 12)) {
							return 0;
						}
						i_val += month.length;
					} else if (token == "dd") {
						date = getInt(val, i_val, token.length, 2);
						if (date == null || (date < 1) || (date > 31)) {
							return 0;
						}
						i_val += date.length;
					} else if (token == "HH") {
						hh = getInt(val, i_val, token.length, 2);
						if (hh == null || (hh < 0) || (hh > 23)) {
							return 0;
						}
						i_val += hh.length;
					} else if (token == "mm") {
						mm = getInt(val, i_val, token.length, 2);
						if (mm == null || (mm < 0) || (mm > 59)) {
							return 0;
						}
						i_val += mm.length;
					} else if (token == "ss") {
						ss = getInt(val, i_val, token.length, 2);
						if (ss == null || (ss < 0) || (ss > 59)) {
							return 0;
						}
						i_val += ss.length;
					} else {
						if (val.substring(i_val, i_val + token.length) != token) {
							return 0;
						} else {
							i_val += token.length;
						}
					}
				}// while end
				// If there are any trailing characters left in the value, it
				// doesn't match
				if (i_val != val.length) {
					return 0;
				}
				// Is date valid for month?
				if (month == 2) {
					//  for leap year
					if (((year % 4 == 0) && (year % 100 != 0))
							|| (year % 400 == 0)) { // leap year
						if (date > 29) {
							return 0;
						}
					} else {
						if (date > 28) {
							return 0;
						}
					}
				}
				if ((month == 4) || (month == 6) || (month == 9)
						|| (month == 11)) {
					if (date > 30) {
						return 0;
					}
				}
				var newdate = new Date(year, month - 1, date, hh, mm, ss);
				return newdate.getTime();
			}
			function getInt(str, i, minlength, maxlength) {
				for ( var x = maxlength; x >= minlength; x--) {
					var token = str.substring(i, i + x);
					if (token.length < minlength) {
						return null;
					}
					if (isInteger(token)) {
						return token;
					}
				}
				return null;
			}
			function isInteger(val) {
				var digits = "1234567890";
				for ( var i = 0; i < val.length; i++) {
					if (digits.indexOf(val.charAt(i)) == -1) {
						return false;
					}
				}
				return true;
			}
			function hideErrors(elem) {
		    var next_node = elem.parentNode.lastChild;
		    if (next_node && next_node.className == "error_css")
		    {
		      elem.parentNode.removeChild(next_node);
		      // errFlag--;
		     }
			}
			$.validator.setDefaults({
				ignoreTitle:true,
				onfocusout : function(element) {
					$(element).valid();
				},
				showErrors:function(element,aa){
//					if(undefined==element[$(this.currentElements).attr('name')]){
					$(".vali-info").remove();
//						$("span[v_elementid='"+$("#hideIndex").val()+"']").remove();
//						$("input[name='" + $("#hideIndex").val() + "']").after("<span class='vali-info vi-success rel' v_elementid='"+$("#hideIndex").val()+"' style='*top:-8px;'><i class='vali-icon'></i> </span> ");
//					}
					$.each(element,function(index,obj){
						if(obj!=""){
							$("span[v_elementid='"+index+"']").remove();
							$("input[name='" + index + "']").parent().children(":last").after("<span class='vali-info vi-error rel' v_elementid='"+index+"' style='*top:-12px;'><i class='vali-icon ver-b' title='"+obj+"'></i> </span>");
						}
					})
				}
			})
		}));