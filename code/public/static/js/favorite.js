$(document).ready(() => {
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
        let uid;
        firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, obtain uid for future use
          uid = getCurrentUserUID();
        } else {
            //
        }
        });
        window.location.href="./learn?uid=" + uid ;
    });

	$('#unlike-btn').click( () => {
		alert("Removed this news from your favorite news.");
    });
});
