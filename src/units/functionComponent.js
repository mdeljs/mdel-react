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
 * @param onModelUpdate {function(model):function(update):void | null} 数据更新回调
 */
export function observeFunctionComponent(component, onModelUpdate) {
  class Component extends React.Component {
    render() {
      return component.call(this, this.props, this.context)
    }
  }

  return copyComponent(observeClassComponent(Component, onModelUpdate, false), component)
}
