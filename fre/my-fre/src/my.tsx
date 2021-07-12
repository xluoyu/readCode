// import React from 'react'
// import {render, h} from '../../fre-master/src/index'

// import { schedule } from '../fre/schedule'
import { render } from "../fre"
import {h} from '../../fre-master/src'

const App = () => {
  const list = [1,2,3,4,5]

  return (
    <div>
      <div>这是测试</div>
      <button>这是按钮</button>
      <ul>
        {
          list.map(item => {
            return <li>{item}</li>
          })
        }
      </ul>
    </div>
  )
}

render(
  <App />,
  document.getElementById('root') as Node
)
