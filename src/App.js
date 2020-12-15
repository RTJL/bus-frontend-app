import React from 'react';
import './App.css';

import BusList from "./components/BusList";
import Search from './components/Search';
import HomePage from './containers.js/HomePage';
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path={["/"]} component={HomePage}/>
      </Switch>
    </div>
  );
}

export default App;
