(function($){
    // Caption
    $('.article-entry').each(function(i) {
        $(this).find('img').filter(function (element) {
            return $(this).hasClass('');
        }).each(function() {
            // add image caption
            if (this.alt && !(!!$.prototype.justifiedGallery && $(this).parent('.justified-gallery').length)) {
                $(this).after('<span class="caption">' + this.alt + '</span>');
            }

            if ($(this).parent().prop("tagName") !== 'A') {
                $(this).wrap('<a href="' + ($(this).attr("data-imgbig") ? $(this).attr("data-imgbig") : this.src) + '" title="' + this.alt + '" class="gallery-item"></a>');
            }
        });
    });
    if (typeof lightGallery != 'undefined') {
        var options = {
            selector: '.gallery-item'
        };
        $('.article-entry').each(function(i, entry) {
            lightGallery(entry, options);
        });
        lightGallery($('.article-gallery')[0], options);
    }
    if (!!$.prototype.justifiedGallery) {  // if justifiedGallery method is defined
        var options = {
            rowHeight: 140,
            margins: 4,
            lastRow: 'justify'
        };
        $('.justified-gallery').justifiedGallery(options);
    }

    // Profile card
    var profileElem = $('#profile');
    $(document).on('click', function () {
        profileElem.removeClass('card');
    }).on('click', '#profile-anchor', function (e) {
        e.stopPropagation();
        profileElem.toggleClass('card');
    }).on('click', '.profile-inner', function (e) {
        e.stopPropagation();
    });

    // To Top
    var sidebarElem = $('#sidebar'),
        toTopElem = $('#toTop');

    (function () {
        if (!sidebarElem.length) return;

        checkDisplayToTop();
        $(document).on('scroll', function () {
            checkDisplayToTop();
        });

        toTopElem.click(function () {
            $('body, html').animate({ scrollTop: 0 }, 600);
        });

        var isToTopDisplayed = false;
        function checkDisplayToTop() {
            var toTop = (sidebarElem.height() - $(window).height()) + 60;
            var currentScrollTop = $(document).scrollTop();
            var needDisplay = (currentScrollTop > toTop) && (currentScrollTop > 0);

            if ($(document).width() >= 800) {
                if (needDisplay) {
                    if (isToTopDisplayed) return;
                    toTopElem.fadeIn();
                    toTopElem.css('left', sidebarElem.offset().left);
                    isToTopDisplayed = true;
                } else {
                    if (!isToTopDisplayed) return;
                    toTopElem.fadeOut();
                    isToTopDisplayed = false;
                }
            } else {
                toTopElem.show();
                toTopElem.css('right', 20);
            }
        }
    })();

    // Fixed Profile
    (function () {
        checkFixedProfile();
        $(document).on('scroll', function () {
            checkFixedProfile();
        });

        var isFixedProfile = false;
        function checkFixedProfile() {
            if (!profileElem.is('.profile-fixed')) return;
            if ($(document).width() < 800) return;

            var currentScrollTop = $(document).scrollTop();
            var profileInnerElem = $('#profile .profile-inner');
            var needFixed = currentScrollTop >= profileElem.offset().top + profileElem.outerHeight(true);

            if (needFixed) {
                if (isFixedProfile) return;

                profileInnerElem.css('position', 'fixed')
                    .css('width', profileElem.innerWidth() + 'px')
                    .css('top', '0');

                // css animation fade-in
                profileInnerElem.css('animation', '');
                profileInnerElem.addClass('anim-fade-in');
                isFixedProfile = true;
            } else {
                if (!isFixedProfile) return;

                profileInnerElem.css('position', '')
                    .css('width', '')
                    .css('top', '');

                profileInnerElem.css('animation', 'none');
                isFixedProfile = false;
            }
        }
    })();

})(jQuery);
