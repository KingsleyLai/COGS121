$(document).ready(() => {
    let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, obtain uid for future use
          uid = getCurrentUserUID();
        } else {
            //nonthing
        }
    });

    $('#favorite_table').DataTable({
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

    $('.favorite_read_button').click(function () {
        const content_id = $(this).attr('data-nid');
        const title = $(this).parent().parent().children(':first-child').text();
        const u = '/addhistory?uid=' + uid + '&title=' + title;
        $.ajax({
            url: u,
            type: 'GET',
            dataType: 'json',
            success: (data) =>{
                window.location.href="./learn?uid=" + uid + "&nid=" + content_id + "&pid=1";
                console.log('add to history');
            }
        });
    });

	$('.unlike_button').click( function() {
        const u = '/unfavor?uid='+ uid + '&nid=' + $(this).find('p').html();
        const theDiv = $($(this).parent()).parent();
        console.log(u);
        $.ajax({
            url: u,
            type:'GET',
            dataType: 'json',
            success: (data) => {
                theDiv.remove();
            }
        });
    });

});

function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null){
        return currentUser.uid;
    }
    return -1;
  }
