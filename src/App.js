import React from 'react';
import { Route } from 'react-router-dom';

import Header from './components/Header';

import Auth from './pages/Auth/Auth';
import Register from './pages/Register/Register';
import Home from './pages/Home';

function App() {

  return (
    <div className="App">
      <Route path="/auth" exact>
        <Auth/>
      </Route>

      <Route path="/register" exact>
        <Register/>
      </Route>
      
      <Header/>

      <Route path="" exact>
        <Home />
      </Route>
    </div>
  );
}

export default App;
