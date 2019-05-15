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
        window.location.href="./learn?uid=" + uid + "&nid=" + content_id + "&pid=1";
    });

	$('.unlike_button').click( function() {
        const title = $(this).parent().parent().children(':first-child').text();
        const u = '/unfavor?uid='+ uid + '&title=' + title;
        const theDiv = $($(this).parent()).parent();
        $.ajax({
            url: u,
            type:'GET',
            dataType: 'json',
            success: (data) => {
                theDiv.remove();
				M.toast({html: 'You have removed this news from your favorite news!', classes: 'rounded'});
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
