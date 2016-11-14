$(function() { 




// ----------  DEMOGRAPHIC DESCRIPTIONS SCRIPTS   -------------//
// *****    This is script that toggles the descriptions
	$(".rainbow-icon").on("click",function(){

		if ($(this).hasClass("hero-icon")) {
			$('.hero-gradient.rainbow').siblings('.rainbow-description').slideToggle(300);
		} else {

			$(this).parents(".sub-gradient").find(".rainbow-description").slideToggle(500)
			
		}
	})
// ------------  END   ---------------//


// ------------  MODAL SCRIPTS   ---------------//

// ***** This is the REMINDER BUTTON CLICK SCRIPT:
	function remindMe(){
		var x;
	    if (confirm("Press a button!") == true) {
	        x = "OK";
	    } else {
	        x = "X";
	    }
	    document.getElementById("reminderText").innerHTML = x;
	}

//  this is the MODAL Reveal Script

// Get the modal
	var modal = $('#myModal');


// Get the button that opens the modal
	var btn = $("#myBtn");


// Get the <span> element that closes the modal
	var span = $(".close");


// When the user clicks the button, open the modal
	$(".iconRemind").on("click",function() {
	    modal.style.display = "block";
	})

// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	    modal.style.display = "none";
	}

// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	        modal.style.display = "none";
	    }
	}


// ------------  END   ---------------//


});

