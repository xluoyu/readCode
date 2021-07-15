
export interface IvNode {
  type: string | IVueComponent,
  props: {[propertys:string]: any},
  children: any[] | string | null
}

export interface IVueComponent {
  setup?: Function,
  render: Function
}

export interface ICurTree extends IvNode{
  curEl?: HTMLElement
}

