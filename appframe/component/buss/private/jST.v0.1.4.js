(function(window, undefined) {
	var version = "0.1.4";
	if (window.jST) {
		alert("Sorry, jST lib conflict !");
		return;
	};
	var extend = function(target, obj) {
		if (obj) {
			for (var i in target) {
				if ((typeof obj[i]) === "undefined") {
					obj[i] = target[i];
				}
			}
			return obj;
		} else {
			return target;
		}
	};
	window.StringBuffer = function() {
		this.data = [];
		this.append = function() {
			return this.data.push(arguments[0]);
		};
		this.clear = function() {
			this.data.length = 0;
			return this;
		};
		this.length = function() {
			return this.data.length;
		};
		this.toString = function(s) {
			s == undefined ? s = "" : s = s;
			return this.data.join(s);
		}
	};
	extend({
		unique: function() {
			var obj = {},
				ra = [],
				len = this.length;
			for (var i = 0; i < len; i++) {
				if (obj[this[i]]) {
					continue;
				}
				obj[this[i]] = this[i];
				ra.push(this[i])
			}
			return ra
		}
	}, Array.prototype);
	extend({
		trim: function() {
			return this.replace(/(^\s*)|(\s*$)/g, "")
		},
		replaceAll: function(s1, s2) {
			return this.replace(new RegExp(s1, "gm"), s2)
		},
		startsWith: function(s) {
			return this.length >= s.length && this.substring(0, s.length) === s
		},
		endsWith: function(s) {
			return this.length >= s.length && this.substring(this.length - s.length) === s
		},
		reverse: function() {
			return Array.prototype.reverse.apply(String(this).split("")).join("")
		},
		delEndsWith: function(s) {
			return this.replace(new RegExp(s + "$"), "")
		}
	}, String.prototype);
	var jST = {
		onlyNum: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/\D+/g, "")
		},
		onlyEnNum_: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/[^\w]/ig, "")
		},
		onlyEnNumAndAt: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/[^\w=@&]|_/ig, "")
		},
		onlyHanzi: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/[^\u4E00-\u9FA5]/g, "")
		},
		clearSpace: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/\s+/g, "")
		},
		stripHTML: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/<(?:.|\s)*?>/g, "")
		},
		escapeHTML: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
		},
		unescapeHTML: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&")
		},
		clearALink: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/<a [^<>]+>[^<>]+<\/a>/ig, "")
		},
		stripALink: function(s) {
			if (!s) {
				return s
			}
			return s.replace(/<a.*?>(.*)<\/a>/ig, "$1")
		},
		toDBC: function(s) {
			if (!s) {
				return s
			}
			var a = new Array(s.length);
			for (var i = 0; i < s.length; i++) {
				if (s.charCodeAt(i) == 12288) {
					a[i] = String.fromCharCode(s.charCodeAt(i) - 12256);
					continue;
				}
				if (s.charCodeAt(i) > 65280 && s.charCodeAt(i) < 65375) {
					a[i] = String.fromCharCode(s.charCodeAt(i) - 65248)
				} else {
					a[i] = String.fromCharCode(s.charCodeAt(i))
				}
			}
			return a.join("")
		},
		toSBC: function(s) {
			if (!s) {
				return s
			}
			var a = new Array(s.length);
			for (var i = 0; i < s.length; i++) {
				if (s.charCodeAt(i) > 0 && s.charCodeAt(i) < 255) {
					a[i] = String.fromCharCode(s.charCodeAt(i) + 65248)
				} else {
					a[i] = String.fromCharCode(s.charCodeAt(i))
				}
			}
			return a.join("")
		},
		num2ChsMoney: function(num) {
			var ary;
			this.g2b = function(s) {
				return s.replace(/0+/g, "0").replace(/0(\u5706|\u4ebf|\u4e07|\u5343|\u767e|\u5341)/g, "$1").replace("\u4ebf\u4e07", "\u4ebf").replace(/0/g, "\u96f6").replace(/1/g, "\u58f9").replace(/2/g, "\u8d30").replace(/3/g, "\u53c1").replace(/4/g, "\u8086").replace(/5/g, "\u4f0d").replace(/6/g, "\u9646").replace(/7/g, "\u67d2").replace(/8/g, "\u634c").replace(/9/g, "\u7396")
			};
			this.seti2c = function(n) {
				var ns = n.toString(),
					ary = [];
				for (var i = 1; i < ns.length + 1; i++) {
					var t = ns.substr(ns.length - i, 1);
					switch (i) {
						case 1:
							if (t != "0") {
								ary.unshift(t + "\u5706")
							} else {
								ary.unshift("\u5706")
							}
							break;
						case 2:
							if (t != "0") {
								ary.unshift(t + "\u62fe")
							} else {
								ary.unshift("0")
							}
							break;
						case 3:
							if (t != "0") {
								ary.unshift(t + "\u4f70")
							} else {
								ary.unshift("0")
							}
							break;
						case 4:
							if (t != "0") {
								ary.unshift(t + "\u4edf")
							} else {
								ary.unshift("0")
							}
							break;
						case 5:
							if (t != "0") {
								ary.unshift(t + "\u4e07");
							} else {
								ary.unshift("\u4e07");
							}
							break;
						case 6:
							if (t != "0") {
								ary.unshift(t + "\u62fe");
							} else {
								ary.unshift("0");
							}
							break;
						case 7:
							if (t != "0") {
								ary.unshift(t + "\u4f70");
							} else {
								ary.unshift("0");
							}
							break;
						case 8:
							if (t != "0") {
								ary.unshift(t + "\u4edf");
							} else {
								ary.unshift("0");
							}
							break;
						case 9:
							if (t != "0") {
								ary.unshift(t + "\u4ebf");
							} else {
								ary.unshift("\u4ebf");
							}
							break;
						case 10:
							if (t != "0") {
								ary.unshift(t + "\u62fe");
							} else {
								ary.unshift("0");
							}
							break;
						case 11:
							if (t != "0") {
								ary.unshift(t + "\u4f70");
							} else {
								ary.unshift("0");
							}
							break;
						case 12:
							if (t != "0") {
								ary.unshift(t + "\u4edf");
							} else {
								ary.unshift("0");
							}
							break;
						default:
							break;
					}
				}
				return this.g2b(ary.join(""));
			};
			this.setf2c = function(n) {
				var ns = n.toString(),
					ary = [];
				for (var i = 0; i < ns.length; i++) {
					switch (i) {
						case 0:
							var t = ns.substr(i, 1);
							if (t != "0") {
								ary.push(t + "\u89d2");
							} else {
								ary.push("0");
							}
							break;
						case 1:
							var t = ns.substr(i, 1);
							if (t != "0") {
								ary.push(t + "\u5206");
							}
							break;
						default:
							break;
					}
				}
				return this.g2b(ary.join(""));
			};
			if (typeof num === "number") {
				if (this.isMoney(num) && -1 == num.toString().indexOf(".")) {
					return seti2c(num)
				} else {
					ary = num.toString().split(".");
					return (this.seti2c(ary[0]) + this.setf2c(ary[1])).replace(/^\u5706/, "")
				}
			} else {
				return "\u5fc5\u987b\u4e3a\u6b63\u786e\u7684\u6570\u5b57\u7c7b\u578b\u0021"
			}
		},
		getYYYY2DD: function() {
			with(new Date()) {
				var t = function(a) {
					return a < 10 ? "0" + a : a
				};
				return getFullYear() + t(getMonth() + 1) + t(getDate())
			}
		},
		getYYYY2SS: function() {
			with(new Date()) {
				var t = function(a) {
					return a < 10 ? "0" + a : a
				};
				return getFullYear() + t(getMonth() + 1) + t(getDate()) + t(getHours()) + t(getMinutes()) + t(getSeconds())
			}
		},
		getYYYY2SSChs: function() {
			with(new Date()) {
				var t = function(a) {
					return a < 10 ? "0" + a : a
				};
				return getFullYear() + "\u5e74" + t(getMonth() + 1) + "\u6708" + t(getDate()) + "\u65e5" + t(getHours()) + "\u65f6" + t(getMinutes()) + "\u5206" + t(getSeconds()) + "\u79d2"
			}
		},
		getYYYY2FFF: function() {
			with(new Date()) {
				var t = function(a) {
					return a < 10 ? "0" + a : a
				};
				return getFullYear() + t(getMonth() + 1) + t(getDate()) + t(getHours()) + t(getMinutes()) + t(getSeconds()) + t(getMilliseconds())
			}
		},
		getGreeting: function() {
			var now = new Date(),
				hour = now.getHours();
			if (hour < 6) {
				return "\u65e9\u4e0a\u597d"
			} else {
				if (hour < 12) {
					return "\u4e0a\u5348\u597d"
				} else {
					if (hour < 19) {
						return "\u4e0b\u5348\u597d"
					} else {
						return "\u665a\u4e0a\u597d"
					}
				}
			}
		},
		isHavSBC: function(s) {
			if (!s) {
				return false
			}
			var a = new Array(s.length);
			for (var i = 0; i < s.length; i++) {
				if (s.charCodeAt(i) > 65280 && s.charCodeAt(i) < 65375) {
					return true
				}
			}
			return false
		},
		isHavIllChar: function(s) {
			if (!s) {
				return false
			}
			var chr = "%()><;@#$&[]{}'-",
				i;
			for (i = 0; i < chr.length; i++) {
				if (s.indexOf(chr.charAt(i)) != -1) {
					return true
				}
			}
			return false
		},
		isHavALink: function(s) {
			if (!s) {
				return false
			}
			return /<a[^<>]+>[^<>]+<\/a>/ig.test(s)
		},
		isHavHtml: function(s) {
			if (!s) {
				return false
			}
			return /<(?:.|\s)*?>/g.test(s)
		},
		isA2z: function(s) {
			if (!s) {
				return false
			}
			return /^[A-Za-z]+$/.test(s)
		},
		isA2Z: function(s) {
			if (!s) {
				return false
			}
			return /^[A-Z]+$/.test(s)
		},
		isa2z: function(s) {
			if (!s) {
				return false
			}
			return /^[a-z]+$/.test(s)
		},
		isAllNum: function(s) {
			if (!s) {
				return false
			}
			return /^\d+$/.test(s)
		},
		isAllHanzi: function(s) {
			if (!s) {
				return false
			}
			return /^[\u4E00-\u9FA5]+$/.test(s)
		},
		isA2zNum: function(s) {
			if (!s) {
				return false
			}
			return /^[A-Za-z0-9]+$/.test(s)
		},
		isEmail: function(s) {
			if (!s) {
				return false
			}
			return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(s)
		},
		isIP: function(s) {
			if (!s) {
				return false
			}
			if (/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g.test(s)) {
				if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
					return true
				}
			}
			return false
		},
		isPort: function(s) {
			if (!s) {
				return false
			}
			if (this.isPosInt(s) && s < 65536) {
				return true
			}
			return false
		},
		isUrl: function(s) {
			if (!s) {
				return false
			}
			return /^http:\/\/[a-za-z0-9]+\.[a-za-z0-9]+[\/=\?%\-&_~`@[\]\\u2019:+!]*([^<>\"\"])*$/.test(s)
		},
		isNumChar_: function(s) {
			if (!s) {
				return false
			}
			return /^\w+$/.test(s)
		},
		isInt: function(s) {
			if (!s) {
				return false
			}
			return /^-?[1-9](\d+)$/.test(String(s)) || /^-?(\d)$/.test(String(s))
		},
		isPosInt: function(s) {
			if (!s) {
				return false
			}
			return /^[1-9](\d+)$/.test(String(s)) || /^(\d)$/.test(String(s))
		},
		isNegInt: function(s) {
			if (!s) {
				return false
			}
			return /^-[1-9](\d+)$/.test(String(s)) || /^-(\d)$/.test(String(s))
		},
		isMoney: function(s) {
			if (!s) {
				return false
			}
			if (this.isPosInt(s)) {
				return true
			}
			return /^[1-9]\d+[\.]\d{0,2}$/.test(s) || /^\d[\.]\d{0,2}$/.test(s)
		},
		isPost: function(s) {
			if (!s) {
				return false
			}
			return /^\d{6}$/.test(s)
		},
		isTelFax: function(s) {
			if (!s) {
				return false
			}
			return /^((0\d{2,3})-)?(\d{7,8})(-(\d{3,}))?$/.test(s)
		},
		isSimplePwd: function(s) {
			if (!s) {
				return false
			}
			if (s.length < 6) {
				return true
			} else {
				if (s % 111111 == 0 || "0123456789".indexOf(s) != -1 || "9876543210".indexOf(s) != -1) {
					return true
				}
			}
			return false
		},
		isTelMobUniNo: function(s) {
			switch (true) {
				case this.isTelPhNo(s):
					return true;
					break;
				case this.isMbPhNo(s):
					return true;
					break;
				case this.isUniPhNo(s):
					return true;
					break;
				case this.isTelFax(s):
					return true;
					break;
				default:
					return false
			}
		},
		isTelPhNo: function(s) {
			if (!s) {
				return false
			}
			if (s.length == 11) {
				return /^(133|153|180|189)\d*$/.test(s)
			}
			return false
		},
		isMbPhNo: function(s) {
			if (!s) {
				return false
			}
			if (s.length == 11) {
				return /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|183|184|187|188)\d*$/.test(s)
			}
			return false
		},
		isMbPhNoInd: function(s) {
			if (!s) {
				return false
			}
			var len = s.length;
			switch (true) {
				case len === 1:
					return /^(1)\d*$/.test(s);
					break;
				case len === 2:
					return /^(13|15|18|14)\d*$/.test(s);
					break;
				case len >= 3:
					return /^(134|135|136|137|138|139|147|150|151|152|157|158|159|182|183|184|187|188)\d*$/.test(s);
					break;
				default:
					return false;
					break
			}
		},
		isUniPhNo: function(s) {
			if (!s) {
				return false
			}
			if (s.length == 11) {
				return /^13[0-2]|15[56]|18[56]|145\d{8}$/.test(s)
			}
			return false
		},
		isIdCard: function(idcard) {
			if (!idcard) {
				return false
			}
			var Errors = new Array(true, false, false, false, false);
			var area = {
					'11': "\u5317\u4eac",
					'12': "\u5929\u6d25",
					'13': "\u6cb3\u5317",
					'14': "\u5c71\u897f",
					'15': "\u5185\u8499\u53e4",
					'21': "\u8fbd\u5b81",
					'22': "\u5409\u6797",
					'23': "\u9ed1\u9f99\u6c5f",
					'31': "\u4e0a\u6d77",
					'32': "\u6c5f\u82cf",
					'33': "\u6d59\u6c5f",
					'34': "\u5b89\u5fbd",
					'35': "\u798f\u5efa",
					'36': "\u6c5f\u897f",
					'37': "\u5c71\u4e1c",
					'41': "\u6cb3\u5357",
					'42': "\u6e56\u5317",
					'43': "\u6e56\u5357",
					'44': "\u5e7f\u4e1c",
					'45': "\u5e7f\u897f",
					'46': "\u6d77\u5357",
					'50': "\u91cd\u5e86",
					'51': "\u56db\u5ddd",
					'52': "\u8d35\u5dde",
					'53': "\u4e91\u5357",
					'54': "\u897f\u85cf",
					'61': "\u9655\u897f",
					'62': "\u7518\u8083",
					'63': "\u9752\u6d77",
					'64': "\u5b81\u590f",
					'65': "\u65b0\u7586",
					'71': "\u53f0\u6e7e",
					'81': "\u9999\u6e2f",
					'82': "\u6fb3\u95e8",
					'91': "\u56fd\u5916"
			};
			var idcard, Y, JYM;
			var S, M;
			var idcard_array = new Array();
			idcard_array = idcard.split("");
			if (area[parseInt(idcard.substr(0, 2))] == null) {
				return Errors[4]
			}
			switch (idcard.length) {
				case 15:
					if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/
					} else {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/
					}
					if (ereg.test(idcard)) {
						return Errors[0]
					} else {
						return Errors[2]
					}
					break;
				case 18:
					if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
					} else {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/
					}
					if (ereg.test(idcard)) {
						S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
						Y = S % 11;
						M = "F";
						JYM = "10X98765432";
						M = JYM.substr(Y, 1);
						if (M == idcard_array[17]) {
							return Errors[0]
						} else {
							return Errors[3]
						}
					} else {
						return Errors[2]
					}
					break;
				default:
					return Errors[1];
					break
			}
		},
		setCookie: function(name, value, days, path, domain, secure) {
			var expires, today = new Date();
			today.setTime(today.getTime());
			if (days) {
				expires = days * (24 * 60 * 60 * 1000)
			}
			var expires_date = new Date(today.getTime() + (expires));
			document.cookie = name + "=" + escape(value) + ((expires) ? ";expires=" + expires_date.toGMTString() : "") + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ((secure) ? ";secure" : "");
			return this
		},
		getCookie: function(name) {
			var _ary = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (_ary) {
				return unescape(_ary[2])
			} else {
				return null
			}
		},
		delCookie: function(name, path, domain) {
			if (this.getCookie(name)) {
				document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT"
			}
			return this
		},
		closeWindow: function() {
			window.top.opener = null;
			window.top.open("", "_top");
			window.top.close()
		}
	};
	jST.version = version;
	window.jST = jST
})(window);