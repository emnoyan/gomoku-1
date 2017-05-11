import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
// route components
import App from '../imports/ui/App.jsx';
export const renderRoutes = () => (
  	<BrowserRouter>
      	<Route path="/room/:roomId" component={App}/>
 	</BrowserRouter>
);