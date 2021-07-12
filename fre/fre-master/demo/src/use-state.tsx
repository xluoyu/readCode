import { render,h, useState } from "../../src/index"

function ItemE(props) {
  return <div className='box'>{props.val}</div>
}

function App() {
  console.log('父组件')
  const [count, setCount] = useState(0)
  const list = listFn()
  console.log(list)
  return (
    <div>
      <ItemE val={999}/>
      {
        list.map(item => {
          return <ItemE val={item} />
        })
      }
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function listFn() {
  let list = []
  for (let index = 0; index < 100; index++) {
    list.push(index)
  }
  return list
}



function B({i}){
  console.log('子组件',i)
  return 111
}

render(<App />, document.getElementById("app"))
