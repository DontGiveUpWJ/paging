define(function() {
		/**
		var c = "/apps/commapps"
    return {
        //"common":["s00000/index.html#guoxx1","s00001#guoxx2"],
        //在pageapps目录下的增加下? 进行配置。 
        //例如： "creategroup":["?p01005#groupInfo","s01001#groupOper","?p01007#popGroup"],
        //注意 上面的p01005应该修改为 汉语拼音（前四个汉字）
        "groupInfo":["p01001#groupBaseInfoDiv","p01002#goodTopDiv","p01003#relateGroupDiv","p01004#groupMemManager","p02001#topTopic","p01008#myTab","p02002#myTabContent"],
        "creategroup":["p01005#groupInfo","s01001#groupOper","p01007#popGroup"],
        "updategroup":["p01005#groupInfo","s01001#groupOper","p01007#popGroup"],
        "mygroup":["p01005#groupInfo","p01006#groupOper","p01007#popGroup"],
        "memberMng":["p01005#groupInfo","s01003#groupOper"],
        "addgrpmem":["p01005#groupInfo","s01002#groupOper"],
        "topicInfo":["p02003#topicdiv"],
        "createtopic":["p01005#groupInfo","p02004#groupOper","p02005#hotTopic"],
        "upatetopic":["p01005#groupInfo","p02004#groupOper","p01007#popGroup"]
    };
    */
    
    return {
        //"common":["s00000/index.html#guoxx1","s00001#guoxx2"],
        //在pageapps目录下的增加下? 进行配置。 
        //例如： "creategroup":["?wodequanzigonggongxinxi#groupInfo","s01001#groupOper","renqiquanzi#popGroup"],
        "groupInfo":["quanzixinxi#groupBaseInfoDiv","jinghuatiezi#goodTopDiv","xiangguanqvanzi#relateGroupDiv","chengyuanzhanshi#groupMemManager","zhidingtiezi#topTopic","quanzifenzuxinxi#myTab","zuneitiezi#myTabContent"],
        "creategroup":["wodequanzigonggongxinxi#groupInfo","bianjiquanzi#groupOper","renqiquanzi#popGroup"],
        "updategroup":["wodequanzigonggongxinxi#groupInfo","bianjiquanzi#groupOper","renqiquanzi#popGroup"],
        "mygroup":["wodequanzigonggongxinxi#groupInfo","chaxunwodequanzi#groupOper","renqiquanzi#popGroup"],
        "memberMng":["wodequanzigonggongxinxi#groupInfo","quanzichengyuanguanli#groupOper"],
        "addgrpmem":["wodequanzigonggongxinxi#groupInfo","xinzengquanzichengyuan#groupOper"],
        "topicInfo":["quanzineirong#topicdiv","zengjiatiezihuifu#replydiv"],
        "createtopic":["wodequanzigonggongxinxi#groupInfo","bianjitiezi#groupOper","rementiezi#popGroup"],
        "upatetopic":["wodequanzigonggongxinxi#groupInfo","bianjitiezi#groupOper","rementiezi#popGroup"]
    };
    
})