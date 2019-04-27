var config = {
    apiKey: "AIzaSyCrFBSlKyhyn1-pVaTfdK26ACYNmGVNxq4",
    authDomain: "cogs121-goduck.firebaseapp.com",
    databaseURL: "https://cogs121-goduck.firebaseio.com",
    projectId: "cogs121-goduck",
    storageBucket: "cogs121-goduck.appspot.com",
    messagingSenderId: "878464642980"
  };
firebase.initializeApp(config);

$(document).ready(() => {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, do nothing
        } else {
            window.location.href="./index";
        }
    });
});

function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert("Logout success");
        window.location.href='./index';
      }).catch(function(error) {
        // An error happened.
      });
}