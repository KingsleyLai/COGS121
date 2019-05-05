$(document).ready(() => {
    let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, obtain uid for future use
            uid = getCurrentUserUID();
        } else {
            //
        }
    });
    $('#history_table').DataTable({
        columnDefs:[{
            orderable: false,
            targets: 3
        },
        {
            orderable: false,
            targets: 2
        }]
    });
    $('.dataTables_length').addClass('bs-select');

    $('.read_button').click(() => {
        window.location.href="./learn?uid=" + uid ;
    });

    $('.add_favor_button').click(function (){
        const u = '/addfavor?uid='+ uid + '&nid=' + 'Aweas71HCwtPN1WVpZk4';
        $.ajax({
            url: u,
            type:'GET',
            dataType: 'json',
            success: (data) => {
                console.log('add favor news');
            }
        });
    });
});