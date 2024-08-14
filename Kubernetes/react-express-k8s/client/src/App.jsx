import './App.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import MainComponent from './Components/MainComponent'
import OtherPage from './Components/OtherPage';

function App() {
  return (
    <Router>
      <>
        <header className="header">
          <div>This is a multicontainer application</div>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>
        <div className="main">
          <Route exact path="/" component={MainComponent} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </>
    </Router>
  )
}

export default App
