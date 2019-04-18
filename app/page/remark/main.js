require("./main.scss");
// 页面模板
var tpl = require("./main.handlebars");

var utils = require('../../module/common/utils');
var tradeNo = utils.urlParam("tradeNo");
var uniqId = utils.urlParam("uniqId");
var name = utils.urlParam("name");
var price = utils.urlParam("price");
var orderId = utils.urlParam("orderId");
var courseId = utils.urlParam("courseId");
var remark = utils.urlParam("remark");
var userMsg = $.cookie("userMsg") ? JSON.parse($.cookie("userMsg")) : {};

var main = {
	isLogin : (userMsg.userId)?true:false,
	init : function(){
		this._render();
		this._count("commentText","Num",120);
		this._confirm();
		this._defaultShow();
	},
	_render : function(){
		var temp = tpl({
		})

		$('body').append(temp)
		if(main.isLogin == false){
			window.location.href= './login.html?sourcePage=./buyCourse.html'
		}
	},
	_count : function(elem, showElem, max){
		var elem = document.getElementById(elem); 
		var showElem = document.getElementById(showElem); 
		var max = max || 50;// 最大限度字符，汉字按两个字符计算 
		function getTextLength(str){// 获取字符串的长度 一个汉字为2个字符 
			return str.replace(/[^\x00-\xff]/g,"xx").length; 
		}; 
		// 监听textarea的内容变化 
		if(/msie (\d+\.\d)/i.test(navigator.userAgent) == true) {// 区分IE 
			elem. keydown = textChange; 
		}else{ 
			elem.addEventListener("input", textChange, false); 
		} 
		function textChange(){// 内容变化时的处理 
			var text = elem.value; 
			var count = getTextLength(text); 
			if(count > max){// 文字超出截断 
				for(var i=0; i<text.length; i++){ 
					if(getTextLength(text.substr(0, i)) >= max){ 
						elem.value = text.substr(0, i); 
						var num = (count>120)?120:count;
						if(showElem) showElem.innerHTML = num;// 显示输出结果 
							break; 
					}; 
				} 
			}else{ 
				var num = (count>120)?120:count;
				if(showElem) showElem.innerHTML = num;// 显示输出结果 
			}; 
		}; 
		textChange();// 加载时先初始化 
	},
	_confirm : function(){
		if(remark && (decodeURI(remark)=='选填（可填写您对本课程的建议)')){
			$('#commentText').val('');
		}else{
			$('#commentText').val(decodeURI(remark));
			$('.defaultShow').html('');
			main._count("commentText","Num",120);
		}
		$('.confirm').click(function(){
			// var remarkMsg = JSON.stringify({
			// 	Msg : $('#commentText').val().trim()
			// })
			// $.cookie("remarkMsg",remarkMsg,{"expires":30});
			var Msg = $('#commentText').val().trim()
			window.location.href = './confirmOrder.html?tradeNo='+tradeNo+'&uniqId='+uniqId+'&name='+name+'&price='+price+'&orderId='+orderId+'&courseId='+courseId+'&Msg='+Msg
			
		})
		$('.returnUrl').click(function(){
			// var remarkMsg = JSON.stringify({
			// 	Msg : $('#commentText').val().trim()
			// })
			// $.cookie("remarkMsg",remarkMsg,{"expires":30});
			var Msg = $('#commentText').val().trim()
			window.location.href = './confirmOrder.html?tradeNo='+tradeNo+'&uniqId='+uniqId+'&name='+name+'&price='+price+'&orderId='+orderId+'&courseId='+courseId+'&Msg='+Msg
			
		})

	},
	_defaultShow : function(){
		$('#commentText').focus(function(){
			$('.defaultShow').hide();
		})
		$('#commentText').blur(function(){
			if($(this).val().trim() == ''){
				$('.defaultShow').show();
			}
		})
	}

}

main.init();