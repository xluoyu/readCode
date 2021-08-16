import { isFunction } from '../shared/index';
import { createVNode } from './vnode';
/**
 * 对Vue添加全局APi
 * 
 * use、mixins、components、directives、provides
 */
export interface AppContext {
  
}
// 初始化的全局对象
export function createAppContext():AppContext {
  return {
    app: null as any,
    config: {
      isNativeTag: false,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: undefined,
      warnHandler: undefined,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  }
}

let uid = 0

/**
 * 
 * @param render 
 * @returns 
 */
export function createAppAPI(render):any  {
  /**
   * createApp的第二个参数
   * 
   * rootProps 会像普通组件的props一样传递给根组件
   * 
   * createApp(App, {username: '小明'})
   * 
   * -----------
   * App.vue
   * 
   * <div>{{username}}</div> -> 小明
   * 
   * props: {
   *  username: string
   *}
   */
  return function createApp(rootComponent, rootProps = null) {

    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false

    const app = (context.app ={
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,

      /**
       * 注册插件
       * 
       * app.use()
       * 
       * 先调用 plugin.install()
       * 没有则 plugin()
       */
      use(plugin, ...options:any[]) {
        if (installedPlugins.has(plugin)) {
          console.warn('该plugin已经注册过了')
        } else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin)
          plugin.install(app, ...options)
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin)
          plugin.install(app, ...options)
        }

        return app
      },

      /**
       * 全局mixin
       */
      mixin() {},

      /**
       * 注册全局组件
       * 
       * app.component('my-component', {
       *  data () {},
       *  render () {},
       *  methods: {},
       *  ...
       * })
       */
      component(name: string, component?: any): any {
        if (!component) {
          return context.components[name]
        }

        context.components[name] = component
        return app
      },

      /**
       * 全局自定义指令
       */
      directive(name, directive) {
        context.directives[name] = directive
        return app
      },

      mount(rootContainer) {
        if (isMounted) return
        /**
         * 实例化根组件
         * 
         */
        const vnode = createVNode(rootComponent, rootProps)
        console.log(vnode)
        render(vnode, rootContainer)

        vnode.appContext = context

        isMounted = true
        app._container = rootContainer
        ;(app._container as any).__vue_app__ = app

        return vnode.component!.proxy
      },

      unmount() {
        if (isMounted) {
          render(null. app._container)

          delete (app._container as any).__vue_app__
        }
      }
    })

    return app
  }
}