/**
 * @class ButtonDialog
 * @extends SimpleDialog
 * 用法
 * var dlg = new ButtonDialog({
 *   'content' : '文案内容',  //纯文本、html或jquery对象
 *   'btns' : [{  //
 *     'value' : '按钮名',
 *     'func' : function() {},  //按钮点击执行
 *     'attrs' : {'class':'btn-ok'},  //放在按钮标签上的属性，如class, id等
 *   },{其它button}],
 *
 *   //**其它参数和SimpleDialog相同
 * });
 */
 require('./css/dialog.scss');
  var SimpleDialog = require('./simpleDialog.js');
 module.exports = (function() {
  var Dialog = SimpleDialog.extend({
    _btns : [],
    _$wordWrap : null,
    _$contentWrap : null,
    init : function(options) {
      var self = this;
      var btnOptions = options.btns;
      this._$wordWrap =$('<div class="buttondialog-word"><b class="close"></b></div>').append(options.content);
      this._$contentWrap =$('<div class="buttondialog-wrap"></div>');

      var $btnWrap = $('<div class="buttondialog-op"></div>');
      for (var i= 0,len=btnOptions.length; i<len; i++) {
        var btnFunc = btnOptions[i]['func'];
        var attrs = btnOptions[i]['attrs'];
        var arrAttrs = [];
        if (attrs) {
          for (var j in attrs) {
            arrAttrs.push(j+'="'+attrs[j]+'"');
          }
        }
        var $btn = $('<button '+arrAttrs.join(' ')+'>'+btnOptions[i]['value']+'</button>');
        $btn.__clickFunc = btnFunc;
        self._btns.push($btn);
        $btnWrap.append($btn);
      }

      this._$contentWrap.append(this._$wordWrap).append($btnWrap);

      options = $.extend(options,{
        content : this._$contentWrap
      });

      this._super(options);

      //给button绑定事件，之所以不放在生成button的时候绑定，是因为在windows phone里，在弹框生成前绑定不生效-_-\\
      for (var i= 0,len=this._btns.length; i<len; i++) {
        var btn = this._btns[i];
        (function(func) {
          btn.click(function(e) {
            func.call(this,e)
          });
        })(btn.__clickFunc);
      }

      $('.close').click(function(){
          $('.mask').remove();
          $('.simpledialog').remove();
      })
    }
  });

  /**
   * 类方法，简单的alert弹框
   */
  Dialog.alert = function(content,func) {
    var dlg = new Dialog({
      content : content,
      btns : [{
        value : '确认',
        func : function() {
          dlg.close();
          if (typeof func == 'function') {
            func();
          }
        }
      }]
    });
  };

  /**
   * 类方法，简单的confirm弹框
   */
  Dialog.confirm = function(content,func) {
    var dlg = new Dialog({
      content : content,
      btns : [{
        value : '确认',
        func : function() {
          dlg.close();
          if (typeof func == 'function') {
            func();
          }
        }
      },{
        value : '取消',
        func : function() {
          dlg.close();
        }
      }]
    });
  };
  return Dialog;
})();