require("./main.scss");
// 页面模板
var tpl = require("./main.handlebars");
var utils = require('../../module/common/utils');
var Msg = utils.urlParam("Msg");
var tradeNo = utils.urlParam("tradeNo");
var uniqId = utils.urlParam("uniqId");
var name = utils.urlParam("name");
var price = utils.urlParam("price");
var courseId = utils.urlParam("courseId");
var userMsg = $.cookie("userMsg") ? JSON.parse($.cookie("userMsg")) : {};
var tipsDialog = require("../../component/dialog/tipsDialog");

var main = {
	isLogin : (userMsg.userId)?true:false,
	init : function(){
		this._render();
		this._getInfo();
		this._gotoAgreement();
	},
	_render : function(){
		var temp = tpl({
		})

		$('body').append(temp)
		
		if(main.isLogin == false){
			window.location.href= './login.html?sourcePage=./buyCourse.html'
		}
	},
	_getInfo : function(){
		// 显示信息
		var remark,order,kcId,kcName,jq;
		remark = (Msg) ? decodeURI(Msg) : '选填（可填写您对本课程的建议)';
		order = (tradeNo) ? tradeNo : '';
		kcId = (uniqId) ? uniqId : '';
		kcName = (name) ? decodeURI(name) : '';
		jq = (price) ? price : '';
		$('.tradeNo').html(order);
		$('.uniqId').html(kcId);
		$('.name').html(kcName);
		$('.price').html(jq);
		$('.remarks').html(remark);
		$('.remarks').click(function(){
			window.location.href='./remark.html?tradeNo='+tradeNo+'&uniqId='+uniqId+'&name='+name+'&price='+price+'&courseId='+courseId+'&remark='+remark
		})
		$('.zfbBtn').click(pay);
		function pay(){
			$(this).unbind();
			var mobile = userMsg.mobile || '';
			var token = userMsg.token || '';
			var remark = (Msg) ? decodeURI(Msg) : '';
			var actionUrl = "http://118.144.248.25:9948";

		    var href = location.href;
			if((href.indexOf('http://m.talk.pbsedu.com') > -1) ){
				actionUrl = "http://talk-api.pbsedu.com";
			}
			var html = '<form action="'+actionUrl+'/openapi/pbstalkorder/confirmOrderForH5" method="post" class="toPayform">'+
				'<input type="hidden" name="orderNo" value="'+order+'" id="Inp1">'+
				'<input type="hidden" name="mobile" value="'+mobile+'" id="Inp2">'+
				'<input type="hidden" name="courseUniqId" value="'+kcId+'" id="Inp3">'+
				'<input type="hidden" name="coursePrice" value="'+jq+'" id="Inp4">'+
				'<input type="hidden" name="amount" value="'+jq+'" id="Inp5">'+
				'<input type="hidden" name="paymentType" value="1" id="Inp6">'+
				'<input type="hidden" name="remark" value="'+remark+'" id="Inp7">'+
				'<input type="hidden" name="token" value="'+token+'" id="Inp8">'+
			'</form>'

			$('body').append(html)
			$('.toPayform').submit();
		}
		// 浏览器回退自定义
		if (window.history && window.history.pushState) {


		    $(window).on('popstate', function() {
		      var hashLocation = location.hash;
		      var hashSplit = hashLocation.split("#!/");
		      var hashName = hashSplit[1];


		      if (hashName !== '') {
		        var hash = window.location.hash;
		        if (hash === '') {
		          
		          location.href="./buyCourse.html"
		        }
		      }
		    });


		    window.history.pushState('forward', null, window.location.href);
		}
	},
	_gotoAgreement : function(){
		$('.gotoAgreement').click(function(){
			var url = window.location.href;
			window.location.href = './agreement.html?sourcePage='+url;
		})
	},
	_tips : function (msg){
     	new tipsDialog({
            content: msg,
            hideDelay: 2000,
            type: 'success',
            showOnce: true,
        });
	},
}

main.init();






