import hoistStatics from 'hoist-non-react-statics';
import { getIsStore, throwError } from 'mdel';
import React from 'react';

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
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
 * @param componentStoreChange {function(store,prevData):true|*}  组件容器的数据修改时回调
 * @param needCopy {boolean} 是否拷贝组件react属性
 */

function observeClassComponent(Component, componentStoreChange, needCopy) {
  if (needCopy === void 0) {
    needCopy = true;
  }

  var FinalComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(FinalComponent, _Component);

    function FinalComponent(props, context) {
      var _this;

      _this = _Component.call(this, props, context) || this;
      var internal = getInternal(_assertThisInitialized(_this));

      var forceUpdate = function forceUpdate() {
        return internal.isMounted && _this.forceUpdate();
      };

      var stores = [].concat(Object.values(props), Object.values(_assertThisInitialized(_this))).filter(function (store) {
        return getIsStore(store);
      });
      var unSubscribes = stores.map(function (store) {
        return store.subscribe(function (prevData) {
          if (!internal.isMounted) return;
          var storeChange = componentStoreChange || _this.componentStoreChange;

          if (storeChange === undefined || storeChange.call(_assertThisInitialized(_this), store, prevData) !== true) {
            forceUpdate();
          }
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

    var _proto = FinalComponent.prototype;

    _proto.componentDidMount = function componentDidMount() {
      var internal = getInternal(this);

      if (_Component.prototype.componentDidMount) {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _Component.prototype.componentDidMount.apply(this, args);
      }

      internal.isMounted = true;
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      var internal = getInternal(this);

      if (_Component.prototype.componentWillUnmount) {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _Component.prototype.componentWillUnmount.apply(this, args);
      }

      internal.isMounted = false;

      if (internal.unSubscribe) {
        internal.unSubscribe();
        internal.unSubscribe = null;
      }
    };

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
 * @param componentStoreChange {function(store,prevData):true|*} 组件容器的数据修改时回调
 */

function observeFunctionComponent(component, componentStoreChange) {
  var Component =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(Component, _React$Component);

    function Component() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto = Component.prototype;

    _proto.render = function render() {
      return component.call(this, this.props, this.context);
    };

    return Component;
  }(React.Component);

  return copyComponent(observeClassComponent(Component, componentStoreChange, false), component);
}

/**
 * 监视组件容器的数据修改
 * @param ReactComponent {*} 组件
 * @param [componentStoreChange] {function(store,prevData):true|*}  组件容器的数据修改时回调
 */

function observe(ReactComponent, componentStoreChange) {
  if (componentStoreChange === void 0) {
    componentStoreChange = null;
  }

  if (ReactComponent) {
    throwError(ReactComponent.observed, 'you are already observe to this component');
    ReactComponent.observed = true;
  }

  if (componentStoreChange) {
    throwError(typeof componentStoreChange !== 'function', 'componentStoreChange is not a function');
  }

  if (getIsClassComponent(ReactComponent)) {
    return observeClassComponent(ReactComponent, componentStoreChange);
  } else if (getIsFunctionComponent(ReactComponent)) {
    return observeFunctionComponent(ReactComponent, componentStoreChange);
  } else {
    throwError(true, 'ReactComponent is not a react component');
  }
}

/**
 * 合并多个 componentStoreChange 函数为一个componentStoreChange
 * @param args {componentStoreChange[]}
 * @return {Function}
 */
function combine() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      params[_key2] = arguments[_key2];
    }

    for (var i = 0, len = args.length; i < len; i++) {
      if (args[i].apply(this, params) === true) {
        return true;
      }
    }
  };
}

var version = '4.1.0';

export { version, observe, combine };
