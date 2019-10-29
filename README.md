# mdel-react
绑定react组件，来监视数据容器的修改

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件 props 中的容器或者组件的容器属性发生数据修改时，会自动渲染组件 <br />
可以使用 componentStoreChange 手动控制渲染，componentStoreChange 只在组件 mount 时触发

## 示例

```jsx harmony
import {observe} from 'mdel-react'

//1.
@observe
class UserComponent extends React.Component{
    sUser = userStore;
    sList = new ListModel();
    
    //componentStoreChange 可省略
    componentStoreChange(store){
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
  interface TClassComponent extends React.ClassicComponent {
    componentStoreChange?: TComponentStoreChange
  }
  
  interface IReactComponent extends React.FunctionComponent, TClassComponent {
    observed?: boolean
  }
  
  export type TComponentStoreChange = (store: mdel.Model) => boolean | void;
  
  export interface observe<T extends IReactComponent> extends ClassDecorator{
    (ReactComponent: T, componentStoreChange?: TComponentStoreChange): T
  }
```

绑定react组件，监视容器的数据修改

* componentStoreChange，在容器数据修改后执行，执行参数update可以渲染组件

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
## 更新日志

### 5.0.0
1. 移除combine函数
2. componentStoreChange参数调整
