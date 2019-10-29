import {Model} from "mdel";

function findStores(data) {
  const results = [];

  data.forEach(store => {
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
export default class Monitor {
  stores = [];
  unSubscribes = [];
  isMounted = false;

  constructor(component, componentStoreChange) {
    const forceUpdate = () => component.forceUpdate();
    const storeChange = componentStoreChange || component.componentStoreChange;

    this.stores = findStores([
      ...Object.values(component.props),
      ...Object.values(component)
    ]);
    this.unSubscribes = this.stores.map(store => {
      return store.subscribe(() => {
        if (!this.isMounted) return;

        if (storeChange === undefined || storeChange.call(this, store) !== false) {
          forceUpdate();
        }
      });
    });
  }

  mount() {
    this.isMounted = true;
  }

  unmount() {
    this.isMounted = false;
    const unSubscribes = this.unSubscribes;

    this.unSubscribes = [];
    unSubscribes.forEach(unSubscribe => unSubscribe());
  }
}
