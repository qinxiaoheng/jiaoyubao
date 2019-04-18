require('./loading.scss');
var BaseClass = require("../lib/baseClass");
module.exports = (function(){
  var PageLoading = BaseClass.extend({
    init: function () {
      this.jQel = $('<div class="page-loading"><div class="mask"><span class="loading"></span></div></div>');
      this.jQel.appendTo($('body'));
    },
    end: function(){
      $('.page-loading').remove();
      // this.jQel.remove();
      delete this;
    }
  });
  return PageLoading;
})();
