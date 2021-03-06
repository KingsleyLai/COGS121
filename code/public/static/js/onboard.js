/**
 * Copyright (c) 2019
 *
 * onboard.js contains helper functions for frontend logic of onboard page.
 *
 * @summary frontend logic for GoDuck onboard page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */

// Firebase config for supporting onboarding feature
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
    localStorage.setItem('firstTimeUser', '1');
    $('#onboard_save_btn').click(() => {
        const lang_pref = $('#sel1').val();
        const category = $('#sel2').val();
        const uid = getCurrentUserUID();
        //Future save this to user preference
        $.ajax({
            url: '/onboardsetup?uid=' + uid + '&la=' + lang_pref + '&ca=' + category,
            type: 'GET',
            dateType: 'json',
            success: (data) => {
                setTimeout(function() {
                    window.location.href = './home' + '?uid=' + uid;
                }, 5000);
            }

        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });
});

function getCurrentUserUID() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
        return currentUser.uid;
    }
    return -1;
}
