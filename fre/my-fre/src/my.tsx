// import React from 'react'
// import {render, h} from '../../fre-master/src/index'

// import { schedule } from '../fre/schedule'
import { render, useState } from "../fre"
import {h} from '../../fre-master/src'

const Child = () => {
  console.log('child')
  let [count, setCount] = useState(1)
  return (
    <div>
      <p>这里是子组件哦{count}</p>
      <button onClick={() => {setCount(count+1)}}>点我</button>
    </div>
  )
}

const App = () => {
  const [list, setList] = useState([1,2,3])
  const pushList = () => {
    setList([...list, list.length + 1])
  }
  return (
    <div>
      <div>这是测试</div>
      <button onClick={() => {pushList()}}>这是按钮</button>
      <ul>
        {
          list.map(item => {
            return <li>{item}</li>
          })
        }
      </ul>
      <Child/>
    </div>
  )
}

render(
  <App />,
  document.getElementById('root') as Node
)
