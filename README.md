# mdel-react
绑定react组件，来监视数据容器的更新

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件 props 中的容器或者组件的容器属性发生数据更新时，会自动渲染组件 <br />
你也可以使用 onStoreUpdate 参数手动控制渲染，onStoreUpdate 只在组件 mount 时触发

## 示例

```jsx harmony
import {observe} from 'mdel-react'

//1.
@observe
class UserComponent extends React.Component{
    sUser = userStore;
    sList = new ListModel();
    
    //onStoreUpdate 可省略
    onStoreUpdate(store){
        const prevData = store.data;
        
        return function(update) {
            //...
            
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
const ListComponent = observe(function({sHistory,sList}) {
  return <div>
    ...
  </div>
})

```

## API

### observe

#### 定义
```typescript
  interface IOnStoreUpdate {
    (store):(update)=>void
  }
  
  interface observe extends ClassDecorator{
    <T extends React.ComponentClass>(ClassComponent:T,onStoreUpdate?:IOnStoreUpdate):T
    <T extends React.FunctionComponent>(functionComponent:T,onStoreUpdate?:IOnStoreUpdate):T
  }
```

绑定react组件，来监视数据容器的更新

* onStoreUpdate是一个函数，在容器update调用之前执行，
并返回一个函数，在容器update调用之后执行，其中调用update参数表示渲染组件
