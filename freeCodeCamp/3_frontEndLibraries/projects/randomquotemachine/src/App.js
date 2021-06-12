import './App.css';
import Element from './randomQuoteMachine'

// Import fontawesome into the project
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
// This line is not necessary because these icons will not be utilized
import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faCheckSquare, faCoffee)


function App() {
  return (
    <div className="App">
      <Element />
    </div>
  );
}

export default App;
