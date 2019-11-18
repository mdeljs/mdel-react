import {Model} from "mdel";
import * as React from "react"

interface IMdelLifecycle{
  componentStoreChange?: TComponentStoreChange
}

interface IClassComponent<P = any, S = React.ComponentState> extends React.ComponentClass<P, S> {
  new(props: P, context?: any): React.Component<P, S> & IMdelLifecycle;
}

export declare type TComponentStoreChange = (store: Model) => boolean | void;

export declare type IReactComponent = IClassComponent | React.StatelessComponent;

export declare function observe<T extends IReactComponent>(ReactComponent: T, componentStoreChange?: TComponentStoreChange): T

export declare const version = "6.0.5";
