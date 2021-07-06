// import React from 'react'
import {render, h} from '../../fre-master/src/index'

import { schedule } from '../fre/schedule'

const App = () => {
  schedule(() => {
    let list:any[] = []
    for (let index = 0; index < 1000000; index++) {
      list.push({id: index})
    }
    console.log('执行完毕a1')
    console.log(performance.now())
    
    return () => {
      // setTimeout(() => {
        list.forEach(item => {
          item.name = item.id + '小璐璐'
        })
        console.log('执行完毕a2')
        console.log(performance.now())
      // }, 100)
    }
  })
  schedule(() => {
    console.log('222')
  })

  return (
    <div>这是测试</div>
  )
}

render(
  <App />,
  document.getElementById('root') as Node
)
