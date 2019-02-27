# mdel-react
绑定react组件，来监视数据容器的更新

## 安装

* 安装：`npm install mdel-react --save`

## 使用

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
