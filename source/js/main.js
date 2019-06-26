(function ($) {
    $('.article img:not(".not-gallery-item")').each(function () {
        // wrap images with link and add caption if possible
        if ($(this).parent('a').length === 0) {
            $(this).wrap('<a class="gallery-item" href="' + $(this).attr('src') + '"></a>');
            if (this.alt) {
                $(this).after('<div class="has-text-centered is-size-6 has-text-grey caption">' + this.alt + '</div>');
            }
        }
    });

    if (typeof (moment) === 'function') {
        $('.article-meta time').each(function () {
            $(this).text(moment($(this).attr('datetime')).fromNow());
        });
    }

    $('.article > .content > table').each(function () {
        if ($(this).width() > $(this).parent().width()) {
            $(this).wrap('<div class="table-overflow"></div>');
        }
    });

    function adjustNavbar() {
        const navbarWidth = $('.navbar-main .navbar-start').outerWidth() + $('.navbar-main .navbar-end').outerWidth();
        if ($(document).outerWidth() < navbarWidth) {
            $('.navbar-main .navbar-menu').addClass('is-flex-start');
        } else {
            $('.navbar-main .navbar-menu').removeClass('is-flex-start');
        }
    }
    adjustNavbar();
    $(window).resize(adjustNavbar);

    var $toc = $('#toc');
    if ($toc.length > 0) {
        var $mask = $('<div>');
        $mask.attr('id', 'toc-mask');

        $('body').append($mask);

        function toggleToc() {
            $toc.toggleClass('is-active');
            $mask.toggleClass('is-active');
        }

        $toc.on('click', toggleToc);
        $mask.on('click', toggleToc);
        $('.navbar-main .catalogue').on('click', toggleToc);
    }
})(jQuery);
