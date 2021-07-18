import { IvNode } from '../type';
export function h(type: any, props: any, children: any):IvNode {
  return {
    type,
    props,
    children
  }
}