import React from 'react';
import { Model, throwError } from 'mdel';
import hoistStatics from 'hoist-non-react-statics';

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

function findStores(data) {
  var results = [];
  data.forEach(function (store) {
    //必须是Model的实例并且不存在结果中
    if (store instanceof Model && !results.includes(store)) {
      results.push(store);
    }
  });
  return results;
}
/**
 * 监视器
 */


var Monitor =
/*#__PURE__*/
function () {
  function Monitor(component, componentStoreChange) {
    var _this = this;

    this.stores = [];
    this.unSubscribes = [];
    this.isMounted = false;

    var forceUpdate = function forceUpdate() {
      return component.forceUpdate();
    };

    var storeChange = componentStoreChange || component.componentStoreChange;
    this.stores = findStores([].concat(Object.values(component.props), Object.values(component)));
    this.unSubscribes = this.stores.map(function (store) {
      return store.subscribe(function () {
        if (!_this.isMounted) return;

        if (storeChange === undefined || storeChange.call(component, store) !== false) {
          forceUpdate();
        }
      });
    });
  }

  var _proto = Monitor.prototype;

  _proto.mount = function mount() {
    this.isMounted = true;
  };

  _proto.unmount = function unmount() {
    this.isMounted = false;
    var unSubscribes = this.unSubscribes;
    this.unSubscribes = [];
    unSubscribes.forEach(function (unSubscribe) {
      return unSubscribe();
    });
  };

  return Monitor;
}();

function copyComponent(target, source) {
  target.displayName = source.displayName || source.name;
  target.contextTypes = source.contextTypes;
  target.propTypes = source.propTypes;
  target.defaultProps = source.defaultProps;
  hoistStatics(target, source);
  return target;
}

/**
 * 监视组件容器的数据修改
 * @param ReactComponent {*} 组件
 * @param [componentStoreChange] {function(store):boolean|*}  组件容器的数据修改时回调
 */

function observe(ReactComponent, componentStoreChange) {
  if (ReactComponent && ReactComponent.observed) {
    throwError('you are already observe to this component');
  }

  if (componentStoreChange && typeof componentStoreChange !== 'function') {
    throwError('componentStoreChange is not a function');
  }

  var component = observeClassComponent(ReactComponent, componentStoreChange) || observeFunctionComponent(ReactComponent, componentStoreChange);

  if (!component) {
    throwError('ReactComponent is not a react component');
  }

  ReactComponent.observed = true;
  return component;
}
/**
 * 监视类组件
 * @param Component {*} 类组件
 * @param componentStoreChange {function(store):boolean|*}  组件容器的数据修改时回调
 * @param needCopy {boolean} 是否拷贝组件react属性
 */

function observeClassComponent(Component, componentStoreChange, needCopy) {
  if (needCopy === void 0) {
    needCopy = true;
  }

  //判断是否是类组件
  if (!(typeof Component === 'function' && Component.prototype && !!Component.prototype.isReactComponent)) {
    return;
  }

  var FinalComponent =
  /*#__PURE__*/
  function (_Component) {
    _inheritsLoose(FinalComponent, _Component);

    function FinalComponent() {
      var _this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _Component.call.apply(_Component, [this].concat(args)) || this;
      _this.monitor = new Monitor(_assertThisInitialized(_this), componentStoreChange);
      return _this;
    }

    var _proto = FinalComponent.prototype;

    _proto.componentDidMount = function componentDidMount() {
      this.monitor.mount();

      if (_Component.prototype.componentDidMount) {
        _Component.prototype.componentDidMount.apply(this);
      }
    };

    _proto.componentWillUnmount = function componentWillUnmount() {
      if (_Component.prototype.componentWillUnmount) {
        _Component.prototype.componentWillUnmount.apply(this);
      }

      this.monitor.unmount();
    };

    return FinalComponent;
  }(Component);

  return needCopy ? copyComponent(FinalComponent, Component) : FinalComponent;
}
/**
 * 监视函数组件
 * @param component {*} 函数组件
 * @param componentStoreChange {function(store):boolean|*} 组件容器的数据修改时回调
 */


function observeFunctionComponent(component, componentStoreChange) {
  //非函数组件直接返回
  if (typeof component !== 'function') {
    return;
  }

  var Component =
  /*#__PURE__*/
  function (_React$Component) {
    _inheritsLoose(Component, _React$Component);

    function Component() {
      return _React$Component.apply(this, arguments) || this;
    }

    var _proto2 = Component.prototype;

    _proto2.render = function render() {
      return component.call(this, this.props, this.context);
    };

    return Component;
  }(React.Component);

  return copyComponent(observeClassComponent(Component, componentStoreChange, false), component);
}

export { observe };
