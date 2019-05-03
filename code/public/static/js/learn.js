console.log("oierhfoiuerhfiuerhf");
$(document).ready(() =>{
	//
	// $('.list-group-item-text').click( () => {
	// 	// console.log("e is " + e)
	// 	$('.list-group-item-text')["data-content"] = "ataques<button>Add to studyset</button>";
	// });


    $('[data-toggle="popover"]').popover();
    $('h1').click( () => {
        $("[data-toggle='popover']").popover('hide');
    });

	$('.popover-word').click( () => {
		$('.addBtn').click( () => {
			alert("Added this word to studyset.");
		});
	});

	$('#add-to-favorite').click( () => {
		alert("Added this news to your favorite news.");
	});

	$('#next-paragraph').click( () => {
		alert("This is the last paragraph.");
	});
});



function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
        return currentUser.uid;
    }
    return -1;
}
