import { Meteor } from 'meteor/meteor';
import '../imports/api/selections.js';
import { Users } from '../imports/api/users.js';

Meteor.startup(() => {
  // code to run on server at startup
  // cheat to make App go to componentWillReceiveProps when don't have any user in db
  Users.remove({})
  Users.insert({ roomId: 99})
});
