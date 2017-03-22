/**
 * A fast, small and feature-rich javascript library for mobile browser
 * Use it just like jQuery, although they work different.
 * 
 * Have fun.
 *
 * Author: kelvinwang 
 * Email : kv.wang87@gmail.com
 */

;(function(root, name, factory){
	if(typeof module === 'object' && module.exports){
		module.exports = factory();
	}
	else if(typeof define === 'function'){
		if(define.amd){
			define(name, factory);
		}
		else {
			define(factory);
		}
	}
	else {
		root[name] = factory();
	}
})
(this, 'K', function(){

	// 缓存全局变量
	var win = window,
		document = win.document,
		location = win.location,
		navigator = win.navigator;

	var slice = Object.prototype.slice,
		toStr = Object.prototype.toString;

	// 类库初始化之前 存储 $ 和 K
	var _$ = win.$;
	var _K = win.K;

	var $, K;

	$ = K = function(selector, context){
		// 是否已经为 K.dom 实例
		if(selector.css){
			return selector;
		}
		return new K.dom(selector, context);
	};


	/**
	 * 解决命名冲突			
	 * @return {Object} K
	 */
	$.noConflict = function(){
	    if ( window.$ === K ) {
	        window.$ = _$;
	    }
	    return K;
	};

	/**
	 * 类型判断
	 * @param  {object} 	obj 
	 * @return {string}     type
	 */
	$.type = function(obj){
	    return toStr.call(obj).replace(/(\[object\s+)|(\])/g, '').toLowerCase();
	};

	/**
	 * 是否为函数
	 * @param  {Function} fn 
	 * @return {Boolean}     
	 */
	$.isFunction = function(fn){
		return $.type(fn) === 'function';
	};

	/**
	 * 是否为数组
	 * @param  {array}  array 
	 * @return {Boolean}
	 */
	$.isArray = function(array){
		return $.type(array) === 'array';
	};

	/**
	 * 是否为空 json
	 * @param  {json}  json 
	 * @return {Boolean}
	 */
	$.isEmptyObject = function(json){
		var empty = true;
		for(var p in json){
			if(json.hasOwnProperty(p)){
				empty = false;
				break;
			}
		}
		return empty;
	};

	/**
	 * 是否为对象
	 * @param  {object}  obj 
	 * @return {Boolean} 
	 */
	$.isObject = function(obj){
		return $.type(obj) === 'object';
	};

	/**
	 * 是否为 undifined
	 * @return {Boolean} 
	 * 
	 */
	$.isUndifined = function(obj){
		return $.type(obj) === 'undefined';
	};

	/**
	 * 是否为字符串
	 * @param  {string}  str 
	 * @return {Boolean}
	 */
	$.isString = function(str){
		return $.type(str) === 'string';
	};

	/**
	 * 是否为数字
	 * @param  {object}  numb 
	 * @return {Boolean}     
	 */
	$.isNumeric = function(numb){
		return $.type(numb) === 'number';
	};

	/**
	 * 数组中是否包含某值
	 * @param  {array} array 
	 * @param  {string|number} value 
	 * @return {boolean}
	 */
	$.inArray = function(array, value){
		return array.indexOf(value) > -1;
	};

	/**
	 * 对象拷贝/扩展
	 * @param  {object} child  
	 * @param  {object} parent 
	 * @return {object}        child
	 */
	$.extend = function(child, parent){
		var i, astr = "[object Array]";
		child = child || {};
		for (i in parent) {
			if (parent.hasOwnProperty(i)) {
				if (typeof parent[i] === "object") {
					child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
					$.extend(parent[i], child[i]);
				} else {
					child[i] = parent[i];
				}
			}
		}
		return child;
	};

	/**
	 * noop
	 */
	$.noop = $.empty = function(){};

	/**
	 * 类继承
	 * @param  {object} child  子类
	 * @param  {object} parent 父类
	 * @return {object}        子类
	 */
	
	$.inherit = (function(){
		var F = function(){};
		
		return function(child, parent){
			var pp = F.prototype;

			F.prototype = pp;
			child.prototype = new F();
			child.uber = pp;
			child.prototype.constructor = child;

			return child;
		};
	})();

	/**
	 * 当前对象是否为 window
	 * @param  {object}  obj
	 * @return {Boolean}  
	 */
	$.isWindow = function(obj){
		return obj && obj == obj.window;
	};

	/**
	 * 当前对象是否为 document
	 * @param  {object}  doc
	 * @return {Boolean} 
	 */
	$.isDocument = function(doc){
		return doc && doc.nodeType == doc.DOCUMENT_NODE; 
	};

	/**
	 * 遍历数组或对象
	 * @param  {array|object}   collection
	 * @param  {function} callback
	 * @param  {object}   bind
	 */
	$.each = function(collection, callback, bind){
	    var x, len;
	    if ($.isArray(collection) || $.isNumeric(collection.length)) {
	        x = -1;
	        len = collection.length;
	        while (++x < len) {
	            if (callback.call(bind, collection[x], x) === false) {
	                break;
	            }
	        }
	    } else {
	        for (x in collection) {
	            if (collection.hasOwnProperty(x)) {
	                if(callback.call(bind, collection[x], x) === false){
	                	break;
	                }
	            }
	        }
	    }
	};

	/**
	 * 字符串剔除空格
	 * @param  {string} str
	 * @return {string}     
	 */
	$.trim = function(str){
	    if($.isFunction(str.trim)){
	    	return str.trim();
	    }
	    return str.replace(/^\s+/, '').replace(/\s+$/, '');
	};

	/**
	 * 获取现在的时间戳
	 * @return {int}
	 */
	$.now = function(){
	    return Date.now();
	};


	;(function($, undefined){

        var Dom = function(selector, context){
            if(!selector){
                return this;
            }

            if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            }

            !context && (context = document);

            // Thank to querySelectorAll, we say good bye to boring sizzle
            var ret = context.querySelectorAll(selector);

            for(var p in ret){
                this[p] = ret[p];
            }

            this.length = ret.length;
            this.context = context;
            return this;
        };

        function toCamelCase(str) {
            return str.replace(/-\D/g, function(match) {
                return match.charAt(1).toUpperCase();
            });
        }

        function toHyphenCase(str) {
            return str.replace(/[A-Z]/g, function(match) {
                return ('-' + match.charAt(0).toLowerCase());
            });
        }

        Dom.prototype = {
            // cahce data
            cache: {},

            each: function(fn, bind){
                $.each(this, fn, bind);
                return this;
            },

            getStyle: function(style){
                if(!this.length) {
                    return;
                }
				
				var dom = this[0];
				
				if (style == 'opacity') {
					if (support.opacity) {
						return (dom.style.opacity == '') ? 100 : dom.style.opacity * 100;
					}
					else {
						return dom.style.filter && dom.style.filter.indexOf('opacity=') >= 0 ? parseFloat(dom.style.filter.match(/opacity=([^)]*)/)[1]) : 100;
					}
				}
	
				style = toCamelCase(style);
				var result = dom.style[style];
				if (!(result === 0 || result)) {
					result = [];
					// get computed style
					if (dom.currentStyle) {
						return dom.currentStyle[style];
					}
					var computed = document.defaultView.getComputedStyle(dom, null);
					return (computed) ? computed.getPropertyValue([toHyphenCase(style)]) : null;
				}
				return result;
            },

            css: function(name, value){
                if($.type(name) === 'object'){
                    for(var p in name){
                        this.css(p, name[p]);
                    }
                    return this;
                }

                if(value === undefined){
                    return this.getStyle(name);
                }

                this.each(function(node){
                    node.style[toCamelCase(name)] = value;
                });

                return this;
            },

            position: function(pos){
                var node;

                if ($.isUndifined(pos)) {
                    if(!this.length){
                        return false;
                    }
                    
                    node = this[0];

                    if (node.parentNode === null || node.style.display == 'none') {
                        return false;
                    }

                    if (document.getBoxObjectFor)  // gecko
                    {
                        box = document.getBoxObjectFor(node);

                        var borderLeft = (node.style.borderLeftWidth) ? parseInt(node.style.borderLeftWidth) : 0;
                        var borderTop = (node.style.borderTopWidth) ? parseInt(node.style.borderTopWidth) : 0;

                        pos = [box.x - borderLeft, box.y - borderTop];
                    }
                    else    // safari & opera
                    {
                        pos = [node.offsetLeft, node.offsetTop];
                        parent = node.offsetParent;
                        if (parent != node) {
                            while (parent) {
                                pos[0] += parent.offsetLeft;
                                pos[1] += parent.offsetTop;
                                parent = parent.offsetParent;
                            }
                        }
                        if (node.style.position == 'absolute') {
                            pos[0] -= document.body.offsetLeft;
                            pos[1] -= document.body.offsetTop;
                        }
                    }

                    if (node.parentNode) { parent = node.parentNode; }
                    else { parent = null; }

                    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                        // account for any scrolled ancestors
                        pos[0] -= parent.scrollLeft;
                        pos[1] -= parent.scrollTop;

                        if (parent.parentNode) { parent = parent.parentNode; }
                        else { parent = null; }
                    }

                    return { x: pos[0], y: pos[1], left: pos[0], top: pos[1] };
                }

                if (pos.x !== undefined) {
                    node.css('left', pos.x);
                }
                if (pos.y !== undefined) {
                    node.css('top', pos.y);
                }

                return this;
            },

            attr: function(name, value){
                if(value === undefined){
                    if(!this.length) {
                        return;
                    }

                    return this[0].getAttribute(name);
                }

                this.each(function(node){
                    node.setAttribute(name, value);
                });

                return this;
            },

            hasClass: function(klass){
                var i = 0, len = this.length;
                for(; i < len; i++){
                    if((' ' + this[i].className + ' ').indexOf(' ' + klass + ' ') > -1){
                        return true;
                    }
                }

                return false;
            },

            addClass: function(klass){
                this.each(function(node){
                    if($(node).hasClass(klass)){
                        return;
                    }

                    node.className = node.className === '' ? klass : (node.className + ' ' + klass);
                });

                return this;
            },

            removeClass: function(klass){
                this.each(function(node){
                    node.className = $.trim(node.className.replace(new RegExp('(^|\\s)' + klass + '(?:\\s|$)', 'g'), '$1'));
                })

                return this;
            },

            on: function(evt, fn){
                this.each(function(node){
                    if(node.addEventListener){
                        node.addEventListener(evt, fn, false);
                    }
                    else if(node.attachEvent){
                        node.attachEvent('on' + evt, function(){
                            fn.apply(node, arguments);
                        });
                    }
                });

                return this;
            },

            off: function(evt, fn){
                this.each(function(node){
                    node.removeEventListener(evt, fn, false);
                });

                return this;
            },

            html: function(html){
                if(html === undefined){
                    return this[0].innerHTML;
                }

                this.each(function(node){
                    node.innerHTML = html;
                });
                return this;
            },

            append: function(node){
                if(node.nodeType){
                    this.each(function(nd){
                        nd.appendChild(node);
                    });

                    return this;
                }

                var div = document.createElement('div');
                div.innerHTML = node;
                $.each(div.childNodes, function(node){
                    this.append(node);
                }, this);
            }
        };

        $.dom = Dom;
	})(K);

	// deferred
	;(function($){
		$.deferred = function(){

		};
	})(K);

	/**
	 * ajax
	 */
	;(function($){
		$.ajax = function(){

		};
	})(K);

	/**
	 * touch
	 */
	;(function($){
		$.touch = function(){

		};
	})(K);

	return K;
});



