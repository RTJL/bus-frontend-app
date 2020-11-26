import React from 'react';
import logo from './logo.svg';
import './App.css';

import BusesList from "./components/BusesList";
import BusStopsList from "./components/BusStopsList";
import Home from "./components/Home";
import { Switch, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path={["/"]} component={Home}/>
        <Route exact path={["/buses"]} component={BusesList}/>
        <Route exact path={["/busStops"]} component={BusStopsList}/>
      </Switch>
    </div>
  );
}

export default App;
