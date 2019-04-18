/**
 *  @description 可以共用的ajax工具函数
 *
 */

function ajax(options){
	var apiUrl = "http://118.144.248.25:9948";

    var href = location.href;
	if((href.indexOf('http://m.talk.pbsedu.com') > -1) ){
		apiUrl = "http://talk-api.pbsedu.com";
	}
	var ajaxConfig = {
		url : apiUrl+options.url,
		data : options.data,
		type : options.type || "GET",
		datatype : options.datatype || "json",
		// contentType: "application/json",
		async : options.async || "true",

		beforeSend: function(xhr) {
			if(options.beforeSend)
            beforeSend.call(xhr);
        },
        success: options.success || function() {},
        error: options.error || function () {
        	console.log('错误')
        }
	}
	return $.ajax(ajaxConfig);
}
// 获取url参数
var urlParam = function (name) {
	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (!results) {
		return '';
	}
	return results[1] || '';
};
// 转义字符
function escapeHTML(a) {
	a = "" + a;
	return a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

module.exports = {
	urlParam: urlParam,
	escapeHTML: escapeHTML,
	ajax:ajax
};