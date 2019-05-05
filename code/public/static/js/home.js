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

    $('.news-button').click( () => {
        window.location.href="./learn?uid=" + uid ;
    });
});


