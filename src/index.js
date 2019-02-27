import {throwError} from 'mdel'
import {getIsClassComponent, observeClassComponent} from "./units/classComponent";
import {getIsFunctionComponent, observeFunctionComponent} from "./units/functionComponent";

export const version = '3.0.0';

/**
 * 监视组件的模型数据更新
 * @param ReactComponent {component} 组件
 * @param [onModelUpdate] {function(model):function(update):void | null}  数据更新回调
 */
export function observe(ReactComponent, onModelUpdate = null) {
  if (ReactComponent) {
    throwError(ReactComponent.observed, 'you are already observe to this component');

    ReactComponent.observed = true;
  }
  if (getIsClassComponent(ReactComponent)) {
    return observeClassComponent(ReactComponent, onModelUpdate);
  } else if (getIsFunctionComponent(ReactComponent)) {
    return observeFunctionComponent(ReactComponent, onModelUpdate)
  } else {
    throwError(true, 'ReactComponent is not a react component');
  }
}
