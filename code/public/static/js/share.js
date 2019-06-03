/**
 * Copyright (c) 2019
 *
 * share.js contains common helper functions which requires for each frontend page.
 *
 * @summary shared frontend logic for GoDuck
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */

// Firebase config for supporting Firebase features
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
    let uid;
    // Check login state for Firebase authentication
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, obtain uid for future use
            uid = getCurrentUserUID();
            console.log(user.displayName);
            $('#sidebarUsername').text(user.displayName);
        } else {
            window.location.href = './index';
        }
    });

    if (window.location.href.includes("/home")) {
        $('.home_button').css('background-color', 'aliceblue');
    } else if (window.location.href.includes("/studyset")) {
        $('.study_set_button').css('background-color', 'aliceblue');
    } else if (window.location.href.includes("/favorite")) {
        $('.favorite_news_button').css('background-color', 'aliceblue');
    } else if (window.location.href.includes("/history")) {
        $('.history_button').css('background-color', 'aliceblue');
    }

    // home button js
    $('.home_button').click(() => {
        window.location.href = './home?uid=' + uid;
    });
    // study set button js
    $(".study_set_button").click(() => {
        window.location.href = "./studyset?uid=" + uid;
    });
    // favorite news button js
    $(".favorite_news_button").click(() => {
        window.location.href = "./favorite?uid=" + uid;
    });
    // history button js
    $(".history_button").click(() => {
        window.location.href = "./history?uid=" + uid;
    });
    // logout button js
    $(".logout_button").click(() => {
        logout();
    });
    // user profile display area
    $('.user_information').click(() => {
        window.location.href = './profile?uid=' + uid;
    });

    console.log("eoiufhieurh");
});

function logout() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        alert('Logout success');
        window.location.href = './index';
    }).catch(function(error) {
        // An error happened.
    });
}

function getCurrentUserUID() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
        return currentUser.uid;
    }
    return -1;
}
