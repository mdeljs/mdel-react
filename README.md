# mdel-react
绑定react组件，来监视数据容器的修改

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件 props 中的容器或者组件的容器属性发生数据修改时，会自动渲染组件 <br />
使用 componentStoreUpdate 手动控制渲染，componentStoreUpdate 只在组件 mount 时触发

## 示例

```jsx harmony
import {observe} from 'mdel-react'

//1.
@observe
class UserComponent extends React.Component{
    sUser = userStore;
    sList = new ListModel();
    
    //componentStoreUpdate 可省略
    componentStoreUpdate(store,update){
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

```typescript
  interface IComponentStoreChange {
    (store,prevData):true|any
  }
  interface Component extends React.Component{
    componentStoreChange?:IcomponentStoreUpdate
  }
  
  interface observe extends ClassDecorator{
    <T extends React.ComponentClass>(ClassComponent:T,componentStoreChange?:IcomponentStoreUpdate):T
    <T extends React.FunctionComponent>(functionComponent:T,componentStoreChange?:IcomponentStoreUpdate):T
  }
```

绑定react组件，监视容器的数据修改

* componentStoreChange，在容器数据修改后执行，返回 **true** 则不会渲染组件

#### 示例
```jsx harmony
//示例1
@observe
class UserComponent extends React.Component{}
//示例2
const UserComponent = observe(
    class extends React.Component{}
);
//示例3
const UserComponent = observe(
    function({sUser}){
        return <div>
            ...
        </div>
    }
);
```

#### 示例

```jsx harmony
@observe
class UserComponent extends React.Component{
    componentStoreChange = combine(
        locationSearchChange(function() {
          console.log('search change');
          //当location中search发生修改时不要渲染组件
          return true;
        }),
        //...
    )
}

function locationSearchChange(callback) {
  return function(store,prevData) {
    if(store.name === 'history' && prevData.search !== store.data.search){
        return callback(prevData);
    }
  }
}
```
