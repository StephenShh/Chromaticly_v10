import { Meteor } from 'meteor/meteor';

import { Colors } from '../imports/db/databases.js';
import { Curations } from '../imports/db/databases.js';

Meteor.startup(() => {


	var Particle = require('particle-api-js');
    var particle = new Particle();
    var token = "";
    var deviceID = "30003b000a47343432313031";
    
    particle.login({username: 'sschaf@yahoo.com', password: '1745Grove1965!'}
    	).then(
	      function(data){
	      	token = data.body.access_token;
	        console.log('API call completed on promise resolve: ', data.body.access_token);
	        return token;
	      },
	      function(err) {
	        console.log('API call completed on promise fail: ', err);
	        return -1;
	      }
    	).then(function(auth) {
    		if (auth == -1) {
    			console.log("LOGIN FAILED");
    		} else {
    			console.log("TOKEN: " + auth)
    		}

    });



	const curationDuration = 5;

	Meteor.setInterval(function() {
		// console.log('Second passed');

		var curationsData = Curations.findOne({"ID": "SS"});
		var secondsRemaining = curationsData["MasterClock"];
		console.log(secondsRemaining);

		if (secondsRemaining <= 0) {

			// Meteor.call('beginPhotonTransmission');

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

				var dataForPhoton = Colors.find({"Country": nextCuration["Country"], "Category": nextCuration["Category"]});
				console.log(dataForPhoton);

			} else {
				Curations.update({"ID":"SS"},
					{$set:
						{
							"MasterClock": curationDuration,
						}
					}
				);

				var currentCuration = curationsData["Active"];

				var dataForPhoton = Colors.findOne({"Country": currentCuration["Country"], "Category": currentCuration["Category"]})["Colors"];
				Meteor.call('transmitToPhoton', dataForPhoton);



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

	
	// how many columns in end display
	//const columnsCount = 8 * 10; //80
	const columnsCount = 8 * 8;
	// what is the sum of all the weights in our colors data?
	const totalWeight = 1000;
	// what fraction of total colors do we send at once
	const sendAtOnce = 0.05;

	// where did we stop sending data in the last batch?
	var stopIndex = 1;
	// how many transmissions have we sent so far?
	var transmissionCount = 0;

	// keep track of overflow between transmissions 
	var overflowColor = '';
	var overflowWeight = 0;

//
	function formatColorForPhoton(inputColor) {
		var firstC = inputColor;
		var color = firstC.split(", ");
		color[0] = color[0].slice(1);
		color[2] = color[2].slice(0, color[2].length - 1);
		console.log(color);
		for (var i = 0; i < color.length; i++) {
			if (color[i].length == 1) {
				color[i] = "00" + color[i];
			} else if (color[i].length == 2) {
				color[i] = "0" + color[i];
			} 
		}
		var colorString = color[0] + color[1] + color[2];
		return colorString;
	}

	function formatWeightForPhoton(inputWeight) {

		// inputWeight = 11.67;
		weightAsPercentage = inputWeight / (totalWeight * sendAtOnce);
		// weightAsPercentage = 0.22
		weightAsColumnCount = weightAsPercentage * columnsCount;
		columnsAsInt = Math.floor(weightAsColumnCount);
		
		if (columnsAsInt < 10) {
			columnsAsInt = "00" + columnsAsInt;
		} else if (columnsAsInt < 100) {
			columnsAsInt = "0" + columnsAsInt;
		}

		return columnsAsInt;
	}

	Meteor.methods({
		'transmitToPhoton' (colorData) {
			console.log(colorData);


			// keep track of colors that will send with this batch
			colorsToSend = [];
			// keep track of those colors' weights 
			colorWeights = [];

			var runningWeight = 0;
			for (var i = stopIndex; i < colorData.length; i += 2) {
				currentColor = colorData[i-1];
				currentWeight = parseFloat(colorData[i]);
				runningWeight += currentWeight;

				console.log(runningWeight);
				if (runningWeight > sendAtOnce * totalWeight) {
					// this means we need to stop
					stopIndex = i;

					colorsToSend.push(currentColor);

					var weightToSend = (sendAtOnce * totalWeight) - (runningWeight - currentWeight);
					colorWeights.push(weightToSend);

					var remainingWeight = (runningWeight - sendAtOnce * totalWeight);

					// what needs to be sent in the next batch?
					overflowColor = currentColor;
					overflowWeight = remainingWeight;

					colorData[i] = overflowWeight;
					colorData[i-1] = overflowColor;

					i = colorData.length;
				} else {

					colorsToSend.push(currentColor);
					colorWeights.push(currentWeight);

				}
			}

			console.log("Send these colors:");
			console.log(colorsToSend);
			console.log("with these weights:");
			console.log(colorWeights);

			transmissionCount += 1;
			console.log("TCount:");
			console.log(transmissionCount);
			console.log("Out of expected:");
			console.log(1.0 / sendAtOnce);

			dataStream = '';
			for (var p = 0; p < colorsToSend.length; p++) {
				dataStream += formatColorForPhoton(colorsToSend[p]);
				dataStream += formatWeightForPhoton(colorWeights[p]);
			}

			console.log(dataStream);

			// console.log(colorData);




			// // '(85, 146, 185)'
			// // var transData = firstC;

			var publishEventPr = particle.publishEvent({ name: 'newCuration', data: dataStream, auth: token });

			publishEventPr.then(
			  function(data) {
			    if (data.body.ok) { console.log("Event published succesfully") }
			  },
			  function(err) {
			    console.log("Failed to publish event: " + err)
			  }
			);
		},
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
