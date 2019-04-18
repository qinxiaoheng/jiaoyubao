//页面样式
require('./header.scss')
// 页面模板
var tpl = require("./header.handlebars")

var utils = require('../../../module/common/utils')
var userMsg = $.cookie("userMsg") ? JSON.parse($.cookie("userMsg")) : {};
module.exports = {
	tpl : tpl,
	// top显示当前nav样式
	curPage : function(){
		var url = window.location.href;
		//通过url显示当前nav样子
		$('#nav li').removeClass('curColor');
		if((url.indexOf('/aboutUs.html'))>-1){
			$('#aboutUs').addClass('curColor');
		}else if((url.indexOf('/buyCourse.html'))>-1){
			$('#buyCourse').addClass('curColor');
		}else{
			$('#Index').addClass('curColor');
		}

		// window.addEventListener("onorientationchange"inwindow ? "orientationchange": "resize", function() {
	 //        if(window.orientation === 180 || window.orientation === 0) {
	 //            alert('竖屏状态！');
	 //        }
	 //        if(window.orientation === 90 || window.orientation === -90 ){
	 //            alert('横屏状态！');
	 //        } 
	 //    }, false);
	},
	//显示当前是否登录
	isLogin : function(){
		var html = '';
		if(userMsg.mobile){
			html = '<div class="noLogin">'+
				'<div class="right quit">退出</div>'+
				'<span class="right nocopy">'+userMsg.mobile+'</span>'+
				'<span class="right">用户:</span>'+
			'</div>'
		}else{
			var url = window.location.href;
			html = '<a href="./login.html?sourcePage='+url+'" class="toLogin">登录</a>'
		}
		$(".userMessage").append(html)

		$('.quit').click(function(){
			utils.ajax({
			    url:'/openapi/pbstalkuser/logout',
			    data: {
			    	'mobile' : userMsg.mobile,
			    	'userId' : userMsg.userId,
			    	'token' : userMsg.token,
			    },
			    type: 'POST',
			    success:function(res){
	                if(res.code == 1){
	                	// 成功退出
	                }
			    }
			});
			$.cookie('userMsg', '', { expires: -1 });
			window.location.reload();
		})
	}

}


