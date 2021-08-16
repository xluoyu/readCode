import { createRenderer } from '../runtime-core/renderer';

let renderer

function ensureRenderer() {
  return renderer || (renderer = createRenderer({}))
}

/**
 * vue程序的入口
 * 
 * 对外暴露的createApp
 * 
 * 传入根组件
 */
export function createApp (...args) {
  /**
   * createRenderer 是一个含有patch、render、等方法的对象
   * 
   * 会返回render、createApp
   */
  const app = ensureRenderer().createApp(...args)
  
  const { mount } = app
  app.mount = (containerOrSelector) => {
    console.log('mount')
    const container =  document.querySelector(containerOrSelector)
    if (container) {
      return mount(container, true, container instanceof SVGElement)
    }
  }


  return app
}