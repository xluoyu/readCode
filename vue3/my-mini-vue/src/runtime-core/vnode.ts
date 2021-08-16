import { Ref } from '../reactivity/ref';
import { isString } from '../shared';
import { AppContext } from './apiCreateApp';
import { ShapeFlags } from '@vue/shared/src';
export type VNodeTypes =
  | string
  | VNode

export type VNodeProps = {
  key?: string | number | symbol
  ref?: VNodeRef
}

export type VNodeRef =
  | string
  | Ref

export interface VNode {
  component: any;
  type: VNodeTypes,
  props: VNodeProps | null,
  key: string | number | symbol | null,
  children: any,
  // application root node only
  appContext: AppContext | null
}


export let currentBlock: VNode[] | null = null

/**
 * 组件 -> VNode
 * @param type 
 * @param props 
 * @param children 
 * @returns 
 */
export const createVNode = (
  type:VNodeTypes, 
  props:VNodeProps | null = null, 
  children: unknown = null
):VNode => {

  /**
   * 判断type
   * 
   * type可能是字符串， 比如： div、p
   * 可能是组件
   */
  const shapeFlag = isString(type)
  ? ShapeFlags.ELEMENT
  : 0


  return createBaseVNode(type, props, children)
}

function createBaseVNode(
  type: VNodeTypes,
  props: VNodeProps | null,
  children: any
) {
  const vnode = {
    type,
    props,
    children,
    el: null,
    key: props?.key || null
  } as unknown as VNode

  return vnode
}


// 返回n1与n2 标签、key是否一致
export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key
}