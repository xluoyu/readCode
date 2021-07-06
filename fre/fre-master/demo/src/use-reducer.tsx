import { render, h, useReducer, useState } from '../../src/index'

function d(state, action) {
  switch (action.type) {
    case 'clear':
      return { data: [] }
    case 'create':
      return { data: state.data.concat([1, 2, 3]) }
  }
}

function Counter() {
  const [data, dispatch] = useReducer(d, { data: [] })

  return (
    <div>
      <TestBtn color={'#bb4455'}/>
      <button onClick={() => dispatch({ type: 'create' })}>-</button>
      <ul>
        {data.data.map(item => {
          const val = <p>hello</p>
          return (
            <li>
              {item}
              {val}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function TestBtn(props) {
  const [value, setValue] = useState('这是测试')
  const [ob1, setOb1] = useState('这是ob1')
  const [ob2, setOb2] = useState('这是ob2')
  return (
    <button style={'color:' + props.color} onClick={() => setValue('我被电击了')}>{value}</button>
  )
}

render(<Counter />, document.getElementById('app'))
