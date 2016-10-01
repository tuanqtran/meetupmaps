  var config = {
    apiKey: "AIzaSyA8P31fE7TFE-r_-XirZAenFCRMZUW_AKM",
    authDomain: "first-project-47625.firebaseapp.com",
    databaseURL: "https://first-project-47625.firebaseio.com",
    storageBucket: "first-project-47625.appspot.com",
    messagingSenderId: "963951273741"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Set Initial Counter 
  var initialValue = 0;
  var clickCounter = initialValue;
  var initialValue2 = 0;
  var clickCounter2 = initialValue2;
  var initialValue3 = 0;
  var clickCounter3 = initialValue3;
  var meh = 0;
  var initialValue4 = 0;
  var clickCounter4 = initialValue4;

  // At the initial load, get a snapshot of the current data.
  database.ref().on("value", function(snapshot) {

      // Change the clickcounter to match the data in the database
      clickCounter = snapshot.val().ourCounters.likeCounter;
      clickCounter2 = snapshot.val().ourCounters.dislikeCounter;
      clickCounter3 = snapshot.val().ourCounters.mehCounter;

      // If any errors are experienced, log them to console. 
  }, function(errorObject) {

      console.log("The read failed: " + errorObject.code);

  });

  // --------- Thumbs Up, Thumbs Down & Meh counter ---------------
  // --------------------------------------------------------------

  // Whenever a user clicks the button
  $("#thumbUp").one("click", function() {

      clickCounter++;
      meh++;
      mehF();

      // Save new value to Firebase
      database.ref().update({
          ourCounters: {
              likeCounter: clickCounter,
              dislikeCounter: clickCounter2,
              mehCounter: clickCounter3
          }
      });

      console.log("This is thumbs up after: " + clickCounter);

  });

  // Whenever a user clicks the click button
  $("#thumbDown").one("click", function() {

      clickCounter2++;
      meh++;
      mehF();

      // Save new value to Firebase
      database.ref().update({
          ourCounters: {
              likeCounter: clickCounter,
              dislikeCounter: clickCounter2,
              mehCounter: clickCounter3
          }
      });

      console.log("This is fake thumbs up after: " + clickCounter2);

  });

  function mehF() {
      if (meh == 2) {
          clickCounter3++;
          console.log("meh");
      }
  }

  // -------------------------- Search History --------------------------------------------------------
  // --------------------------------------------------------------------------------------------------
  $("#searchBtn").on("click", function() {
      database.ref().on("value", function(snapshot) {
          clickCounter4 = snapshot.val().searches.searchNumber;
      })
      clickCounter4++;

      database.ref().update({
          searches: {
              searchNumber: clickCounter4
          }
      });
      userTextInput = $("#textInput").val();
      userLocationInput = $("#locationInput").val();
      userResultInput = $("#resultsNumInput").val();

      var time = new Date();

      var searchTitle = ("Search Number: " + clickCounter4 + " - Date: " + time.toDateString() + " at " + time.toLocaleTimeString());

      database.ref("User Search History").child(searchTitle).update({
          userTextInput,
          userLocationInput,
          userResultInput
      })
  });

  $(".collection-item").on("click", function() {
      database.ref().on("value", function(snapshot) {
          clickCounter4 = snapshot.val().searches.searchNumber;
      })
      clickCounter4++;

      database.ref().update({
          searches: {
              searchNumber: clickCounter4
          }
      });

      userTextInput = $(this).children('.title').text();
      userLocationInput = "Austin, TX";
      userResultInput = 30;

      var time = new Date();

      var searchTitle = ("Search Number: " + clickCounter4 + " - Date: " + time.toDateString() + " at " + time.toLocaleTimeString());

      database.ref("User Search History").child(searchTitle).update({
          userTextInput,
          userLocationInput,
          userResultInput
      })
  });