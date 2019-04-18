require("./main.scss");
// 页面模板
var tpl = require("./main.handlebars");
var header = require("../common/header/header");
var banner = require("../common/bannerSwiper/banner.js");
var forbiddenBack = require('../../component/forbiddenBack.js');
var main  = {
	init : function () {
		this._render();
		this._click();
		this._slide();
		this._goTop();
		forbiddenBack.init();
	},
	_render : function () {
		var temp = tpl({
			header:header.tpl(),
			banner:banner.tpl(),
		})
		$('body').append(temp);
		banner.swiper();
		header.curPage();
		header.isLogin();
	},

	// 点击去下载
	_click(){
		$('#downloadBtn').click(function(){

		 	if(navigator.userAgent.match(/(iPhone|iPad|iPod|iOS);?/i)){
             // window.location.href = "com.baidu.tieba://";//ios app协议
                window.location.href = "http://itunes.apple.com/us/app/id1094170844";
         	}else if(navigator.userAgent.match(/Android/i)){
                window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.itfeibo.paintboard";//android 下载地址
            }else{
            	window.location.href = "http://cms.121learn.com/app/scan/download";
            }
		})
	},
	_btns : function(msg){
		var dlg = new buttonDialog({
          content:'<div class="test">'+msg+'</div>' ,
          btns: [{
            value: '确定',
            func: function() {
                dlg.close();
            }
          }]
	    })
	},
	// 计算top
	_slide : function(){
		window.onscroll =function(){
			if($(window).scrollTop()>=$(window).height()*0.3){
				$('.goTop').show();
			}else{
				$('.goTop').hide();
			}
		}
	},
	_goTop : function(){
		$('.goTop').click(function(){
			$("html,body").scrollTop(0);
		})
	}
}

main.init()