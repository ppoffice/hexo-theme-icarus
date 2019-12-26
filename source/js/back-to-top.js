$(document).ready(() => {
    const $button = $('#back-to-top');
    const $footer = $('footer.footer');
    const $mainColumn = $('.column-main');
    const $leftSidebar = $('.column-left');
    const $rightSidebar = $('.column-right');
    let lastScrollTop = 0;
    const rightMargin = 20;
    const bottomMargin = 20;
    let lastState = null;
    const state = {
        base: {
            classname: 'card has-text-centered',
            left: '',
            width: 64,
            bottom: bottomMargin,
            'border-radius': 4
        }
    };
    state['desktop-hidden'] = Object.assign({}, state.base, {
        classname: state.base.classname + ' rise-up'
    });
    state['desktop-visible'] = Object.assign({}, state['desktop-hidden'], {
        classname: state['desktop-hidden'].classname + ' fade-in'
    });
    state['desktop-dock'] = Object.assign({}, state['desktop-visible'], {
        classname: state['desktop-visible'].classname + ' fade-in',
        width: 40,
        'border-radius': '50%'
    });
    state['mobile-hidden'] = Object.assign({}, state.base, {
        classname: state.base.classname + ' fade-in',
        right: rightMargin
    });
    state['mobile-visible'] = Object.assign({}, state['mobile-hidden'], {
        classname: state['mobile-hidden'].classname + ' rise-up'
    });

    function isStateEquals(prev, next) {
        return ![].concat(Object.keys(prev), Object.keys(next)).some(key => {
            return !Object.prototype.hasOwnProperty.call(prev, key)
                || !Object.prototype.hasOwnProperty.call(next, key)
                || next[key] !== prev[key];
        });
    }

    function applyState(state) {
        if (lastState !== null && isStateEquals(lastState, state)) {
            return;
        }
        $button.attr('class', state.classname);
        for (const prop in state) {
            if (prop === 'classname') {
                continue;
            }
            $button.css(prop, state[prop]);
        }
        lastState = state;
    }

    function isDesktop() {
        return window.innerWidth >= 1078;
    }

    function isTablet() {
        return window.innerWidth >= 768 && !isDesktop();
    }

    function isScrollUp() {
        return $(window).scrollTop() < lastScrollTop && $(window).scrollTop() > 0;
    }

    function hasLeftSidebar() {
        return $leftSidebar.length > 0;
    }

    function hasRightSidebar() {
        return $rightSidebar.length > 0;
    }

    function getRightSidebarBottom() {
        if (!hasRightSidebar()) {
            return 0;
        }
        return Math.max.apply(null, $rightSidebar.find('.widget').map(function() {
            return $(this).offset().top + $(this).outerHeight(true);
        }));
    }

    function getScrollTop() {
        return $(window).scrollTop();
    }

    function getScrollBottom() {
        return $(window).scrollTop() + $(window).height();
    }

    function getButtonWidth() {
        return $button.outerWidth(true);
    }

    function getButtonHeight() {
        return $button.outerHeight(true);
    }

    function updateScrollTop() {
        lastScrollTop = $(window).scrollTop();
    }

    function update() {
        // desktop mode or tablet mode with only right sidebar enabled
        if (isDesktop() || (isTablet() && !hasLeftSidebar() && hasRightSidebar())) {
            let nextState;
            const padding = ($mainColumn.outerWidth() - $mainColumn.width()) / 2;
            const maxLeft = $(window).width() - getButtonWidth() - rightMargin;
            const maxBottom = $footer.offset().top + (getButtonHeight() / 2) + bottomMargin;
            if (getScrollTop() === 0 || getScrollBottom() < getRightSidebarBottom() + padding + getButtonHeight()) {
                nextState = state['desktop-hidden'];
            } else if (getScrollBottom() < maxBottom) {
                nextState = state['desktop-visible'];
            } else {
                nextState = Object.assign({}, state['desktop-dock'], {
                    bottom: getScrollBottom() - maxBottom + bottomMargin
                });
            }

            const left = $mainColumn.offset().left + $mainColumn.outerWidth() + padding;
            nextState = Object.assign({}, nextState, {
                left: Math.min(left, maxLeft)
            });
            applyState(nextState);
        } else {
            // mobile and tablet mode
            if (!isScrollUp()) {
                applyState(state['mobile-hidden']);
            } else {
                applyState(state['mobile-visible']);
            }
            updateScrollTop();
        }
    }

    update();
    $(window).resize(update);
    $(window).scroll(update);

    $('#back-to-top').on('click', () => {
        $('body, html').animate({ scrollTop: 0 }, 400);
    });
});
