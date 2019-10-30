import {Model} from "mdel";
import {ClassicComponent, FunctionComponent} from "react";


interface TClassComponent extends ClassicComponent {
  componentStoreChange?: TComponentStoreChange
}

interface IReactComponent extends FunctionComponent, TClassComponent {
  observed?: boolean
}

export declare type TComponentStoreChange = (store: Model) => boolean | void;

export declare function observe<T extends IReactComponent> (ReactComponent: T, componentStoreChange?: TComponentStoreChange): T

export declare const version = "6.0.1";
