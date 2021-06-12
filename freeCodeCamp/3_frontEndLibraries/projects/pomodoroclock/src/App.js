import './App.css';
import Clock from './Components/pomodoroClock'

// Import fontawesome into the project
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
// This line is not necessary because these icons will not be utilized
import { faPlus, faMinus, faPlay, faPause, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faPlus, faMinus, faPlay, faPause, faSyncAlt)

function App() {
  return (
    <div className="App">
      <Clock />
    </div>
  );
}

export default App;
