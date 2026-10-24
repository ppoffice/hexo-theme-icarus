(function($) {
    let current = null;

    // Each page owns its handlers, observer and queued work. PJAX keeps the navbar shell but
    // replaces its links: dispose the previous page before measuring or binding the next one.
    function destroy() {
        if (current) {
            current.destroy();
            current = null;
        }
    }

    function init() {
        destroy();
        const $navbar = $('.navbar-main');
        const $navbarToggle = $navbar.find('.navbar-toggle');
        if (!$navbar.length) {
            return;
        }
        let active = true;
        let observer = null;
        let resizeFrame = null;
        const frames = new Set();
        let navbarClosedHeight = null;

        function schedule(callback) {
            const frame = requestAnimationFrame(() => {
                frames.delete(frame);
                if (active) {
                    callback();
                }
            });
            frames.add(frame);
            return frame;
        }

        function updateNavbarHeight() {
            const navbar = $navbar[0];
            const height = navbar.getBoundingClientRect().height;
            if (!$navbar.hasClass('is-open') || navbarClosedHeight === null) {
                navbar.style.marginBottom = '';
                navbarClosedHeight = height;
                document.documentElement.style.setProperty('--navbar-height', height + 'px');
            } else if (getComputedStyle(navbar).position === 'sticky') {
                navbar.style.marginBottom = (navbarClosedHeight - height) + 'px';
            } else {
                navbar.style.marginBottom = '';
            }
        }

        function closeNavbarDropdowns() {
            $navbar.find('.navbar-link[aria-expanded="true"]').attr('aria-expanded', 'false');
            $navbar.removeClass('is-dropdown-open');
            updateNavbarHeight();
        }

        // Keep a drop-down within the window, measuring it shown without painting it.
        function alignNavbarDropdown($group) {
            const dropdown = $group.children('.navbar-dropdown')[0];
            if (!dropdown) {
                return;
            }
            const style = dropdown.style;
            style.marginLeft = '';
            if ($navbar.hasClass('is-collapsed')) {
                return;
            }
            style.display = 'block';
            style.visibility = 'hidden';
            const rect = dropdown.getBoundingClientRect();
            const margin = parseFloat(getComputedStyle(dropdown).marginLeft) || 0;
            style.display = '';
            style.visibility = '';
            const shift = Math.max(Math.min(0, document.documentElement.clientWidth - rect.right), -rect.left);
            style.marginLeft = shift < 0 ? (margin + shift) + 'px' : '';
        }

        function openNavbarDropdown($link) {
            closeNavbarDropdowns();
            const $group = $link.closest('.has-dropdown').removeClass('is-hover-closed');
            alignNavbarDropdown($group);
            $link.attr('aria-expanded', 'true');
            $navbar.addClass('is-dropdown-open');
            updateNavbarHeight();
        }

        function setNavbarMenuOpen(open) {
            $navbar.toggleClass('is-open', open);
            $navbarToggle.attr('aria-expanded', String(open));
            updateNavbarHeight();
        }

        function navbarOverflows() {
            return $navbar.find('.navbar-container, .navbar-menu').get().some(el => el.scrollWidth > el.clientWidth + 1);
        }

        function refresh() {
            if (!active) {
                return;
            }
            const $menu = $navbar.find('.navbar-menu');
            const wasCollapsed = $navbar.hasClass('is-collapsed');
            // Measure the expanded layout so folding cannot make it fit and unfold it again.
            $navbar.removeClass('is-collapsed is-scrolling').addClass('is-measuring');
            $menu.addClass('justify-content-start');
            const collapse = $navbarToggle.length > 0 && navbarOverflows();
            $navbar.toggleClass('is-collapsed', collapse);
            if (!collapse) {
                setNavbarMenuOpen(false);
            }
            const scrolls = navbarOverflows();
            $menu.toggleClass('justify-content-start', scrolls);
            $navbar.toggleClass('is-scrolling', scrolls).removeClass('is-measuring');
            if (collapse !== wasCollapsed) {
                closeNavbarDropdowns();
            }
            $navbar.find('.navbar-link[aria-expanded="true"]').each((i, link) => alignNavbarDropdown($(link).closest('.has-dropdown')));
            updateNavbarHeight();
        }

        current = {
            refresh,
            destroy() {
                active = false;
                $navbarToggle.off('.icarus-navbar');
                $(document).off('.icarus-navbar');
                $(window).off('.icarus-navbar');
                if (observer) {
                    observer.disconnect();
                }
                frames.forEach(frame => cancelAnimationFrame(frame));
                frames.clear();
                // Keep the existing observer handle available to integrations.
                window.IcarusNavbarObserver = null;
            }
        };

        $navbar.addClass('is-scripted');
        setNavbarMenuOpen(false);
        closeNavbarDropdowns();
        refresh();
        $navbarToggle.on('click.icarus-navbar', () => {
            setNavbarMenuOpen(!$navbar.hasClass('is-open'));
        });
        // Delegated: PJAX replaces the menu links. Only one sub-menu is open at a time.
        $(document).on('click.icarus-navbar', '.navbar-main .navbar-link', function() {
            const $link = $(this);
            if ($link.attr('aria-expanded') === 'true') {
                closeNavbarDropdowns();
                $link.closest('.has-dropdown').addClass('is-hover-closed');
            } else {
                openNavbarDropdown($link);
            }
        }).on('mouseenter.icarus-navbar', '.navbar-main .has-dropdown', function() {
            const $group = $(this);
            if (!$navbar.hasClass('is-collapsed')) {
                if (!$group.find('.navbar-link[aria-expanded="true"]').length && window.matchMedia
                    && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    closeNavbarDropdowns();
                }
                alignNavbarDropdown($group);
            }
        }).on('mouseleave.icarus-navbar', '.navbar-main .has-dropdown', function() {
            $(this).removeClass('is-hover-closed');
        }).on('focusout.icarus-navbar', '.navbar-main .has-dropdown', function(event) {
            if (!$navbar.hasClass('is-collapsed') && event.relatedTarget && !$.contains(this, event.relatedTarget)
                && $(this).find('.navbar-link[aria-expanded="true"]').length) {
                closeNavbarDropdowns();
            }
        }).on('click.icarus-navbar', event => {
            const $target = $(event.target);
            if ($target.closest('.navbar-dropdown a').length || !$target.closest('.navbar-main .has-dropdown').length) {
                closeNavbarDropdowns();
            }
            if ($navbar.hasClass('is-open')
                && ($target.closest('.navbar-start a').length || !$target.closest('.navbar-start, .navbar-toggle').length)) {
                setNavbarMenuOpen(false);
            }
        }).on('focusin.icarus-navbar', event => {
            const target = event.target;
            const navbar = $navbar[0];
            let keyboard = false;
            try {
                keyboard = target.matches(':focus-visible');
            } catch (e) {
                // :focus-visible is not supported
            }
            if (!keyboard || $.contains(navbar, target) || $(target).closest('#toc, .searchbox').length
                || getComputedStyle(navbar).position !== 'sticky') {
                return;
            }
            schedule(() => {
                const bottom = navbar.getBoundingClientRect().bottom;
                const top = target.getBoundingClientRect().top;
                if (document.activeElement === target && top < bottom) {
                    window.scrollBy(0, top - bottom - parseFloat(getComputedStyle(target).fontSize));
                }
            });
        }).on('keydown.icarus-navbar', event => {
            if (event.key !== 'Escape') {
                return;
            }
            const focused = document.activeElement;
            const refocus = $button => {
                if (!focused || focused === document.body || $.contains($navbar[0], focused)) {
                    $button[0].focus({ preventScroll: getComputedStyle($navbar[0]).position === 'sticky' });
                }
            };
            const $open = $navbar.find('.navbar-link[aria-expanded="true"]');
            $navbar.find('.has-dropdown').filter(':hover').addClass('is-hover-closed');
            if ($open.length) {
                closeNavbarDropdowns();
                $open.closest('.has-dropdown').addClass('is-hover-closed');
                refocus($open);
            } else if ($navbar.hasClass('is-open')) {
                setNavbarMenuOpen(false);
                refocus($navbarToggle);
            }
        });

        if (typeof ResizeObserver === 'function') {
            observer = new ResizeObserver(() => {
                // A disconnected observer may still have a queued notification.
                if (active && resizeFrame === null) {
                    resizeFrame = schedule(() => {
                        resizeFrame = null;
                        refresh();
                    });
                }
            });
            window.IcarusNavbarObserver = observer;
            $navbar.find('.navbar-container, .navbar-start, .navbar-end').each((i, el) => observer.observe(el));
        } else {
            $(window).on('resize.icarus-navbar', refresh);
        }
        if (document.fonts && document.fonts.ready) {
            // Promises cannot be cancelled: refresh ignores the disposed page.
            document.fonts.ready.then(refresh);
        }
    }

    window.IcarusNavbar = { init, refresh() { if (current) { current.refresh(); } }, destroy };
    // Loaded once with defer. Per-page main.js must not reset this page's queued focus work.
    init();
}(jQuery));
