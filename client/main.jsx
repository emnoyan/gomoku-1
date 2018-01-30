import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import App from '../imports/ui/App.jsx';
import { renderRoutes } from './routes.js';
 
Meteor.startup(() => {
  	render(renderRoutes(), document.getElementById('render-target'));
  	$(window).bind('beforeunload', function() {
        closingWindow();

        // have to return null, unless you want a chrome popup alert
        return null;
  	});
});

closingWindow = function(){
    Meteor.call('users.remove', globalUserId);
}