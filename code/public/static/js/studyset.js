$(document).ready(() =>{
    //dynamicall inject html to handlebars file
    const lastPage = $('#lastPage a').html();
    generatePages(lastPage);

    $('#word_search').on('keyup', () => {
        const value = $('#word_search').val().toLowerCase();
        $('#word_list li').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Function to change the paging
    /*$('.pagination li a').click( function (){
        generateNextPage(2);
        const content = $(this).html();
        const page_to_hide = '#notebook' + $('.active a').html();
        if(content === 'Previous' || content === 'Next'){
            let current_page = parseInt($('.active a').html());
            
            if (content === 'Previous'){
                current_page--;
                if(current_page == 1){
                    $('#prev').addClass('disabled');
                }else if(current_page != lastPage){
                    $('#next').removeClass('disabled');
                }
            }else{
                current_page++;
                if(current_page == lastPage){
                    $('#next').addClass('disabled');
                }else if(current_page != 1){
                    $('#prev').removeClass('disabled');
                }
            }
            const page_to_dis = '#notebook' + current_page;
            const page_id = '#page' + current_page;
            $('.pagination .active').removeClass('active');
            $(page_id).addClass('active');
            $(page_to_hide).hide();
            $(page_to_dis).show();
        }else{
            const page_to_dis = '#notebook' + content
            const page_id = '#page' + content;
            const to_page = parseInt(content);
            if(to_page == 1){
                $('#prev').addClass('disabled');
                $('#next').removeClass('disabled');
            }else if(to_page == 6){
                $('#next').addClass('disabled');
                $('#prev').removeClass('disabled');
            }else{
                $('#prev').removeClass('disabled');
                $('#next').removeClass('disabled');
            }
            $('.pagination .active').removeClass('active');
            $(page_id).addClass('active');
            $(page_to_hide).hide();
            $(page_to_dis).show();
        }
    });*/


    $('.pagination li a').click( function (){
        const content = $(this).html();
        const page_to_hide = $('.active a').html();
        if(content === 'Previous' || content === 'Next'){
            let current_page = parseInt($('.active a').html());
            if (content === 'Previous'){
                current_page--;
                if(current_page == 1){
                    $('#prev').addClass('disabled');
                }else if(current_page != lastPage){
                    $('#next').removeClass('disabled');
                }
            }else{
                current_page++;
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
                generateNextPage(current_page,'#notebook'+page_to_hide,page_to_dis);
            }else{
                $('#notebook'+page_to_hide).hide();
                $(page_to_dis).show();
            }
        }else{
            const page_to_dis = '#notebook' + content
            console.log(content);
            const page_id = '#page' + content;
            const to_page = parseInt(content);
            if(to_page == 1){
                $('#prev').addClass('disabled');
                $('#next').removeClass('disabled');
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
                generateNextPage(content,'#notebook'+page_to_hide,page_to_dis);
            }else{
                $('#notebook'+page_to_hide).hide();
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
    for (i = 2; i < lastPage; i++){
        const idName = '#page' + (i-1).toString();
        $(idName).after( '<li class="page-item" ' + 'id="page' + i.toString() + '"' +'><a class="page-link">' + i.toString() + '</a></li>')
    }
}

function generateNextPage(nextPage,page_to_hide,page_to_dis){
    const u = '/getStudySetByPage?p=' + nextPage.toString();
    $.ajax({
        url: u,
        type:'GET',
        dataType: 'json',
        success: (data) => {
            //get 5 words array
            const result = data['targetStudySet'];    
            const finalText = generateDiv(result,nextPage);
            $('#notebook'+(nextPage-1).toString()).after(finalText);
            console.log(page_to_hide);
            $(page_to_hide).hide();
            $(page_to_dis).show();
        }
    });
}

function generateDiv(words,nextPage){
    const divStart = '<div id="notebook' + nextPage.toString() + '" style="display:none">';
    const searchbar = '<input class="form-control" id="word_search" type="text" placeholder="Search Words">'
    const ulStart = '<ul class="list-group" id="word_list">';
    let i;
    const textArray = [];
    for (i = 0; i<words.length; i++){
        textArray[i] = '<li class="list-group-item">' + 
        '<h4 class="list-group-item-heading">'+ words[i]['en'] + '</h4>'+
        '<p class="list-group-item-text">Spanish: '+ words[i]['es'] +'</p>' +
        '<p class="list-group-item-text">Hindi: ' + words[i]['hi'] + '</p>' + 
        '<p class="list-group-item-text">Chinese: ' + words[i]['zh']+ '</p></li>'
    }
    const endText = '</ul></div>';
    let finalText = divStart+searchbar+ulStart;
    for (i = 0; i<textArray.length;i++){
        finalText += textArray[i];
    }
    finalText += endText;
    return finalText;
}