import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';

import App from './App';
import Admin from './pages/Admin';
import Catalog from './pages/Catalog';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/reset.css';
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
          <Route exact path="/" component={App} />
          <Route path="/admin" component={Admin} />
          <Route path="/catalog" component={Catalog}/>
      </Switch>
      {/* <App /> */}
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

