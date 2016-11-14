import { Meteor } from 'meteor/meteor';

import { Colors } from '../imports/db/databases.js';
import { Curations } from '../imports/db/databases.js';

Meteor.startup(() => {

	const curationDuration = 90;


	Meteor.setInterval(function() {
		// console.log('Second passed');

		var curationsData = Curations.findOne({"ID": "SS"});
		var secondsRemaining = curationsData["MasterClock"];
		console.log(secondsRemaining);

		if (secondsRemaining <= 0) {
			var upcoming = curationsData["Upcoming"];
			if (upcoming.length > 0) {
				// console.log(upcoming.length);
				var nextCuration = upcoming[0];
				nextCuration["Status"] = "Active";

				upcoming.splice(0, 1);

				Curations.update({"ID":"SS"},
					{$set:
						{
							"MasterClock": curationDuration,
							"Active": nextCuration,
							"Upcoming": upcoming
						}
					}
				);


			} else {
				Curations.update({"ID":"SS"},
					{$set:
						{
							"MasterClock": curationDuration,
						}
					}
				);

			}

		}

		//  if there is at least one item in upcoming:
		//      active switches to the first item in upcoming
		//      the first item in upcoming is deleted
		//      masterclock is reset to 60
		//  if upcoming is empty:
		//      masterclock is reset to 60
		//      ** possibly display a random curation


		Curations.update({"ID":"SS"},
            {$inc:
                {
                    "MasterClock": -1
                }
            }
        );

	}, 1000);


	Meteor.methods({
		'flushDatabase' () {
			console.log("Flushing....");
			 Curations.update({"ID": "SS"}, 
		        {$set: {
		            "Upcoming": [],
		            "MasterClock": curationDuration
		        }
		    });
		},
		'getCurationDuration' () {
			// console.log(curationDuration);
			return curationDuration;
		},
		'addToQueue'({country, category}) {

			// console.log(country);
			// console.log(category);

			var curationData = Curations.findOne({"ID": "SS"});
	        if (curationData["Active"]["Status"] == "Idle") {
	            console.log(curationData);
	            // curationData["MasterClock"] = 60;
	            // curationData["Ac"]

	            Curations.update({"ID":"SS"},
	                {$set:
	                    {
	                        "MasterClock": curationDuration,
	                        "Active": {
	                            "Status": "Active",
	                            "Country": country,
	                            "Category": category
	                        }
	                    }
	                }
	            );

	        } else {

	            var allUpcoming = curationData["Upcoming"];
	            allUpcoming.push({
	                "Country": country,
	                "Category": category
	            })

	            Curations.update({"ID":"SS"},
	                {$set:
	                    {
	                        "Upcoming": allUpcoming
	                    }
	                }
	            );

	        }

		}
	});

// if someone adds to the queue:
//  if active status is idle:
//      masterclock goes to 60
//      active is set to the chosen Curations
//      status goes to active
//  if active status is not idle:
//      curation is added the end of upcoming

// if masterclock hits 0:
//  if there is at least one item in upcoming:
//      active switches to the first item in upcoming
//      the first item in upcoming is deleted
//      masterclock is reset to 60
//  if upcoming is empty:
//      masterclock is reset to 60

// every second:
//  if masterclock is not equal to 0:
//      masterclock goes down by 1


	// Colors.insert({
	// 	Country: 'Brazil',
	// 	Category: 'Sports',
	// 	Colors: ['Colors for Sports in BR']
	// });
	// Colors.insert({
	// 	Country: 'Brazil',
	// 	Category: 'Games',
	// 	Colors: ['Colors for Games in BR']
	// });

	// we're building a way for our Python code to be 
	// able to go to a particular page on our site
	// and feed color information into our database

	var Api = new Restivus({
		useDefaultAuth: true,
		prettyJson: true
	});

	Api.addRoute('color', {authRequired: false}, {
		post: function() {
			console.log(this.bodyParams);

			let entry = this.bodyParams;

			Colors.insert({
				Country: entry['Country'],
				Category: entry['Category'],
				Colors: entry['Colors']
			});
			return true;
		}
	});

  // code to run on server at startup
});
