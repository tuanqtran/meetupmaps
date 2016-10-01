// Global Variables
var map;
var geocoder;
var infowindow;
var coordinates = [];
var eventInfo = [];
var contentString;
var marker;
var wLocation = 'Austin, TX';

// Function that initializes the map and makes it appear on the page via callback.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        scrollwheel: true,
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
        center: new google.maps.LatLng(39.8282, -98.5795)
    });
    geocoder = new google.maps.Geocoder;
    infowindow = new google.maps.InfoWindow;
    getWeather();
};

// Binds the "enter" key with the "#searchBtn" click event.
$('.modal-content').on('keyup', function(event) {
    if (event.keyCode == 13) {
        $('#searchBtn').click();
    }
});

// Beginning of the click event that triggers the queries between the Meetup API and Google Maps API.
$(document).on('click', '#searchBtn, .collection-item', (function(event) {
	// Clears data (from previous queries) from the arrays.
	coordinates = [];
	eventInfo = [];
	// Empties the 'modal2 cards' whenever a click event is triggered.
	$('#modal2 .row').empty();
	// Declaring variables in the function scope which will be needed for the query.
	var text;
	var location;
	var amountOfResults;

	// If statement that registers which element triggered the click event and, in turn, determines where to grab the values for 'text', 'location', and 'amountOfResults'.
	if ($(event.target).is('#searchBtn')) {
		// Stores user inputs into variables that are necessary for the Meetup API query.
		text = $('#textInput').val().trim();
		location = $('#locationInput').val().trim();
		amountOfResults = $('#resultsNumInput').val().trim();
	} else if ($(this).hasClass('collection-item')) {
		text = $(this).children('.title').text();
		location = 'Austin, TX';
		amountOfResults = 30;
		$('#modal1').closeModal();
	}

	// If statement that prevents the user from performing a query if 'text' or 'location' values come back empty.
	if (text == "" || location == "") {
		console.log("Required search fields are not met.");
	} else {
		// If first condition was not met, then empty the input fields, set the weather location, and perform the query.
		$('#textInput, #locationInput').val(null);
		wLocation = location;
		getWeather();

	    // Meetup API V3 query url that contains parameters which allow users to perform a raw full text and location query.
	    var queryURL = "https://api.meetup.com/find/groups?&sign=true&photo-host=public&filter=all&upcoming_events=true&fallback_suggestions=true&country=US&location="+location+"&radius=smart&text="+text+"&page="+amountOfResults+"&key=2b1e504a1c3ea586da4a465e6c5223";
	    // Additional features include:
	    // - Limiting the country to the U.S. and only displaying groups that have upcoming events.
	    // - A dynamic search radius based on the number of active groups in the area.
	    // - Returning a list of curated suggestions if criteria was not found.

	    // Beginning of the AJAX query event.
	    $.ajax({url: queryURL, method: 'GET', dataType: 'jsonp'}).done(function(response) {
			// Stores the data returned from the Meetup API into the variable 'results'.
			var results = response.data;
			// Resets map to initial stage whenever a new query is executed.
			initMap();

			for (var i=0; i<results.length; i++) {
				// Pushes data gathered from the AJAX query into their associated arrays.
				coordinates.push(results[i].lat + ', ' + results[i].lon);
				
				// If statement that sets eventPhoto to a default image if no image was returned.
				if (results[i].photos === undefined) {
					eventInfo.eventPhoto = 'assets/images/noImageFound.jpg';
				} else {
					eventInfo.eventPhoto = results[i].photos[0].photo_link;
				}

				eventInfo.push({
					eventName: results[i].name,
					eventDescription: results[i].description,
					eventLink: results[i].link,
					eventFounded: results[i].created,
					nextEventName: results[i].next_event.name,
					nextEvent: results[i].next_event.time,
					nextEventRSVP: results[i].next_event.yes_rsvp_count
				});

				// Concatenates objects from the 'eventInfo' array and sets it equal to the var 'contentString', which is then used within the 'infowindow' pop-up that appears whenever a map marker is clicked.
				contentString = '<div class="iw-container"><div class="iw-title center">' + eventInfo[i].eventName + '</div><br><div class="main-text-width"><div class="text-justify text-padding">' + eventInfo[i].eventDescription + '<br><div class="center"><a href=' + eventInfo[i].eventLink + ' target="_blank">Meetup Link</a></div></div></div></div>';
				// Continued concatenation of objects from the 'eventInfo' array and sets it equal to the var 'eventAdder', which is then embedded within the 'modal2 cards'.
				eventAdder = '<div class="col s12 m4 l2 center modal-card-margin"><div class="card image-hover"><div class="card-image waves-effect waves-block waves-black">' +
					'<img class="activator eventImg" src=' + eventInfo.eventPhoto + '></div><br><div class="card-content"><span class="card-title activator grey-text text-darken-4 eventTitle">' +
					eventInfo[i].eventName + '</span><br><br><p><a href="' + eventInfo[i].eventLink + '" target="_blank">Meetup Link</a></p></div>' +
					'<div class="card-reveal"><span class="card-title grey-text text-darken-4">' + eventInfo[i].eventName + '<i class="material-icons right eventClose">close</i></span>' +
					'<br> <p><strong>Founded:</strong><br>' + moment(eventInfo[i].eventFounded).format("MM/DD/YYYY") + '</p> <br> <p><strong>Next Event:</strong><br>' + eventInfo[i].nextEventName +'</p> <br> <p><strong>Next Event Date:</strong><br>' + moment(eventInfo[i].nextEvent).format("MM/DD/YYYY hh:mm A")+ '</p>' +
					'<br> <p><strong>RSVP:</strong> ' + eventInfo[i].nextEventRSVP + '</p></div></div></div>';
				// Calling the function defined below.
				geocodeLatLng(map, marker, infowindow, contentString);
				// Function that takes inputs and, in turn, creates map markers and infowindows accordingly.
				function geocodeLatLng(map, marker, infowindow, contentString) {
					var input = coordinates[i];
				    var latlngStr = input.split(',', 2);
				    var latlng = {
				    	// Prevents events with the same lat lon from overlapping by adding a maximum .001 degree lat lon difference.
				        lat: parseFloat(latlngStr[0]) + Math.random()*0.01,
				        lng: parseFloat(latlngStr[1]) + Math.random()*0.01
				    };
		        	map.setCenter(latlng);
	                map.setZoom(12);
	                marker = new google.maps.Marker({
	                    map: map,
	                    position: latlng,
	                    animation: google.maps.Animation.DROP
	                });
	                infowindow = new google.maps.InfoWindow({
						content: contentString
					});
	                marker.addListener('click', function() {
	                	infowindow.open(map, marker);
	                	if (marker.getAnimation() !== null) {
							marker.setAnimation(null);
						} else {
							marker.setAnimation(google.maps.Animation.BOUNCE);
						}
						$(".gm-style-iw").siblings().children(':nth-child(2)').css({'display': 'none'});
                   		$(".gm-style-iw").siblings().children(':nth-child(4)').css({'display': 'none'});
                   		$(".gm-style-iw").siblings().children('img').parent().addClass("infoWindowClose");
                    	$(".gm-style-iw").parent().addClass("infoWindowSize");
	                });
	                infowindow.addListener('closeclick', function() {
	                	marker.setAnimation(null);
	                });
				};
				// Appends 'eventAdder' to the 'modal2' Modal Box.
				$("#modal2 .row").append(eventAdder);
			}; // End of the for-loop.
		}); // End of the AJAX query event.
	};
})); // End of the click event.

// Function that fetches weather information depending on a provided location and displays it on the "weather" sidebar; defaults to Austin, TX.
function getWeather() {
	$.simpleWeather({
		location: wLocation,
		unit: 'f',
		success: function(weather) {
	        html = '<img id="weatherImage" src='+weather.image+'>';
	        html += "<p>Today's Weather</p>";
	        html += '<div class="tempwrapper"><h3 id="currenttemp">'+weather.temp+'&deg;F</h3>';
	        html += '<div class="smalltempwrapper"><p id="hightemp">'+"H: "+weather.high+'&deg;F</p><p id="lowtemp">'+"L: "+weather.low+'&deg;F</p></div></div>';
	        html += '<ul><li id="weatherFullWidth">'+weather.city+', '+weather.region+'</li>';
	        html += '<li id="weatherLeftHalf">'+weather.currently+'</li>';
	        html += '<li id="weatherRightHalf">Humidity: '+weather.humidity+'%</li></ul>';
	        html += '<div id="weatherForecast">'; 
	        for (var i=0; i<5; i++) {
	            html += '<img src=' + weather.forecast[i].thumbnail + '><p>' + weather.forecast[i].day + ': ' + weather.forecast[i].high + "&deg;F</p>";
	        };
	        html += '</div><div id="weatherLink"><a href="' + weather.link + '"target="_blank">Full Forecast Here</a></div>';
	        html += '<div><p class="weatherLatestUpdate valign-wrapper white-text">Last updated: '+ weather.updated +'</p></div>';

			$(".weather").html(html);
		},
		error: function(error) {
			$(".weather").html('<p>'+error+'</p>');
		}
	});
};