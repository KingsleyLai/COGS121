$(document).ready(() =>{
    //dynamicall inject html to handlebars file
    const lastPage = $('#lastPage a').html();
    generatePages(parseInt(lastPage));

    $('#word_search').on('keyup', () => {
        const value = $('#word_search').val().toLowerCase();
        $('#word_list li').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Function to change the paging
    $('.pagination li a').click( function (){
        const content = $(this).html();
        const page_to_hide = '#notebook'+$('.active a').html();
        if(content === 'Previous' || content === 'Next'){
            let current_page = parseInt($('.active a').html());
            if (content === 'Previous'){
                current_page--;
                $('#next').removeClass('disabled');
                if(current_page == 1){
                    $('#prev').addClass('disabled');
                }else if(current_page != lastPage){
                    $('#next').removeClass('disabled');
                }
            }else{
                current_page++;
                $('#prev').removeClass('disabled');
                if(current_page == lastPage){
                    $('#next').addClass('disabled');
                }else if(current_page != 1){
                    $('#prev').removeClass('disabled');
                }
            }
            
            const page_to_dis = '#notebook' + current_page;
            const page_id = '#page' + current_page;
            $('.pagination .active').removeClass('active');
            if(current_page == lastPage){
                $('#lastPage').addClass('active');
            }else{
                $(page_id).addClass('active');
            }
            if($(page_to_dis).length == 0){
                generateNextPage(current_page,page_to_hide,page_to_dis);
            }else{
                $(page_to_hide).hide();
                $(page_to_dis).show();
            }
        }else{
            const page_to_dis = '#notebook' + content
            const page_id = '#page' + content;
            const to_page = parseInt(content);
            if(to_page == 1){
                $('#prev').addClass('disabled');
                if(content != 1){
                    $('#next').removeClass('disabled');
                }
            }else if(to_page == lastPage){
                $('#next').addClass('disabled');
                $('#prev').removeClass('disabled');
            }else{
                $('#prev').removeClass('disabled');
                $('#next').removeClass('disabled');
            }
            $('.pagination .active').removeClass('active');
            if(content == lastPage){
                $('#lastPage').addClass('active');
            }else{
                $(page_id).addClass('active');
            }
            if($(page_to_dis).length == 0){
                generateNextPage(content,page_to_hide,page_to_dis);
            }else{
                $(page_to_hide).hide();
                $(page_to_dis).show();
            }
        }

    });
});
 
function getCurrentUserUID(){
    const currentUser = firebase.auth().currentUser;
    if (currentUser != null){
        return currentUser.uid;
    }
    return -1;
}

function generatePages(lastPage) {
    let i;
    if (lastPage != 1){
        $('#lastPage').show();
        $('#next').removeClass('disabled');
    }
    for (i = 2; i < lastPage; i++){
        const idName = '#page' + (i-1).toString();
        $(idName).after( '<li class="page-item" ' + 'id="page' + i.toString() + '"' +'><a class="page-link">' + i.toString() + '</a></li>')
    }
}

function generateNextPage(nextPage,page_to_hide,page_to_dis){
    const u = '/getStudySetByPage?uid='+ getCurrentUserUID() +'&p=' + nextPage.toString();
    $.ajax({
        url: u,
        type:'GET',
        dataType: 'json',
        success: (data) => {
            //get 5 words array
            const result = data['targetStudySet'];    
            const finalText = generateDiv(result,nextPage);
            $('#notebook1').after(finalText);
            $(page_to_hide).hide();
            $(page_to_dis).show();
        }
    });

    $(document).ajaxError(() =>{
        alert('Unknown ajax error');
    });
}

function generateDiv(words,nextPage){
    const divStart = '<div id="notebook' + nextPage.toString() + '" style="display:none">';
    //const searchbar = '<input class="form-control" id="word_search" type="text" placeholder="Search Words">'
    const ulStart = '<ul class="list-group" id="word_list">';
    let i;
    const keys = Object.keys(words[0]);
    const textArray = [];
    for (i = 0; i<words.length; i++){
        textArray[i] = '<li class="list-group-item">' + 
        '<h4 class="list-group-item-heading">'+ words[i]['en'] + '</h4>';
        if(keys.includes('es')){
            textArray[i] += '<p class="list-group-item-text">Spanish: '+ words[i]['es'] +'</p></li>'
        }else if(keys.includes('hi')){
            textArray[i] += '<p class="list-group-item-text">Hindi: ' + words[i]['hi'] + '</p></li>'
        }else if(keys.includes('zh')){
            textArray[i] += '<p class="list-group-item-text">Chinese: ' + words[i]['zh']+ '</p></li>'
        }
    }
    const endText = '</ul></div>';
    let finalText = divStart+ulStart;
    for (i = 0; i<textArray.length;i++){
        finalText += textArray[i];
    }
    finalText += endText;
    return finalText;
}