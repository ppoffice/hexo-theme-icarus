(function() {
    const root = document.documentElement;
    const storageKey = 'icarus:appearance';
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    let preference = null;
    try {
        const saved = localStorage.getItem(storageKey);
        preference = saved === 'light' || saved === 'dark' ? saved : null;
    } catch (e) {
        // Storage can be unavailable; the choice still works for this page's lifetime.
    }

    function isDark() {
        const appearance = root.getAttribute('data-appearance');
        return appearance === 'dark' || (appearance === 'auto' && system.matches);
    }

    /** Synchronize resources whose media queries would otherwise ignore a manual choice. */
    function sync() {
        const appearance = root.getAttribute('data-appearance');
        root.style.colorScheme = root.getAttribute('data-appearance-mode') === 'auto' && appearance !== 'auto' ? appearance : '';
        document.querySelectorAll('link[data-pjax][media]').forEach(link => {
            const media = link.getAttribute('data-appearance-media') || link.getAttribute('media');
            if (!/^\(prefers-color-scheme: (light|dark)\)$/.test(media)) {
                return;
            }
            link.setAttribute('data-appearance-media', media);
            const selected = media.includes(appearance || 'light') ? 'all' : 'not all';
            link.setAttribute('media', appearance === 'auto' ? media : selected);
        });
        document.querySelectorAll('.navbar-logo picture source, .footer-logo picture source').forEach(source => {
            const selected = appearance === 'dark' ? 'all' : 'not all';
            source.setAttribute('media', appearance === 'auto' ? '(prefers-color-scheme: dark)' : selected);
        });
        document.querySelectorAll('.appearance-toggle').forEach(button => {
            button.setAttribute('aria-pressed', String(isDark()));
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = isDark() ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }

    /** Only auto pages accept the visitor's override; fixed pages keep their own appearance. */
    function apply() {
        if (root.getAttribute('data-appearance-mode') === 'auto') {
            root.setAttribute('data-appearance', preference || 'auto');
        }
        sync();
    }

    window.IcarusAppearance = { apply, sync };
    apply();
    document.addEventListener('DOMContentLoaded', sync);
    document.addEventListener('click', event => {
        if (!event.target.closest('.appearance-toggle') || root.getAttribute('data-appearance-mode') !== 'auto') {
            return;
        }
        preference = isDark() ? 'light' : 'dark';
        try {
            localStorage.setItem(storageKey, preference);
        } catch (e) {
            // Retain the in-memory choice even when storage is unavailable.
        }
        apply();
    });
    system.addEventListener('change', sync);
}());
