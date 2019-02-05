require("dotenv").config();

var keys = require("./keys");
var request = require("request");
var fs = require("fs");
var axios = require("axios");
var Spotify = require('node-spotify-api');

var input = process.argv;
var userAction = input[2];
var userInput = process.argv.slice(3).join("+");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);


function runAction(userAction , userInput) {
switch (userAction) {
        case "spotify-this-song":
        spotifySong(userInput);
        break;

        case "concert-this":
        bandInTown(userInput);
        break;

        case "movie-this":
        ombdMovie(userInput);
        break;
     
        case "do-what-it-says":
        doWhatItSays();
        break;

}
}


function bandInTown (){

  var bandName = process.argv.slice(3).join("+");


  request("https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp", function (error, response, body) {
    // IF THERE IS NO ERROR GIVE US A 200 STATUS CODE (EVERYTHING OK!)
    if (!error && response.statusCode === 200) {
        // CAPTURE DATA AND USE JSON TO FORMAT
        let userBand = JSON.parse(body);
        // PARSE DATA AND USE FOR LOOP TO ACCESS PATHS TO DATA
        if (userBand.length > 0) {
            for (i = 0; i < 1; i++) {

                // CONSOLE DESIRED DATA USING E6 SYNTAX
                console.log(`\n\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)

                // MOMENT.JS TO FORMAT THE DATE MM/DD/YYYY
                let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
            };
        } else {
            console.log('Band or concert not found!');
        };
    };
});

}

    //  * Name of the venue

    //  * Venue location

    //  * Date of the Event (use moment to format this as "MM/DD/YYYY")



function ombdMovie(){
   

// for (var i = 3; i < input.length; i++) {

//   if (i > 3 && i < input.length) {
//     movieName = movieName + "+" + input[i];
//   }
//   else {
//     movieName += input[i];

var movieName = process.argv.slice(3).join("+");

    if (!movieName){
    movieName = "Mr. Nobody";
};


    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    
    
    axios.get(queryUrl).then(
      function(response) {

        
        
        console.log(`\nMovie Title: ${response.data.Title} \nRelease Year: ${response.data.Year}\nIMDB Rating: ${ response.data.imdbRating}\n Rotten Tomatoes Rating: ${response.data.Ratings[1].Source.Value}\nCountry Movie was Produced In:${response.data.Country}\n"The Plot: ${ response.data.Plot}\nlanguage of the movie:${response.data.Language}\n"Actors:${response.data.Actors} `);
        
      }
    );

}




//        * Title of the movie.
//        * Year the movie came out.
//        * IMDB Rating of the movie.
//        * Rotten Tomatoes Rating of the movie.
//        * Country where the movie was produced.
//        * Language of the movie.
//        * Plot of the movie.
//        * Actors in the movie.


function spotifySong(){

  

  var song = userInput;

  // for (var i = 3; i < input.length; i++) {

  //   if (i > 3 && i < input.length) {
  //     song = song + "+" + input[i];
  //   }
  //   else {
  //     song += input[i];
  
  //   }
  // }

  spotify.search({ type: 'track', query: song })
  .then(function(response) {

    let spotifyArr = response.tracks.items;

    for (i = 0; i < spotifyArr.length; i++) {
    console.log( `\nArtist: ${response.tracks.items[i].album.artists[0].name} \nSong: ${response.tracks.items[i].name} \nAlbum: ${response.tracks.items[i].album.name} \nSpotify link: ${response.tracks.items[i].external_urls.spotify} \n - - - -`);
    }

    
        

  })
  .catch(function(error) {
    console.log(error)
  });

}


var doWhatItSays = function(){

  // read from file
  fs.readFile("random.txt", "utf8", function (err, data) {
      if(err){
          return console.log(err)
      }
      
      
      var dataArr = data.split(",");

      // call appropriate function and pass arguement
      
      
      userAction = dataArr[0];
      

      if(userAction === "spotify-this-song"){
          userInput = dataArr[1];

      }
      console.log(userAction +", " + userInput);
        runAction(userAction,userInput);
  });
}

runAction(userAction,userInput);