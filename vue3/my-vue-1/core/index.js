import { effectWatcher } from "./reactivity/index.js"
import { mountElement, diff } from "./reanderer/index.js"

export function createApp (rootComponent) {
  return {
    mount (rootContainer) {
      const context = rootComponent.setup()
      let isMounted = false
      let prevSubTree

      effectWatcher(() => {
        const rootHtml = document.querySelector(rootContainer)

        if (!isMounted) {
          // install
          rootHtml.innerHTML = ''
          const subTree = rootComponent.render(context)
          mountElement(subTree, rootHtml)
          // rootHtml.append(element)
          prevSubTree = subTree
          isMounted = true
        } else {
          // update
          const subTree = rootComponent.render(context)
          diff(prevSubTree, subTree)
          prevSubTree = subTree
        }
        
      })
    }
  }
}