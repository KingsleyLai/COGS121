const dict = {
    '0': 'Technology',
	'1': 'Business',
    '2': 'Politics',
    'hi': 'Hindi',
    'es': 'Spanish',
    'zh': 'Chinese'
};
$(document).ready( () => {

    let prefer_category = $('#userCategory').text().slice(19);
    let prefer_lang = $('#userLanguage').text().slice(18);
    let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, obtain uid for future use
            const currentUser = firebase.auth().currentUser;
            uid = currentUser.uid;
            $('#userName').html('<b>Username</b>: '+currentUser.displayName);
            $('#userEmail').html('<b>Email</b>: '+currentUser.email);
        } else {
            //
        }
    });

    $('#changePassBtn').click(() => {
        $('#password_change_div').show();
    });

    $('#change_password_cancel_btn').click(() => {
        $('#password_change_div').hide();
        $('#change_password').val("");
        $('#confirm_change_password').val("");
    });

    $('#change_password_confirm_btn').click(() => {
        $('#change_password_match').hide();
        $('#change_password_length').hide();
        const pass = $('#change_password').val();
        const confirmPass = $('#confirm_change_password').val();
        if(pass.length < 6){
            $('#change_password_length').show();
        }else{
            if(pass === confirmPass){
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        // User is signed in, obtain uid for future use
                        let currentUser = firebase.auth().currentUser;
                        currentUser.updatePassword(pass).then(function() {
                            alert("Password changed");
                            $('#password_change_div').hide();
                        }).catch( function(e) {
                            console.log('cannot change password');
                        });
                    } else {
                        //
                    }
                });
            }else{
                $('#change_password_match').show();
            }
        }
    });

    $('#editProfileBtn').click(() =>{
        $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: </p><select class="form-control" id="change_sel1"><option value="0" >Technology</option><option value="1">Business</option><option value="2">Politics</option></select>');
        $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer Language</b>: </p><select class="form-control" id="change_sel2"><option value="zh">Chinese</option><option value="es">Spanish</option><option value="hi">Hindi</option></select>');
        $('#changePassBtn').hide();
        $('#editProfileBtn').hide();
        $('#editProfileSaveBtn').show();
        $('#editProfileCancelBtn').show();
    });

    $('#editProfileCancelBtn').click(() => {
        $('select').remove();
        $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: ' + prefer_category +'</p>');
        $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer News Topic</b>: ' + prefer_lang +'</p>');
        $('#editProfileSaveBtn').hide();
        $('#editProfileCancelBtn').hide();
        $('#changePassBtn').show();
        $('#editProfileBtn').show();
    });

    $('#editProfileSaveBtn').click(() => {
        const category = $('#change_sel1').val();
        const lang = $('#change_sel2').val();
        $.ajax({
            url: '/updateinfo?uid=' + uid +'&la='+lang+'&ca='+category,
            type: 'GET',
            dataType:'json',
            success: (data) => {
                $('select').remove();
                $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: ' + dict[category.toString()] +'</p>');
                $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer News Topic</b>: ' + dict[lang] +'</p>');
                $('#editProfileSaveBtn').hide();
                $('#editProfileCancelBtn').hide();
                $('#changePassBtn').show();
                $('#editProfileBtn').show();
            },
            fail: () =>{
                $('select').remove();
                $('#userCategory').replaceWith('<p id="userCategory"> <b>Prefer News Topic</b>: ' + prefer_category +'</p>');
                $('#userLanguage').replaceWith('<p id="userLanguage"> <b>Prefer News Topic</b>: ' + prefer_lang +'</p>');
                $('#editProfileSaveBtn').hide();
                $('#editProfileCancelBtn').hide();
                $('#changePassBtn').show();
                $('#editProfileBtn').show();
            }
        });
    });
});
