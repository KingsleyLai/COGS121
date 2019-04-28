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
    $("#signup").click(function(){
        $("#signupDiv").show();
        $("#signinDiv").hide();
    });

    $("#signin").click(function(){
        $("#signupDiv").hide();
        $("#signinDiv").show();
    });
    
    //Check if user signed in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let uid = getCurrentUserUID();
            window.location.href="./home?uid=" + uid;
        } else {
            //User not logged in, do nothing
        }
    });

});

function login(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email,pass).then(function(){
        var uid = getCurrentUserUID();
        window.location.href="./home" + "?uid=" + uid;
    }).catch(function(error) {
        alert("Your email/password is incorrect, please check!")
      });
}

function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null){
        return currentUser.uid;
    }
    return -1;
}

function validationCheck(callback) {
    const email = document.getElementById('email').value;
    //const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (!email|| !password) {
        alert("Please fill out all blanks!")
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
            var newUID = getCurrentUserUID();
            window.location.href="./home" + "?uid=" + newUID;
        }).catch(function(error) {
            if(password.length < 6){
                alert("Your password is less than 6 digits.");
            }else if(!email.includes("@")){
                alert("Your email format is incorrect.")
            }
            
          });
    }
}

