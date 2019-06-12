import {getIsStore} from "mdel";
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
 * @param componentStoreUpdate {function(store,update)}  组件容器的数据修改时回调
 * @param needCopy {boolean} 是否拷贝组件react属性
 */
export function observeClassComponent(Component, componentStoreUpdate, needCopy = true) {
  class FinalComponent extends Component {
    constructor(props, context) {
      super(props, context);

      const internal = getInternal(this);

      const forceUpdate = () => internal.isMounted && this.forceUpdate();
      const stores = [...Object.values(props), ...Object.values(this)].filter(store => getIsStore(store));
      const unSubscribes = stores.map((store) => {
        return store.subscribe(() => {
          if (!internal.isMounted) return;

          let isUpdate = false;

          const storeUpdate = componentStoreUpdate || this.componentStoreUpdate;
          const updateFn = () => {
            if (isUpdate) return;
            isUpdate = true;
            forceUpdate();
          };

          if (storeUpdate === undefined) {
            forceUpdate();
          } else {
            storeUpdate.call(this, store, updateFn);
          }
        });
      });

      internal.unSubscribe = function () {
        unSubscribes.forEach(unSubscribe => unSubscribe());
      };

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

