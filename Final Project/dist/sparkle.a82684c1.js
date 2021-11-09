// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"NOd8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function execute(expression) {
  var dataContext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var magicContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  // Some fancy Regex magic taken from alpine.js' source
  // Basically, if the expression starts with 'if' or 'let'/'const' wrap them in an anonymous function
  var rightSideSafeExpression = 0 // Support expressions starting with "if" statements like: "if (...) doSomething()"
  || /^[\n\s]*if.*\(.*\)/.test(expression) // Support expressions starting with "let/const" like: "let foo = 'bar'"
  || /^(let|const)/.test(expression) ? "(() => { ".concat(expression, " })()") : expression; // For any functions in the dataContext, bind the dataContext to them as 'this'

  for (var _i = 0, _Object$entries = Object.entries(dataContext); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    if (typeof value === 'function') {
      if (value.__alreadyBound) continue;
      var boundFunction = value.bind(dataContext);
      boundFunction.__alreadyBound = true;
      dataContext[key] = {
        __noReactive: true,
        value: boundFunction
      };
    }
  } // Run the expression with the dataContext


  var func = new Function(['__self', 'scope', 'magic'], "\n        with (magic) { \n            with (scope) {\n                __self.result = ".concat(rightSideSafeExpression, ";\n            }\n        }\n        return __self.result;"));
  func(func, dataContext, magicContext);
  return func.result;
}
},{}],"ZbM1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUniqueTrackedListener = addUniqueTrackedListener;
exports.doIfNotNull = doIfNotNull;
exports.getChildren = getChildren;

function doIfNotNull(value, callback) {
  if (value) callback(value);
}

function getChildren(element) {
  return Array.from(element.children);
}

function addUniqueTrackedListener(element, type, handler) {
  if (!element.__trackedEvents) element.__trackedEvents = {};
  if (!element.__trackedEvents[type]) element.addEventListener(type, handler);
  element.__trackedEvents[type] = true;
}
},{}],"JAwu":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;

var _executor = require("./executor.js");

var _util = require("./util.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Add a little sparkle ✨ to my HTML
// Modeled off alpine.js
// Has data, for, text, html, bind, if, on, ref, and init attributes
// Add new attributes:
// s-effect (this one might be pretty hard)
// Also want to add a store and a couple other useful injected global properties
var runOnInit = [];
var hasInited = false;

function addDataToProxy(proxy, data) {
  for (var _i = 0, _Object$entries = Object.entries(data); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];

    if (proxy[key] && proxy[key].__noReactive) {
      proxy[key].value = value;
    } else {
      proxy[key] = {
        __noReactive: true,
        value: value
      };
    }
  }
}

function getNearestRootElement(element) {
  while (element.parentElement) {
    if (element.parentElement.__rootElement) {
      return element.parentElement;
    }

    element = element.parentElement;
  }

  return null;
}

function getInjectedDataContext(element) {
  // Go up the parent chain and append each element's data to the context
  function recursive(element, data) {
    if (!element.parentElement) return {};
    var parentsData = recursive(element.parentElement, getInjectedData(element)); // Everything below is UGLY and needs to be looked at again someday
    // Make sure we are adding information into the proxy not into a regular object

    var proxy = {};
    var addToProxy = {};

    if (data.__isProxy || data.__isProxy && parentsData.__isProxy) {
      proxy = data;
      addToProxy = parentsData;
    }

    if (parentsData.__isProxy) {
      proxy = parentsData;
      addToProxy = data;
    }

    addDataToProxy(proxy, addToProxy);
    return proxy;
  }

  return recursive(element, {});
}

function injectData(element, data) {
  // If there isn't already data, make a proxy
  if (!element.__sData) {
    element.__sData = data;
    element.__sData = new Proxy(element.__sData, {
      set: function set(target, property, value) {
        if (value.__noReactive) {
          target[property] = value.value;
        } else {
          target[property] = value;
          runAttributes(element);
        }

        return true;
      },
      get: function get(target, property) {
        if (property == "__isProxy") return true;
        return target[property];
      }
    });
  } else {
    // Otherwise add new data to exisiting proxy
    addDataToProxy(element.__sData, data);
  }
}

function getInjectedData(element) {
  // Retrieve injected data from an element
  return element.__sData ? element.__sData : {};
}

function runAttributes(element) {
  // s-data
  // Inject data into the element
  if (!hasInited) (0, _util.doIfNotNull)(element.getAttribute('s-data'), function (expression) {
    var data = (0, _executor.execute)(expression);
    injectData(element, data);
    element.__rootElement = true;
  }); // s-ref
  // Display or don't

  (0, _util.doIfNotNull)(element.getAttribute('s-ref'), function (refKey) {
    var nearestRootElement = getNearestRootElement(element);
    if (nearestRootElement) injectData(nearestRootElement, _defineProperty({}, refKey, element));
  }); // s-if
  // Display or don't

  (0, _util.doIfNotNull)(element.getAttribute('s-if'), function (expression) {
    var shouldDisplay = (0, _executor.execute)(expression, getInjectedDataContext(element));
    element.style.display = shouldDisplay ? null : 'none';
  }); // s-show
  // Visibility

  (0, _util.doIfNotNull)(element.getAttribute('s-show'), function (expression) {
    var shouldShow = (0, _executor.execute)(expression, getInjectedDataContext(element));
    element.style.visibility = shouldShow ? null : 'hidden';
    element.style.opacity = shouldShow ? null : '0';
    element.__hidden = !shouldShow;
  }); // s-bind
  // Bind an attribute on the element to a piece of data

  (0, _util.doIfNotNull)(element.getAttribute('s-bind'), function (attributeAndDataKeys) {
    if (element.__hidden) return;
    attributeAndDataKeys.split(' and ').forEach(function (attributeAndDataKey) {
      var _attributeAndDataKey$ = attributeAndDataKey.split(' to '),
          _attributeAndDataKey$2 = _slicedToArray(_attributeAndDataKey$, 2),
          attribute = _attributeAndDataKey$2[0],
          dataKey = _attributeAndDataKey$2[1];

      var value = (0, _executor.execute)(dataKey, getInjectedDataContext(element));

      if (attribute === 'class') {
        element.className = value;
        return;
      }

      element.setAttribute(attribute, value);
      element[attribute] = value;
    });
  }); // s-for
  // Repeat a child element

  (0, _util.doIfNotNull)(element.getAttribute('s-for'), function (expression) {
    if (element.__hidden) return; // Get list of items

    var _expression$split = expression.split(' in '),
        _expression$split2 = _slicedToArray(_expression$split, 2),
        valueKey = _expression$split2[0],
        dataKey = _expression$split2[1];

    var list = (0, _executor.execute)(dataKey, getInjectedDataContext(element)); // Get child element

    var children = (0, _util.getChildren)(element);
    var childTemplate = children[0];
    element.__childTemplate = childTemplate ? childTemplate : element.__childTemplate; // Clear template child element

    element.innerHTML = ""; // Clone child element for each item in list

    list.forEach(function (value) {
      var clone = element.__childTemplate.cloneNode(true);

      injectData(clone, _defineProperty({}, valueKey, value));
      element.appendChild(clone);
    });
  }); // s-text
  // Inject a piece of data into element's innerText

  (0, _util.doIfNotNull)(element.getAttribute('s-text'), function (expression) {
    if (element.__hidden) return;
    var text = (0, _executor.execute)(expression, getInjectedDataContext(element));
    element.innerText = text;
  }); // s-html
  // Inject a piece of data into element's innerHTML

  (0, _util.doIfNotNull)(element.getAttribute('s-html'), function (expression) {
    if (element.__hidden) return;
    var html = (0, _executor.execute)(expression, getInjectedDataContext(element));
    element.innerHTML = html;
  }); // s-on
  // Attach an event listener to the element

  (0, _util.doIfNotNull)(element.getAttribute('s-on'), function (eventsAndExpressions) {
    if (element.__hidden) return;
    eventsAndExpressions.split(' and ').forEach(function (eventAndExpression) {
      var _eventAndExpression$s = eventAndExpression.split(' do '),
          _eventAndExpression$s2 = _slicedToArray(_eventAndExpression$s, 2),
          eventName = _eventAndExpression$s2[0],
          expression = _eventAndExpression$s2[1];

      if (!expression) return;
      (0, _util.addUniqueTrackedListener)(element, eventName, function (event) {
        var magic = {
          $event: event
        };
        (0, _executor.execute)(expression, getInjectedDataContext(element), magic);
      });
    });
  }); // s-init
  // Run expressions on sparkle init

  if (!hasInited) (0, _util.doIfNotNull)(element.getAttribute('s-init'), function (expression) {
    runOnInit.push(function () {
      return (0, _executor.execute)(expression, getInjectedDataContext(element));
    });
  }); // Process children

  (0, _util.getChildren)(element).forEach(function (child) {
    runAttributes(child);
  });
}

function init() {
  (0, _util.getChildren)(document.body).forEach(function (element) {
    runAttributes(element);
  });
  hasInited = true;
  runOnInit.forEach(function (func) {
    return func();
  });
}

window.onload = init;
},{"./executor.js":"NOd8","./util.js":"ZbM1"}]},{},["JAwu"], null)
//# sourceMappingURL=/sparkle.a82684c1.js.map