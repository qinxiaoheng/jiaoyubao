/**
 * @class TipDialog
 * @extends SimpleDialog
 * 用法
 * var dlg = new ButtonDialog({
 *   'content' : '文案内容',  //纯文本
 *   'type' : null,  //'success','fail',默认为null
 *   'hideDelay' : 500, //自动隐藏的时间，毫秒，默认为2000，设为0则不自动隐藏
 *   'showOnce' : true //设置是否只显示一次即销毁，默认为false
 *   //**其它参数和SimpleDialog相同
 * });
 */
   //加载模块css
require('./css/dialog.scss');
var Dialog = require("./simpleDialog.js");
module.exports = (function() {
  var Tip = Dialog.extend({
    _type : null,
    _hideDelay : 2000,
    _animationTime : 300,

    init : function(options) {
      options = options || {};
      this._type = options.type? options.type : this._type;
      this._hideDelay = (typeof options.hideDelay == 'number')? options.hideDelay : this._hideDelay;
      this._showOnce = (typeof options.showOnce == 'boolean') ? options.showOnce : true;
      this._Ele = options.Ele || '';
      options = $.extend({
        mask : false,
        class : 'tipdialog'
      },options);
      options.content = this._getContent(options.content);

      this._super(options);
    },
    _getContent : function(content) {
      var result = '<div class="tipdialog-content">';
      switch (this._type) {
        case 'success': result += '<i class="icon-tick"></i>'; break;
        case 'fail': result += '<i class="icon-cross"></i>'; break;
      }
      result += '<span>' + content + '</span></div>';
      return result;
    },
    show : function() {
      var self = this;
      this._super();
      this._$wrapper.css('opacity','1');
      if (this._showOnce) {
        this.on('hided',function() {
          self.close();
        });
      }
      if (this._hideDelay!=0) {
        var $that = this._Ele
        if($that==''){
          setTimeout(function() {
            self.hide();
          },this._hideDelay);

        }else{
          $that.attr("disabled", "true"); 
          setTimeout(function() {
            self.hide();
          },this._hideDelay);
        }
        
      }
    },
    /**
     * 隐藏dialog
     */
    hide : function() {
      var self = this;
      var $that = this._Ele;
      this.trigger('hide');
      this._$wrapper.css('opacity','0');
      if (this._$mask) {
        this._$mask.hide();
      }

      setTimeout(function() {
        self._$wrapper.hide();
        self.trigger('hided');
        if($that!=''){
          $that.removeAttr("disabled");
        }
      },this._animationTime);
    }
  });
  return Tip;
})();