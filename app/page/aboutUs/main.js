require("./main.scss");
// 页面模板
var tpl = require("./main.handlebars");
var header = require("../common/header/header");

var main = {
	init : function(){
		this._render();
	},
	_render : function(){
		var temp = tpl({
			header : header.tpl(),
		})

		$('body').append(temp)
		header.curPage();
		header.isLogin();
	}
}

main.init();