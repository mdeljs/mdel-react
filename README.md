# mdel-react
绑定react组件，来监视数据容器的更新

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件的 props 中的容器或者组件的容器属性发生数据更新时，会自动渲染组件 <br />
你也可以使用 onStoreUpdate 参数手动控制渲染，onStoreUpdate 只在组件 mount 时触发

## 示例

```jsx harmony
import {observe} from 'mdel-react'

//1.
@observe
class UserComponent extends React.Component{
    sUser = userStore;
    sList = new ListModel();
    
    //可省略
    onStoreUpdate(store){
        return function(update) {
          update();
        }
    }
    
    render(){
        const {sHistory} = this.props;
        
        return <div>
            ...
        </div>
    }
}
//2.
const UserComponent = observe(function({sHistory}) {
  return <div>
    ...
  </div>
})

```

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
