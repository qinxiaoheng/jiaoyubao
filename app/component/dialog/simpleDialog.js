
  /**
   * @Class 简单对话框类
   * @param options {
   *   content : 内容的html或jquery对象
   *   width : [可选]dialog的width值
   *   height : [可选]dialog的height值
   *   id : [可选]dialog的id值，默认为dialog+时间戳
   *   class : [可选]dialog的class值，默认为simpledialog
   *   show : [可选]是否立即展示，默认为true
   *   fixed : [可选]是否是fixed，默认为false
   *   mask : [可选]是否有遮罩，默认为true
   *   autoPosition : [可选]是否自动把弹框居中，默认为true
   * }
   * @constructor
   */
   var BaseClass = require("../lib/baseClass");
   module.exports = (function() {
    var Dialog = BaseClass.extend({
      _content : '',
      _width : null,
      _height : null,
      _fixed : false,
      _id : null,
      _classes : 'simpledialog',
      _showOnBuild : true,
      _$wrapper : null,
      _$content : null,
      _$mask : null,
      _autoPosition : false,

      init : function(options) {
        this._content = options.content;
        this._width = options.width;
        this._height = options.height;
        this._fixed = options.fixed || false;
        this._id = options.id || 'dialog'+new Date().valueOf();
        this._classes = options.class || 'simpledialog';
        this._showOnBuild = (options.show!=null)? options.show : true;
        this._$wrapper = $('<div id="'+this._id+'" class="'+this._classes+'" style="display:none;"></div>');
        this._$content = $(this._content);
        this._$mask = options.mask===false ? null : $('<div class="mask" style="display:none"></div>');
        this._autoPosition = options.autoPosition!==false;
        this._build();
        if (this._showOnBuild) {
          this.show();
        }
      },
      _build : function() {
        this._updateContent();

        var style = {};
        if (this._width!=null) {
          style.width = this._width+'px';
        }
        if (this._height!=null) {
          style.height = this._height+'px';
        }
        if (this._fixed) {
          style.position = 'fixed';
        }
        for (var i in style) {
          this._$wrapper.css(style);
          break;
        }

        this._$wrapper.appendTo('body');
        if (this._$mask) {
          this._$mask.appendTo('body');
        }
      },
      _updateContent : function() {
        this._$wrapper.empty().append(this._$content);
      },
      /**
       * 获取dialog的jquery对象
       * @return {*}
       */
      getJElem : function() {
        return this._$wrapper;
      },
      /**
       * 获取dialog内容的jquery对象
       * @return {*}
       */
      getJContent : function() {
        return this._$content;
      },
      /**
       * 显示dialog
       */
      show : function() {
        this.trigger('show');
        this._$wrapper.show();
        if (this._autoPosition) {
          this.adjust();
        }
        if (this._$mask) {
          this._$mask.show();
          // mask的高低高度是屏幕高度
          $(".mask").css('min-height',$(window).height());
          $('.mask').height($('html').height());
          
        }
        this.trigger('showed');
      },
      /**
       * 隐藏dialog
       */
      hide : function() {
        this.trigger('hide');
        this._$wrapper.hide();
        if (this._$mask) {
          this._$mask.hide();
        }
        this.trigger('hided');
      },
      /**
       * 关闭dialog
       */
      close : function() {
        this.trigger('close');
        this._$wrapper.remove();
        if (this._$mask) {
          this._$mask.remove();
        }
        this.trigger('closed');
      },
      /**
       * 重新设置dialog的内容
       * @param content
       */
      setContent : function(content) {
        this._content = content;
        this._$content = $(this._content);
        this._updateContent();
      },
      /**
       * 调整dialog的位置
       */
      adjust : function() {
        var height = this._$wrapper.height();
        var width = this._$wrapper.width();
        var $window = $(window);
        var windowHeight = $window.height();
        var windowWidth = $window.width();
        var top = (windowHeight-height)/2;
        var left = (windowWidth-width)/2;
        this._$wrapper.css({
          top : top+'px',
          left : left+'px'
        });
      }
    });
    return Dialog;
})();