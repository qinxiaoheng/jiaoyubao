require("./main.scss");
// 页面模板
var tpl = require("./main.handlebars");
var header = require("../common/header/header");
var buttonDialog = require("../../component/dialog/buttonDialog");
var tipsDialog = require("../../component/dialog/tipsDialog");
var utils = require('../../module/common/utils');
var courseList = require('./view/courseList.handlebars');

var forbiddenBack = require('../../component/forbiddenBack.js');
var userMsg = $.cookie("userMsg") ? JSON.parse($.cookie("userMsg")) : {};

var lazyload = require("../../component/lazyload/main.js");  //图片懒加载

var pay = utils.urlParam("pay");


var main = {
	isLogin : (userMsg.userId)?true:false,
	buySuccess : true,
	init : function(){
		this._render();
		this._courseList();
		this._courseBuy();
		this._payIsSuccess();
		forbiddenBack.init();
	},
	_render : function(){
		var temp = tpl({
			header : header.tpl(),
		})

		$('body').append(temp)
		header.curPage();
		header.isLogin();
		main._getCourse(1);
	},
	// 欧美、菲律宾课程切换显示
	_courseList : function(){
		$('#tabBtn li').click(function(){
			$('#tabBtn li').removeClass('curTab');
			$(this).addClass('curTab');
			main._getCourse($(this).index()+1);
		})

	},
	// 购买下单
	_courseBuy : function(){
		$('.buyBtn').click(function(){

			// var $that = $(this);

			if(main.isLogin == true){
				// alert('判断已经登录，调购买接口
				var uniqId = $(this).attr('Uniq');

				var mobile = userMsg.mobile;
				var token = userMsg.token;
				var userId = userMsg.userId;
				utils.ajax({
				    url:'/openapi/pbstalkorder/addOrderForH5',
				    data: {
				    	'uniqId' : uniqId,
				    	'mobile' : mobile,
				    	'token' : token,
				    	'userId' : userId
				    },
				    type: 'POST',
				    success:function(res){
				    	var result = res.result;
				    	if(res.code == 1){
				    		var tradeNo = result.tradeNo;  //订单号
				    		var uniqId = result.uniqId   //课程编号
				    		var name = result.name  // 课程name
				    		var price = result.price   //   价格
				    		var courseId = result.courseId  //课程Id(支付时需要用)
				    		window.location.href = './confirmOrder.html?tradeNo='+tradeNo+'&uniqId='+uniqId+'&name='+name+'&price='+price+'&courseId='+courseId
				    	}else if(res.code == 2){
				    		main._btns('请重新登录后购买')
				    	}else{
				    		main._tips(res.msg,$('.buyBtn'));
				    	}
				    },
				    error: function() {
			            main._tips('错误，请重试',$('.buyBtn'));
			        }
				});

				

			}else{
				main._btns('请立即登录后购买')
			}
		})
	},
	_btns : function(msg){
		var dlg = new buttonDialog({
          content:'<div class="test">'+msg+'</div>' ,
          btns: [{
            value: '登录',
            func: function() {
            	var url = window.location.href;
                window.location.href = './login.html?sourcePage='+url;
            }
          }]
	    })
	},
	// 判断是否支付成功
	_payIsSuccess : function(){
		if( pay=='success'){
			main._buySuccess();
		} else {
			$('.buySuccessMask').remove()
		}
	},
	// 购买成功box
	_buySuccess : function(){
		var html = '<div class="buySuccessMask">'+
					'<div class="buySuccessBox">'+
						'<div class="closeMask"></div>'+
						'<p class="tips1">请保存好您的短信购课凭证！</p>'+
						'<p class="tips2">24小时内有课程顾问与您联系</p>'
					'</div>'+
					'</div>';
		$('body').append(html)

		main._closeSuccess();
	},
	// 关闭
	_closeSuccess : function(){
		$('.closeMask').click(function(){
			$('.buySuccessMask').remove();
			window.location.href = './buyCourse.html';

		})
	},
	// 获取课程列表
	_getCourse : function(num){
		var type = num;
		utils.ajax({
		    url:'/openapi/pbstalkcourse/talkcourselist?type='+num,
		    data: {},
		    type: 'POST',
		    success:function(res){
		    	var result = res.result;
                if(result!== undefined && result.length > 0){
                	for(var i = 0; i < result.length; i++){
						result[i].duration = result[i].duration == 0 ? '永久有效' : result[i].duration + '个月';
					}
                    var buyCourseList = courseList({
						result:result
					})
					$(".courseList").html(buyCourseList);
					lazyload();
					main._courseBuy();
                }
		    }
		});
	},
	_tips : function (msg,ele){
     	new tipsDialog({
            content: msg,
            hideDelay: 2000,
            type: 'success',
            showOnce: true,
            Ele: ele
        });
	},
}

main.init();