import React from "react";
import {observeClassComponent} from "./classComponent";
import {copyComponent} from "./common";

/**
 * 判断是否是函数组件
 * @param component {*} 组件
 * @returns {boolean}
 */
export function getIsFunctionComponent(component) {
  return typeof component === 'function';
}

/**
 * 监视函数组件
 * @param component {*} 函数组件
 * @param componentStoreUpdate {function(store,update)} 组件容器的数据修改时回调
 */
export function observeFunctionComponent(component, componentStoreUpdate) {
  class Component extends React.Component {
    render() {
      return component.call(this, this.props, this.context)
    }
  }

  return copyComponent(observeClassComponent(Component, componentStoreUpdate, false), component)
}
