require('./banner.scss');
// var listTpl = require('./listTpl.handlebars');
var tpl = require("./banner.handlebars");
var swipeSlide = require('./swipeSlide.js');
var bannerImg1 = require('./img/banner1.jpg');
var bannerImg2 = require('./img/banner2.jpg');
var bannerImg3 = require('./img/banner3.jpg')

module.exports = {
	tpl : function () {
		return temp = tpl({
			bannerImg1:bannerImg1,
			bannerImg2:bannerImg2,
			bannerImg3:bannerImg3
		})
		// $('body').append(temp);
	},
	swiper: function(){
		$('#slideImg').swipeSlide({
	        continuousScroll:true,
	        speed : 2000,
	        index: 0,
	        transitionType : 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
	        firstCallback : function(i,sum,me){
	            me.find('.dot').children().first().addClass('cur');
	        },
	        callback : function(i,sum,me){
	            me.find('.dot').children().eq(i).addClass('cur').siblings().removeClass('cur');
	        }
	    });
	}
}