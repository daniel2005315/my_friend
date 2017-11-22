"use strict";
module.change_code = 1;


var alexa = require( 'alexa-app' );
var app = new alexa.app( 'my_friend' );


// A few default intents to be handled
app.launch( function( request, response ) {
	response.say( 'Your friend is here!' ).shouldEndSession( true );
} );

app.error = function( exception, request, response ) {
	console.log(exception)
	console.log(request);
	console.log(response);
	response.say( 'Sorry an error occured ' + error.message);
};

app.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": []
  },
  function(request, response) {
    var helpOutput = "You can say 'some statement' or ask 'some question'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  }
);

// should be able to stop audio player
app.intent("AMAZON.StopIntent", function(request, response) {
    var stopOutput = "Come back later!";
		response.audioPlayerStop();
    response.say(stopOutput);
  }
);

// Added to handle pause ?
// should be able to stop audio player
app.intent("AMAZON.PauseIntent", function(request, response) {
    var stopOutput = "Paused it for you";
		response.audioPlayerStop();
    response.say(stopOutput);
  }
);

// should be able to stop audio player
app.intent("AMAZON.ResumeIntent", function(request, response) {
    var stopOutput = "It has not yet been implemented";
		//response.audioPlayerStop();
    response.say(stopOutput);
  }
);

// respond to "Nothing"
app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var cancelOutput = "No problem. Request cancelled.";
    response.say(cancelOutput);
  }
);

// Custom Intents start below VVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// First line is Intent's name

// Play welcome home music

app.intent("GreetingIntent",
	function(request,response){
		response.say("Greetings from Your Friend. Your skill is ready.");
	});
// Testing, hard coded playng music
app.intent("WelcomeMusicIntent", {
  // Try specifying nothing
  /*
    "slots": {
      "searchPhrase": "SearchItem"
    },
    "utterances": [
      "find {-|searchPhrase}",
  		"Google about {-|searchPhrase}",
  		"tell me about {-|searchPhrase}",
  		"I want to know about {-|searchPhrase}"
    ]
    */
  },
  function(request,response) {
		// Get user's
    response.say("Here's some welcoming music!");
		// TODO:
		// Fetch for user's favourite song lately
		// put into the song variable
		var song="floating.mp3";

		// encoded the link for the song
		var url = "https://evening-savannah-89199.herokuapp.com/music/"+song;
		var stream={
			"token": "90",
			"url": url,
			"offsetInMilliseconds": 0
		}
		console.log("playing: "+url);
		// Start the play directive
		response.audioPlayerPlayStream("REPLACE_ALL", stream)
  }
);

// TODO: Handle the player object
// Play music
app.intent("MusicIntent", {
    "slots": {
      "MusicType": "AMAZON.Genre",
      "Musician": "AMAZON.Musician"
    }
    /*,
    // try leaving the utterances null as it is stated on Skill kit

    "utterances": [
      "find {-|searchPhrase}",
  		"Google about {-|searchPhrase}",
  		"tell me about {-|searchPhrase}",
  		"I want to know about {-|searchPhrase}"
    ]
    */
  }
  ,
  function(request,response) {
    var musicType = request.slot('MusicType');
    var musician = request.slot('Musician');
    if(musicType==null)
      console.log("No music type specified");
    if(musician==null)
      console.log("Nomusician specified");
    response.say("You wanna play some "+ musicType+" music by artist:["+musician+"]");
  }
);

// Intent that train your friend to know more about you
app.intent("ShareIntent",{
	"dialog":{
		type:"delegate"
	},
	"slots":{
		"userInfo": "UserInfo"
	}

},
	  function(request, response) {
			// update the status of the dialog model
			var dialogState=request.dialogState;
			console.log(dialogState);
			console.log("Get passed");

			if(dialogState=="STARTED"){
				var content="The card should be shown, and dialog starts\nWith the dialog state now as: "+dialogState;
				response.card({
					type:"Simple",
					title:"Starting a Dialog",
					content: content
				});
				response.say("Dialog started. Tell me more");
			}else if(dialogState=="IN_PROGRESS"){
				var content="dialog in process\nWith the dialog state now as: "+dialogState;
				response.card({
					type:"Simple",
					title:"During a Dialog",
					content: content
				});
				response.say("Tell me.");
				response.shouldEndSession(false);
			}else if(dialogState=="COMPLETED"){
				var slot = request.slot('userInfo');
				var content="dialog ended\nWith the dialog state now as: "+dialogState+"\nslot value: "+slot;
				response.card({
					type:"Simple",
					title:"Ending a Dialog",
					content: content
				});
				response.say("Dialog Ended.");
				response.shouldEndSession(true);
			}else{
				var slot = request.slot('userInfo');
				var content="A dialog should have started? current state: "+dialogState+"\nslot value: "+slot;
				response.card({
					type:"Simple",
					title:"General case before dialog",
					content: content
				});
				response.say("Tell me more.");
				response.shouldEndSession(false);
			}
			//response.directive(directive);
			/*
			// return the Dialog object
Dialog request.getDialog()

// return the intent's dialogState
String request.dialogState

// check if the intent's dialog is STARTED
Boolean dialog.isStarted()

// check if the intent's dialog is IN_PROGRESS
Boolean dialog.isInProgress()

// check if the intent's dialog is COMPLETED
Boolean dialog.isCompleted()

*/

		}
	);


module.exports = app;
