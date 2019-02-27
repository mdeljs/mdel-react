import {getIsModel} from "mdel";
import {copyComponent} from "./common";

/**
 * 获取组件内部属性
 * @param component {*} 组件
 * @returns {{stores:*[],isMounted:boolean,unSubscribe:null || function()}}
 */
function getInternal(component) {
  const INTERNAL = '__MDEL_REACT__';

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
    })
  }

  return component[INTERNAL];
}

/**
 * 判断是否是类组件
 * @param component {*} 组件
 * @returns {boolean}
 */
export function getIsClassComponent(component) {
  return typeof component === 'function' &&
    component.prototype && !!component.prototype.isReactComponent;
}

/**
 * 监视类组件
 * @param Component {*} 类组件
 * @param onModelUpdate {function(model):function(update):void | null}  数据更新回调
 * @param needCopy {boolean} 是否拷贝react静态属性
 */
export function observeClassComponent(Component, onModelUpdate, needCopy = true) {
  class FinalComponent extends Component {
    constructor(props, context) {
      super(props, context);

      const internal = getInternal(this);

      const forceUpdate = () => internal.isMounted && this.forceUpdate();
      const stores = [...Object.values(props), ...Object.values(this)].filter(store => getIsModel(store));

      internal.unSubscribe = stores.map(store => {
        return store.subscribe(function () {
          const storeUpdate = onModelUpdate || this.onModelUpdate;
          const isSetUpdate = !!storeUpdate;

          const result = isSetUpdate ? storeUpdate(store) : null;
          return function () {
            if (isSetUpdate) {
              result(forceUpdate);
            } else {
              forceUpdate();
            }
          }
        });
      });

      internal.stores = stores;
    }

    componentDidMount(...args) {
      const internal = getInternal(this);

      if (super.componentDidMount) {
        super.componentDidMount.apply(this, args)
      }

      internal.isMounted = true;
    }

    componentWillUnmount(...args) {
      const internal = getInternal(this);

      if (super.componentWillUnmount) {
        super.componentWillUnmount.apply(this, args)
      }

      internal.isMounted = false;
      if (internal.unSubscribe) {
        internal.unSubscribe();
        internal.unSubscribe = null;
      }
    }
  }

  return needCopy ? copyComponent(FinalComponent, Component) : FinalComponent;
}

