/**
 * A fast, small and feature-rich javascript library for mobile browser
 * Use it just like jQuery, although they work different.
 * 
 * Have fun.
 * 
 * @author Kelvin Wang
 * @mail : kv.wang87@gmail.com
 */

;(function(root, name, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else if (typeof define === 'function') {
        if (define.amd) {
            define(name, factory);
        } else {
            define(factory);
        }
    } else {
        root[name] = factory();
    }
})
(this, 'K', function() {

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

    $ = K = function(selector, context) {
        // 是否已经为 K.dom 实例
        if (selector.css) {
            return selector;
        }
        return new K.dom(selector, context);
    };


    /**
     * 解决命名冲突			
     * @return {Object} K
     */
    $.noConflict = function() {
        if (window.$ === K) {
            window.$ = _$;
        }
        return K;
    };

    /**
     * 类型判断
     * @param  {object} 	obj 
     * @return {string}     type
     */
    $.type = function(obj) {
        return toStr.call(obj).replace(/(\[object\s+)|(\])/g, '').toLowerCase();
    };

    /**
     * 是否为函数
     * @param  {Function} fn 
     * @return {Boolean}     
     */
    $.isFunction = function(fn) {
        return $.type(fn) === 'function';
    };

    /**
     * 是否为数组
     * @param  {array}  array 
     * @return {Boolean}
     */
    $.isArray = function(array) {
        return $.type(array) === 'array';
    };

    /**
     * 是否为空 json
     * @param  {json}  json 
     * @return {Boolean}
     */
    $.isEmptyObject = function(json) {
        var empty = true;
        for (var p in json) {
            if (json.hasOwnProperty(p)) {
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
    $.isObject = function(obj) {
        return $.type(obj) === 'object';
    };

    /**
     * 是否为 undifined
     * @return {Boolean} 
     * 
     */
    $.isUndifined = function(obj) {
        return $.type(obj) === 'undefined';
    };

    /**
     * 是否为字符串
     * @param  {string}  str 
     * @return {Boolean}
     */
    $.isString = function(str) {
        return $.type(str) === 'string';
    };

    /**
     * 是否为数字
     * @param  {object}  numb 
     * @return {Boolean}     
     */
    $.isNumeric = function(numb) {
        return $.type(numb) === 'number';
    };

    /**
     * 数组中是否包含某值
     * @param  {array} array 
     * @param  {string|number} value 
     * @return {boolean}
     */
    $.inArray = function(array, value) {
        return array.indexOf(value) > -1;
    };

    /**
     * 对象拷贝/扩展
     * @param  {object} child  
     * @param  {object} parent 
     * @return {object}        child
     */
    $.extend = function(child, parent) {
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
    $.noop = $.empty = function() {};

    /**
     * 类继承
     * @param  {object} child  子类
     * @param  {object} parent 父类
     * @return {object}        子类
     */

    $.inherit = (function() {
        var F = function() {};

        return function(child, parent) {
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
    $.isWindow = function(obj) {
        return obj && obj == obj.window;
    };

    /**
     * 当前对象是否为 document
     * @param  {object}  doc
     * @return {Boolean} 
     */
    $.isDocument = function(doc) {
        return doc && doc.nodeType == doc.DOCUMENT_NODE;
    };

    /**
     * 遍历数组或对象
     * @param  {array|object}   collection
     * @param  {function} callback
     * @param  {object}   bind
     */
    $.each = function(collection, callback, bind) {
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
                    if (callback.call(bind, collection[x], x) === false) {
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
    $.trim = function(str) {
        if ($.isFunction(str.trim)) {
            return str.trim();
        }
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    };

    /**
     * 获取现在的时间戳
     * @return {int}
     */
    $.now = function() {
        return Date.now();
    };


    /**
     * 核心 dom 类
     * @return {object} 
     */
    ;
    (function($, undefined) {

        var Dom = function(selector, context) {
            if (!selector) {
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

            for (var p in ret) {
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

            each: function(fn, bind) {
                $.each(this, fn, bind);
                return this;
            },

            getStyle: function(style) {
                if (!this.length) {
                    return;
                }

                var dom = this[0];

                if (style == 'opacity') {
                    if (support.opacity) {
                        return (dom.style.opacity == '') ? 100 : dom.style.opacity * 100;
                    } else {
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

            eq: function(index){
            	return $(this[index]);
            },

            css: function(name, value) {
                if ($.type(name) === 'object') {
                    for (var p in name) {
                        this.css(p, name[p]);
                    }
                    return this;
                }

                if (value === undefined) {
                    return this.getStyle(name);
                }

                this.each(function(node) {
                    node.style[toCamelCase(name)] = value;
                });

                return this;
            },

            position: function(pos) {
                var node;

                if ($.isUndifined(pos)) {
                    if (!this.length) {
                        return false;
                    }

                    node = this[0];

                    if (node.parentNode === null || node.style.display == 'none') {
                        return false;
                    }

                    // gecko
                    if (document.getBoxObjectFor) {
                        box = document.getBoxObjectFor(node);

                        var borderLeft = (node.style.borderLeftWidth) ? parseInt(node.style.borderLeftWidth) : 0;
                        var borderTop = (node.style.borderTopWidth) ? parseInt(node.style.borderTopWidth) : 0;

                        pos = [box.x - borderLeft, box.y - borderTop];
                    }
                    // safari & opera
                    else {
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

                    if (node.parentNode) {
                        parent = node.parentNode;
                    } else {
                        parent = null;
                    }

                    while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') {
                        // account for any scrolled ancestors
                        pos[0] -= parent.scrollLeft;
                        pos[1] -= parent.scrollTop;

                        if (parent.parentNode) { parent = parent.parentNode; } else { parent = null; }
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

            attr: function(name, value) {
                if ($.isUndifined(value)) {
                    if (!this.length) {
                        return;
                    }

                    return this[0].getAttribute(name);
                }

                this.each(function(node) {
                    node.setAttribute(name, value);
                });

                return this;
            },

            hasClass: function(klass) {
                var i = 0,
                    len = this.length;
                for (; i < len; i++) {
                    if ((' ' + this[i].className + ' ').indexOf(' ' + klass + ' ') > -1) {
                        return true;
                    }
                }

                return false;
            },

            addClass: function(klass) {
                this.each(function(node) {
                    if ($(node).hasClass(klass)) {
                        return;
                    }

                    node.className = node.className === '' ? klass : (node.className + ' ' + klass);
                });

                return this;
            },

            removeClass: function(klass) {
                this.each(function(node) {
                    node.className = $.trim(node.className.replace(new RegExp('(^|\\s)' + klass + '(?:\\s|$)', 'g'), '$1'));
                })

                return this;
            },

            on: function(evt, fn) {
                this.each(function(node) {
                    node.addEventListener(evt, fn, false);
                });

                return this;
            },

            off: function(evt, fn) {
                this.each(function(node) {
                    node.removeEventListener(evt, fn, false);
                });

                return this;
            },

            html: function(html) {
                if ($.isUndifined(html)) {
                    return this[0].innerHTML;
                }

                this.each(function(node) {
                    node.innerHTML = html;
                });
                return this;
            },

            outerHtml: function(html) {
                if ($.isUndifined(html)) {
                    return this[0].outerHTML = html;
                }

                this.each(function(node) {
                    node.outerHTML = html;
                })
                return this;
            },

            append: function(node) {
                // if arguments is dom node
                if (node.nodeType) {
                    this.each(function(nd) {
                        nd.appendChild(node);
                    });
                    return this;
                }
                // if arguments is dom string
                if ($.isString(node)) {
                    this.each(function(nd) {
                        $(nd).html(node);
                    })
                    return this;
                }

                // Handle as instance
                this.each(function(nd) {
                    nd.innerHTML = $(node).outerHtml();
                })

                // var div = document.createElement('div');
                // div.innerHTML = node;
                // $.each(div.childNodes, function(node){
                //     this.append(node);
                // }, this);
            }
        };

        $.dom = Dom;
        $.fn = $.dom.prototype;
    })(K);

    /**
     * $.callbacks
     * @description 创建一个的回调函数队列控制器
     */

    ;(function($) {
        /**
         * @param {object} options 回调列表执行模式
         * - once  确保回调列表只能执行一次
         * - memory 记录回调参数 以传给新入队列的回调执行
         * - stopOnFalse 当一个回调函数返回 false 时终止后续回调执行
         * - unique 确保一次只能增加一个回调函数(回调列表不重复)
         */
        $.Callbacks = function(options) {
            options = $.extend({}, options);

            // Last fire value (for non-forgettable lists)
            var memory;

            // 当前队列是否已经执行完毕
            var fired;

            // 当前队列是否还在遍历(发布)执行中
            var firing; // Flag to know if list is currently firing

            var firingStart, firingLength, firingIndex;

            // 回调列表
            var list = [];

            // 存放当队列处于 fire 过程中被插入到队列待执行的集合
            var stack = !options.once && [];

            // 回调队列
            var list = [];

            // 发布|执行 函数
            var fire = function(data) {
                memory = options.memory && data;
                firingIndex = firingStart || 0;
                firingStart = 0;
                firingLength = list.length;
                firing = true

                if ($.isArray(list)) {
                    for (; firingIndex < firingLength; ++firingIndex) {
                        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                            memory = false;
                            break;
                        }
                    }

                    if (stack) {
                        if (stack.length) {
                            fire(stack.shift())
                        }
                    } else if (memory) {
                        list.length = 0;
                    } else {
                        _callbacks.disable();
                    };
                }

                firing = false;
                fired = true;

            };

            var _callbacks = {
                /**
                 * 将回调函数 push 进回调队列
                 * @example
                 *	_callbacks.add(fn1) or _callbacks.add([fn1, fn2, ...])
                 */
                add: function(fns) {
                    if ($.isArray(list)) {
                        var start = list.length;
                        var add = function(args) {
                            // 数组递归处理
                            if ($.isArray(args)) {
                                $.each(args, function(fn) {
                                    add(fn);
                                })
                            } else if ($.isFunction(args)) {
                                // 当且仅当 unique 模式外 或 unique 模式内且回调队列不存在该回调时才将回调推入队列
                                if (!options.unique || (options.unique && !_callbacks.has(args))) {
                                    list.push(args);
                                }
                            }
                        };

                        add(fns);

                        if (firing) {
                            firingLength = list.length
                        }
                        // memory 模式下 add 也触发 fire
                        else if (memory) {
                            firingStart = start;
                            fire(memory)
                        }
                    }
                },

                /**
                 * 将回调函数从回调队列内移除
                 * @example
                 * 	_callbacks.remove(fn1) or _callbacks.remove([fn1, fn2, ...])
                 */
                remove: function(fns) {
                    var index;
                    var remove = function(args) {
                        if ($.isArray(fns)) {
                            $.each(fns, function(fn) {
                                remove(fn);
                            })
                        } else if ($.isFunction(fns)) {
                            index = list.indexOf(fns);
                            if (index > -1) {
                                list.splice(index, 1);
                                // 若当且队列还处于 fire状态 重新计算 fire 列表的长度和当前索引
                                if (firing) {
                                    if (index <= firingLength) {
                                        --firingLength
                                    }
                                    if (index <= firingIndex) {
                                        --firingIndex
                                    }
                                }
                            }

                        }
                    };

                    if ($.isArray(list)) {
                        remove(fns);
                    }
                },

                /**
                 * 判断当前回调列表是否包含指定回调
                 * @param  {Function} fn
                 * @return {Boolean}
                 *
                 * @example
                 * _callbacks.has(fn1);
                 */
                has: function(fn) {
                    return !!(list && (fn ? $.inArray(list, fn) : list.length))
                },

                /**
                 * 禁用回调队列
                 */
                disable: function() {
                    list = stack = memory = undefined;
                },

                /**
                 * 回调队列是否禁用
                 */
                disabled: function() {
                    return !list;
                },

                fireWith: function(context, args) {
                    // 只要当执行队列存在 同时 队列没有执行完毕 或栈中有回调待执行 方可触发 fire
                    if (list && (!fired || stack)) {
                        args = args || [];
                        args = [context, args.slice ? args.slice() : args];
                        if (firing) {
                            stack.push(args);
                        } else {
                            fire(args);
                        }
                    }
                },

                /**
                 * 执行队列
                 */
                fire: function() {
                    var pack;
                    // 只要当执行队列存在 同时 队列没有执行完毕 或栈中有回调待执行 方可触发 fire
                    if (list && (!fired || stack)) {
                        pack = [this, [].slice.call(arguments)];

                        if (firing) {
                            stack.push(pack);
                        } else {
                            fire(pack);
                        }
                    }
                },

                /**
                 * 队列是否执行完毕
                 */
                fired: function() {
                    return !!fired;
                }
            };

            return _callbacks;
        }
    })(K);

    /**
     * deferred
     */
    (function() {
        $.Deferred = {};
    })();

    /**
     * ajax
     */
    (function($) {
        $.ajax = function(options) {

        };
    })(K);


    /**
     * touches
     */
    (function($) {
    	/**
    	 * 原始事件实现
    	 */
        var touchBinding = {
            tap: function(node, fn, ctx) {
            	// startTouchX
                var startTx, startTy, startTime = Date.now();
                
                node.addEventListener('touchstart', function(e) {
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                }, false);

                node.addEventListener('touchend', function(e) {
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY;
                    var endTime = Date.now();
                    // 允许小范围移动
                    if (Math.abs(startTx - endTx) < 6 && Math.abs(startTy - endTy) < 6 && endTime - startTime <= 200) {
                        fn.call(ctx);
                    }
                }, false);
            },

            // 双击
            doubleTap: function(node, fn, ctx) {
                var isTouchEnd = false,
                    lastTime = 0,
                    lastTx = null,
                    lastTy = null,
                    firstTouchEnd = true,
                    body = document.body,
                    dTapTimer, startTx, startTy, startTime;

                node.addEventListener('touchstart', function(e) {
                    if (dTapTimer) {
                        clearTimeout(dTapTimer);
                        dTapTimer = null;
                    }
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                }, false);

                node.addEventListener('touchend', function(e) {
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        now = Date.now(),
                        duration = now - lastTime;
                    // 首先要确保能触发单次的 tap 事件
                    if (Math.abs(startTx - endTx) < 6 && Math.abs(startTx - endTx) < 6) {
                        // 两次 tap 的间隔确保在 500 毫秒以内
                        if (duration < 301) {
                            // 本次的 tap 位置和上一次的 tap 的位置允许一定范围内的误差
                            if (lastTx !== null &&
                                Math.abs(lastTx - endTx) < 45 &&
                                Math.abs(lastTy - endTy) < 45) {
                                firstTouchEnd = true;
                                lastTx = lastTy = null;
                                fn.call(ctx);
                            }
                        } else {
                            lastTx = endTx;
                            lastTy = endTy;
                        }
                    } else {
                        firstTouchEnd = true;
                        lastTx = lastTy = null;
                    }
                    lastTime = now;
                }, false);
                // 在 iOS 的 safari 上手指敲击屏幕的速度过快，
                // 有一定的几率会导致第二次不会响应 touchstart 和 touchend 事件
                // 同时手指长时间的touch不会触发click
                if (navigator.userAgent.toLowerCase().indexOf('iphone os') > -1) {
                    body.addEventListener('touchstart', function(e) {
                        startTime = Date.now();
                    }, true);
                    body.addEventListener('touchend', function(e) {
                        var noLongTap = Date.now() - startTime < 501;
                        if (firstTouchEnd) {
                            firstTouchEnd = false;
                            if (noLongTap && e.target === node) {
                                dTapTimer = setTimeout(function() {
                                    firstTouchEnd = true;
                                    lastTx = lastTy = null;
                                    fn();
                                }, 400);
                            }
                        } else {
                            firstTouchEnd = true;
                        }
                    }, true);
                    // iOS 上手指多次敲击屏幕时的速度过快不会触发 click 事件
                    node.addEventListener('click', function(e) {
                        if (dTapTimer) {
                            clearTimeout(dTapTimer);
                            dTapTimer = null;
                            firstTouchEnd = true;
                        }
                    }, false);
                }
            },

            // 长按
            press: function(node, fn, ctx) {
                var startTx, startTy, lTapTimer;
                node.addEventListener('touchstart', function(e) {
                    if (lTapTimer) {
                        clearTimeout(lTapTimer);
                        lTapTimer = null;
                    }
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    lTapTimer = setTimeout(function() {
                        fn.ctx();
                    }, 1000);
                    e.preventDefault();
                }, false);

                node.addEventListener('touchmove', function(e) {
                    var touches = e.touches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY;
                    if (lTapTimer && (Math.abs(endTx - startTx) > 5 || Math.abs(endTy - startTy) > 5)) {
                        clearTimeout(lTapTimer);
                        lTapTimer = null;
                    }
                }, false);

                node.addEventListener('touchend', function(e) {
                    if (lTapTimer) {
                        clearTimeout(lTapTimer);
                        lTapTimer = null;
                    }
                }, false);
            },

            // 滑动
            swipe: function(node, fn, ctx) {
                var isTouchMove, startTx, startTy;

                node.addEventListener('touchstart', function(e) {
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    isTouchMove = false;
                }, false);
                
                node.addEventListener('touchmove', function(e) {
                    isTouchMove = true;
                    e.preventDefault();
                }, false);

                node.addEventListener('touchend', function(e) {
                    if (!isTouchMove) {
                        return;
                    }
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        distanceX = startTx - endTx
                    	distanceY = startTy - endTy,
                        isSwipe = false;
                    if (Math.abs(distanceX) > 20 || Math.abs(distanceY) > 20) {
                        fn.call(ctx);
                    }
                }, false);
            },

            // 上滑
            swipeUp: function(node, fn, ctx) {
                var isTouchMove, startTx, startTy;

                node.addEventListener('touchstart', function(e) {
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    isTouchMove = false;
                }, false);

                node.addEventListener('touchmove', function(e) {
                    isTouchMove = true;
                    e.preventDefault();
                }, false);

                node.addEventListener('touchend', function(e) {
                    if (!isTouchMove) {
                        return;
                    }
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        distanceX = startTx - endTx
                    	distanceY = startTy - endTy,
                        isSwipe = false;
                    if (Math.abs(distanceX) < Math.abs(distanceY)) {
                        if (distanceY > 20) {
                            isSwipe = true;
                            fn.call(ctx);
                        }
                    }
                }, false);
            },

            // 下滑
            swipeDown: function(node, fn, ctx) {
                var isTouchMove, startTx, startTy;

                node.addEventListener('touchstart', function(e) {
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    isTouchMove = false;
                }, false);

                node.addEventListener('touchmove', function(e) {
                    isTouchMove = true;
                    e.preventDefault();
                }, false);

                node.addEventListener('touchend', function(e) {
                    if (!isTouchMove) {
                        return;
                    }
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        distanceX = startTx - endTx
                    	distanceY = startTy - endTy,
                        isSwipe = false;
                    if (Math.abs(distanceX) < Math.abs(distanceY)) {
                        if (distanceY < -20) {
                            isSwipe = true;
                            fn.call(ctx);
                        }
                    }
                }, false);
            },

            // 左滑动
            swipeLeft: function(node, fn, ctx) {
                var isTouchMove, startTx, startTy;

                node.addEventListener('touchstart', function(e) {
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    isTouchMove = false;
                }, false);

                node.addEventListener('touchmove', function(e) {
                    isTouchMove = true;
                    e.preventDefault();
                }, false);

                node.addEventListener('touchend', function(e) {
                    if (!isTouchMove) {
                        return;
                    }
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        distanceX = startTx - endTx
                    	distanceY = startTy - endTy,
                        isSwipe = false;
                    if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                        if (distanceX > 20) {
                            isSwipe = true;
                            fn.call(ctx);
                        }
                    }
                }, false);
            },

            // 右划
            swipeRight: function(node, fn, ctx) {
                var isTouchMove, startTx, startTy;

                node.addEventListener('touchstart', function(e) {
                    var touches = e.touches[0];
                    startTx = touches.clientX;
                    startTy = touches.clientY;
                    isTouchMove = false;
                }, false);

                node.addEventListener('touchmove', function(e) {
                    isTouchMove = true;
                    e.preventDefault();
                }, false);

                node.addEventListener('touchend', function(e) {
                    if (!isTouchMove) {
                        return;
                    }
                    var touches = e.changedTouches[0],
                        endTx = touches.clientX,
                        endTy = touches.clientY,
                        distanceX = startTx - endTx
                    	distanceY = startTy - endTy,
                        isSwipe = false;

                    if (Math.abs(distanceX) >= Math.abs(distanceY)) {
                        if (distanceX < -20) {
                            isSwipe = true;
                            fn.call(ctx);
                        }
                    }
                }, false);
            }
        };

        $.each(touchBinding, function(binding, type){
        	$.fn[type] = function(fn){
        		console.log(this);
        	};
        })

    })(K);

    return K;
});
