$(document).ready(() =>{
	let uid;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
        // User is signed in, obtain uid for future use
		  	uid = getCurrentUserUID();
		  	const title = $('#learn_page_title').text();
			const u = '/addhistory?uid=' + uid + '&title=' + title;
			$.ajax({
				url: u,
				type: 'GET',
				dataType: 'json',
				success: (data) =>{
					console.log('add to history');	
				}
			});
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

	// $('.popover-word').click( () => {
	// 	$('.addBtn').click( () => {
	// 		alert("Added this word to studyset.");
	// 	});
	// });
	$('p').on( 'click','span', function(){
		$(this).popover({ trigger: 'click' });
		$('.addBtn').click( () => {
			alert("Added this word to studyset.");
		});
	});

	$('#original_content_holder span').click(() =>{
		console.log('test');
	})

	$('#add-to-favorite').click( () => {
		const title = $('#learn_page_title').text();
		const u = '/addfavor?uid='+ uid + '&title=' + title;
        $.ajax({
            url: u,
            type:'GET',
            dataType: 'json',
            success: (data) => {
                console.log('add favor news');
            }
        });
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

function navigatePrevPage(pid) {

	if (pid == 0) {
		alert("You have reached the last paragraph. Great work!");
		return;
	}
	var url = new URL(window.location.href);
	var query_string = url.search;
	var search_params = new URLSearchParams(query_string);
	search_params.set('pid', pid);
	url.search = search_params.toString();
	window.location.href = url.toString();
}

function navigateNextPage(pid, max_pid) {

	if (pid == max_pid + 1) {
		alert("You have reached the last paragraph. Great work!");
		return;
	}
	var url = new URL(window.location.href);
	var query_string = url.search;
	var search_params = new URLSearchParams(query_string);
	search_params.set('pid', pid);
	url.search = search_params.toString();
	window.location.href = url.toString();
}
