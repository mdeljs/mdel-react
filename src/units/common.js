import hoistStatics from "hoist-non-react-statics";

//复制组件一些静态属性
export function copyComponent(target, source) {
  target.displayName = source.displayName || source.name;
  target.contextTypes = source.contextTypes;
  target.propTypes = source.propTypes;
  target.defaultProps = source.defaultProps;

  hoistStatics(target, source);
  return target
}
