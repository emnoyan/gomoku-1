import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Users = new Mongo.Collection('users')

Meteor.methods({
	'users.remove'(userId) {
    	Users.remove({userId});
  	}
});