import { render, h,useState, useMemo, useEffect } from '../../src/index'
let test = [1,2,3]

function Counter() {
  const [count, setCount] = useState(0)
  const [age, setAge] = useState([1,2,3])
  let one = useMemo(() => {
    console.log('执行callback')
    return age
  }, [age])

  // useEffect(() => {
  //   test.push(test.length + 1)
  //   console.log('test被改变了')
  // }, [count])

  return (
    <div>
      <h1>
        {count}-{one}
      </h1>
      <button onClick={() => setCount(count + 1)}>+count</button>
      <button onClick={() => {setAge(age.concat(age.length + 1))}}>+age</button>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))
