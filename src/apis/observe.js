import {throwError} from 'mdel'
import {getIsClassComponent, observeClassComponent} from "../units/classComponent";
import {getIsFunctionComponent, observeFunctionComponent} from "../units/functionComponent";

/**
 * 监视组件容器的数据修改
 * @param ReactComponent {*} 组件
 * @param [componentStoreChange] {function(store,prevData):true|*}  组件容器的数据修改时回调
 */
export default function observe(ReactComponent, componentStoreChange = null) {
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
    return observeFunctionComponent(ReactComponent, componentStoreChange)
  } else {
    throwError(true, 'ReactComponent is not a react component');
  }
}
