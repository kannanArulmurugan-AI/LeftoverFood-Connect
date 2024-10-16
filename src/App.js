import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import HotelDashboard from './components/HotelDashboard';
import CustomerDashboard from './components/CustomerDashboard';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/hotel" component={HotelDashboard} />
        <Route path="/customer" component={CustomerDashboard} />
      </Switch>
    </Router>
  );
}

export default App;
