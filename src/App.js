import Movie from "./components/MovieGrid";
import NavBar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { MovieDetail } from "./components/MovieDetail";
import { WatchList } from "./components/WatchList";
import { Profile } from "./components/Profile";
import { Search } from "./components/Search";

function App() {

  return (
    <div className="app"> 
    <Router>
        <Switch>
          <Route exact path='/'>
            <Movie />
          </Route>
        </Switch>
        
        <Switch>
          <Route path='/detail/:id'>
            <MovieDetail />
          </Route>
        </Switch>

        <Switch>
          <Route path='/watchlist'>
            <WatchList />
          </Route>
        </Switch>

        <Switch>
          <Route path="/profile">
            <NavBar />
            <Profile />
          </Route>
        </Switch>

        <Switch>
          <Route path="/search">
            <Search />
          </Route>
        </Switch>

    </Router>
    </div>
  );
}

export default App;

// TO DO
// Fix movies not displaying in all genres after deploy
// Unify fonts
// Polish code and add comments


// DONE 22.8
// Fixed images flashing when chaning page and then disappearing before imagesLoaded is true
// Fixed if row not full items in center
// Fixed spinner visible if not logged in in watchlist
// Improved item display on search page
// Fixed watchlist add mini button not working