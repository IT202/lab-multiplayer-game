// JavaScript File
// define page elements
var username = document.getElementById('username');
var message = document.getElementById('message');
var messages = document.getElementById('messages');
var form = document.getElementById('form');
var login = document.getElementById('login');
var imageForm = document.getElementById('imageForm');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

var players;
var myPlayer;

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBu5wv5gIJV5sGtNDrrs5H2eKo660Nya9Y",
    authDomain: "devcon-c3d33.firebaseapp.com",
    databaseURL: "https://devcon-c3d33.firebaseio.com",
    storageBucket: "devcon-c3d33.appspot.com",
    messagingSenderId: "911332359047"
  };
  firebase.initializeApp(config);
  // define Firebase ref
  var playersRef = firebase.database().ref('players');
  
  
  // read the data 
  playersRef.on("value", function(snapshot) {

    console.log(snapshot.val());
    players = snapshot.val(); 
    
    
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  

  
  
  // Get the data on a post that has changed
  playersRef.on("child_changed", function(snapshot) {
    players[snapshot.key] = snapshot.val();
  });


  
function writePlayerData(player) {
    console.log('writing ' + player.key);
    var playerRef = playersRef.child(player.key);
    playerRef.set(player);
}

  
  window.addEventListener('keydown', function (e) {
    console.log(e);
        if (e.keyCode == 37) {myPlayer.speed -= 1; }
        if (e.keyCode == 39) {myPlayer.speed += 1; }
        if (e.keyCode == 38) {myPlayer.dir += 10; }
        if (e.keyCode == 40) {myPlayer.dir -= 10; }
        
    writePlayerData(myPlayer);
  })



var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
       displayUserInformation (user);
  } else {
    // No user is signed in.
  }
});



login.addEventListener('click', function(event) {

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    console.log("Authenticated successfully with payload:", user);
    //console.log(result);
    
    //displayUserInformation (user);
    login.style.display = "none";
    
    // 
    var playerKey = user.email.replace('.','');
    
    if (players.hasOwnProperty(playerKey)) {
      myPlayer = players[playerKey];    
    }
    else {
      myPlayer = createPlayer(playerKey);
      console.log('created ' + myPlayer);
      writePlayerData(myPlayer);
    }
    
    
    
    /*
      username.value = user.displayName + user.email;
      username.disabled = true;

      form.style.display = "block";
      login.style.display = "none";
    */
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });

});


function createPlayer (playerKey) {
  console.log('creating player for ' + playerKey);
  players[playerKey] = 
    {
      key: playerKey,
      x: 200,
      y: 200,
      color: "red",
      dir: 0,
      speed: 0,
      size: 20
    }
    
  return players[email];
}



function displayUserInformation(user) {
  
      username.value = user.displayName + user.email;
      username.disabled = true;

      form.style.display = "block";
      login.style.display = "none";  
  
  
}


function draw () {
    for (var playerId in players) {
      player = players[playerId];
      //console.log(player);
      if(player.x) {
        
        player.x += player.speed;
        ctx.beginPath();
        ctx.arc(player["x"], player["y"], player["size"], 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();       
      }
    }  
  window.requestAnimationFrame(draw);  
}       
 
 
window.requestAnimationFrame(draw); 
        
