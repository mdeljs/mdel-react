# mdel-react
绑定react组件，来监视数据容器的修改

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件 props 中的容器或者组件的容器属性发生数据修改时，会自动渲染组件 <br />
使用 componentStoreChange 返回 true 会阻止自动渲染，从而达到手动控制渲染，componentStoreChange 只在组件 mount 时触发

## 示例

```jsx harmony
import {observe} from 'mdel-react'

//1.
@observe
class UserComponent extends React.Component{
    sUser = userStore;
    sList = new ListModel();
    
    //componentStoreChange 可省略
    componentStoreChange(store,prevData){
        //... 
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
  interface IcomponentStoreChange {
    (store,prevData):true|any
  }
  interface Component extends React.Component{
    componentStoreChange?:IcomponentStoreChange
  }
  
  interface observe extends ClassDecorator{
    <T extends React.ComponentClass>(ClassComponent:T,componentStoreChange?:IcomponentStoreChange):T
    <T extends React.FunctionComponent>(functionComponent:T,componentStoreChange?:IcomponentStoreChange):T
  }
```

绑定react组件，监视容器的数据修改

* componentStoreChange，在容器数据后执行，返回 **true** 则不会渲染组件

### combine

#### 定义

```typescript
  interface ICombine {
    (...args:IcomponentStoreChange[]):IcomponentStoreChange
  }
```
合并多个 componentStoreChange 为一个函数，执行顺序为从左向右

#### 示例
