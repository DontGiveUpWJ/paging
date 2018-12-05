var BOSH_SERVICE = '/http-bind/';
var connection = null;
window.Ext = new Object();


$(document).ready(function () {
	var path = "/appframe/component/page/private/im";
    $.getScript(path + "/strophe/strophe.js");
    $.getScript(path + "/pub-ui/js/toolCode.js");
    $.getScript(path + "/pub-ui/js/UserMain.js");
    $.getScript(path + "/pub-ui/js/StropheControl.js");
    $.getScript(path + "/pub-ui/js/WebIMControl.js");

});
/** 加载strophe需要的类库结束*/