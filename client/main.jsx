import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.jsx';
import { renderRoutes } from './routes.js';
 
Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});