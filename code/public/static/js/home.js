/**
 * Copyright (c) 2019
 *
 * home.js contains helper functions for frontend logic of home page.
 *
 * @summary frontend logic for GoDuck home page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */
$(document).ready(() => {
    const firstTimeUser = localStorage.getItem('firstTimeUser');
    if (firstTimeUser === '1') {
        introJs().setOptions({
            showStepNumbers: false,
            exitOnOverlayClick: true,
            showProgress: true
        }).start();
        localStorage.setItem('firstTimeUser', '0');
    } else {
        localStorage.setItem('firstTimeUser', '0');
    }
    let uid;
    // Check login state for Firebase authentication
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, obtain uid for future use
            uid = getCurrentUserUID();
            console.log(user.displayName);
        } else {
            window.location.href = './index';
        }
    });

    $('.news-button').click(function() {
        const content_id = $(this).attr('data-nid');
        const faovred = $(this).parent().children('.favor-heart').attr('is-favor');
        localStorage.setItem('currentNewsId', content_id);
        localStorage.setItem('favored', faovred);
        window.location.href = "./learn?uid=" + uid + "&nid=" + content_id + "&pid=1";
    });

    $('.add_favor_button').click(function() {
        const u = '/addfavor?uid=' + uid + '&title=' + $(this).parent().parent().parent().parent().children(':first-child').children(':first-child').children(':first-child').text();
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $(this).parent().parent().children('.favor-heart').attr('is-favor', 'true');
                $('#addFavorToast').toast('show');
                $(this).hide();
                $(this).parent().children('.unfavor_button').show();
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });

    $('.unfavor_button').click(function() {
        const title = $(this).parent().parent().parent().parent().children(':first-child').children(':first-child').children(':first-child').text();
        const u = '/unfavor?uid=' + uid + '&title=' + title;
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $(this).parent().parent().children('.favor-heart').attr('is-favor', 'false');
                $('#unfavorToast').toast('show');
                $(this).hide();
                $(this).parent().children('.add_favor_button').show();
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });
});
