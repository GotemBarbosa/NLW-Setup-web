import './styles/global.css'

import { Habit } from "./components/Habit"

function App() {


  return (
    <div className="App">
        <Habit completed={2}/>
        <Habit completed={5}/>
        <Habit completed={7}/>
    </div>
  )
}

export default App
