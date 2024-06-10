(function (window, document) {
  function register($toc) {
    const currentInView = new Set();
    const headingToMenu = new Map();
    const $menus = Array.from($toc.querySelectorAll('.menu-list > li > a'));

    for (const $menu of $menus) {
      const elementId = $menu.getAttribute('href').trim().slice(1);
      const $heading = document.getElementById(elementId);
      if ($heading) {
        headingToMenu.set($heading, $menu);
      }
    }

    const $headings = Array.from(headingToMenu.keys());

    const callback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          currentInView.add(entry.target);
        } else {
          currentInView.delete(entry.target);
        }
      }
      let $heading;
      if (currentInView.size) {
        // heading is the first in-view heading
        $heading = [...currentInView].sort(($el1, $el2) => $el1.offsetTop - $el2.offsetTop)[0];
      } else if ($headings.length) {
        // heading is the closest heading above the viewport top
        $heading = $headings
          .filter(($heading) => $heading.offsetTop < window.scrollY)
          .sort(($el1, $el2) => $el2.offsetTop - $el1.offsetTop)[0];
      }
      if ($heading && headingToMenu.has($heading)) {
        $menus.forEach(($menu) => $menu.classList.remove('is-active'));

        const $menu = headingToMenu.get($heading);
        $menu.classList.add('is-active');
        let $menuList = $menu.parentElement.parentElement;
        while (
          $menuList.classList.contains('menu-list') &&
          $menuList.parentElement.tagName.toLowerCase() === 'li'
        ) {
          $menuList.parentElement.children[0].classList.add('is-active');
          $menuList = $menuList.parentElement.parentElement;
        }
      }
    };
    const observer = new IntersectionObserver(callback, { threshold: 0 });

    for (const $heading of $headings) {
      observer.observe($heading);
      // smooth scroll to the heading
      if (headingToMenu.has($heading)) {
        const $menu = headingToMenu.get($heading);
        $menu.setAttribute('data-href', $menu.getAttribute('href'));
        $menu.setAttribute('href', 'javascript:;');
        $menu.addEventListener('click', () => {
          if (typeof $heading.scrollIntoView === 'function') {
            $heading.scrollIntoView({ behavior: 'smooth' });
          }
          const anchor = $menu.getAttribute('data-href');
          if (history.pushState) {
            history.pushState(null, null, anchor);
          } else {
            location.hash = anchor;
          }
        });
        $heading.style.scrollMargin = '1em';
      }
    }
  }

  if (typeof window.IntersectionObserver === 'undefined') {
    return;
  }

  document.querySelectorAll('#toc').forEach(register);
})(window, document);
