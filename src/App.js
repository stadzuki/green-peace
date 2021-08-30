import React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth/Auth';
import Header from './components/Header';

// import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Header />

      <Route path="" exact>
        {/* <Home /> */}
      </Route>

      <Route path="auth" exact>
          <Auth test="1"/>
      </Route>
    </div>
  );
}

export default App;
