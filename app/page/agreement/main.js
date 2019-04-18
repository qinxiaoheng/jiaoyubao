require("./main.scss");
// 页面模板
var tpl = require("./main.handlebars");
var utils = require('../../module/common/utils')
var utils = require('../../module/common/utils');
// var sourcePage = utils.urlParam("sourcePage");

var main = {
	init : function(){
		this._render();
		this._getInfo();
		this._returnUrl();
	},
	_render : function(){
		var temp = tpl({
		})

		$('body').append(temp)

	},
	// 获取协议信息
	_getInfo : function(){
		utils.ajax({
		    url:'/openapi/app/serviceAgreement',
		    data: {},
		    type: 'GET',
		    success:function(res){
		    	var result = res.result;
		    	result = result.replace(/\r\n/g,"<br/>")
	           	$('.result').html(result)
		    }
		});
	},
	// 带数据返回上一页
	_returnUrl : function(){
		$('.returnUrl').click(function(){

			var url = window.location.search;
			window.location.href = "./confirmOrder.html"+url;
		})
	}
}

main.init();