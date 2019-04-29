$(document).ready(() =>{
    $('#word_search').on('keyup', () => {
        const value = $('#word_search').val().toLowerCase();
        $('#word_list li').filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    //Function to change the paging
    $('.pagination li a').click( function (){
        const content = $(this).html();
        const page_to_hide = '#notebook' + $('.active a').html();
        if(content === 'Previous' || content === 'Next'){
            let current_page = parseInt($('.active a').html());
            
            if (content === 'Previous'){
                current_page--;
                if(current_page == 1){
                    $('#prev').addClass('disabled');
                }else if(current_page ==5){
                    $('#next').removeClass('disabled');
                }
            }else{
                current_page++;
                if(current_page == 6){
                    $('#next').addClass('disabled');
                }else if(current_page ==2){
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
    });
});