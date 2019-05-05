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

    $('.read_button').click(() => {
        window.location.href="./learn?uid=" + uid ;
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
