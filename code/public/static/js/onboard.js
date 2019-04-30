var config = {
    apiKey: "AIzaSyCrFBSlKyhyn1-pVaTfdK26ACYNmGVNxq4",
    authDomain: "cogs121-goduck.firebaseapp.com",
    databaseURL: "https://cogs121-goduck.firebaseio.com",
    projectId: "cogs121-goduck",
    storageBucket: "cogs121-goduck.appspot.com",
    messagingSenderId: "878464642980"
  };
firebase.initializeApp(config);

$(document).ready( () => {
    $('#onboard_save_btn').click(() => {
        const lang_pref = $('#sel1').val();
        const category = $('#sel2').val();
        //Future save this to user preference
        console.log(lang_pref);
        console.log(category);

        window.location.href='./home' + '?uid=' + getCurrentUserUID();
    });
});

function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null){
        return currentUser.uid;
    }
    return -1;
}