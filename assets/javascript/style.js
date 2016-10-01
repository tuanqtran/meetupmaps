$(document).ready(function(){
	// Materialize: Required to use collapse the sideNav.
	$('.button-collapse').sideNav({
    	menuWidth: 300, // Default is 240
    	edge: 'left', // Choose the horizontal origin
    	closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });

	// Materialize: Required for the carousel slider to have full width.
	$('.carousel.carousel-slider').carousel({full_width: true});
	// Materialize: Required to open a modal using a trigger.
    $('.modal-trigger').leanModal();
    // Materialize: Required if search box are added dynamically. This allows us to initialize them.
    $('input#input_text, textarea#textarea1').characterCounter();
    // Materialize: Requried if the collapsible info are added dynamically. You can also pass in options inside the initialization.
    $('.collapsible').collapsible({
    	accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});

    // Upon hovering over a modal2 images, expand the main modal and strink/blur the rest. When the mouse leaves reset to normal.
	// $(".image-hover").mouseover(function(){
	// 	$(".image-hover").addClass("image-temp");
	// 	$(this).addClass("image-active")
	// 		.removeClass("image-hover");

	// 	$(".image-hover").addClass("image-hover-nonactive")
	// 		.removeClass("image-hover");
	// }).mouseleave(function(){
	// 	$(".image-temp").removeClass("image-active")
	// 		.removeClass("image-hover-nonactive")
	// 		.addClass("image-hover");
	// });

    // Upon hovering over modal2 rows, expand the main modal cards and strink/blur the rest. When the mouse leaves reset to normal. (This applies to dynamic changes.)
	$(".row").on("mouseover", ".image-hover", function(){

		$(".image-hover").addClass("image-temp");
		$(this).addClass("image-active")
			.removeClass("image-hover");

		$(".image-hover").addClass("image-hover-nonactive")
			.removeClass("image-hover");

	}).on("mouseleave", ".image-temp", function(){
		$(".image-temp").removeClass("image-active")
			.removeClass("image-hover-nonactive")
			.addClass("image-hover");
	});

	// When hovering over the modal 4 icons container. Enlarge the chosen icon and decrease the rest.
	$(".linkAnimation").mouseover(function(){
		$(this).children().children().children().addClass("portfolio-icon-enlarge");
		$(this).siblings().children().children().children().addClass("portfolio-icon-shorten")
			.parent().parent().parent().parent().parent().parent().parent().siblings()
			.children().children().children().children().children().children()
			.children().addClass("portfolio-icon-shorten");
	}).mouseleave(function(){
		$(this).children().children().children().removeClass("portfolio-icon-enlarge")
		$(this).siblings().children().children().children().removeClass("portfolio-icon-shorten")
			.parent().parent().parent().parent().parent().parent().parent().siblings()
			.children().children().children().children().children().children()
			.children().removeClass("portfolio-icon-shorten");
	});

	// When hovering over the modal 4 profile cards, create a jelly effect to the other cards and brighten the chosen image. When the mouse leaves reset to normal.
	$(".profile-card").mouseover(function(){
		$(this).parent().siblings().children().children().addClass("wiggler");
		$(this).children(".card-image").children().addClass("profile-pic-js");
	}).mouseleave(function(){
		$(this).parent().siblings().children().children().removeClass("wiggler");
		$(this).children(".card-image").children().removeClass("profile-pic-js");

	});

	// Upon clicking any of the modal 3 references. Empty the story p tag and reappend the story tag to apply the typerwrite effect.
	$(".empty-typewriter-text").one("click",function(){

		$("#modal3 p").empty()
			.append('<br><p><strong>What is Meetup Maps (MuM)? </strong><br><br> Meetup Maps was created in September of 2016 by Tuan Tran, Marcus Lam, and Brandon Short as their first group project for the Coding Bootcamp @ UT Austin. Recognizing the significance of meetups and its particular importance for bootcamp students, and acknowledging the versatility of Google Maps and its necessity for finding and attending potential meetups, the three members decided to utilize these two technologies in a way that would simplify the meetup "hunt" and make finding that next meetup less of a "previous page-next page" process. Thus, with the addition of various technologies, MuM was born.<br>' +
				'<br><br>' +
				'<strong>What technologies are being used?</strong>' +
				'<br><br>' +
				"The Meetup.com API and Google Maps API are the two main tools being used in the back-end. The former fetches parameter-matching events from the Meetup database, and the latter uses the returned data to plot markers and info windows on our Google Map accordingly. For data persistence, Firebase is being used to store a like-and-dislike counter (via the thumbs icons) and the user's search history (along with a timestamp). For the weather sidebar, simpleWeather.js (a jQuery plugin) is used to grab weather information, which changes based on the location input, from the Yahoo Weather API. Additionally, Moment.js is being used for Unix time conversion and TypeIt.js is being used for animated typing effects. Lastly, the front-end design was built from the ground up using Google's Materialize CSS framework and has been tweaked to be mobile responsive.</p>");

	});

	// Type-it auto text.
	$(".topwrapper .type-it-text").one("click", function(){

		$('.type-it').typeIt({
			startDelay: 3000,
			deleteSpeed: 50,
			lifeLike: true,
			loop: true,
			loopDelay: 2000,
		})
		.tiType("Maybe Technology?")
		.tiPause("5000")
		.tiDelete(17)
		.tiPause("1000")
		.tiType("We recommend checking out Cohorts Helping Cohorts within Austin, Texas.")
		.tiPause("5000")
		.tiDelete(71)
		.tiType("But you know their")
		.tiPause(500)
		.tiDelete(2)
		.tiType("re's always Englsh")
		.tiDelete(6)
		.tiType("English Literature.")
		.tiPause("5000")
		.tiDelete(47)
		.tiPause("1000")
		.tiType('Maybe try out that "Games" tag below.')
		.tiPause("5000")
	});

});