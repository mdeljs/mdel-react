import hoistStatics from 'hoist-non-react-statics';
import { getIsStore, throwError } from 'mdel';
import React from 'react';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function copyComponent(target, source) {
  target.displayName = source.displayName || source.name;
  target.contextTypes = source.contextTypes;
  target.propTypes = source.propTypes;
  target.defaultProps = source.defaultProps;
  hoistStatics(target, source);
  return target;
}

/**
 * 获取组件内部属性
 * @param component {*} 组件
 * @returns {{stores:*[],isMounted:boolean,unSubscribe:null || function()}}
 */

function getInternal(component) {
  var INTERNAL = '__MDEL_REACT__';

  if (!component[INTERNAL]) {
    Object.defineProperty(component, INTERNAL, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: {
        stores: [],
        unSubscribe: null,
        isMounted: false
      }
    });
  }

  return component[INTERNAL];
}
/**
 * 判断是否是类组件
 * @param component {*} 组件
 * @returns {boolean}
 */


function getIsClassComponent(component) {
  return typeof component === 'function' && component.prototype && !!component.prototype.isReactComponent;
}
/**
 * 监视类组件
 * @param Component {*} 类组件
 * @param onStoreUpdate {function(store):function(update):void | null}  数据容器更新回调
 * @param needCopy {boolean} 是否拷贝组件react属性
 */

function observeClassComponent(Component, onStoreUpdate) {
  var needCopy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  var FinalComponent =
  /*#__PURE__*/
  function (_Component) {
    _inherits(FinalComponent, _Component);

    function FinalComponent(props, context) {
      var _this;

      _classCallCheck(this, FinalComponent);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FinalComponent).call(this, props, context));
      var internal = getInternal(_assertThisInitialized(_this));

      var forceUpdate = function forceUpdate() {
        return internal.isMounted && _this.forceUpdate();
      };

      var stores = [].concat(_toConsumableArray(Object.values(props)), _toConsumableArray(Object.values(_assertThisInitialized(_this)))).filter(function (store) {
        return getIsStore(store);
      });
      var unSubscribes = stores.map(function (store) {
        return store.subscribe(function () {
          var storeUpdate = onStoreUpdate || _this.onStoreUpdate;
          var isSetUpdate = !!storeUpdate;
          if (!internal.isMounted) return function () {};
          var result = isSetUpdate ? storeUpdate.call(_assertThisInitialized(_this), store) : null;
          return function () {
            if (isSetUpdate) {
              result.call(_assertThisInitialized(_this), forceUpdate);
            } else {
              forceUpdate();
            }
          };
        });
      });

      internal.unSubscribe = function () {
        unSubscribes.forEach(function (unSubscribe) {
          return unSubscribe();
        });
      };

      internal.stores = stores;
      return _this;
    }

    _createClass(FinalComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var internal = getInternal(this);

        if (_get(_getPrototypeOf(FinalComponent.prototype), "componentDidMount", this)) {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _get(_getPrototypeOf(FinalComponent.prototype), "componentDidMount", this).apply(this, args);
        }

        internal.isMounted = true;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        var internal = getInternal(this);

        if (_get(_getPrototypeOf(FinalComponent.prototype), "componentWillUnmount", this)) {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _get(_getPrototypeOf(FinalComponent.prototype), "componentWillUnmount", this).apply(this, args);
        }

        internal.isMounted = false;

        if (internal.unSubscribe) {
          internal.unSubscribe();
          internal.unSubscribe = null;
        }
      }
    }]);

    return FinalComponent;
  }(Component);

  return needCopy ? copyComponent(FinalComponent, Component) : FinalComponent;
}

/**
 * 判断是否是函数组件
 * @param component {*} 组件
 * @returns {boolean}
 */

function getIsFunctionComponent(component) {
  return typeof component === 'function';
}
/**
 * 监视函数组件
 * @param component {*} 函数组件
 * @param onStoreUpdate {function(store):function(update):void | null} 数据容器更新回调
 */

function observeFunctionComponent(component, onStoreUpdate) {
  var Component =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(Component, _React$Component);

    function Component() {
      _classCallCheck(this, Component);

      return _possibleConstructorReturn(this, _getPrototypeOf(Component).apply(this, arguments));
    }

    _createClass(Component, [{
      key: "render",
      value: function render() {
        return component.call(this, this.props, this.context);
      }
    }]);

    return Component;
  }(React.Component);

  return copyComponent(observeClassComponent(Component, onStoreUpdate, false), component);
}

var version = '3.4.0';
/**
 * 监视组件的数据容器更新
 * @param ReactComponent {*} 组件
 * @param [onStoreUpdate] {function(store):function(update):void | null}  数据容器更新回调
 */

function observe(ReactComponent) {
  var onStoreUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (ReactComponent) {
    throwError(ReactComponent.observed, 'you are already observe to this component');
    ReactComponent.observed = true;
  }

  if (onStoreUpdate) {
    throwError(typeof onStoreUpdate !== 'function', 'onStoreUpdate is not a function');
  }

  if (getIsClassComponent(ReactComponent)) {
    return observeClassComponent(ReactComponent, onStoreUpdate);
  } else if (getIsFunctionComponent(ReactComponent)) {
    return observeFunctionComponent(ReactComponent, onStoreUpdate);
  } else {
    throwError(true, 'ReactComponent is not a react component');
  }
}

export { version, observe };
