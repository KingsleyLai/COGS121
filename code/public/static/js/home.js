$(document).ready(() => {
    let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, obtain uid for future use
          uid = getCurrentUserUID();
          console.log(user.displayName);
        } else {
            window.location.href='./index';
        }
    });

    $('.news-button').click( function() {
		const content_id = $(this).attr('data-nid');
        localStorage.setItem("currentNewsId", content_id);
        window.location.href="./learn?uid=" + uid + "&nid=" + content_id + "&pid=1";
    });

	$('.favor-heart').click( function() {
		
	});
});
