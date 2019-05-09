$(document).ready(() =>{
	let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, obtain uid for future use
          uid = getCurrentUserUID();
        } else {
            //nonthing
        }
    });
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

	// $('#next-paragraph').click( () => {
	// 	alert("This is the last paragraph.");
	// });
});

function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null) {
        return currentUser.uid;
    }
    return -1;
}

function renderContent(original_content, translate_content) {
	$("#original_content_holder").html(decodeHtml(original_content));
	$("#translated_content_holder").html(decodeHtml(translate_content));
}

function decodeHtml(html) {
    return $('<div>').html(html).text();
}


function navigateNextPage(pid) {
	var url = new URL(window.location.href);

	var query_string = url.search;

	var search_params = new URLSearchParams(query_string);

	// new value of "id" is set to "101"
	search_params.set('pid', pid);

	// change the search property of the main url
	url.search = search_params.toString();

	// the new url string
	window.location.href = url.toString();


}
