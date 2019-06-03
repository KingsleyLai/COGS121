/**
 * Copyright (c) 2019
 *
 * index.js contains helper functions for frontend logic of login page.
 *
 * @summary frontend logic for GoDuck login page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */

// Firebase config for supporting login feature
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
    $("#signup").click(function() {
        $("#signupDiv").show();
        $("#signinDiv").hide();
    });

    $("#signin").click(function() {
        $("#signupDiv").hide();
        $("#signinDiv").show();
    });

    $('#signupBtn').click(() => {
        validationCheck();
    });

    $('#forget_password').click(() => {
        const email = prompt('Please enter your email');
        firebase.auth().sendPasswordResetEmail(email).then(function() {
            alert('Password reset email sent!');
        }).catch(function(error) {
            const errorCode = error.code;
            if (errorCode == 'auth/invalid-email') {
                alert('Email address format incorrect');
            } else if (errorCode == 'auth/user-not-found') {
                alert('Email doest not exist');
            }
        });

    });

    //Check if user signed in
    /*
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let uid = getCurrentUserUID();
            window.location.href="./home?uid=" + uid;
        } else {
            //User not logged in, do nothing
        }
    });*/

});

function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;
    firebase.auth().signInWithEmailAndPassword(email, pass).then(function() {
        var uid = getCurrentUserUID();
        window.location.href = "./home" + "?uid=" + uid;
    }).catch(function(error) {
        alert("Your email/password is incorrect, please check!")
    });
}

// get current user and save username
function getCurrentUserUID() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
        return currentUser.uid;
    }
    return -1;
}

// helper function for account signup validation
function validationCheck() {
    const email = $('#signup_email').val();
    const username = $('#signup_username').val();
    const password = $('#signup_password').val();
    const confirm_password = $('#confirm_password').val();
    $('#password_match').hide();
    $('#email_in_use').hide();
    if (email == '' || password == '' || username == '' || confirm_password == '') {
        alert("Please fill out all blanks!")
    } else {
        // First check if both password are the same
        if (password === confirm_password) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
                const currentUser = firebase.auth().currentUser;
                currentUser.updateProfile({
                    displayName: username
                }).then(function() {
                    var newUID = getCurrentUserUID();
                    window.location.href = "./onboard" + "?uid=" + newUID;
                });

            }).catch(function(error) {
                if (password.length < 6) {
                    alert("Your password is less than 6 digits.");
                } else if (!email.includes("@")) {
                    alert("Your email format is incorrect.")
                }
                const errorCode = error.code;
                if (errorCode == 'auth/email-already-in-use') {
                    $('#email_in_use').show();
                }
            });
        } else {
            $('#password_match').show();
        }
    }
}
