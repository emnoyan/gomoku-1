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

        // have to return null, unless you want a chrome popup alert
        //return 'Are you sure you want to leave your Vonvo?';
  	});
});

closingWindow = function(){
    console.log('closingWindow');
    Meteor.call('users.remove', globalUserId);
}