/**
 * Copyright (c) 2019
 *
 * learn.js contains helper functions for frontend logic of learn page.
 *
 * @summary frontend logic for GoDuck learn page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */
$(document).ready(() => {
    let uid;
    let translateArr = [];
    let en;
    const favored = localStorage.getItem('favored');
    if (favored === 'true') {
        $('#add-to-favorite').hide();
        $('#remove-favorite').show();
    }
    // Check login state for Firebase authentication
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, obtain uid for future use
            uid = getCurrentUserUID();
            const title = $('#learn_page_title').text();
            const u = '/addhistory?uid=' + uid + '&title=' + title;
            $.ajax({
                url: u,
                type: 'GET',
                dataType: 'json',
                success: (data) => {
                    if (data['success']) {
                        console.log('add to history');
                    }
                }
            });
            $(document).ajaxError(() => {
                alert('Unknow ajax error');
            });
        } else {
            //nonthing
        }
    });

    $(document).on('click', (e) => {
        if ((e.target.id != 'notiOverlay' && e.target.id != 'addWordBtn' && e.target.id != 'addWordBtn' &&
                e.target.class != 'w3-display-container' && e.target.id != 'english' && e.target.id != 'translate' &&
                e.target.id != 'notiButton' && e.target.id != 'notiBody' && e.target.tagName != 'ESL' &&
                e.target.class != 'w3-display-middle')) {
            $('#notiOverlay').hide();
        } else {
            $('#notiOverlay').show();
        }
    });

    $('p').on('click', 'esl', function() {
        $('#notiOverlay').toggle();
        if ($('#notiOverlay').is(":visible")) {
            const prefer_lang = parseInt($('#learn_page_prefer_lang').text());
            translateArr = $(this).attr('data');
            translateArr = translateArr.split(',');
            en = $(this).text()
            $('#english').text('English: ' + en);
            $('#translate').text('Translate: ' + translateArr[prefer_lang]);
        }
    });

    $('#addWordBtn').click(function() {
        const word = JSON.stringify({
            'en': en,
            'zh': translateArr[0],
            'es': translateArr[1],
            'hi': translateArr[2]
        })
        const u = '/addword?uid=' + uid;
        $.ajax({
            url: u,
            type: 'POST',
            data: word,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: (data) => {
                if (data['added']) {

                    $('#addWordToast').toast('show');
                } else {

                    $('#alreadtAddWordToast').toast('show');
                }
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });



    $('#add-to-favorite').click(() => {
        const title = $('#learn_page_title').text();
        const u = '/addfavor?uid=' + uid + '&title=' + title;
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                localStorage.setItem('favored', 'true');
                $('#addFavorToast').toast('show');
                $('#add-to-favorite').hide();
                $('#remove-favorite').show();
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });

    $('#remove-favorite').click(function() {
        const title = $('#learn_page_title').text();
        const u = '/unfavor?uid=' + uid + '&title=' + title;
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                localStorage.setItem('favored', 'false');
                $('#unfavorToast').toast('show');
                $('#remove-favorite').hide();
                $('#add-to-favorite').show();
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });

    $('#next-paragraph').click(function() {
        $('#next-paragraph').attr("disabled", true);
        $('#prev-paragraph').css("background-color", "#00BCD4");
        const url = new URL(window.location.href);
        const query_string = url.search;
        const search_params = new URLSearchParams(query_string);
        const toPage = $(this).val();
        search_params.set('pid', toPage);
        url.search = search_params.toString();
        const u = '/learnByPage' + url['href'].replace(url['origin'] + '/learn', '');
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $('#next-paragraph').attr("disabled", false);
                $("#original_content_holder").html(data['original_content']);
                $("#translated_content_holder").html(data['translate_content']);
                if (toPage == parseInt(data['news_len'])) {
                    $('#next-paragraph').css("background-color", 'gray');
                    $('#next-paragraph').attr("disabled", true);
                } else if (toPage == 2) {
                    $('#prev-paragraph').attr("disabled", false);
                }
                $('#prev-paragraph').val(data['targetPrevPid']);
                $('#next-paragraph').val(data['targetNextPid']);
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });

    $('#prev-paragraph').click(function() {
        $('#prev-paragraph').attr('disabled', true);
        const url = new URL(window.location.href);
        const query_string = url.search;
        const search_params = new URLSearchParams(query_string);
        const toPage = $(this).val();
        search_params.set('pid', toPage);
        url.search = search_params.toString();
        const u = '/learnByPage' + url['href'].replace(url['origin'] + '/learn', '');
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $('#prev-paragraph').attr('disabled', false);
                $('#prev-paragraph').css("background-color", "#00BCD4");
                $("#original_content_holder").html(data['original_content']);
                $("#translated_content_holder").html(data['translate_content']);
                if (toPage == 1) {
                    $('#prev-paragraph').attr('disabled', true);
                    $('#prev-paragraph').css("background-color", "gray");
                } else if (toPage == (parseInt(data['news_len']) - 1)) {
                    $('#next-paragraph').attr('disabled', false);
                    $('#next-paragraph').css("background-color", "#00BCD4");
                }
                $('#prev-paragraph').val(data['targetPrevPid']);
                $('#next-paragraph').val(data['targetNextPid']);
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

function renderContent(original_content, translate_content) {
    $("#original_content_holder").html(decodeHtml(original_content));
    $("#translated_content_holder").html(decodeHtml(translate_content));
}

function decodeHtml(html) {
    return $('<div>').html(html).text();
}
