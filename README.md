# mdel-react
绑定react组件，来监视数据容器的修改

## 安装

* 安装：`npm install mdel-react --save`

## mdel

**mdel** 是一个数据管理器，文档 [链接](https://github.com/mdeljs/mdel)

推荐一些数据模型 [链接](https://github.com/mdeljs/mdel-react)

## 使用

**observe** 用来监视一个组件，可以是类组件，也可以是无状态组件 <br />
当组件 props 中的容器或者组件的容器属性发生数据修改时，会自动渲染组件 <br />
可以使用 componentStoreChange 来阻止自动渲染，componentStoreChange 只在组件 mount 时触发

## 示例

```jsx harmony
import React from "react";
import {observe} from 'mdel-react'

//1.
@observe
class Page1 extends React.Component{
  sUser = userStore;
  sList = new ListModel();

  //componentStoreChange 可省略
  componentStoreChange(store){
    //当store为ListModel的实例时，不会自动渲染组件
    if(store instanceof ListModel){
      return false;
    }
  }

  render(){
    const {sUser} = this.props;

      return <div>
        username:{sUser.data.username}
      </div>
  }
}
//2.
const Page2 = observe(function(props) {
  const {sUser,sList} = props;

  return <div>
    username:{sUser.data.username}
  </div>
})

```

* typescript

```typescript jsx
import * as React from "react";
import {Model} from "mdel";
import {observe} from "mdel-react";

interface UserData{
  username:string
}
interface IPageProps {
  sUser:Model<UserData>
}

const Page1 = observe(function<IPageProps> (props) {
  const {sUser} = props;

  return <div>
    username:{sUser.data.username}
  </div>
});

@observe
class Page2 extends React.Component<IPageProps>{
  sList = new ListModel();

  render(){
    const {sUser} = this.props;

    if(this.sList.data.loading){
      return <div>loading</div>
    }
    return <div>
      username:{sUser.data.username}<br/>
      {
        this.sList.data.list.map(function(item,index) {
          return <div key={index}>{item.content}</div>
        })
      }
    </div>
  }
}

function App() {
  const sUser = new UserModel({
    username:''
  });

  return <div>
    <Page1 sUser={sUser}/>
    <Page2 sUser={sUser}/>
  </div>
}
```

## API

### observe

```typescript
import * as React from "react"
import {Model} from "mdel";

interface ObservantComponent<P = any, S = {}, SS = any> extends React.Component<P, S, SS> {
  componentStoreChange?: ComponentStoreChange
}

interface ObservantClassComponent<P = any, S = React.ComponentState> extends React.ComponentClass<P, S> {
  new(props: P, context?: any): ObservantComponent<P, S>;
}

type ComponentStoreChange = (store: Model) => boolean | void;

type ObservantReactComponent = ObservantClassComponent | React.StatelessComponent;

interface observe<T extends ObservantReactComponent> {
  (ReactComponent: T, componentStoreChange?: ComponentStoreChange): T
}
```

绑定react组件，监视容器的数据修改

* componentStoreChange，在容器数据修改后执行，返回 false 阻止本次自动渲染组件

#### 示例

```jsx harmony
//示例1
@observe
class PageComponent1 extends React.Component{}
//示例2
const PageComponent2 = observe(
  class extends React.Component{}
);
//示例3
const PageComponent3 = observe(
  function(props){}
);
```
## 更新日志

### 6.0.6
1. 增加typescript支持
2. componentStoreChange参数调整

### 5.0.0
1. 移除combine函数
2. componentStoreChange参数调整
