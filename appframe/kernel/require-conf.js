require.config({

    paths: {
        appmanage: 'buss/private/appManage',
        rsautil:"buss/private/security",
        rsa:"buss/private/rsa-all",
        festival:"subsystem/festival",
        commonutil:"/component/buss/private/callrestutil",
        jst:"buss/private/jST.v0.1.4",
        appevent:"buss/private/appEvent",
        ajaxutil:"../component/buss/private/ajaxUtil",
        dateformat:"buss/private/dateformat",
        xdate:"buss/open/xdate",
        log:"buss/private/log",
        sso:"buss/private/sso",
        pageing:"buss/private/pageing",
        uri:"../component/buss/open/uri",
        director:"buss/open/director",
        json2:"../component/buss/open/json2",
        appconfig:"subsystem/app_conf",
        cookie:"buss/open/jquery.cookie",
        doTimeout:"buss/open/jquery.doTimeout",
        underscore:"buss/open/underscore",
        ztree:"buss/open/ztree/jquery.ztree.all.min",
        xss:"buss/open/xss/xss",
        pop:"../component/page/private/pop",
        pluspop:"page/private/pluspop/pluspop",
        wdatePicker:"page/open/datetimepicker/WdatePicker",
        autocomplete:"buss/open/autocomplete/jquery.autocomplete",
        jquery_page:'buss/open/jquery.paging',
        loginutil:"buss/private/loginutil",
        loginJsanthen:"subsystem/loginJsanthen",
		casutil:"subsystem/casutil",
        mousetrap:"buss/open/mousetrap",
        jqvalid:"buss/private/validate",
        template:"../component/buss/private/template",
        writeCard:"buss/private/WriteCard",
        placeholder:"page/open/placeholder/jquery.placeholder",
        commonrestinfo:"buss/private/commonrestinfo",
        ckeditor:"page/open/ckeditor/ckeditor",
        i18nJquery:"buss/open/jquery.i18n.properties",
        i18n:"buss/private/i18n"        
    },
    shim:{
    	'jst':{
            exports:"jST"
        }
    },
    map: {
      '*': {
        css: '/appframe/kernel/css.js'
      }
    }          
});