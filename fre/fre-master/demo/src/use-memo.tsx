import { render, h,useState, useMemo, useEffect } from '../../src/index'
let test = [1,2,3]

function Counter() {
  const [count, setCount] = useState(0)
  let one = useMemo(() => 1, test)
  console.log(one)

  useEffect(() => {
    console.log(111)
    test.push(test.length + 1)
  })
  return (
    <div>
      <h1>
        {count}-{one}
      </h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))
