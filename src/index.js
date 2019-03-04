import {throwError} from 'mdel'
import {getIsClassComponent, observeClassComponent} from "./units/classComponent";
import {getIsFunctionComponent, observeFunctionComponent} from "./units/functionComponent";

export const version = '3.5.0';

/**
 * 监视组件容器的数据修改
 * @param ReactComponent {*} 组件
 * @param [onStoreChange] {function(store):function(update):void | null}  容器的数据修改时回调
 */
export function observe(ReactComponent, onStoreChange = null) {
  if (ReactComponent) {
    throwError(ReactComponent.observed, 'you are already observe to this component');

    ReactComponent.observed = true;
  }
  if (onStoreChange) {
    throwError(typeof onStoreChange !== 'function', 'onStoreChange is not a function');
  }
  if (getIsClassComponent(ReactComponent)) {
    return observeClassComponent(ReactComponent, onStoreChange);
  } else if (getIsFunctionComponent(ReactComponent)) {
    return observeFunctionComponent(ReactComponent, onStoreChange)
  } else {
    throwError(true, 'ReactComponent is not a react component');
  }
}
