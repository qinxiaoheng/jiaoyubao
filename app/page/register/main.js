require('../common/common.scss')
// 页面模板
var tpl = require("./main.handlebars");

var tipsDialog = require("../../component/dialog/tipsDialog");
var buttonDialog = require("../../component/dialog/buttonDialog");

var utils = require('../../module/common/utils');

// 带跳转地址
var sourcePage = utils.urlParam("sourcePage");

var main  = {
	mobileReg : /^1[3|4|5|7|8][0-9]{9}$/, //手机号验证
	numcodeReg : /^\d{6}$/, //短信验证码验证
	init : function () {
		this._render();
		this._sendTest();
		this._register();
	},
	_render : function () {
		var temp = tpl({
		})
		$('body').append(temp);
	},
	// 验证码
	_sendTest : function(){
		var InterValObj; //timer变量，控制时间  
		var count = 60; //间隔函数，1秒执行  
		var curCount = 60;//当前剩余秒数  
		var code = ""; //验证码  
		$('#sendTest').click(function(){

			if($('.tipdialog').length>0){
				return false;
			}
			$("#sendTest").attr("disabled", "true");
			var $that = $(this);
			var inputMobile = $('#inputMobile').val().trim();   //输入的手机号
			if(inputMobile == ''){
				main._tips('手机号不能为空',$that)
			}else if(!main.mobileReg.test(inputMobile)){
				main._tips	('手机号格式不正确！',$that)
			}else{
		    	// 短信类型:1=注册;2=手机号密码登录;3=手机号验证码登录;4=忘记密码;5=修改密码;6=产品开通成功提示
		    	utils.ajax({
				    url:'/openapi/smsCode/sendCode',
				    data: {
				    	mobile : inputMobile,
				    	type : 1
				    },
				    type: 'GET',
				    success:function(res){
		                if(res.code == 1){
		                	main._tips('短信验证码已发送')
		                	$("#sendTest").attr("disabled", "true");  
					        InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
					    	return false;
		                }else{
		                	main._tips(res.msg,$that)
		                }
				    }
				});
			}
		})
		//timer处理函数  
		function SetRemainTime() {
		    if (curCount == 0) {                  
			    $("#sendTest").removeAttr("disabled");//启用按钮
		        window.clearInterval(InterValObj);//停止计时器    
				curCount = 60 //重置计时器
		        $("#sendTest").val("发送验证码"); 
		        // main._tips("请输入手机验证码");
		        code = ""; //清除验证码。如果不清除，过时间后，输入收到的验证码依然有效  
		    }  
		    else {  
		        curCount--; 
		        // alert('aaaa') 
		        $("#sendTest").val( curCount + "s后获取"); 
		    }  
		}
	},
	// 注册
	_register : function(){
		$('#registerBtn').click(function(){
			
			if($('.tipdialog').length>0){
				return false;
			}
			var $that = $(this)
			var inputMobile = $('#inputMobile').val().trim();   //输入的手机号
			var inputTest = $('#inputTest').val().trim();   //输入的验证码
			if(inputMobile == ''){
				
				
				main._tips('手机号不能为空',$that)
			}else if(inputTest == ''){
				main._tips('短信验证码不能为空',$that)
			}else if(!main.mobileReg.test(inputMobile)){
				main._tips('手机号格式不正确！',$that)
			}else{
				//去调取注册接口，注册成功再去调登录接口，把登录信息存下来
				// terminal : 注册终端(1=TV,2=pc,3=android,4=ios,5=h5)
				utils.ajax({
				    url:'/openapi/pbstalkuser/register',
				    data: {
				    	'mobile' : inputMobile,
				    	'smsCode' : inputTest,
				    	'terminal' : 5
				    },
				    type: 'POST',
				    success:function(res){
		                if(res.code == 1){
		                	var userId = res.result.userId;
		                	var mobile = res.result.mobile;
		                	var token = res.result.token;
		                	
		                	var userMsg = JSON.stringify({
								userId:userId,
								token:token,
								mobile:mobile
							})
							$.cookie("userMsg",userMsg,{"expires":30});
		                	if(sourcePage){
		                		
								window.location.href = sourcePage+'#no-back';
							}else{
								
								window.location.href = './index.html#no-back'
							}
		                }else{
		                	main._tips(res.msg,$that)
		                }
				    }
				});
			}
		})
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

main.init()