import { isStr } from "./reconcile"

export const updateElement = (dom, oldProps, newProps) => {
  for (let name in {...oldProps, ...newProps}) {
    let a = oldProps[name]
    let b = newProps[name]

    if (a == b || name === "children") {
    } else if (name === "style" && !isStr(b)) {
      for (const k in {...a, ...b}) {
        if (!(a && b && a[k] === b[k])) {
          dom[name][k] = b[k] || ''
        }
      }
    } else if (name[0] === 'o' && name[1] === 'n') {
      name = name.slice(2).toLowerCase()
      if (a) dom.removeEventListener(name, a)
      dom.addEventListener(name, b)
    } else if (!b) {
      dom.removeAttribute(name)
    } else {
      dom.setAttribute(name, b)
    }
  }
}

export const createElement = (fiber) => {
  const dom = fiber.type === "" ? document.createTextNode("") :
    document.createElement(fiber.type)
  updateElement(dom, {}, fiber.props)
  return dom
}
