$(document).ready(() =>{
	//
	// $('.list-group-item-text').click( () => {
	// 	// console.log("e is " + e)
	// 	$('.list-group-item-text')["data-content"] = "ataques<button>Add to studyset</button>";
	// });

    $('[data-toggle="popover"]').popover();
    $('h1').click( () =>{
        $("[data-toggle='popover']").popover('hide');
    });

});

function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null){
        return currentUser.uid;
    }
    return -1;
}
