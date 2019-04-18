/**
* 下拉加载组件
*/
require('./iscroll.scss');
var PageLoading = require('component/loading/loading.js');
var BaseClass = require("../lib/baseClass");
var IScroll= require('./iscroll-probe.js');
module.exports = (function(){
	var isAndroid = false;
	if (navigator.userAgent.indexOf('Android') >= 0) {
		isAndroid = true;
	}
    var IscrollRefresh = BaseClass.extend({
        init: function (option) {
            this.jQel = option.jQel;
            this.jQlist = $(option.jQel).find('.list');
            this.pageCount = 0;
            this.pageNum = 0;
            this.iscroll = null;
            this.jQpullup = option.jQpullup;
            this.loading = true;
            this.func = option.loadPage;
            this.TPL = option.TPL;
            this.noDataTip = option.noDataTip;
            // this.para = option.para;
            this.jQlist.html("");
            this._initScroll();
            this._loadPage();
        },

        _loadPage: function (){
            var self = this,
                pageLoading;
            if (self.pageNum == 0) {
                //pageLoading = new PageLoading();
            }

            this.func(self.pageNum + 1, function (result, pageCount){
                self.pageCount = pageCount;
                self.pageNum++;
                var temp = self.TPL(result);
                self.jQlist.append(temp);

				if (isAndroid) {
					self.loading = false;
				} else {
					self.iscroll.refresh();
				}

                if (pageLoading) {
                    pageLoading.end();
                }
                if (self.pageCount == 0){
					self.jQpullup.html(self.noDataTip).addClass('nodata').removeClass("loading");
				}
				//if (self.pageCount == 1){
				//	self.jQpullup.removeClass("loading");
                //
				//}
            });
        },

        _initScroll: function (e) {
            var self = this;
			if (!isAndroid) {
				self.iscroll = new IScroll(this.jQel, {
					probeType: 3,
					mouseWheel: true,
					'click': true
				});
			}

            var onScroll = function () {
				if (!isAndroid) {
					if (self.loading) return;
					if (this.y < (this.maxScrollY - 5) && !self.jQpullup.hasClass('flip')) {
						self.jQpullup.addClass('flip');
						self.jQpullup.html('松手开始更新...');
						this.maxScrollY = this.maxScrollY;
					} else if (this.y > (this.maxScrollY + 5) && self.jQpullup.hasClass('flip')) {
						self.jQpullup.removeClass('flip');
						self.jQpullup.html('上拉加载更多...');
						this.maxScrollY = self.jQpullup.height();
					}
				} else {
					var $wrapper = $(self.jQel);
					var $list = $('.list-scroll', $wrapper);
					var shadowHeight = $list.height() - $wrapper.scrollTop() - $wrapper.height();

					if (self.loading) return;
					if (shadowHeight < 250) {
						self.loading = true;
						self._loadPage();
					}
				}
            };

            var onScrollEnd = function () {
                if (self.jQpullup.hasClass('flip')) {
                    self.jQpullup.addClass('loading').removeClass('flip').html('');
                    self.loading = true; //正在loading，打tag
					if (!isAndroid) {
						self._loadPage();
					}
                }
            };

			if (isAndroid) {
				$(self.jQel).scroll(onScroll);

			} else {
				self.iscroll.on('refresh', function () {
					if (self.jQpullup.hasClass('loading')) {
						self.jQpullup.removeClass('loading');
					}
					self.jQpullup.html('上拉加载更多...');
					self.jQpullup.removeClass('nodata');
					if (self.pageNum >= self.pageCount) {
						self.iscroll.off('scroll', onScroll);
						self.iscroll.off('scrollEnd', onScrollEnd);
						if (self.pageCount == 0)
							self.jQpullup.html(self.noDataTip).addClass('nodata');
						else
							self.jQpullup.html('').removeClass('nodata');
					}

					self.loading = false; //结束loading，打tag
				});
				self.iscroll.on('scroll', onScroll);
				self.iscroll.on('scrollEnd', onScrollEnd);
			}
        },

        refresh: function (option) {
            if(this.iscroll){
                this.iscroll.destroy();
            }
            this.init(option);
        }
    });

    return IscrollRefresh;
})();
