
  var Event = {
    _events : {},
    init : function() {
      this._events = {};
    },
    /**
     * 绑定事件
     * @param evt {String} 事件名
     * @param callback {Function} 回调函数
     */
    on : function(evt,callback) {
      if (typeof callback != 'function') return;
      if (!this._events[evt]) {
        this._events[evt] = [];
      }
      this._events[evt].push(callback);
    },

    /**
     * 取消绑定，匿名函数无法取消
     * @param evt
     * @param callback 不传入这个参数则会删除所有事件
     */
    off : function(evt, callback) {
      if (!this._events[evt]) return;
      if (arguments.length==1) {
        this._events[evt] = null;
        return;
      }
      var evts = this._events[evt];
      var locateEvt = function() {  //找到第一个事件
        for (var i= 0,len=evts.length; i<len; i++) {
          if (evts[i]==callback) {
            return i;
          }
        }
        return -1;
      };
      var loc;
      while ((loc=locateEvt())!=-1) {
        evts.splice(loc,1);
      }
    },

    /**
     * 触发某个消息（事件）
     *
     * @param {Object} evt 触发的消息名称
     * @param {Object} params: param1, param2 ... 传给所有回调的参数
     */
    trigger : function(evt, params) {
      if (!this._events[evt]) {
        return;
      }
      var arguArr = (arguments.length>1)? Array.prototype.splice.call(arguments,1) : [];
      var callbacks = this._events[evt];
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i].apply(window,arguArr);
      }
    },

    /**
     * 查看是否注册了这个事件处理函数，注意匿名函数一般是无法找到的
     * @param evt 事件名
     * @param callback 函数 不传入这个参数则返回是否有函数注册了该事件
     * @return {Boolean} 找到返回true，否则返回false
     */
    has : function(evt, callback) {
      if (!this._events[evt]) return false;
      if (arguments.length==1) {
        if (this._events[evt].length==0) return false;
        else return true;
      }
      var evts = this._events[evt];
      for (var i= 0,len=evts.length; i<len; i++) {
        if (evts[i]==callback) {
          return true;
        }
      }
      return false;
    }
  };

 module.exports = Event;
 
