import { Route, Routes, useLocation } from "react-router-dom"
import './App.css';
import { useEffect } from 'react';
import Polls from "./pages/Polls.jsx";
import SinglePoll from "./pages/SinglePoll.jsx";
import Bar from "./Components/Bar.jsx";
import Home from "./pages/Home.jsx"
import CreatePoll from "./pages/CreatePoll.jsx";
import AddCandidates from "./pages/AddCandidates.jsx"
function App() {

  const location = useLocation();
  // const { address } = useParams();
  useEffect(() => {
    // Extract the route name (removing the leading slash)
    const routeName = location.pathname === '/' ? 'home' : location.pathname.slice(1);
    console.log(routeName)
    // Add a class to the body based on the route
    document.body.classList.add(`route-${routeName}`);

    // Remove the class when the component unmounts
    return () => {
      document.body.classList.remove(`route-${routeName}`);
    };
  }, [location.pathname]);


  const items = ['Presidentialelection', 'Best Pokemon vote', 'Euro MVP vote', 'Euro MVP vote', 'Best Pokemon vote', 'Euro MVP vote', 'Euro MVP vote']

  const json_poll_object = {
    "election_name": "Presidental Election",
    "candidates": [
      {
        "name": "Pikachu",
        "image": "url",
        "votes": 100
      },
      {
        "name": "Snorlax",
        "image": "url",
        "votes": 100
      },
      {
        "name": "Eve",
        "image": "url",
        "votes": 101
      },

    ],
    "election_starts": "2024-07-13T23:19:43.511Z",
    "election_ends": "2024-07-13T23:21:43.511Z",
    "election_is_active": 1,
    "election_winner": "uknown"

  }

  return (
    <div className="App">
      <Bar />
      <Routes>
        <Route path="/Home" element={<Home />}> </Route>
        <Route path="/Polls" element={<Polls items={items} />}> </Route>

        <Route path={`/poll/:address`} element={<SinglePoll />} />
        <Route path="/CreatePoll" element={<CreatePoll />}></Route>
        <Route path="/poll/candidates/:address" element={<AddCandidates />}> </Route>
      </Routes>
    </div>
  );
}

export default App;