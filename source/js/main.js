(function($){
    var toTop = $('#toTop').length ? $('#toTop').offset().top - $(window).height() + 20 : 0;

    // Caption
    $('.article-entry').each(function(i){
        $(this).find('img').each(function(){
            if ($(this).parent().hasClass('fancybox')) {
                return;
            }
            var alt = this.alt;
            if (alt) {
                $(this).after('<span class="caption">' + alt + '</span>');
            }

            $(this).wrap('<a href="' + this.src + '" title="' + alt + '" class="fancybox"></a>');
        });

        $(this).find('.fancybox').each(function(){
            $(this).attr('rel', 'article' + i);
        });
    });
    if ($.fancybox){
        $('.fancybox').fancybox();
    }

    // Profile card
    $(document).on('click', function () {
        $('#profile').removeClass('card');
    }).on('click', '#profile-anchor', function (e) {
        e.stopPropagation();
        $('#profile').toggleClass('card');
    }).on('click', '.profile-inner', function (e) {
        e.stopPropagation();
    });

    // To Top
    $(document).on('scroll', function () {
        if ($(document).width() >= 800) {
            if($(this).scrollTop() > toTop) {
                $('#toTop').addClass('fix');
                $('#toTop').css('left', $('#sidebar').offset().left);
            } else {
                $('#toTop').removeClass('fix');
            }
        } else {
            $('#toTop').addClass('fix');
            $('#toTop').css('right', 20);
        }
    }).on('click', '#toTop', function () {
        $('body, html').animate({ scrollTop: 0 }, 600);
    });

})(jQuery);