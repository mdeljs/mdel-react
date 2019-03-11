/**
 * 合并多个 componentStoreChange 函数为一个componentStoreChange
 * @param args {componentStoreChange[]}
 * @return {Function}
 */
export default function combine(...args) {
  return function (...params) {
    for (let i = 0, len = args.length; i < len; i++) {
      if (args[i].apply(this, params) === true) {
        return true;
      }
    }
  };
}
