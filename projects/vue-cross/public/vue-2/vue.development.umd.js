"use strict";
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var EMP_ADAPTER_VUE = function() {
    var __create = Object.create;
    var __defProp = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __commonJS = function(cb, mod) {
        return function __require() {
            return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
                exports: {}
            }).exports, mod), mod.exports;
        };
    };
    var __export = function(target, all) {
        for(var name in all)__defProp(target, name, {
            get: all[name],
            enumerable: true
        });
    };
    var __copyProps = function(to, from, except, desc) {
        if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                var _loop = function() {
                    var key = _step.value;
                    if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
                        get: function() {
                            return from[key];
                        },
                        enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
                    });
                };
                for(var _iterator = __getOwnPropNames(from)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        }
        return to;
    };
    var __toESM = function(mod, isNodeMode, target) {
        return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(// If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
            value: mod,
            enumerable: true
        }) : target, mod);
    };
    var __toCommonJS = function(mod) {
        return __copyProps(__defProp({}, "__esModule", {
            value: true
        }), mod);
    };
    // ../../node_modules/.pnpm/vue@2.7.14/node_modules/vue/dist/vue.runtime.common.dev.js
    var require_vue_runtime_common_dev = __commonJS({
        "../../node_modules/.pnpm/vue@2.7.14/node_modules/vue/dist/vue.runtime.common.dev.js": function(exports, module) {
            "use strict";
            var emptyObject = Object.freeze({});
            var isArray = Array.isArray;
            function isUndef(v) {
                return v === void 0 || v === null;
            }
            function isDef(v) {
                return v !== void 0 && v !== null;
            }
            function isTrue(v) {
                return v === true;
            }
            function isFalse(v) {
                return v === false;
            }
            function isPrimitive(value) {
                return typeof value === "string" || typeof value === "number" || // $flow-disable-line
                (typeof value === "undefined" ? "undefined" : _type_of(value)) === "symbol" || typeof value === "boolean";
            }
            function isFunction(value) {
                return typeof value === "function";
            }
            function isObject(obj) {
                return obj !== null && (typeof obj === "undefined" ? "undefined" : _type_of(obj)) === "object";
            }
            var _toString = Object.prototype.toString;
            function toRawType(value) {
                return _toString.call(value).slice(8, -1);
            }
            function isPlainObject(obj) {
                return _toString.call(obj) === "[object Object]";
            }
            function isRegExp(v) {
                return _toString.call(v) === "[object RegExp]";
            }
            function isValidArrayIndex(val) {
                var n = parseFloat(String(val));
                return n >= 0 && Math.floor(n) === n && isFinite(val);
            }
            function isPromise(val) {
                return isDef(val) && typeof val.then === "function" && typeof val.catch === "function";
            }
            function toString(val) {
                return val == null ? "" : Array.isArray(val) || isPlainObject(val) && val.toString === _toString ? JSON.stringify(val, null, 2) : String(val);
            }
            function toNumber(val) {
                var n = parseFloat(val);
                return isNaN(n) ? val : n;
            }
            function makeMap(str, expectsLowerCase) {
                var map = /* @__PURE__ */ Object.create(null);
                var list = str.split(",");
                for(var i = 0; i < list.length; i++){
                    map[list[i]] = true;
                }
                return expectsLowerCase ? function(val) {
                    return map[val.toLowerCase()];
                } : function(val) {
                    return map[val];
                };
            }
            var isBuiltInTag = makeMap("slot,component", true);
            var isReservedAttribute = makeMap("key,ref,slot,slot-scope,is");
            function remove$2(arr, item) {
                var len = arr.length;
                if (len) {
                    if (item === arr[len - 1]) {
                        arr.length = len - 1;
                        return;
                    }
                    var index2 = arr.indexOf(item);
                    if (index2 > -1) {
                        return arr.splice(index2, 1);
                    }
                }
            }
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            function hasOwn(obj, key) {
                return hasOwnProperty.call(obj, key);
            }
            function cached(fn) {
                var cache = /* @__PURE__ */ Object.create(null);
                return function cachedFn(str) {
                    var hit = cache[str];
                    return hit || (cache[str] = fn(str));
                };
            }
            var camelizeRE = /-(\w)/g;
            var camelize = cached(function(str) {
                return str.replace(camelizeRE, function(_, c) {
                    return c ? c.toUpperCase() : "";
                });
            });
            var capitalize = cached(function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            });
            var hyphenateRE = /\B([A-Z])/g;
            var hyphenate = cached(function(str) {
                return str.replace(hyphenateRE, "-$1").toLowerCase();
            });
            function polyfillBind(fn, ctx) {
                function boundFn(a) {
                    var l = arguments.length;
                    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
                }
                boundFn._length = fn.length;
                return boundFn;
            }
            function nativeBind(fn, ctx) {
                return fn.bind(ctx);
            }
            var bind = Function.prototype.bind ? nativeBind : polyfillBind;
            function toArray(list, start) {
                start = start || 0;
                var i = list.length - start;
                var ret = new Array(i);
                while(i--){
                    ret[i] = list[i + start];
                }
                return ret;
            }
            function extend(to, _from) {
                for(var key in _from){
                    to[key] = _from[key];
                }
                return to;
            }
            function toObject(arr) {
                var res = {};
                for(var i = 0; i < arr.length; i++){
                    if (arr[i]) {
                        extend(res, arr[i]);
                    }
                }
                return res;
            }
            function noop(a, b, c) {}
            var no = function(a, b, c) {
                return false;
            };
            var identity = function(_) {
                return _;
            };
            function looseEqual(a, b) {
                if (a === b) return true;
                var isObjectA = isObject(a);
                var isObjectB = isObject(b);
                if (isObjectA && isObjectB) {
                    try {
                        var isArrayA = Array.isArray(a);
                        var isArrayB = Array.isArray(b);
                        if (isArrayA && isArrayB) {
                            return a.length === b.length && a.every(function(e, i) {
                                return looseEqual(e, b[i]);
                            });
                        } else if (_instanceof(a, Date) && _instanceof(b, Date)) {
                            return a.getTime() === b.getTime();
                        } else if (!isArrayA && !isArrayB) {
                            var keysA = Object.keys(a);
                            var keysB = Object.keys(b);
                            return keysA.length === keysB.length && keysA.every(function(key) {
                                return looseEqual(a[key], b[key]);
                            });
                        } else {
                            return false;
                        }
                    } catch (e) {
                        return false;
                    }
                } else if (!isObjectA && !isObjectB) {
                    return String(a) === String(b);
                } else {
                    return false;
                }
            }
            function looseIndexOf(arr, val) {
                for(var i = 0; i < arr.length; i++){
                    if (looseEqual(arr[i], val)) return i;
                }
                return -1;
            }
            function once(fn) {
                var called = false;
                return function() {
                    if (!called) {
                        called = true;
                        fn.apply(this, arguments);
                    }
                };
            }
            function hasChanged(x, y) {
                if (x === y) {
                    return x === 0 && 1 / x !== 1 / y;
                } else {
                    return x === x || y === y;
                }
            }
            var SSR_ATTR = "data-server-rendered";
            var ASSET_TYPES = [
                "component",
                "directive",
                "filter"
            ];
            var LIFECYCLE_HOOKS = [
                "beforeCreate",
                "created",
                "beforeMount",
                "mounted",
                "beforeUpdate",
                "updated",
                "beforeDestroy",
                "destroyed",
                "activated",
                "deactivated",
                "errorCaptured",
                "serverPrefetch",
                "renderTracked",
                "renderTriggered"
            ];
            var config = {
                /**
         * Option merge strategies (used in core/util/options)
         */ // $flow-disable-line
                optionMergeStrategies: /* @__PURE__ */ Object.create(null),
                /**
         * Whether to suppress warnings.
         */ silent: false,
                /**
         * Show production mode tip message on boot?
         */ productionTip: true,
                /**
         * Whether to enable devtools
         */ devtools: true,
                /**
         * Whether to record perf
         */ performance: false,
                /**
         * Error handler for watcher errors
         */ errorHandler: null,
                /**
         * Warn handler for watcher warns
         */ warnHandler: null,
                /**
         * Ignore certain custom elements
         */ ignoredElements: [],
                /**
         * Custom user key aliases for v-on
         */ // $flow-disable-line
                keyCodes: /* @__PURE__ */ Object.create(null),
                /**
         * Check if a tag is reserved so that it cannot be registered as a
         * component. This is platform-dependent and may be overwritten.
         */ isReservedTag: no,
                /**
         * Check if an attribute is reserved so that it cannot be used as a component
         * prop. This is platform-dependent and may be overwritten.
         */ isReservedAttr: no,
                /**
         * Check if a tag is an unknown element.
         * Platform-dependent.
         */ isUnknownElement: no,
                /**
         * Get the namespace of an element
         */ getTagNamespace: noop,
                /**
         * Parse the real tag name for the specific platform.
         */ parsePlatformTagName: identity,
                /**
         * Check if an attribute must be bound using property, e.g. value
         * Platform-dependent.
         */ mustUseProp: no,
                /**
         * Perform updates asynchronously. Intended to be used by Vue Test Utils
         * This will significantly reduce performance if set to false.
         */ async: true,
                /**
         * Exposed for legacy reasons
         */ _lifecycleHooks: LIFECYCLE_HOOKS
            };
            var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;
            function isReserved(str) {
                var c = (str + "").charCodeAt(0);
                return c === 36 || c === 95;
            }
            function def(obj, key, val, enumerable) {
                Object.defineProperty(obj, key, {
                    value: val,
                    enumerable: !!enumerable,
                    writable: true,
                    configurable: true
                });
            }
            var bailRE = new RegExp("[^".concat(unicodeRegExp.source, ".$_\\d]"));
            function parsePath(path) {
                if (bailRE.test(path)) {
                    return;
                }
                var segments = path.split(".");
                return function(obj) {
                    for(var i = 0; i < segments.length; i++){
                        if (!obj) return;
                        obj = obj[segments[i]];
                    }
                    return obj;
                };
            }
            var hasProto = "__proto__" in {};
            var inBrowser = typeof window !== "undefined";
            var UA = inBrowser && window.navigator.userAgent.toLowerCase();
            var isIE = UA && /msie|trident/.test(UA);
            var isIE9 = UA && UA.indexOf("msie 9.0") > 0;
            var isEdge = UA && UA.indexOf("edge/") > 0;
            UA && UA.indexOf("android") > 0;
            var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
            UA && /chrome\/\d+/.test(UA) && !isEdge;
            UA && /phantomjs/.test(UA);
            var isFF = UA && UA.match(/firefox\/(\d+)/);
            var nativeWatch = {}.watch;
            var supportsPassive = false;
            if (inBrowser) {
                try {
                    var opts = {};
                    Object.defineProperty(opts, "passive", {
                        get: function get() {
                            supportsPassive = true;
                        }
                    });
                    window.addEventListener("test-passive", null, opts);
                } catch (e) {}
            }
            var _isServer;
            var isServerRendering = function() {
                if (_isServer === void 0) {
                    if (!inBrowser && typeof global !== "undefined") {
                        _isServer = global["process"] && global["process"].env.VUE_ENV === "server";
                    } else {
                        _isServer = false;
                    }
                }
                return _isServer;
            };
            var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
            function isNative(Ctor) {
                return typeof Ctor === "function" && /native code/.test(Ctor.toString());
            }
            var hasSymbol = typeof Symbol !== "undefined" && isNative(Symbol) && typeof Reflect !== "undefined" && isNative(Reflect.ownKeys);
            var _Set;
            if (typeof Set !== "undefined" && isNative(Set)) {
                _Set = Set;
            } else {
                _Set = /*#__PURE__*/ function() {
                    function Set1() {
                        _class_call_check(this, Set1);
                        this.set = /* @__PURE__ */ Object.create(null);
                    }
                    _create_class(Set1, [
                        {
                            key: "has",
                            value: function has(key) {
                                return this.set[key] === true;
                            }
                        },
                        {
                            key: "add",
                            value: function add(key) {
                                this.set[key] = true;
                            }
                        },
                        {
                            key: "clear",
                            value: function clear() {
                                this.set = /* @__PURE__ */ Object.create(null);
                            }
                        }
                    ]);
                    return Set1;
                }();
            }
            var currentInstance = null;
            function getCurrentInstance2() {
                return currentInstance && {
                    proxy: currentInstance
                };
            }
            function setCurrentInstance() {
                var vm = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
                if (!vm) currentInstance && currentInstance._scope.off();
                currentInstance = vm;
                vm && vm._scope.on();
            }
            var VNode = /*#__PURE__*/ function() {
                function VNode(tag, data, children, text, elm, context, componentOptions, asyncFactory) {
                    _class_call_check(this, VNode);
                    this.tag = tag;
                    this.data = data;
                    this.children = children;
                    this.text = text;
                    this.elm = elm;
                    this.ns = void 0;
                    this.context = context;
                    this.fnContext = void 0;
                    this.fnOptions = void 0;
                    this.fnScopeId = void 0;
                    this.key = data && data.key;
                    this.componentOptions = componentOptions;
                    this.componentInstance = void 0;
                    this.parent = void 0;
                    this.raw = false;
                    this.isStatic = false;
                    this.isRootInsert = true;
                    this.isComment = false;
                    this.isCloned = false;
                    this.isOnce = false;
                    this.asyncFactory = asyncFactory;
                    this.asyncMeta = void 0;
                    this.isAsyncPlaceholder = false;
                }
                _create_class(VNode, [
                    {
                        key: "child",
                        get: // DEPRECATED: alias for componentInstance for backwards compat.
                        /* istanbul ignore next */ function get() {
                            return this.componentInstance;
                        }
                    }
                ]);
                return VNode;
            }();
            var createEmptyVNode = function() {
                var text = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                var node = new VNode();
                node.text = text;
                node.isComment = true;
                return node;
            };
            function createTextVNode(val) {
                return new VNode(void 0, void 0, void 0, String(val));
            }
            function cloneVNode(vnode) {
                var cloned = new VNode(vnode.tag, vnode.data, // #7975
                // clone children array to avoid mutating original in case of cloning
                // a child.
                vnode.children && vnode.children.slice(), vnode.text, vnode.elm, vnode.context, vnode.componentOptions, vnode.asyncFactory);
                cloned.ns = vnode.ns;
                cloned.isStatic = vnode.isStatic;
                cloned.key = vnode.key;
                cloned.isComment = vnode.isComment;
                cloned.fnContext = vnode.fnContext;
                cloned.fnOptions = vnode.fnOptions;
                cloned.fnScopeId = vnode.fnScopeId;
                cloned.asyncMeta = vnode.asyncMeta;
                cloned.isCloned = true;
                return cloned;
            }
            var uid$2 = 0;
            var pendingCleanupDeps = [];
            var cleanupDeps = function() {
                for(var i = 0; i < pendingCleanupDeps.length; i++){
                    var dep = pendingCleanupDeps[i];
                    dep.subs = dep.subs.filter(function(s) {
                        return s;
                    });
                    dep._pending = false;
                }
                pendingCleanupDeps.length = 0;
            };
            var Dep = /*#__PURE__*/ function() {
                function _Dep() {
                    _class_call_check(this, _Dep);
                    this._pending = false;
                    this.id = uid$2++;
                    this.subs = [];
                }
                _create_class(_Dep, [
                    {
                        key: "addSub",
                        value: function addSub(sub) {
                            this.subs.push(sub);
                        }
                    },
                    {
                        key: "removeSub",
                        value: function removeSub(sub) {
                            this.subs[this.subs.indexOf(sub)] = null;
                            if (!this._pending) {
                                this._pending = true;
                                pendingCleanupDeps.push(this);
                            }
                        }
                    },
                    {
                        key: "depend",
                        value: function depend(info) {
                            if (_Dep.target) {
                                _Dep.target.addDep(this);
                                if (info && _Dep.target.onTrack) {
                                    _Dep.target.onTrack(Object.assign({
                                        effect: _Dep.target
                                    }, info));
                                }
                            }
                        }
                    },
                    {
                        key: "notify",
                        value: function notify(info) {
                            var subs = this.subs.filter(function(s) {
                                return s;
                            });
                            if (!config.async) {
                                subs.sort(function(a, b) {
                                    return a.id - b.id;
                                });
                            }
                            for(var i = 0, l = subs.length; i < l; i++){
                                var sub = subs[i];
                                if (info) {
                                    sub.onTrigger && sub.onTrigger(Object.assign({
                                        effect: subs[i]
                                    }, info));
                                }
                                sub.update();
                            }
                        }
                    }
                ]);
                return _Dep;
            }();
            Dep.target = null;
            var targetStack = [];
            function pushTarget(target2) {
                targetStack.push(target2);
                Dep.target = target2;
            }
            function popTarget() {
                targetStack.pop();
                Dep.target = targetStack[targetStack.length - 1];
            }
            var arrayProto = Array.prototype;
            var arrayMethods = Object.create(arrayProto);
            var methodsToPatch = [
                "push",
                "pop",
                "shift",
                "unshift",
                "splice",
                "sort",
                "reverse"
            ];
            methodsToPatch.forEach(function(method) {
                var original = arrayProto[method];
                def(arrayMethods, method, function mutator() {
                    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                        args[_key] = arguments[_key];
                    }
                    var result = original.apply(this, args);
                    var ob = this.__ob__;
                    var inserted;
                    switch(method){
                        case "push":
                        case "unshift":
                            inserted = args;
                            break;
                        case "splice":
                            inserted = args.slice(2);
                            break;
                    }
                    if (inserted) ob.observeArray(inserted);
                    {
                        ob.dep.notify({
                            type: "array mutation",
                            target: this,
                            key: method
                        });
                    }
                    return result;
                });
            });
            var arrayKeys = Object.getOwnPropertyNames(arrayMethods);
            var NO_INIITIAL_VALUE = {};
            var shouldObserve = true;
            function toggleObserving(value) {
                shouldObserve = value;
            }
            var mockDep = {
                notify: noop,
                depend: noop,
                addSub: noop,
                removeSub: noop
            };
            var Observer = /*#__PURE__*/ function() {
                function Observer(value) {
                    var shallow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, mock = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                    _class_call_check(this, Observer);
                    this.value = value;
                    this.shallow = shallow;
                    this.mock = mock;
                    this.dep = mock ? mockDep : new Dep();
                    this.vmCount = 0;
                    def(value, "__ob__", this);
                    if (isArray(value)) {
                        if (!mock) {
                            if (hasProto) {
                                value.__proto__ = arrayMethods;
                            } else {
                                for(var i = 0, l = arrayKeys.length; i < l; i++){
                                    var key = arrayKeys[i];
                                    def(value, key, arrayMethods[key]);
                                }
                            }
                        }
                        if (!shallow) {
                            this.observeArray(value);
                        }
                    } else {
                        var keys = Object.keys(value);
                        for(var i1 = 0; i1 < keys.length; i1++){
                            var key1 = keys[i1];
                            defineReactive(value, key1, NO_INIITIAL_VALUE, void 0, shallow, mock);
                        }
                    }
                }
                _create_class(Observer, [
                    {
                        /**
         * Observe a list of Array items.
         */ key: "observeArray",
                        value: function observeArray(value) {
                            for(var i = 0, l = value.length; i < l; i++){
                                observe(value[i], false, this.mock);
                            }
                        }
                    }
                ]);
                return Observer;
            }();
            function observe(value, shallow, ssrMockReactivity) {
                if (value && hasOwn(value, "__ob__") && _instanceof(value.__ob__, Observer)) {
                    return value.__ob__;
                }
                if (shouldObserve && (ssrMockReactivity || !isServerRendering()) && (isArray(value) || isPlainObject(value)) && Object.isExtensible(value) && !value.__v_skip && !isRef2(value) && !_instanceof(value, VNode)) {
                    return new Observer(value, shallow, ssrMockReactivity);
                }
            }
            function defineReactive(obj, key, val, customSetter, shallow, mock) {
                var dep = new Dep();
                var property = Object.getOwnPropertyDescriptor(obj, key);
                if (property && property.configurable === false) {
                    return;
                }
                var getter = property && property.get;
                var setter = property && property.set;
                if ((!getter || setter) && (val === NO_INIITIAL_VALUE || arguments.length === 2)) {
                    val = obj[key];
                }
                var childOb = !shallow && observe(val, false, mock);
                Object.defineProperty(obj, key, {
                    enumerable: true,
                    configurable: true,
                    get: function reactiveGetter() {
                        var value = getter ? getter.call(obj) : val;
                        if (Dep.target) {
                            {
                                dep.depend({
                                    target: obj,
                                    type: "get",
                                    key: key
                                });
                            }
                            if (childOb) {
                                childOb.dep.depend();
                                if (isArray(value)) {
                                    dependArray(value);
                                }
                            }
                        }
                        return isRef2(value) && !shallow ? value.value : value;
                    },
                    set: function reactiveSetter(newVal1) {
                        var value = getter ? getter.call(obj) : val;
                        if (!hasChanged(value, newVal1)) {
                            return;
                        }
                        if (customSetter) {
                            customSetter();
                        }
                        if (setter) {
                            setter.call(obj, newVal1);
                        } else if (getter) {
                            return;
                        } else if (!shallow && isRef2(value) && !isRef2(newVal1)) {
                            value.value = newVal1;
                            return;
                        } else {
                            val = newVal1;
                        }
                        childOb = !shallow && observe(newVal1, false, mock);
                        {
                            dep.notify({
                                type: "set",
                                target: obj,
                                key: key,
                                newValue: newVal1,
                                oldValue: value
                            });
                        }
                    }
                });
                return dep;
            }
            function set2(target2, key, val) {
                if (isUndef(target2) || isPrimitive(target2)) {
                    warn("Cannot set reactive property on undefined, null, or primitive value: ".concat(target2));
                }
                if (isReadonly2(target2)) {
                    warn('Set operation on key "'.concat(key, '" failed: target is readonly.'));
                    return;
                }
                var ob = target2.__ob__;
                if (isArray(target2) && isValidArrayIndex(key)) {
                    target2.length = Math.max(target2.length, key);
                    target2.splice(key, 1, val);
                    if (ob && !ob.shallow && ob.mock) {
                        observe(val, false, true);
                    }
                    return val;
                }
                if (key in target2 && !(key in Object.prototype)) {
                    target2[key] = val;
                    return val;
                }
                if (target2._isVue || ob && ob.vmCount) {
                    warn("Avoid adding reactive properties to a Vue instance or its root $data at runtime - declare it upfront in the data option.");
                    return val;
                }
                if (!ob) {
                    target2[key] = val;
                    return val;
                }
                defineReactive(ob.value, key, val, void 0, ob.shallow, ob.mock);
                {
                    ob.dep.notify({
                        type: "add",
                        target: target2,
                        key: key,
                        newValue: val,
                        oldValue: void 0
                    });
                }
                return val;
            }
            function del2(target2, key) {
                if (isUndef(target2) || isPrimitive(target2)) {
                    warn("Cannot delete reactive property on undefined, null, or primitive value: ".concat(target2));
                }
                if (isArray(target2) && isValidArrayIndex(key)) {
                    target2.splice(key, 1);
                    return;
                }
                var ob = target2.__ob__;
                if (target2._isVue || ob && ob.vmCount) {
                    warn("Avoid deleting properties on a Vue instance or its root $data - just set it to null.");
                    return;
                }
                if (isReadonly2(target2)) {
                    warn('Delete operation on key "'.concat(key, '" failed: target is readonly.'));
                    return;
                }
                if (!hasOwn(target2, key)) {
                    return;
                }
                delete target2[key];
                if (!ob) {
                    return;
                }
                {
                    ob.dep.notify({
                        type: "delete",
                        target: target2,
                        key: key
                    });
                }
            }
            function dependArray(value) {
                for(var e, i = 0, l = value.length; i < l; i++){
                    e = value[i];
                    if (e && e.__ob__) {
                        e.__ob__.dep.depend();
                    }
                    if (isArray(e)) {
                        dependArray(e);
                    }
                }
            }
            function reactive2(target2) {
                makeReactive(target2, false);
                return target2;
            }
            function shallowReactive2(target2) {
                makeReactive(target2, true);
                def(target2, "__v_isShallow", true);
                return target2;
            }
            function makeReactive(target2, shallow) {
                if (!isReadonly2(target2)) {
                    {
                        if (isArray(target2)) {
                            warn("Avoid using Array as root value for ".concat(shallow ? "shallowReactive()" : "reactive()", " as it cannot be tracked in watch() or watchEffect(). Use ").concat(shallow ? "shallowRef()" : "ref()", " instead. This is a Vue-2-only limitation."));
                        }
                        var existingOb = target2 && target2.__ob__;
                        if (existingOb && existingOb.shallow !== shallow) {
                            warn("Target is already a ".concat(existingOb.shallow ? "" : "non-", "shallow reactive object, and cannot be converted to ").concat(shallow ? "" : "non-", "shallow."));
                        }
                    }
                    var ob = observe(target2, shallow, isServerRendering());
                    if (!ob) {
                        if (target2 == null || isPrimitive(target2)) {
                            warn("value cannot be made reactive: ".concat(String(target2)));
                        }
                        if (isCollectionType(target2)) {
                            warn("Vue 2 does not support reactive collection types such as Map or Set.");
                        }
                    }
                }
            }
            function isReactive2(value) {
                if (isReadonly2(value)) {
                    return isReactive2(value["__v_raw"]);
                }
                return !!(value && value.__ob__);
            }
            function isShallow2(value) {
                return !!(value && value.__v_isShallow);
            }
            function isReadonly2(value) {
                return !!(value && value.__v_isReadonly);
            }
            function isProxy2(value) {
                return isReactive2(value) || isReadonly2(value);
            }
            function toRaw2(observed) {
                var raw = observed && observed["__v_raw"];
                return raw ? toRaw2(raw) : observed;
            }
            function markRaw2(value) {
                if (Object.isExtensible(value)) {
                    def(value, "__v_skip", true);
                }
                return value;
            }
            function isCollectionType(value) {
                var type = toRawType(value);
                return type === "Map" || type === "WeakMap" || type === "Set" || type === "WeakSet";
            }
            var RefFlag = "__v_isRef";
            function isRef2(r) {
                return !!(r && r.__v_isRef === true);
            }
            function ref$1(value) {
                return createRef(value, false);
            }
            function shallowRef2(value) {
                return createRef(value, true);
            }
            function createRef(rawValue, shallow) {
                if (isRef2(rawValue)) {
                    return rawValue;
                }
                var ref3 = {};
                def(ref3, RefFlag, true);
                def(ref3, "__v_isShallow", shallow);
                def(ref3, "dep", defineReactive(ref3, "value", rawValue, null, shallow, isServerRendering()));
                return ref3;
            }
            function triggerRef2(ref3) {
                if (!ref3.dep) {
                    warn("received object is not a triggerable ref.");
                }
                {
                    ref3.dep && ref3.dep.notify({
                        type: "set",
                        target: ref3,
                        key: "value"
                    });
                }
            }
            function unref2(ref3) {
                return isRef2(ref3) ? ref3.value : ref3;
            }
            function proxyRefs2(objectWithRefs) {
                if (isReactive2(objectWithRefs)) {
                    return objectWithRefs;
                }
                var proxy2 = {};
                var keys = Object.keys(objectWithRefs);
                for(var i = 0; i < keys.length; i++){
                    proxyWithRefUnwrap(proxy2, objectWithRefs, keys[i]);
                }
                return proxy2;
            }
            function proxyWithRefUnwrap(target2, source, key) {
                Object.defineProperty(target2, key, {
                    enumerable: true,
                    configurable: true,
                    get: function() {
                        var val = source[key];
                        if (isRef2(val)) {
                            return val.value;
                        } else {
                            var ob = val && val.__ob__;
                            if (ob) ob.dep.depend();
                            return val;
                        }
                    },
                    set: function(value) {
                        var oldValue = source[key];
                        if (isRef2(oldValue) && !isRef2(value)) {
                            oldValue.value = value;
                        } else {
                            source[key] = value;
                        }
                    }
                });
            }
            function customRef2(factory) {
                var dep = new Dep();
                var _factory = factory(function() {
                    {
                        dep.depend({
                            target: ref3,
                            type: "get",
                            key: "value"
                        });
                    }
                }, function() {
                    {
                        dep.notify({
                            target: ref3,
                            type: "set",
                            key: "value"
                        });
                    }
                }), get = _factory.get, set3 = _factory.set;
                var ref3 = {
                    get value () {
                        return get();
                    },
                    set value (newVal){
                        set3(newVal);
                    }
                };
                def(ref3, RefFlag, true);
                return ref3;
            }
            function toRefs2(object) {
                if (!isReactive2(object)) {
                    warn("toRefs() expects a reactive object but received a plain one.");
                }
                var ret = isArray(object) ? new Array(object.length) : {};
                for(var key in object){
                    ret[key] = toRef2(object, key);
                }
                return ret;
            }
            function toRef2(object, key, defaultValue) {
                var val = object[key];
                if (isRef2(val)) {
                    return val;
                }
                var ref3 = {
                    get value () {
                        var val2 = object[key];
                        return val2 === void 0 ? defaultValue : val2;
                    },
                    set value (newVal){
                        object[key] = newVal;
                    }
                };
                def(ref3, RefFlag, true);
                return ref3;
            }
            var rawToReadonlyFlag = "__v_rawToReadonly";
            var rawToShallowReadonlyFlag = "__v_rawToShallowReadonly";
            function readonly2(target2) {
                return createReadonly(target2, false);
            }
            function createReadonly(target2, shallow) {
                if (!isPlainObject(target2)) {
                    {
                        if (isArray(target2)) {
                            warn("Vue 2 does not support readonly arrays.");
                        } else if (isCollectionType(target2)) {
                            warn("Vue 2 does not support readonly collection types such as Map or Set.");
                        } else {
                            warn("value cannot be made readonly: ".concat(typeof target2 === "undefined" ? "undefined" : _type_of(target2)));
                        }
                    }
                    return target2;
                }
                if (!Object.isExtensible(target2)) {
                    warn("Vue 2 does not support creating readonly proxy for non-extensible object.");
                }
                if (isReadonly2(target2)) {
                    return target2;
                }
                var existingFlag = shallow ? rawToShallowReadonlyFlag : rawToReadonlyFlag;
                var existingProxy = target2[existingFlag];
                if (existingProxy) {
                    return existingProxy;
                }
                var proxy2 = Object.create(Object.getPrototypeOf(target2));
                def(target2, existingFlag, proxy2);
                def(proxy2, "__v_isReadonly", true);
                def(proxy2, "__v_raw", target2);
                if (isRef2(target2)) {
                    def(proxy2, RefFlag, true);
                }
                if (shallow || isShallow2(target2)) {
                    def(proxy2, "__v_isShallow", true);
                }
                var keys = Object.keys(target2);
                for(var i = 0; i < keys.length; i++){
                    defineReadonlyProperty(proxy2, target2, keys[i], shallow);
                }
                return proxy2;
            }
            function defineReadonlyProperty(proxy2, target2, key, shallow) {
                Object.defineProperty(proxy2, key, {
                    enumerable: true,
                    configurable: true,
                    get: function get() {
                        var val = target2[key];
                        return shallow || !isPlainObject(val) ? val : readonly2(val);
                    },
                    set: function set() {
                        warn('Set operation on key "'.concat(key, '" failed: target is readonly.'));
                    }
                });
            }
            function shallowReadonly2(target2) {
                return createReadonly(target2, true);
            }
            function computed2(getterOrOptions, debugOptions) {
                var getter;
                var setter;
                var onlyGetter = isFunction(getterOrOptions);
                if (onlyGetter) {
                    getter = getterOrOptions;
                    setter = function() {
                        warn("Write operation failed: computed value is readonly");
                    };
                } else {
                    getter = getterOrOptions.get;
                    setter = getterOrOptions.set;
                }
                var watcher = isServerRendering() ? null : new Watcher(currentInstance, getter, noop, {
                    lazy: true
                });
                if (watcher && debugOptions) {
                    watcher.onTrack = debugOptions.onTrack;
                    watcher.onTrigger = debugOptions.onTrigger;
                }
                var ref3 = {
                    // some libs rely on the presence effect for checking computed refs
                    // from normal refs, but the implementation doesn't matter
                    effect: watcher,
                    get value () {
                        if (watcher) {
                            if (watcher.dirty) {
                                watcher.evaluate();
                            }
                            if (Dep.target) {
                                if (Dep.target.onTrack) {
                                    Dep.target.onTrack({
                                        effect: Dep.target,
                                        target: ref3,
                                        type: "get",
                                        key: "value"
                                    });
                                }
                                watcher.depend();
                            }
                            return watcher.value;
                        } else {
                            return getter();
                        }
                    },
                    set value (newVal){
                        setter(newVal);
                    }
                };
                def(ref3, RefFlag, true);
                def(ref3, "__v_isReadonly", onlyGetter);
                return ref3;
            }
            var WATCHER = "watcher";
            var WATCHER_CB = "".concat(WATCHER, " callback");
            var WATCHER_GETTER = "".concat(WATCHER, " getter");
            var WATCHER_CLEANUP = "".concat(WATCHER, " cleanup");
            function watchEffect2(effect, options) {
                return doWatch(effect, null, options);
            }
            function watchPostEffect2(effect, options) {
                return doWatch(effect, null, Object.assign(Object.assign({}, options), {
                    flush: "post"
                }));
            }
            function watchSyncEffect2(effect, options) {
                return doWatch(effect, null, Object.assign(Object.assign({}, options), {
                    flush: "sync"
                }));
            }
            var INITIAL_WATCHER_VALUE = {};
            function watch2(source, cb, options) {
                if (typeof cb !== "function") {
                    warn("`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature.");
                }
                return doWatch(source, cb, options);
            }
            function doWatch(source, cb) {
                var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : emptyObject, immediate = _ref.immediate, deep = _ref.deep, _ref_flush = _ref.flush, flush = _ref_flush === void 0 ? "pre" : _ref_flush, onTrack = _ref.onTrack, onTrigger = _ref.onTrigger;
                if (!cb) {
                    if (immediate !== void 0) {
                        warn('watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.');
                    }
                    if (deep !== void 0) {
                        warn('watch() "deep" option is only respected when using the watch(source, callback, options?) signature.');
                    }
                }
                var warnInvalidSource = function(s) {
                    warn("Invalid watch source: ".concat(s, ". A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."));
                };
                var instance = currentInstance;
                var call = function(fn, type) {
                    var args = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
                    return invokeWithErrorHandling(fn, null, args, instance, type);
                };
                var getter;
                var forceTrigger = false;
                var isMultiSource = false;
                if (isRef2(source)) {
                    getter = function() {
                        return source.value;
                    };
                    forceTrigger = isShallow2(source);
                } else if (isReactive2(source)) {
                    getter = function() {
                        source.__ob__.dep.depend();
                        return source;
                    };
                    deep = true;
                } else if (isArray(source)) {
                    isMultiSource = true;
                    forceTrigger = source.some(function(s) {
                        return isReactive2(s) || isShallow2(s);
                    });
                    getter = function() {
                        return source.map(function(s) {
                            if (isRef2(s)) {
                                return s.value;
                            } else if (isReactive2(s)) {
                                return traverse(s);
                            } else if (isFunction(s)) {
                                return call(s, WATCHER_GETTER);
                            } else {
                                warnInvalidSource(s);
                            }
                        });
                    };
                } else if (isFunction(source)) {
                    if (cb) {
                        getter = function() {
                            return call(source, WATCHER_GETTER);
                        };
                    } else {
                        getter = function() {
                            if (instance && instance._isDestroyed) {
                                return;
                            }
                            if (cleanup) {
                                cleanup();
                            }
                            return call(source, WATCHER, [
                                onCleanup
                            ]);
                        };
                    }
                } else {
                    getter = noop;
                    warnInvalidSource(source);
                }
                if (cb && deep) {
                    var baseGetter = getter;
                    getter = function() {
                        return traverse(baseGetter());
                    };
                }
                var cleanup;
                var onCleanup = function(fn) {
                    cleanup = watcher.onStop = function() {
                        call(fn, WATCHER_CLEANUP);
                    };
                };
                if (isServerRendering()) {
                    onCleanup = noop;
                    if (!cb) {
                        getter();
                    } else if (immediate) {
                        call(cb, WATCHER_CB, [
                            getter(),
                            isMultiSource ? [] : void 0,
                            onCleanup
                        ]);
                    }
                    return noop;
                }
                var watcher = new Watcher(currentInstance, getter, noop, {
                    lazy: true
                });
                watcher.noRecurse = !cb;
                var oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
                watcher.run = function() {
                    if (!watcher.active) {
                        return;
                    }
                    if (cb) {
                        var newValue = watcher.get();
                        if (deep || forceTrigger || (isMultiSource ? newValue.some(function(v, i) {
                            return hasChanged(v, oldValue[i]);
                        }) : hasChanged(newValue, oldValue))) {
                            if (cleanup) {
                                cleanup();
                            }
                            call(cb, WATCHER_CB, [
                                newValue,
                                // pass undefined as the old value when it's changed for the first time
                                oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
                                onCleanup
                            ]);
                            oldValue = newValue;
                        }
                    } else {
                        watcher.get();
                    }
                };
                if (flush === "sync") {
                    watcher.update = watcher.run;
                } else if (flush === "post") {
                    watcher.post = true;
                    watcher.update = function() {
                        return queueWatcher(watcher);
                    };
                } else {
                    watcher.update = function() {
                        if (instance && instance === currentInstance && !instance._isMounted) {
                            var buffer = instance._preWatchers || (instance._preWatchers = []);
                            if (buffer.indexOf(watcher) < 0) buffer.push(watcher);
                        } else {
                            queueWatcher(watcher);
                        }
                    };
                }
                {
                    watcher.onTrack = onTrack;
                    watcher.onTrigger = onTrigger;
                }
                if (cb) {
                    if (immediate) {
                        watcher.run();
                    } else {
                        oldValue = watcher.get();
                    }
                } else if (flush === "post" && instance) {
                    instance.$once("hook:mounted", function() {
                        return watcher.get();
                    });
                } else {
                    watcher.get();
                }
                return function() {
                    watcher.teardown();
                };
            }
            var activeEffectScope;
            var EffectScope = /*#__PURE__*/ function() {
                function EffectScope() {
                    var detached = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                    _class_call_check(this, EffectScope);
                    this.detached = detached;
                    this.active = true;
                    this.effects = [];
                    this.cleanups = [];
                    this.parent = activeEffectScope;
                    if (!detached && activeEffectScope) {
                        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
                    }
                }
                _create_class(EffectScope, [
                    {
                        key: "run",
                        value: function run(fn) {
                            if (this.active) {
                                var currentEffectScope = activeEffectScope;
                                try {
                                    activeEffectScope = this;
                                    return fn();
                                } finally{
                                    activeEffectScope = currentEffectScope;
                                }
                            } else {
                                warn("cannot run an inactive effect scope.");
                            }
                        }
                    },
                    {
                        /**
         * This should only be called on non-detached scopes
         * @internal
         */ key: "on",
                        value: function on() {
                            activeEffectScope = this;
                        }
                    },
                    {
                        /**
         * This should only be called on non-detached scopes
         * @internal
         */ key: "off",
                        value: function off() {
                            activeEffectScope = this.parent;
                        }
                    },
                    {
                        key: "stop",
                        value: function stop(fromParent) {
                            if (this.active) {
                                var i, l;
                                for(i = 0, l = this.effects.length; i < l; i++){
                                    this.effects[i].teardown();
                                }
                                for(i = 0, l = this.cleanups.length; i < l; i++){
                                    this.cleanups[i]();
                                }
                                if (this.scopes) {
                                    for(i = 0, l = this.scopes.length; i < l; i++){
                                        this.scopes[i].stop(true);
                                    }
                                }
                                if (!this.detached && this.parent && !fromParent) {
                                    var last = this.parent.scopes.pop();
                                    if (last && last !== this) {
                                        this.parent.scopes[this.index] = last;
                                        last.index = this.index;
                                    }
                                }
                                this.parent = void 0;
                                this.active = false;
                            }
                        }
                    }
                ]);
                return EffectScope;
            }();
            function effectScope2(detached) {
                return new EffectScope(detached);
            }
            function recordEffectScope(effect) {
                var scope = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : activeEffectScope;
                if (scope && scope.active) {
                    scope.effects.push(effect);
                }
            }
            function getCurrentScope2() {
                return activeEffectScope;
            }
            function onScopeDispose2(fn) {
                if (activeEffectScope) {
                    activeEffectScope.cleanups.push(fn);
                } else {
                    warn("onScopeDispose() is called when there is no active effect scope to be associated with.");
                }
            }
            function provide2(key, value) {
                if (!currentInstance) {
                    {
                        warn("provide() can only be used inside setup().");
                    }
                } else {
                    resolveProvided(currentInstance)[key] = value;
                }
            }
            function resolveProvided(vm) {
                var existing = vm._provided;
                var parentProvides = vm.$parent && vm.$parent._provided;
                if (parentProvides === existing) {
                    return vm._provided = Object.create(parentProvides);
                } else {
                    return existing;
                }
            }
            function inject2(key, defaultValue) {
                var treatDefaultAsFactory = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
                var instance = currentInstance;
                if (instance) {
                    var provides = instance.$parent && instance.$parent._provided;
                    if (provides && key in provides) {
                        return provides[key];
                    } else if (arguments.length > 1) {
                        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance) : defaultValue;
                    } else {
                        warn('injection "'.concat(String(key), '" not found.'));
                    }
                } else {
                    warn("inject() can only be used inside setup() or functional components.");
                }
            }
            var normalizeEvent = cached(function(name) {
                var passive = name.charAt(0) === "&";
                name = passive ? name.slice(1) : name;
                var once2 = name.charAt(0) === "~";
                name = once2 ? name.slice(1) : name;
                var capture = name.charAt(0) === "!";
                name = capture ? name.slice(1) : name;
                return {
                    name: name,
                    once: once2,
                    capture: capture,
                    passive: passive
                };
            });
            function createFnInvoker(fns, vm) {
                function invoker() {
                    var fns2 = invoker.fns;
                    if (isArray(fns2)) {
                        var cloned = fns2.slice();
                        for(var i = 0; i < cloned.length; i++){
                            invokeWithErrorHandling(cloned[i], null, arguments, vm, "v-on handler");
                        }
                    } else {
                        return invokeWithErrorHandling(fns2, null, arguments, vm, "v-on handler");
                    }
                }
                invoker.fns = fns;
                return invoker;
            }
            function updateListeners(on, oldOn, add2, remove2, createOnceHandler2, vm) {
                var name, cur, old, event;
                for(name in on){
                    cur = on[name];
                    old = oldOn[name];
                    event = normalizeEvent(name);
                    if (isUndef(cur)) {
                        warn('Invalid handler for event "'.concat(event.name, '": got ') + String(cur), vm);
                    } else if (isUndef(old)) {
                        if (isUndef(cur.fns)) {
                            cur = on[name] = createFnInvoker(cur, vm);
                        }
                        if (isTrue(event.once)) {
                            cur = on[name] = createOnceHandler2(event.name, cur, event.capture);
                        }
                        add2(event.name, cur, event.capture, event.passive, event.params);
                    } else if (cur !== old) {
                        old.fns = cur;
                        on[name] = old;
                    }
                }
                for(name in oldOn){
                    if (isUndef(on[name])) {
                        event = normalizeEvent(name);
                        remove2(event.name, oldOn[name], event.capture);
                    }
                }
            }
            function mergeVNodeHook(def2, hookKey, hook) {
                if (_instanceof(def2, VNode)) {
                    def2 = def2.data.hook || (def2.data.hook = {});
                }
                var invoker;
                var oldHook = def2[hookKey];
                function wrappedHook() {
                    hook.apply(this, arguments);
                    remove$2(invoker.fns, wrappedHook);
                }
                if (isUndef(oldHook)) {
                    invoker = createFnInvoker([
                        wrappedHook
                    ]);
                } else {
                    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
                        invoker = oldHook;
                        invoker.fns.push(wrappedHook);
                    } else {
                        invoker = createFnInvoker([
                            oldHook,
                            wrappedHook
                        ]);
                    }
                }
                invoker.merged = true;
                def2[hookKey] = invoker;
            }
            function extractPropsFromVNodeData(data, Ctor, tag) {
                var propOptions = Ctor.options.props;
                if (isUndef(propOptions)) {
                    return;
                }
                var res = {};
                var attrs2 = data.attrs, props2 = data.props;
                if (isDef(attrs2) || isDef(props2)) {
                    for(var key in propOptions){
                        var altKey = hyphenate(key);
                        {
                            var keyInLowerCase = key.toLowerCase();
                            if (key !== keyInLowerCase && attrs2 && hasOwn(attrs2, keyInLowerCase)) {
                                tip('Prop "'.concat(keyInLowerCase, '" is passed to component ').concat(formatComponentName(// @ts-expect-error tag is string
                                tag || Ctor), ', but the declared prop name is "').concat(key, '". Note that HTML attributes are case-insensitive and camelCased props need to use their kebab-case equivalents when using in-DOM templates. You should probably use "').concat(altKey, '" instead of "').concat(key, '".'));
                            }
                        }
                        checkProp(res, props2, key, altKey, true) || checkProp(res, attrs2, key, altKey, false);
                    }
                }
                return res;
            }
            function checkProp(res, hash, key, altKey, preserve) {
                if (isDef(hash)) {
                    if (hasOwn(hash, key)) {
                        res[key] = hash[key];
                        if (!preserve) {
                            delete hash[key];
                        }
                        return true;
                    } else if (hasOwn(hash, altKey)) {
                        res[key] = hash[altKey];
                        if (!preserve) {
                            delete hash[altKey];
                        }
                        return true;
                    }
                }
                return false;
            }
            function simpleNormalizeChildren(children) {
                for(var i = 0; i < children.length; i++){
                    if (isArray(children[i])) {
                        return Array.prototype.concat.apply([], children);
                    }
                }
                return children;
            }
            function normalizeChildren(children) {
                return isPrimitive(children) ? [
                    createTextVNode(children)
                ] : isArray(children) ? normalizeArrayChildren(children) : void 0;
            }
            function isTextNode(node) {
                return isDef(node) && isDef(node.text) && isFalse(node.isComment);
            }
            function normalizeArrayChildren(children, nestedIndex) {
                var res = [];
                var i, c, lastIndex, last;
                for(i = 0; i < children.length; i++){
                    c = children[i];
                    if (isUndef(c) || typeof c === "boolean") continue;
                    lastIndex = res.length - 1;
                    last = res[lastIndex];
                    if (isArray(c)) {
                        if (c.length > 0) {
                            c = normalizeArrayChildren(c, "".concat(nestedIndex || "", "_").concat(i));
                            if (isTextNode(c[0]) && isTextNode(last)) {
                                res[lastIndex] = createTextVNode(last.text + c[0].text);
                                c.shift();
                            }
                            res.push.apply(res, c);
                        }
                    } else if (isPrimitive(c)) {
                        if (isTextNode(last)) {
                            res[lastIndex] = createTextVNode(last.text + c);
                        } else if (c !== "") {
                            res.push(createTextVNode(c));
                        }
                    } else {
                        if (isTextNode(c) && isTextNode(last)) {
                            res[lastIndex] = createTextVNode(last.text + c.text);
                        } else {
                            if (isTrue(children._isVList) && isDef(c.tag) && isUndef(c.key) && isDef(nestedIndex)) {
                                c.key = "__vlist".concat(nestedIndex, "_").concat(i, "__");
                            }
                            res.push(c);
                        }
                    }
                }
                return res;
            }
            function renderList(val, render) {
                var ret = null, i, l, keys, key;
                if (isArray(val) || typeof val === "string") {
                    ret = new Array(val.length);
                    for(i = 0, l = val.length; i < l; i++){
                        ret[i] = render(val[i], i);
                    }
                } else if (typeof val === "number") {
                    ret = new Array(val);
                    for(i = 0; i < val; i++){
                        ret[i] = render(i + 1, i);
                    }
                } else if (isObject(val)) {
                    if (hasSymbol && val[Symbol.iterator]) {
                        ret = [];
                        var iterator = val[Symbol.iterator]();
                        var result = iterator.next();
                        while(!result.done){
                            ret.push(render(result.value, ret.length));
                            result = iterator.next();
                        }
                    } else {
                        keys = Object.keys(val);
                        ret = new Array(keys.length);
                        for(i = 0, l = keys.length; i < l; i++){
                            key = keys[i];
                            ret[i] = render(val[key], key, i);
                        }
                    }
                }
                if (!isDef(ret)) {
                    ret = [];
                }
                ret._isVList = true;
                return ret;
            }
            function renderSlot(name, fallbackRender, props2, bindObject) {
                var scopedSlotFn = this.$scopedSlots[name];
                var nodes;
                if (scopedSlotFn) {
                    props2 = props2 || {};
                    if (bindObject) {
                        if (!isObject(bindObject)) {
                            warn("slot v-bind without argument expects an Object", this);
                        }
                        props2 = extend(extend({}, bindObject), props2);
                    }
                    nodes = scopedSlotFn(props2) || (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
                } else {
                    nodes = this.$slots[name] || (isFunction(fallbackRender) ? fallbackRender() : fallbackRender);
                }
                var target2 = props2 && props2.slot;
                if (target2) {
                    return this.$createElement("template", {
                        slot: target2
                    }, nodes);
                } else {
                    return nodes;
                }
            }
            function resolveFilter(id) {
                return resolveAsset(this.$options, "filters", id, true) || identity;
            }
            function isKeyNotMatch(expect, actual) {
                if (isArray(expect)) {
                    return expect.indexOf(actual) === -1;
                } else {
                    return expect !== actual;
                }
            }
            function checkKeyCodes(eventKeyCode, key, builtInKeyCode, eventKeyName, builtInKeyName) {
                var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
                if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
                    return isKeyNotMatch(builtInKeyName, eventKeyName);
                } else if (mappedKeyCode) {
                    return isKeyNotMatch(mappedKeyCode, eventKeyCode);
                } else if (eventKeyName) {
                    return hyphenate(eventKeyName) !== key;
                }
                return eventKeyCode === void 0;
            }
            function bindObjectProps(data, tag, value, asProp, isSync) {
                if (value) {
                    if (!isObject(value)) {
                        warn("v-bind without argument expects an Object or Array value", this);
                    } else {
                        var _loop = function(key) {
                            if (key === "class" || key === "style" || isReservedAttribute(key)) {
                                hash = data;
                            } else {
                                var type = data.attrs && data.attrs.type;
                                hash = asProp || config.mustUseProp(tag, type, key) ? data.domProps || (data.domProps = {}) : data.attrs || (data.attrs = {});
                            }
                            var camelizedKey = camelize(key);
                            var hyphenatedKey = hyphenate(key);
                            if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
                                hash[key] = value[key];
                                if (isSync) {
                                    var on = data.on || (data.on = {});
                                    on["update:".concat(key)] = function($event) {
                                        value[key] = $event;
                                    };
                                }
                            }
                        };
                        if (isArray(value)) {
                            value = toObject(value);
                        }
                        var hash;
                        for(var key in value)_loop(key);
                    }
                }
                return data;
            }
            function renderStatic(index2, isInFor) {
                var cached2 = this._staticTrees || (this._staticTrees = []);
                var tree = cached2[index2];
                if (tree && !isInFor) {
                    return tree;
                }
                tree = cached2[index2] = this.$options.staticRenderFns[index2].call(this._renderProxy, this._c, this);
                markStatic(tree, "__static__".concat(index2), false);
                return tree;
            }
            function markOnce(tree, index2, key) {
                markStatic(tree, "__once__".concat(index2).concat(key ? "_".concat(key) : ""), true);
                return tree;
            }
            function markStatic(tree, key, isOnce) {
                if (isArray(tree)) {
                    for(var i = 0; i < tree.length; i++){
                        if (tree[i] && typeof tree[i] !== "string") {
                            markStaticNode(tree[i], "".concat(key, "_").concat(i), isOnce);
                        }
                    }
                } else {
                    markStaticNode(tree, key, isOnce);
                }
            }
            function markStaticNode(node, key, isOnce) {
                node.isStatic = true;
                node.key = key;
                node.isOnce = isOnce;
            }
            function bindObjectListeners(data, value) {
                if (value) {
                    if (!isPlainObject(value)) {
                        warn("v-on without argument expects an Object value", this);
                    } else {
                        var on = data.on = data.on ? extend({}, data.on) : {};
                        for(var key in value){
                            var existing = on[key];
                            var ours = value[key];
                            on[key] = existing ? [].concat(existing, ours) : ours;
                        }
                    }
                }
                return data;
            }
            function resolveScopedSlots(fns, res, hasDynamicKeys, contentHashKey) {
                res = res || {
                    $stable: !hasDynamicKeys
                };
                for(var i = 0; i < fns.length; i++){
                    var slot = fns[i];
                    if (isArray(slot)) {
                        resolveScopedSlots(slot, res, hasDynamicKeys);
                    } else if (slot) {
                        if (slot.proxy) {
                            slot.fn.proxy = true;
                        }
                        res[slot.key] = slot.fn;
                    }
                }
                if (contentHashKey) {
                    res.$key = contentHashKey;
                }
                return res;
            }
            function bindDynamicKeys(baseObj, values) {
                for(var i = 0; i < values.length; i += 2){
                    var key = values[i];
                    if (typeof key === "string" && key) {
                        baseObj[values[i]] = values[i + 1];
                    } else if (key !== "" && key !== null) {
                        warn("Invalid value for dynamic directive argument (expected string or null): ".concat(key), this);
                    }
                }
                return baseObj;
            }
            function prependModifier(value, symbol) {
                return typeof value === "string" ? symbol + value : value;
            }
            function installRenderHelpers(target2) {
                target2._o = markOnce;
                target2._n = toNumber;
                target2._s = toString;
                target2._l = renderList;
                target2._t = renderSlot;
                target2._q = looseEqual;
                target2._i = looseIndexOf;
                target2._m = renderStatic;
                target2._f = resolveFilter;
                target2._k = checkKeyCodes;
                target2._b = bindObjectProps;
                target2._v = createTextVNode;
                target2._e = createEmptyVNode;
                target2._u = resolveScopedSlots;
                target2._g = bindObjectListeners;
                target2._d = bindDynamicKeys;
                target2._p = prependModifier;
            }
            function resolveSlots(children, context) {
                if (!children || !children.length) {
                    return {};
                }
                var slots = {};
                for(var i = 0, l = children.length; i < l; i++){
                    var child = children[i];
                    var data = child.data;
                    if (data && data.attrs && data.attrs.slot) {
                        delete data.attrs.slot;
                    }
                    if ((child.context === context || child.fnContext === context) && data && data.slot != null) {
                        var name = data.slot;
                        var slot = slots[name] || (slots[name] = []);
                        if (child.tag === "template") {
                            slot.push.apply(slot, child.children || []);
                        } else {
                            slot.push(child);
                        }
                    } else {
                        (slots.default || (slots.default = [])).push(child);
                    }
                }
                for(var name1 in slots){
                    if (slots[name1].every(isWhitespace)) {
                        delete slots[name1];
                    }
                }
                return slots;
            }
            function isWhitespace(node) {
                return node.isComment && !node.asyncFactory || node.text === " ";
            }
            function isAsyncPlaceholder(node) {
                return node.isComment && node.asyncFactory;
            }
            function normalizeScopedSlots(ownerVm, scopedSlots, normalSlots, prevScopedSlots) {
                var res;
                var hasNormalSlots = Object.keys(normalSlots).length > 0;
                var isStable = scopedSlots ? !!scopedSlots.$stable : !hasNormalSlots;
                var key = scopedSlots && scopedSlots.$key;
                if (!scopedSlots) {
                    res = {};
                } else if (scopedSlots._normalized) {
                    return scopedSlots._normalized;
                } else if (isStable && prevScopedSlots && prevScopedSlots !== emptyObject && key === prevScopedSlots.$key && !hasNormalSlots && !prevScopedSlots.$hasNormal) {
                    return prevScopedSlots;
                } else {
                    res = {};
                    for(var key2 in scopedSlots){
                        if (scopedSlots[key2] && key2[0] !== "$") {
                            res[key2] = normalizeScopedSlot(ownerVm, normalSlots, key2, scopedSlots[key2]);
                        }
                    }
                }
                for(var key21 in normalSlots){
                    if (!(key21 in res)) {
                        res[key21] = proxyNormalSlot(normalSlots, key21);
                    }
                }
                if (scopedSlots && Object.isExtensible(scopedSlots)) {
                    scopedSlots._normalized = res;
                }
                def(res, "$stable", isStable);
                def(res, "$key", key);
                def(res, "$hasNormal", hasNormalSlots);
                return res;
            }
            function normalizeScopedSlot(vm, normalSlots, key, fn) {
                var normalized = function normalized() {
                    var cur = currentInstance;
                    setCurrentInstance(vm);
                    var res = arguments.length ? fn.apply(null, arguments) : fn({});
                    res = res && (typeof res === "undefined" ? "undefined" : _type_of(res)) === "object" && !isArray(res) ? [
                        res
                    ] : normalizeChildren(res);
                    var vnode = res && res[0];
                    setCurrentInstance(cur);
                    return res && (!vnode || res.length === 1 && vnode.isComment && !isAsyncPlaceholder(vnode)) ? void 0 : res;
                };
                if (fn.proxy) {
                    Object.defineProperty(normalSlots, key, {
                        get: normalized,
                        enumerable: true,
                        configurable: true
                    });
                }
                return normalized;
            }
            function proxyNormalSlot(slots, key) {
                return function() {
                    return slots[key];
                };
            }
            function initSetup(vm) {
                var options = vm.$options;
                var setup = options.setup;
                if (setup) {
                    var ctx = vm._setupContext = createSetupContext(vm);
                    setCurrentInstance(vm);
                    pushTarget();
                    var setupResult = invokeWithErrorHandling(setup, null, [
                        vm._props || shallowReactive2({}),
                        ctx
                    ], vm, "setup");
                    popTarget();
                    setCurrentInstance();
                    if (isFunction(setupResult)) {
                        options.render = setupResult;
                    } else if (isObject(setupResult)) {
                        if (_instanceof(setupResult, VNode)) {
                            warn("setup() should not return VNodes directly - return a render function instead.");
                        }
                        vm._setupState = setupResult;
                        if (!setupResult.__sfc) {
                            for(var key in setupResult){
                                if (!isReserved(key)) {
                                    proxyWithRefUnwrap(vm, setupResult, key);
                                } else {
                                    warn("Avoid using variables that start with _ or $ in setup().");
                                }
                            }
                        } else {
                            var proxy2 = vm._setupProxy = {};
                            for(var key1 in setupResult){
                                if (key1 !== "__sfc") {
                                    proxyWithRefUnwrap(proxy2, setupResult, key1);
                                }
                            }
                        }
                    } else if (setupResult !== void 0) {
                        warn("setup() should return an object. Received: ".concat(setupResult === null ? "null" : typeof setupResult === "undefined" ? "undefined" : _type_of(setupResult)));
                    }
                }
            }
            function createSetupContext(vm) {
                var exposeCalled = false;
                return {
                    get attrs () {
                        if (!vm._attrsProxy) {
                            var proxy2 = vm._attrsProxy = {};
                            def(proxy2, "_v_attr_proxy", true);
                            syncSetupProxy(proxy2, vm.$attrs, emptyObject, vm, "$attrs");
                        }
                        return vm._attrsProxy;
                    },
                    get listeners () {
                        if (!vm._listenersProxy) {
                            var proxy21 = vm._listenersProxy = {};
                            syncSetupProxy(proxy21, vm.$listeners, emptyObject, vm, "$listeners");
                        }
                        return vm._listenersProxy;
                    },
                    get slots () {
                        return initSlotsProxy(vm);
                    },
                    emit: bind(vm.$emit, vm),
                    expose: function expose(exposed) {
                        {
                            if (exposeCalled) {
                                warn("expose() should be called only once per setup().", vm);
                            }
                            exposeCalled = true;
                        }
                        if (exposed) {
                            Object.keys(exposed).forEach(function(key) {
                                return proxyWithRefUnwrap(vm, exposed, key);
                            });
                        }
                    }
                };
            }
            function syncSetupProxy(to, from, prev, instance, type) {
                var changed = false;
                for(var key in from){
                    if (!(key in to)) {
                        changed = true;
                        defineProxyAttr(to, key, instance, type);
                    } else if (from[key] !== prev[key]) {
                        changed = true;
                    }
                }
                for(var key1 in to){
                    if (!(key1 in from)) {
                        changed = true;
                        delete to[key1];
                    }
                }
                return changed;
            }
            function defineProxyAttr(proxy2, key, instance, type) {
                Object.defineProperty(proxy2, key, {
                    enumerable: true,
                    configurable: true,
                    get: function get() {
                        return instance[type][key];
                    }
                });
            }
            function initSlotsProxy(vm) {
                if (!vm._slotsProxy) {
                    syncSetupSlots(vm._slotsProxy = {}, vm.$scopedSlots);
                }
                return vm._slotsProxy;
            }
            function syncSetupSlots(to, from) {
                for(var key in from){
                    to[key] = from[key];
                }
                for(var key1 in to){
                    if (!(key1 in from)) {
                        delete to[key1];
                    }
                }
            }
            function useSlots2() {
                return getContext().slots;
            }
            function useAttrs2() {
                return getContext().attrs;
            }
            function useListeners() {
                return getContext().listeners;
            }
            function getContext() {
                if (!currentInstance) {
                    warn("useContext() called without active instance.");
                }
                var vm = currentInstance;
                return vm._setupContext || (vm._setupContext = createSetupContext(vm));
            }
            function mergeDefaults2(raw, defaults) {
                var props2 = isArray(raw) ? raw.reduce(function(normalized, p) {
                    return normalized[p] = {}, normalized;
                }, {}) : raw;
                for(var key in defaults){
                    var opt = props2[key];
                    if (opt) {
                        if (isArray(opt) || isFunction(opt)) {
                            props2[key] = {
                                type: opt,
                                default: defaults[key]
                            };
                        } else {
                            opt.default = defaults[key];
                        }
                    } else if (opt === null) {
                        props2[key] = {
                            default: defaults[key]
                        };
                    } else {
                        warn('props default key "'.concat(key, '" has no corresponding declaration.'));
                    }
                }
                return props2;
            }
            function initRender(vm) {
                vm._vnode = null;
                vm._staticTrees = null;
                var options = vm.$options;
                var parentVnode = vm.$vnode = options._parentVnode;
                var renderContext = parentVnode && parentVnode.context;
                vm.$slots = resolveSlots(options._renderChildren, renderContext);
                vm.$scopedSlots = parentVnode ? normalizeScopedSlots(vm.$parent, parentVnode.data.scopedSlots, vm.$slots) : emptyObject;
                vm._c = function(a, b, c, d) {
                    return createElement$1(vm, a, b, c, d, false);
                };
                vm.$createElement = function(a, b, c, d) {
                    return createElement$1(vm, a, b, c, d, true);
                };
                var parentData = parentVnode && parentVnode.data;
                {
                    defineReactive(vm, "$attrs", parentData && parentData.attrs || emptyObject, function() {
                        !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
                    }, true);
                    defineReactive(vm, "$listeners", options._parentListeners || emptyObject, function() {
                        !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
                    }, true);
                }
            }
            var currentRenderingInstance = null;
            function renderMixin(Vue3) {
                installRenderHelpers(Vue3.prototype);
                Vue3.prototype.$nextTick = function(fn) {
                    return nextTick2(fn, this);
                };
                Vue3.prototype._render = function() {
                    var vm = this;
                    var _vm_$options = vm.$options, render = _vm_$options.render, _parentVnode = _vm_$options._parentVnode;
                    if (_parentVnode && vm._isMounted) {
                        vm.$scopedSlots = normalizeScopedSlots(vm.$parent, _parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots);
                        if (vm._slotsProxy) {
                            syncSetupSlots(vm._slotsProxy, vm.$scopedSlots);
                        }
                    }
                    vm.$vnode = _parentVnode;
                    var vnode;
                    try {
                        setCurrentInstance(vm);
                        currentRenderingInstance = vm;
                        vnode = render.call(vm._renderProxy, vm.$createElement);
                    } catch (e) {
                        handleError(e, vm, "render");
                        if (vm.$options.renderError) {
                            try {
                                vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                            } catch (e2) {
                                handleError(e2, vm, "renderError");
                                vnode = vm._vnode;
                            }
                        } else {
                            vnode = vm._vnode;
                        }
                    } finally{
                        currentRenderingInstance = null;
                        setCurrentInstance();
                    }
                    if (isArray(vnode) && vnode.length === 1) {
                        vnode = vnode[0];
                    }
                    if (!_instanceof(vnode, VNode)) {
                        if (isArray(vnode)) {
                            warn("Multiple root nodes returned from render function. Render function should return a single root node.", vm);
                        }
                        vnode = createEmptyVNode();
                    }
                    vnode.parent = _parentVnode;
                    return vnode;
                };
            }
            function ensureCtor(comp, base) {
                if (comp.__esModule || hasSymbol && comp[Symbol.toStringTag] === "Module") {
                    comp = comp.default;
                }
                return isObject(comp) ? base.extend(comp) : comp;
            }
            function createAsyncPlaceholder(factory, data, context, children, tag) {
                var node = createEmptyVNode();
                node.asyncFactory = factory;
                node.asyncMeta = {
                    data: data,
                    context: context,
                    children: children,
                    tag: tag
                };
                return node;
            }
            function resolveAsyncComponent(factory, baseCtor) {
                if (isTrue(factory.error) && isDef(factory.errorComp)) {
                    return factory.errorComp;
                }
                if (isDef(factory.resolved)) {
                    return factory.resolved;
                }
                var owner = currentRenderingInstance;
                if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
                    factory.owners.push(owner);
                }
                if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
                    return factory.loadingComp;
                }
                if (owner && !isDef(factory.owners)) {
                    var owners = factory.owners = [
                        owner
                    ];
                    var sync = true;
                    var timerLoading = null;
                    var timerTimeout = null;
                    owner.$on("hook:destroyed", function() {
                        return remove$2(owners, owner);
                    });
                    var forceRender = function(renderCompleted) {
                        for(var i = 0, l = owners.length; i < l; i++){
                            owners[i].$forceUpdate();
                        }
                        if (renderCompleted) {
                            owners.length = 0;
                            if (timerLoading !== null) {
                                clearTimeout(timerLoading);
                                timerLoading = null;
                            }
                            if (timerTimeout !== null) {
                                clearTimeout(timerTimeout);
                                timerTimeout = null;
                            }
                        }
                    };
                    var resolve = once(function(res2) {
                        factory.resolved = ensureCtor(res2, baseCtor);
                        if (!sync) {
                            forceRender(true);
                        } else {
                            owners.length = 0;
                        }
                    });
                    var reject = once(function(reason) {
                        warn("Failed to resolve async component: ".concat(String(factory)) + (reason ? "\nReason: ".concat(reason) : ""));
                        if (isDef(factory.errorComp)) {
                            factory.error = true;
                            forceRender(true);
                        }
                    });
                    var res = factory(resolve, reject);
                    if (isObject(res)) {
                        if (isPromise(res)) {
                            if (isUndef(factory.resolved)) {
                                res.then(resolve, reject);
                            }
                        } else if (isPromise(res.component)) {
                            res.component.then(resolve, reject);
                            if (isDef(res.error)) {
                                factory.errorComp = ensureCtor(res.error, baseCtor);
                            }
                            if (isDef(res.loading)) {
                                factory.loadingComp = ensureCtor(res.loading, baseCtor);
                                if (res.delay === 0) {
                                    factory.loading = true;
                                } else {
                                    timerLoading = setTimeout(function() {
                                        timerLoading = null;
                                        if (isUndef(factory.resolved) && isUndef(factory.error)) {
                                            factory.loading = true;
                                            forceRender(false);
                                        }
                                    }, res.delay || 200);
                                }
                            }
                            if (isDef(res.timeout)) {
                                timerTimeout = setTimeout(function() {
                                    timerTimeout = null;
                                    if (isUndef(factory.resolved)) {
                                        reject("timeout (".concat(res.timeout, "ms)"));
                                    }
                                }, res.timeout);
                            }
                        }
                    }
                    sync = false;
                    return factory.loading ? factory.loadingComp : factory.resolved;
                }
            }
            function getFirstComponentChild(children) {
                if (isArray(children)) {
                    for(var i = 0; i < children.length; i++){
                        var c = children[i];
                        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                            return c;
                        }
                    }
                }
            }
            var SIMPLE_NORMALIZE = 1;
            var ALWAYS_NORMALIZE = 2;
            function createElement$1(context, tag, data, children, normalizationType, alwaysNormalize) {
                if (isArray(data) || isPrimitive(data)) {
                    normalizationType = children;
                    children = data;
                    data = void 0;
                }
                if (isTrue(alwaysNormalize)) {
                    normalizationType = ALWAYS_NORMALIZE;
                }
                return _createElement(context, tag, data, children, normalizationType);
            }
            function _createElement(context, tag, data, children, normalizationType) {
                if (isDef(data) && isDef(data.__ob__)) {
                    warn("Avoid using observed data object as vnode data: ".concat(JSON.stringify(data), "\nAlways create fresh vnode data objects in each render!"), context);
                    return createEmptyVNode();
                }
                if (isDef(data) && isDef(data.is)) {
                    tag = data.is;
                }
                if (!tag) {
                    return createEmptyVNode();
                }
                if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)) {
                    warn("Avoid using non-primitive value as key, use string/number value instead.", context);
                }
                if (isArray(children) && isFunction(children[0])) {
                    data = data || {};
                    data.scopedSlots = {
                        default: children[0]
                    };
                    children.length = 0;
                }
                if (normalizationType === ALWAYS_NORMALIZE) {
                    children = normalizeChildren(children);
                } else if (normalizationType === SIMPLE_NORMALIZE) {
                    children = simpleNormalizeChildren(children);
                }
                var vnode, ns;
                if (typeof tag === "string") {
                    var Ctor;
                    ns = context.$vnode && context.$vnode.ns || config.getTagNamespace(tag);
                    if (config.isReservedTag(tag)) {
                        if (isDef(data) && isDef(data.nativeOn) && data.tag !== "component") {
                            warn("The .native modifier for v-on is only valid on components but it was used on <".concat(tag, ">."), context);
                        }
                        vnode = new VNode(config.parsePlatformTagName(tag), data, children, void 0, void 0, context);
                    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, "components", tag))) {
                        vnode = createComponent(Ctor, data, context, children, tag);
                    } else {
                        vnode = new VNode(tag, data, children, void 0, void 0, context);
                    }
                } else {
                    vnode = createComponent(tag, data, context, children);
                }
                if (isArray(vnode)) {
                    return vnode;
                } else if (isDef(vnode)) {
                    if (isDef(ns)) applyNS(vnode, ns);
                    if (isDef(data)) registerDeepBindings(data);
                    return vnode;
                } else {
                    return createEmptyVNode();
                }
            }
            function applyNS(vnode, ns, force) {
                vnode.ns = ns;
                if (vnode.tag === "foreignObject") {
                    ns = void 0;
                    force = true;
                }
                if (isDef(vnode.children)) {
                    for(var i = 0, l = vnode.children.length; i < l; i++){
                        var child = vnode.children[i];
                        if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force) && child.tag !== "svg")) {
                            applyNS(child, ns, force);
                        }
                    }
                }
            }
            function registerDeepBindings(data) {
                if (isObject(data.style)) {
                    traverse(data.style);
                }
                if (isObject(data.class)) {
                    traverse(data.class);
                }
            }
            function h2(type, props2, children) {
                if (!currentInstance) {
                    warn("globally imported h() can only be invoked when there is an active component instance, e.g. synchronously in a component's render or setup function.");
                }
                return createElement$1(currentInstance, type, props2, children, 2, true);
            }
            function handleError(err, vm, info) {
                pushTarget();
                try {
                    if (vm) {
                        var cur = vm;
                        while(cur = cur.$parent){
                            var hooks2 = cur.$options.errorCaptured;
                            if (hooks2) {
                                for(var i = 0; i < hooks2.length; i++){
                                    try {
                                        var capture = hooks2[i].call(cur, err, vm, info) === false;
                                        if (capture) return;
                                    } catch (e) {
                                        globalHandleError(e, cur, "errorCaptured hook");
                                    }
                                }
                            }
                        }
                    }
                    globalHandleError(err, vm, info);
                } finally{
                    popTarget();
                }
            }
            function invokeWithErrorHandling(handler, context, args, vm, info) {
                var res;
                try {
                    res = args ? handler.apply(context, args) : handler.call(context);
                    if (res && !res._isVue && isPromise(res) && !res._handled) {
                        res.catch(function(e) {
                            return handleError(e, vm, info + " (Promise/async)");
                        });
                        res._handled = true;
                    }
                } catch (e) {
                    handleError(e, vm, info);
                }
                return res;
            }
            function globalHandleError(err, vm, info) {
                if (config.errorHandler) {
                    try {
                        return config.errorHandler.call(null, err, vm, info);
                    } catch (e) {
                        if (e !== err) {
                            logError(e, null, "config.errorHandler");
                        }
                    }
                }
                logError(err, vm, info);
            }
            function logError(err, vm, info) {
                {
                    warn("Error in ".concat(info, ': "').concat(err.toString(), '"'), vm);
                }
                if (inBrowser && typeof console !== "undefined") {
                    console.error(err);
                } else {
                    throw err;
                }
            }
            var isUsingMicroTask = false;
            var callbacks = [];
            var pending = false;
            function flushCallbacks() {
                pending = false;
                var copies = callbacks.slice(0);
                callbacks.length = 0;
                for(var i = 0; i < copies.length; i++){
                    copies[i]();
                }
            }
            var timerFunc;
            if (typeof Promise !== "undefined" && isNative(Promise)) {
                var p = Promise.resolve();
                timerFunc = function() {
                    p.then(flushCallbacks);
                    if (isIOS) setTimeout(noop);
                };
                isUsingMicroTask = true;
            } else if (!isIE && typeof MutationObserver !== "undefined" && (isNative(MutationObserver) || // PhantomJS and iOS 7.x
            MutationObserver.toString() === "[object MutationObserverConstructor]")) {
                var counter = 1;
                var observer = new MutationObserver(flushCallbacks);
                var textNode = document.createTextNode(String(counter));
                observer.observe(textNode, {
                    characterData: true
                });
                timerFunc = function() {
                    counter = (counter + 1) % 2;
                    textNode.data = String(counter);
                };
                isUsingMicroTask = true;
            } else if (typeof setImmediate !== "undefined" && isNative(setImmediate)) {
                timerFunc = function() {
                    setImmediate(flushCallbacks);
                };
            } else {
                timerFunc = function() {
                    setTimeout(flushCallbacks, 0);
                };
            }
            function nextTick2(cb, ctx) {
                var _resolve;
                callbacks.push(function() {
                    if (cb) {
                        try {
                            cb.call(ctx);
                        } catch (e) {
                            handleError(e, ctx, "nextTick");
                        }
                    } else if (_resolve) {
                        _resolve(ctx);
                    }
                });
                if (!pending) {
                    pending = true;
                    timerFunc();
                }
                if (!cb && typeof Promise !== "undefined") {
                    return new Promise(function(resolve) {
                        _resolve = resolve;
                    });
                }
            }
            function useCssModule2() {
                var name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "$style";
                {
                    if (!currentInstance) {
                        warn("useCssModule must be called inside setup()");
                        return emptyObject;
                    }
                    var mod = currentInstance[name];
                    if (!mod) {
                        warn('Current instance does not have CSS module named "'.concat(name, '".'));
                        return emptyObject;
                    }
                    return mod;
                }
            }
            function useCssVars2(getter) {
                if (!inBrowser && true) return;
                var instance = currentInstance;
                if (!instance) {
                    warn("useCssVars is called without current active component instance.");
                    return;
                }
                watchPostEffect2(function() {
                    var el = instance.$el;
                    var vars = getter(instance, instance._setupProxy);
                    if (el && el.nodeType === 1) {
                        var style2 = el.style;
                        for(var key in vars){
                            style2.setProperty("--".concat(key), vars[key]);
                        }
                    }
                });
            }
            function defineAsyncComponent2(source) {
                if (isFunction(source)) {
                    source = {
                        loader: source
                    };
                }
                var loader = source.loader, loadingComponent = source.loadingComponent, errorComponent = source.errorComponent, _source_delay = source.delay, delay = _source_delay === void 0 ? 200 : _source_delay, timeout = source.timeout, _source_suspensible = source.// undefined = never times out
                suspensible, suspensible = _source_suspensible === void 0 ? false : _source_suspensible, // in Vue 3 default is true
                userOnError = source.onError;
                if (suspensible) {
                    warn("The suspensiblbe option for async components is not supported in Vue2. It is ignored.");
                }
                var pendingRequest = null;
                var retries = 0;
                var retry = function() {
                    retries++;
                    pendingRequest = null;
                    return load();
                };
                var load = function() {
                    var thisRequest;
                    return pendingRequest || (thisRequest = pendingRequest = loader().catch(function(err) {
                        err = _instanceof(err, Error) ? err : new Error(String(err));
                        if (userOnError) {
                            return new Promise(function(resolve, reject) {
                                var userRetry = function() {
                                    return resolve(retry());
                                };
                                var userFail = function() {
                                    return reject(err);
                                };
                                userOnError(err, userRetry, userFail, retries + 1);
                            });
                        } else {
                            throw err;
                        }
                    }).then(function(comp) {
                        if (thisRequest !== pendingRequest && pendingRequest) {
                            return pendingRequest;
                        }
                        if (!comp) {
                            warn("Async component loader resolved to undefined. If you are using retry(), make sure to return its return value.");
                        }
                        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
                            comp = comp.default;
                        }
                        if (comp && !isObject(comp) && !isFunction(comp)) {
                            throw new Error("Invalid async component load result: ".concat(comp));
                        }
                        return comp;
                    }));
                };
                return function() {
                    var component = load();
                    return {
                        component: component,
                        delay: delay,
                        timeout: timeout,
                        error: errorComponent,
                        loading: loadingComponent
                    };
                };
            }
            function createLifeCycle(hookName) {
                return function(fn) {
                    var target2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : currentInstance;
                    if (!target2) {
                        warn("".concat(formatName(hookName), " is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup()."));
                        return;
                    }
                    return injectHook(target2, hookName, fn);
                };
            }
            function formatName(name) {
                if (name === "beforeDestroy") {
                    name = "beforeUnmount";
                } else if (name === "destroyed") {
                    name = "unmounted";
                }
                return "on".concat(name[0].toUpperCase() + name.slice(1));
            }
            function injectHook(instance, hookName, fn) {
                var options = instance.$options;
                options[hookName] = mergeLifecycleHook(options[hookName], fn);
            }
            var onBeforeMount2 = createLifeCycle("beforeMount");
            var onMounted2 = createLifeCycle("mounted");
            var onBeforeUpdate2 = createLifeCycle("beforeUpdate");
            var onUpdated2 = createLifeCycle("updated");
            var onBeforeUnmount2 = createLifeCycle("beforeDestroy");
            var onUnmounted2 = createLifeCycle("destroyed");
            var onActivated2 = createLifeCycle("activated");
            var onDeactivated2 = createLifeCycle("deactivated");
            var onServerPrefetch2 = createLifeCycle("serverPrefetch");
            var onRenderTracked2 = createLifeCycle("renderTracked");
            var onRenderTriggered2 = createLifeCycle("renderTriggered");
            var injectErrorCapturedHook = createLifeCycle("errorCaptured");
            function onErrorCaptured2(hook) {
                var target2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : currentInstance;
                injectErrorCapturedHook(hook, target2);
            }
            var version2 = "2.7.14";
            function defineComponent2(options) {
                return options;
            }
            var vca = /* @__PURE__ */ Object.freeze({
                __proto__: null,
                version: version2,
                defineComponent: defineComponent2,
                ref: ref$1,
                shallowRef: shallowRef2,
                isRef: isRef2,
                toRef: toRef2,
                toRefs: toRefs2,
                unref: unref2,
                proxyRefs: proxyRefs2,
                customRef: customRef2,
                triggerRef: triggerRef2,
                reactive: reactive2,
                isReactive: isReactive2,
                isReadonly: isReadonly2,
                isShallow: isShallow2,
                isProxy: isProxy2,
                shallowReactive: shallowReactive2,
                markRaw: markRaw2,
                toRaw: toRaw2,
                readonly: readonly2,
                shallowReadonly: shallowReadonly2,
                computed: computed2,
                watch: watch2,
                watchEffect: watchEffect2,
                watchPostEffect: watchPostEffect2,
                watchSyncEffect: watchSyncEffect2,
                EffectScope: EffectScope,
                effectScope: effectScope2,
                onScopeDispose: onScopeDispose2,
                getCurrentScope: getCurrentScope2,
                provide: provide2,
                inject: inject2,
                h: h2,
                getCurrentInstance: getCurrentInstance2,
                useSlots: useSlots2,
                useAttrs: useAttrs2,
                useListeners: useListeners,
                mergeDefaults: mergeDefaults2,
                nextTick: nextTick2,
                set: set2,
                del: del2,
                useCssModule: useCssModule2,
                useCssVars: useCssVars2,
                defineAsyncComponent: defineAsyncComponent2,
                onBeforeMount: onBeforeMount2,
                onMounted: onMounted2,
                onBeforeUpdate: onBeforeUpdate2,
                onUpdated: onUpdated2,
                onBeforeUnmount: onBeforeUnmount2,
                onUnmounted: onUnmounted2,
                onActivated: onActivated2,
                onDeactivated: onDeactivated2,
                onServerPrefetch: onServerPrefetch2,
                onRenderTracked: onRenderTracked2,
                onRenderTriggered: onRenderTriggered2,
                onErrorCaptured: onErrorCaptured2
            });
            var seenObjects = new _Set();
            function traverse(val) {
                _traverse(val, seenObjects);
                seenObjects.clear();
                return val;
            }
            function _traverse(val, seen) {
                var i, keys;
                var isA = isArray(val);
                if (!isA && !isObject(val) || val.__v_skip || Object.isFrozen(val) || _instanceof(val, VNode)) {
                    return;
                }
                if (val.__ob__) {
                    var depId = val.__ob__.dep.id;
                    if (seen.has(depId)) {
                        return;
                    }
                    seen.add(depId);
                }
                if (isA) {
                    i = val.length;
                    while(i--)_traverse(val[i], seen);
                } else if (isRef2(val)) {
                    _traverse(val.value, seen);
                } else {
                    keys = Object.keys(val);
                    i = keys.length;
                    while(i--)_traverse(val[keys[i]], seen);
                }
            }
            var uid$1 = 0;
            var Watcher = /*#__PURE__*/ function() {
                function Watcher(vm, expOrFn, cb, options, isRenderWatcher) {
                    _class_call_check(this, Watcher);
                    recordEffectScope(this, // if the active effect scope is manually created (not a component scope),
                    // prioritize it
                    activeEffectScope && !activeEffectScope._vm ? activeEffectScope : vm ? vm._scope : void 0);
                    if ((this.vm = vm) && isRenderWatcher) {
                        vm._watcher = this;
                    }
                    if (options) {
                        this.deep = !!options.deep;
                        this.user = !!options.user;
                        this.lazy = !!options.lazy;
                        this.sync = !!options.sync;
                        this.before = options.before;
                        {
                            this.onTrack = options.onTrack;
                            this.onTrigger = options.onTrigger;
                        }
                    } else {
                        this.deep = this.user = this.lazy = this.sync = false;
                    }
                    this.cb = cb;
                    this.id = ++uid$1;
                    this.active = true;
                    this.post = false;
                    this.dirty = this.lazy;
                    this.deps = [];
                    this.newDeps = [];
                    this.depIds = new _Set();
                    this.newDepIds = new _Set();
                    this.expression = expOrFn.toString();
                    if (isFunction(expOrFn)) {
                        this.getter = expOrFn;
                    } else {
                        this.getter = parsePath(expOrFn);
                        if (!this.getter) {
                            this.getter = noop;
                            warn('Failed watching path: "'.concat(expOrFn, '" Watcher only accepts simple dot-delimited paths. For full control, use a function instead.'), vm);
                        }
                    }
                    this.value = this.lazy ? void 0 : this.get();
                }
                _create_class(Watcher, [
                    {
                        /**
         * Evaluate the getter, and re-collect dependencies.
         */ key: "get",
                        value: function get() {
                            pushTarget(this);
                            var value;
                            var vm = this.vm;
                            try {
                                value = this.getter.call(vm, vm);
                            } catch (e) {
                                if (this.user) {
                                    handleError(e, vm, 'getter for watcher "'.concat(this.expression, '"'));
                                } else {
                                    throw e;
                                }
                            } finally{
                                if (this.deep) {
                                    traverse(value);
                                }
                                popTarget();
                                this.cleanupDeps();
                            }
                            return value;
                        }
                    },
                    {
                        /**
         * Add a dependency to this directive.
         */ key: "addDep",
                        value: function addDep(dep) {
                            var id = dep.id;
                            if (!this.newDepIds.has(id)) {
                                this.newDepIds.add(id);
                                this.newDeps.push(dep);
                                if (!this.depIds.has(id)) {
                                    dep.addSub(this);
                                }
                            }
                        }
                    },
                    {
                        /**
         * Clean up for dependency collection.
         */ key: "cleanupDeps",
                        value: function cleanupDeps() {
                            var i = this.deps.length;
                            while(i--){
                                var dep = this.deps[i];
                                if (!this.newDepIds.has(dep.id)) {
                                    dep.removeSub(this);
                                }
                            }
                            var tmp = this.depIds;
                            this.depIds = this.newDepIds;
                            this.newDepIds = tmp;
                            this.newDepIds.clear();
                            tmp = this.deps;
                            this.deps = this.newDeps;
                            this.newDeps = tmp;
                            this.newDeps.length = 0;
                        }
                    },
                    {
                        /**
         * Subscriber interface.
         * Will be called when a dependency changes.
         */ key: "update",
                        value: function update() {
                            if (this.lazy) {
                                this.dirty = true;
                            } else if (this.sync) {
                                this.run();
                            } else {
                                queueWatcher(this);
                            }
                        }
                    },
                    {
                        /**
         * Scheduler job interface.
         * Will be called by the scheduler.
         */ key: "run",
                        value: function run() {
                            if (this.active) {
                                var value = this.get();
                                if (value !== this.value || // Deep watchers and watchers on Object/Arrays should fire even
                                // when the value is the same, because the value may
                                // have mutated.
                                isObject(value) || this.deep) {
                                    var oldValue = this.value;
                                    this.value = value;
                                    if (this.user) {
                                        var info = 'callback for watcher "'.concat(this.expression, '"');
                                        invokeWithErrorHandling(this.cb, this.vm, [
                                            value,
                                            oldValue
                                        ], this.vm, info);
                                    } else {
                                        this.cb.call(this.vm, value, oldValue);
                                    }
                                }
                            }
                        }
                    },
                    {
                        /**
         * Evaluate the value of the watcher.
         * This only gets called for lazy watchers.
         */ key: "evaluate",
                        value: function evaluate() {
                            this.value = this.get();
                            this.dirty = false;
                        }
                    },
                    {
                        /**
         * Depend on all deps collected by this watcher.
         */ key: "depend",
                        value: function depend() {
                            var i = this.deps.length;
                            while(i--){
                                this.deps[i].depend();
                            }
                        }
                    },
                    {
                        /**
         * Remove self from all dependencies' subscriber list.
         */ key: "teardown",
                        value: function teardown() {
                            if (this.vm && !this.vm._isBeingDestroyed) {
                                remove$2(this.vm._scope.effects, this);
                            }
                            if (this.active) {
                                var i = this.deps.length;
                                while(i--){
                                    this.deps[i].removeSub(this);
                                }
                                this.active = false;
                                if (this.onStop) {
                                    this.onStop();
                                }
                            }
                        }
                    }
                ]);
                return Watcher;
            }();
            var mark;
            var measure;
            {
                var perf = inBrowser && window.performance;
                if (perf && // @ts-ignore
                perf.mark && // @ts-ignore
                perf.measure && // @ts-ignore
                perf.clearMarks && // @ts-ignore
                perf.clearMeasures) {
                    mark = function(tag) {
                        return perf.mark(tag);
                    };
                    measure = function(name, startTag, endTag) {
                        perf.measure(name, startTag, endTag);
                        perf.clearMarks(startTag);
                        perf.clearMarks(endTag);
                    };
                }
            }
            function initEvents(vm) {
                vm._events = /* @__PURE__ */ Object.create(null);
                vm._hasHookEvent = false;
                var listeners = vm.$options._parentListeners;
                if (listeners) {
                    updateComponentListeners(vm, listeners);
                }
            }
            var target$1;
            function add$1(event, fn) {
                target$1.$on(event, fn);
            }
            function remove$1(event, fn) {
                target$1.$off(event, fn);
            }
            function createOnceHandler$1(event, fn) {
                var _target = target$1;
                return function onceHandler() {
                    var res = fn.apply(null, arguments);
                    if (res !== null) {
                        _target.$off(event, onceHandler);
                    }
                };
            }
            function updateComponentListeners(vm, listeners, oldListeners) {
                target$1 = vm;
                updateListeners(listeners, oldListeners || {}, add$1, remove$1, createOnceHandler$1, vm);
                target$1 = void 0;
            }
            function eventsMixin(Vue3) {
                var hookRE = /^hook:/;
                Vue3.prototype.$on = function(event, fn) {
                    var vm = this;
                    if (isArray(event)) {
                        for(var i = 0, l = event.length; i < l; i++){
                            vm.$on(event[i], fn);
                        }
                    } else {
                        (vm._events[event] || (vm._events[event] = [])).push(fn);
                        if (hookRE.test(event)) {
                            vm._hasHookEvent = true;
                        }
                    }
                    return vm;
                };
                Vue3.prototype.$once = function(event, fn) {
                    var vm = this;
                    function on() {
                        vm.$off(event, on);
                        fn.apply(vm, arguments);
                    }
                    on.fn = fn;
                    vm.$on(event, on);
                    return vm;
                };
                Vue3.prototype.$off = function(event, fn) {
                    var vm = this;
                    if (!arguments.length) {
                        vm._events = /* @__PURE__ */ Object.create(null);
                        return vm;
                    }
                    if (isArray(event)) {
                        for(var i2 = 0, l = event.length; i2 < l; i2++){
                            vm.$off(event[i2], fn);
                        }
                        return vm;
                    }
                    var cbs = vm._events[event];
                    if (!cbs) {
                        return vm;
                    }
                    if (!fn) {
                        vm._events[event] = null;
                        return vm;
                    }
                    var cb;
                    var i = cbs.length;
                    while(i--){
                        cb = cbs[i];
                        if (cb === fn || cb.fn === fn) {
                            cbs.splice(i, 1);
                            break;
                        }
                    }
                    return vm;
                };
                Vue3.prototype.$emit = function(event) {
                    var vm = this;
                    {
                        var lowerCaseEvent = event.toLowerCase();
                        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                            tip('Event "'.concat(lowerCaseEvent, '" is emitted in component ').concat(formatComponentName(vm), ' but the handler is registered for "').concat(event, '". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "').concat(hyphenate(event), '" instead of "').concat(event, '".'));
                        }
                    }
                    var cbs = vm._events[event];
                    if (cbs) {
                        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                        var args = toArray(arguments, 1);
                        var info = 'event handler for "'.concat(event, '"');
                        for(var i = 0, l = cbs.length; i < l; i++){
                            invokeWithErrorHandling(cbs[i], vm, args, vm, info);
                        }
                    }
                    return vm;
                };
            }
            var activeInstance = null;
            var isUpdatingChildComponent = false;
            function setActiveInstance(vm) {
                var prevActiveInstance = activeInstance;
                activeInstance = vm;
                return function() {
                    activeInstance = prevActiveInstance;
                };
            }
            function initLifecycle(vm) {
                var options = vm.$options;
                var parent = options.parent;
                if (parent && !options.abstract) {
                    while(parent.$options.abstract && parent.$parent){
                        parent = parent.$parent;
                    }
                    parent.$children.push(vm);
                }
                vm.$parent = parent;
                vm.$root = parent ? parent.$root : vm;
                vm.$children = [];
                vm.$refs = {};
                vm._provided = parent ? parent._provided : /* @__PURE__ */ Object.create(null);
                vm._watcher = null;
                vm._inactive = null;
                vm._directInactive = false;
                vm._isMounted = false;
                vm._isDestroyed = false;
                vm._isBeingDestroyed = false;
            }
            function lifecycleMixin(Vue3) {
                Vue3.prototype._update = function(vnode, hydrating) {
                    var vm = this;
                    var prevEl = vm.$el;
                    var prevVnode = vm._vnode;
                    var restoreActiveInstance = setActiveInstance(vm);
                    vm._vnode = vnode;
                    if (!prevVnode) {
                        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false);
                    } else {
                        vm.$el = vm.__patch__(prevVnode, vnode);
                    }
                    restoreActiveInstance();
                    if (prevEl) {
                        prevEl.__vue__ = null;
                    }
                    if (vm.$el) {
                        vm.$el.__vue__ = vm;
                    }
                    var wrapper = vm;
                    while(wrapper && wrapper.$vnode && wrapper.$parent && wrapper.$vnode === wrapper.$parent._vnode){
                        wrapper.$parent.$el = wrapper.$el;
                        wrapper = wrapper.$parent;
                    }
                };
                Vue3.prototype.$forceUpdate = function() {
                    var vm = this;
                    if (vm._watcher) {
                        vm._watcher.update();
                    }
                };
                Vue3.prototype.$destroy = function() {
                    var vm = this;
                    if (vm._isBeingDestroyed) {
                        return;
                    }
                    callHook$1(vm, "beforeDestroy");
                    vm._isBeingDestroyed = true;
                    var parent = vm.$parent;
                    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                        remove$2(parent.$children, vm);
                    }
                    vm._scope.stop();
                    if (vm._data.__ob__) {
                        vm._data.__ob__.vmCount--;
                    }
                    vm._isDestroyed = true;
                    vm.__patch__(vm._vnode, null);
                    callHook$1(vm, "destroyed");
                    vm.$off();
                    if (vm.$el) {
                        vm.$el.__vue__ = null;
                    }
                    if (vm.$vnode) {
                        vm.$vnode.parent = null;
                    }
                };
            }
            function mountComponent(vm, el, hydrating) {
                vm.$el = el;
                if (!vm.$options.render) {
                    vm.$options.render = createEmptyVNode;
                    {
                        if (vm.$options.template && vm.$options.template.charAt(0) !== "#" || vm.$options.el || el) {
                            warn("You are using the runtime-only build of Vue where the template compiler is not available. Either pre-compile the templates into render functions, or use the compiler-included build.", vm);
                        } else {
                            warn("Failed to mount component: template or render function not defined.", vm);
                        }
                    }
                }
                callHook$1(vm, "beforeMount");
                var updateComponent;
                if (config.performance && mark) {
                    updateComponent = function() {
                        var name = vm._name;
                        var id = vm._uid;
                        var startTag = "vue-perf-start:".concat(id);
                        var endTag = "vue-perf-end:".concat(id);
                        mark(startTag);
                        var vnode = vm._render();
                        mark(endTag);
                        measure("vue ".concat(name, " render"), startTag, endTag);
                        mark(startTag);
                        vm._update(vnode, hydrating);
                        mark(endTag);
                        measure("vue ".concat(name, " patch"), startTag, endTag);
                    };
                } else {
                    updateComponent = function() {
                        vm._update(vm._render(), hydrating);
                    };
                }
                var watcherOptions = {
                    before: function before() {
                        if (vm._isMounted && !vm._isDestroyed) {
                            callHook$1(vm, "beforeUpdate");
                        }
                    }
                };
                {
                    watcherOptions.onTrack = function(e) {
                        return callHook$1(vm, "renderTracked", [
                            e
                        ]);
                    };
                    watcherOptions.onTrigger = function(e) {
                        return callHook$1(vm, "renderTriggered", [
                            e
                        ]);
                    };
                }
                new Watcher(vm, updateComponent, noop, watcherOptions, true);
                hydrating = false;
                var preWatchers = vm._preWatchers;
                if (preWatchers) {
                    for(var i = 0; i < preWatchers.length; i++){
                        preWatchers[i].run();
                    }
                }
                if (vm.$vnode == null) {
                    vm._isMounted = true;
                    callHook$1(vm, "mounted");
                }
                return vm;
            }
            function updateChildComponent(vm, propsData, listeners, parentVnode, renderChildren) {
                {
                    isUpdatingChildComponent = true;
                }
                var newScopedSlots = parentVnode.data.scopedSlots;
                var oldScopedSlots = vm.$scopedSlots;
                var hasDynamicScopedSlot = !!(newScopedSlots && !newScopedSlots.$stable || oldScopedSlots !== emptyObject && !oldScopedSlots.$stable || newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key || !newScopedSlots && vm.$scopedSlots.$key);
                var needsForceUpdate = !!(renderChildren || // has new static slots
                vm.$options._renderChildren || // has old static slots
                hasDynamicScopedSlot);
                var prevVNode = vm.$vnode;
                vm.$options._parentVnode = parentVnode;
                vm.$vnode = parentVnode;
                if (vm._vnode) {
                    vm._vnode.parent = parentVnode;
                }
                vm.$options._renderChildren = renderChildren;
                var attrs2 = parentVnode.data.attrs || emptyObject;
                if (vm._attrsProxy) {
                    if (syncSetupProxy(vm._attrsProxy, attrs2, prevVNode.data && prevVNode.data.attrs || emptyObject, vm, "$attrs")) {
                        needsForceUpdate = true;
                    }
                }
                vm.$attrs = attrs2;
                listeners = listeners || emptyObject;
                var prevListeners = vm.$options._parentListeners;
                if (vm._listenersProxy) {
                    syncSetupProxy(vm._listenersProxy, listeners, prevListeners || emptyObject, vm, "$listeners");
                }
                vm.$listeners = vm.$options._parentListeners = listeners;
                updateComponentListeners(vm, listeners, prevListeners);
                if (propsData && vm.$options.props) {
                    toggleObserving(false);
                    var props2 = vm._props;
                    var propKeys = vm.$options._propKeys || [];
                    for(var i = 0; i < propKeys.length; i++){
                        var key = propKeys[i];
                        var propOptions = vm.$options.props;
                        props2[key] = validateProp(key, propOptions, propsData, vm);
                    }
                    toggleObserving(true);
                    vm.$options.propsData = propsData;
                }
                if (needsForceUpdate) {
                    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
                    vm.$forceUpdate();
                }
                {
                    isUpdatingChildComponent = false;
                }
            }
            function isInInactiveTree(vm) {
                while(vm && (vm = vm.$parent)){
                    if (vm._inactive) return true;
                }
                return false;
            }
            function activateChildComponent(vm, direct) {
                if (direct) {
                    vm._directInactive = false;
                    if (isInInactiveTree(vm)) {
                        return;
                    }
                } else if (vm._directInactive) {
                    return;
                }
                if (vm._inactive || vm._inactive === null) {
                    vm._inactive = false;
                    for(var i = 0; i < vm.$children.length; i++){
                        activateChildComponent(vm.$children[i]);
                    }
                    callHook$1(vm, "activated");
                }
            }
            function deactivateChildComponent(vm, direct) {
                if (direct) {
                    vm._directInactive = true;
                    if (isInInactiveTree(vm)) {
                        return;
                    }
                }
                if (!vm._inactive) {
                    vm._inactive = true;
                    for(var i = 0; i < vm.$children.length; i++){
                        deactivateChildComponent(vm.$children[i]);
                    }
                    callHook$1(vm, "deactivated");
                }
            }
            function callHook$1(vm, hook, args) {
                var setContext = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true;
                pushTarget();
                var prev = currentInstance;
                setContext && setCurrentInstance(vm);
                var handlers = vm.$options[hook];
                var info = "".concat(hook, " hook");
                if (handlers) {
                    for(var i = 0, j = handlers.length; i < j; i++){
                        invokeWithErrorHandling(handlers[i], vm, args || null, vm, info);
                    }
                }
                if (vm._hasHookEvent) {
                    vm.$emit("hook:" + hook);
                }
                setContext && setCurrentInstance(prev);
                popTarget();
            }
            var MAX_UPDATE_COUNT = 100;
            var queue = [];
            var activatedChildren = [];
            var has = {};
            var circular = {};
            var waiting = false;
            var flushing = false;
            var index = 0;
            function resetSchedulerState() {
                index = queue.length = activatedChildren.length = 0;
                has = {};
                {
                    circular = {};
                }
                waiting = flushing = false;
            }
            var currentFlushTimestamp = 0;
            var getNow = Date.now;
            if (inBrowser && !isIE) {
                var performance = window.performance;
                if (performance && typeof performance.now === "function" && getNow() > document.createEvent("Event").timeStamp) {
                    getNow = function() {
                        return performance.now();
                    };
                }
            }
            var sortCompareFn = function(a, b) {
                if (a.post) {
                    if (!b.post) return 1;
                } else if (b.post) {
                    return -1;
                }
                return a.id - b.id;
            };
            function flushSchedulerQueue() {
                currentFlushTimestamp = getNow();
                flushing = true;
                var watcher, id;
                queue.sort(sortCompareFn);
                for(index = 0; index < queue.length; index++){
                    watcher = queue[index];
                    if (watcher.before) {
                        watcher.before();
                    }
                    id = watcher.id;
                    has[id] = null;
                    watcher.run();
                    if (has[id] != null) {
                        circular[id] = (circular[id] || 0) + 1;
                        if (circular[id] > MAX_UPDATE_COUNT) {
                            warn("You may have an infinite update loop " + (watcher.user ? 'in watcher with expression "'.concat(watcher.expression, '"') : "in a component render function."), watcher.vm);
                            break;
                        }
                    }
                }
                var activatedQueue = activatedChildren.slice();
                var updatedQueue = queue.slice();
                resetSchedulerState();
                callActivatedHooks(activatedQueue);
                callUpdatedHooks(updatedQueue);
                cleanupDeps();
                if (devtools && config.devtools) {
                    devtools.emit("flush");
                }
            }
            function callUpdatedHooks(queue2) {
                var i = queue2.length;
                while(i--){
                    var watcher = queue2[i];
                    var vm = watcher.vm;
                    if (vm && vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
                        callHook$1(vm, "updated");
                    }
                }
            }
            function queueActivatedComponent(vm) {
                vm._inactive = false;
                activatedChildren.push(vm);
            }
            function callActivatedHooks(queue2) {
                for(var i = 0; i < queue2.length; i++){
                    queue2[i]._inactive = true;
                    activateChildComponent(queue2[i], true);
                }
            }
            function queueWatcher(watcher) {
                var id = watcher.id;
                if (has[id] != null) {
                    return;
                }
                if (watcher === Dep.target && watcher.noRecurse) {
                    return;
                }
                has[id] = true;
                if (!flushing) {
                    queue.push(watcher);
                } else {
                    var i = queue.length - 1;
                    while(i > index && queue[i].id > watcher.id){
                        i--;
                    }
                    queue.splice(i + 1, 0, watcher);
                }
                if (!waiting) {
                    waiting = true;
                    if (!config.async) {
                        flushSchedulerQueue();
                        return;
                    }
                    nextTick2(flushSchedulerQueue);
                }
            }
            function initProvide(vm) {
                var provideOption = vm.$options.provide;
                if (provideOption) {
                    var provided = isFunction(provideOption) ? provideOption.call(vm) : provideOption;
                    if (!isObject(provided)) {
                        return;
                    }
                    var source = resolveProvided(vm);
                    var keys = hasSymbol ? Reflect.ownKeys(provided) : Object.keys(provided);
                    for(var i = 0; i < keys.length; i++){
                        var key = keys[i];
                        Object.defineProperty(source, key, Object.getOwnPropertyDescriptor(provided, key));
                    }
                }
            }
            function initInjections(vm) {
                var result = resolveInject(vm.$options.inject, vm);
                if (result) {
                    toggleObserving(false);
                    Object.keys(result).forEach(function(key) {
                        {
                            defineReactive(vm, key, result[key], function() {
                                warn('Avoid mutating an injected value directly since the changes will be overwritten whenever the provided component re-renders. injection being mutated: "'.concat(key, '"'), vm);
                            });
                        }
                    });
                    toggleObserving(true);
                }
            }
            function resolveInject(inject3, vm) {
                if (inject3) {
                    var result = /* @__PURE__ */ Object.create(null);
                    var keys = hasSymbol ? Reflect.ownKeys(inject3) : Object.keys(inject3);
                    for(var i = 0; i < keys.length; i++){
                        var key = keys[i];
                        if (key === "__ob__") continue;
                        var provideKey = inject3[key].from;
                        if (provideKey in vm._provided) {
                            result[key] = vm._provided[provideKey];
                        } else if ("default" in inject3[key]) {
                            var provideDefault = inject3[key].default;
                            result[key] = isFunction(provideDefault) ? provideDefault.call(vm) : provideDefault;
                        } else {
                            warn('Injection "'.concat(key, '" not found'), vm);
                        }
                    }
                    return result;
                }
            }
            function FunctionalRenderContext(data, props2, children, parent, Ctor) {
                var _this = this;
                var options = Ctor.options;
                var contextVm;
                if (hasOwn(parent, "_uid")) {
                    contextVm = Object.create(parent);
                    contextVm._original = parent;
                } else {
                    contextVm = parent;
                    parent = parent._original;
                }
                var isCompiled = isTrue(options._compiled);
                var needNormalization = !isCompiled;
                this.data = data;
                this.props = props2;
                this.children = children;
                this.parent = parent;
                this.listeners = data.on || emptyObject;
                this.injections = resolveInject(options.inject, parent);
                this.slots = function() {
                    if (!_this.$slots) {
                        normalizeScopedSlots(parent, data.scopedSlots, _this.$slots = resolveSlots(children, parent));
                    }
                    return _this.$slots;
                };
                Object.defineProperty(this, "scopedSlots", {
                    enumerable: true,
                    get: function get() {
                        return normalizeScopedSlots(parent, data.scopedSlots, this.slots());
                    }
                });
                if (isCompiled) {
                    this.$options = options;
                    this.$slots = this.slots();
                    this.$scopedSlots = normalizeScopedSlots(parent, data.scopedSlots, this.$slots);
                }
                if (options._scopeId) {
                    this._c = function(a, b, c, d) {
                        var vnode = createElement$1(contextVm, a, b, c, d, needNormalization);
                        if (vnode && !isArray(vnode)) {
                            vnode.fnScopeId = options._scopeId;
                            vnode.fnContext = parent;
                        }
                        return vnode;
                    };
                } else {
                    this._c = function(a, b, c, d) {
                        return createElement$1(contextVm, a, b, c, d, needNormalization);
                    };
                }
            }
            installRenderHelpers(FunctionalRenderContext.prototype);
            function createFunctionalComponent(Ctor, propsData, data, contextVm, children) {
                var options = Ctor.options;
                var props2 = {};
                var propOptions = options.props;
                if (isDef(propOptions)) {
                    for(var key in propOptions){
                        props2[key] = validateProp(key, propOptions, propsData || emptyObject);
                    }
                } else {
                    if (isDef(data.attrs)) mergeProps(props2, data.attrs);
                    if (isDef(data.props)) mergeProps(props2, data.props);
                }
                var renderContext = new FunctionalRenderContext(data, props2, children, contextVm, Ctor);
                var vnode = options.render.call(null, renderContext._c, renderContext);
                if (_instanceof(vnode, VNode)) {
                    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext);
                } else if (isArray(vnode)) {
                    var vnodes = normalizeChildren(vnode) || [];
                    var res = new Array(vnodes.length);
                    for(var i = 0; i < vnodes.length; i++){
                        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
                    }
                    return res;
                }
            }
            function cloneAndMarkFunctionalResult(vnode, data, contextVm, options, renderContext) {
                var clone = cloneVNode(vnode);
                clone.fnContext = contextVm;
                clone.fnOptions = options;
                {
                    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
                }
                if (data.slot) {
                    (clone.data || (clone.data = {})).slot = data.slot;
                }
                return clone;
            }
            function mergeProps(to, from) {
                for(var key in from){
                    to[camelize(key)] = from[key];
                }
            }
            function getComponentName(options) {
                return options.name || options.__name || options._componentTag;
            }
            var componentVNodeHooks = {
                init: function init(vnode, hydrating) {
                    if (vnode.componentInstance && !vnode.componentInstance._isDestroyed && vnode.data.keepAlive) {
                        var mountedNode = vnode;
                        componentVNodeHooks.prepatch(mountedNode, mountedNode);
                    } else {
                        var child = vnode.componentInstance = createComponentInstanceForVnode(vnode, activeInstance);
                        child.$mount(hydrating ? vnode.elm : void 0, hydrating);
                    }
                },
                prepatch: function prepatch(oldVnode, vnode) {
                    var options = vnode.componentOptions;
                    var child = vnode.componentInstance = oldVnode.componentInstance;
                    updateChildComponent(child, options.propsData, // updated props
                    options.listeners, // updated listeners
                    vnode, // new parent vnode
                    options.children);
                },
                insert: function insert(vnode) {
                    var context = vnode.context, componentInstance = vnode.componentInstance;
                    if (!componentInstance._isMounted) {
                        componentInstance._isMounted = true;
                        callHook$1(componentInstance, "mounted");
                    }
                    if (vnode.data.keepAlive) {
                        if (context._isMounted) {
                            queueActivatedComponent(componentInstance);
                        } else {
                            activateChildComponent(componentInstance, true);
                        }
                    }
                },
                destroy: function destroy(vnode) {
                    var componentInstance = vnode.componentInstance;
                    if (!componentInstance._isDestroyed) {
                        if (!vnode.data.keepAlive) {
                            componentInstance.$destroy();
                        } else {
                            deactivateChildComponent(componentInstance, true);
                        }
                    }
                }
            };
            var hooksToMerge = Object.keys(componentVNodeHooks);
            function createComponent(Ctor, data, context, children, tag) {
                if (isUndef(Ctor)) {
                    return;
                }
                var baseCtor = context.$options._base;
                if (isObject(Ctor)) {
                    Ctor = baseCtor.extend(Ctor);
                }
                if (typeof Ctor !== "function") {
                    {
                        warn("Invalid Component definition: ".concat(String(Ctor)), context);
                    }
                    return;
                }
                var asyncFactory;
                if (isUndef(Ctor.cid)) {
                    asyncFactory = Ctor;
                    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
                    if (Ctor === void 0) {
                        return createAsyncPlaceholder(asyncFactory, data, context, children, tag);
                    }
                }
                data = data || {};
                resolveConstructorOptions(Ctor);
                if (isDef(data.model)) {
                    transformModel(Ctor.options, data);
                }
                var propsData = extractPropsFromVNodeData(data, Ctor, tag);
                if (isTrue(Ctor.options.functional)) {
                    return createFunctionalComponent(Ctor, propsData, data, context, children);
                }
                var listeners = data.on;
                data.on = data.nativeOn;
                if (isTrue(Ctor.options.abstract)) {
                    var slot = data.slot;
                    data = {};
                    if (slot) {
                        data.slot = slot;
                    }
                }
                installComponentHooks(data);
                var name = getComponentName(Ctor.options) || tag;
                var vnode = new VNode(// @ts-expect-error
                "vue-component-".concat(Ctor.cid).concat(name ? "-".concat(name) : ""), data, void 0, void 0, void 0, context, // @ts-expect-error
                {
                    Ctor: Ctor,
                    propsData: propsData,
                    listeners: listeners,
                    tag: tag,
                    children: children
                }, asyncFactory);
                return vnode;
            }
            function createComponentInstanceForVnode(vnode, parent) {
                var options = {
                    _isComponent: true,
                    _parentVnode: vnode,
                    parent: parent
                };
                var inlineTemplate = vnode.data.inlineTemplate;
                if (isDef(inlineTemplate)) {
                    options.render = inlineTemplate.render;
                    options.staticRenderFns = inlineTemplate.staticRenderFns;
                }
                return new vnode.componentOptions.Ctor(options);
            }
            function installComponentHooks(data) {
                var hooks2 = data.hook || (data.hook = {});
                for(var i = 0; i < hooksToMerge.length; i++){
                    var key = hooksToMerge[i];
                    var existing = hooks2[key];
                    var toMerge = componentVNodeHooks[key];
                    if (existing !== toMerge && !(existing && existing._merged)) {
                        hooks2[key] = existing ? mergeHook(toMerge, existing) : toMerge;
                    }
                }
            }
            function mergeHook(f1, f2) {
                var merged = function(a, b) {
                    f1(a, b);
                    f2(a, b);
                };
                merged._merged = true;
                return merged;
            }
            function transformModel(options, data) {
                var prop = options.model && options.model.prop || "value";
                var event = options.model && options.model.event || "input";
                (data.attrs || (data.attrs = {}))[prop] = data.model.value;
                var on = data.on || (data.on = {});
                var existing = on[event];
                var callback = data.model.callback;
                if (isDef(existing)) {
                    if (isArray(existing) ? existing.indexOf(callback) === -1 : existing !== callback) {
                        on[event] = [
                            callback
                        ].concat(existing);
                    }
                } else {
                    on[event] = callback;
                }
            }
            var warn = noop;
            var tip = noop;
            var generateComponentTrace;
            var formatComponentName;
            {
                var hasConsole = typeof console !== "undefined";
                var classifyRE = /(?:^|[-_])(\w)/g;
                var classify = function(str) {
                    return str.replace(classifyRE, function(c) {
                        return c.toUpperCase();
                    }).replace(/[-_]/g, "");
                };
                warn = function(msg) {
                    var vm = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : currentInstance;
                    var trace = vm ? generateComponentTrace(vm) : "";
                    if (config.warnHandler) {
                        config.warnHandler.call(null, msg, vm, trace);
                    } else if (hasConsole && !config.silent) {
                        console.error("[Vue warn]: ".concat(msg).concat(trace));
                    }
                };
                tip = function(msg, vm) {
                    if (hasConsole && !config.silent) {
                        console.warn("[Vue tip]: ".concat(msg) + (vm ? generateComponentTrace(vm) : ""));
                    }
                };
                formatComponentName = function(vm, includeFile) {
                    if (vm.$root === vm) {
                        return "<Root>";
                    }
                    var options = isFunction(vm) && vm.cid != null ? vm.options : vm._isVue ? vm.$options || vm.constructor.options : vm;
                    var name = getComponentName(options);
                    var file = options.__file;
                    if (!name && file) {
                        var match = file.match(/([^/\\]+)\.vue$/);
                        name = match && match[1];
                    }
                    return (name ? "<".concat(classify(name), ">") : "<Anonymous>") + (file && includeFile !== false ? " at ".concat(file) : "");
                };
                var repeat = function(str, n) {
                    var res = "";
                    while(n){
                        if (n % 2 === 1) res += str;
                        if (n > 1) str += str;
                        n >>= 1;
                    }
                    return res;
                };
                generateComponentTrace = function(vm) {
                    if (vm._isVue && vm.$parent) {
                        var tree = [];
                        var currentRecursiveSequence = 0;
                        while(vm){
                            if (tree.length > 0) {
                                var last = tree[tree.length - 1];
                                if (last.constructor === vm.constructor) {
                                    currentRecursiveSequence++;
                                    vm = vm.$parent;
                                    continue;
                                } else if (currentRecursiveSequence > 0) {
                                    tree[tree.length - 1] = [
                                        last,
                                        currentRecursiveSequence
                                    ];
                                    currentRecursiveSequence = 0;
                                }
                            }
                            tree.push(vm);
                            vm = vm.$parent;
                        }
                        return "\n\nfound in\n\n" + tree.map(function(vm2, i) {
                            return "".concat(i === 0 ? "---> " : repeat(" ", 5 + i * 2)).concat(isArray(vm2) ? "".concat(formatComponentName(vm2[0]), "... (").concat(vm2[1], " recursive calls)") : formatComponentName(vm2));
                        }).join("\n");
                    } else {
                        return "\n\n(found in ".concat(formatComponentName(vm), ")");
                    }
                };
            }
            var strats = config.optionMergeStrategies;
            {
                strats.el = strats.propsData = function(parent, child, vm, key) {
                    if (!vm) {
                        warn('option "'.concat(key, '" can only be used during instance creation with the `new` keyword.'));
                    }
                    return defaultStrat(parent, child);
                };
            }
            function mergeData(to, from) {
                var recursive = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
                if (!from) return to;
                var key, toVal, fromVal;
                var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);
                for(var i = 0; i < keys.length; i++){
                    key = keys[i];
                    if (key === "__ob__") continue;
                    toVal = to[key];
                    fromVal = from[key];
                    if (!recursive || !hasOwn(to, key)) {
                        set2(to, key, fromVal);
                    } else if (toVal !== fromVal && isPlainObject(toVal) && isPlainObject(fromVal)) {
                        mergeData(toVal, fromVal);
                    }
                }
                return to;
            }
            function mergeDataOrFn(parentVal, childVal, vm) {
                if (!vm) {
                    if (!childVal) {
                        return parentVal;
                    }
                    if (!parentVal) {
                        return childVal;
                    }
                    return function mergedDataFn() {
                        return mergeData(isFunction(childVal) ? childVal.call(this, this) : childVal, isFunction(parentVal) ? parentVal.call(this, this) : parentVal);
                    };
                } else {
                    return function mergedInstanceDataFn() {
                        var instanceData = isFunction(childVal) ? childVal.call(vm, vm) : childVal;
                        var defaultData = isFunction(parentVal) ? parentVal.call(vm, vm) : parentVal;
                        if (instanceData) {
                            return mergeData(instanceData, defaultData);
                        } else {
                            return defaultData;
                        }
                    };
                }
            }
            strats.data = function(parentVal, childVal, vm) {
                if (!vm) {
                    if (childVal && typeof childVal !== "function") {
                        warn('The "data" option should be a function that returns a per-instance value in component definitions.', vm);
                        return parentVal;
                    }
                    return mergeDataOrFn(parentVal, childVal);
                }
                return mergeDataOrFn(parentVal, childVal, vm);
            };
            function mergeLifecycleHook(parentVal, childVal) {
                var res = childVal ? parentVal ? parentVal.concat(childVal) : isArray(childVal) ? childVal : [
                    childVal
                ] : parentVal;
                return res ? dedupeHooks(res) : res;
            }
            function dedupeHooks(hooks2) {
                var res = [];
                for(var i = 0; i < hooks2.length; i++){
                    if (res.indexOf(hooks2[i]) === -1) {
                        res.push(hooks2[i]);
                    }
                }
                return res;
            }
            LIFECYCLE_HOOKS.forEach(function(hook) {
                strats[hook] = mergeLifecycleHook;
            });
            function mergeAssets(parentVal, childVal, vm, key) {
                var res = Object.create(parentVal || null);
                if (childVal) {
                    assertObjectType(key, childVal, vm);
                    return extend(res, childVal);
                } else {
                    return res;
                }
            }
            ASSET_TYPES.forEach(function(type) {
                strats[type + "s"] = mergeAssets;
            });
            strats.watch = function(parentVal, childVal, vm, key) {
                if (parentVal === nativeWatch) parentVal = void 0;
                if (childVal === nativeWatch) childVal = void 0;
                if (!childVal) return Object.create(parentVal || null);
                {
                    assertObjectType(key, childVal, vm);
                }
                if (!parentVal) return childVal;
                var ret = {};
                extend(ret, parentVal);
                for(var key2 in childVal){
                    var parent = ret[key2];
                    var child = childVal[key2];
                    if (parent && !isArray(parent)) {
                        parent = [
                            parent
                        ];
                    }
                    ret[key2] = parent ? parent.concat(child) : isArray(child) ? child : [
                        child
                    ];
                }
                return ret;
            };
            strats.props = strats.methods = strats.inject = strats.computed = function(parentVal, childVal, vm, key) {
                if (childVal && true) {
                    assertObjectType(key, childVal, vm);
                }
                if (!parentVal) return childVal;
                var ret = /* @__PURE__ */ Object.create(null);
                extend(ret, parentVal);
                if (childVal) extend(ret, childVal);
                return ret;
            };
            strats.provide = function(parentVal, childVal) {
                if (!parentVal) return childVal;
                return function() {
                    var ret = /* @__PURE__ */ Object.create(null);
                    mergeData(ret, isFunction(parentVal) ? parentVal.call(this) : parentVal);
                    if (childVal) {
                        mergeData(ret, isFunction(childVal) ? childVal.call(this) : childVal, false);
                    }
                    return ret;
                };
            };
            var defaultStrat = function defaultStrat(parentVal, childVal) {
                return childVal === void 0 ? parentVal : childVal;
            };
            function checkComponents(options) {
                for(var key in options.components){
                    validateComponentName(key);
                }
            }
            function validateComponentName(name) {
                if (!new RegExp("^[a-zA-Z][\\-\\.0-9_".concat(unicodeRegExp.source, "]*$")).test(name)) {
                    warn('Invalid component name: "' + name + '". Component names should conform to valid custom element name in html5 specification.');
                }
                if (isBuiltInTag(name) || config.isReservedTag(name)) {
                    warn("Do not use built-in or reserved HTML elements as component id: " + name);
                }
            }
            function normalizeProps(options, vm) {
                var props2 = options.props;
                if (!props2) return;
                var res = {};
                var i, val, name;
                if (isArray(props2)) {
                    i = props2.length;
                    while(i--){
                        val = props2[i];
                        if (typeof val === "string") {
                            name = camelize(val);
                            res[name] = {
                                type: null
                            };
                        } else {
                            warn("props must be strings when using array syntax.");
                        }
                    }
                } else if (isPlainObject(props2)) {
                    for(var key in props2){
                        val = props2[key];
                        name = camelize(key);
                        res[name] = isPlainObject(val) ? val : {
                            type: val
                        };
                    }
                } else {
                    warn('Invalid value for option "props": expected an Array or an Object, but got '.concat(toRawType(props2), "."), vm);
                }
                options.props = res;
            }
            function normalizeInject(options, vm) {
                var inject3 = options.inject;
                if (!inject3) return;
                var normalized = options.inject = {};
                if (isArray(inject3)) {
                    for(var i = 0; i < inject3.length; i++){
                        normalized[inject3[i]] = {
                            from: inject3[i]
                        };
                    }
                } else if (isPlainObject(inject3)) {
                    for(var key in inject3){
                        var val = inject3[key];
                        normalized[key] = isPlainObject(val) ? extend({
                            from: key
                        }, val) : {
                            from: val
                        };
                    }
                } else {
                    warn('Invalid value for option "inject": expected an Array or an Object, but got '.concat(toRawType(inject3), "."), vm);
                }
            }
            function normalizeDirectives$1(options) {
                var dirs = options.directives;
                if (dirs) {
                    for(var key in dirs){
                        var def2 = dirs[key];
                        if (isFunction(def2)) {
                            dirs[key] = {
                                bind: def2,
                                update: def2
                            };
                        }
                    }
                }
            }
            function assertObjectType(name, value, vm) {
                if (!isPlainObject(value)) {
                    warn('Invalid value for option "'.concat(name, '": expected an Object, but got ').concat(toRawType(value), "."), vm);
                }
            }
            function mergeOptions(parent, child, vm) {
                {
                    checkComponents(child);
                }
                if (isFunction(child)) {
                    child = child.options;
                }
                normalizeProps(child, vm);
                normalizeInject(child, vm);
                normalizeDirectives$1(child);
                if (!child._base) {
                    if (child.extends) {
                        parent = mergeOptions(parent, child.extends, vm);
                    }
                    if (child.mixins) {
                        for(var i = 0, l = child.mixins.length; i < l; i++){
                            parent = mergeOptions(parent, child.mixins[i], vm);
                        }
                    }
                }
                var options = {};
                var key;
                for(key in parent){
                    mergeField(key);
                }
                for(key in child){
                    if (!hasOwn(parent, key)) {
                        mergeField(key);
                    }
                }
                function mergeField(key2) {
                    var strat = strats[key2] || defaultStrat;
                    options[key2] = strat(parent[key2], child[key2], vm, key2);
                }
                return options;
            }
            function resolveAsset(options, type, id, warnMissing) {
                if (typeof id !== "string") {
                    return;
                }
                var assets = options[type];
                if (hasOwn(assets, id)) return assets[id];
                var camelizedId = camelize(id);
                if (hasOwn(assets, camelizedId)) return assets[camelizedId];
                var PascalCaseId = capitalize(camelizedId);
                if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId];
                var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
                if (warnMissing && !res) {
                    warn("Failed to resolve " + type.slice(0, -1) + ": " + id);
                }
                return res;
            }
            function validateProp(key, propOptions, propsData, vm) {
                var prop = propOptions[key];
                var absent = !hasOwn(propsData, key);
                var value = propsData[key];
                var booleanIndex = getTypeIndex(Boolean, prop.type);
                if (booleanIndex > -1) {
                    if (absent && !hasOwn(prop, "default")) {
                        value = false;
                    } else if (value === "" || value === hyphenate(key)) {
                        var stringIndex = getTypeIndex(String, prop.type);
                        if (stringIndex < 0 || booleanIndex < stringIndex) {
                            value = true;
                        }
                    }
                }
                if (value === void 0) {
                    value = getPropDefaultValue(vm, prop, key);
                    var prevShouldObserve = shouldObserve;
                    toggleObserving(true);
                    observe(value);
                    toggleObserving(prevShouldObserve);
                }
                {
                    assertProp(prop, key, value, vm, absent);
                }
                return value;
            }
            function getPropDefaultValue(vm, prop, key) {
                if (!hasOwn(prop, "default")) {
                    return void 0;
                }
                var def2 = prop.default;
                if (isObject(def2)) {
                    warn('Invalid default value for prop "' + key + '": Props with type Object/Array must use a factory function to return the default value.', vm);
                }
                if (vm && vm.$options.propsData && vm.$options.propsData[key] === void 0 && vm._props[key] !== void 0) {
                    return vm._props[key];
                }
                return isFunction(def2) && getType(prop.type) !== "Function" ? def2.call(vm) : def2;
            }
            function assertProp(prop, name, value, vm, absent) {
                if (prop.required && absent) {
                    warn('Missing required prop: "' + name + '"', vm);
                    return;
                }
                if (value == null && !prop.required) {
                    return;
                }
                var type = prop.type;
                var valid = !type || type === true;
                var expectedTypes = [];
                if (type) {
                    if (!isArray(type)) {
                        type = [
                            type
                        ];
                    }
                    for(var i = 0; i < type.length && !valid; i++){
                        var assertedType = assertType(value, type[i], vm);
                        expectedTypes.push(assertedType.expectedType || "");
                        valid = assertedType.valid;
                    }
                }
                var haveExpectedTypes = expectedTypes.some(function(t) {
                    return t;
                });
                if (!valid && haveExpectedTypes) {
                    warn(getInvalidTypeMessage(name, value, expectedTypes), vm);
                    return;
                }
                var validator = prop.validator;
                if (validator) {
                    if (!validator(value)) {
                        warn('Invalid prop: custom validator check failed for prop "' + name + '".', vm);
                    }
                }
            }
            var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol|BigInt)$/;
            function assertType(value, type, vm) {
                var valid;
                var expectedType = getType(type);
                if (simpleCheckRE.test(expectedType)) {
                    var t = typeof value === "undefined" ? "undefined" : _type_of(value);
                    valid = t === expectedType.toLowerCase();
                    if (!valid && t === "object") {
                        valid = _instanceof(value, type);
                    }
                } else if (expectedType === "Object") {
                    valid = isPlainObject(value);
                } else if (expectedType === "Array") {
                    valid = isArray(value);
                } else {
                    try {
                        valid = _instanceof(value, type);
                    } catch (e) {
                        warn('Invalid prop type: "' + String(type) + '" is not a constructor', vm);
                        valid = false;
                    }
                }
                return {
                    valid: valid,
                    expectedType: expectedType
                };
            }
            var functionTypeCheckRE = /^\s*function (\w+)/;
            function getType(fn) {
                var match = fn && fn.toString().match(functionTypeCheckRE);
                return match ? match[1] : "";
            }
            function isSameType(a, b) {
                return getType(a) === getType(b);
            }
            function getTypeIndex(type, expectedTypes) {
                if (!isArray(expectedTypes)) {
                    return isSameType(expectedTypes, type) ? 0 : -1;
                }
                for(var i = 0, len = expectedTypes.length; i < len; i++){
                    if (isSameType(expectedTypes[i], type)) {
                        return i;
                    }
                }
                return -1;
            }
            function getInvalidTypeMessage(name, value, expectedTypes) {
                var message = 'Invalid prop: type check failed for prop "'.concat(name, '". Expected ').concat(expectedTypes.map(capitalize).join(", "));
                var expectedType = expectedTypes[0];
                var receivedType = toRawType(value);
                if (expectedTypes.length === 1 && isExplicable(expectedType) && isExplicable(typeof value === "undefined" ? "undefined" : _type_of(value)) && !isBoolean(expectedType, receivedType)) {
                    message += " with value ".concat(styleValue(value, expectedType));
                }
                message += ", got ".concat(receivedType, " ");
                if (isExplicable(receivedType)) {
                    message += "with value ".concat(styleValue(value, receivedType), ".");
                }
                return message;
            }
            function styleValue(value, type) {
                if (type === "String") {
                    return '"'.concat(value, '"');
                } else if (type === "Number") {
                    return "".concat(Number(value));
                } else {
                    return "".concat(value);
                }
            }
            var EXPLICABLE_TYPES = [
                "string",
                "number",
                "boolean"
            ];
            function isExplicable(value) {
                return EXPLICABLE_TYPES.some(function(elem) {
                    return value.toLowerCase() === elem;
                });
            }
            function isBoolean() {
                for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                    args[_key] = arguments[_key];
                }
                return args.some(function(elem) {
                    return elem.toLowerCase() === "boolean";
                });
            }
            var initProxy;
            {
                var allowedGlobals = makeMap("Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,require");
                var warnNonPresent = function(target2, key) {
                    warn('Property or method "'.concat(key, '" is not defined on the instance but referenced during render. Make sure that this property is reactive, either in the data option, or for class-based components, by initializing the property. See: https://v2.vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.'), target2);
                };
                var warnReservedPrefix = function(target2, key) {
                    warn('Property "'.concat(key, '" must be accessed with "$data.').concat(key, '" because properties starting with "$" or "_" are not proxied in the Vue instance to prevent conflicts with Vue internals. See: https://v2.vuejs.org/v2/api/#data'), target2);
                };
                var hasProxy = typeof Proxy !== "undefined" && isNative(Proxy);
                if (hasProxy) {
                    var isBuiltInModifier = makeMap("stop,prevent,self,ctrl,shift,alt,meta,exact");
                    config.keyCodes = new Proxy(config.keyCodes, {
                        set: function set(target2, key, value) {
                            if (isBuiltInModifier(key)) {
                                warn("Avoid overwriting built-in modifier in config.keyCodes: .".concat(key));
                                return false;
                            } else {
                                target2[key] = value;
                                return true;
                            }
                        }
                    });
                }
                var hasHandler = {
                    has: function has(target2, key) {
                        var has2 = key in target2;
                        var isAllowed = allowedGlobals(key) || typeof key === "string" && key.charAt(0) === "_" && !(key in target2.$data);
                        if (!has2 && !isAllowed) {
                            if (key in target2.$data) warnReservedPrefix(target2, key);
                            else warnNonPresent(target2, key);
                        }
                        return has2 || !isAllowed;
                    }
                };
                var getHandler = {
                    get: function get(target2, key) {
                        if (typeof key === "string" && !(key in target2)) {
                            if (key in target2.$data) warnReservedPrefix(target2, key);
                            else warnNonPresent(target2, key);
                        }
                        return target2[key];
                    }
                };
                initProxy = function initProxy2(vm) {
                    if (hasProxy) {
                        var options = vm.$options;
                        var handlers = options.render && options.render._withStripped ? getHandler : hasHandler;
                        vm._renderProxy = new Proxy(vm, handlers);
                    } else {
                        vm._renderProxy = vm;
                    }
                };
            }
            var sharedPropertyDefinition = {
                enumerable: true,
                configurable: true,
                get: noop,
                set: noop
            };
            function proxy(target2, sourceKey, key) {
                sharedPropertyDefinition.get = function proxyGetter() {
                    return this[sourceKey][key];
                };
                sharedPropertyDefinition.set = function proxySetter(val) {
                    this[sourceKey][key] = val;
                };
                Object.defineProperty(target2, key, sharedPropertyDefinition);
            }
            function initState(vm) {
                var opts = vm.$options;
                if (opts.props) initProps$1(vm, opts.props);
                initSetup(vm);
                if (opts.methods) initMethods(vm, opts.methods);
                if (opts.data) {
                    initData(vm);
                } else {
                    var ob = observe(vm._data = {});
                    ob && ob.vmCount++;
                }
                if (opts.computed) initComputed$1(vm, opts.computed);
                if (opts.watch && opts.watch !== nativeWatch) {
                    initWatch(vm, opts.watch);
                }
            }
            function initProps$1(vm, propsOptions) {
                var _loop = function(key) {
                    keys.push(key);
                    var value = validateProp(key, propsOptions, propsData, vm);
                    {
                        var hyphenatedKey = hyphenate(key);
                        if (isReservedAttribute(hyphenatedKey) || config.isReservedAttr(hyphenatedKey)) {
                            warn('"'.concat(hyphenatedKey, '" is a reserved attribute and cannot be used as component prop.'), vm);
                        }
                        defineReactive(props2, key, value, function() {
                            if (!isRoot && !isUpdatingChildComponent) {
                                warn("Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: \"".concat(key, '"'), vm);
                            }
                        });
                    }
                    if (!(key in vm)) {
                        proxy(vm, "_props", key);
                    }
                };
                var propsData = vm.$options.propsData || {};
                var props2 = vm._props = shallowReactive2({});
                var keys = vm.$options._propKeys = [];
                var isRoot = !vm.$parent;
                if (!isRoot) {
                    toggleObserving(false);
                }
                for(var key in propsOptions)_loop(key);
                toggleObserving(true);
            }
            function initData(vm) {
                var data = vm.$options.data;
                data = vm._data = isFunction(data) ? getData(data, vm) : data || {};
                if (!isPlainObject(data)) {
                    data = {};
                    warn("data functions should return an object:\nhttps://v2.vuejs.org/v2/guide/components.html#data-Must-Be-a-Function", vm);
                }
                var keys = Object.keys(data);
                var props2 = vm.$options.props;
                var methods = vm.$options.methods;
                var i = keys.length;
                while(i--){
                    var key = keys[i];
                    {
                        if (methods && hasOwn(methods, key)) {
                            warn('Method "'.concat(key, '" has already been defined as a data property.'), vm);
                        }
                    }
                    if (props2 && hasOwn(props2, key)) {
                        warn('The data property "'.concat(key, '" is already declared as a prop. Use prop default value instead.'), vm);
                    } else if (!isReserved(key)) {
                        proxy(vm, "_data", key);
                    }
                }
                var ob = observe(data);
                ob && ob.vmCount++;
            }
            function getData(data, vm) {
                pushTarget();
                try {
                    return data.call(vm, vm);
                } catch (e) {
                    handleError(e, vm, "data()");
                    return {};
                } finally{
                    popTarget();
                }
            }
            var computedWatcherOptions = {
                lazy: true
            };
            function initComputed$1(vm, computed3) {
                var watchers = vm._computedWatchers = /* @__PURE__ */ Object.create(null);
                var isSSR = isServerRendering();
                for(var key in computed3){
                    var userDef = computed3[key];
                    var getter = isFunction(userDef) ? userDef : userDef.get;
                    if (getter == null) {
                        warn('Getter is missing for computed property "'.concat(key, '".'), vm);
                    }
                    if (!isSSR) {
                        watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
                    }
                    if (!(key in vm)) {
                        defineComputed(vm, key, userDef);
                    } else {
                        if (key in vm.$data) {
                            warn('The computed property "'.concat(key, '" is already defined in data.'), vm);
                        } else if (vm.$options.props && key in vm.$options.props) {
                            warn('The computed property "'.concat(key, '" is already defined as a prop.'), vm);
                        } else if (vm.$options.methods && key in vm.$options.methods) {
                            warn('The computed property "'.concat(key, '" is already defined as a method.'), vm);
                        }
                    }
                }
            }
            function defineComputed(target2, key, userDef) {
                var shouldCache = !isServerRendering();
                if (isFunction(userDef)) {
                    sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : createGetterInvoker(userDef);
                    sharedPropertyDefinition.set = noop;
                } else {
                    sharedPropertyDefinition.get = userDef.get ? shouldCache && userDef.cache !== false ? createComputedGetter(key) : createGetterInvoker(userDef.get) : noop;
                    sharedPropertyDefinition.set = userDef.set || noop;
                }
                if (sharedPropertyDefinition.set === noop) {
                    sharedPropertyDefinition.set = function() {
                        warn('Computed property "'.concat(key, '" was assigned to but it has no setter.'), this);
                    };
                }
                Object.defineProperty(target2, key, sharedPropertyDefinition);
            }
            function createComputedGetter(key) {
                return function computedGetter() {
                    var watcher = this._computedWatchers && this._computedWatchers[key];
                    if (watcher) {
                        if (watcher.dirty) {
                            watcher.evaluate();
                        }
                        if (Dep.target) {
                            if (Dep.target.onTrack) {
                                Dep.target.onTrack({
                                    effect: Dep.target,
                                    target: this,
                                    type: "get",
                                    key: key
                                });
                            }
                            watcher.depend();
                        }
                        return watcher.value;
                    }
                };
            }
            function createGetterInvoker(fn) {
                return function computedGetter() {
                    return fn.call(this, this);
                };
            }
            function initMethods(vm, methods) {
                var props2 = vm.$options.props;
                for(var key in methods){
                    {
                        if (typeof methods[key] !== "function") {
                            warn('Method "'.concat(key, '" has type "').concat(_type_of(methods[key]), '" in the component definition. Did you reference the function correctly?'), vm);
                        }
                        if (props2 && hasOwn(props2, key)) {
                            warn('Method "'.concat(key, '" has already been defined as a prop.'), vm);
                        }
                        if (key in vm && isReserved(key)) {
                            warn('Method "'.concat(key, '" conflicts with an existing Vue instance method. Avoid defining component methods that start with _ or $.'));
                        }
                    }
                    vm[key] = typeof methods[key] !== "function" ? noop : bind(methods[key], vm);
                }
            }
            function initWatch(vm, watch3) {
                for(var key in watch3){
                    var handler = watch3[key];
                    if (isArray(handler)) {
                        for(var i = 0; i < handler.length; i++){
                            createWatcher(vm, key, handler[i]);
                        }
                    } else {
                        createWatcher(vm, key, handler);
                    }
                }
            }
            function createWatcher(vm, expOrFn, handler, options) {
                if (isPlainObject(handler)) {
                    options = handler;
                    handler = handler.handler;
                }
                if (typeof handler === "string") {
                    handler = vm[handler];
                }
                return vm.$watch(expOrFn, handler, options);
            }
            function stateMixin(Vue3) {
                var dataDef = {};
                dataDef.get = function() {
                    return this._data;
                };
                var propsDef = {};
                propsDef.get = function() {
                    return this._props;
                };
                {
                    dataDef.set = function() {
                        warn("Avoid replacing instance root $data. Use nested data properties instead.", this);
                    };
                    propsDef.set = function() {
                        warn("$props is readonly.", this);
                    };
                }
                Object.defineProperty(Vue3.prototype, "$data", dataDef);
                Object.defineProperty(Vue3.prototype, "$props", propsDef);
                Vue3.prototype.$set = set2;
                Vue3.prototype.$delete = del2;
                Vue3.prototype.$watch = function(expOrFn, cb, options) {
                    var vm = this;
                    if (isPlainObject(cb)) {
                        return createWatcher(vm, expOrFn, cb, options);
                    }
                    options = options || {};
                    options.user = true;
                    var watcher = new Watcher(vm, expOrFn, cb, options);
                    if (options.immediate) {
                        var info = 'callback for immediate watcher "'.concat(watcher.expression, '"');
                        pushTarget();
                        invokeWithErrorHandling(cb, vm, [
                            watcher.value
                        ], vm, info);
                        popTarget();
                    }
                    return function unwatchFn() {
                        watcher.teardown();
                    };
                };
            }
            var uid = 0;
            function initMixin$1(Vue3) {
                Vue3.prototype._init = function(options) {
                    var vm = this;
                    vm._uid = uid++;
                    var startTag, endTag;
                    if (config.performance && mark) {
                        startTag = "vue-perf-start:".concat(vm._uid);
                        endTag = "vue-perf-end:".concat(vm._uid);
                        mark(startTag);
                    }
                    vm._isVue = true;
                    vm.__v_skip = true;
                    vm._scope = new EffectScope(true);
                    vm._scope._vm = true;
                    if (options && options._isComponent) {
                        initInternalComponent(vm, options);
                    } else {
                        vm.$options = mergeOptions(resolveConstructorOptions(vm.constructor), options || {}, vm);
                    }
                    {
                        initProxy(vm);
                    }
                    vm._self = vm;
                    initLifecycle(vm);
                    initEvents(vm);
                    initRender(vm);
                    callHook$1(vm, "beforeCreate", void 0, false);
                    initInjections(vm);
                    initState(vm);
                    initProvide(vm);
                    callHook$1(vm, "created");
                    if (config.performance && mark) {
                        vm._name = formatComponentName(vm, false);
                        mark(endTag);
                        measure("vue ".concat(vm._name, " init"), startTag, endTag);
                    }
                    if (vm.$options.el) {
                        vm.$mount(vm.$options.el);
                    }
                };
            }
            function initInternalComponent(vm, options) {
                var opts = vm.$options = Object.create(vm.constructor.options);
                var parentVnode = options._parentVnode;
                opts.parent = options.parent;
                opts._parentVnode = parentVnode;
                var vnodeComponentOptions = parentVnode.componentOptions;
                opts.propsData = vnodeComponentOptions.propsData;
                opts._parentListeners = vnodeComponentOptions.listeners;
                opts._renderChildren = vnodeComponentOptions.children;
                opts._componentTag = vnodeComponentOptions.tag;
                if (options.render) {
                    opts.render = options.render;
                    opts.staticRenderFns = options.staticRenderFns;
                }
            }
            function resolveConstructorOptions(Ctor) {
                var options = Ctor.options;
                if (Ctor.super) {
                    var superOptions = resolveConstructorOptions(Ctor.super);
                    var cachedSuperOptions = Ctor.superOptions;
                    if (superOptions !== cachedSuperOptions) {
                        Ctor.superOptions = superOptions;
                        var modifiedOptions = resolveModifiedOptions(Ctor);
                        if (modifiedOptions) {
                            extend(Ctor.extendOptions, modifiedOptions);
                        }
                        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
                        if (options.name) {
                            options.components[options.name] = Ctor;
                        }
                    }
                }
                return options;
            }
            function resolveModifiedOptions(Ctor) {
                var modified;
                var latest = Ctor.options;
                var sealed = Ctor.sealedOptions;
                for(var key in latest){
                    if (latest[key] !== sealed[key]) {
                        if (!modified) modified = {};
                        modified[key] = latest[key];
                    }
                }
                return modified;
            }
            function Vue2(options) {
                if (!_instanceof(this, Vue2)) {
                    warn("Vue is a constructor and should be called with the `new` keyword");
                }
                this._init(options);
            }
            initMixin$1(Vue2);
            stateMixin(Vue2);
            eventsMixin(Vue2);
            lifecycleMixin(Vue2);
            renderMixin(Vue2);
            function initUse(Vue3) {
                Vue3.use = function(plugin) {
                    var installedPlugins = this._installedPlugins || (this._installedPlugins = []);
                    if (installedPlugins.indexOf(plugin) > -1) {
                        return this;
                    }
                    var args = toArray(arguments, 1);
                    args.unshift(this);
                    if (isFunction(plugin.install)) {
                        plugin.install.apply(plugin, args);
                    } else if (isFunction(plugin)) {
                        plugin.apply(null, args);
                    }
                    installedPlugins.push(plugin);
                    return this;
                };
            }
            function initMixin(Vue3) {
                Vue3.mixin = function(mixin) {
                    this.options = mergeOptions(this.options, mixin);
                    return this;
                };
            }
            function initExtend(Vue3) {
                Vue3.cid = 0;
                var cid = 1;
                Vue3.extend = function(extendOptions) {
                    extendOptions = extendOptions || {};
                    var Super = this;
                    var SuperId = Super.cid;
                    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
                    if (cachedCtors[SuperId]) {
                        return cachedCtors[SuperId];
                    }
                    var name = getComponentName(extendOptions) || getComponentName(Super.options);
                    if (name) {
                        validateComponentName(name);
                    }
                    var Sub = function VueComponent(options) {
                        this._init(options);
                    };
                    Sub.prototype = Object.create(Super.prototype);
                    Sub.prototype.constructor = Sub;
                    Sub.cid = cid++;
                    Sub.options = mergeOptions(Super.options, extendOptions);
                    Sub["super"] = Super;
                    if (Sub.options.props) {
                        initProps(Sub);
                    }
                    if (Sub.options.computed) {
                        initComputed(Sub);
                    }
                    Sub.extend = Super.extend;
                    Sub.mixin = Super.mixin;
                    Sub.use = Super.use;
                    ASSET_TYPES.forEach(function(type) {
                        Sub[type] = Super[type];
                    });
                    if (name) {
                        Sub.options.components[name] = Sub;
                    }
                    Sub.superOptions = Super.options;
                    Sub.extendOptions = extendOptions;
                    Sub.sealedOptions = extend({}, Sub.options);
                    cachedCtors[SuperId] = Sub;
                    return Sub;
                };
            }
            function initProps(Comp) {
                var props2 = Comp.options.props;
                for(var key in props2){
                    proxy(Comp.prototype, "_props", key);
                }
            }
            function initComputed(Comp) {
                var computed3 = Comp.options.computed;
                for(var key in computed3){
                    defineComputed(Comp.prototype, key, computed3[key]);
                }
            }
            function initAssetRegisters(Vue3) {
                ASSET_TYPES.forEach(function(type) {
                    Vue3[type] = function(id, definition) {
                        if (!definition) {
                            return this.options[type + "s"][id];
                        } else {
                            if (type === "component") {
                                validateComponentName(id);
                            }
                            if (type === "component" && isPlainObject(definition)) {
                                definition.name = definition.name || id;
                                definition = this.options._base.extend(definition);
                            }
                            if (type === "directive" && isFunction(definition)) {
                                definition = {
                                    bind: definition,
                                    update: definition
                                };
                            }
                            this.options[type + "s"][id] = definition;
                            return definition;
                        }
                    };
                });
            }
            function _getComponentName(opts) {
                return opts && (getComponentName(opts.Ctor.options) || opts.tag);
            }
            function matches(pattern, name) {
                if (isArray(pattern)) {
                    return pattern.indexOf(name) > -1;
                } else if (typeof pattern === "string") {
                    return pattern.split(",").indexOf(name) > -1;
                } else if (isRegExp(pattern)) {
                    return pattern.test(name);
                }
                return false;
            }
            function pruneCache(keepAliveInstance, filter) {
                var cache = keepAliveInstance.cache, keys = keepAliveInstance.keys, _vnode = keepAliveInstance._vnode;
                for(var key in cache){
                    var entry = cache[key];
                    if (entry) {
                        var name = entry.name;
                        if (name && !filter(name)) {
                            pruneCacheEntry(cache, key, keys, _vnode);
                        }
                    }
                }
            }
            function pruneCacheEntry(cache, key, keys, current) {
                var entry = cache[key];
                if (entry && (!current || entry.tag !== current.tag)) {
                    entry.componentInstance.$destroy();
                }
                cache[key] = null;
                remove$2(keys, key);
            }
            var patternTypes = [
                String,
                RegExp,
                Array
            ];
            var KeepAlive = {
                name: "keep-alive",
                abstract: true,
                props: {
                    include: patternTypes,
                    exclude: patternTypes,
                    max: [
                        String,
                        Number
                    ]
                },
                methods: {
                    cacheVNode: function cacheVNode() {
                        var _this = this, cache = _this.cache, keys = _this.keys, vnodeToCache = _this.vnodeToCache, keyToCache = _this.keyToCache;
                        if (vnodeToCache) {
                            var tag = vnodeToCache.tag, componentInstance = vnodeToCache.componentInstance, componentOptions = vnodeToCache.componentOptions;
                            cache[keyToCache] = {
                                name: _getComponentName(componentOptions),
                                tag: tag,
                                componentInstance: componentInstance
                            };
                            keys.push(keyToCache);
                            if (this.max && keys.length > parseInt(this.max)) {
                                pruneCacheEntry(cache, keys[0], keys, this._vnode);
                            }
                            this.vnodeToCache = null;
                        }
                    }
                },
                created: function created() {
                    this.cache = /* @__PURE__ */ Object.create(null);
                    this.keys = [];
                },
                destroyed: function destroyed() {
                    for(var key in this.cache){
                        pruneCacheEntry(this.cache, key, this.keys);
                    }
                },
                mounted: function mounted() {
                    var _this = this;
                    this.cacheVNode();
                    this.$watch("include", function(val) {
                        pruneCache(_this, function(name) {
                            return matches(val, name);
                        });
                    });
                    this.$watch("exclude", function(val) {
                        pruneCache(_this, function(name) {
                            return !matches(val, name);
                        });
                    });
                },
                updated: function updated() {
                    this.cacheVNode();
                },
                render: function render() {
                    var slot = this.$slots.default;
                    var vnode = getFirstComponentChild(slot);
                    var componentOptions = vnode && vnode.componentOptions;
                    if (componentOptions) {
                        var name = _getComponentName(componentOptions);
                        var _this = this, include = _this.include, exclude = _this.exclude;
                        if (// not included
                        include && (!name || !matches(include, name)) || // excluded
                        exclude && name && matches(exclude, name)) {
                            return vnode;
                        }
                        var _this1 = this, cache = _this1.cache, keys = _this1.keys;
                        var key = vnode.key == null ? // same constructor may get registered as different local components
                        // so cid alone is not enough (#3269)
                        componentOptions.Ctor.cid + (componentOptions.tag ? "::".concat(componentOptions.tag) : "") : vnode.key;
                        if (cache[key]) {
                            vnode.componentInstance = cache[key].componentInstance;
                            remove$2(keys, key);
                            keys.push(key);
                        } else {
                            this.vnodeToCache = vnode;
                            this.keyToCache = key;
                        }
                        vnode.data.keepAlive = true;
                    }
                    return vnode || slot && slot[0];
                }
            };
            var builtInComponents = {
                KeepAlive: KeepAlive
            };
            function initGlobalAPI(Vue3) {
                var configDef = {};
                configDef.get = function() {
                    return config;
                };
                {
                    configDef.set = function() {
                        warn("Do not replace the Vue.config object, set individual fields instead.");
                    };
                }
                Object.defineProperty(Vue3, "config", configDef);
                Vue3.util = {
                    warn: warn,
                    extend: extend,
                    mergeOptions: mergeOptions,
                    defineReactive: defineReactive
                };
                Vue3.set = set2;
                Vue3.delete = del2;
                Vue3.nextTick = nextTick2;
                Vue3.observable = function(obj) {
                    observe(obj);
                    return obj;
                };
                Vue3.options = /* @__PURE__ */ Object.create(null);
                ASSET_TYPES.forEach(function(type) {
                    Vue3.options[type + "s"] = /* @__PURE__ */ Object.create(null);
                });
                Vue3.options._base = Vue3;
                extend(Vue3.options.components, builtInComponents);
                initUse(Vue3);
                initMixin(Vue3);
                initExtend(Vue3);
                initAssetRegisters(Vue3);
            }
            initGlobalAPI(Vue2);
            Object.defineProperty(Vue2.prototype, "$isServer", {
                get: isServerRendering
            });
            Object.defineProperty(Vue2.prototype, "$ssrContext", {
                get: function get() {
                    return this.$vnode && this.$vnode.ssrContext;
                }
            });
            Object.defineProperty(Vue2, "FunctionalRenderContext", {
                value: FunctionalRenderContext
            });
            Vue2.version = version2;
            var isReservedAttr = makeMap("style,class");
            var acceptValue = makeMap("input,textarea,option,select,progress");
            var mustUseProp = function(tag, type, attr) {
                return attr === "value" && acceptValue(tag) && type !== "button" || attr === "selected" && tag === "option" || attr === "checked" && tag === "input" || attr === "muted" && tag === "video";
            };
            var isEnumeratedAttr = makeMap("contenteditable,draggable,spellcheck");
            var isValidContentEditableValue = makeMap("events,caret,typing,plaintext-only");
            var convertEnumeratedValue = function(key, value) {
                return isFalsyAttrValue(value) || value === "false" ? "false" : // allow arbitrary string value for contenteditable
                key === "contenteditable" && isValidContentEditableValue(value) ? value : "true";
            };
            var isBooleanAttr = makeMap("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,truespeed,typemustmatch,visible");
            var xlinkNS = "http://www.w3.org/1999/xlink";
            var isXlink = function(name) {
                return name.charAt(5) === ":" && name.slice(0, 5) === "xlink";
            };
            var getXlinkProp = function(name) {
                return isXlink(name) ? name.slice(6, name.length) : "";
            };
            var isFalsyAttrValue = function(val) {
                return val == null || val === false;
            };
            function genClassForVnode(vnode) {
                var data = vnode.data;
                var parentNode2 = vnode;
                var childNode = vnode;
                while(isDef(childNode.componentInstance)){
                    childNode = childNode.componentInstance._vnode;
                    if (childNode && childNode.data) {
                        data = mergeClassData(childNode.data, data);
                    }
                }
                while(isDef(parentNode2 = parentNode2.parent)){
                    if (parentNode2 && parentNode2.data) {
                        data = mergeClassData(data, parentNode2.data);
                    }
                }
                return renderClass(data.staticClass, data.class);
            }
            function mergeClassData(child, parent) {
                return {
                    staticClass: concat(child.staticClass, parent.staticClass),
                    class: isDef(child.class) ? [
                        child.class,
                        parent.class
                    ] : parent.class
                };
            }
            function renderClass(staticClass, dynamicClass) {
                if (isDef(staticClass) || isDef(dynamicClass)) {
                    return concat(staticClass, stringifyClass(dynamicClass));
                }
                return "";
            }
            function concat(a, b) {
                return a ? b ? a + " " + b : a : b || "";
            }
            function stringifyClass(value) {
                if (Array.isArray(value)) {
                    return stringifyArray(value);
                }
                if (isObject(value)) {
                    return stringifyObject(value);
                }
                if (typeof value === "string") {
                    return value;
                }
                return "";
            }
            function stringifyArray(value) {
                var res = "";
                var stringified;
                for(var i = 0, l = value.length; i < l; i++){
                    if (isDef(stringified = stringifyClass(value[i])) && stringified !== "") {
                        if (res) res += " ";
                        res += stringified;
                    }
                }
                return res;
            }
            function stringifyObject(value) {
                var res = "";
                for(var key in value){
                    if (value[key]) {
                        if (res) res += " ";
                        res += key;
                    }
                }
                return res;
            }
            var namespaceMap = {
                svg: "http://www.w3.org/2000/svg",
                math: "http://www.w3.org/1998/Math/MathML"
            };
            var isHTMLTag = makeMap("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template,blockquote,iframe,tfoot");
            var isSVG = makeMap("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignobject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", true);
            var isReservedTag = function(tag) {
                return isHTMLTag(tag) || isSVG(tag);
            };
            function getTagNamespace(tag) {
                if (isSVG(tag)) {
                    return "svg";
                }
                if (tag === "math") {
                    return "math";
                }
            }
            var unknownElementCache = /* @__PURE__ */ Object.create(null);
            function isUnknownElement(tag) {
                if (!inBrowser) {
                    return true;
                }
                if (isReservedTag(tag)) {
                    return false;
                }
                tag = tag.toLowerCase();
                if (unknownElementCache[tag] != null) {
                    return unknownElementCache[tag];
                }
                var el = document.createElement(tag);
                if (tag.indexOf("-") > -1) {
                    return unknownElementCache[tag] = el.constructor === window.HTMLUnknownElement || el.constructor === window.HTMLElement;
                } else {
                    return unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString());
                }
            }
            var isTextInputType = makeMap("text,number,password,search,email,tel,url");
            function query(el) {
                if (typeof el === "string") {
                    var selected = document.querySelector(el);
                    if (!selected) {
                        warn("Cannot find element: " + el);
                        return document.createElement("div");
                    }
                    return selected;
                } else {
                    return el;
                }
            }
            function createElement(tagName2, vnode) {
                var elm = document.createElement(tagName2);
                if (tagName2 !== "select") {
                    return elm;
                }
                if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== void 0) {
                    elm.setAttribute("multiple", "multiple");
                }
                return elm;
            }
            function createElementNS(namespace, tagName2) {
                return document.createElementNS(namespaceMap[namespace], tagName2);
            }
            function createTextNode(text) {
                return document.createTextNode(text);
            }
            function createComment(text) {
                return document.createComment(text);
            }
            function insertBefore(parentNode2, newNode, referenceNode) {
                parentNode2.insertBefore(newNode, referenceNode);
            }
            function removeChild(node, child) {
                node.removeChild(child);
            }
            function appendChild(node, child) {
                node.appendChild(child);
            }
            function parentNode(node) {
                return node.parentNode;
            }
            function nextSibling(node) {
                return node.nextSibling;
            }
            function tagName(node) {
                return node.tagName;
            }
            function setTextContent(node, text) {
                node.textContent = text;
            }
            function setStyleScope(node, scopeId) {
                node.setAttribute(scopeId, "");
            }
            var nodeOps = /* @__PURE__ */ Object.freeze({
                __proto__: null,
                createElement: createElement,
                createElementNS: createElementNS,
                createTextNode: createTextNode,
                createComment: createComment,
                insertBefore: insertBefore,
                removeChild: removeChild,
                appendChild: appendChild,
                parentNode: parentNode,
                nextSibling: nextSibling,
                tagName: tagName,
                setTextContent: setTextContent,
                setStyleScope: setStyleScope
            });
            var ref2 = {
                create: function create(_, vnode) {
                    registerRef(vnode);
                },
                update: function update(oldVnode, vnode) {
                    if (oldVnode.data.ref !== vnode.data.ref) {
                        registerRef(oldVnode, true);
                        registerRef(vnode);
                    }
                },
                destroy: function destroy(vnode) {
                    registerRef(vnode, true);
                }
            };
            function registerRef(vnode, isRemoval) {
                var ref3 = vnode.data.ref;
                if (!isDef(ref3)) return;
                var vm = vnode.context;
                var refValue = vnode.componentInstance || vnode.elm;
                var value = isRemoval ? null : refValue;
                var $refsValue = isRemoval ? void 0 : refValue;
                if (isFunction(ref3)) {
                    invokeWithErrorHandling(ref3, vm, [
                        value
                    ], vm, "template ref function");
                    return;
                }
                var isFor = vnode.data.refInFor;
                var _isString = typeof ref3 === "string" || typeof ref3 === "number";
                var _isRef = isRef2(ref3);
                var refs = vm.$refs;
                if (_isString || _isRef) {
                    if (isFor) {
                        var existing = _isString ? refs[ref3] : ref3.value;
                        if (isRemoval) {
                            isArray(existing) && remove$2(existing, refValue);
                        } else {
                            if (!isArray(existing)) {
                                if (_isString) {
                                    refs[ref3] = [
                                        refValue
                                    ];
                                    setSetupRef(vm, ref3, refs[ref3]);
                                } else {
                                    ref3.value = [
                                        refValue
                                    ];
                                }
                            } else if (!existing.includes(refValue)) {
                                existing.push(refValue);
                            }
                        }
                    } else if (_isString) {
                        if (isRemoval && refs[ref3] !== refValue) {
                            return;
                        }
                        refs[ref3] = $refsValue;
                        setSetupRef(vm, ref3, value);
                    } else if (_isRef) {
                        if (isRemoval && ref3.value !== refValue) {
                            return;
                        }
                        ref3.value = value;
                    } else {
                        warn("Invalid template ref type: ".concat(typeof ref3 === "undefined" ? "undefined" : _type_of(ref3)));
                    }
                }
            }
            function setSetupRef(param, key, val) {
                var _setupState = param._setupState;
                if (_setupState && hasOwn(_setupState, key)) {
                    if (isRef2(_setupState[key])) {
                        _setupState[key].value = val;
                    } else {
                        _setupState[key] = val;
                    }
                }
            }
            var emptyNode = new VNode("", {}, []);
            var hooks = [
                "create",
                "activate",
                "update",
                "remove",
                "destroy"
            ];
            function sameVnode(a, b) {
                return a.key === b.key && a.asyncFactory === b.asyncFactory && (a.tag === b.tag && a.isComment === b.isComment && isDef(a.data) === isDef(b.data) && sameInputType(a, b) || isTrue(a.isAsyncPlaceholder) && isUndef(b.asyncFactory.error));
            }
            function sameInputType(a, b) {
                if (a.tag !== "input") return true;
                var i;
                var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
                var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
                return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB);
            }
            function createKeyToOldIdx(children, beginIdx, endIdx) {
                var i, key;
                var map = {};
                for(i = beginIdx; i <= endIdx; ++i){
                    key = children[i].key;
                    if (isDef(key)) map[key] = i;
                }
                return map;
            }
            function createPatchFunction(backend) {
                var i, j;
                var cbs = {};
                var modules2 = backend.modules, nodeOps2 = backend.nodeOps;
                for(i = 0; i < hooks.length; ++i){
                    cbs[hooks[i]] = [];
                    for(j = 0; j < modules2.length; ++j){
                        if (isDef(modules2[j][hooks[i]])) {
                            cbs[hooks[i]].push(modules2[j][hooks[i]]);
                        }
                    }
                }
                function emptyNodeAt(elm) {
                    return new VNode(nodeOps2.tagName(elm).toLowerCase(), {}, [], void 0, elm);
                }
                function createRmCb(childElm, listeners) {
                    function remove2() {
                        if (--remove2.listeners === 0) {
                            removeNode(childElm);
                        }
                    }
                    remove2.listeners = listeners;
                    return remove2;
                }
                function removeNode(el) {
                    var parent = nodeOps2.parentNode(el);
                    if (isDef(parent)) {
                        nodeOps2.removeChild(parent, el);
                    }
                }
                function isUnknownElement2(vnode, inVPre) {
                    return !inVPre && !vnode.ns && !(config.ignoredElements.length && config.ignoredElements.some(function(ignore) {
                        return isRegExp(ignore) ? ignore.test(vnode.tag) : ignore === vnode.tag;
                    })) && config.isUnknownElement(vnode.tag);
                }
                var creatingElmInVPre = 0;
                function createElm(vnode, insertedVnodeQueue, parentElm, refElm, nested, ownerArray, index2) {
                    if (isDef(vnode.elm) && isDef(ownerArray)) {
                        vnode = ownerArray[index2] = cloneVNode(vnode);
                    }
                    vnode.isRootInsert = !nested;
                    if (createComponent2(vnode, insertedVnodeQueue, parentElm, refElm)) {
                        return;
                    }
                    var data = vnode.data;
                    var children = vnode.children;
                    var tag = vnode.tag;
                    if (isDef(tag)) {
                        {
                            if (data && data.pre) {
                                creatingElmInVPre++;
                            }
                            if (isUnknownElement2(vnode, creatingElmInVPre)) {
                                warn("Unknown custom element: <" + tag + '> - did you register the component correctly? For recursive components, make sure to provide the "name" option.', vnode.context);
                            }
                        }
                        vnode.elm = vnode.ns ? nodeOps2.createElementNS(vnode.ns, tag) : nodeOps2.createElement(tag, vnode);
                        setScope(vnode);
                        createChildren(vnode, children, insertedVnodeQueue);
                        if (isDef(data)) {
                            invokeCreateHooks(vnode, insertedVnodeQueue);
                        }
                        insert(parentElm, vnode.elm, refElm);
                        if (data && data.pre) {
                            creatingElmInVPre--;
                        }
                    } else if (isTrue(vnode.isComment)) {
                        vnode.elm = nodeOps2.createComment(vnode.text);
                        insert(parentElm, vnode.elm, refElm);
                    } else {
                        vnode.elm = nodeOps2.createTextNode(vnode.text);
                        insert(parentElm, vnode.elm, refElm);
                    }
                }
                function createComponent2(vnode, insertedVnodeQueue, parentElm, refElm) {
                    var i2 = vnode.data;
                    if (isDef(i2)) {
                        var isReactivated = isDef(vnode.componentInstance) && i2.keepAlive;
                        if (isDef(i2 = i2.hook) && isDef(i2 = i2.init)) {
                            i2(vnode, false);
                        }
                        if (isDef(vnode.componentInstance)) {
                            initComponent(vnode, insertedVnodeQueue);
                            insert(parentElm, vnode.elm, refElm);
                            if (isTrue(isReactivated)) {
                                reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                            }
                            return true;
                        }
                    }
                }
                function initComponent(vnode, insertedVnodeQueue) {
                    if (isDef(vnode.data.pendingInsert)) {
                        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
                        vnode.data.pendingInsert = null;
                    }
                    vnode.elm = vnode.componentInstance.$el;
                    if (isPatchable(vnode)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        setScope(vnode);
                    } else {
                        registerRef(vnode);
                        insertedVnodeQueue.push(vnode);
                    }
                }
                function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
                    var i2;
                    var innerNode = vnode;
                    while(innerNode.componentInstance){
                        innerNode = innerNode.componentInstance._vnode;
                        if (isDef(i2 = innerNode.data) && isDef(i2 = i2.transition)) {
                            for(i2 = 0; i2 < cbs.activate.length; ++i2){
                                cbs.activate[i2](emptyNode, innerNode);
                            }
                            insertedVnodeQueue.push(innerNode);
                            break;
                        }
                    }
                    insert(parentElm, vnode.elm, refElm);
                }
                function insert(parent, elm, ref3) {
                    if (isDef(parent)) {
                        if (isDef(ref3)) {
                            if (nodeOps2.parentNode(ref3) === parent) {
                                nodeOps2.insertBefore(parent, elm, ref3);
                            }
                        } else {
                            nodeOps2.appendChild(parent, elm);
                        }
                    }
                }
                function createChildren(vnode, children, insertedVnodeQueue) {
                    if (isArray(children)) {
                        {
                            checkDuplicateKeys(children);
                        }
                        for(var i2 = 0; i2 < children.length; ++i2){
                            createElm(children[i2], insertedVnodeQueue, vnode.elm, null, true, children, i2);
                        }
                    } else if (isPrimitive(vnode.text)) {
                        nodeOps2.appendChild(vnode.elm, nodeOps2.createTextNode(String(vnode.text)));
                    }
                }
                function isPatchable(vnode) {
                    while(vnode.componentInstance){
                        vnode = vnode.componentInstance._vnode;
                    }
                    return isDef(vnode.tag);
                }
                function invokeCreateHooks(vnode, insertedVnodeQueue) {
                    for(var i2 = 0; i2 < cbs.create.length; ++i2){
                        cbs.create[i2](emptyNode, vnode);
                    }
                    i = vnode.data.hook;
                    if (isDef(i)) {
                        if (isDef(i.create)) i.create(emptyNode, vnode);
                        if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
                    }
                }
                function setScope(vnode) {
                    var i2;
                    if (isDef(i2 = vnode.fnScopeId)) {
                        nodeOps2.setStyleScope(vnode.elm, i2);
                    } else {
                        var ancestor = vnode;
                        while(ancestor){
                            if (isDef(i2 = ancestor.context) && isDef(i2 = i2.$options._scopeId)) {
                                nodeOps2.setStyleScope(vnode.elm, i2);
                            }
                            ancestor = ancestor.parent;
                        }
                    }
                    if (isDef(i2 = activeInstance) && i2 !== vnode.context && i2 !== vnode.fnContext && isDef(i2 = i2.$options._scopeId)) {
                        nodeOps2.setStyleScope(vnode.elm, i2);
                    }
                }
                function addVnodes(parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
                    for(; startIdx <= endIdx; ++startIdx){
                        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
                    }
                }
                function invokeDestroyHook(vnode) {
                    var i2, j2;
                    var data = vnode.data;
                    if (isDef(data)) {
                        if (isDef(i2 = data.hook) && isDef(i2 = i2.destroy)) i2(vnode);
                        for(i2 = 0; i2 < cbs.destroy.length; ++i2)cbs.destroy[i2](vnode);
                    }
                    if (isDef(i2 = vnode.children)) {
                        for(j2 = 0; j2 < vnode.children.length; ++j2){
                            invokeDestroyHook(vnode.children[j2]);
                        }
                    }
                }
                function removeVnodes(vnodes, startIdx, endIdx) {
                    for(; startIdx <= endIdx; ++startIdx){
                        var ch = vnodes[startIdx];
                        if (isDef(ch)) {
                            if (isDef(ch.tag)) {
                                removeAndInvokeRemoveHook(ch);
                                invokeDestroyHook(ch);
                            } else {
                                removeNode(ch.elm);
                            }
                        }
                    }
                }
                function removeAndInvokeRemoveHook(vnode, rm) {
                    if (isDef(rm) || isDef(vnode.data)) {
                        var i2;
                        var listeners = cbs.remove.length + 1;
                        if (isDef(rm)) {
                            rm.listeners += listeners;
                        } else {
                            rm = createRmCb(vnode.elm, listeners);
                        }
                        if (isDef(i2 = vnode.componentInstance) && isDef(i2 = i2._vnode) && isDef(i2.data)) {
                            removeAndInvokeRemoveHook(i2, rm);
                        }
                        for(i2 = 0; i2 < cbs.remove.length; ++i2){
                            cbs.remove[i2](vnode, rm);
                        }
                        if (isDef(i2 = vnode.data.hook) && isDef(i2 = i2.remove)) {
                            i2(vnode, rm);
                        } else {
                            rm();
                        }
                    } else {
                        removeNode(vnode.elm);
                    }
                }
                function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
                    var oldStartIdx = 0;
                    var newStartIdx = 0;
                    var oldEndIdx = oldCh.length - 1;
                    var oldStartVnode = oldCh[0];
                    var oldEndVnode = oldCh[oldEndIdx];
                    var newEndIdx = newCh.length - 1;
                    var newStartVnode = newCh[0];
                    var newEndVnode = newCh[newEndIdx];
                    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
                    var canMove = !removeOnly;
                    {
                        checkDuplicateKeys(newCh);
                    }
                    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
                        if (isUndef(oldStartVnode)) {
                            oldStartVnode = oldCh[++oldStartIdx];
                        } else if (isUndef(oldEndVnode)) {
                            oldEndVnode = oldCh[--oldEndIdx];
                        } else if (sameVnode(oldStartVnode, newStartVnode)) {
                            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                            oldStartVnode = oldCh[++oldStartIdx];
                            newStartVnode = newCh[++newStartIdx];
                        } else if (sameVnode(oldEndVnode, newEndVnode)) {
                            patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                            oldEndVnode = oldCh[--oldEndIdx];
                            newEndVnode = newCh[--newEndIdx];
                        } else if (sameVnode(oldStartVnode, newEndVnode)) {
                            patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
                            canMove && nodeOps2.insertBefore(parentElm, oldStartVnode.elm, nodeOps2.nextSibling(oldEndVnode.elm));
                            oldStartVnode = oldCh[++oldStartIdx];
                            newEndVnode = newCh[--newEndIdx];
                        } else if (sameVnode(oldEndVnode, newStartVnode)) {
                            patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                            canMove && nodeOps2.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                            oldEndVnode = oldCh[--oldEndIdx];
                            newStartVnode = newCh[++newStartIdx];
                        } else {
                            if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                            idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                            if (isUndef(idxInOld)) {
                                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                            } else {
                                vnodeToMove = oldCh[idxInOld];
                                if (sameVnode(vnodeToMove, newStartVnode)) {
                                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
                                    oldCh[idxInOld] = void 0;
                                    canMove && nodeOps2.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                                } else {
                                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                                }
                            }
                            newStartVnode = newCh[++newStartIdx];
                        }
                    }
                    if (oldStartIdx > oldEndIdx) {
                        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
                        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
                    } else if (newStartIdx > newEndIdx) {
                        removeVnodes(oldCh, oldStartIdx, oldEndIdx);
                    }
                }
                function checkDuplicateKeys(children) {
                    var seenKeys = {};
                    for(var i2 = 0; i2 < children.length; i2++){
                        var vnode = children[i2];
                        var key = vnode.key;
                        if (isDef(key)) {
                            if (seenKeys[key]) {
                                warn("Duplicate keys detected: '".concat(key, "'. This may cause an update error."), vnode.context);
                            } else {
                                seenKeys[key] = true;
                            }
                        }
                    }
                }
                function findIdxInOld(node, oldCh, start, end) {
                    for(var i2 = start; i2 < end; i2++){
                        var c = oldCh[i2];
                        if (isDef(c) && sameVnode(node, c)) return i2;
                    }
                }
                function patchVnode(oldVnode, vnode, insertedVnodeQueue, ownerArray, index2, removeOnly) {
                    if (oldVnode === vnode) {
                        return;
                    }
                    if (isDef(vnode.elm) && isDef(ownerArray)) {
                        vnode = ownerArray[index2] = cloneVNode(vnode);
                    }
                    var elm = vnode.elm = oldVnode.elm;
                    if (isTrue(oldVnode.isAsyncPlaceholder)) {
                        if (isDef(vnode.asyncFactory.resolved)) {
                            hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
                        } else {
                            vnode.isAsyncPlaceholder = true;
                        }
                        return;
                    }
                    if (isTrue(vnode.isStatic) && isTrue(oldVnode.isStatic) && vnode.key === oldVnode.key && (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
                        vnode.componentInstance = oldVnode.componentInstance;
                        return;
                    }
                    var i2;
                    var data = vnode.data;
                    if (isDef(data) && isDef(i2 = data.hook) && isDef(i2 = i2.prepatch)) {
                        i2(oldVnode, vnode);
                    }
                    var oldCh = oldVnode.children;
                    var ch = vnode.children;
                    if (isDef(data) && isPatchable(vnode)) {
                        for(i2 = 0; i2 < cbs.update.length; ++i2)cbs.update[i2](oldVnode, vnode);
                        if (isDef(i2 = data.hook) && isDef(i2 = i2.update)) i2(oldVnode, vnode);
                    }
                    if (isUndef(vnode.text)) {
                        if (isDef(oldCh) && isDef(ch)) {
                            if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
                        } else if (isDef(ch)) {
                            {
                                checkDuplicateKeys(ch);
                            }
                            if (isDef(oldVnode.text)) nodeOps2.setTextContent(elm, "");
                            addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                        } else if (isDef(oldCh)) {
                            removeVnodes(oldCh, 0, oldCh.length - 1);
                        } else if (isDef(oldVnode.text)) {
                            nodeOps2.setTextContent(elm, "");
                        }
                    } else if (oldVnode.text !== vnode.text) {
                        nodeOps2.setTextContent(elm, vnode.text);
                    }
                    if (isDef(data)) {
                        if (isDef(i2 = data.hook) && isDef(i2 = i2.postpatch)) i2(oldVnode, vnode);
                    }
                }
                function invokeInsertHook(vnode, queue2, initial) {
                    if (isTrue(initial) && isDef(vnode.parent)) {
                        vnode.parent.data.pendingInsert = queue2;
                    } else {
                        for(var i2 = 0; i2 < queue2.length; ++i2){
                            queue2[i2].data.hook.insert(queue2[i2]);
                        }
                    }
                }
                var hydrationBailed = false;
                var isRenderedModule = makeMap("attrs,class,staticClass,staticStyle,key");
                function hydrate(elm, vnode, insertedVnodeQueue, inVPre) {
                    var i2;
                    var tag = vnode.tag, data = vnode.data, children = vnode.children;
                    inVPre = inVPre || data && data.pre;
                    vnode.elm = elm;
                    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
                        vnode.isAsyncPlaceholder = true;
                        return true;
                    }
                    {
                        if (!assertNodeMatch(elm, vnode, inVPre)) {
                            return false;
                        }
                    }
                    if (isDef(data)) {
                        if (isDef(i2 = data.hook) && isDef(i2 = i2.init)) i2(vnode, true);
                        if (isDef(i2 = vnode.componentInstance)) {
                            initComponent(vnode, insertedVnodeQueue);
                            return true;
                        }
                    }
                    if (isDef(tag)) {
                        if (isDef(children)) {
                            if (!elm.hasChildNodes()) {
                                createChildren(vnode, children, insertedVnodeQueue);
                            } else {
                                if (isDef(i2 = data) && isDef(i2 = i2.domProps) && isDef(i2 = i2.innerHTML)) {
                                    if (i2 !== elm.innerHTML) {
                                        if (typeof console !== "undefined" && !hydrationBailed) {
                                            hydrationBailed = true;
                                            console.warn("Parent: ", elm);
                                            console.warn("server innerHTML: ", i2);
                                            console.warn("client innerHTML: ", elm.innerHTML);
                                        }
                                        return false;
                                    }
                                } else {
                                    var childrenMatch = true;
                                    var childNode = elm.firstChild;
                                    for(var i3 = 0; i3 < children.length; i3++){
                                        if (!childNode || !hydrate(childNode, children[i3], insertedVnodeQueue, inVPre)) {
                                            childrenMatch = false;
                                            break;
                                        }
                                        childNode = childNode.nextSibling;
                                    }
                                    if (!childrenMatch || childNode) {
                                        if (typeof console !== "undefined" && !hydrationBailed) {
                                            hydrationBailed = true;
                                            console.warn("Parent: ", elm);
                                            console.warn("Mismatching childNodes vs. VNodes: ", elm.childNodes, children);
                                        }
                                        return false;
                                    }
                                }
                            }
                        }
                        if (isDef(data)) {
                            var fullInvoke = false;
                            for(var key in data){
                                if (!isRenderedModule(key)) {
                                    fullInvoke = true;
                                    invokeCreateHooks(vnode, insertedVnodeQueue);
                                    break;
                                }
                            }
                            if (!fullInvoke && data["class"]) {
                                traverse(data["class"]);
                            }
                        }
                    } else if (elm.data !== vnode.text) {
                        elm.data = vnode.text;
                    }
                    return true;
                }
                function assertNodeMatch(node, vnode, inVPre) {
                    if (isDef(vnode.tag)) {
                        return vnode.tag.indexOf("vue-component") === 0 || !isUnknownElement2(vnode, inVPre) && vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase());
                    } else {
                        return node.nodeType === (vnode.isComment ? 8 : 3);
                    }
                }
                return function patch2(oldVnode, vnode, hydrating, removeOnly) {
                    if (isUndef(vnode)) {
                        if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
                        return;
                    }
                    var isInitialPatch = false;
                    var insertedVnodeQueue = [];
                    if (isUndef(oldVnode)) {
                        isInitialPatch = true;
                        createElm(vnode, insertedVnodeQueue);
                    } else {
                        var isRealElement = isDef(oldVnode.nodeType);
                        if (!isRealElement && sameVnode(oldVnode, vnode)) {
                            patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
                        } else {
                            if (isRealElement) {
                                if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                                    oldVnode.removeAttribute(SSR_ATTR);
                                    hydrating = true;
                                }
                                if (isTrue(hydrating)) {
                                    if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                                        invokeInsertHook(vnode, insertedVnodeQueue, true);
                                        return oldVnode;
                                    } else {
                                        warn("The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render.");
                                    }
                                }
                                oldVnode = emptyNodeAt(oldVnode);
                            }
                            var oldElm = oldVnode.elm;
                            var parentElm = nodeOps2.parentNode(oldElm);
                            createElm(vnode, insertedVnodeQueue, // extremely rare edge case: do not insert if old element is in a
                            // leaving transition. Only happens when combining transition +
                            // keep-alive + HOCs. (#4590)
                            oldElm._leaveCb ? null : parentElm, nodeOps2.nextSibling(oldElm));
                            if (isDef(vnode.parent)) {
                                var ancestor = vnode.parent;
                                var patchable = isPatchable(vnode);
                                while(ancestor){
                                    for(var i2 = 0; i2 < cbs.destroy.length; ++i2){
                                        cbs.destroy[i2](ancestor);
                                    }
                                    ancestor.elm = vnode.elm;
                                    if (patchable) {
                                        for(var i21 = 0; i21 < cbs.create.length; ++i21){
                                            cbs.create[i21](emptyNode, ancestor);
                                        }
                                        var insert2 = ancestor.data.hook.insert;
                                        if (insert2.merged) {
                                            for(var i22 = 1; i22 < insert2.fns.length; i22++){
                                                insert2.fns[i22]();
                                            }
                                        }
                                    } else {
                                        registerRef(ancestor);
                                    }
                                    ancestor = ancestor.parent;
                                }
                            }
                            if (isDef(parentElm)) {
                                removeVnodes([
                                    oldVnode
                                ], 0, 0);
                            } else if (isDef(oldVnode.tag)) {
                                invokeDestroyHook(oldVnode);
                            }
                        }
                    }
                    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
                    return vnode.elm;
                };
            }
            var directives = {
                create: updateDirectives,
                update: updateDirectives,
                destroy: function unbindDirectives(vnode) {
                    updateDirectives(vnode, emptyNode);
                }
            };
            function updateDirectives(oldVnode, vnode) {
                if (oldVnode.data.directives || vnode.data.directives) {
                    _update(oldVnode, vnode);
                }
            }
            function _update(oldVnode, vnode) {
                var isCreate = oldVnode === emptyNode;
                var isDestroy = vnode === emptyNode;
                var oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context);
                var newDirs = normalizeDirectives(vnode.data.directives, vnode.context);
                var dirsWithInsert = [];
                var dirsWithPostpatch = [];
                var key, oldDir, dir;
                for(key in newDirs){
                    oldDir = oldDirs[key];
                    dir = newDirs[key];
                    if (!oldDir) {
                        callHook(dir, "bind", vnode, oldVnode);
                        if (dir.def && dir.def.inserted) {
                            dirsWithInsert.push(dir);
                        }
                    } else {
                        dir.oldValue = oldDir.value;
                        dir.oldArg = oldDir.arg;
                        callHook(dir, "update", vnode, oldVnode);
                        if (dir.def && dir.def.componentUpdated) {
                            dirsWithPostpatch.push(dir);
                        }
                    }
                }
                if (dirsWithInsert.length) {
                    var callInsert = function() {
                        for(var i = 0; i < dirsWithInsert.length; i++){
                            callHook(dirsWithInsert[i], "inserted", vnode, oldVnode);
                        }
                    };
                    if (isCreate) {
                        mergeVNodeHook(vnode, "insert", callInsert);
                    } else {
                        callInsert();
                    }
                }
                if (dirsWithPostpatch.length) {
                    mergeVNodeHook(vnode, "postpatch", function() {
                        for(var i = 0; i < dirsWithPostpatch.length; i++){
                            callHook(dirsWithPostpatch[i], "componentUpdated", vnode, oldVnode);
                        }
                    });
                }
                if (!isCreate) {
                    for(key in oldDirs){
                        if (!newDirs[key]) {
                            callHook(oldDirs[key], "unbind", oldVnode, oldVnode, isDestroy);
                        }
                    }
                }
            }
            var emptyModifiers = /* @__PURE__ */ Object.create(null);
            function normalizeDirectives(dirs, vm) {
                var res = /* @__PURE__ */ Object.create(null);
                if (!dirs) {
                    return res;
                }
                var i, dir;
                for(i = 0; i < dirs.length; i++){
                    dir = dirs[i];
                    if (!dir.modifiers) {
                        dir.modifiers = emptyModifiers;
                    }
                    res[getRawDirName(dir)] = dir;
                    if (vm._setupState && vm._setupState.__sfc) {
                        var setupDef = dir.def || resolveAsset(vm, "_setupState", "v-" + dir.name);
                        if (typeof setupDef === "function") {
                            dir.def = {
                                bind: setupDef,
                                update: setupDef
                            };
                        } else {
                            dir.def = setupDef;
                        }
                    }
                    dir.def = dir.def || resolveAsset(vm.$options, "directives", dir.name, true);
                }
                return res;
            }
            function getRawDirName(dir) {
                return dir.rawName || "".concat(dir.name, ".").concat(Object.keys(dir.modifiers || {}).join("."));
            }
            function callHook(dir, hook, vnode, oldVnode, isDestroy) {
                var fn = dir.def && dir.def[hook];
                if (fn) {
                    try {
                        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
                    } catch (e) {
                        handleError(e, vnode.context, "directive ".concat(dir.name, " ").concat(hook, " hook"));
                    }
                }
            }
            var baseModules = [
                ref2,
                directives
            ];
            function updateAttrs(oldVnode, vnode) {
                var opts = vnode.componentOptions;
                if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
                    return;
                }
                if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
                    return;
                }
                var key, cur, old;
                var elm = vnode.elm;
                var oldAttrs = oldVnode.data.attrs || {};
                var attrs2 = vnode.data.attrs || {};
                if (isDef(attrs2.__ob__) || isTrue(attrs2._v_attr_proxy)) {
                    attrs2 = vnode.data.attrs = extend({}, attrs2);
                }
                for(key in attrs2){
                    cur = attrs2[key];
                    old = oldAttrs[key];
                    if (old !== cur) {
                        setAttr(elm, key, cur, vnode.data.pre);
                    }
                }
                if ((isIE || isEdge) && attrs2.value !== oldAttrs.value) {
                    setAttr(elm, "value", attrs2.value);
                }
                for(key in oldAttrs){
                    if (isUndef(attrs2[key])) {
                        if (isXlink(key)) {
                            elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
                        } else if (!isEnumeratedAttr(key)) {
                            elm.removeAttribute(key);
                        }
                    }
                }
            }
            function setAttr(el, key, value, isInPre) {
                if (isInPre || el.tagName.indexOf("-") > -1) {
                    baseSetAttr(el, key, value);
                } else if (isBooleanAttr(key)) {
                    if (isFalsyAttrValue(value)) {
                        el.removeAttribute(key);
                    } else {
                        value = key === "allowfullscreen" && el.tagName === "EMBED" ? "true" : key;
                        el.setAttribute(key, value);
                    }
                } else if (isEnumeratedAttr(key)) {
                    el.setAttribute(key, convertEnumeratedValue(key, value));
                } else if (isXlink(key)) {
                    if (isFalsyAttrValue(value)) {
                        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
                    } else {
                        el.setAttributeNS(xlinkNS, key, value);
                    }
                } else {
                    baseSetAttr(el, key, value);
                }
            }
            function baseSetAttr(el, key, value) {
                if (isFalsyAttrValue(value)) {
                    el.removeAttribute(key);
                } else {
                    if (isIE && !isIE9 && el.tagName === "TEXTAREA" && key === "placeholder" && value !== "" && !el.__ieph) {
                        var blocker = function(e) {
                            e.stopImmediatePropagation();
                            el.removeEventListener("input", blocker);
                        };
                        el.addEventListener("input", blocker);
                        el.__ieph = true;
                    }
                    el.setAttribute(key, value);
                }
            }
            var attrs = {
                create: updateAttrs,
                update: updateAttrs
            };
            function updateClass(oldVnode, vnode) {
                var el = vnode.elm;
                var data = vnode.data;
                var oldData = oldVnode.data;
                if (isUndef(data.staticClass) && isUndef(data.class) && (isUndef(oldData) || isUndef(oldData.staticClass) && isUndef(oldData.class))) {
                    return;
                }
                var cls = genClassForVnode(vnode);
                var transitionClass = el._transitionClasses;
                if (isDef(transitionClass)) {
                    cls = concat(cls, stringifyClass(transitionClass));
                }
                if (cls !== el._prevClass) {
                    el.setAttribute("class", cls);
                    el._prevClass = cls;
                }
            }
            var klass = {
                create: updateClass,
                update: updateClass
            };
            var RANGE_TOKEN = "__r";
            var CHECKBOX_RADIO_TOKEN = "__c";
            function normalizeEvents(on) {
                if (isDef(on[RANGE_TOKEN])) {
                    var event = isIE ? "change" : "input";
                    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
                    delete on[RANGE_TOKEN];
                }
                if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
                    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
                    delete on[CHECKBOX_RADIO_TOKEN];
                }
            }
            var target;
            function createOnceHandler(event, handler, capture) {
                var _target = target;
                return function onceHandler() {
                    var res = handler.apply(null, arguments);
                    if (res !== null) {
                        remove(event, onceHandler, capture, _target);
                    }
                };
            }
            var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);
            function add(name, handler, capture, passive) {
                if (useMicrotaskFix) {
                    var attachedTimestamp = currentFlushTimestamp;
                    var original = handler;
                    handler = original._wrapper = function handler(e) {
                        if (// no bubbling, should always fire.
                        // this is just a safety net in case event.timeStamp is unreliable in
                        // certain weird environments...
                        e.target === e.currentTarget || // event is fired after handler attachment
                        e.timeStamp >= attachedTimestamp || // bail for environments that have buggy event.timeStamp implementations
                        // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
                        // #9681 QtWebEngine event.timeStamp is negative value
                        e.timeStamp <= 0 || // #9448 bail if event is fired in another document in a multi-page
                        // electron/nw.js app, since event.timeStamp will be using a different
                        // starting reference
                        e.target.ownerDocument !== document) {
                            return original.apply(this, arguments);
                        }
                    };
                }
                target.addEventListener(name, handler, supportsPassive ? {
                    capture: capture,
                    passive: passive
                } : capture);
            }
            function remove(name, handler, capture, _target) {
                (_target || target).removeEventListener(name, //@ts-expect-error
                handler._wrapper || handler, capture);
            }
            function updateDOMListeners(oldVnode, vnode) {
                if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
                    return;
                }
                var on = vnode.data.on || {};
                var oldOn = oldVnode.data.on || {};
                target = vnode.elm || oldVnode.elm;
                normalizeEvents(on);
                updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context);
                target = void 0;
            }
            var events = {
                create: updateDOMListeners,
                update: updateDOMListeners,
                // @ts-expect-error emptyNode has actually data
                destroy: function(vnode) {
                    return updateDOMListeners(vnode, emptyNode);
                }
            };
            var svgContainer;
            function updateDOMProps(oldVnode, vnode) {
                if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
                    return;
                }
                var key, cur;
                var elm = vnode.elm;
                var oldProps = oldVnode.data.domProps || {};
                var props2 = vnode.data.domProps || {};
                if (isDef(props2.__ob__) || isTrue(props2._v_attr_proxy)) {
                    props2 = vnode.data.domProps = extend({}, props2);
                }
                for(key in oldProps){
                    if (!(key in props2)) {
                        elm[key] = "";
                    }
                }
                for(key in props2){
                    cur = props2[key];
                    if (key === "textContent" || key === "innerHTML") {
                        if (vnode.children) vnode.children.length = 0;
                        if (cur === oldProps[key]) continue;
                        if (elm.childNodes.length === 1) {
                            elm.removeChild(elm.childNodes[0]);
                        }
                    }
                    if (key === "value" && elm.tagName !== "PROGRESS") {
                        elm._value = cur;
                        var strCur = isUndef(cur) ? "" : String(cur);
                        if (shouldUpdateValue(elm, strCur)) {
                            elm.value = strCur;
                        }
                    } else if (key === "innerHTML" && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
                        svgContainer = svgContainer || document.createElement("div");
                        svgContainer.innerHTML = "<svg>".concat(cur, "</svg>");
                        var svg = svgContainer.firstChild;
                        while(elm.firstChild){
                            elm.removeChild(elm.firstChild);
                        }
                        while(svg.firstChild){
                            elm.appendChild(svg.firstChild);
                        }
                    } else if (// skip the update if old and new VDOM state is the same.
                    // `value` is handled separately because the DOM value may be temporarily
                    // out of sync with VDOM state due to focus, composition and modifiers.
                    // This  #4521 by skipping the unnecessary `checked` update.
                    cur !== oldProps[key]) {
                        try {
                            elm[key] = cur;
                        } catch (e) {}
                    }
                }
            }
            function shouldUpdateValue(elm, checkVal) {
                return(//@ts-expect-error
                !elm.composing && (elm.tagName === "OPTION" || isNotInFocusAndDirty(elm, checkVal) || isDirtyWithModifiers(elm, checkVal)));
            }
            function isNotInFocusAndDirty(elm, checkVal) {
                var notInFocus = true;
                try {
                    notInFocus = document.activeElement !== elm;
                } catch (e) {}
                return notInFocus && elm.value !== checkVal;
            }
            function isDirtyWithModifiers(elm, newVal1) {
                var value = elm.value;
                var modifiers = elm._vModifiers;
                if (isDef(modifiers)) {
                    if (modifiers.number) {
                        return toNumber(value) !== toNumber(newVal1);
                    }
                    if (modifiers.trim) {
                        return value.trim() !== newVal1.trim();
                    }
                }
                return value !== newVal1;
            }
            var domProps = {
                create: updateDOMProps,
                update: updateDOMProps
            };
            var parseStyleText = cached(function(cssText) {
                var res = {};
                var listDelimiter = /;(?![^(]*\))/g;
                var propertyDelimiter = /:(.+)/;
                cssText.split(listDelimiter).forEach(function(item) {
                    if (item) {
                        var tmp = item.split(propertyDelimiter);
                        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
                    }
                });
                return res;
            });
            function normalizeStyleData(data) {
                var style2 = normalizeStyleBinding(data.style);
                return data.staticStyle ? extend(data.staticStyle, style2) : style2;
            }
            function normalizeStyleBinding(bindingStyle) {
                if (Array.isArray(bindingStyle)) {
                    return toObject(bindingStyle);
                }
                if (typeof bindingStyle === "string") {
                    return parseStyleText(bindingStyle);
                }
                return bindingStyle;
            }
            function getStyle(vnode, checkChild) {
                var res = {};
                var styleData;
                if (checkChild) {
                    var childNode = vnode;
                    while(childNode.componentInstance){
                        childNode = childNode.componentInstance._vnode;
                        if (childNode && childNode.data && (styleData = normalizeStyleData(childNode.data))) {
                            extend(res, styleData);
                        }
                    }
                }
                if (styleData = normalizeStyleData(vnode.data)) {
                    extend(res, styleData);
                }
                var parentNode2 = vnode;
                while(parentNode2 = parentNode2.parent){
                    if (parentNode2.data && (styleData = normalizeStyleData(parentNode2.data))) {
                        extend(res, styleData);
                    }
                }
                return res;
            }
            var cssVarRE = /^--/;
            var importantRE = /\s*!important$/;
            var setProp = function(el, name, val) {
                if (cssVarRE.test(name)) {
                    el.style.setProperty(name, val);
                } else if (importantRE.test(val)) {
                    el.style.setProperty(hyphenate(name), val.replace(importantRE, ""), "important");
                } else {
                    var normalizedName = normalize(name);
                    if (Array.isArray(val)) {
                        for(var i = 0, len = val.length; i < len; i++){
                            el.style[normalizedName] = val[i];
                        }
                    } else {
                        el.style[normalizedName] = val;
                    }
                }
            };
            var vendorNames = [
                "Webkit",
                "Moz",
                "ms"
            ];
            var emptyStyle;
            var normalize = cached(function(prop) {
                emptyStyle = emptyStyle || document.createElement("div").style;
                prop = camelize(prop);
                if (prop !== "filter" && prop in emptyStyle) {
                    return prop;
                }
                var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
                for(var i = 0; i < vendorNames.length; i++){
                    var name = vendorNames[i] + capName;
                    if (name in emptyStyle) {
                        return name;
                    }
                }
            });
            function updateStyle(oldVnode, vnode) {
                var data = vnode.data;
                var oldData = oldVnode.data;
                if (isUndef(data.staticStyle) && isUndef(data.style) && isUndef(oldData.staticStyle) && isUndef(oldData.style)) {
                    return;
                }
                var cur, name;
                var el = vnode.elm;
                var oldStaticStyle = oldData.staticStyle;
                var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};
                var oldStyle = oldStaticStyle || oldStyleBinding;
                var style2 = normalizeStyleBinding(vnode.data.style) || {};
                vnode.data.normalizedStyle = isDef(style2.__ob__) ? extend({}, style2) : style2;
                var newStyle = getStyle(vnode, true);
                for(name in oldStyle){
                    if (isUndef(newStyle[name])) {
                        setProp(el, name, "");
                    }
                }
                for(name in newStyle){
                    cur = newStyle[name];
                    if (cur !== oldStyle[name]) {
                        setProp(el, name, cur == null ? "" : cur);
                    }
                }
            }
            var style = {
                create: updateStyle,
                update: updateStyle
            };
            var whitespaceRE = /\s+/;
            function addClass(el, cls) {
                if (!cls || !(cls = cls.trim())) {
                    return;
                }
                if (el.classList) {
                    if (cls.indexOf(" ") > -1) {
                        cls.split(whitespaceRE).forEach(function(c) {
                            return el.classList.add(c);
                        });
                    } else {
                        el.classList.add(cls);
                    }
                } else {
                    var cur = " ".concat(el.getAttribute("class") || "", " ");
                    if (cur.indexOf(" " + cls + " ") < 0) {
                        el.setAttribute("class", (cur + cls).trim());
                    }
                }
            }
            function removeClass(el, cls) {
                if (!cls || !(cls = cls.trim())) {
                    return;
                }
                if (el.classList) {
                    if (cls.indexOf(" ") > -1) {
                        cls.split(whitespaceRE).forEach(function(c) {
                            return el.classList.remove(c);
                        });
                    } else {
                        el.classList.remove(cls);
                    }
                    if (!el.classList.length) {
                        el.removeAttribute("class");
                    }
                } else {
                    var cur = " ".concat(el.getAttribute("class") || "", " ");
                    var tar = " " + cls + " ";
                    while(cur.indexOf(tar) >= 0){
                        cur = cur.replace(tar, " ");
                    }
                    cur = cur.trim();
                    if (cur) {
                        el.setAttribute("class", cur);
                    } else {
                        el.removeAttribute("class");
                    }
                }
            }
            function resolveTransition(def2) {
                if (!def2) {
                    return;
                }
                if ((typeof def2 === "undefined" ? "undefined" : _type_of(def2)) === "object") {
                    var res = {};
                    if (def2.css !== false) {
                        extend(res, autoCssTransition(def2.name || "v"));
                    }
                    extend(res, def2);
                    return res;
                } else if (typeof def2 === "string") {
                    return autoCssTransition(def2);
                }
            }
            var autoCssTransition = cached(function(name) {
                return {
                    enterClass: "".concat(name, "-enter"),
                    enterToClass: "".concat(name, "-enter-to"),
                    enterActiveClass: "".concat(name, "-enter-active"),
                    leaveClass: "".concat(name, "-leave"),
                    leaveToClass: "".concat(name, "-leave-to"),
                    leaveActiveClass: "".concat(name, "-leave-active")
                };
            });
            var hasTransition = inBrowser && !isIE9;
            var TRANSITION = "transition";
            var ANIMATION = "animation";
            var transitionProp = "transition";
            var transitionEndEvent = "transitionend";
            var animationProp = "animation";
            var animationEndEvent = "animationend";
            if (hasTransition) {
                if (window.ontransitionend === void 0 && window.onwebkittransitionend !== void 0) {
                    transitionProp = "WebkitTransition";
                    transitionEndEvent = "webkitTransitionEnd";
                }
                if (window.onanimationend === void 0 && window.onwebkitanimationend !== void 0) {
                    animationProp = "WebkitAnimation";
                    animationEndEvent = "webkitAnimationEnd";
                }
            }
            var raf = inBrowser ? window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout : /* istanbul ignore next */ /* istanbul ignore next */ function(fn) {
                return fn();
            };
            function nextFrame(fn) {
                raf(function() {
                    raf(fn);
                });
            }
            function addTransitionClass(el, cls) {
                var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
                if (transitionClasses.indexOf(cls) < 0) {
                    transitionClasses.push(cls);
                    addClass(el, cls);
                }
            }
            function removeTransitionClass(el, cls) {
                if (el._transitionClasses) {
                    remove$2(el._transitionClasses, cls);
                }
                removeClass(el, cls);
            }
            function whenTransitionEnds(el, expectedType, cb) {
                var _getTransitionInfo = getTransitionInfo(el, expectedType), type = _getTransitionInfo.type, timeout = _getTransitionInfo.timeout, propCount = _getTransitionInfo.propCount;
                if (!type) return cb();
                var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
                var ended = 0;
                var end = function() {
                    el.removeEventListener(event, onEnd);
                    cb();
                };
                var onEnd = function(e) {
                    if (e.target === el) {
                        if (++ended >= propCount) {
                            end();
                        }
                    }
                };
                setTimeout(function() {
                    if (ended < propCount) {
                        end();
                    }
                }, timeout + 1);
                el.addEventListener(event, onEnd);
            }
            var transformRE = /\b(transform|all)(,|$)/;
            function getTransitionInfo(el, expectedType) {
                var styles = window.getComputedStyle(el);
                var transitionDelays = (styles[transitionProp + "Delay"] || "").split(", ");
                var transitionDurations = (styles[transitionProp + "Duration"] || "").split(", ");
                var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
                var animationDelays = (styles[animationProp + "Delay"] || "").split(", ");
                var animationDurations = (styles[animationProp + "Duration"] || "").split(", ");
                var animationTimeout = getTimeout(animationDelays, animationDurations);
                var type;
                var timeout = 0;
                var propCount = 0;
                if (expectedType === TRANSITION) {
                    if (transitionTimeout > 0) {
                        type = TRANSITION;
                        timeout = transitionTimeout;
                        propCount = transitionDurations.length;
                    }
                } else if (expectedType === ANIMATION) {
                    if (animationTimeout > 0) {
                        type = ANIMATION;
                        timeout = animationTimeout;
                        propCount = animationDurations.length;
                    }
                } else {
                    timeout = Math.max(transitionTimeout, animationTimeout);
                    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
                    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
                }
                var hasTransform = type === TRANSITION && transformRE.test(styles[transitionProp + "Property"]);
                return {
                    type: type,
                    timeout: timeout,
                    propCount: propCount,
                    hasTransform: hasTransform
                };
            }
            function getTimeout(delays, durations) {
                while(delays.length < durations.length){
                    delays = delays.concat(delays);
                }
                return Math.max.apply(null, durations.map(function(d, i) {
                    return toMs(d) + toMs(delays[i]);
                }));
            }
            function toMs(s) {
                return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
            }
            function enter(vnode, toggleDisplay) {
                var el = vnode.elm;
                if (isDef(el._leaveCb)) {
                    el._leaveCb.cancelled = true;
                    el._leaveCb();
                }
                var data = resolveTransition(vnode.data.transition);
                if (isUndef(data)) {
                    return;
                }
                if (isDef(el._enterCb) || el.nodeType !== 1) {
                    return;
                }
                var css = data.css, type = data.type, enterClass = data.enterClass, enterToClass = data.enterToClass, enterActiveClass = data.enterActiveClass, appearClass = data.appearClass, appearToClass = data.appearToClass, appearActiveClass = data.appearActiveClass, beforeEnter = data.beforeEnter, enter2 = data.enter, afterEnter = data.afterEnter, enterCancelled = data.enterCancelled, beforeAppear = data.beforeAppear, appear = data.appear, afterAppear = data.afterAppear, appearCancelled = data.appearCancelled, duration = data.duration;
                var context = activeInstance;
                var transitionNode = activeInstance.$vnode;
                while(transitionNode && transitionNode.parent){
                    context = transitionNode.context;
                    transitionNode = transitionNode.parent;
                }
                var isAppear = !context._isMounted || !vnode.isRootInsert;
                if (isAppear && !appear && appear !== "") {
                    return;
                }
                var startClass = isAppear && appearClass ? appearClass : enterClass;
                var activeClass = isAppear && appearActiveClass ? appearActiveClass : enterActiveClass;
                var toClass = isAppear && appearToClass ? appearToClass : enterToClass;
                var beforeEnterHook = isAppear ? beforeAppear || beforeEnter : beforeEnter;
                var enterHook = isAppear ? isFunction(appear) ? appear : enter2 : enter2;
                var afterEnterHook = isAppear ? afterAppear || afterEnter : afterEnter;
                var enterCancelledHook = isAppear ? appearCancelled || enterCancelled : enterCancelled;
                var explicitEnterDuration = toNumber(isObject(duration) ? duration.enter : duration);
                if (explicitEnterDuration != null) {
                    checkDuration(explicitEnterDuration, "enter", vnode);
                }
                var expectsCSS = css !== false && !isIE9;
                var userWantsControl = getHookArgumentsLength(enterHook);
                var cb = el._enterCb = once(function() {
                    if (expectsCSS) {
                        removeTransitionClass(el, toClass);
                        removeTransitionClass(el, activeClass);
                    }
                    if (cb.cancelled) {
                        if (expectsCSS) {
                            removeTransitionClass(el, startClass);
                        }
                        enterCancelledHook && enterCancelledHook(el);
                    } else {
                        afterEnterHook && afterEnterHook(el);
                    }
                    el._enterCb = null;
                });
                if (!vnode.data.show) {
                    mergeVNodeHook(vnode, "insert", function() {
                        var parent = el.parentNode;
                        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
                        if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
                            pendingNode.elm._leaveCb();
                        }
                        enterHook && enterHook(el, cb);
                    });
                }
                beforeEnterHook && beforeEnterHook(el);
                if (expectsCSS) {
                    addTransitionClass(el, startClass);
                    addTransitionClass(el, activeClass);
                    nextFrame(function() {
                        removeTransitionClass(el, startClass);
                        if (!cb.cancelled) {
                            addTransitionClass(el, toClass);
                            if (!userWantsControl) {
                                if (isValidDuration(explicitEnterDuration)) {
                                    setTimeout(cb, explicitEnterDuration);
                                } else {
                                    whenTransitionEnds(el, type, cb);
                                }
                            }
                        }
                    });
                }
                if (vnode.data.show) {
                    toggleDisplay && toggleDisplay();
                    enterHook && enterHook(el, cb);
                }
                if (!expectsCSS && !userWantsControl) {
                    cb();
                }
            }
            function leave(vnode, rm) {
                var el = vnode.elm;
                if (isDef(el._enterCb)) {
                    el._enterCb.cancelled = true;
                    el._enterCb();
                }
                var data = resolveTransition(vnode.data.transition);
                if (isUndef(data) || el.nodeType !== 1) {
                    return rm();
                }
                if (isDef(el._leaveCb)) {
                    return;
                }
                var css = data.css, type = data.type, leaveClass = data.leaveClass, leaveToClass = data.leaveToClass, leaveActiveClass = data.leaveActiveClass, beforeLeave = data.beforeLeave, leave2 = data.leave, afterLeave = data.afterLeave, leaveCancelled = data.leaveCancelled, delayLeave = data.delayLeave, duration = data.duration;
                var expectsCSS = css !== false && !isIE9;
                var userWantsControl = getHookArgumentsLength(leave2);
                var explicitLeaveDuration = toNumber(isObject(duration) ? duration.leave : duration);
                if (isDef(explicitLeaveDuration)) {
                    checkDuration(explicitLeaveDuration, "leave", vnode);
                }
                var cb = el._leaveCb = once(function() {
                    if (el.parentNode && el.parentNode._pending) {
                        el.parentNode._pending[vnode.key] = null;
                    }
                    if (expectsCSS) {
                        removeTransitionClass(el, leaveToClass);
                        removeTransitionClass(el, leaveActiveClass);
                    }
                    if (cb.cancelled) {
                        if (expectsCSS) {
                            removeTransitionClass(el, leaveClass);
                        }
                        leaveCancelled && leaveCancelled(el);
                    } else {
                        rm();
                        afterLeave && afterLeave(el);
                    }
                    el._leaveCb = null;
                });
                if (delayLeave) {
                    delayLeave(performLeave);
                } else {
                    performLeave();
                }
                function performLeave() {
                    if (cb.cancelled) {
                        return;
                    }
                    if (!vnode.data.show && el.parentNode) {
                        (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
                    }
                    beforeLeave && beforeLeave(el);
                    if (expectsCSS) {
                        addTransitionClass(el, leaveClass);
                        addTransitionClass(el, leaveActiveClass);
                        nextFrame(function() {
                            removeTransitionClass(el, leaveClass);
                            if (!cb.cancelled) {
                                addTransitionClass(el, leaveToClass);
                                if (!userWantsControl) {
                                    if (isValidDuration(explicitLeaveDuration)) {
                                        setTimeout(cb, explicitLeaveDuration);
                                    } else {
                                        whenTransitionEnds(el, type, cb);
                                    }
                                }
                            }
                        });
                    }
                    leave2 && leave2(el, cb);
                    if (!expectsCSS && !userWantsControl) {
                        cb();
                    }
                }
            }
            function checkDuration(val, name, vnode) {
                if (typeof val !== "number") {
                    warn("<transition> explicit ".concat(name, " duration is not a valid number - got ").concat(JSON.stringify(val), "."), vnode.context);
                } else if (isNaN(val)) {
                    warn("<transition> explicit ".concat(name, " duration is NaN - the duration expression might be incorrect."), vnode.context);
                }
            }
            function isValidDuration(val) {
                return typeof val === "number" && !isNaN(val);
            }
            function getHookArgumentsLength(fn) {
                if (isUndef(fn)) {
                    return false;
                }
                var invokerFns = fn.fns;
                if (isDef(invokerFns)) {
                    return getHookArgumentsLength(Array.isArray(invokerFns) ? invokerFns[0] : invokerFns);
                } else {
                    return (fn._length || fn.length) > 1;
                }
            }
            function _enter(_, vnode) {
                if (vnode.data.show !== true) {
                    enter(vnode);
                }
            }
            var transition = inBrowser ? {
                create: _enter,
                activate: _enter,
                remove: function remove(vnode, rm) {
                    if (vnode.data.show !== true) {
                        leave(vnode, rm);
                    } else {
                        rm();
                    }
                }
            } : {};
            var platformModules = [
                attrs,
                klass,
                events,
                domProps,
                style,
                transition
            ];
            var modules = platformModules.concat(baseModules);
            var patch = createPatchFunction({
                nodeOps: nodeOps,
                modules: modules
            });
            if (isIE9) {
                document.addEventListener("selectionchange", function() {
                    var el = document.activeElement;
                    if (el && el.vmodel) {
                        trigger(el, "input");
                    }
                });
            }
            var directive = {
                inserted: function inserted(el, binding, vnode, oldVnode) {
                    if (vnode.tag === "select") {
                        if (oldVnode.elm && !oldVnode.elm._vOptions) {
                            mergeVNodeHook(vnode, "postpatch", function() {
                                directive.componentUpdated(el, binding, vnode);
                            });
                        } else {
                            setSelected(el, binding, vnode.context);
                        }
                        el._vOptions = [].map.call(el.options, getValue);
                    } else if (vnode.tag === "textarea" || isTextInputType(el.type)) {
                        el._vModifiers = binding.modifiers;
                        if (!binding.modifiers.lazy) {
                            el.addEventListener("compositionstart", onCompositionStart);
                            el.addEventListener("compositionend", onCompositionEnd);
                            el.addEventListener("change", onCompositionEnd);
                            if (isIE9) {
                                el.vmodel = true;
                            }
                        }
                    }
                },
                componentUpdated: function componentUpdated(el, binding, vnode) {
                    if (vnode.tag === "select") {
                        setSelected(el, binding, vnode.context);
                        var prevOptions = el._vOptions;
                        var curOptions = el._vOptions = [].map.call(el.options, getValue);
                        if (curOptions.some(function(o, i) {
                            return !looseEqual(o, prevOptions[i]);
                        })) {
                            var needReset = el.multiple ? binding.value.some(function(v) {
                                return hasNoMatchingOption(v, curOptions);
                            }) : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
                            if (needReset) {
                                trigger(el, "change");
                            }
                        }
                    }
                }
            };
            function setSelected(el, binding, vm) {
                actuallySetSelected(el, binding, vm);
                if (isIE || isEdge) {
                    setTimeout(function() {
                        actuallySetSelected(el, binding, vm);
                    }, 0);
                }
            }
            function actuallySetSelected(el, binding, vm) {
                var value = binding.value;
                var isMultiple = el.multiple;
                if (isMultiple && !Array.isArray(value)) {
                    warn('<select multiple v-model="'.concat(binding.expression, '"> expects an Array value for its binding, but got ').concat(Object.prototype.toString.call(value).slice(8, -1)), vm);
                    return;
                }
                var selected, option;
                for(var i = 0, l = el.options.length; i < l; i++){
                    option = el.options[i];
                    if (isMultiple) {
                        selected = looseIndexOf(value, getValue(option)) > -1;
                        if (option.selected !== selected) {
                            option.selected = selected;
                        }
                    } else {
                        if (looseEqual(getValue(option), value)) {
                            if (el.selectedIndex !== i) {
                                el.selectedIndex = i;
                            }
                            return;
                        }
                    }
                }
                if (!isMultiple) {
                    el.selectedIndex = -1;
                }
            }
            function hasNoMatchingOption(value, options) {
                return options.every(function(o) {
                    return !looseEqual(o, value);
                });
            }
            function getValue(option) {
                return "_value" in option ? option._value : option.value;
            }
            function onCompositionStart(e) {
                e.target.composing = true;
            }
            function onCompositionEnd(e) {
                if (!e.target.composing) return;
                e.target.composing = false;
                trigger(e.target, "input");
            }
            function trigger(el, type) {
                var e = document.createEvent("HTMLEvents");
                e.initEvent(type, true, true);
                el.dispatchEvent(e);
            }
            function locateNode(vnode) {
                return vnode.componentInstance && (!vnode.data || !vnode.data.transition) ? locateNode(vnode.componentInstance._vnode) : vnode;
            }
            var show = {
                bind: function bind(el, param, vnode) {
                    var value = param.value;
                    vnode = locateNode(vnode);
                    var transition2 = vnode.data && vnode.data.transition;
                    var originalDisplay = el.__vOriginalDisplay = el.style.display === "none" ? "" : el.style.display;
                    if (value && transition2) {
                        vnode.data.show = true;
                        enter(vnode, function() {
                            el.style.display = originalDisplay;
                        });
                    } else {
                        el.style.display = value ? originalDisplay : "none";
                    }
                },
                update: function update(el, param, vnode) {
                    var value = param.value, oldValue = param.oldValue;
                    if (!value === !oldValue) return;
                    vnode = locateNode(vnode);
                    var transition2 = vnode.data && vnode.data.transition;
                    if (transition2) {
                        vnode.data.show = true;
                        if (value) {
                            enter(vnode, function() {
                                el.style.display = el.__vOriginalDisplay;
                            });
                        } else {
                            leave(vnode, function() {
                                el.style.display = "none";
                            });
                        }
                    } else {
                        el.style.display = value ? el.__vOriginalDisplay : "none";
                    }
                },
                unbind: function unbind(el, binding, vnode, oldVnode, isDestroy) {
                    if (!isDestroy) {
                        el.style.display = el.__vOriginalDisplay;
                    }
                }
            };
            var platformDirectives = {
                model: directive,
                show: show
            };
            var transitionProps = {
                name: String,
                appear: Boolean,
                css: Boolean,
                mode: String,
                type: String,
                enterClass: String,
                leaveClass: String,
                enterToClass: String,
                leaveToClass: String,
                enterActiveClass: String,
                leaveActiveClass: String,
                appearClass: String,
                appearActiveClass: String,
                appearToClass: String,
                duration: [
                    Number,
                    String,
                    Object
                ]
            };
            function getRealChild(vnode) {
                var compOptions = vnode && vnode.componentOptions;
                if (compOptions && compOptions.Ctor.options.abstract) {
                    return getRealChild(getFirstComponentChild(compOptions.children));
                } else {
                    return vnode;
                }
            }
            function extractTransitionData(comp) {
                var data = {};
                var options = comp.$options;
                for(var key in options.propsData){
                    data[key] = comp[key];
                }
                var listeners = options._parentListeners;
                for(var key1 in listeners){
                    data[camelize(key1)] = listeners[key1];
                }
                return data;
            }
            function placeholder(h3, rawChild) {
                if (/\d-keep-alive$/.test(rawChild.tag)) {
                    return h3("keep-alive", {
                        props: rawChild.componentOptions.propsData
                    });
                }
            }
            function hasParentTransition(vnode) {
                while(vnode = vnode.parent){
                    if (vnode.data.transition) {
                        return true;
                    }
                }
            }
            function isSameChild(child, oldChild) {
                return oldChild.key === child.key && oldChild.tag === child.tag;
            }
            var isNotTextNode = function(c) {
                return c.tag || isAsyncPlaceholder(c);
            };
            var isVShowDirective = function(d) {
                return d.name === "show";
            };
            var Transition = {
                name: "transition",
                props: transitionProps,
                abstract: true,
                render: function render(h3) {
                    var _this = this;
                    var children = this.$slots.default;
                    if (!children) {
                        return;
                    }
                    children = children.filter(isNotTextNode);
                    if (!children.length) {
                        return;
                    }
                    if (children.length > 1) {
                        warn("<transition> can only be used on a single element. Use <transition-group> for lists.", this.$parent);
                    }
                    var mode = this.mode;
                    if (mode && mode !== "in-out" && mode !== "out-in") {
                        warn("invalid <transition> mode: " + mode, this.$parent);
                    }
                    var rawChild = children[0];
                    if (hasParentTransition(this.$vnode)) {
                        return rawChild;
                    }
                    var child = getRealChild(rawChild);
                    if (!child) {
                        return rawChild;
                    }
                    if (this._leaving) {
                        return placeholder(h3, rawChild);
                    }
                    var id = "__transition-".concat(this._uid, "-");
                    child.key = child.key == null ? child.isComment ? id + "comment" : id + child.tag : isPrimitive(child.key) ? String(child.key).indexOf(id) === 0 ? child.key : id + child.key : child.key;
                    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
                    var oldRawChild = this._vnode;
                    var oldChild = getRealChild(oldRawChild);
                    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
                        child.data.show = true;
                    }
                    if (oldChild && oldChild.data && !isSameChild(child, oldChild) && !isAsyncPlaceholder(oldChild) && // #6687 component root is a comment node
                    !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)) {
                        var oldData = oldChild.data.transition = extend({}, data);
                        if (mode === "out-in") {
                            this._leaving = true;
                            mergeVNodeHook(oldData, "afterLeave", function() {
                                _this._leaving = false;
                                _this.$forceUpdate();
                            });
                            return placeholder(h3, rawChild);
                        } else if (mode === "in-out") {
                            if (isAsyncPlaceholder(child)) {
                                return oldRawChild;
                            }
                            var delayedLeave;
                            var performLeave = function() {
                                delayedLeave();
                            };
                            mergeVNodeHook(data, "afterEnter", performLeave);
                            mergeVNodeHook(data, "enterCancelled", performLeave);
                            mergeVNodeHook(oldData, "delayLeave", function(leave2) {
                                delayedLeave = leave2;
                            });
                        }
                    }
                    return rawChild;
                }
            };
            var props = extend({
                tag: String,
                moveClass: String
            }, transitionProps);
            delete props.mode;
            var TransitionGroup = {
                props: props,
                beforeMount: function beforeMount() {
                    var _this = this;
                    var update = this._update;
                    this._update = function(vnode, hydrating) {
                        var restoreActiveInstance = setActiveInstance(_this);
                        _this.__patch__(_this._vnode, _this.kept, false, // hydrating
                        true);
                        _this._vnode = _this.kept;
                        restoreActiveInstance();
                        update.call(_this, vnode, hydrating);
                    };
                },
                render: function render(h3) {
                    var tag = this.tag || this.$vnode.data.tag || "span";
                    var map = /* @__PURE__ */ Object.create(null);
                    var prevChildren = this.prevChildren = this.children;
                    var rawChildren = this.$slots.default || [];
                    var children = this.children = [];
                    var transitionData = extractTransitionData(this);
                    for(var i = 0; i < rawChildren.length; i++){
                        var c = rawChildren[i];
                        if (c.tag) {
                            if (c.key != null && String(c.key).indexOf("__vlist") !== 0) {
                                children.push(c);
                                map[c.key] = c;
                                (c.data || (c.data = {})).transition = transitionData;
                            } else {
                                var opts = c.componentOptions;
                                var name = opts ? getComponentName(opts.Ctor.options) || opts.tag || "" : c.tag;
                                warn("<transition-group> children must be keyed: <".concat(name, ">"));
                            }
                        }
                    }
                    if (prevChildren) {
                        var kept = [];
                        var removed = [];
                        for(var i1 = 0; i1 < prevChildren.length; i1++){
                            var c1 = prevChildren[i1];
                            c1.data.transition = transitionData;
                            c1.data.pos = c1.elm.getBoundingClientRect();
                            if (map[c1.key]) {
                                kept.push(c1);
                            } else {
                                removed.push(c1);
                            }
                        }
                        this.kept = h3(tag, null, kept);
                        this.removed = removed;
                    }
                    return h3(tag, null, children);
                },
                updated: function updated() {
                    var children = this.prevChildren;
                    var moveClass = this.moveClass || (this.name || "v") + "-move";
                    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
                        return;
                    }
                    children.forEach(callPendingCbs);
                    children.forEach(recordPosition);
                    children.forEach(applyTranslation);
                    this._reflow = document.body.offsetHeight;
                    children.forEach(function(c) {
                        if (c.data.moved) {
                            var el = c.elm;
                            var s = el.style;
                            addTransitionClass(el, moveClass);
                            s.transform = s.WebkitTransform = s.transitionDuration = "";
                            el.addEventListener(transitionEndEvent, el._moveCb = function cb(e) {
                                if (e && e.target !== el) {
                                    return;
                                }
                                if (!e || /transform$/.test(e.propertyName)) {
                                    el.removeEventListener(transitionEndEvent, cb);
                                    el._moveCb = null;
                                    removeTransitionClass(el, moveClass);
                                }
                            });
                        }
                    });
                },
                methods: {
                    hasMove: function hasMove(el, moveClass) {
                        if (!hasTransition) {
                            return false;
                        }
                        if (this._hasMove) {
                            return this._hasMove;
                        }
                        var clone = el.cloneNode();
                        if (el._transitionClasses) {
                            el._transitionClasses.forEach(function(cls) {
                                removeClass(clone, cls);
                            });
                        }
                        addClass(clone, moveClass);
                        clone.style.display = "none";
                        this.$el.appendChild(clone);
                        var info = getTransitionInfo(clone);
                        this.$el.removeChild(clone);
                        return this._hasMove = info.hasTransform;
                    }
                }
            };
            function callPendingCbs(c) {
                if (c.elm._moveCb) {
                    c.elm._moveCb();
                }
                if (c.elm._enterCb) {
                    c.elm._enterCb();
                }
            }
            function recordPosition(c) {
                c.data.newPos = c.elm.getBoundingClientRect();
            }
            function applyTranslation(c) {
                var oldPos = c.data.pos;
                var newPos = c.data.newPos;
                var dx = oldPos.left - newPos.left;
                var dy = oldPos.top - newPos.top;
                if (dx || dy) {
                    c.data.moved = true;
                    var s = c.elm.style;
                    s.transform = s.WebkitTransform = "translate(".concat(dx, "px,").concat(dy, "px)");
                    s.transitionDuration = "0s";
                }
            }
            var platformComponents = {
                Transition: Transition,
                TransitionGroup: TransitionGroup
            };
            Vue2.config.mustUseProp = mustUseProp;
            Vue2.config.isReservedTag = isReservedTag;
            Vue2.config.isReservedAttr = isReservedAttr;
            Vue2.config.getTagNamespace = getTagNamespace;
            Vue2.config.isUnknownElement = isUnknownElement;
            extend(Vue2.options.directives, platformDirectives);
            extend(Vue2.options.components, platformComponents);
            Vue2.prototype.__patch__ = inBrowser ? patch : noop;
            Vue2.prototype.$mount = function(el, hydrating) {
                el = el && inBrowser ? query(el) : void 0;
                return mountComponent(this, el, hydrating);
            };
            if (inBrowser) {
                setTimeout(function() {
                    if (config.devtools) {
                        if (devtools) {
                            devtools.emit("init", Vue2);
                        } else {
                            console[console.info ? "info" : "log"]("Download the Vue Devtools extension for a better development experience:\nhttps://github.com/vuejs/vue-devtools");
                        }
                    }
                    if (config.productionTip !== false && typeof console !== "undefined") {
                        console[console.info ? "info" : "log"]("You are running Vue in development mode.\nMake sure to turn on production mode when deploying for production.\nSee more tips at https://vuejs.org/guide/deployment.html");
                    }
                }, 0);
            }
            extend(Vue2, vca);
            module.exports = Vue2;
        }
    });
    // ../../node_modules/.pnpm/vue@2.7.14/node_modules/vue/dist/vue.runtime.common.js
    var require_vue_runtime_common = __commonJS({
        "../../node_modules/.pnpm/vue@2.7.14/node_modules/vue/dist/vue.runtime.common.js": function(exports, module) {
            "use strict";
            if (false) {
                module.exports = null;
            } else {
                module.exports = require_vue_runtime_common_dev();
            }
        }
    });
    // src/vue.ts
    var vue_exports = {};
    __export(vue_exports, {
        Vue: function() {
            return vue_runtime_default;
        }
    });
    // ../../node_modules/.pnpm/vue@2.7.14/node_modules/vue/dist/vue.runtime.mjs
    var import_vue_runtime_common = __toESM(require_vue_runtime_common(), 1);
    var vue_runtime_default = import_vue_runtime_common.default;
    var _import_vue_runtime_common_default = import_vue_runtime_common.default, version = _import_vue_runtime_common_default.version, // refs
    ref = _import_vue_runtime_common_default.ref, shallowRef = _import_vue_runtime_common_default.shallowRef, isRef = _import_vue_runtime_common_default.isRef, toRef = _import_vue_runtime_common_default.toRef, toRefs = _import_vue_runtime_common_default.toRefs, unref = _import_vue_runtime_common_default.unref, proxyRefs = _import_vue_runtime_common_default.proxyRefs, customRef = _import_vue_runtime_common_default.customRef, triggerRef = _import_vue_runtime_common_default.triggerRef, computed = _import_vue_runtime_common_default.computed, // reactive
    reactive = _import_vue_runtime_common_default.reactive, isReactive = _import_vue_runtime_common_default.isReactive, isReadonly = _import_vue_runtime_common_default.isReadonly, isShallow = _import_vue_runtime_common_default.isShallow, isProxy = _import_vue_runtime_common_default.isProxy, shallowReactive = _import_vue_runtime_common_default.shallowReactive, markRaw = _import_vue_runtime_common_default.markRaw, toRaw = _import_vue_runtime_common_default.toRaw, readonly = _import_vue_runtime_common_default.readonly, shallowReadonly = _import_vue_runtime_common_default.shallowReadonly, // watch
    watch = _import_vue_runtime_common_default.watch, watchEffect = _import_vue_runtime_common_default.watchEffect, watchPostEffect = _import_vue_runtime_common_default.watchPostEffect, watchSyncEffect = _import_vue_runtime_common_default.watchSyncEffect, // effectScope
    effectScope = _import_vue_runtime_common_default.effectScope, onScopeDispose = _import_vue_runtime_common_default.onScopeDispose, getCurrentScope = _import_vue_runtime_common_default.getCurrentScope, // provide / inject
    provide = _import_vue_runtime_common_default.provide, inject = _import_vue_runtime_common_default.inject, // lifecycle
    onBeforeMount = _import_vue_runtime_common_default.onBeforeMount, onMounted = _import_vue_runtime_common_default.onMounted, onBeforeUpdate = _import_vue_runtime_common_default.onBeforeUpdate, onUpdated = _import_vue_runtime_common_default.onUpdated, onBeforeUnmount = _import_vue_runtime_common_default.onBeforeUnmount, onUnmounted = _import_vue_runtime_common_default.onUnmounted, onErrorCaptured = _import_vue_runtime_common_default.onErrorCaptured, onActivated = _import_vue_runtime_common_default.onActivated, onDeactivated = _import_vue_runtime_common_default.onDeactivated, onServerPrefetch = _import_vue_runtime_common_default.onServerPrefetch, onRenderTracked = _import_vue_runtime_common_default.onRenderTracked, onRenderTriggered = _import_vue_runtime_common_default.onRenderTriggered, // v2 only
    set = _import_vue_runtime_common_default.set, del = _import_vue_runtime_common_default.del, // v3 compat
    h = _import_vue_runtime_common_default.h, getCurrentInstance = _import_vue_runtime_common_default.getCurrentInstance, useSlots = _import_vue_runtime_common_default.useSlots, useAttrs = _import_vue_runtime_common_default.useAttrs, mergeDefaults = _import_vue_runtime_common_default.mergeDefaults, nextTick = _import_vue_runtime_common_default.nextTick, useCssModule = _import_vue_runtime_common_default.useCssModule, useCssVars = _import_vue_runtime_common_default.useCssVars, defineComponent = _import_vue_runtime_common_default.defineComponent, defineAsyncComponent = _import_vue_runtime_common_default.defineAsyncComponent;
    return __toCommonJS(vue_exports);
}();
//# sourceMappingURL=vue.development.umd.js.map