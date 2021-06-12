import './App.css';
import Drum from './Components/drumMachine'

// Import fontawesome into the project
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
// This line is not necessary because these icons will not be utilized
import { faCheckSquare, faCoffee, faMusic } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faCoffee, faMusic)


function App() {
  return (
    <div className="App">
      <Drum />
    </div>
  );
}

export default App;
