$(document).ready(() =>{
	let uid;
	let translateArr = [];
	let en;
	let toHide = false;
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

	$(document).on('click', (e)=>{
		if((e.target.id != 'notiOverlay' && e.target.id !='addWordBtn' && e.target.id !='addWordBtn'
		&& e.target.class != 'w3-display-container' && e.target.id != 'english' && e.target.id != 'translate'
		&& e.target.id != 'notiButton' && e.target.id != 'notiBody' && e.target.tagName != 'ESL' &&
		e.target.class != 'w3-display-middle')){
			$('#notiOverlay').hide();
		}else{
			$('#notiOverlay').show();
		}
	});

	$('p').on('click','esl',function(){
		$('#notiOverlay').toggle();
		if($('#notiOverlay').is(":visible")){
			const prefer_lang = parseInt($('#learn_page_prefer_lang').text());
			translateArr = $(this).attr('data');
			translateArr = translateArr.split(',');
			en = $(this).text()
			$('#english').text('English: ' + en);
			$('#translate').text('Translate: ' + translateArr[prefer_lang]);
		}
	});


	$('#addWordBtn').click(function (){
		const word = JSON.stringify({'en':en,'zh':translateArr[0],'es':translateArr[1],'hi':translateArr[2]})
		const u = '/addword?uid=' + uid;
		$.ajax({
			url: u,
			type:'POST',
			data: word,
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			success: (data) => {
				if(data['added']){
					
					$('#addWordToast').toast('show');
				}else{
					
					$('#alreadtAddWordToast').toast('show');
				}
			}
		});
	});



	$('#add-to-favorite').click( () => {
		const title = $('#learn_page_title').text();
		const u = '/addfavor?uid='+ uid + '&title=' + title;
        $.ajax({
            url: u,
            type:'GET',
            dataType: 'json',
            success: (data) => {
                $('#addFavorToast').toast('show');
				$('#add-to-favorite').hide();
				$('#remove-favorite').show();
            }
        });
	});

	$('#remove-favorite').click( function() {
        const title = $('#learn_page_title').text();
        const u = '/unfavor?uid='+ uid + '&title=' + title;
        $.ajax({
            url: u,
            type:'GET',
            dataType: 'json',
            success: (data) => {
                $('#unfavorToast').toast('show');
				$('#remove-favorite').hide();
                $('#add-to-favorite').show();
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
