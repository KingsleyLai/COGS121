/**
 * Copyright (c) 2019
 *
 * profile.js contains helper functions for frontend logic of profile page.
 *
 * @summary frontend logic for GoDuck profile page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */

// directionary for matching user perferred language and categories
const dict = {
    '0': 'Technology',
    '1': 'Business',
    '2': 'Politics',
    'hi': 'Hindi',
    'es': 'Spanish',
    'zh': 'Chinese'
};
const dict2 = {
    'Technology': '0',
    'Business': '1',
    'Politics': '2',
    'Hindi': 'hi',
    'Spanish': 'es',
    'Chinese': 'zh'
};
$(document).ready(() => {

    let prefer_category = $('#userCategory').text().slice(20);
    let prefer_lang = $('#userLanguage').text().slice(18);
    let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, obtain uid for future use
            const currentUser = firebase.auth().currentUser;
            uid = currentUser.uid;
            $('#userName').html('<b>Username</b>: ' + currentUser.displayName);
            $('#userEmail').html('<b>Email</b>: ' + currentUser.email);
        } else {
            //
        }
    });

    $('#changePassBtn').click(() => {
        $('#notiOverlay').show();
    });

    $('#change_password_cancel_btn').click(() => {
        $('#notiOverlay').hide();
        $('#change_password').val('');
        $('#confirm_change_password').val('');
    });

    $('#change_password_confirm_btn').click(() => {
        $('#change_password_match').hide();
        $('#change_password_length').hide();
        const pass = $('#change_password').val();
        const confirmPass = $('#confirm_change_password').val();
        if (pass.length < 6) {
            $('#change_password_length').show();
        } else {
            if (pass === confirmPass) {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // User is signed in, obtain uid for future use
                        let currentUser = firebase.auth().currentUser;
                        currentUser.updatePassword(pass).then(function() {
                            $('#notiOverlay').hide();
                            $('#passwordChangeToast').toast('show');
                        }).catch(function(e) {
                            console.log('cannot change password');
                            $('#passwordChangeFailToast').toast('show');
                        });
                    } else {
                        //
                    }
                });
            } else {
                $('#change_password_match').show();
            }
        }
    });

    $('#editProfileBtn').click(() => {
        $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: </p><select class="form-control" id="change_sel1"><option value="none" selected>Please Select</option><option value="0" >Technology</option><option value="1">Business</option><option value="2">Politics</option></select>');
        $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer Language</b>: </p><select class="form-control" id="change_sel2"><option value="none" selected>Please Select</option><option value="zh">Chinese</option><option value="es">Spanish</option><option value="hi">Hindi</option></select>');
        $('#changePassBtn').hide();
        $('#editProfileBtn').hide();
        $('#editProfileSaveBtn').show();
        $('#editProfileCancelBtn').show();
    });

    $('#editProfileCancelBtn').click(() => {
        $('select').remove();
        $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: ' + prefer_category + '</p>');
        $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer News Topic</b>: ' + prefer_lang + '</p>');
        $('#editProfileSaveBtn').hide();
        $('#editProfileCancelBtn').hide();
        $('#changePassBtn').show();
        $('#editProfileBtn').show();
    });

    $('#editProfileSaveBtn').click(() => {
        let category = $('#change_sel1').val();
        let lang = $('#change_sel2').val();
        if (category === 'none') {
            category = dict2[prefer_category];
        }
        if (lang === 'none') {
            lang = dict2[prefer_lang];
        }
        $.ajax({
            url: '/updateinfo?uid=' + uid + '&la=' + lang + '&ca=' + category,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $('select').remove();
                $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: ' + dict[category.toString()] + '</p>');
                $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer News Topic</b>: ' + dict[lang] + '</p>');
                $('#editProfileSaveBtn').hide();
                $('#editProfileCancelBtn').hide();
                $('#changePassBtn').show();
                $('#editProfileBtn').show();
                $('#savedToast').toast('show');
            },
            fail: () => {
                $('select').remove();
                $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: ' + prefer_category + '</p>');
                $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer News Topic</b>: ' + prefer_lang + '</p>');
                $('#editProfileSaveBtn').hide();
                $('#editProfileCancelBtn').hide();
                $('#changePassBtn').show();
                $('#editProfileBtn').show();
                $('#savedFailToast').toast('show');
            }
        });
    });
});
