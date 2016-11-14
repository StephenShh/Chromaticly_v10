import { Mongo } from 'meteor/mongo';

export const Colors = new Mongo.Collection('colors');
export const Curations = new Mongo.Collection('curations');

// db.curations.insert({"MasterClock": 0, "Active": {"Status": "Idle"}, "Upcoming": []})

// if someone adds to the queue:
// 	if active status is idle:
// 		masterclock goes to 60
// 		active is set to the chosen Curations
// 		status goes to active
// 	if active status is not idle:
// 		curation is added the end of upcoming

// if masterclock hits 0:
// 	if there is at least one item in upcoming:
// 		active switches to the first item in upcoming
// 		the first item in upcoming is deleted
// 		masterclock is reset to 60
// 	if upcoming is empty:
// 		masterclock is reset to 60

// every second:
// 	if masterclock is not equal to 0:
// 		masterclock goes down by 1


// {'Country': {"Category": colorsData}