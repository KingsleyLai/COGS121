/**
 * Copyright (c) 2019
 *
 * favorite.js contains helper functions for frontend logic of favorite page.
 *
 * @summary frontend logic for GoDuck favorite page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */
$(document).ready(() => {
    // Check login state for Firebase authentication
    let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            uid = getCurrentUserUID();
        } else {
            //nonthing
        }
    });

    $('#favorite_table').DataTable({
        columnDefs: [{
                orderable: false,
                targets: 3
            },
            {
                orderable: false,
                targets: 2
            }
        ],
        'lengthMenu': [
            [5],
            [5]
        ],
        'columnDefs': [{
            'width': '60%',
            'targets': 0
        }]
    });
    $('.dataTables_length').addClass('bs-select');

    $('.favorite_read_button').click(function() {
        const content_id = $(this).attr('data-nid');
        window.location.href = "./learn?uid=" + uid + "&nid=" + content_id + "&pid=1";
    });

    $('.unlike_button').click(function() {
        const title = $(this).parent().parent().children(':first-child').text();
        const u = '/unfavor?uid=' + uid + '&title=' + title;
        const theDiv = $($(this).parent()).parent();
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                theDiv.remove();
                $('#unfavorToast').toast('show');
            }
        });

        $(document).ajaxError(() => {
            alert('Unknown ajax error');
        });
    });

});

/**
 * getCurrentUserUID returns current user id which fecthed from Firebase
 */
function getCurrentUserUID() {
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
        return currentUser.uid;
    }
    return -1;
}
