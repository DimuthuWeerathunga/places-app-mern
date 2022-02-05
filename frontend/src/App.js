import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import NewPlace from './places/pages/NewPlace';
import Users from './user/pages/Users';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';

function App() {
  return (
    <Router>
      <MainNavigation></MainNavigation>
      <main>
        <Switch>
          <Route path='/' exact>
            <Users></Users>
          </Route>
          <Route path='/:userId/places' exact>
            <UserPlaces></UserPlaces>
          </Route>
          <Route path='/places/new' exact>
            <NewPlace></NewPlace>
          </Route>
          <Redirect to='/'></Redirect>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
