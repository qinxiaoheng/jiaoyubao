 var Class =  require("./Class.js");
  var Event =  require("./event.js");
 var BaseClass = Class.extend({
    __event : null,
    __initEvent : function() {
      if (this.__event==null) this.__event = Event;
    },
    on : function(evt,callback) {
      this.__initEvent();
      return this.__event.on(evt,callback);
    },
    off : function(evt, callback) {
      this.__initEvent();
      return this.__event.off(evt,callback);
    },
    trigger : function(evt, params) {
      this.__initEvent();
      return this.__event.trigger.apply(this.__event,arguments);
    },
    hasEvent : function(evt,callback) {
      this.__initEvent();
      return this.__event.has(evt,callback);
    }
  });
 module.exports = BaseClass;
