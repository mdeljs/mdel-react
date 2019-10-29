import {Model} from "mdel";
import {ClassicComponent, FunctionComponent} from "react";


interface TClassComponent extends ClassicComponent {
  componentStoreChange?: TComponentStoreChange
}

interface IReactComponent extends FunctionComponent, TClassComponent {
  observed?: boolean
}

export type TComponentStoreChange = (store: Model) => boolean | void;

export interface observe<T extends IReactComponent> extends ClassDecorator{
  (ReactComponent: T, componentStoreChange?: TComponentStoreChange): T
}
