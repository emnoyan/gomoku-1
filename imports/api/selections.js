import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Selections = new Mongo.Collection('selections');

Meteor.methods({
    'selections.remove'() {
        Selections.remove({});
    },
	'selections.insert'(selection) {
        Selections.insert(selection)
    }
});