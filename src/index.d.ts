import * as React from "react"
import {Model} from "mdel";

interface ObservantComponent<P = any, S = {}, SS = any> extends React.Component<P, S, SS> {
  componentStoreChange?: ComponentStoreChange
}

interface ObservantClassComponent<P = any, S = React.ComponentState> extends React.ComponentClass<P, S> {
  new(props: P, context?: any): ObservantComponent<P, S>;
}

export declare type ComponentStoreChange = (store: Model) => boolean | void;

export declare type ObservantReactComponent = ObservantClassComponent | React.StatelessComponent;

export declare function observe<T extends ObservantReactComponent>(ReactComponent: T, componentStoreChange?: ComponentStoreChange): T
