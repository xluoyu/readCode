export function mountElement(vnode, container) {
  const {tag, props, children} = vnode
  // tag
  const el = vnode.el = document.createElement(tag)

  // props
  if (props) {
    for (const key in props) {
      el.setAttribute(key, props[key])
    }
  }

  //children
  // string
  if (typeof children === "string") {
    const textNode = document.createTextNode(children)
    el.append(textNode)
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      mountElement(v, el)
    })
  }

  container.append(el)
}

export function diff(n1, n2) {
  console.log('n1', n1)
  console.log('n2', n2)

  // tag 的改变
  if(n1.tag !== n2.tag) {
    // 替换节点
    n1.el.replaceWith(document.createElement(n2.tag))
  } else {
    const el = (n2.el = n1.el)

    // props的改变
    const {props: newProps} = n2
    const {props: oldProps} = n1

    if (newProps) {
      Object.keys(newProps).forEach((key) => {
        const newVal = newProps[key]
        const oldVal = oldProps[key]
        if (newVal !== oldVal) {
          el.setAttribute(key, newVal)
        }
      })
    }
    if (oldProps) {
      Object.keys(oldProps).forEach((key) => {
        if (!newProps[key]) {
          el.removeAttribute(key)
        }
      })
    }
  }

  // children的改变
  // 1. newChildren -> string (oldChildren -> string, oldChildren -> array)
  // 2. newChildren -> array (oldChildren -> string, oldChildren -> array)
  const {children: newChildren} = n2
  const {children: oldChildren} = n1
  if (typeof newChildren === "string") {
    if (typeof oldChildren === "string") {
      if (newChildren !== oldChildren) {
        el.innerContent = newChildren
      }
    } else if (Array.isArray(oldChildren)) {
      el.innerContent = newChildren
    }
  } else if (Array.isArray(newChildren)) {
    if (typeof oldChildren === "string") {
      el.innerText = ''
      mountElement(n2)
    } else if (Array.isArray(oldChildren)) {
      // new [a,b,c,d]
      // old [a,b,c,d,f]
      const length = Math.min(newChildren.length, oldChildren.length)

      for (let index = 0; index < length; index++) {
        const newVnode = newChildren[index]
        const oldVnode = oldChildren[index]

        diff(newVnode, oldVnode)
      }

      if (newChildren.length > oldChildren.length) {
        for (let index = length; index < newChildren.length; index++) {
          const newVnode = newChildren[index]
          mountElement(newVnode, newVnode.el.parent)
        }
      }

      if (newChildren.length < oldChildren.length) {
        for (let index = length; index < oldChildren.length; index++) {
          const oldVnode = oldChildren[index]
          oldVnode.el.parent.removeChild(oldVnode.el)
        }
      }
    }
  }
}