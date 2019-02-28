# mdel-react
绑定react组件，来监视数据容器的更新

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件的props中的容器或者组件的容器属性发生数据更新时，会自动渲染组件 <br />
你也可以使用onStoreUpdate参数手动控制渲染，onStoreUpdate只在组件mount时触发

## 示例

## API
### observe

#### 定义
```typescript jsx
  interface IOnStoreUpdate {
    (store):(update)=>void
  }
  interface observe extends ClassDecorator{
    <T>(ClassComponent:T,onStoreUpdate?:IOnStoreUpdate):T
    <T>(functionComponent:T,onStoreUpdate?:IOnStoreUpdate):T
  }
```
#### 语法
```jsx harmony
  @observe
  class Component extends React.Component{
    onStoreUpdate?:IOnStoreUpdate
  }
  const Component = observe(ClassComponent,onStoreUpdate?:IOnStoreUpdate);
  const Component = observe(functionComponent,onStoreUpdate?:IOnStoreUpdate);
```
