import {throwError} from 'mdel'
import {getIsClassComponent, observeClassComponent} from "./units/classComponent";
import {getIsFunctionComponent, observeFunctionComponent} from "./units/functionComponent";

export const version = '3.4.0';

/**
 * 监视组件的数据容器更新
 * @param ReactComponent {*} 组件
 * @param [onStoreUpdate] {function(store):function(update):void | null}  数据容器更新回调
 */
export function observe(ReactComponent, onStoreUpdate = null) {
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
    return observeFunctionComponent(ReactComponent, onStoreUpdate)
  } else {
    throwError(true, 'ReactComponent is not a react component');
  }
}
