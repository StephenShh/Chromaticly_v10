import './loadScreen.html';
import './body.html';
import './entry.html';
import './modalRemind.html';
import './modalShare.html';
import './heroGradient.html';
import './subGradient.html';

import { Colors } from '../db/databases.js';
import { Curations } from '../db/databases.js';


// ---------- LOAD SCREEN SCRIPT --------------//

Template.loadScreen.onRendered(function() {
    console.log('DB:');
    console.log(Colors.find({}).fetch());
    function loadScreenAnimation() {
       Meteor.setTimeout(closeLoadAnimation, 3000);
    } 
});
// ------------  END   ---------------//

 // ------------- UPCOMING CURATION COLOR BAR ------------//
// *** The function to render the upcoming queue colors  ***//

Template.heroGradient.helpers({
    'currentCountry'() {
        return Curations.findOne({})["Active"]["Country"];
    },
    'currentCategory'() {
        return Curations.findOne({})["Active"]["Category"];
    },
    'renderBackground'() {
        // console.log(Curations.findOne({"ID":"SS"}));
        // console.log(Curations.find().fetch());
        // console.log("Printed");
        var country = Curations.findOne({})["Active"]["Country"];
        // console.log(country);
        var category = Curations.findOne({})["Active"]["Category"];
        var colors = Colors.findOne({"Country": country, "Category": category})["Colors"];
        // console.log(colors);
        // console.log("Colors");
        

        // console.log(colors);
        // var totalColorsLength = 0

        var opacity = 0.85;
        var colorBarCSS = "linear-gradient(to right, ";
        var barXPointer = 0;

        for (var colorIndex = 0; colorIndex < colors.length; colorIndex += 2) {

            //[
        //         [
        //             40, 
        //             10, 
        //             146
        //         ], 
        //         2.8735632183908053
        //     ]

            var currentColor = colors[colorIndex];
            // "(43, 99, 179)"
            var currentColorWidth = colors[colorIndex + 1]
            // "0.2849002849"

            var splitColors = currentColor.split(", ");
            // console.log(splitColors);

            var rgbColors = [splitColors[0].slice(1), splitColors[1], splitColors[2].slice(0,splitColors[2].length-1)];
            // console.log(rgbColors);

            var currentColorDataset = [rgbColors, currentColorWidth];
            // console.log(currentColorDataset);
            // var currentColorDataset = colors[colorIndex];

            var currentColor = currentColorDataset[0];
            var currentColorFormatted = 
                "rgba(" + 
                    currentColor[0] + ", " + 
                    currentColor[1] + ", " + 
                    currentColor[2] + ", " +
                    opacity + ") ";
            // console.log(currentColorFormatted);

            var currentColorLength = currentColorDataset[1] / 10;

            var currentColorStartPercentage = barXPointer + "%";
            var currentColorEndPercentage = (barXPointer + currentColorLength) + "%";

            barXPointer += currentColorLength;

            colorBarCSS += 
                currentColorFormatted + 
                currentColorStartPercentage +
                ", " +
                currentColorFormatted + 
                currentColorEndPercentage;

            if (colorIndex != colors.length - 2) {
                colorBarCSS += ", "
            } else {
                colorBarCSS += ")";
            }
        }

        // console.log('COLORS CSS');
        // console.log(colorBarCSS);

        colorBarTest = 'linear-gradient(to right, rgb(142, 188, 239) 0%, rgb(142, 188, 239) 100%)';
        // console.log(colorBarTest);

        // console.log($('.rainbow').css('background-image'));
        $('.rainbow').css('background', colorBarCSS);
        // console.log($('.rainbow').css('background-image'));
    }
});

function stripWord(wrd) {
    var newWord = '';
    var alpha = 'ABCDEFGHIJLKMNOPQRSTUVWXYZ';
    for (var i = 0; i < wrd.length; i++) {
        var currentChar = wrd.charAt(i);
        if (alpha.indexOf(currentChar) > -1) {
            newWord += wrd.charAt(i);
        }
    }
    return newWord;
};

Template.subGradient.helpers({
    'updateCountdown' () {
        var country = this.Country;
        var countryAbbreviated = stripWord(country);
        var category = this.Category;
        var categoryAbbreviated = stripWord(category);

        var curationsData = Curations.findOne({"ID": "SS"});
        var upcoming = curationsData["Upcoming"];
        var secondsRemaining = curationsData["MasterClock"];
        
        for (var i = 0; i < upcoming.length; i++) {
            var thisCuration = upcoming[i];
            if (thisCuration["Category"] == category && thisCuration["Country"] == country) {
                var countdown = Meteor.call('getCurationDuration', function(e, curationInterval) {
                    // console.log(result);
                    // console.log(i);
                    const classToMatch = '.time3.' + categoryAbbreviated + '.' + countryAbbreviated;
                    var timeLeft = secondsRemaining + curationInterval * i;
                    
                    var timeAsString = '';
                    var hours = Math.floor(timeLeft / (60 * 60));
                    timeLeft = timeLeft - (hours * (60 * 60));
                    var minutes = Math.floor(timeLeft / 60);
                    var seconds = timeLeft % 60;
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    $(classToMatch).text(hours + ":" + minutes + ":" + seconds);
                });
                break;
            }

        }
    },
    'currentCountry'() {
        return this.Country;//Curations.findOne({})["Active"]["Country"];
    },
    'currentCategory'() {
        return this.Category;//Curations.findOne({})["Active"]["Category"];
    },
    'getCategoryAbbrev'() {
        var fullCategory = this.Category;
        // console.log(fullCategory);
        return stripWord(fullCategory);
    }, 
    'getCountryAbbrev'() {
        var fullCountry = this.Country;
        // console.log(fullCountry);
        return stripWord(fullCountry);
    },
    'renderBackground'() {
        // console.log("TEMPLATE");
        // console.log(Template.instance());
        // console.log(Curations.findOne({"ID":"SS"}));
        // console.log(Curations.find().fetch());
        // console.log("Printed");
        var country = this.Country;
        var countryAbbreviated = stripWord(country);
        // console.log(country);
        var category = this.Category;
        var categoryAbbreviated = stripWord(category);

        var colors = Colors.findOne({"Country": country, "Category": category})["Colors"];
        // console.log(colors);
        // console.log("Colors");
        

        // console.log(colors);
        // var totalColorsLength = 0

        var opacity = 0.6;
        var colorBarCSS = "linear-gradient(to right, ";
        var barXPointer = 0;

        for (var colorIndex = 0; colorIndex < colors.length; colorIndex += 2) {

            //[
        //         [
        //             40, 
        //             10, 
        //             146
        //         ], 
        //         2.8735632183908053
        //     ]

            var currentColor = colors[colorIndex];
            // "(43, 99, 179)"
            var currentColorWidth = colors[colorIndex + 1]
            // "0.2849002849"

            var splitColors = currentColor.split(", ");
            // console.log(splitColors);

            var rgbColors = [splitColors[0].slice(1), splitColors[1], splitColors[2].slice(0,splitColors[2].length-1)];
            // console.log(rgbColors);

            var currentColorDataset = [rgbColors, currentColorWidth];
            // console.log(currentColorDataset);
            // var currentColorDataset = colors[colorIndex];

            var currentColor = currentColorDataset[0];
            var currentColorFormatted = 
                "rgba(" + 
                    currentColor[0] + ", " + 
                    currentColor[1] + ", " + 
                    currentColor[2] + ", " +
                    opacity + ") ";
            // console.log(currentColorFormatted);

            var currentColorLength = currentColorDataset[1] / 10;

            var currentColorStartPercentage = barXPointer + "%";
            var currentColorEndPercentage = (barXPointer + currentColorLength) + "%";

            barXPointer += currentColorLength;

            colorBarCSS += 
                currentColorFormatted + 
                currentColorStartPercentage +
                ", " +
                currentColorFormatted + 
                currentColorEndPercentage;

            if (colorIndex != colors.length - 2) {
                colorBarCSS += ", "
            } else {
                colorBarCSS += ")";
            }
        }

        // console.log('COLORS CSS');
        // console.log(colorBarCSS);

        colorBarTest = 'linear-gradient(to right, rgb(142, 188, 239) 0%, rgb(142, 188, 239) 100%)';
        // console.log(colorBarTest);

        // console.log($('.rainbow').css('background-image'));
        const classToMatch = '.rainbow.' + categoryAbbreviated + '.' + countryAbbreviated;
        $(classToMatch).css('background', colorBarCSS);
        // console.log($('.rainbow').css('background-image'));
    }
});

// Template.queue.onCreated(function() {
//     var self = this;
//     self.autorun(function() {
//         self.subscribe("results");
//     }
// });

Template.queue.onRendered(function() {
    

});

// ------------  END   ---------------//

 // ------------- CURRENT CURATION COLOR BAR ------------//
// Template.queue.onRendered(function() {


//     ];

//     // var totalColorsLength = 0

//     var opacity = 0.6;
//     var colorBarCSS = "linear-gradient(to right, ";
//     var barXPointer = 0;

//     for (var colorIndex = 0; colorIndex < colors.length; colorIndex++) {
//         var currentColorDataset = colors[colorIndex];

//         var currentColor = currentColorDataset[0];
//         var currentColorFormatted = 
//             "rgba(" + 
//                 currentColor[0] + ", " + 
//                 currentColor[1] + ", " + 
//                 currentColor[2] + ", " +
//                 opacity + ") ";
//         // console.log(currentColorFormatted);

//         var currentColorLength = currentColorDataset[1] / 10;

//         var currentColorStartPercentage = barXPointer + "%";
//         var currentColorEndPercentage = (barXPointer + currentColorLength) + "%";

//         barXPointer += currentColorLength;

//         colorBarCSS += 
//             currentColorFormatted + 
//             currentColorStartPercentage +
//             ", " +
//             currentColorFormatted + 
//             currentColorEndPercentage;

//         if (colorIndex != colors.length - 1) {
//             colorBarCSS += ", "
//         } else {
//             colorBarCSS += ")";
//         }
//     }

//     // console.log(colorBarCSS);

//     colorBarTest = 'linear-gradient(to right, rgb(142, 188, 239) 0%, rgb(142, 188, 239) 100%)';
//     // console.log(colorBarTest);

//     // console.log($('.rainbow').css('background-image'));
//     $('hero-gradient.rainbow').css('background', colorBarCSS);
//     // console.log($('.rainbow').css('background-image'));

// });
 // ------------  END   ---------------//

Template.queue.helpers({
    'upcomingCuration' () {
        var curationData = Curations.findOne({"ID": "SS"});
        return curationData["Upcoming"];
    }

});

// Template.modalRemind.helpers({
//     'updateCountdown' () {
//         console.log(this);
//         $('#modalRemind').css('display', 'block');

//         var country = this.Country;
//         var countryAbbreviated = stripWord(country);
//         var category = this.Category;
//         var categoryAbbreviated = stripWord(category);

//         var curationsData = Curations.findOne({"ID": "SS"});
//         var upcoming = curationsData["Upcoming"];
//         var secondsRemaining = curationsData["MasterClock"];
        
//         for (var i = 0; i < upcoming.length; i++) {
//             var thisCuration = upcoming[i];
//             if (thisCuration["Category"] == category && thisCuration["Country"] == country) {
//                 var countdown = Meteor.call('getCurationDuration', function(e, curationInterval) {
//                     // console.log(result);
//                     // console.log(i);
//                     // const classToMatch = '.time3.' + categoryAbbreviated + '.' + countryAbbreviated;
//                     var timeLeft = secondsRemaining + curationInterval * i;
                    
//                     var timeAsString = '';
//                     var hours = Math.floor(timeLeft / (60 * 60));
//                     timeLeft = timeLeft - (hours * (60 * 60));
//                     var minutes = Math.floor(timeLeft / 60);
//                     var seconds = timeLeft % 60;
//                     if (hours < 10) {
//                         hours = "0" + hours;
//                     }
//                     if (minutes < 10) {
//                         minutes = "0" + minutes;
//                     }
//                     if (seconds < 10) {
//                         seconds = "0" + seconds;
//                     }
//                     $('.hrs.modalR').text(hours);
//                     $('.mins.modalR').text(minutes);
//                     $('.secs.modalR').text(seconds);
//                     // $(classToMatch).text(hours + ":" + minutes + ":" + seconds);
//                 });
//                 break;
//             }

//         }
//     }
// });

// *** The function to show/hide the additional demographic info for each curation  **//
// *** and will show the curation timing for each of the upcoming curations  **//
Template.queue.events({
	'click .rainbow-icon'(event) {
		
		var element = event.target;

		if ($(element).hasClass("hero-icon")) {
			$('.hero-gradient.rainbow').siblings('.rainbow-description').slideToggle(300);
		} else {

			$(element).parents(".sub-gradient").find(".rainbow-description").slideToggle(500)
		}
	},
	'click .iconRemind.show'() {
        console.log(this);
		$('#modalRemind').css('display', 'block');

        var country = this.Country;
        var countryAbbreviated = stripWord(country);
        var category = this.Category;
        var categoryAbbreviated = stripWord(category);

        var curationsData = Curations.findOne({"ID": "SS"});
        var upcoming = curationsData["Upcoming"];
        var secondsRemaining = curationsData["MasterClock"];
        
        for (var i = 0; i < upcoming.length; i++) {
            var thisCuration = upcoming[i];
            if (thisCuration["Category"] == category && thisCuration["Country"] == country) {
                var countdown = Meteor.call('getCurationDuration', function(e, curationInterval) {
                    // console.log(result);
                    // console.log(i);
                    // const classToMatch = '.time3.' + categoryAbbreviated + '.' + countryAbbreviated;
                    var timeLeft = secondsRemaining + curationInterval * i;
                    
                    var timeAsString = '';
                    var hours = Math.floor(timeLeft / (60 * 60));
                    timeLeft = timeLeft - (hours * (60 * 60));
                    var minutes = Math.floor(timeLeft / 60);
                    var seconds = timeLeft % 60;
                    if (hours < 10) {
                        hours = "0" + hours;
                    }
                    if (minutes < 10) {
                        minutes = "0" + minutes;
                    }
                    if (seconds < 10) {
                        seconds = "0" + seconds;
                    }
                    $('.hrs.modalR').text(hours);
                    $('.mins.modalR').text(minutes);
                    $('.secs.modalR').text(seconds);
                    // $(classToMatch).text(hours + ":" + minutes + ":" + seconds);
                });
                break;
            }

        }


        var child = $("#modalRemind").children()[0];
        $(child).removeClass("fadeOutDown");
        $(child).addClass("fadeInUp");
	},

	'click .iconShare.show'() {
		$('#modalShare').css('display', 'block');
        var child = $("#modalShare").children()[0];
        $(child).removeClass("fadeOutDown");
        $(child).addClass("fadeInUp");

	},
	'click .close.closeRemind'() {
		// $(arguments[0].target).parents(".modal").hide();
        var child = $("#modalRemind").children()[0];
        // console.log(child);
        $(child).removeClass("fadeInUp");
        $(child).addClass("fadeOutDown");

        function removeDarkBackground() {
            $('#modalRemind').css('display', 'none');
        }
        Meteor.setTimeout(removeDarkBackground, 500);

	},
    'click .close.closeShare'() {
        // $(arguments[0].target).parents(".modal").hide();
        var child = $("#modalShare").children()[0];
        // console.log(child);
        $(child).removeClass("fadeInUp");
        $(child).addClass("fadeOutDown");

        function removeDarkBackground() {
            $('#modalShare').css('display', 'none');
        }
        Meteor.setTimeout(removeDarkBackground, 500);

    },

	

});

Template.loadScreen.onRendered(function() {
    function goToQueue() {
        FlowRouter.go("/queue");
    }
    Meteor.setTimeout(goToQueue, 3000);
});


Template.entry.onRendered(function() {
	function searchOpenAnimation() {
		$('.loader-bar').addClass("full");
		Meteor.setTimeout(searchFieldAnimation, 500);
	}
	function searchFieldAnimation() {
		$(".search-bar .menuItems").fadeIn();
        $('.search-bar').addClass("active");
	}
	Meteor.setTimeout(searchOpenAnimation, 3000);
});



//   *** The function to on-click load the Search Bar **Deprecated**  **//
Template.entry.events({
	// 'click .loader-img'(event) {
	// 	console.log("click");
	// 	$('.loader-bar').addClass("full");
		
	// 	console.log(blah);
	// 	// blah = true;
	// },
	// 'transitionend .loader-img'(event) {
	// 	if(!blah) return;
	// 	console.log("honk")
	// 	$(".search-bar .menuItems").fadeIn();
	// }

});

Template.entry.events({
    'click .main-button'(){
        console.log("Curation entered.");
        const country = $( "#countrySelection option:selected" ).text();
        const category = $( "#categorySelection option:selected" ).text();
        console.log(country);
        console.log(category);

        Meteor.call('addToQueue', {"country": country, "category": category});

        // db.curations.insert({"ID": "SS", "MasterClock": 0, "Active": {"Status": "Idle"}, "Upcoming": []})

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
//      ** possibly display a random curation

// every second:
//  if masterclock is not equal to 0:
//      masterclock goes down by 1


    }
});

Template.entry.helpers({
    'updateCountdown' () {
        // var country = this.Country;
        // var countryAbbreviated = stripWord(country);
        // var category = this.Category;
        // var categoryAbbreviated = stripWord(category);

        var curationsData = Curations.findOne({"ID": "SS"});
        // console.log(curationsData);
        var upcoming = curationsData["Upcoming"];
        var secondsRemaining = curationsData["MasterClock"];
        
        var countdown = Meteor.call('getCurationDuration', function(e, curationInterval) {
            // console.log(result);
            // console.log(i);

            const upcomingCount = upcoming.length;

            var secondsUntilCuration = upcomingCount * curationInterval + secondsRemaining;
            
            var hours = Math.floor(secondsUntilCuration / (60 * 60));
            secondsUntilCuration = secondsUntilCuration - (hours * (60 * 60));
            var minutes = Math.floor(secondsUntilCuration / 60);
            var seconds = secondsUntilCuration % 60;
            if (hours < 10) {
                hours = "0" + hours;
            }
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            $('.hrs').text(hours);
            $('.mins').text(minutes);
            $('.secs').text(seconds);

        });

        // for (var i = 0; i < upcoming.length; i++) {
        //     var thisCuration = upcoming[i];
        //     if (thisCuration["Category"] == category && thisCuration["Country"] == country) {
        //         var countdown = Meteor.call('getCurationDuration', function(e, curationInterval) {
        //             // console.log(result);
        //             console.log(i);
        //             const classToMatch = '.time3.' + categoryAbbreviated + '.' + countryAbbreviated;
        //             var timeLeft = secondsRemaining + curationInterval * i;
                    
        //             var timeAsString = '';
        //             var hours = Math.floor(timeLeft / (60 * 60));
        //             timeLeft = timeLeft - (hours * (60 * 60));
        //             var minutes = Math.floor(timeLeft / 60);
        //             var seconds = timeLeft % 60;
        //             if (hours < 10) {
        //                 hours = "0" + hours;
        //             }
        //             if (minutes < 10) {
        //                 minutes = "0" + minutes;
        //             }
        //             if (seconds < 10) {
        //                 seconds = "0" + seconds;
        //             }
        //             $(classToMatch).text(hours + ":" + minutes + ":" + seconds);
        //         });
        //         break;
        //     }

        // }
    },
    'countries'() {

        var countries = [];
        allEntries = Colors.find().fetch();
        $(allEntries).each(function(index, element) {

            const country = element['Country'];
            if (countries.indexOf(country) == -1) {
                countries.push(country);
                // console.log(country);
            }
            
        });
        // return Colors.
        return countries;

    },
    'categories'() {

        var categories = [];
        allEntries = Colors.find().fetch();
        $(allEntries).each(function(index, element) {

            const category = element['Category'];
            if (categories.indexOf(category) == -1) {
                categories.push(category);
                // console.log(category);

            }
            
        });
        // return Colors.
        return categories;

    }
});

//   *** The function to render the REMINDER MODAL Elements  ***//
Template.modalRemind.onRendered(function() {
    $(".name").focus(function(){
        $(".name-help").slideDown(500);
    }).blur(function(){
        $(".name-help").slideUp(500);
    });

    $(".email").focus(function(){
      $(".email-help").slideDown(500);
    }).blur(function(){
      $(".email-help").slideUp(500);
    });

    $(".message").focus(function(){
      $(".message-help").slideDown(500);
    }).blur(function(){
      $(".message-help").slideUp(500);
    });

});

//   *** The function to render the SHARE MODAL Elements  ***//
Template.modalShare.onRendered(function() {
    $(".name").focus(function(){
        $(".name-help").slideDown(500);
    }).blur(function(){
        $(".name-help").slideUp(500);
    });

    $(".phone").focus(function(){
      $(".phone-help").slideDown(500);
    }).blur(function(){
      $(".phone-help").slideUp(500);
    });

    $(".message").focus(function(){
      $(".message-help").slideDown(500);
    }).blur(function(){
      $(".message-help").slideUp(500);
    });

});

