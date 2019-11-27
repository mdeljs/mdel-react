import React from 'react'
import {throwError} from 'mdel'
import Monitor from '../units/monitor'
import {copyComponent} from '../units/common'

/**
 * 监视组件容器的数据修改
 * @param ReactComponent {*} 组件
 * @param [componentStoreChange] {function(store):boolean|*}  组件容器的数据修改时回调
 */
export default function observe(ReactComponent, componentStoreChange) {
  if (ReactComponent && ReactComponent.observed) {
    throwError('you are already observe to this component');
  }
  if (componentStoreChange && typeof componentStoreChange !== 'function') {
    throwError('componentStoreChange is not a function');
  }

  const component = (
    observeClassComponent(ReactComponent, componentStoreChange) ||
    observeFunctionComponent(ReactComponent, componentStoreChange)
  );

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
function observeClassComponent(Component, componentStoreChange, needCopy = true) {
  //判断是否是类组件
  if (!
    (typeof Component === 'function' &&
      Component.prototype &&
      !!Component.prototype.isReactComponent)
  ) {
    return;
  }

  class FinalComponent extends Component {
    monitor = new Monitor(this, componentStoreChange);

    componentDidMount() {
      this.monitor.mount();

      if (super.componentDidMount) {
        super.componentDidMount.apply(this)
      }
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount.apply(this)
      }

      this.monitor.unmount();
    }
  }

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

  class Component extends React.Component {
    render() {
      return component.call(this, this.props, this.context)
    }
  }

  return copyComponent(observeClassComponent(Component, componentStoreChange, false), component)
}
