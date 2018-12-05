define(["./config"], function(config) {
	var writeCard = {};
	var writeUrl = "";
	writeCard.getUrl = function(url){
		writeUrl = config[0][url];
		return writeUrl;
	};
	return writeCard;
});