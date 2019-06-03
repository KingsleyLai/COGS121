/**
 * Copyright (c) 2019
 *
 * history.js contains helper functions for frontend logic of history page.
 *
 * @summary frontend logic for GoDuck history page.
 * @author GoDuck team, COGS 121, Spring 2019, UC San Diego
 *
 */
$(document).ready(() => {
    let uid;
    // Check login state for Firebase authentication
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, obtain uid for future use
            uid = getCurrentUserUID();
        } else {
            // magic happens here!
        }
    });
    $('#history_table').DataTable({
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

    $('.history_read_button').click(function() {
        const content_id = $(this).attr('data-nid');
        window.location.href = "./learn?uid=" + uid + "&nid=" + content_id + "&pid=1";
    });

    $('.add_favor_button').click(function() {
        const u = '/addfavor?uid=' + uid + '&title=' + $(this).parent().parent().children(':first-child').text();
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
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
        const title = $(this).parent().parent().children(':first-child').text();
        const u = '/unfavor?uid=' + uid + '&title=' + title;
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
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
