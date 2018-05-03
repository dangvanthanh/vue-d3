(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function (global, factory) {
            typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
            typeof define === 'function' && define.amd ? define(factory) :
            (factory());
}(this, (function () { 'use strict';

            var global$1 = typeof global !== "undefined" ? global :
                        typeof self !== "undefined" ? self :
                        typeof window !== "undefined" ? window : {}

            // shim for using process in browser
            // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

            function defaultSetTimout() {
                throw new Error('setTimeout has not been defined');
            }
            function defaultClearTimeout () {
                throw new Error('clearTimeout has not been defined');
            }
            var cachedSetTimeout = defaultSetTimout;
            var cachedClearTimeout = defaultClearTimeout;
            if (typeof global$1.setTimeout === 'function') {
                cachedSetTimeout = setTimeout;
            }
            if (typeof global$1.clearTimeout === 'function') {
                cachedClearTimeout = clearTimeout;
            }

            function runTimeout(fun) {
                if (cachedSetTimeout === setTimeout) {
                    //normal enviroments in sane situations
                    return setTimeout(fun, 0);
                }
                // if setTimeout wasn't available but was latter defined
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                    cachedSetTimeout = setTimeout;
                    return setTimeout(fun, 0);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedSetTimeout(fun, 0);
                } catch(e){
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                        return cachedSetTimeout.call(null, fun, 0);
                    } catch(e){
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                        return cachedSetTimeout.call(this, fun, 0);
                    }
                }


            }
            function runClearTimeout(marker) {
                if (cachedClearTimeout === clearTimeout) {
                    //normal enviroments in sane situations
                    return clearTimeout(marker);
                }
                // if clearTimeout wasn't available but was latter defined
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                    cachedClearTimeout = clearTimeout;
                    return clearTimeout(marker);
                }
                try {
                    // when when somebody has screwed with setTimeout but no I.E. maddness
                    return cachedClearTimeout(marker);
                } catch (e){
                    try {
                        // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                        return cachedClearTimeout.call(null, marker);
                    } catch (e){
                        // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                        // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                        return cachedClearTimeout.call(this, marker);
                    }
                }



            }
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;

            function cleanUpNextTick() {
                if (!draining || !currentQueue) {
                    return;
                }
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }

            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = runTimeout(cleanUpNextTick);
                draining = true;

                var len = queue.length;
                while(len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                runClearTimeout(timeout);
            }
            function nextTick(fun) {
                var arguments$1 = arguments;

                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments$1[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    runTimeout(drainQueue);
                }
            }
            // v8 likes predictible objects
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function () {
                this.fun.apply(null, this.array);
            };
            var title = 'browser';
            var platform = 'browser';
            var browser = true;
            var env = {};
            var argv = [];
            var version = ''; // empty string to avoid regexp issues
            var versions = {};
            var release = {};
            var config = {};

            function noop() {}

            var on = noop;
            var addListener = noop;
            var once = noop;
            var off = noop;
            var removeListener = noop;
            var removeAllListeners = noop;
            var emit = noop;

            function binding(name) {
                throw new Error('process.binding is not supported');
            }

            function cwd () { return '/' }
            function chdir (dir) {
                throw new Error('process.chdir is not supported');
            }function umask() { return 0; }

            // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
            var performance = global$1.performance || {};
            var performanceNow =
              performance.now        ||
              performance.mozNow     ||
              performance.msNow      ||
              performance.oNow       ||
              performance.webkitNow  ||
              function(){ return (new Date()).getTime() };

            // generate timestamp or delta
            // see http://nodejs.org/api/process.html#process_process_hrtime
            function hrtime(previousTimestamp){
              var clocktime = performanceNow.call(performance)*1e-3;
              var seconds = Math.floor(clocktime);
              var nanoseconds = Math.floor((clocktime%1)*1e9);
              if (previousTimestamp) {
                seconds = seconds - previousTimestamp[0];
                nanoseconds = nanoseconds - previousTimestamp[1];
                if (nanoseconds<0) {
                  seconds--;
                  nanoseconds += 1e9;
                }
              }
              return [seconds,nanoseconds]
            }

            var startTime = new Date();
            function uptime() {
              var currentTime = new Date();
              var dif = currentTime - startTime;
              return dif / 1000;
            }

            var process = {
              nextTick: nextTick,
              title: title,
              browser: browser,
              env: env,
              argv: argv,
              version: version,
              versions: versions,
              on: on,
              addListener: addListener,
              once: once,
              off: off,
              removeListener: removeListener,
              removeAllListeners: removeAllListeners,
              emit: emit,
              binding: binding,
              cwd: cwd,
              chdir: chdir,
              umask: umask,
              hrtime: hrtime,
              platform: platform,
              release: release,
              config: config,
              uptime: uptime
            };

            /*!
             * Vue.js v2.5.16
             * (c) 2014-2018 Evan You
             * Released under the MIT License.
             */
            /*  */

            var emptyObject = Object.freeze({});

            // these helpers produces better vm code in JS engines due to their
            // explicitness and function inlining
            function isUndef (v) {
              return v === undefined || v === null
            }

            function isDef (v) {
              return v !== undefined && v !== null
            }

            function isTrue (v) {
              return v === true
            }

            function isFalse (v) {
              return v === false
            }

            /**
             * Check if value is primitive
             */
            function isPrimitive (value) {
              return (
                typeof value === 'string' ||
                typeof value === 'number' ||
                // $flow-disable-line
                typeof value === 'symbol' ||
                typeof value === 'boolean'
              )
            }

            /**
             * Quick object check - this is primarily used to tell
             * Objects from primitive values when we know the value
             * is a JSON-compliant type.
             */
            function isObject (obj) {
              return obj !== null && typeof obj === 'object'
            }

            /**
             * Get the raw type string of a value e.g. [object Object]
             */
            var _toString = Object.prototype.toString;

            function toRawType (value) {
              return _toString.call(value).slice(8, -1)
            }

            /**
             * Strict object type check. Only returns true
             * for plain JavaScript objects.
             */
            function isPlainObject (obj) {
              return _toString.call(obj) === '[object Object]'
            }

            function isRegExp (v) {
              return _toString.call(v) === '[object RegExp]'
            }

            /**
             * Check if val is a valid array index.
             */
            function isValidArrayIndex (val) {
              var n = parseFloat(String(val));
              return n >= 0 && Math.floor(n) === n && isFinite(val)
            }

            /**
             * Convert a value to a string that is actually rendered.
             */
            function toString (val) {
              return val == null
                ? ''
                : typeof val === 'object'
                  ? JSON.stringify(val, null, 2)
                  : String(val)
            }

            /**
             * Convert a input value to a number for persistence.
             * If the conversion fails, return original string.
             */
            function toNumber (val) {
              var n = parseFloat(val);
              return isNaN(n) ? val : n
            }

            /**
             * Make a map and return a function for checking if a key
             * is in that map.
             */
            function makeMap (
              str,
              expectsLowerCase
            ) {
              var map = Object.create(null);
              var list = str.split(',');
              for (var i = 0; i < list.length; i++) {
                map[list[i]] = true;
              }
              return expectsLowerCase
                ? function (val) { return map[val.toLowerCase()]; }
                : function (val) { return map[val]; }
            }

            /**
             * Check if a tag is a built-in tag.
             */
            var isBuiltInTag = makeMap('slot,component', true);

            /**
             * Check if a attribute is a reserved attribute.
             */
            var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

            /**
             * Remove an item from an array
             */
            function remove (arr, item) {
              if (arr.length) {
                var index = arr.indexOf(item);
                if (index > -1) {
                  return arr.splice(index, 1)
                }
              }
            }

            /**
             * Check whether the object has the property.
             */
            var hasOwnProperty = Object.prototype.hasOwnProperty;
            function hasOwn (obj, key) {
              return hasOwnProperty.call(obj, key)
            }

            /**
             * Create a cached version of a pure function.
             */
            function cached (fn) {
              var cache = Object.create(null);
              return (function cachedFn (str) {
                var hit = cache[str];
                return hit || (cache[str] = fn(str))
              })
            }

            /**
             * Camelize a hyphen-delimited string.
             */
            var camelizeRE = /-(\w)/g;
            var camelize = cached(function (str) {
              return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
            });

            /**
             * Capitalize a string.
             */
            var capitalize = cached(function (str) {
              return str.charAt(0).toUpperCase() + str.slice(1)
            });

            /**
             * Hyphenate a camelCase string.
             */
            var hyphenateRE = /\B([A-Z])/g;
            var hyphenate = cached(function (str) {
              return str.replace(hyphenateRE, '-$1').toLowerCase()
            });

            /**
             * Simple bind polyfill for environments that do not support it... e.g.
             * PhantomJS 1.x. Technically we don't need this anymore since native bind is
             * now more performant in most browsers, but removing it would be breaking for
             * code that was able to run in PhantomJS 1.x, so this must be kept for
             * backwards compatibility.
             */

            /* istanbul ignore next */
            function polyfillBind (fn, ctx) {
              function boundFn (a) {
                var l = arguments.length;
                return l
                  ? l > 1
                    ? fn.apply(ctx, arguments)
                    : fn.call(ctx, a)
                  : fn.call(ctx)
              }

              boundFn._length = fn.length;
              return boundFn
            }

            function nativeBind (fn, ctx) {
              return fn.bind(ctx)
            }

            var bind = Function.prototype.bind
              ? nativeBind
              : polyfillBind;

            /**
             * Convert an Array-like object to a real Array.
             */
            function toArray (list, start) {
              start = start || 0;
              var i = list.length - start;
              var ret = new Array(i);
              while (i--) {
                ret[i] = list[i + start];
              }
              return ret
            }

            /**
             * Mix properties into target object.
             */
            function extend (to, _from) {
              for (var key in _from) {
                to[key] = _from[key];
              }
              return to
            }

            /**
             * Merge an Array of Objects into a single Object.
             */
            function toObject (arr) {
              var res = {};
              for (var i = 0; i < arr.length; i++) {
                if (arr[i]) {
                  extend(res, arr[i]);
                }
              }
              return res
            }

            /**
             * Perform no operation.
             * Stubbing args to make Flow happy without leaving useless transpiled code
             * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
             */
            function noop$1 (a, b, c) {}

            /**
             * Always return false.
             */
            var no = function (a, b, c) { return false; };

            /**
             * Return same value
             */
            var identity = function (_) { return _; };

            /**
             * Generate a static keys string from compiler modules.
             */


            /**
             * Check if two values are loosely equal - that is,
             * if they are plain objects, do they have the same shape?
             */
            function looseEqual (a, b) {
              if (a === b) { return true }
              var isObjectA = isObject(a);
              var isObjectB = isObject(b);
              if (isObjectA && isObjectB) {
                try {
                  var isArrayA = Array.isArray(a);
                  var isArrayB = Array.isArray(b);
                  if (isArrayA && isArrayB) {
                    return a.length === b.length && a.every(function (e, i) {
                      return looseEqual(e, b[i])
                    })
                  } else if (!isArrayA && !isArrayB) {
                    var keysA = Object.keys(a);
                    var keysB = Object.keys(b);
                    return keysA.length === keysB.length && keysA.every(function (key) {
                      return looseEqual(a[key], b[key])
                    })
                  } else {
                    /* istanbul ignore next */
                    return false
                  }
                } catch (e) {
                  /* istanbul ignore next */
                  return false
                }
              } else if (!isObjectA && !isObjectB) {
                return String(a) === String(b)
              } else {
                return false
              }
            }

            function looseIndexOf (arr, val) {
              for (var i = 0; i < arr.length; i++) {
                if (looseEqual(arr[i], val)) { return i }
              }
              return -1
            }

            /**
             * Ensure a function is called only once.
             */
            function once$1 (fn) {
              var called = false;
              return function () {
                if (!called) {
                  called = true;
                  fn.apply(this, arguments);
                }
              }
            }

            var SSR_ATTR = 'data-server-rendered';

            var ASSET_TYPES = [
              'component',
              'directive',
              'filter'
            ];

            var LIFECYCLE_HOOKS = [
              'beforeCreate',
              'created',
              'beforeMount',
              'mounted',
              'beforeUpdate',
              'updated',
              'beforeDestroy',
              'destroyed',
              'activated',
              'deactivated',
              'errorCaptured'
            ];

            /*  */

            var config$1 = ({
              /**
               * Option merge strategies (used in core/util/options)
               */
              // $flow-disable-line
              optionMergeStrategies: Object.create(null),

              /**
               * Whether to suppress warnings.
               */
              silent: false,

              /**
               * Show production mode tip message on boot?
               */
              productionTip: process.env.NODE_ENV !== 'production',

              /**
               * Whether to enable devtools
               */
              devtools: process.env.NODE_ENV !== 'production',

              /**
               * Whether to record perf
               */
              performance: false,

              /**
               * Error handler for watcher errors
               */
              errorHandler: null,

              /**
               * Warn handler for watcher warns
               */
              warnHandler: null,

              /**
               * Ignore certain custom elements
               */
              ignoredElements: [],

              /**
               * Custom user key aliases for v-on
               */
              // $flow-disable-line
              keyCodes: Object.create(null),

              /**
               * Check if a tag is reserved so that it cannot be registered as a
               * component. This is platform-dependent and may be overwritten.
               */
              isReservedTag: no,

              /**
               * Check if an attribute is reserved so that it cannot be used as a component
               * prop. This is platform-dependent and may be overwritten.
               */
              isReservedAttr: no,

              /**
               * Check if a tag is an unknown element.
               * Platform-dependent.
               */
              isUnknownElement: no,

              /**
               * Get the namespace of an element
               */
              getTagNamespace: noop$1,

              /**
               * Parse the real tag name for the specific platform.
               */
              parsePlatformTagName: identity,

              /**
               * Check if an attribute must be bound using property, e.g. value
               * Platform-dependent.
               */
              mustUseProp: no,

              /**
               * Exposed for legacy reasons
               */
              _lifecycleHooks: LIFECYCLE_HOOKS
            });

            /*  */

            /**
             * Check if a string starts with $ or _
             */
            function isReserved (str) {
              var c = (str + '').charCodeAt(0);
              return c === 0x24 || c === 0x5F
            }

            /**
             * Define a property.
             */
            function def (obj, key, val, enumerable) {
              Object.defineProperty(obj, key, {
                value: val,
                enumerable: !!enumerable,
                writable: true,
                configurable: true
              });
            }

            /**
             * Parse simple path.
             */
            var bailRE = /[^\w.$]/;
            function parsePath (path) {
              if (bailRE.test(path)) {
                return
              }
              var segments = path.split('.');
              return function (obj) {
                for (var i = 0; i < segments.length; i++) {
                  if (!obj) { return }
                  obj = obj[segments[i]];
                }
                return obj
              }
            }

            /*  */

            // can we use __proto__?
            var hasProto = '__proto__' in {};

            // Browser environment sniffing
            var inBrowser = typeof window !== 'undefined';
            var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
            var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
            var UA = inBrowser && window.navigator.userAgent.toLowerCase();
            var isIE = UA && /msie|trident/.test(UA);
            var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
            var isEdge = UA && UA.indexOf('edge/') > 0;
            var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
            var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
            var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

            // Firefox has a "watch" function on Object.prototype...
            var nativeWatch = ({}).watch;

            var supportsPassive = false;
            if (inBrowser) {
              try {
                var opts = {};
                Object.defineProperty(opts, 'passive', ({
                  get: function get () {
                    /* istanbul ignore next */
                    supportsPassive = true;
                  }
                })); // https://github.com/facebook/flow/issues/285
                window.addEventListener('test-passive', null, opts);
              } catch (e) {}
            }

            // this needs to be lazy-evaled because vue may be required before
            // vue-server-renderer can set VUE_ENV
            var _isServer;
            var isServerRendering = function () {
              if (_isServer === undefined) {
                /* istanbul ignore if */
                if (!inBrowser && !inWeex && typeof global$1 !== 'undefined') {
                  // detect presence of vue-server-renderer and avoid
                  // Webpack shimming the process
                  _isServer = global$1['process'].env.VUE_ENV === 'server';
                } else {
                  _isServer = false;
                }
              }
              return _isServer
            };

            // detect devtools
            var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

            /* istanbul ignore next */
            function isNative (Ctor) {
              return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
            }

            var hasSymbol =
              typeof Symbol !== 'undefined' && isNative(Symbol) &&
              typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

            var _Set;
            /* istanbul ignore if */ // $flow-disable-line
            if (typeof Set !== 'undefined' && isNative(Set)) {
              // use native Set when available.
              _Set = Set;
            } else {
              // a non-standard Set polyfill that only works with primitive keys.
              _Set = (function () {
                function Set () {
                  this.set = Object.create(null);
                }
                Set.prototype.has = function has (key) {
                  return this.set[key] === true
                };
                Set.prototype.add = function add (key) {
                  this.set[key] = true;
                };
                Set.prototype.clear = function clear () {
                  this.set = Object.create(null);
                };

                return Set;
              }());
            }

            /*  */

            var warn = noop$1;
            var tip = noop$1;
            var generateComponentTrace = (noop$1); // work around flow check
            var formatComponentName = (noop$1);

            if (process.env.NODE_ENV !== 'production') {
              var hasConsole = typeof console !== 'undefined';
              var classifyRE = /(?:^|[-_])(\w)/g;
              var classify = function (str) { return str
                .replace(classifyRE, function (c) { return c.toUpperCase(); })
                .replace(/[-_]/g, ''); };

              warn = function (msg, vm) {
                var trace = vm ? generateComponentTrace(vm) : '';

                if (config$1.warnHandler) {
                  config$1.warnHandler.call(null, msg, vm, trace);
                } else if (hasConsole && (!config$1.silent)) {
                  console.error(("[Vue warn]: " + msg + trace));
                }
              };

              tip = function (msg, vm) {
                if (hasConsole && (!config$1.silent)) {
                  console.warn("[Vue tip]: " + msg + (
                    vm ? generateComponentTrace(vm) : ''
                  ));
                }
              };

              formatComponentName = function (vm, includeFile) {
                if (vm.$root === vm) {
                  return '<Root>'
                }
                var options = typeof vm === 'function' && vm.cid != null
                  ? vm.options
                  : vm._isVue
                    ? vm.$options || vm.constructor.options
                    : vm || {};
                var name = options.name || options._componentTag;
                var file = options.__file;
                if (!name && file) {
                  var match = file.match(/([^/\\]+)\.vue$/);
                  name = match && match[1];
                }

                return (
                  (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
                  (file && includeFile !== false ? (" at " + file) : '')
                )
              };

              var repeat = function (str, n) {
                var res = '';
                while (n) {
                  if (n % 2 === 1) { res += str; }
                  if (n > 1) { str += str; }
                  n >>= 1;
                }
                return res
              };

              generateComponentTrace = function (vm) {
                if (vm._isVue && vm.$parent) {
                  var tree = [];
                  var currentRecursiveSequence = 0;
                  while (vm) {
                    if (tree.length > 0) {
                      var last = tree[tree.length - 1];
                      if (last.constructor === vm.constructor) {
                        currentRecursiveSequence++;
                        vm = vm.$parent;
                        continue
                      } else if (currentRecursiveSequence > 0) {
                        tree[tree.length - 1] = [last, currentRecursiveSequence];
                        currentRecursiveSequence = 0;
                      }
                    }
                    tree.push(vm);
                    vm = vm.$parent;
                  }
                  return '\n\nfound in\n\n' + tree
                    .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
                        ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
                        : formatComponentName(vm))); })
                    .join('\n')
                } else {
                  return ("\n\n(found in " + (formatComponentName(vm)) + ")")
                }
              };
            }

            /*  */


            var uid = 0;

            /**
             * A dep is an observable that can have multiple
             * directives subscribing to it.
             */
            var Dep = function Dep () {
              this.id = uid++;
              this.subs = [];
            };

            Dep.prototype.addSub = function addSub (sub) {
              this.subs.push(sub);
            };

            Dep.prototype.removeSub = function removeSub (sub) {
              remove(this.subs, sub);
            };

            Dep.prototype.depend = function depend () {
              if (Dep.target) {
                Dep.target.addDep(this);
              }
            };

            Dep.prototype.notify = function notify () {
              // stabilize the subscriber list first
              var subs = this.subs.slice();
              for (var i = 0, l = subs.length; i < l; i++) {
                subs[i].update();
              }
            };

            // the current target watcher being evaluated.
            // this is globally unique because there could be only one
            // watcher being evaluated at any time.
            Dep.target = null;
            var targetStack = [];

            function pushTarget (_target) {
              if (Dep.target) { targetStack.push(Dep.target); }
              Dep.target = _target;
            }

            function popTarget () {
              Dep.target = targetStack.pop();
            }

            /*  */

            var VNode = function VNode (
              tag,
              data,
              children,
              text,
              elm,
              context,
              componentOptions,
              asyncFactory
            ) {
              this.tag = tag;
              this.data = data;
              this.children = children;
              this.text = text;
              this.elm = elm;
              this.ns = undefined;
              this.context = context;
              this.fnContext = undefined;
              this.fnOptions = undefined;
              this.fnScopeId = undefined;
              this.key = data && data.key;
              this.componentOptions = componentOptions;
              this.componentInstance = undefined;
              this.parent = undefined;
              this.raw = false;
              this.isStatic = false;
              this.isRootInsert = true;
              this.isComment = false;
              this.isCloned = false;
              this.isOnce = false;
              this.asyncFactory = asyncFactory;
              this.asyncMeta = undefined;
              this.isAsyncPlaceholder = false;
            };

            var prototypeAccessors = { child: { configurable: true } };

            // DEPRECATED: alias for componentInstance for backwards compat.
            /* istanbul ignore next */
            prototypeAccessors.child.get = function () {
              return this.componentInstance
            };

            Object.defineProperties( VNode.prototype, prototypeAccessors );

            var createEmptyVNode = function (text) {
              if ( text === void 0 ) { text = ''; }

              var node = new VNode();
              node.text = text;
              node.isComment = true;
              return node
            };

            function createTextVNode (val) {
              return new VNode(undefined, undefined, undefined, String(val))
            }

            // optimized shallow clone
            // used for static nodes and slot nodes because they may be reused across
            // multiple renders, cloning them avoids errors when DOM manipulations rely
            // on their elm reference.
            function cloneVNode (vnode) {
              var cloned = new VNode(
                vnode.tag,
                vnode.data,
                vnode.children,
                vnode.text,
                vnode.elm,
                vnode.context,
                vnode.componentOptions,
                vnode.asyncFactory
              );
              cloned.ns = vnode.ns;
              cloned.isStatic = vnode.isStatic;
              cloned.key = vnode.key;
              cloned.isComment = vnode.isComment;
              cloned.fnContext = vnode.fnContext;
              cloned.fnOptions = vnode.fnOptions;
              cloned.fnScopeId = vnode.fnScopeId;
              cloned.isCloned = true;
              return cloned
            }

            /*
             * not type checking this file because flow doesn't play well with
             * dynamically accessing methods on Array prototype
             */

            var arrayProto = Array.prototype;
            var arrayMethods = Object.create(arrayProto);

            var methodsToPatch = [
              'push',
              'pop',
              'shift',
              'unshift',
              'splice',
              'sort',
              'reverse'
            ];

            /**
             * Intercept mutating methods and emit events
             */
            methodsToPatch.forEach(function (method) {
              // cache original method
              var original = arrayProto[method];
              def(arrayMethods, method, function mutator () {
                var arguments$1 = arguments;

                var args = [], len = arguments.length;
                while ( len-- ) { args[ len ] = arguments$1[ len ]; }

                var result = original.apply(this, args);
                var ob = this.__ob__;
                var inserted;
                switch (method) {
                  case 'push':
                  case 'unshift':
                    inserted = args;
                    break
                  case 'splice':
                    inserted = args.slice(2);
                    break
                }
                if (inserted) { ob.observeArray(inserted); }
                // notify change
                ob.dep.notify();
                return result
              });
            });

            /*  */

            var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

            /**
             * In some cases we may want to disable observation inside a component's
             * update computation.
             */
            var shouldObserve = true;

            function toggleObserving (value) {
              shouldObserve = value;
            }

            /**
             * Observer class that is attached to each observed
             * object. Once attached, the observer converts the target
             * object's property keys into getter/setters that
             * collect dependencies and dispatch updates.
             */
            var Observer = function Observer (value) {
              this.value = value;
              this.dep = new Dep();
              this.vmCount = 0;
              def(value, '__ob__', this);
              if (Array.isArray(value)) {
                var augment = hasProto
                  ? protoAugment
                  : copyAugment;
                augment(value, arrayMethods, arrayKeys);
                this.observeArray(value);
              } else {
                this.walk(value);
              }
            };

            /**
             * Walk through each property and convert them into
             * getter/setters. This method should only be called when
             * value type is Object.
             */
            Observer.prototype.walk = function walk (obj) {
              var keys = Object.keys(obj);
              for (var i = 0; i < keys.length; i++) {
                defineReactive(obj, keys[i]);
              }
            };

            /**
             * Observe a list of Array items.
             */
            Observer.prototype.observeArray = function observeArray (items) {
              for (var i = 0, l = items.length; i < l; i++) {
                observe(items[i]);
              }
            };

            // helpers

            /**
             * Augment an target Object or Array by intercepting
             * the prototype chain using __proto__
             */
            function protoAugment (target, src, keys) {
              /* eslint-disable no-proto */
              target.__proto__ = src;
              /* eslint-enable no-proto */
            }

            /**
             * Augment an target Object or Array by defining
             * hidden properties.
             */
            /* istanbul ignore next */
            function copyAugment (target, src, keys) {
              for (var i = 0, l = keys.length; i < l; i++) {
                var key = keys[i];
                def(target, key, src[key]);
              }
            }

            /**
             * Attempt to create an observer instance for a value,
             * returns the new observer if successfully observed,
             * or the existing observer if the value already has one.
             */
            function observe (value, asRootData) {
              if (!isObject(value) || value instanceof VNode) {
                return
              }
              var ob;
              if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
                ob = value.__ob__;
              } else if (
                shouldObserve &&
                !isServerRendering() &&
                (Array.isArray(value) || isPlainObject(value)) &&
                Object.isExtensible(value) &&
                !value._isVue
              ) {
                ob = new Observer(value);
              }
              if (asRootData && ob) {
                ob.vmCount++;
              }
              return ob
            }

            /**
             * Define a reactive property on an Object.
             */
            function defineReactive (
              obj,
              key,
              val,
              customSetter,
              shallow
            ) {
              var dep = new Dep();

              var property = Object.getOwnPropertyDescriptor(obj, key);
              if (property && property.configurable === false) {
                return
              }

              // cater for pre-defined getter/setters
              var getter = property && property.get;
              if (!getter && arguments.length === 2) {
                val = obj[key];
              }
              var setter = property && property.set;

              var childOb = !shallow && observe(val);
              Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function reactiveGetter () {
                  var value = getter ? getter.call(obj) : val;
                  if (Dep.target) {
                    dep.depend();
                    if (childOb) {
                      childOb.dep.depend();
                      if (Array.isArray(value)) {
                        dependArray(value);
                      }
                    }
                  }
                  return value
                },
                set: function reactiveSetter (newVal) {
                  var value = getter ? getter.call(obj) : val;
                  /* eslint-disable no-self-compare */
                  if (newVal === value || (newVal !== newVal && value !== value)) {
                    return
                  }
                  /* eslint-enable no-self-compare */
                  if (process.env.NODE_ENV !== 'production' && customSetter) {
                    customSetter();
                  }
                  if (setter) {
                    setter.call(obj, newVal);
                  } else {
                    val = newVal;
                  }
                  childOb = !shallow && observe(newVal);
                  dep.notify();
                }
              });
            }

            /**
             * Set a property on an object. Adds the new property and
             * triggers change notification if the property doesn't
             * already exist.
             */
            function set (target, key, val) {
              if (process.env.NODE_ENV !== 'production' &&
                (isUndef(target) || isPrimitive(target))
              ) {
                warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
              }
              if (Array.isArray(target) && isValidArrayIndex(key)) {
                target.length = Math.max(target.length, key);
                target.splice(key, 1, val);
                return val
              }
              if (key in target && !(key in Object.prototype)) {
                target[key] = val;
                return val
              }
              var ob = (target).__ob__;
              if (target._isVue || (ob && ob.vmCount)) {
                process.env.NODE_ENV !== 'production' && warn(
                  'Avoid adding reactive properties to a Vue instance or its root $data ' +
                  'at runtime - declare it upfront in the data option.'
                );
                return val
              }
              if (!ob) {
                target[key] = val;
                return val
              }
              defineReactive(ob.value, key, val);
              ob.dep.notify();
              return val
            }

            /**
             * Delete a property and trigger change if necessary.
             */
            function del (target, key) {
              if (process.env.NODE_ENV !== 'production' &&
                (isUndef(target) || isPrimitive(target))
              ) {
                warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
              }
              if (Array.isArray(target) && isValidArrayIndex(key)) {
                target.splice(key, 1);
                return
              }
              var ob = (target).__ob__;
              if (target._isVue || (ob && ob.vmCount)) {
                process.env.NODE_ENV !== 'production' && warn(
                  'Avoid deleting properties on a Vue instance or its root $data ' +
                  '- just set it to null.'
                );
                return
              }
              if (!hasOwn(target, key)) {
                return
              }
              delete target[key];
              if (!ob) {
                return
              }
              ob.dep.notify();
            }

            /**
             * Collect dependencies on array elements when the array is touched, since
             * we cannot intercept array element access like property getters.
             */
            function dependArray (value) {
              for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
                e = value[i];
                e && e.__ob__ && e.__ob__.dep.depend();
                if (Array.isArray(e)) {
                  dependArray(e);
                }
              }
            }

            /*  */

            /**
             * Option overwriting strategies are functions that handle
             * how to merge a parent option value and a child option
             * value into the final value.
             */
            var strats = config$1.optionMergeStrategies;

            /**
             * Options with restrictions
             */
            if (process.env.NODE_ENV !== 'production') {
              strats.el = strats.propsData = function (parent, child, vm, key) {
                if (!vm) {
                  warn(
                    "option \"" + key + "\" can only be used during instance " +
                    'creation with the `new` keyword.'
                  );
                }
                return defaultStrat(parent, child)
              };
            }

            /**
             * Helper that recursively merges two data objects together.
             */
            function mergeData (to, from) {
              if (!from) { return to }
              var key, toVal, fromVal;
              var keys = Object.keys(from);
              for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                toVal = to[key];
                fromVal = from[key];
                if (!hasOwn(to, key)) {
                  set(to, key, fromVal);
                } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
                  mergeData(toVal, fromVal);
                }
              }
              return to
            }

            /**
             * Data
             */
            function mergeDataOrFn (
              parentVal,
              childVal,
              vm
            ) {
              if (!vm) {
                // in a Vue.extend merge, both should be functions
                if (!childVal) {
                  return parentVal
                }
                if (!parentVal) {
                  return childVal
                }
                // when parentVal & childVal are both present,
                // we need to return a function that returns the
                // merged result of both functions... no need to
                // check if parentVal is a function here because
                // it has to be a function to pass previous merges.
                return function mergedDataFn () {
                  return mergeData(
                    typeof childVal === 'function' ? childVal.call(this, this) : childVal,
                    typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
                  )
                }
              } else {
                return function mergedInstanceDataFn () {
                  // instance merge
                  var instanceData = typeof childVal === 'function'
                    ? childVal.call(vm, vm)
                    : childVal;
                  var defaultData = typeof parentVal === 'function'
                    ? parentVal.call(vm, vm)
                    : parentVal;
                  if (instanceData) {
                    return mergeData(instanceData, defaultData)
                  } else {
                    return defaultData
                  }
                }
              }
            }

            strats.data = function (
              parentVal,
              childVal,
              vm
            ) {
              if (!vm) {
                if (childVal && typeof childVal !== 'function') {
                  process.env.NODE_ENV !== 'production' && warn(
                    'The "data" option should be a function ' +
                    'that returns a per-instance value in component ' +
                    'definitions.',
                    vm
                  );

                  return parentVal
                }
                return mergeDataOrFn(parentVal, childVal)
              }

              return mergeDataOrFn(parentVal, childVal, vm)
            };

            /**
             * Hooks and props are merged as arrays.
             */
            function mergeHook (
              parentVal,
              childVal
            ) {
              return childVal
                ? parentVal
                  ? parentVal.concat(childVal)
                  : Array.isArray(childVal)
                    ? childVal
                    : [childVal]
                : parentVal
            }

            LIFECYCLE_HOOKS.forEach(function (hook) {
              strats[hook] = mergeHook;
            });

            /**
             * Assets
             *
             * When a vm is present (instance creation), we need to do
             * a three-way merge between constructor options, instance
             * options and parent options.
             */
            function mergeAssets (
              parentVal,
              childVal,
              vm,
              key
            ) {
              var res = Object.create(parentVal || null);
              if (childVal) {
                process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
                return extend(res, childVal)
              } else {
                return res
              }
            }

            ASSET_TYPES.forEach(function (type) {
              strats[type + 's'] = mergeAssets;
            });

            /**
             * Watchers.
             *
             * Watchers hashes should not overwrite one
             * another, so we merge them as arrays.
             */
            strats.watch = function (
              parentVal,
              childVal,
              vm,
              key
            ) {
              // work around Firefox's Object.prototype.watch...
              if (parentVal === nativeWatch) { parentVal = undefined; }
              if (childVal === nativeWatch) { childVal = undefined; }
              /* istanbul ignore if */
              if (!childVal) { return Object.create(parentVal || null) }
              if (process.env.NODE_ENV !== 'production') {
                assertObjectType(key, childVal, vm);
              }
              if (!parentVal) { return childVal }
              var ret = {};
              extend(ret, parentVal);
              for (var key$1 in childVal) {
                var parent = ret[key$1];
                var child = childVal[key$1];
                if (parent && !Array.isArray(parent)) {
                  parent = [parent];
                }
                ret[key$1] = parent
                  ? parent.concat(child)
                  : Array.isArray(child) ? child : [child];
              }
              return ret
            };

            /**
             * Other object hashes.
             */
            strats.props =
            strats.methods =
            strats.inject =
            strats.computed = function (
              parentVal,
              childVal,
              vm,
              key
            ) {
              if (childVal && process.env.NODE_ENV !== 'production') {
                assertObjectType(key, childVal, vm);
              }
              if (!parentVal) { return childVal }
              var ret = Object.create(null);
              extend(ret, parentVal);
              if (childVal) { extend(ret, childVal); }
              return ret
            };
            strats.provide = mergeDataOrFn;

            /**
             * Default strategy.
             */
            var defaultStrat = function (parentVal, childVal) {
              return childVal === undefined
                ? parentVal
                : childVal
            };

            /**
             * Validate component names
             */
            function checkComponents (options) {
              for (var key in options.components) {
                validateComponentName(key);
              }
            }

            function validateComponentName (name) {
              if (!/^[a-zA-Z][\w-]*$/.test(name)) {
                warn(
                  'Invalid component name: "' + name + '". Component names ' +
                  'can only contain alphanumeric characters and the hyphen, ' +
                  'and must start with a letter.'
                );
              }
              if (isBuiltInTag(name) || config$1.isReservedTag(name)) {
                warn(
                  'Do not use built-in or reserved HTML elements as component ' +
                  'id: ' + name
                );
              }
            }

            /**
             * Ensure all props option syntax are normalized into the
             * Object-based format.
             */
            function normalizeProps (options, vm) {
              var props = options.props;
              if (!props) { return }
              var res = {};
              var i, val, name;
              if (Array.isArray(props)) {
                i = props.length;
                while (i--) {
                  val = props[i];
                  if (typeof val === 'string') {
                    name = camelize(val);
                    res[name] = { type: null };
                  } else if (process.env.NODE_ENV !== 'production') {
                    warn('props must be strings when using array syntax.');
                  }
                }
              } else if (isPlainObject(props)) {
                for (var key in props) {
                  val = props[key];
                  name = camelize(key);
                  res[name] = isPlainObject(val)
                    ? val
                    : { type: val };
                }
              } else if (process.env.NODE_ENV !== 'production') {
                warn(
                  "Invalid value for option \"props\": expected an Array or an Object, " +
                  "but got " + (toRawType(props)) + ".",
                  vm
                );
              }
              options.props = res;
            }

            /**
             * Normalize all injections into Object-based format
             */
            function normalizeInject (options, vm) {
              var inject = options.inject;
              if (!inject) { return }
              var normalized = options.inject = {};
              if (Array.isArray(inject)) {
                for (var i = 0; i < inject.length; i++) {
                  normalized[inject[i]] = { from: inject[i] };
                }
              } else if (isPlainObject(inject)) {
                for (var key in inject) {
                  var val = inject[key];
                  normalized[key] = isPlainObject(val)
                    ? extend({ from: key }, val)
                    : { from: val };
                }
              } else if (process.env.NODE_ENV !== 'production') {
                warn(
                  "Invalid value for option \"inject\": expected an Array or an Object, " +
                  "but got " + (toRawType(inject)) + ".",
                  vm
                );
              }
            }

            /**
             * Normalize raw function directives into object format.
             */
            function normalizeDirectives (options) {
              var dirs = options.directives;
              if (dirs) {
                for (var key in dirs) {
                  var def = dirs[key];
                  if (typeof def === 'function') {
                    dirs[key] = { bind: def, update: def };
                  }
                }
              }
            }

            function assertObjectType (name, value, vm) {
              if (!isPlainObject(value)) {
                warn(
                  "Invalid value for option \"" + name + "\": expected an Object, " +
                  "but got " + (toRawType(value)) + ".",
                  vm
                );
              }
            }

            /**
             * Merge two option objects into a new one.
             * Core utility used in both instantiation and inheritance.
             */
            function mergeOptions (
              parent,
              child,
              vm
            ) {
              if (process.env.NODE_ENV !== 'production') {
                checkComponents(child);
              }

              if (typeof child === 'function') {
                child = child.options;
              }

              normalizeProps(child, vm);
              normalizeInject(child, vm);
              normalizeDirectives(child);
              var extendsFrom = child.extends;
              if (extendsFrom) {
                parent = mergeOptions(parent, extendsFrom, vm);
              }
              if (child.mixins) {
                for (var i = 0, l = child.mixins.length; i < l; i++) {
                  parent = mergeOptions(parent, child.mixins[i], vm);
                }
              }
              var options = {};
              var key;
              for (key in parent) {
                mergeField(key);
              }
              for (key in child) {
                if (!hasOwn(parent, key)) {
                  mergeField(key);
                }
              }
              function mergeField (key) {
                var strat = strats[key] || defaultStrat;
                options[key] = strat(parent[key], child[key], vm, key);
              }
              return options
            }

            /**
             * Resolve an asset.
             * This function is used because child instances need access
             * to assets defined in its ancestor chain.
             */
            function resolveAsset (
              options,
              type,
              id,
              warnMissing
            ) {
              /* istanbul ignore if */
              if (typeof id !== 'string') {
                return
              }
              var assets = options[type];
              // check local registration variations first
              if (hasOwn(assets, id)) { return assets[id] }
              var camelizedId = camelize(id);
              if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
              var PascalCaseId = capitalize(camelizedId);
              if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
              // fallback to prototype chain
              var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
              if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
                warn(
                  'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
                  options
                );
              }
              return res
            }

            /*  */

            function validateProp (
              key,
              propOptions,
              propsData,
              vm
            ) {
              var prop = propOptions[key];
              var absent = !hasOwn(propsData, key);
              var value = propsData[key];
              // boolean casting
              var booleanIndex = getTypeIndex(Boolean, prop.type);
              if (booleanIndex > -1) {
                if (absent && !hasOwn(prop, 'default')) {
                  value = false;
                } else if (value === '' || value === hyphenate(key)) {
                  // only cast empty string / same name to boolean if
                  // boolean has higher priority
                  var stringIndex = getTypeIndex(String, prop.type);
                  if (stringIndex < 0 || booleanIndex < stringIndex) {
                    value = true;
                  }
                }
              }
              // check default value
              if (value === undefined) {
                value = getPropDefaultValue(vm, prop, key);
                // since the default value is a fresh copy,
                // make sure to observe it.
                var prevShouldObserve = shouldObserve;
                toggleObserving(true);
                observe(value);
                toggleObserving(prevShouldObserve);
              }
              if (
                process.env.NODE_ENV !== 'production' &&
                // skip validation for weex recycle-list child component props
                !(false && isObject(value) && ('@binding' in value))
              ) {
                assertProp(prop, key, value, vm, absent);
              }
              return value
            }

            /**
             * Get the default value of a prop.
             */
            function getPropDefaultValue (vm, prop, key) {
              // no default, return undefined
              if (!hasOwn(prop, 'default')) {
                return undefined
              }
              var def = prop.default;
              // warn against non-factory defaults for Object & Array
              if (process.env.NODE_ENV !== 'production' && isObject(def)) {
                warn(
                  'Invalid default value for prop "' + key + '": ' +
                  'Props with type Object/Array must use a factory function ' +
                  'to return the default value.',
                  vm
                );
              }
              // the raw prop value was also undefined from previous render,
              // return previous default value to avoid unnecessary watcher trigger
              if (vm && vm.$options.propsData &&
                vm.$options.propsData[key] === undefined &&
                vm._props[key] !== undefined
              ) {
                return vm._props[key]
              }
              // call factory function for non-Function types
              // a value is Function if its prototype is function even across different execution context
              return typeof def === 'function' && getType(prop.type) !== 'Function'
                ? def.call(vm)
                : def
            }

            /**
             * Assert whether a prop is valid.
             */
            function assertProp (
              prop,
              name,
              value,
              vm,
              absent
            ) {
              if (prop.required && absent) {
                warn(
                  'Missing required prop: "' + name + '"',
                  vm
                );
                return
              }
              if (value == null && !prop.required) {
                return
              }
              var type = prop.type;
              var valid = !type || type === true;
              var expectedTypes = [];
              if (type) {
                if (!Array.isArray(type)) {
                  type = [type];
                }
                for (var i = 0; i < type.length && !valid; i++) {
                  var assertedType = assertType(value, type[i]);
                  expectedTypes.push(assertedType.expectedType || '');
                  valid = assertedType.valid;
                }
              }
              if (!valid) {
                warn(
                  "Invalid prop: type check failed for prop \"" + name + "\"." +
                  " Expected " + (expectedTypes.map(capitalize).join(', ')) +
                  ", got " + (toRawType(value)) + ".",
                  vm
                );
                return
              }
              var validator = prop.validator;
              if (validator) {
                if (!validator(value)) {
                  warn(
                    'Invalid prop: custom validator check failed for prop "' + name + '".',
                    vm
                  );
                }
              }
            }

            var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

            function assertType (value, type) {
              var valid;
              var expectedType = getType(type);
              if (simpleCheckRE.test(expectedType)) {
                var t = typeof value;
                valid = t === expectedType.toLowerCase();
                // for primitive wrapper objects
                if (!valid && t === 'object') {
                  valid = value instanceof type;
                }
              } else if (expectedType === 'Object') {
                valid = isPlainObject(value);
              } else if (expectedType === 'Array') {
                valid = Array.isArray(value);
              } else {
                valid = value instanceof type;
              }
              return {
                valid: valid,
                expectedType: expectedType
              }
            }

            /**
             * Use function string name to check built-in types,
             * because a simple equality check will fail when running
             * across different vms / iframes.
             */
            function getType (fn) {
              var match = fn && fn.toString().match(/^\s*function (\w+)/);
              return match ? match[1] : ''
            }

            function isSameType (a, b) {
              return getType(a) === getType(b)
            }

            function getTypeIndex (type, expectedTypes) {
              if (!Array.isArray(expectedTypes)) {
                return isSameType(expectedTypes, type) ? 0 : -1
              }
              for (var i = 0, len = expectedTypes.length; i < len; i++) {
                if (isSameType(expectedTypes[i], type)) {
                  return i
                }
              }
              return -1
            }

            /*  */

            function handleError (err, vm, info) {
              if (vm) {
                var cur = vm;
                while ((cur = cur.$parent)) {
                  var hooks = cur.$options.errorCaptured;
                  if (hooks) {
                    for (var i = 0; i < hooks.length; i++) {
                      try {
                        var capture = hooks[i].call(cur, err, vm, info) === false;
                        if (capture) { return }
                      } catch (e) {
                        globalHandleError(e, cur, 'errorCaptured hook');
                      }
                    }
                  }
                }
              }
              globalHandleError(err, vm, info);
            }

            function globalHandleError (err, vm, info) {
              if (config$1.errorHandler) {
                try {
                  return config$1.errorHandler.call(null, err, vm, info)
                } catch (e) {
                  logError(e, null, 'config.errorHandler');
                }
              }
              logError(err, vm, info);
            }

            function logError (err, vm, info) {
              if (process.env.NODE_ENV !== 'production') {
                warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
              }
              /* istanbul ignore else */
              if ((inBrowser || inWeex) && typeof console !== 'undefined') {
                console.error(err);
              } else {
                throw err
              }
            }

            /*  */
            /* globals MessageChannel */

            var callbacks = [];
            var pending = false;

            function flushCallbacks () {
              pending = false;
              var copies = callbacks.slice(0);
              callbacks.length = 0;
              for (var i = 0; i < copies.length; i++) {
                copies[i]();
              }
            }

            // Here we have async deferring wrappers using both microtasks and (macro) tasks.
            // In < 2.4 we used microtasks everywhere, but there are some scenarios where
            // microtasks have too high a priority and fire in between supposedly
            // sequential events (e.g. #4521, #6690) or even between bubbling of the same
            // event (#6566). However, using (macro) tasks everywhere also has subtle problems
            // when state is changed right before repaint (e.g. #6813, out-in transitions).
            // Here we use microtask by default, but expose a way to force (macro) task when
            // needed (e.g. in event handlers attached by v-on).
            var microTimerFunc;
            var macroTimerFunc;
            var useMacroTask = false;

            // Determine (macro) task defer implementation.
            // Technically setImmediate should be the ideal choice, but it's only available
            // in IE. The only polyfill that consistently queues the callback after all DOM
            // events triggered in the same loop is by using MessageChannel.
            /* istanbul ignore if */
            if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
              macroTimerFunc = function () {
                setImmediate(flushCallbacks);
              };
            } else if (typeof MessageChannel !== 'undefined' && (
              isNative(MessageChannel) ||
              // PhantomJS
              MessageChannel.toString() === '[object MessageChannelConstructor]'
            )) {
              var channel = new MessageChannel();
              var port = channel.port2;
              channel.port1.onmessage = flushCallbacks;
              macroTimerFunc = function () {
                port.postMessage(1);
              };
            } else {
              /* istanbul ignore next */
              macroTimerFunc = function () {
                setTimeout(flushCallbacks, 0);
              };
            }

            // Determine microtask defer implementation.
            /* istanbul ignore next, $flow-disable-line */
            if (typeof Promise !== 'undefined' && isNative(Promise)) {
              var p = Promise.resolve();
              microTimerFunc = function () {
                p.then(flushCallbacks);
                // in problematic UIWebViews, Promise.then doesn't completely break, but
                // it can get stuck in a weird state where callbacks are pushed into the
                // microtask queue but the queue isn't being flushed, until the browser
                // needs to do some other work, e.g. handle a timer. Therefore we can
                // "force" the microtask queue to be flushed by adding an empty timer.
                if (isIOS) { setTimeout(noop$1); }
              };
            } else {
              // fallback to macro
              microTimerFunc = macroTimerFunc;
            }

            /**
             * Wrap a function so that if any code inside triggers state change,
             * the changes are queued using a (macro) task instead of a microtask.
             */
            function withMacroTask (fn) {
              return fn._withTask || (fn._withTask = function () {
                useMacroTask = true;
                var res = fn.apply(null, arguments);
                useMacroTask = false;
                return res
              })
            }

            function nextTick$1 (cb, ctx) {
              var _resolve;
              callbacks.push(function () {
                if (cb) {
                  try {
                    cb.call(ctx);
                  } catch (e) {
                    handleError(e, ctx, 'nextTick');
                  }
                } else if (_resolve) {
                  _resolve(ctx);
                }
              });
              if (!pending) {
                pending = true;
                if (useMacroTask) {
                  macroTimerFunc();
                } else {
                  microTimerFunc();
                }
              }
              // $flow-disable-line
              if (!cb && typeof Promise !== 'undefined') {
                return new Promise(function (resolve) {
                  _resolve = resolve;
                })
              }
            }

            /*  */

            /* not type checking this file because flow doesn't play well with Proxy */

            var initProxy;

            if (process.env.NODE_ENV !== 'production') {
              var allowedGlobals = makeMap(
                'Infinity,undefined,NaN,isFinite,isNaN,' +
                'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
                'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
                'require' // for Webpack/Browserify
              );

              var warnNonPresent = function (target, key) {
                warn(
                  "Property or method \"" + key + "\" is not defined on the instance but " +
                  'referenced during render. Make sure that this property is reactive, ' +
                  'either in the data option, or for class-based components, by ' +
                  'initializing the property. ' +
                  'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
                  target
                );
              };

              var hasProxy =
                typeof Proxy !== 'undefined' && isNative(Proxy);

              if (hasProxy) {
                var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
                config$1.keyCodes = new Proxy(config$1.keyCodes, {
                  set: function set (target, key, value) {
                    if (isBuiltInModifier(key)) {
                      warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
                      return false
                    } else {
                      target[key] = value;
                      return true
                    }
                  }
                });
              }

              var hasHandler = {
                has: function has (target, key) {
                  var has = key in target;
                  var isAllowed = allowedGlobals(key) || key.charAt(0) === '_';
                  if (!has && !isAllowed) {
                    warnNonPresent(target, key);
                  }
                  return has || !isAllowed
                }
              };

              var getHandler = {
                get: function get (target, key) {
                  if (typeof key === 'string' && !(key in target)) {
                    warnNonPresent(target, key);
                  }
                  return target[key]
                }
              };

              initProxy = function initProxy (vm) {
                if (hasProxy) {
                  // determine which proxy handler to use
                  var options = vm.$options;
                  var handlers = options.render && options.render._withStripped
                    ? getHandler
                    : hasHandler;
                  vm._renderProxy = new Proxy(vm, handlers);
                } else {
                  vm._renderProxy = vm;
                }
              };
            }

            /*  */

            var seenObjects = new _Set();

            /**
             * Recursively traverse an object to evoke all converted
             * getters, so that every nested property inside the object
             * is collected as a "deep" dependency.
             */
            function traverse (val) {
              _traverse(val, seenObjects);
              seenObjects.clear();
            }

            function _traverse (val, seen) {
              var i, keys;
              var isA = Array.isArray(val);
              if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
                return
              }
              if (val.__ob__) {
                var depId = val.__ob__.dep.id;
                if (seen.has(depId)) {
                  return
                }
                seen.add(depId);
              }
              if (isA) {
                i = val.length;
                while (i--) { _traverse(val[i], seen); }
              } else {
                keys = Object.keys(val);
                i = keys.length;
                while (i--) { _traverse(val[keys[i]], seen); }
              }
            }

            var mark;
            var measure;

            if (process.env.NODE_ENV !== 'production') {
              var perf = inBrowser && window.performance;
              /* istanbul ignore if */
              if (
                perf &&
                perf.mark &&
                perf.measure &&
                perf.clearMarks &&
                perf.clearMeasures
              ) {
                mark = function (tag) { return perf.mark(tag); };
                measure = function (name, startTag, endTag) {
                  perf.measure(name, startTag, endTag);
                  perf.clearMarks(startTag);
                  perf.clearMarks(endTag);
                  perf.clearMeasures(name);
                };
              }
            }

            /*  */

            var normalizeEvent = cached(function (name) {
              var passive = name.charAt(0) === '&';
              name = passive ? name.slice(1) : name;
              var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
              name = once$$1 ? name.slice(1) : name;
              var capture = name.charAt(0) === '!';
              name = capture ? name.slice(1) : name;
              return {
                name: name,
                once: once$$1,
                capture: capture,
                passive: passive
              }
            });

            function createFnInvoker (fns) {
              function invoker () {
                var arguments$1 = arguments;

                var fns = invoker.fns;
                if (Array.isArray(fns)) {
                  var cloned = fns.slice();
                  for (var i = 0; i < cloned.length; i++) {
                    cloned[i].apply(null, arguments$1);
                  }
                } else {
                  // return handler return value for single handlers
                  return fns.apply(null, arguments)
                }
              }
              invoker.fns = fns;
              return invoker
            }

            function updateListeners (
              on$$1,
              oldOn,
              add,
              remove$$1,
              vm
            ) {
              var name, def, cur, old, event;
              for (name in on$$1) {
                def = cur = on$$1[name];
                old = oldOn[name];
                event = normalizeEvent(name);
                /* istanbul ignore if */
                if (isUndef(cur)) {
                  process.env.NODE_ENV !== 'production' && warn(
                    "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
                    vm
                  );
                } else if (isUndef(old)) {
                  if (isUndef(cur.fns)) {
                    cur = on$$1[name] = createFnInvoker(cur);
                  }
                  add(event.name, cur, event.once, event.capture, event.passive, event.params);
                } else if (cur !== old) {
                  old.fns = cur;
                  on$$1[name] = old;
                }
              }
              for (name in oldOn) {
                if (isUndef(on$$1[name])) {
                  event = normalizeEvent(name);
                  remove$$1(event.name, oldOn[name], event.capture);
                }
              }
            }

            /*  */

            function mergeVNodeHook (def, hookKey, hook) {
              if (def instanceof VNode) {
                def = def.data.hook || (def.data.hook = {});
              }
              var invoker;
              var oldHook = def[hookKey];

              function wrappedHook () {
                hook.apply(this, arguments);
                // important: remove merged hook to ensure it's called only once
                // and prevent memory leak
                remove(invoker.fns, wrappedHook);
              }

              if (isUndef(oldHook)) {
                // no existing hook
                invoker = createFnInvoker([wrappedHook]);
              } else {
                /* istanbul ignore if */
                if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
                  // already a merged invoker
                  invoker = oldHook;
                  invoker.fns.push(wrappedHook);
                } else {
                  // existing plain hook
                  invoker = createFnInvoker([oldHook, wrappedHook]);
                }
              }

              invoker.merged = true;
              def[hookKey] = invoker;
            }

            /*  */

            function extractPropsFromVNodeData (
              data,
              Ctor,
              tag
            ) {
              // we are only extracting raw values here.
              // validation and default values are handled in the child
              // component itself.
              var propOptions = Ctor.options.props;
              if (isUndef(propOptions)) {
                return
              }
              var res = {};
              var attrs = data.attrs;
              var props = data.props;
              if (isDef(attrs) || isDef(props)) {
                for (var key in propOptions) {
                  var altKey = hyphenate(key);
                  if (process.env.NODE_ENV !== 'production') {
                    var keyInLowerCase = key.toLowerCase();
                    if (
                      key !== keyInLowerCase &&
                      attrs && hasOwn(attrs, keyInLowerCase)
                    ) {
                      tip(
                        "Prop \"" + keyInLowerCase + "\" is passed to component " +
                        (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
                        " \"" + key + "\". " +
                        "Note that HTML attributes are case-insensitive and camelCased " +
                        "props need to use their kebab-case equivalents when using in-DOM " +
                        "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
                      );
                    }
                  }
                  checkProp(res, props, key, altKey, true) ||
                  checkProp(res, attrs, key, altKey, false);
                }
              }
              return res
            }

            function checkProp (
              res,
              hash,
              key,
              altKey,
              preserve
            ) {
              if (isDef(hash)) {
                if (hasOwn(hash, key)) {
                  res[key] = hash[key];
                  if (!preserve) {
                    delete hash[key];
                  }
                  return true
                } else if (hasOwn(hash, altKey)) {
                  res[key] = hash[altKey];
                  if (!preserve) {
                    delete hash[altKey];
                  }
                  return true
                }
              }
              return false
            }

            /*  */

            // The template compiler attempts to minimize the need for normalization by
            // statically analyzing the template at compile time.
            //
            // For plain HTML markup, normalization can be completely skipped because the
            // generated render function is guaranteed to return Array<VNode>. There are
            // two cases where extra normalization is needed:

            // 1. When the children contains components - because a functional component
            // may return an Array instead of a single root. In this case, just a simple
            // normalization is needed - if any child is an Array, we flatten the whole
            // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
            // because functional components already normalize their own children.
            function simpleNormalizeChildren (children) {
              for (var i = 0; i < children.length; i++) {
                if (Array.isArray(children[i])) {
                  return Array.prototype.concat.apply([], children)
                }
              }
              return children
            }

            // 2. When the children contains constructs that always generated nested Arrays,
            // e.g. <template>, <slot>, v-for, or when the children is provided by user
            // with hand-written render functions / JSX. In such cases a full normalization
            // is needed to cater to all possible types of children values.
            function normalizeChildren (children) {
              return isPrimitive(children)
                ? [createTextVNode(children)]
                : Array.isArray(children)
                  ? normalizeArrayChildren(children)
                  : undefined
            }

            function isTextNode (node) {
              return isDef(node) && isDef(node.text) && isFalse(node.isComment)
            }

            function normalizeArrayChildren (children, nestedIndex) {
              var res = [];
              var i, c, lastIndex, last;
              for (i = 0; i < children.length; i++) {
                c = children[i];
                if (isUndef(c) || typeof c === 'boolean') { continue }
                lastIndex = res.length - 1;
                last = res[lastIndex];
                //  nested
                if (Array.isArray(c)) {
                  if (c.length > 0) {
                    c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
                    // merge adjacent text nodes
                    if (isTextNode(c[0]) && isTextNode(last)) {
                      res[lastIndex] = createTextVNode(last.text + (c[0]).text);
                      c.shift();
                    }
                    res.push.apply(res, c);
                  }
                } else if (isPrimitive(c)) {
                  if (isTextNode(last)) {
                    // merge adjacent text nodes
                    // this is necessary for SSR hydration because text nodes are
                    // essentially merged when rendered to HTML strings
                    res[lastIndex] = createTextVNode(last.text + c);
                  } else if (c !== '') {
                    // convert primitive to vnode
                    res.push(createTextVNode(c));
                  }
                } else {
                  if (isTextNode(c) && isTextNode(last)) {
                    // merge adjacent text nodes
                    res[lastIndex] = createTextVNode(last.text + c.text);
                  } else {
                    // default key for nested array children (likely generated by v-for)
                    if (isTrue(children._isVList) &&
                      isDef(c.tag) &&
                      isUndef(c.key) &&
                      isDef(nestedIndex)) {
                      c.key = "__vlist" + nestedIndex + "_" + i + "__";
                    }
                    res.push(c);
                  }
                }
              }
              return res
            }

            /*  */

            function ensureCtor (comp, base) {
              if (
                comp.__esModule ||
                (hasSymbol && comp[Symbol.toStringTag] === 'Module')
              ) {
                comp = comp.default;
              }
              return isObject(comp)
                ? base.extend(comp)
                : comp
            }

            function createAsyncPlaceholder (
              factory,
              data,
              context,
              children,
              tag
            ) {
              var node = createEmptyVNode();
              node.asyncFactory = factory;
              node.asyncMeta = { data: data, context: context, children: children, tag: tag };
              return node
            }

            function resolveAsyncComponent (
              factory,
              baseCtor,
              context
            ) {
              if (isTrue(factory.error) && isDef(factory.errorComp)) {
                return factory.errorComp
              }

              if (isDef(factory.resolved)) {
                return factory.resolved
              }

              if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
                return factory.loadingComp
              }

              if (isDef(factory.contexts)) {
                // already pending
                factory.contexts.push(context);
              } else {
                var contexts = factory.contexts = [context];
                var sync = true;

                var forceRender = function () {
                  for (var i = 0, l = contexts.length; i < l; i++) {
                    contexts[i].$forceUpdate();
                  }
                };

                var resolve = once$1(function (res) {
                  // cache resolved
                  factory.resolved = ensureCtor(res, baseCtor);
                  // invoke callbacks only if this is not a synchronous resolve
                  // (async resolves are shimmed as synchronous during SSR)
                  if (!sync) {
                    forceRender();
                  }
                });

                var reject = once$1(function (reason) {
                  process.env.NODE_ENV !== 'production' && warn(
                    "Failed to resolve async component: " + (String(factory)) +
                    (reason ? ("\nReason: " + reason) : '')
                  );
                  if (isDef(factory.errorComp)) {
                    factory.error = true;
                    forceRender();
                  }
                });

                var res = factory(resolve, reject);

                if (isObject(res)) {
                  if (typeof res.then === 'function') {
                    // () => Promise
                    if (isUndef(factory.resolved)) {
                      res.then(resolve, reject);
                    }
                  } else if (isDef(res.component) && typeof res.component.then === 'function') {
                    res.component.then(resolve, reject);

                    if (isDef(res.error)) {
                      factory.errorComp = ensureCtor(res.error, baseCtor);
                    }

                    if (isDef(res.loading)) {
                      factory.loadingComp = ensureCtor(res.loading, baseCtor);
                      if (res.delay === 0) {
                        factory.loading = true;
                      } else {
                        setTimeout(function () {
                          if (isUndef(factory.resolved) && isUndef(factory.error)) {
                            factory.loading = true;
                            forceRender();
                          }
                        }, res.delay || 200);
                      }
                    }

                    if (isDef(res.timeout)) {
                      setTimeout(function () {
                        if (isUndef(factory.resolved)) {
                          reject(
                            process.env.NODE_ENV !== 'production'
                              ? ("timeout (" + (res.timeout) + "ms)")
                              : null
                          );
                        }
                      }, res.timeout);
                    }
                  }
                }

                sync = false;
                // return in case resolved synchronously
                return factory.loading
                  ? factory.loadingComp
                  : factory.resolved
              }
            }

            /*  */

            function isAsyncPlaceholder (node) {
              return node.isComment && node.asyncFactory
            }

            /*  */

            function getFirstComponentChild (children) {
              if (Array.isArray(children)) {
                for (var i = 0; i < children.length; i++) {
                  var c = children[i];
                  if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
                    return c
                  }
                }
              }
            }

            /*  */

            /*  */

            function initEvents (vm) {
              vm._events = Object.create(null);
              vm._hasHookEvent = false;
              // init parent attached events
              var listeners = vm.$options._parentListeners;
              if (listeners) {
                updateComponentListeners(vm, listeners);
              }
            }

            var target;

            function add (event, fn, once$$1) {
              if (once$$1) {
                target.$once(event, fn);
              } else {
                target.$on(event, fn);
              }
            }

            function remove$1 (event, fn) {
              target.$off(event, fn);
            }

            function updateComponentListeners (
              vm,
              listeners,
              oldListeners
            ) {
              target = vm;
              updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
              target = undefined;
            }

            function eventsMixin (Vue) {
              var hookRE = /^hook:/;
              Vue.prototype.$on = function (event, fn) {
                var this$1 = this;

                var vm = this;
                if (Array.isArray(event)) {
                  for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$on(event[i], fn);
                  }
                } else {
                  (vm._events[event] || (vm._events[event] = [])).push(fn);
                  // optimize hook:event cost by using a boolean flag marked at registration
                  // instead of a hash lookup
                  if (hookRE.test(event)) {
                    vm._hasHookEvent = true;
                  }
                }
                return vm
              };

              Vue.prototype.$once = function (event, fn) {
                var vm = this;
                function on$$1 () {
                  vm.$off(event, on$$1);
                  fn.apply(vm, arguments);
                }
                on$$1.fn = fn;
                vm.$on(event, on$$1);
                return vm
              };

              Vue.prototype.$off = function (event, fn) {
                var this$1 = this;

                var vm = this;
                // all
                if (!arguments.length) {
                  vm._events = Object.create(null);
                  return vm
                }
                // array of events
                if (Array.isArray(event)) {
                  for (var i = 0, l = event.length; i < l; i++) {
                    this$1.$off(event[i], fn);
                  }
                  return vm
                }
                // specific event
                var cbs = vm._events[event];
                if (!cbs) {
                  return vm
                }
                if (!fn) {
                  vm._events[event] = null;
                  return vm
                }
                if (fn) {
                  // specific handler
                  var cb;
                  var i$1 = cbs.length;
                  while (i$1--) {
                    cb = cbs[i$1];
                    if (cb === fn || cb.fn === fn) {
                      cbs.splice(i$1, 1);
                      break
                    }
                  }
                }
                return vm
              };

              Vue.prototype.$emit = function (event) {
                var vm = this;
                if (process.env.NODE_ENV !== 'production') {
                  var lowerCaseEvent = event.toLowerCase();
                  if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
                    tip(
                      "Event \"" + lowerCaseEvent + "\" is emitted in component " +
                      (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
                      "Note that HTML attributes are case-insensitive and you cannot use " +
                      "v-on to listen to camelCase events when using in-DOM templates. " +
                      "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
                    );
                  }
                }
                var cbs = vm._events[event];
                if (cbs) {
                  cbs = cbs.length > 1 ? toArray(cbs) : cbs;
                  var args = toArray(arguments, 1);
                  for (var i = 0, l = cbs.length; i < l; i++) {
                    try {
                      cbs[i].apply(vm, args);
                    } catch (e) {
                      handleError(e, vm, ("event handler for \"" + event + "\""));
                    }
                  }
                }
                return vm
              };
            }

            /*  */



            /**
             * Runtime helper for resolving raw children VNodes into a slot object.
             */
            function resolveSlots (
              children,
              context
            ) {
              var slots = {};
              if (!children) {
                return slots
              }
              for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                var data = child.data;
                // remove slot attribute if the node is resolved as a Vue slot node
                if (data && data.attrs && data.attrs.slot) {
                  delete data.attrs.slot;
                }
                // named slots should only be respected if the vnode was rendered in the
                // same context.
                if ((child.context === context || child.fnContext === context) &&
                  data && data.slot != null
                ) {
                  var name = data.slot;
                  var slot = (slots[name] || (slots[name] = []));
                  if (child.tag === 'template') {
                    slot.push.apply(slot, child.children || []);
                  } else {
                    slot.push(child);
                  }
                } else {
                  (slots.default || (slots.default = [])).push(child);
                }
              }
              // ignore slots that contains only whitespace
              for (var name$1 in slots) {
                if (slots[name$1].every(isWhitespace)) {
                  delete slots[name$1];
                }
              }
              return slots
            }

            function isWhitespace (node) {
              return (node.isComment && !node.asyncFactory) || node.text === ' '
            }

            function resolveScopedSlots (
              fns, // see flow/vnode
              res
            ) {
              res = res || {};
              for (var i = 0; i < fns.length; i++) {
                if (Array.isArray(fns[i])) {
                  resolveScopedSlots(fns[i], res);
                } else {
                  res[fns[i].key] = fns[i].fn;
                }
              }
              return res
            }

            /*  */

            var activeInstance = null;
            var isUpdatingChildComponent = false;

            function initLifecycle (vm) {
              var options = vm.$options;

              // locate first non-abstract parent
              var parent = options.parent;
              if (parent && !options.abstract) {
                while (parent.$options.abstract && parent.$parent) {
                  parent = parent.$parent;
                }
                parent.$children.push(vm);
              }

              vm.$parent = parent;
              vm.$root = parent ? parent.$root : vm;

              vm.$children = [];
              vm.$refs = {};

              vm._watcher = null;
              vm._inactive = null;
              vm._directInactive = false;
              vm._isMounted = false;
              vm._isDestroyed = false;
              vm._isBeingDestroyed = false;
            }

            function lifecycleMixin (Vue) {
              Vue.prototype._update = function (vnode, hydrating) {
                var vm = this;
                if (vm._isMounted) {
                  callHook(vm, 'beforeUpdate');
                }
                var prevEl = vm.$el;
                var prevVnode = vm._vnode;
                var prevActiveInstance = activeInstance;
                activeInstance = vm;
                vm._vnode = vnode;
                // Vue.prototype.__patch__ is injected in entry points
                // based on the rendering backend used.
                if (!prevVnode) {
                  // initial render
                  vm.$el = vm.__patch__(
                    vm.$el, vnode, hydrating, false /* removeOnly */,
                    vm.$options._parentElm,
                    vm.$options._refElm
                  );
                  // no need for the ref nodes after initial patch
                  // this prevents keeping a detached DOM tree in memory (#5851)
                  vm.$options._parentElm = vm.$options._refElm = null;
                } else {
                  // updates
                  vm.$el = vm.__patch__(prevVnode, vnode);
                }
                activeInstance = prevActiveInstance;
                // update __vue__ reference
                if (prevEl) {
                  prevEl.__vue__ = null;
                }
                if (vm.$el) {
                  vm.$el.__vue__ = vm;
                }
                // if parent is an HOC, update its $el as well
                if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
                  vm.$parent.$el = vm.$el;
                }
                // updated hook is called by the scheduler to ensure that children are
                // updated in a parent's updated hook.
              };

              Vue.prototype.$forceUpdate = function () {
                var vm = this;
                if (vm._watcher) {
                  vm._watcher.update();
                }
              };

              Vue.prototype.$destroy = function () {
                var vm = this;
                if (vm._isBeingDestroyed) {
                  return
                }
                callHook(vm, 'beforeDestroy');
                vm._isBeingDestroyed = true;
                // remove self from parent
                var parent = vm.$parent;
                if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
                  remove(parent.$children, vm);
                }
                // teardown watchers
                if (vm._watcher) {
                  vm._watcher.teardown();
                }
                var i = vm._watchers.length;
                while (i--) {
                  vm._watchers[i].teardown();
                }
                // remove reference from data ob
                // frozen object may not have observer.
                if (vm._data.__ob__) {
                  vm._data.__ob__.vmCount--;
                }
                // call the last hook...
                vm._isDestroyed = true;
                // invoke destroy hooks on current rendered tree
                vm.__patch__(vm._vnode, null);
                // fire destroyed hook
                callHook(vm, 'destroyed');
                // turn off all instance listeners.
                vm.$off();
                // remove __vue__ reference
                if (vm.$el) {
                  vm.$el.__vue__ = null;
                }
                // release circular reference (#6759)
                if (vm.$vnode) {
                  vm.$vnode.parent = null;
                }
              };
            }

            function mountComponent (
              vm,
              el,
              hydrating
            ) {
              vm.$el = el;
              if (!vm.$options.render) {
                vm.$options.render = createEmptyVNode;
                if (process.env.NODE_ENV !== 'production') {
                  /* istanbul ignore if */
                  if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
                    vm.$options.el || el) {
                    warn(
                      'You are using the runtime-only build of Vue where the template ' +
                      'compiler is not available. Either pre-compile the templates into ' +
                      'render functions, or use the compiler-included build.',
                      vm
                    );
                  } else {
                    warn(
                      'Failed to mount component: template or render function not defined.',
                      vm
                    );
                  }
                }
              }
              callHook(vm, 'beforeMount');

              var updateComponent;
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' && config$1.performance && mark) {
                updateComponent = function () {
                  var name = vm._name;
                  var id = vm._uid;
                  var startTag = "vue-perf-start:" + id;
                  var endTag = "vue-perf-end:" + id;

                  mark(startTag);
                  var vnode = vm._render();
                  mark(endTag);
                  measure(("vue " + name + " render"), startTag, endTag);

                  mark(startTag);
                  vm._update(vnode, hydrating);
                  mark(endTag);
                  measure(("vue " + name + " patch"), startTag, endTag);
                };
              } else {
                updateComponent = function () {
                  vm._update(vm._render(), hydrating);
                };
              }

              // we set this to vm._watcher inside the watcher's constructor
              // since the watcher's initial patch may call $forceUpdate (e.g. inside child
              // component's mounted hook), which relies on vm._watcher being already defined
              new Watcher(vm, updateComponent, noop$1, null, true /* isRenderWatcher */);
              hydrating = false;

              // manually mounted instance, call mounted on self
              // mounted is called for render-created child components in its inserted hook
              if (vm.$vnode == null) {
                vm._isMounted = true;
                callHook(vm, 'mounted');
              }
              return vm
            }

            function updateChildComponent (
              vm,
              propsData,
              listeners,
              parentVnode,
              renderChildren
            ) {
              if (process.env.NODE_ENV !== 'production') {
                isUpdatingChildComponent = true;
              }

              // determine whether component has slot children
              // we need to do this before overwriting $options._renderChildren
              var hasChildren = !!(
                renderChildren ||               // has new static slots
                vm.$options._renderChildren ||  // has old static slots
                parentVnode.data.scopedSlots || // has new scoped slots
                vm.$scopedSlots !== emptyObject // has old scoped slots
              );

              vm.$options._parentVnode = parentVnode;
              vm.$vnode = parentVnode; // update vm's placeholder node without re-render

              if (vm._vnode) { // update child tree's parent
                vm._vnode.parent = parentVnode;
              }
              vm.$options._renderChildren = renderChildren;

              // update $attrs and $listeners hash
              // these are also reactive so they may trigger child update if the child
              // used them during render
              vm.$attrs = parentVnode.data.attrs || emptyObject;
              vm.$listeners = listeners || emptyObject;

              // update props
              if (propsData && vm.$options.props) {
                toggleObserving(false);
                var props = vm._props;
                var propKeys = vm.$options._propKeys || [];
                for (var i = 0; i < propKeys.length; i++) {
                  var key = propKeys[i];
                  var propOptions = vm.$options.props; // wtf flow?
                  props[key] = validateProp(key, propOptions, propsData, vm);
                }
                toggleObserving(true);
                // keep a copy of raw propsData
                vm.$options.propsData = propsData;
              }

              // update listeners
              listeners = listeners || emptyObject;
              var oldListeners = vm.$options._parentListeners;
              vm.$options._parentListeners = listeners;
              updateComponentListeners(vm, listeners, oldListeners);

              // resolve slots + force update if has children
              if (hasChildren) {
                vm.$slots = resolveSlots(renderChildren, parentVnode.context);
                vm.$forceUpdate();
              }

              if (process.env.NODE_ENV !== 'production') {
                isUpdatingChildComponent = false;
              }
            }

            function isInInactiveTree (vm) {
              while (vm && (vm = vm.$parent)) {
                if (vm._inactive) { return true }
              }
              return false
            }

            function activateChildComponent (vm, direct) {
              if (direct) {
                vm._directInactive = false;
                if (isInInactiveTree(vm)) {
                  return
                }
              } else if (vm._directInactive) {
                return
              }
              if (vm._inactive || vm._inactive === null) {
                vm._inactive = false;
                for (var i = 0; i < vm.$children.length; i++) {
                  activateChildComponent(vm.$children[i]);
                }
                callHook(vm, 'activated');
              }
            }

            function deactivateChildComponent (vm, direct) {
              if (direct) {
                vm._directInactive = true;
                if (isInInactiveTree(vm)) {
                  return
                }
              }
              if (!vm._inactive) {
                vm._inactive = true;
                for (var i = 0; i < vm.$children.length; i++) {
                  deactivateChildComponent(vm.$children[i]);
                }
                callHook(vm, 'deactivated');
              }
            }

            function callHook (vm, hook) {
              // #7573 disable dep collection when invoking lifecycle hooks
              pushTarget();
              var handlers = vm.$options[hook];
              if (handlers) {
                for (var i = 0, j = handlers.length; i < j; i++) {
                  try {
                    handlers[i].call(vm);
                  } catch (e) {
                    handleError(e, vm, (hook + " hook"));
                  }
                }
              }
              if (vm._hasHookEvent) {
                vm.$emit('hook:' + hook);
              }
              popTarget();
            }

            /*  */


            var MAX_UPDATE_COUNT = 100;

            var queue$1 = [];
            var activatedChildren = [];
            var has = {};
            var circular = {};
            var waiting = false;
            var flushing = false;
            var index = 0;

            /**
             * Reset the scheduler's state.
             */
            function resetSchedulerState () {
              index = queue$1.length = activatedChildren.length = 0;
              has = {};
              if (process.env.NODE_ENV !== 'production') {
                circular = {};
              }
              waiting = flushing = false;
            }

            /**
             * Flush both queues and run the watchers.
             */
            function flushSchedulerQueue () {
              flushing = true;
              var watcher, id;

              // Sort queue before flush.
              // This ensures that:
              // 1. Components are updated from parent to child. (because parent is always
              //    created before the child)
              // 2. A component's user watchers are run before its render watcher (because
              //    user watchers are created before the render watcher)
              // 3. If a component is destroyed during a parent component's watcher run,
              //    its watchers can be skipped.
              queue$1.sort(function (a, b) { return a.id - b.id; });

              // do not cache length because more watchers might be pushed
              // as we run existing watchers
              for (index = 0; index < queue$1.length; index++) {
                watcher = queue$1[index];
                id = watcher.id;
                has[id] = null;
                watcher.run();
                // in dev build, check and stop circular updates.
                if (process.env.NODE_ENV !== 'production' && has[id] != null) {
                  circular[id] = (circular[id] || 0) + 1;
                  if (circular[id] > MAX_UPDATE_COUNT) {
                    warn(
                      'You may have an infinite update loop ' + (
                        watcher.user
                          ? ("in watcher with expression \"" + (watcher.expression) + "\"")
                          : "in a component render function."
                      ),
                      watcher.vm
                    );
                    break
                  }
                }
              }

              // keep copies of post queues before resetting state
              var activatedQueue = activatedChildren.slice();
              var updatedQueue = queue$1.slice();

              resetSchedulerState();

              // call component updated and activated hooks
              callActivatedHooks(activatedQueue);
              callUpdatedHooks(updatedQueue);

              // devtool hook
              /* istanbul ignore if */
              if (devtools && config$1.devtools) {
                devtools.emit('flush');
              }
            }

            function callUpdatedHooks (queue) {
              var i = queue.length;
              while (i--) {
                var watcher = queue[i];
                var vm = watcher.vm;
                if (vm._watcher === watcher && vm._isMounted) {
                  callHook(vm, 'updated');
                }
              }
            }

            /**
             * Queue a kept-alive component that was activated during patch.
             * The queue will be processed after the entire tree has been patched.
             */
            function queueActivatedComponent (vm) {
              // setting _inactive to false here so that a render function can
              // rely on checking whether it's in an inactive tree (e.g. router-view)
              vm._inactive = false;
              activatedChildren.push(vm);
            }

            function callActivatedHooks (queue) {
              for (var i = 0; i < queue.length; i++) {
                queue[i]._inactive = true;
                activateChildComponent(queue[i], true /* true */);
              }
            }

            /**
             * Push a watcher into the watcher queue.
             * Jobs with duplicate IDs will be skipped unless it's
             * pushed when the queue is being flushed.
             */
            function queueWatcher (watcher) {
              var id = watcher.id;
              if (has[id] == null) {
                has[id] = true;
                if (!flushing) {
                  queue$1.push(watcher);
                } else {
                  // if already flushing, splice the watcher based on its id
                  // if already past its id, it will be run next immediately.
                  var i = queue$1.length - 1;
                  while (i > index && queue$1[i].id > watcher.id) {
                    i--;
                  }
                  queue$1.splice(i + 1, 0, watcher);
                }
                // queue the flush
                if (!waiting) {
                  waiting = true;
                  nextTick$1(flushSchedulerQueue);
                }
              }
            }

            /*  */

            var uid$1 = 0;

            /**
             * A watcher parses an expression, collects dependencies,
             * and fires callback when the expression value changes.
             * This is used for both the $watch() api and directives.
             */
            var Watcher = function Watcher (
              vm,
              expOrFn,
              cb,
              options,
              isRenderWatcher
            ) {
              this.vm = vm;
              if (isRenderWatcher) {
                vm._watcher = this;
              }
              vm._watchers.push(this);
              // options
              if (options) {
                this.deep = !!options.deep;
                this.user = !!options.user;
                this.lazy = !!options.lazy;
                this.sync = !!options.sync;
              } else {
                this.deep = this.user = this.lazy = this.sync = false;
              }
              this.cb = cb;
              this.id = ++uid$1; // uid for batching
              this.active = true;
              this.dirty = this.lazy; // for lazy watchers
              this.deps = [];
              this.newDeps = [];
              this.depIds = new _Set();
              this.newDepIds = new _Set();
              this.expression = process.env.NODE_ENV !== 'production'
                ? expOrFn.toString()
                : '';
              // parse expression for getter
              if (typeof expOrFn === 'function') {
                this.getter = expOrFn;
              } else {
                this.getter = parsePath(expOrFn);
                if (!this.getter) {
                  this.getter = function () {};
                  process.env.NODE_ENV !== 'production' && warn(
                    "Failed watching path: \"" + expOrFn + "\" " +
                    'Watcher only accepts simple dot-delimited paths. ' +
                    'For full control, use a function instead.',
                    vm
                  );
                }
              }
              this.value = this.lazy
                ? undefined
                : this.get();
            };

            /**
             * Evaluate the getter, and re-collect dependencies.
             */
            Watcher.prototype.get = function get () {
              pushTarget(this);
              var value;
              var vm = this.vm;
              try {
                value = this.getter.call(vm, vm);
              } catch (e) {
                if (this.user) {
                  handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
                } else {
                  throw e
                }
              } finally {
                // "touch" every property so they are all tracked as
                // dependencies for deep watching
                if (this.deep) {
                  traverse(value);
                }
                popTarget();
                this.cleanupDeps();
              }
              return value
            };

            /**
             * Add a dependency to this directive.
             */
            Watcher.prototype.addDep = function addDep (dep) {
              var id = dep.id;
              if (!this.newDepIds.has(id)) {
                this.newDepIds.add(id);
                this.newDeps.push(dep);
                if (!this.depIds.has(id)) {
                  dep.addSub(this);
                }
              }
            };

            /**
             * Clean up for dependency collection.
             */
            Watcher.prototype.cleanupDeps = function cleanupDeps () {
                var this$1 = this;

              var i = this.deps.length;
              while (i--) {
                var dep = this$1.deps[i];
                if (!this$1.newDepIds.has(dep.id)) {
                  dep.removeSub(this$1);
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
            };

            /**
             * Subscriber interface.
             * Will be called when a dependency changes.
             */
            Watcher.prototype.update = function update () {
              /* istanbul ignore else */
              if (this.lazy) {
                this.dirty = true;
              } else if (this.sync) {
                this.run();
              } else {
                queueWatcher(this);
              }
            };

            /**
             * Scheduler job interface.
             * Will be called by the scheduler.
             */
            Watcher.prototype.run = function run () {
              if (this.active) {
                var value = this.get();
                if (
                  value !== this.value ||
                  // Deep watchers and watchers on Object/Arrays should fire even
                  // when the value is the same, because the value may
                  // have mutated.
                  isObject(value) ||
                  this.deep
                ) {
                  // set new value
                  var oldValue = this.value;
                  this.value = value;
                  if (this.user) {
                    try {
                      this.cb.call(this.vm, value, oldValue);
                    } catch (e) {
                      handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
                    }
                  } else {
                    this.cb.call(this.vm, value, oldValue);
                  }
                }
              }
            };

            /**
             * Evaluate the value of the watcher.
             * This only gets called for lazy watchers.
             */
            Watcher.prototype.evaluate = function evaluate () {
              this.value = this.get();
              this.dirty = false;
            };

            /**
             * Depend on all deps collected by this watcher.
             */
            Watcher.prototype.depend = function depend () {
                var this$1 = this;

              var i = this.deps.length;
              while (i--) {
                this$1.deps[i].depend();
              }
            };

            /**
             * Remove self from all dependencies' subscriber list.
             */
            Watcher.prototype.teardown = function teardown () {
                var this$1 = this;

              if (this.active) {
                // remove self from vm's watcher list
                // this is a somewhat expensive operation so we skip it
                // if the vm is being destroyed.
                if (!this.vm._isBeingDestroyed) {
                  remove(this.vm._watchers, this);
                }
                var i = this.deps.length;
                while (i--) {
                  this$1.deps[i].removeSub(this$1);
                }
                this.active = false;
              }
            };

            /*  */

            var sharedPropertyDefinition = {
              enumerable: true,
              configurable: true,
              get: noop$1,
              set: noop$1
            };

            function proxy (target, sourceKey, key) {
              sharedPropertyDefinition.get = function proxyGetter () {
                return this[sourceKey][key]
              };
              sharedPropertyDefinition.set = function proxySetter (val) {
                this[sourceKey][key] = val;
              };
              Object.defineProperty(target, key, sharedPropertyDefinition);
            }

            function initState (vm) {
              vm._watchers = [];
              var opts = vm.$options;
              if (opts.props) { initProps(vm, opts.props); }
              if (opts.methods) { initMethods(vm, opts.methods); }
              if (opts.data) {
                initData(vm);
              } else {
                observe(vm._data = {}, true /* asRootData */);
              }
              if (opts.computed) { initComputed(vm, opts.computed); }
              if (opts.watch && opts.watch !== nativeWatch) {
                initWatch(vm, opts.watch);
              }
            }

            function initProps (vm, propsOptions) {
              var propsData = vm.$options.propsData || {};
              var props = vm._props = {};
              // cache prop keys so that future props updates can iterate using Array
              // instead of dynamic object key enumeration.
              var keys = vm.$options._propKeys = [];
              var isRoot = !vm.$parent;
              // root instance props should be converted
              if (!isRoot) {
                toggleObserving(false);
              }
              var loop = function ( key ) {
                keys.push(key);
                var value = validateProp(key, propsOptions, propsData, vm);
                /* istanbul ignore else */
                if (process.env.NODE_ENV !== 'production') {
                  var hyphenatedKey = hyphenate(key);
                  if (isReservedAttribute(hyphenatedKey) ||
                      config$1.isReservedAttr(hyphenatedKey)) {
                    warn(
                      ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
                      vm
                    );
                  }
                  defineReactive(props, key, value, function () {
                    if (vm.$parent && !isUpdatingChildComponent) {
                      warn(
                        "Avoid mutating a prop directly since the value will be " +
                        "overwritten whenever the parent component re-renders. " +
                        "Instead, use a data or computed property based on the prop's " +
                        "value. Prop being mutated: \"" + key + "\"",
                        vm
                      );
                    }
                  });
                } else {
                  defineReactive(props, key, value);
                }
                // static props are already proxied on the component's prototype
                // during Vue.extend(). We only need to proxy props defined at
                // instantiation here.
                if (!(key in vm)) {
                  proxy(vm, "_props", key);
                }
              };

              for (var key in propsOptions) { loop( key ); }
              toggleObserving(true);
            }

            function initData (vm) {
              var data = vm.$options.data;
              data = vm._data = typeof data === 'function'
                ? getData(data, vm)
                : data || {};
              if (!isPlainObject(data)) {
                data = {};
                process.env.NODE_ENV !== 'production' && warn(
                  'data functions should return an object:\n' +
                  'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
                  vm
                );
              }
              // proxy data on instance
              var keys = Object.keys(data);
              var props = vm.$options.props;
              var methods = vm.$options.methods;
              var i = keys.length;
              while (i--) {
                var key = keys[i];
                if (process.env.NODE_ENV !== 'production') {
                  if (methods && hasOwn(methods, key)) {
                    warn(
                      ("Method \"" + key + "\" has already been defined as a data property."),
                      vm
                    );
                  }
                }
                if (props && hasOwn(props, key)) {
                  process.env.NODE_ENV !== 'production' && warn(
                    "The data property \"" + key + "\" is already declared as a prop. " +
                    "Use prop default value instead.",
                    vm
                  );
                } else if (!isReserved(key)) {
                  proxy(vm, "_data", key);
                }
              }
              // observe data
              observe(data, true /* asRootData */);
            }

            function getData (data, vm) {
              // #7573 disable dep collection when invoking data getters
              pushTarget();
              try {
                return data.call(vm, vm)
              } catch (e) {
                handleError(e, vm, "data()");
                return {}
              } finally {
                popTarget();
              }
            }

            var computedWatcherOptions = { lazy: true };

            function initComputed (vm, computed) {
              // $flow-disable-line
              var watchers = vm._computedWatchers = Object.create(null);
              // computed properties are just getters during SSR
              var isSSR = isServerRendering();

              for (var key in computed) {
                var userDef = computed[key];
                var getter = typeof userDef === 'function' ? userDef : userDef.get;
                if (process.env.NODE_ENV !== 'production' && getter == null) {
                  warn(
                    ("Getter is missing for computed property \"" + key + "\"."),
                    vm
                  );
                }

                if (!isSSR) {
                  // create internal watcher for the computed property.
                  watchers[key] = new Watcher(
                    vm,
                    getter || noop$1,
                    noop$1,
                    computedWatcherOptions
                  );
                }

                // component-defined computed properties are already defined on the
                // component prototype. We only need to define computed properties defined
                // at instantiation here.
                if (!(key in vm)) {
                  defineComputed(vm, key, userDef);
                } else if (process.env.NODE_ENV !== 'production') {
                  if (key in vm.$data) {
                    warn(("The computed property \"" + key + "\" is already defined in data."), vm);
                  } else if (vm.$options.props && key in vm.$options.props) {
                    warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
                  }
                }
              }
            }

            function defineComputed (
              target,
              key,
              userDef
            ) {
              var shouldCache = !isServerRendering();
              if (typeof userDef === 'function') {
                sharedPropertyDefinition.get = shouldCache
                  ? createComputedGetter(key)
                  : userDef;
                sharedPropertyDefinition.set = noop$1;
              } else {
                sharedPropertyDefinition.get = userDef.get
                  ? shouldCache && userDef.cache !== false
                    ? createComputedGetter(key)
                    : userDef.get
                  : noop$1;
                sharedPropertyDefinition.set = userDef.set
                  ? userDef.set
                  : noop$1;
              }
              if (process.env.NODE_ENV !== 'production' &&
                  sharedPropertyDefinition.set === noop$1) {
                sharedPropertyDefinition.set = function () {
                  warn(
                    ("Computed property \"" + key + "\" was assigned to but it has no setter."),
                    this
                  );
                };
              }
              Object.defineProperty(target, key, sharedPropertyDefinition);
            }

            function createComputedGetter (key) {
              return function computedGetter () {
                var watcher = this._computedWatchers && this._computedWatchers[key];
                if (watcher) {
                  if (watcher.dirty) {
                    watcher.evaluate();
                  }
                  if (Dep.target) {
                    watcher.depend();
                  }
                  return watcher.value
                }
              }
            }

            function initMethods (vm, methods) {
              var props = vm.$options.props;
              for (var key in methods) {
                if (process.env.NODE_ENV !== 'production') {
                  if (methods[key] == null) {
                    warn(
                      "Method \"" + key + "\" has an undefined value in the component definition. " +
                      "Did you reference the function correctly?",
                      vm
                    );
                  }
                  if (props && hasOwn(props, key)) {
                    warn(
                      ("Method \"" + key + "\" has already been defined as a prop."),
                      vm
                    );
                  }
                  if ((key in vm) && isReserved(key)) {
                    warn(
                      "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
                      "Avoid defining component methods that start with _ or $."
                    );
                  }
                }
                vm[key] = methods[key] == null ? noop$1 : bind(methods[key], vm);
              }
            }

            function initWatch (vm, watch) {
              for (var key in watch) {
                var handler = watch[key];
                if (Array.isArray(handler)) {
                  for (var i = 0; i < handler.length; i++) {
                    createWatcher(vm, key, handler[i]);
                  }
                } else {
                  createWatcher(vm, key, handler);
                }
              }
            }

            function createWatcher (
              vm,
              expOrFn,
              handler,
              options
            ) {
              if (isPlainObject(handler)) {
                options = handler;
                handler = handler.handler;
              }
              if (typeof handler === 'string') {
                handler = vm[handler];
              }
              return vm.$watch(expOrFn, handler, options)
            }

            function stateMixin (Vue) {
              // flow somehow has problems with directly declared definition object
              // when using Object.defineProperty, so we have to procedurally build up
              // the object here.
              var dataDef = {};
              dataDef.get = function () { return this._data };
              var propsDef = {};
              propsDef.get = function () { return this._props };
              if (process.env.NODE_ENV !== 'production') {
                dataDef.set = function (newData) {
                  warn(
                    'Avoid replacing instance root $data. ' +
                    'Use nested data properties instead.',
                    this
                  );
                };
                propsDef.set = function () {
                  warn("$props is readonly.", this);
                };
              }
              Object.defineProperty(Vue.prototype, '$data', dataDef);
              Object.defineProperty(Vue.prototype, '$props', propsDef);

              Vue.prototype.$set = set;
              Vue.prototype.$delete = del;

              Vue.prototype.$watch = function (
                expOrFn,
                cb,
                options
              ) {
                var vm = this;
                if (isPlainObject(cb)) {
                  return createWatcher(vm, expOrFn, cb, options)
                }
                options = options || {};
                options.user = true;
                var watcher = new Watcher(vm, expOrFn, cb, options);
                if (options.immediate) {
                  cb.call(vm, watcher.value);
                }
                return function unwatchFn () {
                  watcher.teardown();
                }
              };
            }

            /*  */

            function initProvide (vm) {
              var provide = vm.$options.provide;
              if (provide) {
                vm._provided = typeof provide === 'function'
                  ? provide.call(vm)
                  : provide;
              }
            }

            function initInjections (vm) {
              var result = resolveInject(vm.$options.inject, vm);
              if (result) {
                toggleObserving(false);
                Object.keys(result).forEach(function (key) {
                  /* istanbul ignore else */
                  if (process.env.NODE_ENV !== 'production') {
                    defineReactive(vm, key, result[key], function () {
                      warn(
                        "Avoid mutating an injected value directly since the changes will be " +
                        "overwritten whenever the provided component re-renders. " +
                        "injection being mutated: \"" + key + "\"",
                        vm
                      );
                    });
                  } else {
                    defineReactive(vm, key, result[key]);
                  }
                });
                toggleObserving(true);
              }
            }

            function resolveInject (inject, vm) {
              if (inject) {
                // inject is :any because flow is not smart enough to figure out cached
                var result = Object.create(null);
                var keys = hasSymbol
                  ? Reflect.ownKeys(inject).filter(function (key) {
                    /* istanbul ignore next */
                    return Object.getOwnPropertyDescriptor(inject, key).enumerable
                  })
                  : Object.keys(inject);

                for (var i = 0; i < keys.length; i++) {
                  var key = keys[i];
                  var provideKey = inject[key].from;
                  var source = vm;
                  while (source) {
                    if (source._provided && hasOwn(source._provided, provideKey)) {
                      result[key] = source._provided[provideKey];
                      break
                    }
                    source = source.$parent;
                  }
                  if (!source) {
                    if ('default' in inject[key]) {
                      var provideDefault = inject[key].default;
                      result[key] = typeof provideDefault === 'function'
                        ? provideDefault.call(vm)
                        : provideDefault;
                    } else if (process.env.NODE_ENV !== 'production') {
                      warn(("Injection \"" + key + "\" not found"), vm);
                    }
                  }
                }
                return result
              }
            }

            /*  */

            /**
             * Runtime helper for rendering v-for lists.
             */
            function renderList (
              val,
              render
            ) {
              var ret, i, l, keys, key;
              if (Array.isArray(val) || typeof val === 'string') {
                ret = new Array(val.length);
                for (i = 0, l = val.length; i < l; i++) {
                  ret[i] = render(val[i], i);
                }
              } else if (typeof val === 'number') {
                ret = new Array(val);
                for (i = 0; i < val; i++) {
                  ret[i] = render(i + 1, i);
                }
              } else if (isObject(val)) {
                keys = Object.keys(val);
                ret = new Array(keys.length);
                for (i = 0, l = keys.length; i < l; i++) {
                  key = keys[i];
                  ret[i] = render(val[key], key, i);
                }
              }
              if (isDef(ret)) {
                (ret)._isVList = true;
              }
              return ret
            }

            /*  */

            /**
             * Runtime helper for rendering <slot>
             */
            function renderSlot (
              name,
              fallback,
              props,
              bindObject
            ) {
              var scopedSlotFn = this.$scopedSlots[name];
              var nodes;
              if (scopedSlotFn) { // scoped slot
                props = props || {};
                if (bindObject) {
                  if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
                    warn(
                      'slot v-bind without argument expects an Object',
                      this
                    );
                  }
                  props = extend(extend({}, bindObject), props);
                }
                nodes = scopedSlotFn(props) || fallback;
              } else {
                var slotNodes = this.$slots[name];
                // warn duplicate slot usage
                if (slotNodes) {
                  if (process.env.NODE_ENV !== 'production' && slotNodes._rendered) {
                    warn(
                      "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
                      "- this will likely cause render errors.",
                      this
                    );
                  }
                  slotNodes._rendered = true;
                }
                nodes = slotNodes || fallback;
              }

              var target = props && props.slot;
              if (target) {
                return this.$createElement('template', { slot: target }, nodes)
              } else {
                return nodes
              }
            }

            /*  */

            /**
             * Runtime helper for resolving filters
             */
            function resolveFilter (id) {
              return resolveAsset(this.$options, 'filters', id, true) || identity
            }

            /*  */

            function isKeyNotMatch (expect, actual) {
              if (Array.isArray(expect)) {
                return expect.indexOf(actual) === -1
              } else {
                return expect !== actual
              }
            }

            /**
             * Runtime helper for checking keyCodes from config.
             * exposed as Vue.prototype._k
             * passing in eventKeyName as last argument separately for backwards compat
             */
            function checkKeyCodes (
              eventKeyCode,
              key,
              builtInKeyCode,
              eventKeyName,
              builtInKeyName
            ) {
              var mappedKeyCode = config$1.keyCodes[key] || builtInKeyCode;
              if (builtInKeyName && eventKeyName && !config$1.keyCodes[key]) {
                return isKeyNotMatch(builtInKeyName, eventKeyName)
              } else if (mappedKeyCode) {
                return isKeyNotMatch(mappedKeyCode, eventKeyCode)
              } else if (eventKeyName) {
                return hyphenate(eventKeyName) !== key
              }
            }

            /*  */

            /**
             * Runtime helper for merging v-bind="object" into a VNode's data.
             */
            function bindObjectProps (
              data,
              tag,
              value,
              asProp,
              isSync
            ) {
              if (value) {
                if (!isObject(value)) {
                  process.env.NODE_ENV !== 'production' && warn(
                    'v-bind without argument expects an Object or Array value',
                    this
                  );
                } else {
                  if (Array.isArray(value)) {
                    value = toObject(value);
                  }
                  var hash;
                  var loop = function ( key ) {
                    if (
                      key === 'class' ||
                      key === 'style' ||
                      isReservedAttribute(key)
                    ) {
                      hash = data;
                    } else {
                      var type = data.attrs && data.attrs.type;
                      hash = asProp || config$1.mustUseProp(tag, type, key)
                        ? data.domProps || (data.domProps = {})
                        : data.attrs || (data.attrs = {});
                    }
                    if (!(key in hash)) {
                      hash[key] = value[key];

                      if (isSync) {
                        var on$$1 = data.on || (data.on = {});
                        on$$1[("update:" + key)] = function ($event) {
                          value[key] = $event;
                        };
                      }
                    }
                  };

                  for (var key in value) { loop( key ); }
                }
              }
              return data
            }

            /*  */

            /**
             * Runtime helper for rendering static trees.
             */
            function renderStatic (
              index,
              isInFor
            ) {
              var cached = this._staticTrees || (this._staticTrees = []);
              var tree = cached[index];
              // if has already-rendered static tree and not inside v-for,
              // we can reuse the same tree.
              if (tree && !isInFor) {
                return tree
              }
              // otherwise, render a fresh tree.
              tree = cached[index] = this.$options.staticRenderFns[index].call(
                this._renderProxy,
                null,
                this // for render fns generated for functional component templates
              );
              markStatic(tree, ("__static__" + index), false);
              return tree
            }

            /**
             * Runtime helper for v-once.
             * Effectively it means marking the node as static with a unique key.
             */
            function markOnce (
              tree,
              index,
              key
            ) {
              markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
              return tree
            }

            function markStatic (
              tree,
              key,
              isOnce
            ) {
              if (Array.isArray(tree)) {
                for (var i = 0; i < tree.length; i++) {
                  if (tree[i] && typeof tree[i] !== 'string') {
                    markStaticNode(tree[i], (key + "_" + i), isOnce);
                  }
                }
              } else {
                markStaticNode(tree, key, isOnce);
              }
            }

            function markStaticNode (node, key, isOnce) {
              node.isStatic = true;
              node.key = key;
              node.isOnce = isOnce;
            }

            /*  */

            function bindObjectListeners (data, value) {
              if (value) {
                if (!isPlainObject(value)) {
                  process.env.NODE_ENV !== 'production' && warn(
                    'v-on without argument expects an Object value',
                    this
                  );
                } else {
                  var on$$1 = data.on = data.on ? extend({}, data.on) : {};
                  for (var key in value) {
                    var existing = on$$1[key];
                    var ours = value[key];
                    on$$1[key] = existing ? [].concat(existing, ours) : ours;
                  }
                }
              }
              return data
            }

            /*  */

            function installRenderHelpers (target) {
              target._o = markOnce;
              target._n = toNumber;
              target._s = toString;
              target._l = renderList;
              target._t = renderSlot;
              target._q = looseEqual;
              target._i = looseIndexOf;
              target._m = renderStatic;
              target._f = resolveFilter;
              target._k = checkKeyCodes;
              target._b = bindObjectProps;
              target._v = createTextVNode;
              target._e = createEmptyVNode;
              target._u = resolveScopedSlots;
              target._g = bindObjectListeners;
            }

            /*  */

            function FunctionalRenderContext (
              data,
              props,
              children,
              parent,
              Ctor
            ) {
              var options = Ctor.options;
              // ensure the createElement function in functional components
              // gets a unique context - this is necessary for correct named slot check
              var contextVm;
              if (hasOwn(parent, '_uid')) {
                contextVm = Object.create(parent);
                // $flow-disable-line
                contextVm._original = parent;
              } else {
                // the context vm passed in is a functional context as well.
                // in this case we want to make sure we are able to get a hold to the
                // real context instance.
                contextVm = parent;
                // $flow-disable-line
                parent = parent._original;
              }
              var isCompiled = isTrue(options._compiled);
              var needNormalization = !isCompiled;

              this.data = data;
              this.props = props;
              this.children = children;
              this.parent = parent;
              this.listeners = data.on || emptyObject;
              this.injections = resolveInject(options.inject, parent);
              this.slots = function () { return resolveSlots(children, parent); };

              // support for compiled functional template
              if (isCompiled) {
                // exposing $options for renderStatic()
                this.$options = options;
                // pre-resolve slots for renderSlot()
                this.$slots = this.slots();
                this.$scopedSlots = data.scopedSlots || emptyObject;
              }

              if (options._scopeId) {
                this._c = function (a, b, c, d) {
                  var vnode = createElement(contextVm, a, b, c, d, needNormalization);
                  if (vnode && !Array.isArray(vnode)) {
                    vnode.fnScopeId = options._scopeId;
                    vnode.fnContext = parent;
                  }
                  return vnode
                };
              } else {
                this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
              }
            }

            installRenderHelpers(FunctionalRenderContext.prototype);

            function createFunctionalComponent (
              Ctor,
              propsData,
              data,
              contextVm,
              children
            ) {
              var options = Ctor.options;
              var props = {};
              var propOptions = options.props;
              if (isDef(propOptions)) {
                for (var key in propOptions) {
                  props[key] = validateProp(key, propOptions, propsData || emptyObject);
                }
              } else {
                if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
                if (isDef(data.props)) { mergeProps(props, data.props); }
              }

              var renderContext = new FunctionalRenderContext(
                data,
                props,
                children,
                contextVm,
                Ctor
              );

              var vnode = options.render.call(null, renderContext._c, renderContext);

              if (vnode instanceof VNode) {
                return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
              } else if (Array.isArray(vnode)) {
                var vnodes = normalizeChildren(vnode) || [];
                var res = new Array(vnodes.length);
                for (var i = 0; i < vnodes.length; i++) {
                  res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
                }
                return res
              }
            }

            function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
              // #7817 clone node before setting fnContext, otherwise if the node is reused
              // (e.g. it was from a cached normal slot) the fnContext causes named slots
              // that should not be matched to match.
              var clone = cloneVNode(vnode);
              clone.fnContext = contextVm;
              clone.fnOptions = options;
              if (data.slot) {
                (clone.data || (clone.data = {})).slot = data.slot;
              }
              return clone
            }

            function mergeProps (to, from) {
              for (var key in from) {
                to[camelize(key)] = from[key];
              }
            }

            /*  */




            // Register the component hook to weex native render engine.
            // The hook will be triggered by native, not javascript.


            // Updates the state of the component to weex native render engine.

            /*  */

            // https://github.com/Hanks10100/weex-native-directive/tree/master/component

            // listening on native callback

            /*  */

            /*  */

            // inline hooks to be invoked on component VNodes during patch
            var componentVNodeHooks = {
              init: function init (
                vnode,
                hydrating,
                parentElm,
                refElm
              ) {
                if (
                  vnode.componentInstance &&
                  !vnode.componentInstance._isDestroyed &&
                  vnode.data.keepAlive
                ) {
                  // kept-alive components, treat as a patch
                  var mountedNode = vnode; // work around flow
                  componentVNodeHooks.prepatch(mountedNode, mountedNode);
                } else {
                  var child = vnode.componentInstance = createComponentInstanceForVnode(
                    vnode,
                    activeInstance,
                    parentElm,
                    refElm
                  );
                  child.$mount(hydrating ? vnode.elm : undefined, hydrating);
                }
              },

              prepatch: function prepatch (oldVnode, vnode) {
                var options = vnode.componentOptions;
                var child = vnode.componentInstance = oldVnode.componentInstance;
                updateChildComponent(
                  child,
                  options.propsData, // updated props
                  options.listeners, // updated listeners
                  vnode, // new parent vnode
                  options.children // new children
                );
              },

              insert: function insert (vnode) {
                var context = vnode.context;
                var componentInstance = vnode.componentInstance;
                if (!componentInstance._isMounted) {
                  componentInstance._isMounted = true;
                  callHook(componentInstance, 'mounted');
                }
                if (vnode.data.keepAlive) {
                  if (context._isMounted) {
                    // vue-router#1212
                    // During updates, a kept-alive component's child components may
                    // change, so directly walking the tree here may call activated hooks
                    // on incorrect children. Instead we push them into a queue which will
                    // be processed after the whole patch process ended.
                    queueActivatedComponent(componentInstance);
                  } else {
                    activateChildComponent(componentInstance, true /* direct */);
                  }
                }
              },

              destroy: function destroy (vnode) {
                var componentInstance = vnode.componentInstance;
                if (!componentInstance._isDestroyed) {
                  if (!vnode.data.keepAlive) {
                    componentInstance.$destroy();
                  } else {
                    deactivateChildComponent(componentInstance, true /* direct */);
                  }
                }
              }
            };

            var hooksToMerge = Object.keys(componentVNodeHooks);

            function createComponent (
              Ctor,
              data,
              context,
              children,
              tag
            ) {
              if (isUndef(Ctor)) {
                return
              }

              var baseCtor = context.$options._base;

              // plain options object: turn it into a constructor
              if (isObject(Ctor)) {
                Ctor = baseCtor.extend(Ctor);
              }

              // if at this stage it's not a constructor or an async component factory,
              // reject.
              if (typeof Ctor !== 'function') {
                if (process.env.NODE_ENV !== 'production') {
                  warn(("Invalid Component definition: " + (String(Ctor))), context);
                }
                return
              }

              // async component
              var asyncFactory;
              if (isUndef(Ctor.cid)) {
                asyncFactory = Ctor;
                Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
                if (Ctor === undefined) {
                  // return a placeholder node for async component, which is rendered
                  // as a comment node but preserves all the raw information for the node.
                  // the information will be used for async server-rendering and hydration.
                  return createAsyncPlaceholder(
                    asyncFactory,
                    data,
                    context,
                    children,
                    tag
                  )
                }
              }

              data = data || {};

              // resolve constructor options in case global mixins are applied after
              // component constructor creation
              resolveConstructorOptions(Ctor);

              // transform component v-model data into props & events
              if (isDef(data.model)) {
                transformModel(Ctor.options, data);
              }

              // extract props
              var propsData = extractPropsFromVNodeData(data, Ctor, tag);

              // functional component
              if (isTrue(Ctor.options.functional)) {
                return createFunctionalComponent(Ctor, propsData, data, context, children)
              }

              // extract listeners, since these needs to be treated as
              // child component listeners instead of DOM listeners
              var listeners = data.on;
              // replace with listeners with .native modifier
              // so it gets processed during parent component patch.
              data.on = data.nativeOn;

              if (isTrue(Ctor.options.abstract)) {
                // abstract components do not keep anything
                // other than props & listeners & slot

                // work around flow
                var slot = data.slot;
                data = {};
                if (slot) {
                  data.slot = slot;
                }
              }

              // install component management hooks onto the placeholder node
              installComponentHooks(data);

              // return a placeholder vnode
              var name = Ctor.options.name || tag;
              var vnode = new VNode(
                ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
                data, undefined, undefined, undefined, context,
                { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
                asyncFactory
              );

              // Weex specific: invoke recycle-list optimized @render function for
              // extracting cell-slot template.
              // https://github.com/Hanks10100/weex-native-directive/tree/master/component
              /* istanbul ignore if */
              return vnode
            }

            function createComponentInstanceForVnode (
              vnode, // we know it's MountedComponentVNode but flow doesn't
              parent, // activeInstance in lifecycle state
              parentElm,
              refElm
            ) {
              var options = {
                _isComponent: true,
                parent: parent,
                _parentVnode: vnode,
                _parentElm: parentElm || null,
                _refElm: refElm || null
              };
              // check inline-template render functions
              var inlineTemplate = vnode.data.inlineTemplate;
              if (isDef(inlineTemplate)) {
                options.render = inlineTemplate.render;
                options.staticRenderFns = inlineTemplate.staticRenderFns;
              }
              return new vnode.componentOptions.Ctor(options)
            }

            function installComponentHooks (data) {
              var hooks = data.hook || (data.hook = {});
              for (var i = 0; i < hooksToMerge.length; i++) {
                var key = hooksToMerge[i];
                hooks[key] = componentVNodeHooks[key];
              }
            }

            // transform component v-model info (value and callback) into
            // prop and event handler respectively.
            function transformModel (options, data) {
              var prop = (options.model && options.model.prop) || 'value';
              var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
              var on$$1 = data.on || (data.on = {});
              if (isDef(on$$1[event])) {
                on$$1[event] = [data.model.callback].concat(on$$1[event]);
              } else {
                on$$1[event] = data.model.callback;
              }
            }

            /*  */

            var SIMPLE_NORMALIZE = 1;
            var ALWAYS_NORMALIZE = 2;

            // wrapper function for providing a more flexible interface
            // without getting yelled at by flow
            function createElement (
              context,
              tag,
              data,
              children,
              normalizationType,
              alwaysNormalize
            ) {
              if (Array.isArray(data) || isPrimitive(data)) {
                normalizationType = children;
                children = data;
                data = undefined;
              }
              if (isTrue(alwaysNormalize)) {
                normalizationType = ALWAYS_NORMALIZE;
              }
              return _createElement(context, tag, data, children, normalizationType)
            }

            function _createElement (
              context,
              tag,
              data,
              children,
              normalizationType
            ) {
              if (isDef(data) && isDef((data).__ob__)) {
                process.env.NODE_ENV !== 'production' && warn(
                  "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
                  'Always create fresh vnode data objects in each render!',
                  context
                );
                return createEmptyVNode()
              }
              // object syntax in v-bind
              if (isDef(data) && isDef(data.is)) {
                tag = data.is;
              }
              if (!tag) {
                // in case of component :is set to falsy value
                return createEmptyVNode()
              }
              // warn against non-primitive key
              if (process.env.NODE_ENV !== 'production' &&
                isDef(data) && isDef(data.key) && !isPrimitive(data.key)
              ) {
                {
                  warn(
                    'Avoid using non-primitive value as key, ' +
                    'use string/number value instead.',
                    context
                  );
                }
              }
              // support single function children as default scoped slot
              if (Array.isArray(children) &&
                typeof children[0] === 'function'
              ) {
                data = data || {};
                data.scopedSlots = { default: children[0] };
                children.length = 0;
              }
              if (normalizationType === ALWAYS_NORMALIZE) {
                children = normalizeChildren(children);
              } else if (normalizationType === SIMPLE_NORMALIZE) {
                children = simpleNormalizeChildren(children);
              }
              var vnode, ns;
              if (typeof tag === 'string') {
                var Ctor;
                ns = (context.$vnode && context.$vnode.ns) || config$1.getTagNamespace(tag);
                if (config$1.isReservedTag(tag)) {
                  // platform built-in elements
                  vnode = new VNode(
                    config$1.parsePlatformTagName(tag), data, children,
                    undefined, undefined, context
                  );
                } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
                  // component
                  vnode = createComponent(Ctor, data, context, children, tag);
                } else {
                  // unknown or unlisted namespaced elements
                  // check at runtime because it may get assigned a namespace when its
                  // parent normalizes children
                  vnode = new VNode(
                    tag, data, children,
                    undefined, undefined, context
                  );
                }
              } else {
                // direct component options / constructor
                vnode = createComponent(tag, data, context, children);
              }
              if (Array.isArray(vnode)) {
                return vnode
              } else if (isDef(vnode)) {
                if (isDef(ns)) { applyNS(vnode, ns); }
                if (isDef(data)) { registerDeepBindings(data); }
                return vnode
              } else {
                return createEmptyVNode()
              }
            }

            function applyNS (vnode, ns, force) {
              vnode.ns = ns;
              if (vnode.tag === 'foreignObject') {
                // use default namespace inside foreignObject
                ns = undefined;
                force = true;
              }
              if (isDef(vnode.children)) {
                for (var i = 0, l = vnode.children.length; i < l; i++) {
                  var child = vnode.children[i];
                  if (isDef(child.tag) && (
                    isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
                    applyNS(child, ns, force);
                  }
                }
              }
            }

            // ref #5318
            // necessary to ensure parent re-render when deep bindings like :style and
            // :class are used on slot nodes
            function registerDeepBindings (data) {
              if (isObject(data.style)) {
                traverse(data.style);
              }
              if (isObject(data.class)) {
                traverse(data.class);
              }
            }

            /*  */

            function initRender (vm) {
              vm._vnode = null; // the root of the child tree
              vm._staticTrees = null; // v-once cached trees
              var options = vm.$options;
              var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
              var renderContext = parentVnode && parentVnode.context;
              vm.$slots = resolveSlots(options._renderChildren, renderContext);
              vm.$scopedSlots = emptyObject;
              // bind the createElement fn to this instance
              // so that we get proper render context inside it.
              // args order: tag, data, children, normalizationType, alwaysNormalize
              // internal version is used by render functions compiled from templates
              vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
              // normalization is always applied for the public version, used in
              // user-written render functions.
              vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

              // $attrs & $listeners are exposed for easier HOC creation.
              // they need to be reactive so that HOCs using them are always updated
              var parentData = parentVnode && parentVnode.data;

              /* istanbul ignore else */
              if (process.env.NODE_ENV !== 'production') {
                defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
                  !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
                }, true);
                defineReactive(vm, '$listeners', options._parentListeners || emptyObject, function () {
                  !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
                }, true);
              } else {
                defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
                defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
              }
            }

            function renderMixin (Vue) {
              // install runtime convenience helpers
              installRenderHelpers(Vue.prototype);

              Vue.prototype.$nextTick = function (fn) {
                return nextTick$1(fn, this)
              };

              Vue.prototype._render = function () {
                var vm = this;
                var ref = vm.$options;
                var render = ref.render;
                var _parentVnode = ref._parentVnode;

                // reset _rendered flag on slots for duplicate slot check
                if (process.env.NODE_ENV !== 'production') {
                  for (var key in vm.$slots) {
                    // $flow-disable-line
                    vm.$slots[key]._rendered = false;
                  }
                }

                if (_parentVnode) {
                  vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
                }

                // set parent vnode. this allows render functions to have access
                // to the data on the placeholder node.
                vm.$vnode = _parentVnode;
                // render self
                var vnode;
                try {
                  vnode = render.call(vm._renderProxy, vm.$createElement);
                } catch (e) {
                  handleError(e, vm, "render");
                  // return error render result,
                  // or previous vnode to prevent render error causing blank component
                  /* istanbul ignore else */
                  if (process.env.NODE_ENV !== 'production') {
                    if (vm.$options.renderError) {
                      try {
                        vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
                      } catch (e) {
                        handleError(e, vm, "renderError");
                        vnode = vm._vnode;
                      }
                    } else {
                      vnode = vm._vnode;
                    }
                  } else {
                    vnode = vm._vnode;
                  }
                }
                // return empty vnode in case the render function errored out
                if (!(vnode instanceof VNode)) {
                  if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
                    warn(
                      'Multiple root nodes returned from render function. Render function ' +
                      'should return a single root node.',
                      vm
                    );
                  }
                  vnode = createEmptyVNode();
                }
                // set parent
                vnode.parent = _parentVnode;
                return vnode
              };
            }

            /*  */

            var uid$3 = 0;

            function initMixin (Vue) {
              Vue.prototype._init = function (options) {
                var vm = this;
                // a uid
                vm._uid = uid$3++;

                var startTag, endTag;
                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && config$1.performance && mark) {
                  startTag = "vue-perf-start:" + (vm._uid);
                  endTag = "vue-perf-end:" + (vm._uid);
                  mark(startTag);
                }

                // a flag to avoid this being observed
                vm._isVue = true;
                // merge options
                if (options && options._isComponent) {
                  // optimize internal component instantiation
                  // since dynamic options merging is pretty slow, and none of the
                  // internal component options needs special treatment.
                  initInternalComponent(vm, options);
                } else {
                  vm.$options = mergeOptions(
                    resolveConstructorOptions(vm.constructor),
                    options || {},
                    vm
                  );
                }
                /* istanbul ignore else */
                if (process.env.NODE_ENV !== 'production') {
                  initProxy(vm);
                } else {
                  vm._renderProxy = vm;
                }
                // expose real self
                vm._self = vm;
                initLifecycle(vm);
                initEvents(vm);
                initRender(vm);
                callHook(vm, 'beforeCreate');
                initInjections(vm); // resolve injections before data/props
                initState(vm);
                initProvide(vm); // resolve provide after data/props
                callHook(vm, 'created');

                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && config$1.performance && mark) {
                  vm._name = formatComponentName(vm, false);
                  mark(endTag);
                  measure(("vue " + (vm._name) + " init"), startTag, endTag);
                }

                if (vm.$options.el) {
                  vm.$mount(vm.$options.el);
                }
              };
            }

            function initInternalComponent (vm, options) {
              var opts = vm.$options = Object.create(vm.constructor.options);
              // doing this because it's faster than dynamic enumeration.
              var parentVnode = options._parentVnode;
              opts.parent = options.parent;
              opts._parentVnode = parentVnode;
              opts._parentElm = options._parentElm;
              opts._refElm = options._refElm;

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

            function resolveConstructorOptions (Ctor) {
              var options = Ctor.options;
              if (Ctor.super) {
                var superOptions = resolveConstructorOptions(Ctor.super);
                var cachedSuperOptions = Ctor.superOptions;
                if (superOptions !== cachedSuperOptions) {
                  // super option changed,
                  // need to resolve new options.
                  Ctor.superOptions = superOptions;
                  // check if there are any late-modified/attached options (#4976)
                  var modifiedOptions = resolveModifiedOptions(Ctor);
                  // update base extend options
                  if (modifiedOptions) {
                    extend(Ctor.extendOptions, modifiedOptions);
                  }
                  options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
                  if (options.name) {
                    options.components[options.name] = Ctor;
                  }
                }
              }
              return options
            }

            function resolveModifiedOptions (Ctor) {
              var modified;
              var latest = Ctor.options;
              var extended = Ctor.extendOptions;
              var sealed = Ctor.sealedOptions;
              for (var key in latest) {
                if (latest[key] !== sealed[key]) {
                  if (!modified) { modified = {}; }
                  modified[key] = dedupe(latest[key], extended[key], sealed[key]);
                }
              }
              return modified
            }

            function dedupe (latest, extended, sealed) {
              // compare latest and sealed to ensure lifecycle hooks won't be duplicated
              // between merges
              if (Array.isArray(latest)) {
                var res = [];
                sealed = Array.isArray(sealed) ? sealed : [sealed];
                extended = Array.isArray(extended) ? extended : [extended];
                for (var i = 0; i < latest.length; i++) {
                  // push original options and not sealed options to exclude duplicated options
                  if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
                    res.push(latest[i]);
                  }
                }
                return res
              } else {
                return latest
              }
            }

            function Vue (options) {
              if (process.env.NODE_ENV !== 'production' &&
                !(this instanceof Vue)
              ) {
                warn('Vue is a constructor and should be called with the `new` keyword');
              }
              this._init(options);
            }

            initMixin(Vue);
            stateMixin(Vue);
            eventsMixin(Vue);
            lifecycleMixin(Vue);
            renderMixin(Vue);

            /*  */

            function initUse (Vue) {
              Vue.use = function (plugin) {
                var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
                if (installedPlugins.indexOf(plugin) > -1) {
                  return this
                }

                // additional parameters
                var args = toArray(arguments, 1);
                args.unshift(this);
                if (typeof plugin.install === 'function') {
                  plugin.install.apply(plugin, args);
                } else if (typeof plugin === 'function') {
                  plugin.apply(null, args);
                }
                installedPlugins.push(plugin);
                return this
              };
            }

            /*  */

            function initMixin$1 (Vue) {
              Vue.mixin = function (mixin) {
                this.options = mergeOptions(this.options, mixin);
                return this
              };
            }

            /*  */

            function initExtend (Vue) {
              /**
               * Each instance constructor, including Vue, has a unique
               * cid. This enables us to create wrapped "child
               * constructors" for prototypal inheritance and cache them.
               */
              Vue.cid = 0;
              var cid = 1;

              /**
               * Class inheritance
               */
              Vue.extend = function (extendOptions) {
                extendOptions = extendOptions || {};
                var Super = this;
                var SuperId = Super.cid;
                var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
                if (cachedCtors[SuperId]) {
                  return cachedCtors[SuperId]
                }

                var name = extendOptions.name || Super.options.name;
                if (process.env.NODE_ENV !== 'production' && name) {
                  validateComponentName(name);
                }

                var Sub = function VueComponent (options) {
                  this._init(options);
                };
                Sub.prototype = Object.create(Super.prototype);
                Sub.prototype.constructor = Sub;
                Sub.cid = cid++;
                Sub.options = mergeOptions(
                  Super.options,
                  extendOptions
                );
                Sub['super'] = Super;

                // For props and computed properties, we define the proxy getters on
                // the Vue instances at extension time, on the extended prototype. This
                // avoids Object.defineProperty calls for each instance created.
                if (Sub.options.props) {
                  initProps$1(Sub);
                }
                if (Sub.options.computed) {
                  initComputed$1(Sub);
                }

                // allow further extension/mixin/plugin usage
                Sub.extend = Super.extend;
                Sub.mixin = Super.mixin;
                Sub.use = Super.use;

                // create asset registers, so extended classes
                // can have their private assets too.
                ASSET_TYPES.forEach(function (type) {
                  Sub[type] = Super[type];
                });
                // enable recursive self-lookup
                if (name) {
                  Sub.options.components[name] = Sub;
                }

                // keep a reference to the super options at extension time.
                // later at instantiation we can check if Super's options have
                // been updated.
                Sub.superOptions = Super.options;
                Sub.extendOptions = extendOptions;
                Sub.sealedOptions = extend({}, Sub.options);

                // cache constructor
                cachedCtors[SuperId] = Sub;
                return Sub
              };
            }

            function initProps$1 (Comp) {
              var props = Comp.options.props;
              for (var key in props) {
                proxy(Comp.prototype, "_props", key);
              }
            }

            function initComputed$1 (Comp) {
              var computed = Comp.options.computed;
              for (var key in computed) {
                defineComputed(Comp.prototype, key, computed[key]);
              }
            }

            /*  */

            function initAssetRegisters (Vue) {
              /**
               * Create asset registration methods.
               */
              ASSET_TYPES.forEach(function (type) {
                Vue[type] = function (
                  id,
                  definition
                ) {
                  if (!definition) {
                    return this.options[type + 's'][id]
                  } else {
                    /* istanbul ignore if */
                    if (process.env.NODE_ENV !== 'production' && type === 'component') {
                      validateComponentName(id);
                    }
                    if (type === 'component' && isPlainObject(definition)) {
                      definition.name = definition.name || id;
                      definition = this.options._base.extend(definition);
                    }
                    if (type === 'directive' && typeof definition === 'function') {
                      definition = { bind: definition, update: definition };
                    }
                    this.options[type + 's'][id] = definition;
                    return definition
                  }
                };
              });
            }

            /*  */

            function getComponentName (opts) {
              return opts && (opts.Ctor.options.name || opts.tag)
            }

            function matches (pattern, name) {
              if (Array.isArray(pattern)) {
                return pattern.indexOf(name) > -1
              } else if (typeof pattern === 'string') {
                return pattern.split(',').indexOf(name) > -1
              } else if (isRegExp(pattern)) {
                return pattern.test(name)
              }
              /* istanbul ignore next */
              return false
            }

            function pruneCache (keepAliveInstance, filter) {
              var cache = keepAliveInstance.cache;
              var keys = keepAliveInstance.keys;
              var _vnode = keepAliveInstance._vnode;
              for (var key in cache) {
                var cachedNode = cache[key];
                if (cachedNode) {
                  var name = getComponentName(cachedNode.componentOptions);
                  if (name && !filter(name)) {
                    pruneCacheEntry(cache, key, keys, _vnode);
                  }
                }
              }
            }

            function pruneCacheEntry (
              cache,
              key,
              keys,
              current
            ) {
              var cached$$1 = cache[key];
              if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
                cached$$1.componentInstance.$destroy();
              }
              cache[key] = null;
              remove(keys, key);
            }

            var patternTypes = [String, RegExp, Array];

            var KeepAlive = {
              name: 'keep-alive',
              abstract: true,

              props: {
                include: patternTypes,
                exclude: patternTypes,
                max: [String, Number]
              },

              created: function created () {
                this.cache = Object.create(null);
                this.keys = [];
              },

              destroyed: function destroyed () {
                var this$1 = this;

                for (var key in this$1.cache) {
                  pruneCacheEntry(this$1.cache, key, this$1.keys);
                }
              },

              mounted: function mounted () {
                var this$1 = this;

                this.$watch('include', function (val) {
                  pruneCache(this$1, function (name) { return matches(val, name); });
                });
                this.$watch('exclude', function (val) {
                  pruneCache(this$1, function (name) { return !matches(val, name); });
                });
              },

              render: function render () {
                var slot = this.$slots.default;
                var vnode = getFirstComponentChild(slot);
                var componentOptions = vnode && vnode.componentOptions;
                if (componentOptions) {
                  // check pattern
                  var name = getComponentName(componentOptions);
                  var ref = this;
                  var include = ref.include;
                  var exclude = ref.exclude;
                  if (
                    // not included
                    (include && (!name || !matches(include, name))) ||
                    // excluded
                    (exclude && name && matches(exclude, name))
                  ) {
                    return vnode
                  }

                  var ref$1 = this;
                  var cache = ref$1.cache;
                  var keys = ref$1.keys;
                  var key = vnode.key == null
                    // same constructor may get registered as different local components
                    // so cid alone is not enough (#3269)
                    ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
                    : vnode.key;
                  if (cache[key]) {
                    vnode.componentInstance = cache[key].componentInstance;
                    // make current key freshest
                    remove(keys, key);
                    keys.push(key);
                  } else {
                    cache[key] = vnode;
                    keys.push(key);
                    // prune oldest entry
                    if (this.max && keys.length > parseInt(this.max)) {
                      pruneCacheEntry(cache, keys[0], keys, this._vnode);
                    }
                  }

                  vnode.data.keepAlive = true;
                }
                return vnode || (slot && slot[0])
              }
            };

            var builtInComponents = {
              KeepAlive: KeepAlive
            };

            /*  */

            function initGlobalAPI (Vue) {
              // config
              var configDef = {};
              configDef.get = function () { return config$1; };
              if (process.env.NODE_ENV !== 'production') {
                configDef.set = function () {
                  warn(
                    'Do not replace the Vue.config object, set individual fields instead.'
                  );
                };
              }
              Object.defineProperty(Vue, 'config', configDef);

              // exposed util methods.
              // NOTE: these are not considered part of the public API - avoid relying on
              // them unless you are aware of the risk.
              Vue.util = {
                warn: warn,
                extend: extend,
                mergeOptions: mergeOptions,
                defineReactive: defineReactive
              };

              Vue.set = set;
              Vue.delete = del;
              Vue.nextTick = nextTick$1;

              Vue.options = Object.create(null);
              ASSET_TYPES.forEach(function (type) {
                Vue.options[type + 's'] = Object.create(null);
              });

              // this is used to identify the "base" constructor to extend all plain-object
              // components with in Weex's multi-instance scenarios.
              Vue.options._base = Vue;

              extend(Vue.options.components, builtInComponents);

              initUse(Vue);
              initMixin$1(Vue);
              initExtend(Vue);
              initAssetRegisters(Vue);
            }

            initGlobalAPI(Vue);

            Object.defineProperty(Vue.prototype, '$isServer', {
              get: isServerRendering
            });

            Object.defineProperty(Vue.prototype, '$ssrContext', {
              get: function get () {
                /* istanbul ignore next */
                return this.$vnode && this.$vnode.ssrContext
              }
            });

            // expose FunctionalRenderContext for ssr runtime helper installation
            Object.defineProperty(Vue, 'FunctionalRenderContext', {
              value: FunctionalRenderContext
            });

            Vue.version = '2.5.16';

            /*  */

            // these are reserved for web because they are directly compiled away
            // during template compilation
            var isReservedAttr = makeMap('style,class');

            // attributes that should be using props for binding
            var acceptValue = makeMap('input,textarea,option,select,progress');
            var mustUseProp = function (tag, type, attr) {
              return (
                (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
                (attr === 'selected' && tag === 'option') ||
                (attr === 'checked' && tag === 'input') ||
                (attr === 'muted' && tag === 'video')
              )
            };

            var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

            var isBooleanAttr = makeMap(
              'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
              'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
              'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
              'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
              'required,reversed,scoped,seamless,selected,sortable,translate,' +
              'truespeed,typemustmatch,visible'
            );

            var xlinkNS = 'http://www.w3.org/1999/xlink';

            var isXlink = function (name) {
              return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
            };

            var getXlinkProp = function (name) {
              return isXlink(name) ? name.slice(6, name.length) : ''
            };

            var isFalsyAttrValue = function (val) {
              return val == null || val === false
            };

            /*  */

            function genClassForVnode (vnode) {
              var data = vnode.data;
              var parentNode = vnode;
              var childNode = vnode;
              while (isDef(childNode.componentInstance)) {
                childNode = childNode.componentInstance._vnode;
                if (childNode && childNode.data) {
                  data = mergeClassData(childNode.data, data);
                }
              }
              while (isDef(parentNode = parentNode.parent)) {
                if (parentNode && parentNode.data) {
                  data = mergeClassData(data, parentNode.data);
                }
              }
              return renderClass(data.staticClass, data.class)
            }

            function mergeClassData (child, parent) {
              return {
                staticClass: concat(child.staticClass, parent.staticClass),
                class: isDef(child.class)
                  ? [child.class, parent.class]
                  : parent.class
              }
            }

            function renderClass (
              staticClass,
              dynamicClass
            ) {
              if (isDef(staticClass) || isDef(dynamicClass)) {
                return concat(staticClass, stringifyClass(dynamicClass))
              }
              /* istanbul ignore next */
              return ''
            }

            function concat (a, b) {
              return a ? b ? (a + ' ' + b) : a : (b || '')
            }

            function stringifyClass (value) {
              if (Array.isArray(value)) {
                return stringifyArray(value)
              }
              if (isObject(value)) {
                return stringifyObject(value)
              }
              if (typeof value === 'string') {
                return value
              }
              /* istanbul ignore next */
              return ''
            }

            function stringifyArray (value) {
              var res = '';
              var stringified;
              for (var i = 0, l = value.length; i < l; i++) {
                if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
                  if (res) { res += ' '; }
                  res += stringified;
                }
              }
              return res
            }

            function stringifyObject (value) {
              var res = '';
              for (var key in value) {
                if (value[key]) {
                  if (res) { res += ' '; }
                  res += key;
                }
              }
              return res
            }

            /*  */

            var namespaceMap = {
              svg: 'http://www.w3.org/2000/svg',
              math: 'http://www.w3.org/1998/Math/MathML'
            };

            var isHTMLTag = makeMap(
              'html,body,base,head,link,meta,style,title,' +
              'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
              'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
              'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
              's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
              'embed,object,param,source,canvas,script,noscript,del,ins,' +
              'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
              'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
              'output,progress,select,textarea,' +
              'details,dialog,menu,menuitem,summary,' +
              'content,element,shadow,template,blockquote,iframe,tfoot'
            );

            // this map is intentionally selective, only covering SVG elements that may
            // contain child elements.
            var isSVG = makeMap(
              'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
              'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
              'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
              true
            );



            var isReservedTag = function (tag) {
              return isHTMLTag(tag) || isSVG(tag)
            };

            function getTagNamespace (tag) {
              if (isSVG(tag)) {
                return 'svg'
              }
              // basic support for MathML
              // note it doesn't support other MathML elements being component roots
              if (tag === 'math') {
                return 'math'
              }
            }

            var unknownElementCache = Object.create(null);
            function isUnknownElement (tag) {
              /* istanbul ignore if */
              if (!inBrowser) {
                return true
              }
              if (isReservedTag(tag)) {
                return false
              }
              tag = tag.toLowerCase();
              /* istanbul ignore if */
              if (unknownElementCache[tag] != null) {
                return unknownElementCache[tag]
              }
              var el = document.createElement(tag);
              if (tag.indexOf('-') > -1) {
                // http://stackoverflow.com/a/28210364/1070244
                return (unknownElementCache[tag] = (
                  el.constructor === window.HTMLUnknownElement ||
                  el.constructor === window.HTMLElement
                ))
              } else {
                return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
              }
            }

            var isTextInputType = makeMap('text,number,password,search,email,tel,url');

            /*  */

            /**
             * Query an element selector if it's not an element already.
             */
            function query (el) {
              if (typeof el === 'string') {
                var selected = document.querySelector(el);
                if (!selected) {
                  process.env.NODE_ENV !== 'production' && warn(
                    'Cannot find element: ' + el
                  );
                  return document.createElement('div')
                }
                return selected
              } else {
                return el
              }
            }

            /*  */

            function createElement$1 (tagName, vnode) {
              var elm = document.createElement(tagName);
              if (tagName !== 'select') {
                return elm
              }
              // false or null will remove the attribute but undefined will not
              if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
                elm.setAttribute('multiple', 'multiple');
              }
              return elm
            }

            function createElementNS (namespace, tagName) {
              return document.createElementNS(namespaceMap[namespace], tagName)
            }

            function createTextNode (text) {
              return document.createTextNode(text)
            }

            function createComment (text) {
              return document.createComment(text)
            }

            function insertBefore (parentNode, newNode, referenceNode) {
              parentNode.insertBefore(newNode, referenceNode);
            }

            function removeChild (node, child) {
              node.removeChild(child);
            }

            function appendChild (node, child) {
              node.appendChild(child);
            }

            function parentNode (node) {
              return node.parentNode
            }

            function nextSibling (node) {
              return node.nextSibling
            }

            function tagName (node) {
              return node.tagName
            }

            function setTextContent (node, text) {
              node.textContent = text;
            }

            function setStyleScope (node, scopeId) {
              node.setAttribute(scopeId, '');
            }


            var nodeOps = Object.freeze({
            	createElement: createElement$1,
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

            /*  */

            var ref = {
              create: function create (_, vnode) {
                registerRef(vnode);
              },
              update: function update (oldVnode, vnode) {
                if (oldVnode.data.ref !== vnode.data.ref) {
                  registerRef(oldVnode, true);
                  registerRef(vnode);
                }
              },
              destroy: function destroy (vnode) {
                registerRef(vnode, true);
              }
            };

            function registerRef (vnode, isRemoval) {
              var key = vnode.data.ref;
              if (!isDef(key)) { return }

              var vm = vnode.context;
              var ref = vnode.componentInstance || vnode.elm;
              var refs = vm.$refs;
              if (isRemoval) {
                if (Array.isArray(refs[key])) {
                  remove(refs[key], ref);
                } else if (refs[key] === ref) {
                  refs[key] = undefined;
                }
              } else {
                if (vnode.data.refInFor) {
                  if (!Array.isArray(refs[key])) {
                    refs[key] = [ref];
                  } else if (refs[key].indexOf(ref) < 0) {
                    // $flow-disable-line
                    refs[key].push(ref);
                  }
                } else {
                  refs[key] = ref;
                }
              }
            }

            /**
             * Virtual DOM patching algorithm based on Snabbdom by
             * Simon Friis Vindum (@paldepind)
             * Licensed under the MIT License
             * https://github.com/paldepind/snabbdom/blob/master/LICENSE
             *
             * modified by Evan You (@yyx990803)
             *
             * Not type-checking this because this file is perf-critical and the cost
             * of making flow understand it is not worth it.
             */

            var emptyNode = new VNode('', {}, []);

            var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

            function sameVnode (a, b) {
              return (
                a.key === b.key && (
                  (
                    a.tag === b.tag &&
                    a.isComment === b.isComment &&
                    isDef(a.data) === isDef(b.data) &&
                    sameInputType(a, b)
                  ) || (
                    isTrue(a.isAsyncPlaceholder) &&
                    a.asyncFactory === b.asyncFactory &&
                    isUndef(b.asyncFactory.error)
                  )
                )
              )
            }

            function sameInputType (a, b) {
              if (a.tag !== 'input') { return true }
              var i;
              var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
              var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
              return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
            }

            function createKeyToOldIdx (children, beginIdx, endIdx) {
              var i, key;
              var map = {};
              for (i = beginIdx; i <= endIdx; ++i) {
                key = children[i].key;
                if (isDef(key)) { map[key] = i; }
              }
              return map
            }

            function createPatchFunction (backend) {
              var i, j;
              var cbs = {};

              var modules = backend.modules;
              var nodeOps = backend.nodeOps;

              for (i = 0; i < hooks.length; ++i) {
                cbs[hooks[i]] = [];
                for (j = 0; j < modules.length; ++j) {
                  if (isDef(modules[j][hooks[i]])) {
                    cbs[hooks[i]].push(modules[j][hooks[i]]);
                  }
                }
              }

              function emptyNodeAt (elm) {
                return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
              }

              function createRmCb (childElm, listeners) {
                function remove () {
                  if (--remove.listeners === 0) {
                    removeNode(childElm);
                  }
                }
                remove.listeners = listeners;
                return remove
              }

              function removeNode (el) {
                var parent = nodeOps.parentNode(el);
                // element may have already been removed due to v-html / v-text
                if (isDef(parent)) {
                  nodeOps.removeChild(parent, el);
                }
              }

              function isUnknownElement$$1 (vnode, inVPre) {
                return (
                  !inVPre &&
                  !vnode.ns &&
                  !(
                    config$1.ignoredElements.length &&
                    config$1.ignoredElements.some(function (ignore) {
                      return isRegExp(ignore)
                        ? ignore.test(vnode.tag)
                        : ignore === vnode.tag
                    })
                  ) &&
                  config$1.isUnknownElement(vnode.tag)
                )
              }

              var creatingElmInVPre = 0;

              function createElm (
                vnode,
                insertedVnodeQueue,
                parentElm,
                refElm,
                nested,
                ownerArray,
                index
              ) {
                if (isDef(vnode.elm) && isDef(ownerArray)) {
                  // This vnode was used in a previous render!
                  // now it's used as a new node, overwriting its elm would cause
                  // potential patch errors down the road when it's used as an insertion
                  // reference node. Instead, we clone the node on-demand before creating
                  // associated DOM element for it.
                  vnode = ownerArray[index] = cloneVNode(vnode);
                }

                vnode.isRootInsert = !nested; // for transition enter check
                if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
                  return
                }

                var data = vnode.data;
                var children = vnode.children;
                var tag = vnode.tag;
                if (isDef(tag)) {
                  if (process.env.NODE_ENV !== 'production') {
                    if (data && data.pre) {
                      creatingElmInVPre++;
                    }
                    if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
                      warn(
                        'Unknown custom element: <' + tag + '> - did you ' +
                        'register the component correctly? For recursive components, ' +
                        'make sure to provide the "name" option.',
                        vnode.context
                      );
                    }
                  }

                  vnode.elm = vnode.ns
                    ? nodeOps.createElementNS(vnode.ns, tag)
                    : nodeOps.createElement(tag, vnode);
                  setScope(vnode);

                  /* istanbul ignore if */
                  {
                    createChildren(vnode, children, insertedVnodeQueue);
                    if (isDef(data)) {
                      invokeCreateHooks(vnode, insertedVnodeQueue);
                    }
                    insert(parentElm, vnode.elm, refElm);
                  }

                  if (process.env.NODE_ENV !== 'production' && data && data.pre) {
                    creatingElmInVPre--;
                  }
                } else if (isTrue(vnode.isComment)) {
                  vnode.elm = nodeOps.createComment(vnode.text);
                  insert(parentElm, vnode.elm, refElm);
                } else {
                  vnode.elm = nodeOps.createTextNode(vnode.text);
                  insert(parentElm, vnode.elm, refElm);
                }
              }

              function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
                var i = vnode.data;
                if (isDef(i)) {
                  var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
                  if (isDef(i = i.hook) && isDef(i = i.init)) {
                    i(vnode, false /* hydrating */, parentElm, refElm);
                  }
                  // after calling the init hook, if the vnode is a child component
                  // it should've created a child instance and mounted it. the child
                  // component also has set the placeholder vnode's elm.
                  // in that case we can just return the element and be done.
                  if (isDef(vnode.componentInstance)) {
                    initComponent(vnode, insertedVnodeQueue);
                    if (isTrue(isReactivated)) {
                      reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
                    }
                    return true
                  }
                }
              }

              function initComponent (vnode, insertedVnodeQueue) {
                if (isDef(vnode.data.pendingInsert)) {
                  insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
                  vnode.data.pendingInsert = null;
                }
                vnode.elm = vnode.componentInstance.$el;
                if (isPatchable(vnode)) {
                  invokeCreateHooks(vnode, insertedVnodeQueue);
                  setScope(vnode);
                } else {
                  // empty component root.
                  // skip all element-related modules except for ref (#3455)
                  registerRef(vnode);
                  // make sure to invoke the insert hook
                  insertedVnodeQueue.push(vnode);
                }
              }

              function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
                var i;
                // hack for #4339: a reactivated component with inner transition
                // does not trigger because the inner node's created hooks are not called
                // again. It's not ideal to involve module-specific logic in here but
                // there doesn't seem to be a better way to do it.
                var innerNode = vnode;
                while (innerNode.componentInstance) {
                  innerNode = innerNode.componentInstance._vnode;
                  if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
                    for (i = 0; i < cbs.activate.length; ++i) {
                      cbs.activate[i](emptyNode, innerNode);
                    }
                    insertedVnodeQueue.push(innerNode);
                    break
                  }
                }
                // unlike a newly created component,
                // a reactivated keep-alive component doesn't insert itself
                insert(parentElm, vnode.elm, refElm);
              }

              function insert (parent, elm, ref$$1) {
                if (isDef(parent)) {
                  if (isDef(ref$$1)) {
                    if (ref$$1.parentNode === parent) {
                      nodeOps.insertBefore(parent, elm, ref$$1);
                    }
                  } else {
                    nodeOps.appendChild(parent, elm);
                  }
                }
              }

              function createChildren (vnode, children, insertedVnodeQueue) {
                if (Array.isArray(children)) {
                  if (process.env.NODE_ENV !== 'production') {
                    checkDuplicateKeys(children);
                  }
                  for (var i = 0; i < children.length; ++i) {
                    createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
                  }
                } else if (isPrimitive(vnode.text)) {
                  nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
                }
              }

              function isPatchable (vnode) {
                while (vnode.componentInstance) {
                  vnode = vnode.componentInstance._vnode;
                }
                return isDef(vnode.tag)
              }

              function invokeCreateHooks (vnode, insertedVnodeQueue) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, vnode);
                }
                i = vnode.data.hook; // Reuse variable
                if (isDef(i)) {
                  if (isDef(i.create)) { i.create(emptyNode, vnode); }
                  if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
                }
              }

              // set scope id attribute for scoped CSS.
              // this is implemented as a special case to avoid the overhead
              // of going through the normal attribute patching process.
              function setScope (vnode) {
                var i;
                if (isDef(i = vnode.fnScopeId)) {
                  nodeOps.setStyleScope(vnode.elm, i);
                } else {
                  var ancestor = vnode;
                  while (ancestor) {
                    if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
                      nodeOps.setStyleScope(vnode.elm, i);
                    }
                    ancestor = ancestor.parent;
                  }
                }
                // for slot content they should also get the scopeId from the host instance.
                if (isDef(i = activeInstance) &&
                  i !== vnode.context &&
                  i !== vnode.fnContext &&
                  isDef(i = i.$options._scopeId)
                ) {
                  nodeOps.setStyleScope(vnode.elm, i);
                }
              }

              function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
                for (; startIdx <= endIdx; ++startIdx) {
                  createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
                }
              }

              function invokeDestroyHook (vnode) {
                var i, j;
                var data = vnode.data;
                if (isDef(data)) {
                  if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
                  for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
                }
                if (isDef(i = vnode.children)) {
                  for (j = 0; j < vnode.children.length; ++j) {
                    invokeDestroyHook(vnode.children[j]);
                  }
                }
              }

              function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
                for (; startIdx <= endIdx; ++startIdx) {
                  var ch = vnodes[startIdx];
                  if (isDef(ch)) {
                    if (isDef(ch.tag)) {
                      removeAndInvokeRemoveHook(ch);
                      invokeDestroyHook(ch);
                    } else { // Text node
                      removeNode(ch.elm);
                    }
                  }
                }
              }

              function removeAndInvokeRemoveHook (vnode, rm) {
                if (isDef(rm) || isDef(vnode.data)) {
                  var i;
                  var listeners = cbs.remove.length + 1;
                  if (isDef(rm)) {
                    // we have a recursively passed down rm callback
                    // increase the listeners count
                    rm.listeners += listeners;
                  } else {
                    // directly removing
                    rm = createRmCb(vnode.elm, listeners);
                  }
                  // recursively invoke hooks on child component root node
                  if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
                    removeAndInvokeRemoveHook(i, rm);
                  }
                  for (i = 0; i < cbs.remove.length; ++i) {
                    cbs.remove[i](vnode, rm);
                  }
                  if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
                    i(vnode, rm);
                  } else {
                    rm();
                  }
                } else {
                  removeNode(vnode.elm);
                }
              }

              function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
                var oldStartIdx = 0;
                var newStartIdx = 0;
                var oldEndIdx = oldCh.length - 1;
                var oldStartVnode = oldCh[0];
                var oldEndVnode = oldCh[oldEndIdx];
                var newEndIdx = newCh.length - 1;
                var newStartVnode = newCh[0];
                var newEndVnode = newCh[newEndIdx];
                var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

                // removeOnly is a special flag used only by <transition-group>
                // to ensure removed elements stay in correct relative positions
                // during leaving transitions
                var canMove = !removeOnly;

                if (process.env.NODE_ENV !== 'production') {
                  checkDuplicateKeys(newCh);
                }

                while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                  if (isUndef(oldStartVnode)) {
                    oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
                  } else if (isUndef(oldEndVnode)) {
                    oldEndVnode = oldCh[--oldEndIdx];
                  } else if (sameVnode(oldStartVnode, newStartVnode)) {
                    patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                    oldStartVnode = oldCh[++oldStartIdx];
                    newStartVnode = newCh[++newStartIdx];
                  } else if (sameVnode(oldEndVnode, newEndVnode)) {
                    patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newEndVnode = newCh[--newEndIdx];
                  } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
                    patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
                    oldStartVnode = oldCh[++oldStartIdx];
                    newEndVnode = newCh[--newEndIdx];
                  } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
                    patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                    canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                    oldEndVnode = oldCh[--oldEndIdx];
                    newStartVnode = newCh[++newStartIdx];
                  } else {
                    if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
                    idxInOld = isDef(newStartVnode.key)
                      ? oldKeyToIdx[newStartVnode.key]
                      : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
                    if (isUndef(idxInOld)) { // New element
                      createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
                    } else {
                      vnodeToMove = oldCh[idxInOld];
                      if (sameVnode(vnodeToMove, newStartVnode)) {
                        patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
                      } else {
                        // same key but different element. treat as new element
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
                  removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
                }
              }

              function checkDuplicateKeys (children) {
                var seenKeys = {};
                for (var i = 0; i < children.length; i++) {
                  var vnode = children[i];
                  var key = vnode.key;
                  if (isDef(key)) {
                    if (seenKeys[key]) {
                      warn(
                        ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
                        vnode.context
                      );
                    } else {
                      seenKeys[key] = true;
                    }
                  }
                }
              }

              function findIdxInOld (node, oldCh, start, end) {
                for (var i = start; i < end; i++) {
                  var c = oldCh[i];
                  if (isDef(c) && sameVnode(node, c)) { return i }
                }
              }

              function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
                if (oldVnode === vnode) {
                  return
                }

                var elm = vnode.elm = oldVnode.elm;

                if (isTrue(oldVnode.isAsyncPlaceholder)) {
                  if (isDef(vnode.asyncFactory.resolved)) {
                    hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
                  } else {
                    vnode.isAsyncPlaceholder = true;
                  }
                  return
                }

                // reuse element for static trees.
                // note we only do this if the vnode is cloned -
                // if the new node is not cloned it means the render functions have been
                // reset by the hot-reload-api and we need to do a proper re-render.
                if (isTrue(vnode.isStatic) &&
                  isTrue(oldVnode.isStatic) &&
                  vnode.key === oldVnode.key &&
                  (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
                ) {
                  vnode.componentInstance = oldVnode.componentInstance;
                  return
                }

                var i;
                var data = vnode.data;
                if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
                  i(oldVnode, vnode);
                }

                var oldCh = oldVnode.children;
                var ch = vnode.children;
                if (isDef(data) && isPatchable(vnode)) {
                  for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
                  if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
                }
                if (isUndef(vnode.text)) {
                  if (isDef(oldCh) && isDef(ch)) {
                    if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
                  } else if (isDef(ch)) {
                    if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
                    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
                  } else if (isDef(oldCh)) {
                    removeVnodes(elm, oldCh, 0, oldCh.length - 1);
                  } else if (isDef(oldVnode.text)) {
                    nodeOps.setTextContent(elm, '');
                  }
                } else if (oldVnode.text !== vnode.text) {
                  nodeOps.setTextContent(elm, vnode.text);
                }
                if (isDef(data)) {
                  if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
                }
              }

              function invokeInsertHook (vnode, queue, initial) {
                // delay insert hooks for component root nodes, invoke them after the
                // element is really inserted
                if (isTrue(initial) && isDef(vnode.parent)) {
                  vnode.parent.data.pendingInsert = queue;
                } else {
                  for (var i = 0; i < queue.length; ++i) {
                    queue[i].data.hook.insert(queue[i]);
                  }
                }
              }

              var hydrationBailed = false;
              // list of modules that can skip create hook during hydration because they
              // are already rendered on the client or has no need for initialization
              // Note: style is excluded because it relies on initial clone for future
              // deep updates (#7063).
              var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

              // Note: this is a browser-only function so we can assume elms are DOM nodes.
              function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
                var i;
                var tag = vnode.tag;
                var data = vnode.data;
                var children = vnode.children;
                inVPre = inVPre || (data && data.pre);
                vnode.elm = elm;

                if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
                  vnode.isAsyncPlaceholder = true;
                  return true
                }
                // assert node match
                if (process.env.NODE_ENV !== 'production') {
                  if (!assertNodeMatch(elm, vnode, inVPre)) {
                    return false
                  }
                }
                if (isDef(data)) {
                  if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
                  if (isDef(i = vnode.componentInstance)) {
                    // child component. it should have hydrated its own tree.
                    initComponent(vnode, insertedVnodeQueue);
                    return true
                  }
                }
                if (isDef(tag)) {
                  if (isDef(children)) {
                    // empty element, allow client to pick up and populate children
                    if (!elm.hasChildNodes()) {
                      createChildren(vnode, children, insertedVnodeQueue);
                    } else {
                      // v-html and domProps: innerHTML
                      if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
                        if (i !== elm.innerHTML) {
                          /* istanbul ignore if */
                          if (process.env.NODE_ENV !== 'production' &&
                            typeof console !== 'undefined' &&
                            !hydrationBailed
                          ) {
                            hydrationBailed = true;
                            console.warn('Parent: ', elm);
                            console.warn('server innerHTML: ', i);
                            console.warn('client innerHTML: ', elm.innerHTML);
                          }
                          return false
                        }
                      } else {
                        // iterate and compare children lists
                        var childrenMatch = true;
                        var childNode = elm.firstChild;
                        for (var i$1 = 0; i$1 < children.length; i$1++) {
                          if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                            childrenMatch = false;
                            break
                          }
                          childNode = childNode.nextSibling;
                        }
                        // if childNode is not null, it means the actual childNodes list is
                        // longer than the virtual children list.
                        if (!childrenMatch || childNode) {
                          /* istanbul ignore if */
                          if (process.env.NODE_ENV !== 'production' &&
                            typeof console !== 'undefined' &&
                            !hydrationBailed
                          ) {
                            hydrationBailed = true;
                            console.warn('Parent: ', elm);
                            console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                          }
                          return false
                        }
                      }
                    }
                  }
                  if (isDef(data)) {
                    var fullInvoke = false;
                    for (var key in data) {
                      if (!isRenderedModule(key)) {
                        fullInvoke = true;
                        invokeCreateHooks(vnode, insertedVnodeQueue);
                        break
                      }
                    }
                    if (!fullInvoke && data['class']) {
                      // ensure collecting deps for deep class bindings for future updates
                      traverse(data['class']);
                    }
                  }
                } else if (elm.data !== vnode.text) {
                  elm.data = vnode.text;
                }
                return true
              }

              function assertNodeMatch (node, vnode, inVPre) {
                if (isDef(vnode.tag)) {
                  return vnode.tag.indexOf('vue-component') === 0 || (
                    !isUnknownElement$$1(vnode, inVPre) &&
                    vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
                  )
                } else {
                  return node.nodeType === (vnode.isComment ? 8 : 3)
                }
              }

              return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
                if (isUndef(vnode)) {
                  if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
                  return
                }

                var isInitialPatch = false;
                var insertedVnodeQueue = [];

                if (isUndef(oldVnode)) {
                  // empty mount (likely as component), create new root element
                  isInitialPatch = true;
                  createElm(vnode, insertedVnodeQueue, parentElm, refElm);
                } else {
                  var isRealElement = isDef(oldVnode.nodeType);
                  if (!isRealElement && sameVnode(oldVnode, vnode)) {
                    // patch existing root node
                    patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
                  } else {
                    if (isRealElement) {
                      // mounting to a real element
                      // check if this is server-rendered content and if we can perform
                      // a successful hydration.
                      if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
                        oldVnode.removeAttribute(SSR_ATTR);
                        hydrating = true;
                      }
                      if (isTrue(hydrating)) {
                        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                          invokeInsertHook(vnode, insertedVnodeQueue, true);
                          return oldVnode
                        } else if (process.env.NODE_ENV !== 'production') {
                          warn(
                            'The client-side rendered virtual DOM tree is not matching ' +
                            'server-rendered content. This is likely caused by incorrect ' +
                            'HTML markup, for example nesting block-level elements inside ' +
                            '<p>, or missing <tbody>. Bailing hydration and performing ' +
                            'full client-side render.'
                          );
                        }
                      }
                      // either not server-rendered, or hydration failed.
                      // create an empty node and replace it
                      oldVnode = emptyNodeAt(oldVnode);
                    }

                    // replacing existing element
                    var oldElm = oldVnode.elm;
                    var parentElm$1 = nodeOps.parentNode(oldElm);

                    // create new node
                    createElm(
                      vnode,
                      insertedVnodeQueue,
                      // extremely rare edge case: do not insert if old element is in a
                      // leaving transition. Only happens when combining transition +
                      // keep-alive + HOCs. (#4590)
                      oldElm._leaveCb ? null : parentElm$1,
                      nodeOps.nextSibling(oldElm)
                    );

                    // update parent placeholder node element, recursively
                    if (isDef(vnode.parent)) {
                      var ancestor = vnode.parent;
                      var patchable = isPatchable(vnode);
                      while (ancestor) {
                        for (var i = 0; i < cbs.destroy.length; ++i) {
                          cbs.destroy[i](ancestor);
                        }
                        ancestor.elm = vnode.elm;
                        if (patchable) {
                          for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                            cbs.create[i$1](emptyNode, ancestor);
                          }
                          // #6513
                          // invoke insert hooks that may have been merged by create hooks.
                          // e.g. for directives that uses the "inserted" hook.
                          var insert = ancestor.data.hook.insert;
                          if (insert.merged) {
                            // start at index 1 to avoid re-invoking component mounted hook
                            for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                              insert.fns[i$2]();
                            }
                          }
                        } else {
                          registerRef(ancestor);
                        }
                        ancestor = ancestor.parent;
                      }
                    }

                    // destroy old node
                    if (isDef(parentElm$1)) {
                      removeVnodes(parentElm$1, [oldVnode], 0, 0);
                    } else if (isDef(oldVnode.tag)) {
                      invokeDestroyHook(oldVnode);
                    }
                  }
                }

                invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
                return vnode.elm
              }
            }

            /*  */

            var directives = {
              create: updateDirectives,
              update: updateDirectives,
              destroy: function unbindDirectives (vnode) {
                updateDirectives(vnode, emptyNode);
              }
            };

            function updateDirectives (oldVnode, vnode) {
              if (oldVnode.data.directives || vnode.data.directives) {
                _update(oldVnode, vnode);
              }
            }

            function _update (oldVnode, vnode) {
              var isCreate = oldVnode === emptyNode;
              var isDestroy = vnode === emptyNode;
              var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
              var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

              var dirsWithInsert = [];
              var dirsWithPostpatch = [];

              var key, oldDir, dir;
              for (key in newDirs) {
                oldDir = oldDirs[key];
                dir = newDirs[key];
                if (!oldDir) {
                  // new directive, bind
                  callHook$1(dir, 'bind', vnode, oldVnode);
                  if (dir.def && dir.def.inserted) {
                    dirsWithInsert.push(dir);
                  }
                } else {
                  // existing directive, update
                  dir.oldValue = oldDir.value;
                  callHook$1(dir, 'update', vnode, oldVnode);
                  if (dir.def && dir.def.componentUpdated) {
                    dirsWithPostpatch.push(dir);
                  }
                }
              }

              if (dirsWithInsert.length) {
                var callInsert = function () {
                  for (var i = 0; i < dirsWithInsert.length; i++) {
                    callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
                  }
                };
                if (isCreate) {
                  mergeVNodeHook(vnode, 'insert', callInsert);
                } else {
                  callInsert();
                }
              }

              if (dirsWithPostpatch.length) {
                mergeVNodeHook(vnode, 'postpatch', function () {
                  for (var i = 0; i < dirsWithPostpatch.length; i++) {
                    callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
                  }
                });
              }

              if (!isCreate) {
                for (key in oldDirs) {
                  if (!newDirs[key]) {
                    // no longer present, unbind
                    callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
                  }
                }
              }
            }

            var emptyModifiers = Object.create(null);

            function normalizeDirectives$1 (
              dirs,
              vm
            ) {
              var res = Object.create(null);
              if (!dirs) {
                // $flow-disable-line
                return res
              }
              var i, dir;
              for (i = 0; i < dirs.length; i++) {
                dir = dirs[i];
                if (!dir.modifiers) {
                  // $flow-disable-line
                  dir.modifiers = emptyModifiers;
                }
                res[getRawDirName(dir)] = dir;
                dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
              }
              // $flow-disable-line
              return res
            }

            function getRawDirName (dir) {
              return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
            }

            function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
              var fn = dir.def && dir.def[hook];
              if (fn) {
                try {
                  fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
                } catch (e) {
                  handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
                }
              }
            }

            var baseModules = [
              ref,
              directives
            ];

            /*  */

            function updateAttrs (oldVnode, vnode) {
              var opts = vnode.componentOptions;
              if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
                return
              }
              if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
                return
              }
              var key, cur, old;
              var elm = vnode.elm;
              var oldAttrs = oldVnode.data.attrs || {};
              var attrs = vnode.data.attrs || {};
              // clone observed objects, as the user probably wants to mutate it
              if (isDef(attrs.__ob__)) {
                attrs = vnode.data.attrs = extend({}, attrs);
              }

              for (key in attrs) {
                cur = attrs[key];
                old = oldAttrs[key];
                if (old !== cur) {
                  setAttr(elm, key, cur);
                }
              }
              // #4391: in IE9, setting type can reset value for input[type=radio]
              // #6666: IE/Edge forces progress value down to 1 before setting a max
              /* istanbul ignore if */
              if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
                setAttr(elm, 'value', attrs.value);
              }
              for (key in oldAttrs) {
                if (isUndef(attrs[key])) {
                  if (isXlink(key)) {
                    elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
                  } else if (!isEnumeratedAttr(key)) {
                    elm.removeAttribute(key);
                  }
                }
              }
            }

            function setAttr (el, key, value) {
              if (el.tagName.indexOf('-') > -1) {
                baseSetAttr(el, key, value);
              } else if (isBooleanAttr(key)) {
                // set attribute for blank value
                // e.g. <option disabled>Select one</option>
                if (isFalsyAttrValue(value)) {
                  el.removeAttribute(key);
                } else {
                  // technically allowfullscreen is a boolean attribute for <iframe>,
                  // but Flash expects a value of "true" when used on <embed> tag
                  value = key === 'allowfullscreen' && el.tagName === 'EMBED'
                    ? 'true'
                    : key;
                  el.setAttribute(key, value);
                }
              } else if (isEnumeratedAttr(key)) {
                el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
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

            function baseSetAttr (el, key, value) {
              if (isFalsyAttrValue(value)) {
                el.removeAttribute(key);
              } else {
                // #7138: IE10 & 11 fires input event when setting placeholder on
                // <textarea>... block the first input event and remove the blocker
                // immediately.
                /* istanbul ignore if */
                if (
                  isIE && !isIE9 &&
                  el.tagName === 'TEXTAREA' &&
                  key === 'placeholder' && !el.__ieph
                ) {
                  var blocker = function (e) {
                    e.stopImmediatePropagation();
                    el.removeEventListener('input', blocker);
                  };
                  el.addEventListener('input', blocker);
                  // $flow-disable-line
                  el.__ieph = true; /* IE placeholder patched */
                }
                el.setAttribute(key, value);
              }
            }

            var attrs = {
              create: updateAttrs,
              update: updateAttrs
            };

            /*  */

            function updateClass (oldVnode, vnode) {
              var el = vnode.elm;
              var data = vnode.data;
              var oldData = oldVnode.data;
              if (
                isUndef(data.staticClass) &&
                isUndef(data.class) && (
                  isUndef(oldData) || (
                    isUndef(oldData.staticClass) &&
                    isUndef(oldData.class)
                  )
                )
              ) {
                return
              }

              var cls = genClassForVnode(vnode);

              // handle transition classes
              var transitionClass = el._transitionClasses;
              if (isDef(transitionClass)) {
                cls = concat(cls, stringifyClass(transitionClass));
              }

              // set the class
              if (cls !== el._prevClass) {
                el.setAttribute('class', cls);
                el._prevClass = cls;
              }
            }

            var klass = {
              create: updateClass,
              update: updateClass
            };

            /*  */

            /*  */









            // add a raw attr (use this in preTransforms)








            // note: this only removes the attr from the Array (attrsList) so that it
            // doesn't get processed by processAttrs.
            // By default it does NOT remove it from the map (attrsMap) because the map is
            // needed during codegen.

            /*  */

            /**
             * Cross-platform code generation for component v-model
             */


            /**
             * Cross-platform codegen helper for generating v-model value assignment code.
             */

            /*  */

            // in some cases, the event used has to be determined at runtime
            // so we used some reserved tokens during compile.
            var RANGE_TOKEN = '__r';
            var CHECKBOX_RADIO_TOKEN = '__c';

            /*  */

            // normalize v-model event tokens that can only be determined at runtime.
            // it's important to place the event as the first in the array because
            // the whole point is ensuring the v-model callback gets called before
            // user-attached handlers.
            function normalizeEvents (on$$1) {
              /* istanbul ignore if */
              if (isDef(on$$1[RANGE_TOKEN])) {
                // IE input[type=range] only supports `change` event
                var event = isIE ? 'change' : 'input';
                on$$1[event] = [].concat(on$$1[RANGE_TOKEN], on$$1[event] || []);
                delete on$$1[RANGE_TOKEN];
              }
              // This was originally intended to fix #4521 but no longer necessary
              // after 2.5. Keeping it for backwards compat with generated code from < 2.4
              /* istanbul ignore if */
              if (isDef(on$$1[CHECKBOX_RADIO_TOKEN])) {
                on$$1.change = [].concat(on$$1[CHECKBOX_RADIO_TOKEN], on$$1.change || []);
                delete on$$1[CHECKBOX_RADIO_TOKEN];
              }
            }

            var target$1;

            function createOnceHandler (handler, event, capture) {
              var _target = target$1; // save current target element in closure
              return function onceHandler () {
                var res = handler.apply(null, arguments);
                if (res !== null) {
                  remove$2(event, onceHandler, capture, _target);
                }
              }
            }

            function add$1 (
              event,
              handler,
              once$$1,
              capture,
              passive
            ) {
              handler = withMacroTask(handler);
              if (once$$1) { handler = createOnceHandler(handler, event, capture); }
              target$1.addEventListener(
                event,
                handler,
                supportsPassive
                  ? { capture: capture, passive: passive }
                  : capture
              );
            }

            function remove$2 (
              event,
              handler,
              capture,
              _target
            ) {
              (_target || target$1).removeEventListener(
                event,
                handler._withTask || handler,
                capture
              );
            }

            function updateDOMListeners (oldVnode, vnode) {
              if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
                return
              }
              var on$$1 = vnode.data.on || {};
              var oldOn = oldVnode.data.on || {};
              target$1 = vnode.elm;
              normalizeEvents(on$$1);
              updateListeners(on$$1, oldOn, add$1, remove$2, vnode.context);
              target$1 = undefined;
            }

            var events = {
              create: updateDOMListeners,
              update: updateDOMListeners
            };

            /*  */

            function updateDOMProps (oldVnode, vnode) {
              if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
                return
              }
              var key, cur;
              var elm = vnode.elm;
              var oldProps = oldVnode.data.domProps || {};
              var props = vnode.data.domProps || {};
              // clone observed objects, as the user probably wants to mutate it
              if (isDef(props.__ob__)) {
                props = vnode.data.domProps = extend({}, props);
              }

              for (key in oldProps) {
                if (isUndef(props[key])) {
                  elm[key] = '';
                }
              }
              for (key in props) {
                cur = props[key];
                // ignore children if the node has textContent or innerHTML,
                // as these will throw away existing DOM nodes and cause removal errors
                // on subsequent patches (#3360)
                if (key === 'textContent' || key === 'innerHTML') {
                  if (vnode.children) { vnode.children.length = 0; }
                  if (cur === oldProps[key]) { continue }
                  // #6601 work around Chrome version <= 55 bug where single textNode
                  // replaced by innerHTML/textContent retains its parentNode property
                  if (elm.childNodes.length === 1) {
                    elm.removeChild(elm.childNodes[0]);
                  }
                }

                if (key === 'value') {
                  // store value as _value as well since
                  // non-string values will be stringified
                  elm._value = cur;
                  // avoid resetting cursor position when value is the same
                  var strCur = isUndef(cur) ? '' : String(cur);
                  if (shouldUpdateValue(elm, strCur)) {
                    elm.value = strCur;
                  }
                } else {
                  elm[key] = cur;
                }
              }
            }

            // check platforms/web/util/attrs.js acceptValue


            function shouldUpdateValue (elm, checkVal) {
              return (!elm.composing && (
                elm.tagName === 'OPTION' ||
                isNotInFocusAndDirty(elm, checkVal) ||
                isDirtyWithModifiers(elm, checkVal)
              ))
            }

            function isNotInFocusAndDirty (elm, checkVal) {
              // return true when textbox (.number and .trim) loses focus and its value is
              // not equal to the updated value
              var notInFocus = true;
              // #6157
              // work around IE bug when accessing document.activeElement in an iframe
              try { notInFocus = document.activeElement !== elm; } catch (e) {}
              return notInFocus && elm.value !== checkVal
            }

            function isDirtyWithModifiers (elm, newVal) {
              var value = elm.value;
              var modifiers = elm._vModifiers; // injected by v-model runtime
              if (isDef(modifiers)) {
                if (modifiers.lazy) {
                  // inputs with lazy should only be updated when not in focus
                  return false
                }
                if (modifiers.number) {
                  return toNumber(value) !== toNumber(newVal)
                }
                if (modifiers.trim) {
                  return value.trim() !== newVal.trim()
                }
              }
              return value !== newVal
            }

            var domProps = {
              create: updateDOMProps,
              update: updateDOMProps
            };

            /*  */

            var parseStyleText = cached(function (cssText) {
              var res = {};
              var listDelimiter = /;(?![^(]*\))/g;
              var propertyDelimiter = /:(.+)/;
              cssText.split(listDelimiter).forEach(function (item) {
                if (item) {
                  var tmp = item.split(propertyDelimiter);
                  tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
                }
              });
              return res
            });

            // merge static and dynamic style data on the same vnode
            function normalizeStyleData (data) {
              var style = normalizeStyleBinding(data.style);
              // static style is pre-processed into an object during compilation
              // and is always a fresh object, so it's safe to merge into it
              return data.staticStyle
                ? extend(data.staticStyle, style)
                : style
            }

            // normalize possible array / string values into Object
            function normalizeStyleBinding (bindingStyle) {
              if (Array.isArray(bindingStyle)) {
                return toObject(bindingStyle)
              }
              if (typeof bindingStyle === 'string') {
                return parseStyleText(bindingStyle)
              }
              return bindingStyle
            }

            /**
             * parent component style should be after child's
             * so that parent component's style could override it
             */
            function getStyle (vnode, checkChild) {
              var res = {};
              var styleData;

              if (checkChild) {
                var childNode = vnode;
                while (childNode.componentInstance) {
                  childNode = childNode.componentInstance._vnode;
                  if (
                    childNode && childNode.data &&
                    (styleData = normalizeStyleData(childNode.data))
                  ) {
                    extend(res, styleData);
                  }
                }
              }

              if ((styleData = normalizeStyleData(vnode.data))) {
                extend(res, styleData);
              }

              var parentNode = vnode;
              while ((parentNode = parentNode.parent)) {
                if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
                  extend(res, styleData);
                }
              }
              return res
            }

            /*  */

            var cssVarRE = /^--/;
            var importantRE = /\s*!important$/;
            var setProp = function (el, name, val) {
              /* istanbul ignore if */
              if (cssVarRE.test(name)) {
                el.style.setProperty(name, val);
              } else if (importantRE.test(val)) {
                el.style.setProperty(name, val.replace(importantRE, ''), 'important');
              } else {
                var normalizedName = normalize(name);
                if (Array.isArray(val)) {
                  // Support values array created by autoprefixer, e.g.
                  // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
                  // Set them one by one, and the browser will only set those it can recognize
                  for (var i = 0, len = val.length; i < len; i++) {
                    el.style[normalizedName] = val[i];
                  }
                } else {
                  el.style[normalizedName] = val;
                }
              }
            };

            var vendorNames = ['Webkit', 'Moz', 'ms'];

            var emptyStyle;
            var normalize = cached(function (prop) {
              emptyStyle = emptyStyle || document.createElement('div').style;
              prop = camelize(prop);
              if (prop !== 'filter' && (prop in emptyStyle)) {
                return prop
              }
              var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
              for (var i = 0; i < vendorNames.length; i++) {
                var name = vendorNames[i] + capName;
                if (name in emptyStyle) {
                  return name
                }
              }
            });

            function updateStyle (oldVnode, vnode) {
              var data = vnode.data;
              var oldData = oldVnode.data;

              if (isUndef(data.staticStyle) && isUndef(data.style) &&
                isUndef(oldData.staticStyle) && isUndef(oldData.style)
              ) {
                return
              }

              var cur, name;
              var el = vnode.elm;
              var oldStaticStyle = oldData.staticStyle;
              var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

              // if static style exists, stylebinding already merged into it when doing normalizeStyleData
              var oldStyle = oldStaticStyle || oldStyleBinding;

              var style = normalizeStyleBinding(vnode.data.style) || {};

              // store normalized style under a different key for next diff
              // make sure to clone it if it's reactive, since the user likely wants
              // to mutate it.
              vnode.data.normalizedStyle = isDef(style.__ob__)
                ? extend({}, style)
                : style;

              var newStyle = getStyle(vnode, true);

              for (name in oldStyle) {
                if (isUndef(newStyle[name])) {
                  setProp(el, name, '');
                }
              }
              for (name in newStyle) {
                cur = newStyle[name];
                if (cur !== oldStyle[name]) {
                  // ie9 setting to null has no effect, must use empty string
                  setProp(el, name, cur == null ? '' : cur);
                }
              }
            }

            var style = {
              create: updateStyle,
              update: updateStyle
            };

            /*  */

            /**
             * Add class with compatibility for SVG since classList is not supported on
             * SVG elements in IE
             */
            function addClass (el, cls) {
              /* istanbul ignore if */
              if (!cls || !(cls = cls.trim())) {
                return
              }

              /* istanbul ignore else */
              if (el.classList) {
                if (cls.indexOf(' ') > -1) {
                  cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
                } else {
                  el.classList.add(cls);
                }
              } else {
                var cur = " " + (el.getAttribute('class') || '') + " ";
                if (cur.indexOf(' ' + cls + ' ') < 0) {
                  el.setAttribute('class', (cur + cls).trim());
                }
              }
            }

            /**
             * Remove class with compatibility for SVG since classList is not supported on
             * SVG elements in IE
             */
            function removeClass (el, cls) {
              /* istanbul ignore if */
              if (!cls || !(cls = cls.trim())) {
                return
              }

              /* istanbul ignore else */
              if (el.classList) {
                if (cls.indexOf(' ') > -1) {
                  cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
                } else {
                  el.classList.remove(cls);
                }
                if (!el.classList.length) {
                  el.removeAttribute('class');
                }
              } else {
                var cur = " " + (el.getAttribute('class') || '') + " ";
                var tar = ' ' + cls + ' ';
                while (cur.indexOf(tar) >= 0) {
                  cur = cur.replace(tar, ' ');
                }
                cur = cur.trim();
                if (cur) {
                  el.setAttribute('class', cur);
                } else {
                  el.removeAttribute('class');
                }
              }
            }

            /*  */

            function resolveTransition (def) {
              if (!def) {
                return
              }
              /* istanbul ignore else */
              if (typeof def === 'object') {
                var res = {};
                if (def.css !== false) {
                  extend(res, autoCssTransition(def.name || 'v'));
                }
                extend(res, def);
                return res
              } else if (typeof def === 'string') {
                return autoCssTransition(def)
              }
            }

            var autoCssTransition = cached(function (name) {
              return {
                enterClass: (name + "-enter"),
                enterToClass: (name + "-enter-to"),
                enterActiveClass: (name + "-enter-active"),
                leaveClass: (name + "-leave"),
                leaveToClass: (name + "-leave-to"),
                leaveActiveClass: (name + "-leave-active")
              }
            });

            var hasTransition = inBrowser && !isIE9;
            var TRANSITION = 'transition';
            var ANIMATION = 'animation';

            // Transition property/event sniffing
            var transitionProp = 'transition';
            var transitionEndEvent = 'transitionend';
            var animationProp = 'animation';
            var animationEndEvent = 'animationend';
            if (hasTransition) {
              /* istanbul ignore if */
              if (window.ontransitionend === undefined &&
                window.onwebkittransitionend !== undefined
              ) {
                transitionProp = 'WebkitTransition';
                transitionEndEvent = 'webkitTransitionEnd';
              }
              if (window.onanimationend === undefined &&
                window.onwebkitanimationend !== undefined
              ) {
                animationProp = 'WebkitAnimation';
                animationEndEvent = 'webkitAnimationEnd';
              }
            }

            // binding to window is necessary to make hot reload work in IE in strict mode
            var raf = inBrowser
              ? window.requestAnimationFrame
                ? window.requestAnimationFrame.bind(window)
                : setTimeout
              : /* istanbul ignore next */ function (fn) { return fn(); };

            function nextFrame (fn) {
              raf(function () {
                raf(fn);
              });
            }

            function addTransitionClass (el, cls) {
              var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
              if (transitionClasses.indexOf(cls) < 0) {
                transitionClasses.push(cls);
                addClass(el, cls);
              }
            }

            function removeTransitionClass (el, cls) {
              if (el._transitionClasses) {
                remove(el._transitionClasses, cls);
              }
              removeClass(el, cls);
            }

            function whenTransitionEnds (
              el,
              expectedType,
              cb
            ) {
              var ref = getTransitionInfo(el, expectedType);
              var type = ref.type;
              var timeout = ref.timeout;
              var propCount = ref.propCount;
              if (!type) { return cb() }
              var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
              var ended = 0;
              var end = function () {
                el.removeEventListener(event, onEnd);
                cb();
              };
              var onEnd = function (e) {
                if (e.target === el) {
                  if (++ended >= propCount) {
                    end();
                  }
                }
              };
              setTimeout(function () {
                if (ended < propCount) {
                  end();
                }
              }, timeout + 1);
              el.addEventListener(event, onEnd);
            }

            var transformRE = /\b(transform|all)(,|$)/;

            function getTransitionInfo (el, expectedType) {
              var styles = window.getComputedStyle(el);
              var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
              var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
              var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
              var animationDelays = styles[animationProp + 'Delay'].split(', ');
              var animationDurations = styles[animationProp + 'Duration'].split(', ');
              var animationTimeout = getTimeout(animationDelays, animationDurations);

              var type;
              var timeout = 0;
              var propCount = 0;
              /* istanbul ignore if */
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
                type = timeout > 0
                  ? transitionTimeout > animationTimeout
                    ? TRANSITION
                    : ANIMATION
                  : null;
                propCount = type
                  ? type === TRANSITION
                    ? transitionDurations.length
                    : animationDurations.length
                  : 0;
              }
              var hasTransform =
                type === TRANSITION &&
                transformRE.test(styles[transitionProp + 'Property']);
              return {
                type: type,
                timeout: timeout,
                propCount: propCount,
                hasTransform: hasTransform
              }
            }

            function getTimeout (delays, durations) {
              /* istanbul ignore next */
              while (delays.length < durations.length) {
                delays = delays.concat(delays);
              }

              return Math.max.apply(null, durations.map(function (d, i) {
                return toMs(d) + toMs(delays[i])
              }))
            }

            function toMs (s) {
              return Number(s.slice(0, -1)) * 1000
            }

            /*  */

            function enter (vnode, toggleDisplay) {
              var el = vnode.elm;

              // call leave callback now
              if (isDef(el._leaveCb)) {
                el._leaveCb.cancelled = true;
                el._leaveCb();
              }

              var data = resolveTransition(vnode.data.transition);
              if (isUndef(data)) {
                return
              }

              /* istanbul ignore if */
              if (isDef(el._enterCb) || el.nodeType !== 1) {
                return
              }

              var css = data.css;
              var type = data.type;
              var enterClass = data.enterClass;
              var enterToClass = data.enterToClass;
              var enterActiveClass = data.enterActiveClass;
              var appearClass = data.appearClass;
              var appearToClass = data.appearToClass;
              var appearActiveClass = data.appearActiveClass;
              var beforeEnter = data.beforeEnter;
              var enter = data.enter;
              var afterEnter = data.afterEnter;
              var enterCancelled = data.enterCancelled;
              var beforeAppear = data.beforeAppear;
              var appear = data.appear;
              var afterAppear = data.afterAppear;
              var appearCancelled = data.appearCancelled;
              var duration = data.duration;

              // activeInstance will always be the <transition> component managing this
              // transition. One edge case to check is when the <transition> is placed
              // as the root node of a child component. In that case we need to check
              // <transition>'s parent for appear check.
              var context = activeInstance;
              var transitionNode = activeInstance.$vnode;
              while (transitionNode && transitionNode.parent) {
                transitionNode = transitionNode.parent;
                context = transitionNode.context;
              }

              var isAppear = !context._isMounted || !vnode.isRootInsert;

              if (isAppear && !appear && appear !== '') {
                return
              }

              var startClass = isAppear && appearClass
                ? appearClass
                : enterClass;
              var activeClass = isAppear && appearActiveClass
                ? appearActiveClass
                : enterActiveClass;
              var toClass = isAppear && appearToClass
                ? appearToClass
                : enterToClass;

              var beforeEnterHook = isAppear
                ? (beforeAppear || beforeEnter)
                : beforeEnter;
              var enterHook = isAppear
                ? (typeof appear === 'function' ? appear : enter)
                : enter;
              var afterEnterHook = isAppear
                ? (afterAppear || afterEnter)
                : afterEnter;
              var enterCancelledHook = isAppear
                ? (appearCancelled || enterCancelled)
                : enterCancelled;

              var explicitEnterDuration = toNumber(
                isObject(duration)
                  ? duration.enter
                  : duration
              );

              if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
                checkDuration(explicitEnterDuration, 'enter', vnode);
              }

              var expectsCSS = css !== false && !isIE9;
              var userWantsControl = getHookArgumentsLength(enterHook);

              var cb = el._enterCb = once$1(function () {
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
                // remove pending leave element on enter by injecting an insert hook
                mergeVNodeHook(vnode, 'insert', function () {
                  var parent = el.parentNode;
                  var pendingNode = parent && parent._pending && parent._pending[vnode.key];
                  if (pendingNode &&
                    pendingNode.tag === vnode.tag &&
                    pendingNode.elm._leaveCb
                  ) {
                    pendingNode.elm._leaveCb();
                  }
                  enterHook && enterHook(el, cb);
                });
              }

              // start enter transition
              beforeEnterHook && beforeEnterHook(el);
              if (expectsCSS) {
                addTransitionClass(el, startClass);
                addTransitionClass(el, activeClass);
                nextFrame(function () {
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

            function leave (vnode, rm) {
              var el = vnode.elm;

              // call enter callback now
              if (isDef(el._enterCb)) {
                el._enterCb.cancelled = true;
                el._enterCb();
              }

              var data = resolveTransition(vnode.data.transition);
              if (isUndef(data) || el.nodeType !== 1) {
                return rm()
              }

              /* istanbul ignore if */
              if (isDef(el._leaveCb)) {
                return
              }

              var css = data.css;
              var type = data.type;
              var leaveClass = data.leaveClass;
              var leaveToClass = data.leaveToClass;
              var leaveActiveClass = data.leaveActiveClass;
              var beforeLeave = data.beforeLeave;
              var leave = data.leave;
              var afterLeave = data.afterLeave;
              var leaveCancelled = data.leaveCancelled;
              var delayLeave = data.delayLeave;
              var duration = data.duration;

              var expectsCSS = css !== false && !isIE9;
              var userWantsControl = getHookArgumentsLength(leave);

              var explicitLeaveDuration = toNumber(
                isObject(duration)
                  ? duration.leave
                  : duration
              );

              if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
                checkDuration(explicitLeaveDuration, 'leave', vnode);
              }

              var cb = el._leaveCb = once$1(function () {
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

              function performLeave () {
                // the delayed leave may have already been cancelled
                if (cb.cancelled) {
                  return
                }
                // record leaving element
                if (!vnode.data.show) {
                  (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
                }
                beforeLeave && beforeLeave(el);
                if (expectsCSS) {
                  addTransitionClass(el, leaveClass);
                  addTransitionClass(el, leaveActiveClass);
                  nextFrame(function () {
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
                leave && leave(el, cb);
                if (!expectsCSS && !userWantsControl) {
                  cb();
                }
              }
            }

            // only used in dev mode
            function checkDuration (val, name, vnode) {
              if (typeof val !== 'number') {
                warn(
                  "<transition> explicit " + name + " duration is not a valid number - " +
                  "got " + (JSON.stringify(val)) + ".",
                  vnode.context
                );
              } else if (isNaN(val)) {
                warn(
                  "<transition> explicit " + name + " duration is NaN - " +
                  'the duration expression might be incorrect.',
                  vnode.context
                );
              }
            }

            function isValidDuration (val) {
              return typeof val === 'number' && !isNaN(val)
            }

            /**
             * Normalize a transition hook's argument length. The hook may be:
             * - a merged hook (invoker) with the original in .fns
             * - a wrapped component method (check ._length)
             * - a plain function (.length)
             */
            function getHookArgumentsLength (fn) {
              if (isUndef(fn)) {
                return false
              }
              var invokerFns = fn.fns;
              if (isDef(invokerFns)) {
                // invoker
                return getHookArgumentsLength(
                  Array.isArray(invokerFns)
                    ? invokerFns[0]
                    : invokerFns
                )
              } else {
                return (fn._length || fn.length) > 1
              }
            }

            function _enter (_, vnode) {
              if (vnode.data.show !== true) {
                enter(vnode);
              }
            }

            var transition = inBrowser ? {
              create: _enter,
              activate: _enter,
              remove: function remove$$1 (vnode, rm) {
                /* istanbul ignore else */
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

            /*  */

            // the directive module should be applied last, after all
            // built-in modules have been applied.
            var modules = platformModules.concat(baseModules);

            var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

            /**
             * Not type checking this file because flow doesn't like attaching
             * properties to Elements.
             */

            /* istanbul ignore if */
            if (isIE9) {
              // http://www.matts411.com/post/internet-explorer-9-oninput/
              document.addEventListener('selectionchange', function () {
                var el = document.activeElement;
                if (el && el.vmodel) {
                  trigger(el, 'input');
                }
              });
            }

            var directive = {
              inserted: function inserted (el, binding$$1, vnode, oldVnode) {
                if (vnode.tag === 'select') {
                  // #6903
                  if (oldVnode.elm && !oldVnode.elm._vOptions) {
                    mergeVNodeHook(vnode, 'postpatch', function () {
                      directive.componentUpdated(el, binding$$1, vnode);
                    });
                  } else {
                    setSelected(el, binding$$1, vnode.context);
                  }
                  el._vOptions = [].map.call(el.options, getValue);
                } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
                  el._vModifiers = binding$$1.modifiers;
                  if (!binding$$1.modifiers.lazy) {
                    el.addEventListener('compositionstart', onCompositionStart);
                    el.addEventListener('compositionend', onCompositionEnd);
                    // Safari < 10.2 & UIWebView doesn't fire compositionend when
                    // switching focus before confirming composition choice
                    // this also fixes the issue where some browsers e.g. iOS Chrome
                    // fires "change" instead of "input" on autocomplete.
                    el.addEventListener('change', onCompositionEnd);
                    /* istanbul ignore if */
                    if (isIE9) {
                      el.vmodel = true;
                    }
                  }
                }
              },

              componentUpdated: function componentUpdated (el, binding$$1, vnode) {
                if (vnode.tag === 'select') {
                  setSelected(el, binding$$1, vnode.context);
                  // in case the options rendered by v-for have changed,
                  // it's possible that the value is out-of-sync with the rendered options.
                  // detect such cases and filter out values that no longer has a matching
                  // option in the DOM.
                  var prevOptions = el._vOptions;
                  var curOptions = el._vOptions = [].map.call(el.options, getValue);
                  if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
                    // trigger change event if
                    // no matching option found for at least one value
                    var needReset = el.multiple
                      ? binding$$1.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
                      : binding$$1.value !== binding$$1.oldValue && hasNoMatchingOption(binding$$1.value, curOptions);
                    if (needReset) {
                      trigger(el, 'change');
                    }
                  }
                }
              }
            };

            function setSelected (el, binding$$1, vm) {
              actuallySetSelected(el, binding$$1, vm);
              /* istanbul ignore if */
              if (isIE || isEdge) {
                setTimeout(function () {
                  actuallySetSelected(el, binding$$1, vm);
                }, 0);
              }
            }

            function actuallySetSelected (el, binding$$1, vm) {
              var value = binding$$1.value;
              var isMultiple = el.multiple;
              if (isMultiple && !Array.isArray(value)) {
                process.env.NODE_ENV !== 'production' && warn(
                  "<select multiple v-model=\"" + (binding$$1.expression) + "\"> " +
                  "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
                  vm
                );
                return
              }
              var selected, option;
              for (var i = 0, l = el.options.length; i < l; i++) {
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
                    return
                  }
                }
              }
              if (!isMultiple) {
                el.selectedIndex = -1;
              }
            }

            function hasNoMatchingOption (value, options) {
              return options.every(function (o) { return !looseEqual(o, value); })
            }

            function getValue (option) {
              return '_value' in option
                ? option._value
                : option.value
            }

            function onCompositionStart (e) {
              e.target.composing = true;
            }

            function onCompositionEnd (e) {
              // prevent triggering an input event for no reason
              if (!e.target.composing) { return }
              e.target.composing = false;
              trigger(e.target, 'input');
            }

            function trigger (el, type) {
              var e = document.createEvent('HTMLEvents');
              e.initEvent(type, true, true);
              el.dispatchEvent(e);
            }

            /*  */

            // recursively search for possible transition defined inside the component root
            function locateNode (vnode) {
              return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
                ? locateNode(vnode.componentInstance._vnode)
                : vnode
            }

            var show = {
              bind: function bind (el, ref, vnode) {
                var value = ref.value;

                vnode = locateNode(vnode);
                var transition$$1 = vnode.data && vnode.data.transition;
                var originalDisplay = el.__vOriginalDisplay =
                  el.style.display === 'none' ? '' : el.style.display;
                if (value && transition$$1) {
                  vnode.data.show = true;
                  enter(vnode, function () {
                    el.style.display = originalDisplay;
                  });
                } else {
                  el.style.display = value ? originalDisplay : 'none';
                }
              },

              update: function update (el, ref, vnode) {
                var value = ref.value;
                var oldValue = ref.oldValue;

                /* istanbul ignore if */
                if (!value === !oldValue) { return }
                vnode = locateNode(vnode);
                var transition$$1 = vnode.data && vnode.data.transition;
                if (transition$$1) {
                  vnode.data.show = true;
                  if (value) {
                    enter(vnode, function () {
                      el.style.display = el.__vOriginalDisplay;
                    });
                  } else {
                    leave(vnode, function () {
                      el.style.display = 'none';
                    });
                  }
                } else {
                  el.style.display = value ? el.__vOriginalDisplay : 'none';
                }
              },

              unbind: function unbind (
                el,
                binding$$1,
                vnode,
                oldVnode,
                isDestroy
              ) {
                if (!isDestroy) {
                  el.style.display = el.__vOriginalDisplay;
                }
              }
            };

            var platformDirectives = {
              model: directive,
              show: show
            };

            /*  */

            // Provides transition support for a single element/component.
            // supports transition mode (out-in / in-out)

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
              duration: [Number, String, Object]
            };

            // in case the child is also an abstract component, e.g. <keep-alive>
            // we want to recursively retrieve the real component to be rendered
            function getRealChild (vnode) {
              var compOptions = vnode && vnode.componentOptions;
              if (compOptions && compOptions.Ctor.options.abstract) {
                return getRealChild(getFirstComponentChild(compOptions.children))
              } else {
                return vnode
              }
            }

            function extractTransitionData (comp) {
              var data = {};
              var options = comp.$options;
              // props
              for (var key in options.propsData) {
                data[key] = comp[key];
              }
              // events.
              // extract listeners and pass them directly to the transition methods
              var listeners = options._parentListeners;
              for (var key$1 in listeners) {
                data[camelize(key$1)] = listeners[key$1];
              }
              return data
            }

            function placeholder (h, rawChild) {
              if (/\d-keep-alive$/.test(rawChild.tag)) {
                return h('keep-alive', {
                  props: rawChild.componentOptions.propsData
                })
              }
            }

            function hasParentTransition (vnode) {
              while ((vnode = vnode.parent)) {
                if (vnode.data.transition) {
                  return true
                }
              }
            }

            function isSameChild (child, oldChild) {
              return oldChild.key === child.key && oldChild.tag === child.tag
            }

            var Transition = {
              name: 'transition',
              props: transitionProps,
              abstract: true,

              render: function render (h) {
                var this$1 = this;

                var children = this.$slots.default;
                if (!children) {
                  return
                }

                // filter out text nodes (possible whitespaces)
                children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
                /* istanbul ignore if */
                if (!children.length) {
                  return
                }

                // warn multiple elements
                if (process.env.NODE_ENV !== 'production' && children.length > 1) {
                  warn(
                    '<transition> can only be used on a single element. Use ' +
                    '<transition-group> for lists.',
                    this.$parent
                  );
                }

                var mode = this.mode;

                // warn invalid mode
                if (process.env.NODE_ENV !== 'production' &&
                  mode && mode !== 'in-out' && mode !== 'out-in'
                ) {
                  warn(
                    'invalid <transition> mode: ' + mode,
                    this.$parent
                  );
                }

                var rawChild = children[0];

                // if this is a component root node and the component's
                // parent container node also has transition, skip.
                if (hasParentTransition(this.$vnode)) {
                  return rawChild
                }

                // apply transition data to child
                // use getRealChild() to ignore abstract components e.g. keep-alive
                var child = getRealChild(rawChild);
                /* istanbul ignore if */
                if (!child) {
                  return rawChild
                }

                if (this._leaving) {
                  return placeholder(h, rawChild)
                }

                // ensure a key that is unique to the vnode type and to this transition
                // component instance. This key will be used to remove pending leaving nodes
                // during entering.
                var id = "__transition-" + (this._uid) + "-";
                child.key = child.key == null
                  ? child.isComment
                    ? id + 'comment'
                    : id + child.tag
                  : isPrimitive(child.key)
                    ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
                    : child.key;

                var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
                var oldRawChild = this._vnode;
                var oldChild = getRealChild(oldRawChild);

                // mark v-show
                // so that the transition module can hand over the control to the directive
                if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
                  child.data.show = true;
                }

                if (
                  oldChild &&
                  oldChild.data &&
                  !isSameChild(child, oldChild) &&
                  !isAsyncPlaceholder(oldChild) &&
                  // #6687 component root is a comment node
                  !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
                ) {
                  // replace old child transition data with fresh one
                  // important for dynamic transitions!
                  var oldData = oldChild.data.transition = extend({}, data);
                  // handle transition mode
                  if (mode === 'out-in') {
                    // return placeholder node and queue update when leave finishes
                    this._leaving = true;
                    mergeVNodeHook(oldData, 'afterLeave', function () {
                      this$1._leaving = false;
                      this$1.$forceUpdate();
                    });
                    return placeholder(h, rawChild)
                  } else if (mode === 'in-out') {
                    if (isAsyncPlaceholder(child)) {
                      return oldRawChild
                    }
                    var delayedLeave;
                    var performLeave = function () { delayedLeave(); };
                    mergeVNodeHook(data, 'afterEnter', performLeave);
                    mergeVNodeHook(data, 'enterCancelled', performLeave);
                    mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
                  }
                }

                return rawChild
              }
            };

            /*  */

            // Provides transition support for list items.
            // supports move transitions using the FLIP technique.

            // Because the vdom's children update algorithm is "unstable" - i.e.
            // it doesn't guarantee the relative positioning of removed elements,
            // we force transition-group to update its children into two passes:
            // in the first pass, we remove all nodes that need to be removed,
            // triggering their leaving transition; in the second pass, we insert/move
            // into the final desired state. This way in the second pass removed
            // nodes will remain where they should be.

            var props = extend({
              tag: String,
              moveClass: String
            }, transitionProps);

            delete props.mode;

            var TransitionGroup = {
              props: props,

              render: function render (h) {
                var tag = this.tag || this.$vnode.data.tag || 'span';
                var map = Object.create(null);
                var prevChildren = this.prevChildren = this.children;
                var rawChildren = this.$slots.default || [];
                var children = this.children = [];
                var transitionData = extractTransitionData(this);

                for (var i = 0; i < rawChildren.length; i++) {
                  var c = rawChildren[i];
                  if (c.tag) {
                    if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
                      children.push(c);
                      map[c.key] = c
                      ;(c.data || (c.data = {})).transition = transitionData;
                    } else if (process.env.NODE_ENV !== 'production') {
                      var opts = c.componentOptions;
                      var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
                      warn(("<transition-group> children must be keyed: <" + name + ">"));
                    }
                  }
                }

                if (prevChildren) {
                  var kept = [];
                  var removed = [];
                  for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
                    var c$1 = prevChildren[i$1];
                    c$1.data.transition = transitionData;
                    c$1.data.pos = c$1.elm.getBoundingClientRect();
                    if (map[c$1.key]) {
                      kept.push(c$1);
                    } else {
                      removed.push(c$1);
                    }
                  }
                  this.kept = h(tag, null, kept);
                  this.removed = removed;
                }

                return h(tag, null, children)
              },

              beforeUpdate: function beforeUpdate () {
                // force removing pass
                this.__patch__(
                  this._vnode,
                  this.kept,
                  false, // hydrating
                  true // removeOnly (!important, avoids unnecessary moves)
                );
                this._vnode = this.kept;
              },

              updated: function updated () {
                var children = this.prevChildren;
                var moveClass = this.moveClass || ((this.name || 'v') + '-move');
                if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
                  return
                }

                // we divide the work into three loops to avoid mixing DOM reads and writes
                // in each iteration - which helps prevent layout thrashing.
                children.forEach(callPendingCbs);
                children.forEach(recordPosition);
                children.forEach(applyTranslation);

                // force reflow to put everything in position
                // assign to this to avoid being removed in tree-shaking
                // $flow-disable-line
                this._reflow = document.body.offsetHeight;

                children.forEach(function (c) {
                  if (c.data.moved) {
                    var el = c.elm;
                    var s = el.style;
                    addTransitionClass(el, moveClass);
                    s.transform = s.WebkitTransform = s.transitionDuration = '';
                    el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
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
                hasMove: function hasMove (el, moveClass) {
                  /* istanbul ignore if */
                  if (!hasTransition) {
                    return false
                  }
                  /* istanbul ignore if */
                  if (this._hasMove) {
                    return this._hasMove
                  }
                  // Detect whether an element with the move class applied has
                  // CSS transitions. Since the element may be inside an entering
                  // transition at this very moment, we make a clone of it and remove
                  // all other transition classes applied to ensure only the move class
                  // is applied.
                  var clone = el.cloneNode();
                  if (el._transitionClasses) {
                    el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
                  }
                  addClass(clone, moveClass);
                  clone.style.display = 'none';
                  this.$el.appendChild(clone);
                  var info = getTransitionInfo(clone);
                  this.$el.removeChild(clone);
                  return (this._hasMove = info.hasTransform)
                }
              }
            };

            function callPendingCbs (c) {
              /* istanbul ignore if */
              if (c.elm._moveCb) {
                c.elm._moveCb();
              }
              /* istanbul ignore if */
              if (c.elm._enterCb) {
                c.elm._enterCb();
              }
            }

            function recordPosition (c) {
              c.data.newPos = c.elm.getBoundingClientRect();
            }

            function applyTranslation (c) {
              var oldPos = c.data.pos;
              var newPos = c.data.newPos;
              var dx = oldPos.left - newPos.left;
              var dy = oldPos.top - newPos.top;
              if (dx || dy) {
                c.data.moved = true;
                var s = c.elm.style;
                s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
                s.transitionDuration = '0s';
              }
            }

            var platformComponents = {
              Transition: Transition,
              TransitionGroup: TransitionGroup
            };

            /*  */

            // install platform specific utils
            Vue.config.mustUseProp = mustUseProp;
            Vue.config.isReservedTag = isReservedTag;
            Vue.config.isReservedAttr = isReservedAttr;
            Vue.config.getTagNamespace = getTagNamespace;
            Vue.config.isUnknownElement = isUnknownElement;

            // install platform runtime directives & components
            extend(Vue.options.directives, platformDirectives);
            extend(Vue.options.components, platformComponents);

            // install platform patch function
            Vue.prototype.__patch__ = inBrowser ? patch : noop$1;

            // public mount method
            Vue.prototype.$mount = function (
              el,
              hydrating
            ) {
              el = el && inBrowser ? query(el) : undefined;
              return mountComponent(this, el, hydrating)
            };

            // devtools global hook
            /* istanbul ignore next */
            if (inBrowser) {
              setTimeout(function () {
                if (config$1.devtools) {
                  if (devtools) {
                    devtools.emit('init', Vue);
                  } else if (
                    process.env.NODE_ENV !== 'production' &&
                    process.env.NODE_ENV !== 'test' &&
                    isChrome
                  ) {
                    console[console.info ? 'info' : 'log'](
                      'Download the Vue Devtools extension for a better development experience:\n' +
                      'https://github.com/vuejs/vue-devtools'
                    );
                  }
                }
                if (process.env.NODE_ENV !== 'production' &&
                  process.env.NODE_ENV !== 'test' &&
                  config$1.productionTip !== false &&
                  typeof console !== 'undefined'
                ) {
                  console[console.info ? 'info' : 'log'](
                    "You are running Vue in development mode.\n" +
                    "Make sure to turn on production mode when deploying for production.\n" +
                    "See more tips at https://vuejs.org/guide/deployment.html"
                  );
                }
              }, 0);
            }

            var xhtml = "http://www.w3.org/1999/xhtml";

            var namespaces = {
              svg: "http://www.w3.org/2000/svg",
              xhtml: xhtml,
              xlink: "http://www.w3.org/1999/xlink",
              xml: "http://www.w3.org/XML/1998/namespace",
              xmlns: "http://www.w3.org/2000/xmlns/"
            };

            function namespace(name) {
              var prefix = name += "", i = prefix.indexOf(":");
              if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") { name = name.slice(i + 1); }
              return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
            }

            function creatorInherit(name) {
              return function() {
                var document = this.ownerDocument,
                    uri = this.namespaceURI;
                return uri === xhtml && document.documentElement.namespaceURI === xhtml
                    ? document.createElement(name)
                    : document.createElementNS(uri, name);
              };
            }

            function creatorFixed(fullname) {
              return function() {
                return this.ownerDocument.createElementNS(fullname.space, fullname.local);
              };
            }

            function creator(name) {
              var fullname = namespace(name);
              return (fullname.local
                  ? creatorFixed
                  : creatorInherit)(fullname);
            }

            function none() {}

            function selector(selector) {
              return selector == null ? none : function() {
                return this.querySelector(selector);
              };
            }

            function selection_select(select) {
              if (typeof select !== "function") { select = selector(select); }

              for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
                for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
                  if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                    if ("__data__" in node) { subnode.__data__ = node.__data__; }
                    subgroup[i] = subnode;
                  }
                }
              }

              return new Selection(subgroups, this._parents);
            }

            function empty() {
              return [];
            }

            function selectorAll(selector) {
              return selector == null ? empty : function() {
                return this.querySelectorAll(selector);
              };
            }

            function selection_selectAll(select) {
              if (typeof select !== "function") { select = selectorAll(select); }

              for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
                for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
                  if (node = group[i]) {
                    subgroups.push(select.call(node, node.__data__, i, group));
                    parents.push(node);
                  }
                }
              }

              return new Selection(subgroups, parents);
            }

            var matcher = function(selector) {
              return function() {
                return this.matches(selector);
              };
            };

            if (typeof document !== "undefined") {
              var element = document.documentElement;
              if (!element.matches) {
                var vendorMatches = element.webkitMatchesSelector
                    || element.msMatchesSelector
                    || element.mozMatchesSelector
                    || element.oMatchesSelector;
                matcher = function(selector) {
                  return function() {
                    return vendorMatches.call(this, selector);
                  };
                };
              }
            }

            var matcher$1 = matcher;

            function selection_filter(match) {
              if (typeof match !== "function") { match = matcher$1(match); }

              for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
                for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
                  if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
                    subgroup.push(node);
                  }
                }
              }

              return new Selection(subgroups, this._parents);
            }

            function sparse(update) {
              return new Array(update.length);
            }

            function selection_enter() {
              return new Selection(this._enter || this._groups.map(sparse), this._parents);
            }

            function EnterNode(parent, datum) {
              this.ownerDocument = parent.ownerDocument;
              this.namespaceURI = parent.namespaceURI;
              this._next = null;
              this._parent = parent;
              this.__data__ = datum;
            }

            EnterNode.prototype = {
              constructor: EnterNode,
              appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
              insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
              querySelector: function(selector) { return this._parent.querySelector(selector); },
              querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
            };

            function constant(x) {
              return function() {
                return x;
              };
            }

            var keyPrefix = "$"; // Protect against keys like “__proto__”.

            function bindIndex(parent, group, enter, update, exit, data) {
              var i = 0,
                  node,
                  groupLength = group.length,
                  dataLength = data.length;

              // Put any non-null nodes that fit into update.
              // Put any null nodes into enter.
              // Put any remaining data into enter.
              for (; i < dataLength; ++i) {
                if (node = group[i]) {
                  node.__data__ = data[i];
                  update[i] = node;
                } else {
                  enter[i] = new EnterNode(parent, data[i]);
                }
              }

              // Put any non-null nodes that don’t fit into exit.
              for (; i < groupLength; ++i) {
                if (node = group[i]) {
                  exit[i] = node;
                }
              }
            }

            function bindKey(parent, group, enter, update, exit, data, key) {
              var i,
                  node,
                  nodeByKeyValue = {},
                  groupLength = group.length,
                  dataLength = data.length,
                  keyValues = new Array(groupLength),
                  keyValue;

              // Compute the key for each node.
              // If multiple nodes have the same key, the duplicates are added to exit.
              for (i = 0; i < groupLength; ++i) {
                if (node = group[i]) {
                  keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
                  if (keyValue in nodeByKeyValue) {
                    exit[i] = node;
                  } else {
                    nodeByKeyValue[keyValue] = node;
                  }
                }
              }

              // Compute the key for each datum.
              // If there a node associated with this key, join and add it to update.
              // If there is not (or the key is a duplicate), add it to enter.
              for (i = 0; i < dataLength; ++i) {
                keyValue = keyPrefix + key.call(parent, data[i], i, data);
                if (node = nodeByKeyValue[keyValue]) {
                  update[i] = node;
                  node.__data__ = data[i];
                  nodeByKeyValue[keyValue] = null;
                } else {
                  enter[i] = new EnterNode(parent, data[i]);
                }
              }

              // Add any remaining nodes that were not bound to data to exit.
              for (i = 0; i < groupLength; ++i) {
                if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
                  exit[i] = node;
                }
              }
            }

            function selection_data(value, key) {
              if (!value) {
                data = new Array(this.size()), j = -1;
                this.each(function(d) { data[++j] = d; });
                return data;
              }

              var bind = key ? bindKey : bindIndex,
                  parents = this._parents,
                  groups = this._groups;

              if (typeof value !== "function") { value = constant(value); }

              for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
                var parent = parents[j],
                    group = groups[j],
                    groupLength = group.length,
                    data = value.call(parent, parent && parent.__data__, j, parents),
                    dataLength = data.length,
                    enterGroup = enter[j] = new Array(dataLength),
                    updateGroup = update[j] = new Array(dataLength),
                    exitGroup = exit[j] = new Array(groupLength);

                bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

                // Now connect the enter nodes to their following update node, such that
                // appendChild can insert the materialized enter node before this node,
                // rather than at the end of the parent node.
                for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
                  if (previous = enterGroup[i0]) {
                    if (i0 >= i1) { i1 = i0 + 1; }
                    while (!(next = updateGroup[i1]) && ++i1 < dataLength){ }
                    previous._next = next || null;
                  }
                }
              }

              update = new Selection(update, parents);
              update._enter = enter;
              update._exit = exit;
              return update;
            }

            function selection_exit() {
              return new Selection(this._exit || this._groups.map(sparse), this._parents);
            }

            function selection_merge(selection$$1) {

              for (var groups0 = this._groups, groups1 = selection$$1._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
                for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
                  if (node = group0[i] || group1[i]) {
                    merge[i] = node;
                  }
                }
              }

              for (; j < m0; ++j) {
                merges[j] = groups0[j];
              }

              return new Selection(merges, this._parents);
            }

            function selection_order() {

              for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
                for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
                  if (node = group[i]) {
                    if (next && next !== node.nextSibling) { next.parentNode.insertBefore(node, next); }
                    next = node;
                  }
                }
              }

              return this;
            }

            function selection_sort(compare) {
              if (!compare) { compare = ascending; }

              function compareNode(a, b) {
                return a && b ? compare(a.__data__, b.__data__) : !a - !b;
              }

              for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
                for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
                  if (node = group[i]) {
                    sortgroup[i] = node;
                  }
                }
                sortgroup.sort(compareNode);
              }

              return new Selection(sortgroups, this._parents).order();
            }

            function ascending(a, b) {
              return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
            }

            function selection_call() {
              var callback = arguments[0];
              arguments[0] = this;
              callback.apply(null, arguments);
              return this;
            }

            function selection_nodes() {
              var nodes = new Array(this.size()), i = -1;
              this.each(function() { nodes[++i] = this; });
              return nodes;
            }

            function selection_node() {

              for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
                for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
                  var node = group[i];
                  if (node) { return node; }
                }
              }

              return null;
            }

            function selection_size() {
              var size = 0;
              this.each(function() { ++size; });
              return size;
            }

            function selection_empty() {
              return !this.node();
            }

            function selection_each(callback) {

              for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
                for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
                  if (node = group[i]) { callback.call(node, node.__data__, i, group); }
                }
              }

              return this;
            }

            function attrRemove(name) {
              return function() {
                this.removeAttribute(name);
              };
            }

            function attrRemoveNS(fullname) {
              return function() {
                this.removeAttributeNS(fullname.space, fullname.local);
              };
            }

            function attrConstant(name, value) {
              return function() {
                this.setAttribute(name, value);
              };
            }

            function attrConstantNS(fullname, value) {
              return function() {
                this.setAttributeNS(fullname.space, fullname.local, value);
              };
            }

            function attrFunction(name, value) {
              return function() {
                var v = value.apply(this, arguments);
                if (v == null) { this.removeAttribute(name); }
                else { this.setAttribute(name, v); }
              };
            }

            function attrFunctionNS(fullname, value) {
              return function() {
                var v = value.apply(this, arguments);
                if (v == null) { this.removeAttributeNS(fullname.space, fullname.local); }
                else { this.setAttributeNS(fullname.space, fullname.local, v); }
              };
            }

            function selection_attr(name, value) {
              var fullname = namespace(name);

              if (arguments.length < 2) {
                var node = this.node();
                return fullname.local
                    ? node.getAttributeNS(fullname.space, fullname.local)
                    : node.getAttribute(fullname);
              }

              return this.each((value == null
                  ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
                  ? (fullname.local ? attrFunctionNS : attrFunction)
                  : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
            }

            function defaultView(node) {
              return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
                  || (node.document && node) // node is a Window
                  || node.defaultView; // node is a Document
            }

            function styleRemove(name) {
              return function() {
                this.style.removeProperty(name);
              };
            }

            function styleConstant(name, value, priority) {
              return function() {
                this.style.setProperty(name, value, priority);
              };
            }

            function styleFunction(name, value, priority) {
              return function() {
                var v = value.apply(this, arguments);
                if (v == null) { this.style.removeProperty(name); }
                else { this.style.setProperty(name, v, priority); }
              };
            }

            function selection_style(name, value, priority) {
              return arguments.length > 1
                  ? this.each((value == null
                        ? styleRemove : typeof value === "function"
                        ? styleFunction
                        : styleConstant)(name, value, priority == null ? "" : priority))
                  : styleValue(this.node(), name);
            }

            function styleValue(node, name) {
              return node.style.getPropertyValue(name)
                  || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
            }

            function propertyRemove(name) {
              return function() {
                delete this[name];
              };
            }

            function propertyConstant(name, value) {
              return function() {
                this[name] = value;
              };
            }

            function propertyFunction(name, value) {
              return function() {
                var v = value.apply(this, arguments);
                if (v == null) { delete this[name]; }
                else { this[name] = v; }
              };
            }

            function selection_property(name, value) {
              return arguments.length > 1
                  ? this.each((value == null
                      ? propertyRemove : typeof value === "function"
                      ? propertyFunction
                      : propertyConstant)(name, value))
                  : this.node()[name];
            }

            function classArray(string) {
              return string.trim().split(/^|\s+/);
            }

            function classList(node) {
              return node.classList || new ClassList(node);
            }

            function ClassList(node) {
              this._node = node;
              this._names = classArray(node.getAttribute("class") || "");
            }

            ClassList.prototype = {
              add: function(name) {
                var i = this._names.indexOf(name);
                if (i < 0) {
                  this._names.push(name);
                  this._node.setAttribute("class", this._names.join(" "));
                }
              },
              remove: function(name) {
                var i = this._names.indexOf(name);
                if (i >= 0) {
                  this._names.splice(i, 1);
                  this._node.setAttribute("class", this._names.join(" "));
                }
              },
              contains: function(name) {
                return this._names.indexOf(name) >= 0;
              }
            };

            function classedAdd(node, names) {
              var list = classList(node), i = -1, n = names.length;
              while (++i < n) { list.add(names[i]); }
            }

            function classedRemove(node, names) {
              var list = classList(node), i = -1, n = names.length;
              while (++i < n) { list.remove(names[i]); }
            }

            function classedTrue(names) {
              return function() {
                classedAdd(this, names);
              };
            }

            function classedFalse(names) {
              return function() {
                classedRemove(this, names);
              };
            }

            function classedFunction(names, value) {
              return function() {
                (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
              };
            }

            function selection_classed(name, value) {
              var names = classArray(name + "");

              if (arguments.length < 2) {
                var list = classList(this.node()), i = -1, n = names.length;
                while (++i < n) { if (!list.contains(names[i])) { return false; } }
                return true;
              }

              return this.each((typeof value === "function"
                  ? classedFunction : value
                  ? classedTrue
                  : classedFalse)(names, value));
            }

            function textRemove() {
              this.textContent = "";
            }

            function textConstant(value) {
              return function() {
                this.textContent = value;
              };
            }

            function textFunction(value) {
              return function() {
                var v = value.apply(this, arguments);
                this.textContent = v == null ? "" : v;
              };
            }

            function selection_text(value) {
              return arguments.length
                  ? this.each(value == null
                      ? textRemove : (typeof value === "function"
                      ? textFunction
                      : textConstant)(value))
                  : this.node().textContent;
            }

            function htmlRemove() {
              this.innerHTML = "";
            }

            function htmlConstant(value) {
              return function() {
                this.innerHTML = value;
              };
            }

            function htmlFunction(value) {
              return function() {
                var v = value.apply(this, arguments);
                this.innerHTML = v == null ? "" : v;
              };
            }

            function selection_html(value) {
              return arguments.length
                  ? this.each(value == null
                      ? htmlRemove : (typeof value === "function"
                      ? htmlFunction
                      : htmlConstant)(value))
                  : this.node().innerHTML;
            }

            function raise() {
              if (this.nextSibling) { this.parentNode.appendChild(this); }
            }

            function selection_raise() {
              return this.each(raise);
            }

            function lower() {
              if (this.previousSibling) { this.parentNode.insertBefore(this, this.parentNode.firstChild); }
            }

            function selection_lower() {
              return this.each(lower);
            }

            function selection_append(name) {
              var create = typeof name === "function" ? name : creator(name);
              return this.select(function() {
                return this.appendChild(create.apply(this, arguments));
              });
            }

            function constantNull() {
              return null;
            }

            function selection_insert(name, before) {
              var create = typeof name === "function" ? name : creator(name),
                  select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
              return this.select(function() {
                return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
              });
            }

            function remove$3() {
              var parent = this.parentNode;
              if (parent) { parent.removeChild(this); }
            }

            function selection_remove() {
              return this.each(remove$3);
            }

            function selection_cloneShallow() {
              return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
            }

            function selection_cloneDeep() {
              return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
            }

            function selection_clone(deep) {
              return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
            }

            function selection_datum(value) {
              return arguments.length
                  ? this.property("__data__", value)
                  : this.node().__data__;
            }

            var filterEvents = {};

            if (typeof document !== "undefined") {
              var element$1 = document.documentElement;
              if (!("onmouseenter" in element$1)) {
                filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
              }
            }

            function filterContextListener(listener, index, group) {
              listener = contextListener(listener, index, group);
              return function(event) {
                var related = event.relatedTarget;
                if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
                  listener.call(this, event);
                }
              };
            }

            function contextListener(listener, index, group) {
              return function(event1) {
                try {
                  listener.call(this, this.__data__, index, group);
                } finally {
                }
              };
            }

            function parseTypenames(typenames) {
              return typenames.trim().split(/^|\s+/).map(function(t) {
                var name = "", i = t.indexOf(".");
                if (i >= 0) { name = t.slice(i + 1), t = t.slice(0, i); }
                return {type: t, name: name};
              });
            }

            function onRemove(typename) {
              return function() {
                var this$1 = this;

                var on = this.__on;
                if (!on) { return; }
                for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
                  if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
                    this$1.removeEventListener(o.type, o.listener, o.capture);
                  } else {
                    on[++i] = o;
                  }
                }
                if (++i) { on.length = i; }
                else { delete this.__on; }
              };
            }

            function onAdd(typename, value, capture) {
              var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
              return function(d, i, group) {
                var this$1 = this;

                var on = this.__on, o, listener = wrap(value, i, group);
                if (on) { for (var j = 0, m = on.length; j < m; ++j) {
                  if ((o = on[j]).type === typename.type && o.name === typename.name) {
                    this$1.removeEventListener(o.type, o.listener, o.capture);
                    this$1.addEventListener(o.type, o.listener = listener, o.capture = capture);
                    o.value = value;
                    return;
                  }
                } }
                this.addEventListener(typename.type, listener, capture);
                o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
                if (!on) { this.__on = [o]; }
                else { on.push(o); }
              };
            }

            function selection_on(typename, value, capture) {
              var this$1 = this;

              var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

              if (arguments.length < 2) {
                var on = this.node().__on;
                if (on) { for (var j = 0, m = on.length, o; j < m; ++j) {
                  for (i = 0, o = on[j]; i < n; ++i) {
                    if ((t = typenames[i]).type === o.type && t.name === o.name) {
                      return o.value;
                    }
                  }
                } }
                return;
              }

              on = value ? onAdd : onRemove;
              if (capture == null) { capture = false; }
              for (i = 0; i < n; ++i) { this$1.each(on(typenames[i], value, capture)); }
              return this;
            }

            function dispatchEvent(node, type, params) {
              var window = defaultView(node),
                  event = window.CustomEvent;

              if (typeof event === "function") {
                event = new event(type, params);
              } else {
                event = window.document.createEvent("Event");
                if (params) { event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail; }
                else { event.initEvent(type, false, false); }
              }

              node.dispatchEvent(event);
            }

            function dispatchConstant(type, params) {
              return function() {
                return dispatchEvent(this, type, params);
              };
            }

            function dispatchFunction(type, params) {
              return function() {
                return dispatchEvent(this, type, params.apply(this, arguments));
              };
            }

            function selection_dispatch(type, params) {
              return this.each((typeof params === "function"
                  ? dispatchFunction
                  : dispatchConstant)(type, params));
            }

            var root = [null];

            function Selection(groups, parents) {
              this._groups = groups;
              this._parents = parents;
            }

            function selection() {
              return new Selection([[document.documentElement]], root);
            }

            Selection.prototype = selection.prototype = {
              constructor: Selection,
              select: selection_select,
              selectAll: selection_selectAll,
              filter: selection_filter,
              data: selection_data,
              enter: selection_enter,
              exit: selection_exit,
              merge: selection_merge,
              order: selection_order,
              sort: selection_sort,
              call: selection_call,
              nodes: selection_nodes,
              node: selection_node,
              size: selection_size,
              empty: selection_empty,
              each: selection_each,
              attr: selection_attr,
              style: selection_style,
              property: selection_property,
              classed: selection_classed,
              text: selection_text,
              html: selection_html,
              raise: selection_raise,
              lower: selection_lower,
              append: selection_append,
              insert: selection_insert,
              remove: selection_remove,
              clone: selection_clone,
              datum: selection_datum,
              on: selection_on,
              dispatch: selection_dispatch
            };

            function select(selector) {
              return typeof selector === "string"
                  ? new Selection([[document.querySelector(selector)]], [document.documentElement])
                  : new Selection([[selector]], root);
            }

            var slice = Array.prototype.slice;

            function identity$1(x) {
              return x;
            }

            var top = 1,
                right = 2,
                bottom = 3,
                left = 4,
                epsilon = 1e-6;

            function translateX(x) {
              return "translate(" + (x + 0.5) + ",0)";
            }

            function translateY(y) {
              return "translate(0," + (y + 0.5) + ")";
            }

            function number(scale) {
              return function(d) {
                return +scale(d);
              };
            }

            function center(scale) {
              var offset = Math.max(0, scale.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
              if (scale.round()) { offset = Math.round(offset); }
              return function(d) {
                return +scale(d) + offset;
              };
            }

            function entering() {
              return !this.__axis;
            }

            function axis(orient, scale) {
              var tickArguments = [],
                  tickValues = null,
                  tickFormat = null,
                  tickSizeInner = 6,
                  tickSizeOuter = 6,
                  tickPadding = 3,
                  k = orient === top || orient === left ? -1 : 1,
                  x = orient === left || orient === right ? "x" : "y",
                  transform = orient === top || orient === bottom ? translateX : translateY;

              function axis(context) {
                var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
                    format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$1) : tickFormat,
                    spacing = Math.max(tickSizeInner, 0) + tickPadding,
                    range = scale.range(),
                    range0 = +range[0] + 0.5,
                    range1 = +range[range.length - 1] + 0.5,
                    position = (scale.bandwidth ? center : number)(scale.copy()),
                    selection = context.selection ? context.selection() : context,
                    path = selection.selectAll(".domain").data([null]),
                    tick = selection.selectAll(".tick").data(values, scale).order(),
                    tickExit = tick.exit(),
                    tickEnter = tick.enter().append("g").attr("class", "tick"),
                    line = tick.select("line"),
                    text = tick.select("text");

                path = path.merge(path.enter().insert("path", ".tick")
                    .attr("class", "domain")
                    .attr("stroke", "#000"));

                tick = tick.merge(tickEnter);

                line = line.merge(tickEnter.append("line")
                    .attr("stroke", "#000")
                    .attr(x + "2", k * tickSizeInner));

                text = text.merge(tickEnter.append("text")
                    .attr("fill", "#000")
                    .attr(x, k * spacing)
                    .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

                if (context !== selection) {
                  path = path.transition(context);
                  tick = tick.transition(context);
                  line = line.transition(context);
                  text = text.transition(context);

                  tickExit = tickExit.transition(context)
                      .attr("opacity", epsilon)
                      .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d) : this.getAttribute("transform"); });

                  tickEnter
                      .attr("opacity", epsilon)
                      .attr("transform", function(d) { var p = this.parentNode.__axis; return transform(p && isFinite(p = p(d)) ? p : position(d)); });
                }

                tickExit.remove();

                path
                    .attr("d", orient === left || orient == right
                        ? "M" + k * tickSizeOuter + "," + range0 + "H0.5V" + range1 + "H" + k * tickSizeOuter
                        : "M" + range0 + "," + k * tickSizeOuter + "V0.5H" + range1 + "V" + k * tickSizeOuter);

                tick
                    .attr("opacity", 1)
                    .attr("transform", function(d) { return transform(position(d)); });

                line
                    .attr(x + "2", k * tickSizeInner);

                text
                    .attr(x, k * spacing)
                    .text(format);

                selection.filter(entering)
                    .attr("fill", "none")
                    .attr("font-size", 10)
                    .attr("font-family", "sans-serif")
                    .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

                selection
                    .each(function() { this.__axis = position; });
              }

              axis.scale = function(_) {
                return arguments.length ? (scale = _, axis) : scale;
              };

              axis.ticks = function() {
                return tickArguments = slice.call(arguments), axis;
              };

              axis.tickArguments = function(_) {
                return arguments.length ? (tickArguments = _ == null ? [] : slice.call(_), axis) : tickArguments.slice();
              };

              axis.tickValues = function(_) {
                return arguments.length ? (tickValues = _ == null ? null : slice.call(_), axis) : tickValues && tickValues.slice();
              };

              axis.tickFormat = function(_) {
                return arguments.length ? (tickFormat = _, axis) : tickFormat;
              };

              axis.tickSize = function(_) {
                return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
              };

              axis.tickSizeInner = function(_) {
                return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
              };

              axis.tickSizeOuter = function(_) {
                return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
              };

              axis.tickPadding = function(_) {
                return arguments.length ? (tickPadding = +_, axis) : tickPadding;
              };

              return axis;
            }

            function axisBottom(scale) {
              return axis(bottom, scale);
            }

            function axisLeft(scale) {
              return axis(left, scale);
            }

            function ascending$1(a, b) {
              return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
            }

            function bisector(compare) {
              if (compare.length === 1) { compare = ascendingComparator(compare); }
              return {
                left: function(a, x, lo, hi) {
                  if (lo == null) { lo = 0; }
                  if (hi == null) { hi = a.length; }
                  while (lo < hi) {
                    var mid = lo + hi >>> 1;
                    if (compare(a[mid], x) < 0) { lo = mid + 1; }
                    else { hi = mid; }
                  }
                  return lo;
                },
                right: function(a, x, lo, hi) {
                  if (lo == null) { lo = 0; }
                  if (hi == null) { hi = a.length; }
                  while (lo < hi) {
                    var mid = lo + hi >>> 1;
                    if (compare(a[mid], x) > 0) { hi = mid; }
                    else { lo = mid + 1; }
                  }
                  return lo;
                }
              };
            }

            function ascendingComparator(f) {
              return function(d, x) {
                return ascending$1(f(d), x);
              };
            }

            var ascendingBisect = bisector(ascending$1);
            var bisectRight = ascendingBisect.right;

            function range(start, stop, step) {
              start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

              var i = -1,
                  n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
                  range = new Array(n);

              while (++i < n) {
                range[i] = start + i * step;
              }

              return range;
            }

            var e10 = Math.sqrt(50),
                e5 = Math.sqrt(10),
                e2 = Math.sqrt(2);

            function ticks(start, stop, count) {
              var reverse,
                  i = -1,
                  n,
                  ticks,
                  step;

              stop = +stop, start = +start, count = +count;
              if (start === stop && count > 0) { return [start]; }
              if (reverse = stop < start) { n = start, start = stop, stop = n; }
              if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) { return []; }

              if (step > 0) {
                start = Math.ceil(start / step);
                stop = Math.floor(stop / step);
                ticks = new Array(n = Math.ceil(stop - start + 1));
                while (++i < n) { ticks[i] = (start + i) * step; }
              } else {
                start = Math.floor(start * step);
                stop = Math.ceil(stop * step);
                ticks = new Array(n = Math.ceil(start - stop + 1));
                while (++i < n) { ticks[i] = (start - i) / step; }
              }

              if (reverse) { ticks.reverse(); }

              return ticks;
            }

            function tickIncrement(start, stop, count) {
              var step = (stop - start) / Math.max(0, count),
                  power = Math.floor(Math.log(step) / Math.LN10),
                  error = step / Math.pow(10, power);
              return power >= 0
                  ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
                  : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
            }

            function tickStep(start, stop, count) {
              var step0 = Math.abs(stop - start) / Math.max(0, count),
                  step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
                  error = step0 / step1;
              if (error >= e10) { step1 *= 10; }
              else if (error >= e5) { step1 *= 5; }
              else if (error >= e2) { step1 *= 2; }
              return stop < start ? -step1 : step1;
            }

            var prefix = "$";

            function Map() {}

            Map.prototype = map$1.prototype = {
              constructor: Map,
              has: function(key) {
                return (prefix + key) in this;
              },
              get: function(key) {
                return this[prefix + key];
              },
              set: function(key, value) {
                this[prefix + key] = value;
                return this;
              },
              remove: function(key) {
                var property = prefix + key;
                return property in this && delete this[property];
              },
              clear: function() {
                var this$1 = this;

                for (var property in this$1) { if (property[0] === prefix) { delete this$1[property]; } }
              },
              keys: function() {
                var this$1 = this;

                var keys = [];
                for (var property in this$1) { if (property[0] === prefix) { keys.push(property.slice(1)); } }
                return keys;
              },
              values: function() {
                var this$1 = this;

                var values = [];
                for (var property in this$1) { if (property[0] === prefix) { values.push(this$1[property]); } }
                return values;
              },
              entries: function() {
                var this$1 = this;

                var entries = [];
                for (var property in this$1) { if (property[0] === prefix) { entries.push({key: property.slice(1), value: this$1[property]}); } }
                return entries;
              },
              size: function() {
                var this$1 = this;

                var size = 0;
                for (var property in this$1) { if (property[0] === prefix) { ++size; } }
                return size;
              },
              empty: function() {
                var this$1 = this;

                for (var property in this$1) { if (property[0] === prefix) { return false; } }
                return true;
              },
              each: function(f) {
                var this$1 = this;

                for (var property in this$1) { if (property[0] === prefix) { f(this$1[property], property.slice(1), this$1); } }
              }
            };

            function map$1(object, f) {
              var map = new Map;

              // Copy constructor.
              if (object instanceof Map) { object.each(function(value, key) { map.set(key, value); }); }

              // Index array by numeric index or specified key function.
              else if (Array.isArray(object)) {
                var i = -1,
                    n = object.length,
                    o;

                if (f == null) { while (++i < n) { map.set(i, object[i]); } }
                else { while (++i < n) { map.set(f(o = object[i], i, object), o); } }
              }

              // Convert object to map.
              else if (object) { for (var key in object) { map.set(key, object[key]); } }

              return map;
            }

            function Set$1() {}

            var proto = map$1.prototype;

            Set$1.prototype = set$1.prototype = {
              constructor: Set$1,
              has: proto.has,
              add: function(value) {
                value += "";
                this[prefix + value] = value;
                return this;
              },
              remove: proto.remove,
              clear: proto.clear,
              values: proto.keys,
              size: proto.size,
              empty: proto.empty,
              each: proto.each
            };

            function set$1(object, f) {
              var set = new Set$1;

              // Copy constructor.
              if (object instanceof Set$1) { object.each(function(value) { set.add(value); }); }

              // Otherwise, assume it’s an array.
              else if (object) {
                var i = -1, n = object.length;
                if (f == null) { while (++i < n) { set.add(object[i]); } }
                else { while (++i < n) { set.add(f(object[i], i, object)); } }
              }

              return set;
            }

            var array$1 = Array.prototype;

            var map$2 = array$1.map;
            var slice$2 = array$1.slice;

            var implicit = {name: "implicit"};

            function ordinal(range) {
              var index = map$1(),
                  domain = [],
                  unknown = implicit;

              range = range == null ? [] : slice$2.call(range);

              function scale(d) {
                var key = d + "", i = index.get(key);
                if (!i) {
                  if (unknown !== implicit) { return unknown; }
                  index.set(key, i = domain.push(d));
                }
                return range[(i - 1) % range.length];
              }

              scale.domain = function(_) {
                if (!arguments.length) { return domain.slice(); }
                domain = [], index = map$1();
                var i = -1, n = _.length, d, key;
                while (++i < n) { if (!index.has(key = (d = _[i]) + "")) { index.set(key, domain.push(d)); } }
                return scale;
              };

              scale.range = function(_) {
                return arguments.length ? (range = slice$2.call(_), scale) : range.slice();
              };

              scale.unknown = function(_) {
                return arguments.length ? (unknown = _, scale) : unknown;
              };

              scale.copy = function() {
                return ordinal()
                    .domain(domain)
                    .range(range)
                    .unknown(unknown);
              };

              return scale;
            }

            function band() {
              var scale = ordinal().unknown(undefined),
                  domain = scale.domain,
                  ordinalRange = scale.range,
                  range$$1 = [0, 1],
                  step,
                  bandwidth,
                  round = false,
                  paddingInner = 0,
                  paddingOuter = 0,
                  align = 0.5;

              delete scale.unknown;

              function rescale() {
                var n = domain().length,
                    reverse = range$$1[1] < range$$1[0],
                    start = range$$1[reverse - 0],
                    stop = range$$1[1 - reverse];
                step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
                if (round) { step = Math.floor(step); }
                start += (stop - start - step * (n - paddingInner)) * align;
                bandwidth = step * (1 - paddingInner);
                if (round) { start = Math.round(start), bandwidth = Math.round(bandwidth); }
                var values = range(n).map(function(i) { return start + step * i; });
                return ordinalRange(reverse ? values.reverse() : values);
              }

              scale.domain = function(_) {
                return arguments.length ? (domain(_), rescale()) : domain();
              };

              scale.range = function(_) {
                return arguments.length ? (range$$1 = [+_[0], +_[1]], rescale()) : range$$1.slice();
              };

              scale.rangeRound = function(_) {
                return range$$1 = [+_[0], +_[1]], round = true, rescale();
              };

              scale.bandwidth = function() {
                return bandwidth;
              };

              scale.step = function() {
                return step;
              };

              scale.round = function(_) {
                return arguments.length ? (round = !!_, rescale()) : round;
              };

              scale.padding = function(_) {
                return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
              };

              scale.paddingInner = function(_) {
                return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
              };

              scale.paddingOuter = function(_) {
                return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
              };

              scale.align = function(_) {
                return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
              };

              scale.copy = function() {
                return band()
                    .domain(domain())
                    .range(range$$1)
                    .round(round)
                    .paddingInner(paddingInner)
                    .paddingOuter(paddingOuter)
                    .align(align);
              };

              return rescale();
            }

            function define(constructor, factory, prototype) {
              constructor.prototype = factory.prototype = prototype;
              prototype.constructor = constructor;
            }

            function extend$1(parent, definition) {
              var prototype = Object.create(parent.prototype);
              for (var key in definition) { prototype[key] = definition[key]; }
              return prototype;
            }

            function Color() {}

            var darker = 0.7;
            var brighter = 1 / darker;

            var reI = "\\s*([+-]?\\d+)\\s*",
                reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
                reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
                reHex3 = /^#([0-9a-f]{3})$/,
                reHex6 = /^#([0-9a-f]{6})$/,
                reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
                reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
                reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
                reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
                reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
                reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

            var named = {
              aliceblue: 0xf0f8ff,
              antiquewhite: 0xfaebd7,
              aqua: 0x00ffff,
              aquamarine: 0x7fffd4,
              azure: 0xf0ffff,
              beige: 0xf5f5dc,
              bisque: 0xffe4c4,
              black: 0x000000,
              blanchedalmond: 0xffebcd,
              blue: 0x0000ff,
              blueviolet: 0x8a2be2,
              brown: 0xa52a2a,
              burlywood: 0xdeb887,
              cadetblue: 0x5f9ea0,
              chartreuse: 0x7fff00,
              chocolate: 0xd2691e,
              coral: 0xff7f50,
              cornflowerblue: 0x6495ed,
              cornsilk: 0xfff8dc,
              crimson: 0xdc143c,
              cyan: 0x00ffff,
              darkblue: 0x00008b,
              darkcyan: 0x008b8b,
              darkgoldenrod: 0xb8860b,
              darkgray: 0xa9a9a9,
              darkgreen: 0x006400,
              darkgrey: 0xa9a9a9,
              darkkhaki: 0xbdb76b,
              darkmagenta: 0x8b008b,
              darkolivegreen: 0x556b2f,
              darkorange: 0xff8c00,
              darkorchid: 0x9932cc,
              darkred: 0x8b0000,
              darksalmon: 0xe9967a,
              darkseagreen: 0x8fbc8f,
              darkslateblue: 0x483d8b,
              darkslategray: 0x2f4f4f,
              darkslategrey: 0x2f4f4f,
              darkturquoise: 0x00ced1,
              darkviolet: 0x9400d3,
              deeppink: 0xff1493,
              deepskyblue: 0x00bfff,
              dimgray: 0x696969,
              dimgrey: 0x696969,
              dodgerblue: 0x1e90ff,
              firebrick: 0xb22222,
              floralwhite: 0xfffaf0,
              forestgreen: 0x228b22,
              fuchsia: 0xff00ff,
              gainsboro: 0xdcdcdc,
              ghostwhite: 0xf8f8ff,
              gold: 0xffd700,
              goldenrod: 0xdaa520,
              gray: 0x808080,
              green: 0x008000,
              greenyellow: 0xadff2f,
              grey: 0x808080,
              honeydew: 0xf0fff0,
              hotpink: 0xff69b4,
              indianred: 0xcd5c5c,
              indigo: 0x4b0082,
              ivory: 0xfffff0,
              khaki: 0xf0e68c,
              lavender: 0xe6e6fa,
              lavenderblush: 0xfff0f5,
              lawngreen: 0x7cfc00,
              lemonchiffon: 0xfffacd,
              lightblue: 0xadd8e6,
              lightcoral: 0xf08080,
              lightcyan: 0xe0ffff,
              lightgoldenrodyellow: 0xfafad2,
              lightgray: 0xd3d3d3,
              lightgreen: 0x90ee90,
              lightgrey: 0xd3d3d3,
              lightpink: 0xffb6c1,
              lightsalmon: 0xffa07a,
              lightseagreen: 0x20b2aa,
              lightskyblue: 0x87cefa,
              lightslategray: 0x778899,
              lightslategrey: 0x778899,
              lightsteelblue: 0xb0c4de,
              lightyellow: 0xffffe0,
              lime: 0x00ff00,
              limegreen: 0x32cd32,
              linen: 0xfaf0e6,
              magenta: 0xff00ff,
              maroon: 0x800000,
              mediumaquamarine: 0x66cdaa,
              mediumblue: 0x0000cd,
              mediumorchid: 0xba55d3,
              mediumpurple: 0x9370db,
              mediumseagreen: 0x3cb371,
              mediumslateblue: 0x7b68ee,
              mediumspringgreen: 0x00fa9a,
              mediumturquoise: 0x48d1cc,
              mediumvioletred: 0xc71585,
              midnightblue: 0x191970,
              mintcream: 0xf5fffa,
              mistyrose: 0xffe4e1,
              moccasin: 0xffe4b5,
              navajowhite: 0xffdead,
              navy: 0x000080,
              oldlace: 0xfdf5e6,
              olive: 0x808000,
              olivedrab: 0x6b8e23,
              orange: 0xffa500,
              orangered: 0xff4500,
              orchid: 0xda70d6,
              palegoldenrod: 0xeee8aa,
              palegreen: 0x98fb98,
              paleturquoise: 0xafeeee,
              palevioletred: 0xdb7093,
              papayawhip: 0xffefd5,
              peachpuff: 0xffdab9,
              peru: 0xcd853f,
              pink: 0xffc0cb,
              plum: 0xdda0dd,
              powderblue: 0xb0e0e6,
              purple: 0x800080,
              rebeccapurple: 0x663399,
              red: 0xff0000,
              rosybrown: 0xbc8f8f,
              royalblue: 0x4169e1,
              saddlebrown: 0x8b4513,
              salmon: 0xfa8072,
              sandybrown: 0xf4a460,
              seagreen: 0x2e8b57,
              seashell: 0xfff5ee,
              sienna: 0xa0522d,
              silver: 0xc0c0c0,
              skyblue: 0x87ceeb,
              slateblue: 0x6a5acd,
              slategray: 0x708090,
              slategrey: 0x708090,
              snow: 0xfffafa,
              springgreen: 0x00ff7f,
              steelblue: 0x4682b4,
              tan: 0xd2b48c,
              teal: 0x008080,
              thistle: 0xd8bfd8,
              tomato: 0xff6347,
              turquoise: 0x40e0d0,
              violet: 0xee82ee,
              wheat: 0xf5deb3,
              white: 0xffffff,
              whitesmoke: 0xf5f5f5,
              yellow: 0xffff00,
              yellowgreen: 0x9acd32
            };

            define(Color, color, {
              displayable: function() {
                return this.rgb().displayable();
              },
              toString: function() {
                return this.rgb() + "";
              }
            });

            function color(format) {
              var m;
              format = (format + "").trim().toLowerCase();
              return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
                  : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
                  : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
                  : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
                  : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
                  : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
                  : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
                  : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
                  : named.hasOwnProperty(format) ? rgbn(named[format])
                  : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
                  : null;
            }

            function rgbn(n) {
              return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
            }

            function rgba(r, g, b, a) {
              if (a <= 0) { r = g = b = NaN; }
              return new Rgb(r, g, b, a);
            }

            function rgbConvert(o) {
              if (!(o instanceof Color)) { o = color(o); }
              if (!o) { return new Rgb; }
              o = o.rgb();
              return new Rgb(o.r, o.g, o.b, o.opacity);
            }

            function rgb(r, g, b, opacity) {
              return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
            }

            function Rgb(r, g, b, opacity) {
              this.r = +r;
              this.g = +g;
              this.b = +b;
              this.opacity = +opacity;
            }

            define(Rgb, rgb, extend$1(Color, {
              brighter: function(k) {
                k = k == null ? brighter : Math.pow(brighter, k);
                return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
              },
              darker: function(k) {
                k = k == null ? darker : Math.pow(darker, k);
                return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
              },
              rgb: function() {
                return this;
              },
              displayable: function() {
                return (0 <= this.r && this.r <= 255)
                    && (0 <= this.g && this.g <= 255)
                    && (0 <= this.b && this.b <= 255)
                    && (0 <= this.opacity && this.opacity <= 1);
              },
              toString: function() {
                var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
                return (a === 1 ? "rgb(" : "rgba(")
                    + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
                    + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
                    + Math.max(0, Math.min(255, Math.round(this.b) || 0))
                    + (a === 1 ? ")" : ", " + a + ")");
              }
            }));

            function hsla(h, s, l, a) {
              if (a <= 0) { h = s = l = NaN; }
              else if (l <= 0 || l >= 1) { h = s = NaN; }
              else if (s <= 0) { h = NaN; }
              return new Hsl(h, s, l, a);
            }

            function hslConvert(o) {
              if (o instanceof Hsl) { return new Hsl(o.h, o.s, o.l, o.opacity); }
              if (!(o instanceof Color)) { o = color(o); }
              if (!o) { return new Hsl; }
              if (o instanceof Hsl) { return o; }
              o = o.rgb();
              var r = o.r / 255,
                  g = o.g / 255,
                  b = o.b / 255,
                  min = Math.min(r, g, b),
                  max = Math.max(r, g, b),
                  h = NaN,
                  s = max - min,
                  l = (max + min) / 2;
              if (s) {
                if (r === max) { h = (g - b) / s + (g < b) * 6; }
                else if (g === max) { h = (b - r) / s + 2; }
                else { h = (r - g) / s + 4; }
                s /= l < 0.5 ? max + min : 2 - max - min;
                h *= 60;
              } else {
                s = l > 0 && l < 1 ? 0 : h;
              }
              return new Hsl(h, s, l, o.opacity);
            }

            function hsl(h, s, l, opacity) {
              return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
            }

            function Hsl(h, s, l, opacity) {
              this.h = +h;
              this.s = +s;
              this.l = +l;
              this.opacity = +opacity;
            }

            define(Hsl, hsl, extend$1(Color, {
              brighter: function(k) {
                k = k == null ? brighter : Math.pow(brighter, k);
                return new Hsl(this.h, this.s, this.l * k, this.opacity);
              },
              darker: function(k) {
                k = k == null ? darker : Math.pow(darker, k);
                return new Hsl(this.h, this.s, this.l * k, this.opacity);
              },
              rgb: function() {
                var h = this.h % 360 + (this.h < 0) * 360,
                    s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
                    l = this.l,
                    m2 = l + (l < 0.5 ? l : 1 - l) * s,
                    m1 = 2 * l - m2;
                return new Rgb(
                  hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
                  hsl2rgb(h, m1, m2),
                  hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
                  this.opacity
                );
              },
              displayable: function() {
                return (0 <= this.s && this.s <= 1 || isNaN(this.s))
                    && (0 <= this.l && this.l <= 1)
                    && (0 <= this.opacity && this.opacity <= 1);
              }
            }));

            /* From FvD 13.37, CSS Color Module Level 3 */
            function hsl2rgb(h, m1, m2) {
              return (h < 60 ? m1 + (m2 - m1) * h / 60
                  : h < 180 ? m2
                  : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
                  : m1) * 255;
            }

            var deg2rad = Math.PI / 180;
            var rad2deg = 180 / Math.PI;

            // https://beta.observablehq.com/@mbostock/lab-and-rgb
            var K = 18,
                Xn = 0.96422,
                Yn = 1,
                Zn = 0.82521,
                t0 = 4 / 29,
                t1 = 6 / 29,
                t2 = 3 * t1 * t1,
                t3 = t1 * t1 * t1;

            function labConvert(o) {
              if (o instanceof Lab) { return new Lab(o.l, o.a, o.b, o.opacity); }
              if (o instanceof Hcl) {
                if (isNaN(o.h)) { return new Lab(o.l, 0, 0, o.opacity); }
                var h = o.h * deg2rad;
                return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
              }
              if (!(o instanceof Rgb)) { o = rgbConvert(o); }
              var r = rgb2lrgb(o.r),
                  g = rgb2lrgb(o.g),
                  b = rgb2lrgb(o.b),
                  y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
              if (r === g && g === b) { x = z = y; } else {
                x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
                z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
              }
              return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
            }

            function lab(l, a, b, opacity) {
              return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
            }

            function Lab(l, a, b, opacity) {
              this.l = +l;
              this.a = +a;
              this.b = +b;
              this.opacity = +opacity;
            }

            define(Lab, lab, extend$1(Color, {
              brighter: function(k) {
                return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
              },
              darker: function(k) {
                return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
              },
              rgb: function() {
                var y = (this.l + 16) / 116,
                    x = isNaN(this.a) ? y : y + this.a / 500,
                    z = isNaN(this.b) ? y : y - this.b / 200;
                x = Xn * lab2xyz(x);
                y = Yn * lab2xyz(y);
                z = Zn * lab2xyz(z);
                return new Rgb(
                  lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
                  lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
                  lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
                  this.opacity
                );
              }
            }));

            function xyz2lab(t) {
              return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
            }

            function lab2xyz(t) {
              return t > t1 ? t * t * t : t2 * (t - t0);
            }

            function lrgb2rgb(x) {
              return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
            }

            function rgb2lrgb(x) {
              return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
            }

            function hclConvert(o) {
              if (o instanceof Hcl) { return new Hcl(o.h, o.c, o.l, o.opacity); }
              if (!(o instanceof Lab)) { o = labConvert(o); }
              if (o.a === 0 && o.b === 0) { return new Hcl(NaN, 0, o.l, o.opacity); }
              var h = Math.atan2(o.b, o.a) * rad2deg;
              return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
            }

            function hcl(h, c, l, opacity) {
              return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
            }

            function Hcl(h, c, l, opacity) {
              this.h = +h;
              this.c = +c;
              this.l = +l;
              this.opacity = +opacity;
            }

            define(Hcl, hcl, extend$1(Color, {
              brighter: function(k) {
                return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
              },
              darker: function(k) {
                return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
              },
              rgb: function() {
                return labConvert(this).rgb();
              }
            }));

            var A = -0.14861,
                B = +1.78277,
                C = -0.29227,
                D = -0.90649,
                E = +1.97294,
                ED = E * D,
                EB = E * B,
                BC_DA = B * C - D * A;

            function cubehelixConvert(o) {
              if (o instanceof Cubehelix) { return new Cubehelix(o.h, o.s, o.l, o.opacity); }
              if (!(o instanceof Rgb)) { o = rgbConvert(o); }
              var r = o.r / 255,
                  g = o.g / 255,
                  b = o.b / 255,
                  l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
                  bl = b - l,
                  k = (E * (g - l) - C * bl) / D,
                  s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
                  h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
              return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
            }

            function cubehelix(h, s, l, opacity) {
              return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
            }

            function Cubehelix(h, s, l, opacity) {
              this.h = +h;
              this.s = +s;
              this.l = +l;
              this.opacity = +opacity;
            }

            define(Cubehelix, cubehelix, extend$1(Color, {
              brighter: function(k) {
                k = k == null ? brighter : Math.pow(brighter, k);
                return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
              },
              darker: function(k) {
                k = k == null ? darker : Math.pow(darker, k);
                return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
              },
              rgb: function() {
                var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
                    l = +this.l,
                    a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
                    cosh = Math.cos(h),
                    sinh = Math.sin(h);
                return new Rgb(
                  255 * (l + a * (A * cosh + B * sinh)),
                  255 * (l + a * (C * cosh + D * sinh)),
                  255 * (l + a * (E * cosh)),
                  this.opacity
                );
              }
            }));

            function constant$2(x) {
              return function() {
                return x;
              };
            }

            function linear(a, d) {
              return function(t) {
                return a + t * d;
              };
            }

            function exponential(a, b, y) {
              return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
                return Math.pow(a + t * b, y);
              };
            }

            function gamma(y) {
              return (y = +y) === 1 ? nogamma : function(a, b) {
                return b - a ? exponential(a, b, y) : constant$2(isNaN(a) ? b : a);
              };
            }

            function nogamma(a, b) {
              var d = b - a;
              return d ? linear(a, d) : constant$2(isNaN(a) ? b : a);
            }

            var rgb$1 = (function rgbGamma(y) {
              var color$$1 = gamma(y);

              function rgb$$1(start, end) {
                var r = color$$1((start = rgb(start)).r, (end = rgb(end)).r),
                    g = color$$1(start.g, end.g),
                    b = color$$1(start.b, end.b),
                    opacity = nogamma(start.opacity, end.opacity);
                return function(t) {
                  start.r = r(t);
                  start.g = g(t);
                  start.b = b(t);
                  start.opacity = opacity(t);
                  return start + "";
                };
              }

              rgb$$1.gamma = rgbGamma;

              return rgb$$1;
            })(1);

            function array$2(a, b) {
              var nb = b ? b.length : 0,
                  na = a ? Math.min(nb, a.length) : 0,
                  x = new Array(na),
                  c = new Array(nb),
                  i;

              for (i = 0; i < na; ++i) { x[i] = interpolateValue(a[i], b[i]); }
              for (; i < nb; ++i) { c[i] = b[i]; }

              return function(t) {
                for (i = 0; i < na; ++i) { c[i] = x[i](t); }
                return c;
              };
            }

            function date(a, b) {
              var d = new Date;
              return a = +a, b -= a, function(t) {
                return d.setTime(a + b * t), d;
              };
            }

            function reinterpolate(a, b) {
              return a = +a, b -= a, function(t) {
                return a + b * t;
              };
            }

            function object(a, b) {
              var i = {},
                  c = {},
                  k;

              if (a === null || typeof a !== "object") { a = {}; }
              if (b === null || typeof b !== "object") { b = {}; }

              for (k in b) {
                if (k in a) {
                  i[k] = interpolateValue(a[k], b[k]);
                } else {
                  c[k] = b[k];
                }
              }

              return function(t) {
                for (k in i) { c[k] = i[k](t); }
                return c;
              };
            }

            var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
                reB = new RegExp(reA.source, "g");

            function zero(b) {
              return function() {
                return b;
              };
            }

            function one(b) {
              return function(t) {
                return b(t) + "";
              };
            }

            function string(a, b) {
              var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
                  am, // current match in a
                  bm, // current match in b
                  bs, // string preceding current number in b, if any
                  i = -1, // index in s
                  s = [], // string constants and placeholders
                  q = []; // number interpolators

              // Coerce inputs to strings.
              a = a + "", b = b + "";

              // Interpolate pairs of numbers in a & b.
              while ((am = reA.exec(a))
                  && (bm = reB.exec(b))) {
                if ((bs = bm.index) > bi) { // a string precedes the next number in b
                  bs = b.slice(bi, bs);
                  if (s[i]) { s[i] += bs; } // coalesce with previous string
                  else { s[++i] = bs; }
                }
                if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
                  if (s[i]) { s[i] += bm; } // coalesce with previous string
                  else { s[++i] = bm; }
                } else { // interpolate non-matching numbers
                  s[++i] = null;
                  q.push({i: i, x: reinterpolate(am, bm)});
                }
                bi = reB.lastIndex;
              }

              // Add remains of b.
              if (bi < b.length) {
                bs = b.slice(bi);
                if (s[i]) { s[i] += bs; } // coalesce with previous string
                else { s[++i] = bs; }
              }

              // Special optimization for only a single match.
              // Otherwise, interpolate each of the numbers and rejoin the string.
              return s.length < 2 ? (q[0]
                  ? one(q[0].x)
                  : zero(b))
                  : (b = q.length, function(t) {
                      for (var i = 0, o; i < b; ++i) { s[(o = q[i]).i] = o.x(t); }
                      return s.join("");
                    });
            }

            function interpolateValue(a, b) {
              var t = typeof b, c;
              return b == null || t === "boolean" ? constant$2(b)
                  : (t === "number" ? reinterpolate
                  : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
                  : b instanceof color ? rgb$1
                  : b instanceof Date ? date
                  : Array.isArray(b) ? array$2
                  : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
                  : reinterpolate)(a, b);
            }

            function interpolateRound(a, b) {
              return a = +a, b -= a, function(t) {
                return Math.round(a + b * t);
              };
            }

            var degrees = 180 / Math.PI;

            var rho = Math.SQRT2;

            function constant$3(x) {
              return function() {
                return x;
              };
            }

            function number$2(x) {
              return +x;
            }

            var unit = [0, 1];

            function deinterpolateLinear(a, b) {
              return (b -= (a = +a))
                  ? function(x) { return (x - a) / b; }
                  : constant$3(b);
            }

            function deinterpolateClamp(deinterpolate) {
              return function(a, b) {
                var d = deinterpolate(a = +a, b = +b);
                return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
              };
            }

            function reinterpolateClamp(reinterpolate$$1) {
              return function(a, b) {
                var r = reinterpolate$$1(a = +a, b = +b);
                return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
              };
            }

            function bimap(domain, range$$1, deinterpolate, reinterpolate$$1) {
              var d0 = domain[0], d1 = domain[1], r0 = range$$1[0], r1 = range$$1[1];
              if (d1 < d0) { d0 = deinterpolate(d1, d0), r0 = reinterpolate$$1(r1, r0); }
              else { d0 = deinterpolate(d0, d1), r0 = reinterpolate$$1(r0, r1); }
              return function(x) { return r0(d0(x)); };
            }

            function polymap(domain, range$$1, deinterpolate, reinterpolate$$1) {
              var j = Math.min(domain.length, range$$1.length) - 1,
                  d = new Array(j),
                  r = new Array(j),
                  i = -1;

              // Reverse descending domains.
              if (domain[j] < domain[0]) {
                domain = domain.slice().reverse();
                range$$1 = range$$1.slice().reverse();
              }

              while (++i < j) {
                d[i] = deinterpolate(domain[i], domain[i + 1]);
                r[i] = reinterpolate$$1(range$$1[i], range$$1[i + 1]);
              }

              return function(x) {
                var i = bisectRight(domain, x, 1, j) - 1;
                return r[i](d[i](x));
              };
            }

            function copy(source, target) {
              return target
                  .domain(source.domain())
                  .range(source.range())
                  .interpolate(source.interpolate())
                  .clamp(source.clamp());
            }

            // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
            // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
            function continuous(deinterpolate, reinterpolate$$1) {
              var domain = unit,
                  range$$1 = unit,
                  interpolate$$1 = interpolateValue,
                  clamp = false,
                  piecewise,
                  output,
                  input;

              function rescale() {
                piecewise = Math.min(domain.length, range$$1.length) > 2 ? polymap : bimap;
                output = input = null;
                return scale;
              }

              function scale(x) {
                return (output || (output = piecewise(domain, range$$1, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate$$1)))(+x);
              }

              scale.invert = function(y) {
                return (input || (input = piecewise(range$$1, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate$$1) : reinterpolate$$1)))(+y);
              };

              scale.domain = function(_) {
                return arguments.length ? (domain = map$2.call(_, number$2), rescale()) : domain.slice();
              };

              scale.range = function(_) {
                return arguments.length ? (range$$1 = slice$2.call(_), rescale()) : range$$1.slice();
              };

              scale.rangeRound = function(_) {
                return range$$1 = slice$2.call(_), interpolate$$1 = interpolateRound, rescale();
              };

              scale.clamp = function(_) {
                return arguments.length ? (clamp = !!_, rescale()) : clamp;
              };

              scale.interpolate = function(_) {
                return arguments.length ? (interpolate$$1 = _, rescale()) : interpolate$$1;
              };

              return rescale();
            }

            // Computes the decimal coefficient and exponent of the specified number x with
            // significant digits p, where x is positive and p is in [1, 21] or undefined.
            // For example, formatDecimal(1.23) returns ["123", 0].
            function formatDecimal(x, p) {
              if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) { return null; } // NaN, ±Infinity
              var i, coefficient = x.slice(0, i);

              // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
              // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
              return [
                coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
                +x.slice(i + 1)
              ];
            }

            function exponent(x) {
              return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
            }

            function formatGroup(grouping, thousands) {
              return function(value, width) {
                var i = value.length,
                    t = [],
                    j = 0,
                    g = grouping[0],
                    length = 0;

                while (i > 0 && g > 0) {
                  if (length + g + 1 > width) { g = Math.max(1, width - length); }
                  t.push(value.substring(i -= g, i + g));
                  if ((length += g + 1) > width) { break; }
                  g = grouping[j = (j + 1) % grouping.length];
                }

                return t.reverse().join(thousands);
              };
            }

            function formatNumerals(numerals) {
              return function(value) {
                return value.replace(/[0-9]/g, function(i) {
                  return numerals[+i];
                });
              };
            }

            function formatDefault(x, p) {
              x = x.toPrecision(p);

              out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
                switch (x[i]) {
                  case ".": i0 = i1 = i; break;
                  case "0": if (i0 === 0) { i0 = i; } i1 = i; break;
                  case "e": break out;
                  default: if (i0 > 0) { i0 = 0; } break;
                }
              }

              return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
            }

            var prefixExponent;

            function formatPrefixAuto(x, p) {
              var d = formatDecimal(x, p);
              if (!d) { return x + ""; }
              var coefficient = d[0],
                  exponent = d[1],
                  i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
                  n = coefficient.length;
              return i === n ? coefficient
                  : i > n ? coefficient + new Array(i - n + 1).join("0")
                  : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
                  : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
            }

            function formatRounded(x, p) {
              var d = formatDecimal(x, p);
              if (!d) { return x + ""; }
              var coefficient = d[0],
                  exponent = d[1];
              return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
                  : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
                  : coefficient + new Array(exponent - coefficient.length + 2).join("0");
            }

            var formatTypes = {
              "": formatDefault,
              "%": function(x, p) { return (x * 100).toFixed(p); },
              "b": function(x) { return Math.round(x).toString(2); },
              "c": function(x) { return x + ""; },
              "d": function(x) { return Math.round(x).toString(10); },
              "e": function(x, p) { return x.toExponential(p); },
              "f": function(x, p) { return x.toFixed(p); },
              "g": function(x, p) { return x.toPrecision(p); },
              "o": function(x) { return Math.round(x).toString(8); },
              "p": function(x, p) { return formatRounded(x * 100, p); },
              "r": formatRounded,
              "s": formatPrefixAuto,
              "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
              "x": function(x) { return Math.round(x).toString(16); }
            };

            // [[fill]align][sign][symbol][0][width][,][.precision][type]
            var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

            function formatSpecifier(specifier) {
              return new FormatSpecifier(specifier);
            }

            formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

            function FormatSpecifier(specifier) {
              if (!(match = re.exec(specifier))) { throw new Error("invalid format: " + specifier); }

              var match,
                  fill = match[1] || " ",
                  align = match[2] || ">",
                  sign = match[3] || "-",
                  symbol = match[4] || "",
                  zero = !!match[5],
                  width = match[6] && +match[6],
                  comma = !!match[7],
                  precision = match[8] && +match[8].slice(1),
                  type = match[9] || "";

              // The "n" type is an alias for ",g".
              if (type === "n") { comma = true, type = "g"; }

              // Map invalid types to the default format.
              else if (!formatTypes[type]) { type = ""; }

              // If zero fill is specified, padding goes after sign and before digits.
              if (zero || (fill === "0" && align === "=")) { zero = true, fill = "0", align = "="; }

              this.fill = fill;
              this.align = align;
              this.sign = sign;
              this.symbol = symbol;
              this.zero = zero;
              this.width = width;
              this.comma = comma;
              this.precision = precision;
              this.type = type;
            }

            FormatSpecifier.prototype.toString = function() {
              return this.fill
                  + this.align
                  + this.sign
                  + this.symbol
                  + (this.zero ? "0" : "")
                  + (this.width == null ? "" : Math.max(1, this.width | 0))
                  + (this.comma ? "," : "")
                  + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
                  + this.type;
            };

            function identity$4(x) {
              return x;
            }

            var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

            function formatLocale(locale) {
              var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$4,
                  currency = locale.currency,
                  decimal = locale.decimal,
                  numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$4,
                  percent = locale.percent || "%";

              function newFormat(specifier) {
                specifier = formatSpecifier(specifier);

                var fill = specifier.fill,
                    align = specifier.align,
                    sign = specifier.sign,
                    symbol = specifier.symbol,
                    zero = specifier.zero,
                    width = specifier.width,
                    comma = specifier.comma,
                    precision = specifier.precision,
                    type = specifier.type;

                // Compute the prefix and suffix.
                // For SI-prefix, the suffix is lazily computed.
                var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
                    suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

                // What format function should we use?
                // Is this an integer type?
                // Can this type generate exponential notation?
                var formatType = formatTypes[type],
                    maybeSuffix = !type || /[defgprs%]/.test(type);

                // Set the default precision if not specified,
                // or clamp the specified precision to the supported range.
                // For significant precision, it must be in [1, 21].
                // For fixed precision, it must be in [0, 20].
                precision = precision == null ? (type ? 6 : 12)
                    : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
                    : Math.max(0, Math.min(20, precision));

                function format(value) {
                  var valuePrefix = prefix,
                      valueSuffix = suffix,
                      i, n, c;

                  if (type === "c") {
                    valueSuffix = formatType(value) + valueSuffix;
                    value = "";
                  } else {
                    value = +value;

                    // Perform the initial formatting.
                    var valueNegative = value < 0;
                    value = formatType(Math.abs(value), precision);

                    // If a negative value rounds to zero during formatting, treat as positive.
                    if (valueNegative && +value === 0) { valueNegative = false; }

                    // Compute the prefix and suffix.
                    valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
                    valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

                    // Break the formatted value into the integer “value” part that can be
                    // grouped, and fractional or exponential “suffix” part that is not.
                    if (maybeSuffix) {
                      i = -1, n = value.length;
                      while (++i < n) {
                        if (c = value.charCodeAt(i), 48 > c || c > 57) {
                          valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                          value = value.slice(0, i);
                          break;
                        }
                      }
                    }
                  }

                  // If the fill character is not "0", grouping is applied before padding.
                  if (comma && !zero) { value = group(value, Infinity); }

                  // Compute the padding.
                  var length = valuePrefix.length + value.length + valueSuffix.length,
                      padding = length < width ? new Array(width - length + 1).join(fill) : "";

                  // If the fill character is "0", grouping is applied after padding.
                  if (comma && zero) { value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = ""; }

                  // Reconstruct the final output based on the desired alignment.
                  switch (align) {
                    case "<": value = valuePrefix + value + valueSuffix + padding; break;
                    case "=": value = valuePrefix + padding + value + valueSuffix; break;
                    case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
                    default: value = padding + valuePrefix + value + valueSuffix; break;
                  }

                  return numerals(value);
                }

                format.toString = function() {
                  return specifier + "";
                };

                return format;
              }

              function formatPrefix(specifier, value) {
                var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
                    e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
                    k = Math.pow(10, -e),
                    prefix = prefixes[8 + e / 3];
                return function(value) {
                  return f(k * value) + prefix;
                };
              }

              return {
                format: newFormat,
                formatPrefix: formatPrefix
              };
            }

            var locale;
            var format;
            var formatPrefix;

            defaultLocale({
              decimal: ".",
              thousands: ",",
              grouping: [3],
              currency: ["$", ""]
            });

            function defaultLocale(definition) {
              locale = formatLocale(definition);
              format = locale.format;
              formatPrefix = locale.formatPrefix;
              return locale;
            }

            function precisionFixed(step) {
              return Math.max(0, -exponent(Math.abs(step)));
            }

            function precisionPrefix(step, value) {
              return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
            }

            function precisionRound(step, max) {
              step = Math.abs(step), max = Math.abs(max) - step;
              return Math.max(0, exponent(max) - exponent(step)) + 1;
            }

            function tickFormat(domain, count, specifier) {
              var start = domain[0],
                  stop = domain[domain.length - 1],
                  step = tickStep(start, stop, count == null ? 10 : count),
                  precision;
              specifier = formatSpecifier(specifier == null ? ",f" : specifier);
              switch (specifier.type) {
                case "s": {
                  var value = Math.max(Math.abs(start), Math.abs(stop));
                  if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) { specifier.precision = precision; }
                  return formatPrefix(specifier, value);
                }
                case "":
                case "e":
                case "g":
                case "p":
                case "r": {
                  if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) { specifier.precision = precision - (specifier.type === "e"); }
                  break;
                }
                case "f":
                case "%": {
                  if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) { specifier.precision = precision - (specifier.type === "%") * 2; }
                  break;
                }
              }
              return format(specifier);
            }

            function linearish(scale) {
              var domain = scale.domain;

              scale.ticks = function(count) {
                var d = domain();
                return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
              };

              scale.tickFormat = function(count, specifier) {
                return tickFormat(domain(), count, specifier);
              };

              scale.nice = function(count) {
                if (count == null) { count = 10; }

                var d = domain(),
                    i0 = 0,
                    i1 = d.length - 1,
                    start = d[i0],
                    stop = d[i1],
                    step;

                if (stop < start) {
                  step = start, start = stop, stop = step;
                  step = i0, i0 = i1, i1 = step;
                }

                step = tickIncrement(start, stop, count);

                if (step > 0) {
                  start = Math.floor(start / step) * step;
                  stop = Math.ceil(stop / step) * step;
                  step = tickIncrement(start, stop, count);
                } else if (step < 0) {
                  start = Math.ceil(start * step) / step;
                  stop = Math.floor(stop * step) / step;
                  step = tickIncrement(start, stop, count);
                }

                if (step > 0) {
                  d[i0] = Math.floor(start / step) * step;
                  d[i1] = Math.ceil(stop / step) * step;
                  domain(d);
                } else if (step < 0) {
                  d[i0] = Math.ceil(start * step) / step;
                  d[i1] = Math.floor(stop * step) / step;
                  domain(d);
                }

                return scale;
              };

              return scale;
            }

            function linear$1() {
              var scale = continuous(deinterpolateLinear, reinterpolate);

              scale.copy = function() {
                return copy(scale, linear$1());
              };

              return linearish(scale);
            }

            var t0$1 = new Date,
                t1$1 = new Date;

            function newInterval(floori, offseti, count, field) {

              function interval(date) {
                return floori(date = new Date(+date)), date;
              }

              interval.floor = interval;

              interval.ceil = function(date) {
                return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
              };

              interval.round = function(date) {
                var d0 = interval(date),
                    d1 = interval.ceil(date);
                return date - d0 < d1 - date ? d0 : d1;
              };

              interval.offset = function(date, step) {
                return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
              };

              interval.range = function(start, stop, step) {
                var range = [], previous;
                start = interval.ceil(start);
                step = step == null ? 1 : Math.floor(step);
                if (!(start < stop) || !(step > 0)) { return range; } // also handles Invalid Date
                do { range.push(previous = new Date(+start)), offseti(start, step), floori(start); }
                while (previous < start && start < stop);
                return range;
              };

              interval.filter = function(test) {
                return newInterval(function(date) {
                  if (date >= date) { while (floori(date), !test(date)) { date.setTime(date - 1); } }
                }, function(date, step) {
                  if (date >= date) {
                    if (step < 0) { while (++step <= 0) {
                      while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
                    } } else { while (--step >= 0) {
                      while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
                    } }
                  }
                });
              };

              if (count) {
                interval.count = function(start, end) {
                  t0$1.setTime(+start), t1$1.setTime(+end);
                  floori(t0$1), floori(t1$1);
                  return Math.floor(count(t0$1, t1$1));
                };

                interval.every = function(step) {
                  step = Math.floor(step);
                  return !isFinite(step) || !(step > 0) ? null
                      : !(step > 1) ? interval
                      : interval.filter(field
                          ? function(d) { return field(d) % step === 0; }
                          : function(d) { return interval.count(0, d) % step === 0; });
                };
              }

              return interval;
            }

            var millisecond = newInterval(function() {
              // noop
            }, function(date, step) {
              date.setTime(+date + step);
            }, function(start, end) {
              return end - start;
            });

            // An optimized implementation for this simple case.
            millisecond.every = function(k) {
              k = Math.floor(k);
              if (!isFinite(k) || !(k > 0)) { return null; }
              if (!(k > 1)) { return millisecond; }
              return newInterval(function(date) {
                date.setTime(Math.floor(date / k) * k);
              }, function(date, step) {
                date.setTime(+date + step * k);
              }, function(start, end) {
                return (end - start) / k;
              });
            };

            var durationSecond = 1e3;
            var durationMinute = 6e4;
            var durationHour = 36e5;
            var durationDay = 864e5;
            var durationWeek = 6048e5;

            var second = newInterval(function(date) {
              date.setTime(Math.floor(date / durationSecond) * durationSecond);
            }, function(date, step) {
              date.setTime(+date + step * durationSecond);
            }, function(start, end) {
              return (end - start) / durationSecond;
            }, function(date) {
              return date.getUTCSeconds();
            });

            var minute = newInterval(function(date) {
              date.setTime(Math.floor(date / durationMinute) * durationMinute);
            }, function(date, step) {
              date.setTime(+date + step * durationMinute);
            }, function(start, end) {
              return (end - start) / durationMinute;
            }, function(date) {
              return date.getMinutes();
            });

            var hour = newInterval(function(date) {
              var offset = date.getTimezoneOffset() * durationMinute % durationHour;
              if (offset < 0) { offset += durationHour; }
              date.setTime(Math.floor((+date - offset) / durationHour) * durationHour + offset);
            }, function(date, step) {
              date.setTime(+date + step * durationHour);
            }, function(start, end) {
              return (end - start) / durationHour;
            }, function(date) {
              return date.getHours();
            });

            var day = newInterval(function(date) {
              date.setHours(0, 0, 0, 0);
            }, function(date, step) {
              date.setDate(date.getDate() + step);
            }, function(start, end) {
              return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
            }, function(date) {
              return date.getDate() - 1;
            });

            function weekday(i) {
              return newInterval(function(date) {
                date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
                date.setHours(0, 0, 0, 0);
              }, function(date, step) {
                date.setDate(date.getDate() + step * 7);
              }, function(start, end) {
                return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
              });
            }

            var sunday = weekday(0);
            var monday = weekday(1);
            var tuesday = weekday(2);
            var wednesday = weekday(3);
            var thursday = weekday(4);
            var friday = weekday(5);
            var saturday = weekday(6);

            var month = newInterval(function(date) {
              date.setDate(1);
              date.setHours(0, 0, 0, 0);
            }, function(date, step) {
              date.setMonth(date.getMonth() + step);
            }, function(start, end) {
              return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
            }, function(date) {
              return date.getMonth();
            });

            var year = newInterval(function(date) {
              date.setMonth(0, 1);
              date.setHours(0, 0, 0, 0);
            }, function(date, step) {
              date.setFullYear(date.getFullYear() + step);
            }, function(start, end) {
              return end.getFullYear() - start.getFullYear();
            }, function(date) {
              return date.getFullYear();
            });

            // An optimized implementation for this simple case.
            year.every = function(k) {
              return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
                date.setFullYear(Math.floor(date.getFullYear() / k) * k);
                date.setMonth(0, 1);
                date.setHours(0, 0, 0, 0);
              }, function(date, step) {
                date.setFullYear(date.getFullYear() + step * k);
              });
            };

            var utcMinute = newInterval(function(date) {
              date.setUTCSeconds(0, 0);
            }, function(date, step) {
              date.setTime(+date + step * durationMinute);
            }, function(start, end) {
              return (end - start) / durationMinute;
            }, function(date) {
              return date.getUTCMinutes();
            });

            var utcHour = newInterval(function(date) {
              date.setUTCMinutes(0, 0, 0);
            }, function(date, step) {
              date.setTime(+date + step * durationHour);
            }, function(start, end) {
              return (end - start) / durationHour;
            }, function(date) {
              return date.getUTCHours();
            });

            var utcDay = newInterval(function(date) {
              date.setUTCHours(0, 0, 0, 0);
            }, function(date, step) {
              date.setUTCDate(date.getUTCDate() + step);
            }, function(start, end) {
              return (end - start) / durationDay;
            }, function(date) {
              return date.getUTCDate() - 1;
            });

            function utcWeekday(i) {
              return newInterval(function(date) {
                date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
                date.setUTCHours(0, 0, 0, 0);
              }, function(date, step) {
                date.setUTCDate(date.getUTCDate() + step * 7);
              }, function(start, end) {
                return (end - start) / durationWeek;
              });
            }

            var utcSunday = utcWeekday(0);
            var utcMonday = utcWeekday(1);
            var utcTuesday = utcWeekday(2);
            var utcWednesday = utcWeekday(3);
            var utcThursday = utcWeekday(4);
            var utcFriday = utcWeekday(5);
            var utcSaturday = utcWeekday(6);

            var utcMonth = newInterval(function(date) {
              date.setUTCDate(1);
              date.setUTCHours(0, 0, 0, 0);
            }, function(date, step) {
              date.setUTCMonth(date.getUTCMonth() + step);
            }, function(start, end) {
              return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
            }, function(date) {
              return date.getUTCMonth();
            });

            var utcYear = newInterval(function(date) {
              date.setUTCMonth(0, 1);
              date.setUTCHours(0, 0, 0, 0);
            }, function(date, step) {
              date.setUTCFullYear(date.getUTCFullYear() + step);
            }, function(start, end) {
              return end.getUTCFullYear() - start.getUTCFullYear();
            }, function(date) {
              return date.getUTCFullYear();
            });

            // An optimized implementation for this simple case.
            utcYear.every = function(k) {
              return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
                date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
                date.setUTCMonth(0, 1);
                date.setUTCHours(0, 0, 0, 0);
              }, function(date, step) {
                date.setUTCFullYear(date.getUTCFullYear() + step * k);
              });
            };

            function localDate(d) {
              if (0 <= d.y && d.y < 100) {
                var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
                date.setFullYear(d.y);
                return date;
              }
              return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
            }

            function utcDate(d) {
              if (0 <= d.y && d.y < 100) {
                var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
                date.setUTCFullYear(d.y);
                return date;
              }
              return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
            }

            function newYear(y) {
              return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
            }

            function formatLocale$1(locale) {
              var locale_dateTime = locale.dateTime,
                  locale_date = locale.date,
                  locale_time = locale.time,
                  locale_periods = locale.periods,
                  locale_weekdays = locale.days,
                  locale_shortWeekdays = locale.shortDays,
                  locale_months = locale.months,
                  locale_shortMonths = locale.shortMonths;

              var periodRe = formatRe(locale_periods),
                  periodLookup = formatLookup(locale_periods),
                  weekdayRe = formatRe(locale_weekdays),
                  weekdayLookup = formatLookup(locale_weekdays),
                  shortWeekdayRe = formatRe(locale_shortWeekdays),
                  shortWeekdayLookup = formatLookup(locale_shortWeekdays),
                  monthRe = formatRe(locale_months),
                  monthLookup = formatLookup(locale_months),
                  shortMonthRe = formatRe(locale_shortMonths),
                  shortMonthLookup = formatLookup(locale_shortMonths);

              var formats = {
                "a": formatShortWeekday,
                "A": formatWeekday,
                "b": formatShortMonth,
                "B": formatMonth,
                "c": null,
                "d": formatDayOfMonth,
                "e": formatDayOfMonth,
                "f": formatMicroseconds,
                "H": formatHour24,
                "I": formatHour12,
                "j": formatDayOfYear,
                "L": formatMilliseconds,
                "m": formatMonthNumber,
                "M": formatMinutes,
                "p": formatPeriod,
                "Q": formatUnixTimestamp,
                "s": formatUnixTimestampSeconds,
                "S": formatSeconds,
                "u": formatWeekdayNumberMonday,
                "U": formatWeekNumberSunday,
                "V": formatWeekNumberISO,
                "w": formatWeekdayNumberSunday,
                "W": formatWeekNumberMonday,
                "x": null,
                "X": null,
                "y": formatYear,
                "Y": formatFullYear,
                "Z": formatZone,
                "%": formatLiteralPercent
              };

              var utcFormats = {
                "a": formatUTCShortWeekday,
                "A": formatUTCWeekday,
                "b": formatUTCShortMonth,
                "B": formatUTCMonth,
                "c": null,
                "d": formatUTCDayOfMonth,
                "e": formatUTCDayOfMonth,
                "f": formatUTCMicroseconds,
                "H": formatUTCHour24,
                "I": formatUTCHour12,
                "j": formatUTCDayOfYear,
                "L": formatUTCMilliseconds,
                "m": formatUTCMonthNumber,
                "M": formatUTCMinutes,
                "p": formatUTCPeriod,
                "Q": formatUnixTimestamp,
                "s": formatUnixTimestampSeconds,
                "S": formatUTCSeconds,
                "u": formatUTCWeekdayNumberMonday,
                "U": formatUTCWeekNumberSunday,
                "V": formatUTCWeekNumberISO,
                "w": formatUTCWeekdayNumberSunday,
                "W": formatUTCWeekNumberMonday,
                "x": null,
                "X": null,
                "y": formatUTCYear,
                "Y": formatUTCFullYear,
                "Z": formatUTCZone,
                "%": formatLiteralPercent
              };

              var parses = {
                "a": parseShortWeekday,
                "A": parseWeekday,
                "b": parseShortMonth,
                "B": parseMonth,
                "c": parseLocaleDateTime,
                "d": parseDayOfMonth,
                "e": parseDayOfMonth,
                "f": parseMicroseconds,
                "H": parseHour24,
                "I": parseHour24,
                "j": parseDayOfYear,
                "L": parseMilliseconds,
                "m": parseMonthNumber,
                "M": parseMinutes,
                "p": parsePeriod,
                "Q": parseUnixTimestamp,
                "s": parseUnixTimestampSeconds,
                "S": parseSeconds,
                "u": parseWeekdayNumberMonday,
                "U": parseWeekNumberSunday,
                "V": parseWeekNumberISO,
                "w": parseWeekdayNumberSunday,
                "W": parseWeekNumberMonday,
                "x": parseLocaleDate,
                "X": parseLocaleTime,
                "y": parseYear,
                "Y": parseFullYear,
                "Z": parseZone,
                "%": parseLiteralPercent
              };

              // These recursive directive definitions must be deferred.
              formats.x = newFormat(locale_date, formats);
              formats.X = newFormat(locale_time, formats);
              formats.c = newFormat(locale_dateTime, formats);
              utcFormats.x = newFormat(locale_date, utcFormats);
              utcFormats.X = newFormat(locale_time, utcFormats);
              utcFormats.c = newFormat(locale_dateTime, utcFormats);

              function newFormat(specifier, formats) {
                return function(date) {
                  var string = [],
                      i = -1,
                      j = 0,
                      n = specifier.length,
                      c,
                      pad,
                      format;

                  if (!(date instanceof Date)) { date = new Date(+date); }

                  while (++i < n) {
                    if (specifier.charCodeAt(i) === 37) {
                      string.push(specifier.slice(j, i));
                      if ((pad = pads[c = specifier.charAt(++i)]) != null) { c = specifier.charAt(++i); }
                      else { pad = c === "e" ? " " : "0"; }
                      if (format = formats[c]) { c = format(date, pad); }
                      string.push(c);
                      j = i + 1;
                    }
                  }

                  string.push(specifier.slice(j, i));
                  return string.join("");
                };
              }

              function newParse(specifier, newDate) {
                return function(string) {
                  var d = newYear(1900),
                      i = parseSpecifier(d, specifier, string += "", 0),
                      week, day$$1;
                  if (i != string.length) { return null; }

                  // If a UNIX timestamp is specified, return it.
                  if ("Q" in d) { return new Date(d.Q); }

                  // The am-pm flag is 0 for AM, and 1 for PM.
                  if ("p" in d) { d.H = d.H % 12 + d.p * 12; }

                  // Convert day-of-week and week-of-year to day-of-year.
                  if ("V" in d) {
                    if (d.V < 1 || d.V > 53) { return null; }
                    if (!("w" in d)) { d.w = 1; }
                    if ("Z" in d) {
                      week = utcDate(newYear(d.y)), day$$1 = week.getUTCDay();
                      week = day$$1 > 4 || day$$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
                      week = utcDay.offset(week, (d.V - 1) * 7);
                      d.y = week.getUTCFullYear();
                      d.m = week.getUTCMonth();
                      d.d = week.getUTCDate() + (d.w + 6) % 7;
                    } else {
                      week = newDate(newYear(d.y)), day$$1 = week.getDay();
                      week = day$$1 > 4 || day$$1 === 0 ? monday.ceil(week) : monday(week);
                      week = day.offset(week, (d.V - 1) * 7);
                      d.y = week.getFullYear();
                      d.m = week.getMonth();
                      d.d = week.getDate() + (d.w + 6) % 7;
                    }
                  } else if ("W" in d || "U" in d) {
                    if (!("w" in d)) { d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0; }
                    day$$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
                    d.m = 0;
                    d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$$1 + 5) % 7 : d.w + d.U * 7 - (day$$1 + 6) % 7;
                  }

                  // If a time zone is specified, all fields are interpreted as UTC and then
                  // offset according to the specified time zone.
                  if ("Z" in d) {
                    d.H += d.Z / 100 | 0;
                    d.M += d.Z % 100;
                    return utcDate(d);
                  }

                  // Otherwise, all fields are in local time.
                  return newDate(d);
                };
              }

              function parseSpecifier(d, specifier, string, j) {
                var i = 0,
                    n = specifier.length,
                    m = string.length,
                    c,
                    parse;

                while (i < n) {
                  if (j >= m) { return -1; }
                  c = specifier.charCodeAt(i++);
                  if (c === 37) {
                    c = specifier.charAt(i++);
                    parse = parses[c in pads ? specifier.charAt(i++) : c];
                    if (!parse || ((j = parse(d, string, j)) < 0)) { return -1; }
                  } else if (c != string.charCodeAt(j++)) {
                    return -1;
                  }
                }

                return j;
              }

              function parsePeriod(d, string, i) {
                var n = periodRe.exec(string.slice(i));
                return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
              }

              function parseShortWeekday(d, string, i) {
                var n = shortWeekdayRe.exec(string.slice(i));
                return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
              }

              function parseWeekday(d, string, i) {
                var n = weekdayRe.exec(string.slice(i));
                return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
              }

              function parseShortMonth(d, string, i) {
                var n = shortMonthRe.exec(string.slice(i));
                return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
              }

              function parseMonth(d, string, i) {
                var n = monthRe.exec(string.slice(i));
                return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
              }

              function parseLocaleDateTime(d, string, i) {
                return parseSpecifier(d, locale_dateTime, string, i);
              }

              function parseLocaleDate(d, string, i) {
                return parseSpecifier(d, locale_date, string, i);
              }

              function parseLocaleTime(d, string, i) {
                return parseSpecifier(d, locale_time, string, i);
              }

              function formatShortWeekday(d) {
                return locale_shortWeekdays[d.getDay()];
              }

              function formatWeekday(d) {
                return locale_weekdays[d.getDay()];
              }

              function formatShortMonth(d) {
                return locale_shortMonths[d.getMonth()];
              }

              function formatMonth(d) {
                return locale_months[d.getMonth()];
              }

              function formatPeriod(d) {
                return locale_periods[+(d.getHours() >= 12)];
              }

              function formatUTCShortWeekday(d) {
                return locale_shortWeekdays[d.getUTCDay()];
              }

              function formatUTCWeekday(d) {
                return locale_weekdays[d.getUTCDay()];
              }

              function formatUTCShortMonth(d) {
                return locale_shortMonths[d.getUTCMonth()];
              }

              function formatUTCMonth(d) {
                return locale_months[d.getUTCMonth()];
              }

              function formatUTCPeriod(d) {
                return locale_periods[+(d.getUTCHours() >= 12)];
              }

              return {
                format: function(specifier) {
                  var f = newFormat(specifier += "", formats);
                  f.toString = function() { return specifier; };
                  return f;
                },
                parse: function(specifier) {
                  var p = newParse(specifier += "", localDate);
                  p.toString = function() { return specifier; };
                  return p;
                },
                utcFormat: function(specifier) {
                  var f = newFormat(specifier += "", utcFormats);
                  f.toString = function() { return specifier; };
                  return f;
                },
                utcParse: function(specifier) {
                  var p = newParse(specifier, utcDate);
                  p.toString = function() { return specifier; };
                  return p;
                }
              };
            }

            var pads = {"-": "", "_": " ", "0": "0"},
                numberRe = /^\s*\d+/, // note: ignores next directive
                percentRe = /^%/,
                requoteRe = /[\\^$*+?|[\]().{}]/g;

            function pad(value, fill, width) {
              var sign = value < 0 ? "-" : "",
                  string = (sign ? -value : value) + "",
                  length = string.length;
              return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
            }

            function requote(s) {
              return s.replace(requoteRe, "\\$&");
            }

            function formatRe(names) {
              return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
            }

            function formatLookup(names) {
              var map = {}, i = -1, n = names.length;
              while (++i < n) { map[names[i].toLowerCase()] = i; }
              return map;
            }

            function parseWeekdayNumberSunday(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 1));
              return n ? (d.w = +n[0], i + n[0].length) : -1;
            }

            function parseWeekdayNumberMonday(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 1));
              return n ? (d.u = +n[0], i + n[0].length) : -1;
            }

            function parseWeekNumberSunday(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.U = +n[0], i + n[0].length) : -1;
            }

            function parseWeekNumberISO(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.V = +n[0], i + n[0].length) : -1;
            }

            function parseWeekNumberMonday(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.W = +n[0], i + n[0].length) : -1;
            }

            function parseFullYear(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 4));
              return n ? (d.y = +n[0], i + n[0].length) : -1;
            }

            function parseYear(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
            }

            function parseZone(d, string, i) {
              var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
              return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
            }

            function parseMonthNumber(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
            }

            function parseDayOfMonth(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.d = +n[0], i + n[0].length) : -1;
            }

            function parseDayOfYear(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 3));
              return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
            }

            function parseHour24(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.H = +n[0], i + n[0].length) : -1;
            }

            function parseMinutes(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.M = +n[0], i + n[0].length) : -1;
            }

            function parseSeconds(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 2));
              return n ? (d.S = +n[0], i + n[0].length) : -1;
            }

            function parseMilliseconds(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 3));
              return n ? (d.L = +n[0], i + n[0].length) : -1;
            }

            function parseMicroseconds(d, string, i) {
              var n = numberRe.exec(string.slice(i, i + 6));
              return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
            }

            function parseLiteralPercent(d, string, i) {
              var n = percentRe.exec(string.slice(i, i + 1));
              return n ? i + n[0].length : -1;
            }

            function parseUnixTimestamp(d, string, i) {
              var n = numberRe.exec(string.slice(i));
              return n ? (d.Q = +n[0], i + n[0].length) : -1;
            }

            function parseUnixTimestampSeconds(d, string, i) {
              var n = numberRe.exec(string.slice(i));
              return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
            }

            function formatDayOfMonth(d, p) {
              return pad(d.getDate(), p, 2);
            }

            function formatHour24(d, p) {
              return pad(d.getHours(), p, 2);
            }

            function formatHour12(d, p) {
              return pad(d.getHours() % 12 || 12, p, 2);
            }

            function formatDayOfYear(d, p) {
              return pad(1 + day.count(year(d), d), p, 3);
            }

            function formatMilliseconds(d, p) {
              return pad(d.getMilliseconds(), p, 3);
            }

            function formatMicroseconds(d, p) {
              return formatMilliseconds(d, p) + "000";
            }

            function formatMonthNumber(d, p) {
              return pad(d.getMonth() + 1, p, 2);
            }

            function formatMinutes(d, p) {
              return pad(d.getMinutes(), p, 2);
            }

            function formatSeconds(d, p) {
              return pad(d.getSeconds(), p, 2);
            }

            function formatWeekdayNumberMonday(d) {
              var day$$1 = d.getDay();
              return day$$1 === 0 ? 7 : day$$1;
            }

            function formatWeekNumberSunday(d, p) {
              return pad(sunday.count(year(d), d), p, 2);
            }

            function formatWeekNumberISO(d, p) {
              var day$$1 = d.getDay();
              d = (day$$1 >= 4 || day$$1 === 0) ? thursday(d) : thursday.ceil(d);
              return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
            }

            function formatWeekdayNumberSunday(d) {
              return d.getDay();
            }

            function formatWeekNumberMonday(d, p) {
              return pad(monday.count(year(d), d), p, 2);
            }

            function formatYear(d, p) {
              return pad(d.getFullYear() % 100, p, 2);
            }

            function formatFullYear(d, p) {
              return pad(d.getFullYear() % 10000, p, 4);
            }

            function formatZone(d) {
              var z = d.getTimezoneOffset();
              return (z > 0 ? "-" : (z *= -1, "+"))
                  + pad(z / 60 | 0, "0", 2)
                  + pad(z % 60, "0", 2);
            }

            function formatUTCDayOfMonth(d, p) {
              return pad(d.getUTCDate(), p, 2);
            }

            function formatUTCHour24(d, p) {
              return pad(d.getUTCHours(), p, 2);
            }

            function formatUTCHour12(d, p) {
              return pad(d.getUTCHours() % 12 || 12, p, 2);
            }

            function formatUTCDayOfYear(d, p) {
              return pad(1 + utcDay.count(utcYear(d), d), p, 3);
            }

            function formatUTCMilliseconds(d, p) {
              return pad(d.getUTCMilliseconds(), p, 3);
            }

            function formatUTCMicroseconds(d, p) {
              return formatUTCMilliseconds(d, p) + "000";
            }

            function formatUTCMonthNumber(d, p) {
              return pad(d.getUTCMonth() + 1, p, 2);
            }

            function formatUTCMinutes(d, p) {
              return pad(d.getUTCMinutes(), p, 2);
            }

            function formatUTCSeconds(d, p) {
              return pad(d.getUTCSeconds(), p, 2);
            }

            function formatUTCWeekdayNumberMonday(d) {
              var dow = d.getUTCDay();
              return dow === 0 ? 7 : dow;
            }

            function formatUTCWeekNumberSunday(d, p) {
              return pad(utcSunday.count(utcYear(d), d), p, 2);
            }

            function formatUTCWeekNumberISO(d, p) {
              var day$$1 = d.getUTCDay();
              d = (day$$1 >= 4 || day$$1 === 0) ? utcThursday(d) : utcThursday.ceil(d);
              return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
            }

            function formatUTCWeekdayNumberSunday(d) {
              return d.getUTCDay();
            }

            function formatUTCWeekNumberMonday(d, p) {
              return pad(utcMonday.count(utcYear(d), d), p, 2);
            }

            function formatUTCYear(d, p) {
              return pad(d.getUTCFullYear() % 100, p, 2);
            }

            function formatUTCFullYear(d, p) {
              return pad(d.getUTCFullYear() % 10000, p, 4);
            }

            function formatUTCZone() {
              return "+0000";
            }

            function formatLiteralPercent() {
              return "%";
            }

            function formatUnixTimestamp(d) {
              return +d;
            }

            function formatUnixTimestampSeconds(d) {
              return Math.floor(+d / 1000);
            }

            var locale$1;
            var timeFormat;
            var timeParse;
            var utcFormat;
            var utcParse;

            defaultLocale$1({
              dateTime: "%x, %X",
              date: "%-m/%-d/%Y",
              time: "%-I:%M:%S %p",
              periods: ["AM", "PM"],
              days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
              shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
              shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            });

            function defaultLocale$1(definition) {
              locale$1 = formatLocale$1(definition);
              timeFormat = locale$1.format;
              timeParse = locale$1.parse;
              utcFormat = locale$1.utcFormat;
              utcParse = locale$1.utcParse;
              return locale$1;
            }

            var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

            function formatIsoNative(date) {
              return date.toISOString();
            }

            var formatIso = Date.prototype.toISOString
                ? formatIsoNative
                : utcFormat(isoSpecifier);

            function parseIsoNative(string) {
              var date = new Date(string);
              return isNaN(date) ? null : date;
            }

            var parseIso = +new Date("2000-01-01T00:00:00.000Z")
                ? parseIsoNative
                : utcParse(isoSpecifier);

            var data = [
              {
                x: 0,
                y: 1
              },
              {
                x: 1,
                y: 50
              },
              {
                x: 2,
                y: 100
              },
              {
                x: 3,
                y: 150
              },
              {
                x: 4,
                y: 200
              },
              {
                x: 5,
                y: 250
              },
              {
                x: 6,
                y: 300
              },
              {
                x: 7,
                y: 350
              },
              {
                x: 8,
                y: 400
              },
              {
                x: 9,
                y: 450
              },
              {
                x: 10,
                y: 500
              }
            ];

            var xSelector = function (d) { return d.x; };
            var ySelector = function (d) { return d.y; };

            var xScale = band().range([0, 400]).domain(data.map(function (d) { return xSelector(d); })).padding(0.3);
            var yScale = linear$1().range([420, 0]).domain([0, 500]);

            var BarChart = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('h1',[_vm._v("Bar Chart")]),_vm._v(" "),_c('svg',{attrs:{"width":_vm.width,"height":_vm.height}},[_c('g',{ref:"chart"},_vm._l((_vm.data),function(d,i){return _c('rect',{key:i,attrs:{"width":_vm.w,"height":_vm.calcHeight(d),"x":_vm.xScale(d),"y":_vm.yScale(d),"stroke":"#ff6347","strokeWidth":"3","fill":"#f5f5f5"}})})),_vm._v(" "),_c('g',{ref:"axis"})])])},staticRenderFns: [],
              name: 'BarChart',
              data: function data$1 () {
                return {
                  width: 500,
                  height: 500,
                  w: xScale.bandwidth(),
                  data: data
                }
              },
              mounted: function mounted () {
                var margin = { top: 40, left: 40, bottom: 40, right: 0 };
                var yAxis = axisLeft(yScale).tickSizeInner(-420);
                var xAxis = axisBottom(xScale);

                var chartWidth = this.width - (margin.left + margin.right);
                var chartHeight = this.height - (margin.top + margin.bottom);

                select(this.$refs.chart)
                  .attr('width', chartWidth)
                  .attr('height', chartHeight)
                  .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"));

                select(this.$refs.axis).append('g')
                  .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"))
                  .attr('class', 'axis y')
                  .call(yAxis);

                select(this.$refs.axis).append('g')
                  .attr('transform', ("translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")"))
                  .attr('class', 'axis x')
                  .call(xAxis);
              },
              methods: {
                yScale: function (d) {
                  return yScale(ySelector(d));
                },
                xScale: function (d) {
                  return xScale(xSelector(d));
                },
                calcHeight: function (d) {
                var margin = { top: 40, left: 100, bottom: 40, right: 0 };

                var chartHeight = this.height - (margin.top + margin.bottom);

                  var yValue = yScale(ySelector(d));
                  var barHeight = chartHeight - yValue;
                  return barHeight;
                }
              }
            }

            var pi = Math.PI,
                tau = 2 * pi,
                epsilon$1 = 1e-6,
                tauEpsilon = tau - epsilon$1;

            function Path() {
              this._x0 = this._y0 = // start of current subpath
              this._x1 = this._y1 = null; // end of current subpath
              this._ = "";
            }

            function path() {
              return new Path;
            }

            Path.prototype = path.prototype = {
              constructor: Path,
              moveTo: function(x, y) {
                this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
              },
              closePath: function() {
                if (this._x1 !== null) {
                  this._x1 = this._x0, this._y1 = this._y0;
                  this._ += "Z";
                }
              },
              lineTo: function(x, y) {
                this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
              },
              quadraticCurveTo: function(x1, y1, x, y) {
                this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
              },
              bezierCurveTo: function(x1, y1, x2, y2, x, y) {
                this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
              },
              arcTo: function(x1, y1, x2, y2, r) {
                x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
                var x0 = this._x1,
                    y0 = this._y1,
                    x21 = x2 - x1,
                    y21 = y2 - y1,
                    x01 = x0 - x1,
                    y01 = y0 - y1,
                    l01_2 = x01 * x01 + y01 * y01;

                // Is the radius negative? Error.
                if (r < 0) { throw new Error("negative radius: " + r); }

                // Is this path empty? Move to (x1,y1).
                if (this._x1 === null) {
                  this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
                }

                // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
                else if (!(l01_2 > epsilon$1)) {}

                // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
                // Equivalently, is (x1,y1) coincident with (x2,y2)?
                // Or, is the radius zero? Line to (x1,y1).
                else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
                  this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
                }

                // Otherwise, draw an arc!
                else {
                  var x20 = x2 - x0,
                      y20 = y2 - y0,
                      l21_2 = x21 * x21 + y21 * y21,
                      l20_2 = x20 * x20 + y20 * y20,
                      l21 = Math.sqrt(l21_2),
                      l01 = Math.sqrt(l01_2),
                      l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                      t01 = l / l01,
                      t21 = l / l21;

                  // If the start tangent is not coincident with (x0,y0), line to.
                  if (Math.abs(t01 - 1) > epsilon$1) {
                    this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
                  }

                  this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
                }
              },
              arc: function(x, y, r, a0, a1, ccw) {
                x = +x, y = +y, r = +r;
                var dx = r * Math.cos(a0),
                    dy = r * Math.sin(a0),
                    x0 = x + dx,
                    y0 = y + dy,
                    cw = 1 ^ ccw,
                    da = ccw ? a0 - a1 : a1 - a0;

                // Is the radius negative? Error.
                if (r < 0) { throw new Error("negative radius: " + r); }

                // Is this path empty? Move to (x0,y0).
                if (this._x1 === null) {
                  this._ += "M" + x0 + "," + y0;
                }

                // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
                else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
                  this._ += "L" + x0 + "," + y0;
                }

                // Is this arc empty? We’re done.
                if (!r) { return; }

                // Does the angle go the wrong way? Flip the direction.
                if (da < 0) { da = da % tau + tau; }

                // Is this a complete circle? Draw two arcs to complete the circle.
                if (da > tauEpsilon) {
                  this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
                }

                // Is this arc non-empty? Draw an arc!
                else if (da > epsilon$1) {
                  this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
                }
              },
              rect: function(x, y, w, h) {
                this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
              },
              toString: function() {
                return this._;
              }
            };

            function constant$4(x) {
              return function constant() {
                return x;
              };
            }

            var pi$1 = Math.PI;

            function Linear(context) {
              this._context = context;
            }

            Linear.prototype = {
              areaStart: function() {
                this._line = 0;
              },
              areaEnd: function() {
                this._line = NaN;
              },
              lineStart: function() {
                this._point = 0;
              },
              lineEnd: function() {
                if (this._line || (this._line !== 0 && this._point === 1)) { this._context.closePath(); }
                this._line = 1 - this._line;
              },
              point: function(x, y) {
                x = +x, y = +y;
                switch (this._point) {
                  case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                  case 1: this._point = 2; // proceed
                  default: this._context.lineTo(x, y); break;
                }
              }
            };

            function curveLinear(context) {
              return new Linear(context);
            }

            function x(p) {
              return p[0];
            }

            function y(p) {
              return p[1];
            }

            function line() {
              var x$$1 = x,
                  y$$1 = y,
                  defined = constant$4(true),
                  context = null,
                  curve = curveLinear,
                  output = null;

              function line(data) {
                var i,
                    n = data.length,
                    d,
                    defined0 = false,
                    buffer;

                if (context == null) { output = curve(buffer = path()); }

                for (i = 0; i <= n; ++i) {
                  if (!(i < n && defined(d = data[i], i, data)) === defined0) {
                    if (defined0 = !defined0) { output.lineStart(); }
                    else { output.lineEnd(); }
                  }
                  if (defined0) { output.point(+x$$1(d, i, data), +y$$1(d, i, data)); }
                }

                if (buffer) { return output = null, buffer + "" || null; }
              }

              line.x = function(_) {
                return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$4(+_), line) : x$$1;
              };

              line.y = function(_) {
                return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$4(+_), line) : y$$1;
              };

              line.defined = function(_) {
                return arguments.length ? (defined = typeof _ === "function" ? _ : constant$4(!!_), line) : defined;
              };

              line.curve = function(_) {
                return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
              };

              line.context = function(_) {
                return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
              };

              return line;
            }

            function sign(x) {
              return x < 0 ? -1 : 1;
            }

            // Calculate the slopes of the tangents (Hermite-type interpolation) based on
            // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
            // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
            // NOV(II), P. 443, 1990.
            function slope3(that, x2, y2) {
              var h0 = that._x1 - that._x0,
                  h1 = x2 - that._x1,
                  s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
                  s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
                  p = (s0 * h1 + s1 * h0) / (h0 + h1);
              return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
            }

            // Calculate a one-sided slope.
            function slope2(that, t) {
              var h = that._x1 - that._x0;
              return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
            }

            // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
            // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
            // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
            function point$5(that, t0, t1) {
              var x0 = that._x0,
                  y0 = that._y0,
                  x1 = that._x1,
                  y1 = that._y1,
                  dx = (x1 - x0) / 3;
              that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
            }

            function MonotoneX(context) {
              this._context = context;
            }

            MonotoneX.prototype = {
              areaStart: function() {
                this._line = 0;
              },
              areaEnd: function() {
                this._line = NaN;
              },
              lineStart: function() {
                this._x0 = this._x1 =
                this._y0 = this._y1 =
                this._t0 = NaN;
                this._point = 0;
              },
              lineEnd: function() {
                switch (this._point) {
                  case 2: this._context.lineTo(this._x1, this._y1); break;
                  case 3: point$5(this, this._t0, slope2(this, this._t0)); break;
                }
                if (this._line || (this._line !== 0 && this._point === 1)) { this._context.closePath(); }
                this._line = 1 - this._line;
              },
              point: function(x, y) {
                var t1 = NaN;

                x = +x, y = +y;
                if (x === this._x1 && y === this._y1) { return; } // Ignore coincident points.
                switch (this._point) {
                  case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
                  case 1: this._point = 2; break;
                  case 2: this._point = 3; point$5(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
                  default: point$5(this, this._t0, t1 = slope3(this, x, y)); break;
                }

                this._x0 = this._x1, this._x1 = x;
                this._y0 = this._y1, this._y1 = y;
                this._t0 = t1;
              }
            };

            function MonotoneY(context) {
              this._context = new ReflectContext(context);
            }

            (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
              MonotoneX.prototype.point.call(this, y, x);
            };

            function ReflectContext(context) {
              this._context = context;
            }

            ReflectContext.prototype = {
              moveTo: function(x, y) { this._context.moveTo(y, x); },
              closePath: function() { this._context.closePath(); },
              lineTo: function(x, y) { this._context.lineTo(y, x); },
              bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
            };

            var xSelector$1 = function (d) { return d.x; };
            var ySelector$1 = function (d) { return d.y; };

            var xScale$1 = linear$1().range([0, 400]).domain([0, 10]);
            var yScale$1 = linear$1().range([0, 420]).domain([0, 500]);

            var LineChart = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('h1',[_vm._v("Line Chart")]),_vm._v(" "),_c('svg',{ref:"svg",attrs:{"width":_vm.width,"height":_vm.height}},[_c('g',{ref:"chart"},[_c('path',{attrs:{"d":_vm.path,"stroke":"#ff6347","strokeWidth":"3","fill":"none"}})]),_vm._v(" "),_c('g',{ref:"circle"}),_vm._v(" "),_c('g',{ref:"axis"})])])},staticRenderFns: [],
              name: 'LineChart',
              data: function data$1 () {
                return {
                  width: 500,
                  height: 500,
                  data: data,
                  path: '',
                  selected: null
                }
              },
              mounted: function mounted () {
                // const path = line().x(d => xScale(xSelector(d))).y(d => yScale(ySelector(d))).curve(curveStep);
                var path = line().x(function (d) { return xScale$1(xSelector$1(d)); }).y(function (d) { return yScale$1(ySelector$1(d)); });
                this.path = path(data);

                var margin = { top: 40, left: 40, bottom: 40, right: 0 };
                var yAxis = axisLeft(yScale$1).tickSizeInner(-420);
                var xAxis = axisBottom(xScale$1);

                var chartWidth = this.width - (margin.left + margin.right);
                var chartHeight = this.height - (margin.top + margin.bottom);

                select(this.$refs.chart)
                  .attr('width', chartWidth)
                  .attr('height', chartHeight)
                  .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"));

                select(this.$refs.axis).append('g')
                  .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"))
                  .attr('class', 'axis y')
                  .call(yAxis);

                select(this.$refs.axis).append('g')
                  .attr('transform', ("translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")"))
                  .attr('class', 'axis x')
                  .call(xAxis);
              },
              methods: {
                xPoint: function (d) {
                  return yScale$1(ySelector$1(d));
                },
                yPoint: function (d) {
                  return xScale$1(xSelector$1(d));
                }
              }
            }

            var xSelector$2 = function (d) { return d.x; };
            var ySelector$2 = function (d) { return d.y; };

            var xScale$2 = linear$1().range([0, 400]).domain([0, 10]);
            var yScale$2 = linear$1().range([420, 0]).domain([0, 420]);

            var ScatterChart = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('h1',[_vm._v("Scatter Chart")]),_vm._v(" "),_c('svg',{ref:"svg",attrs:{"width":_vm.width,"height":_vm.height}},[_c('g',{ref:"chart"}),_vm._v(" "),_c('g',{ref:"circle"}),_vm._v(" "),_c('g',{ref:"axis"})])])},staticRenderFns: [],
              name: 'LineChart',
              data: function data$1 () {
                return {
                  width: 500,
                  height: 500,
                  data: data,
                  path: '',
                }
              },
              mounted: function mounted () {
                var this$1 = this;

                var path = line().x(function (d) { return xScale$2(xSelector$2(d)); }).y(function (d) { return yScale$2(ySelector$2(d)); });
                this.path = path(data);

                var margin = { top: 40, left: 40, bottom: 40, right: 0 };
                var yAxis = axisLeft(yScale$2).tickSizeInner(-420);
                var xAxis = axisBottom(xScale$2);

                var chartWidth = this.width - (margin.left + margin.right);
                var chartHeight = this.height - (margin.top + margin.bottom);

                select(this.$refs.chart)
                  .attr('width', chartWidth)
                  .attr('height', chartHeight)
                  .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"));

                select(this.$refs.axis).append('g')
                  .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"))
                  .attr('class', 'axis y')
                  .call(yAxis);

                select(this.$refs.axis).append('g')
                  .attr('transform', ("translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")"))
                  .attr('class', 'axis x')
                  .call(xAxis);

                data.forEach(function (d, i) {
                  select(this$1.$refs.circle)
                    .attr('transform', ("translate(" + (margin.left) + ", " + (margin.top) + ")"))
                    .append('circle')
                    .attr('cx', this$1.xPoint(d))
                    .attr('cy', this$1.yPoint(d))
                    .attr('r', '5')
                    .attr('stroke', '#fff')
                    .attr('strokeWidth', 2)
                    .attr('fill', '#ff6347');
                });
              },
              methods: {
                xPoint: function (d) {
                  return yScale$2(ySelector$2(d));
                },
                yPoint: function (d) {
                  return xScale$2(xSelector$2(d));
                }
              }
            }

            var App = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"app",attrs:{"id":"app"}},[_c('div',{staticClass:"grid"},[_c('bar-chart'),_vm._v(" "),_c('line-chart'),_vm._v(" "),_c('scatter-chart')],1)])},staticRenderFns: [],
              name: 'app',
              components: {
                BarChart: BarChart,
                LineChart: LineChart,
                ScatterChart: ScatterChart
              }
            }

            Vue.config.productionTip = false;


            var app = new Vue({
              render: function (h) { return h(App); }
            }).$mount('#app');

})));
//# sourceMappingURL=app.js.map
