hexo.extend.injector.register(
  "body_end",
  () => {
    return `
    <script>
    (() => {
        function switchTab() {
            if (!location.hash) {
              return;
            }
            Array
                .from(document.querySelectorAll('.tab-content'))
                .forEach($tab => {
                    $tab.classList.add('is-hidden');
                });
            Array
                .from(document.querySelectorAll('.tabs li'))
                .forEach($tab => {
                    $tab.classList.remove('is-active');
                });
            const $activeTab = document.querySelector(location.hash);
            if ($activeTab) {
                $activeTab.classList.remove('is-hidden');
            }
            const $tabMenu = document.querySelector(\`a[href="\${location.hash}"]\`);
            if ($tabMenu) {
                $tabMenu.parentElement.classList.add('is-active');
            }
        }
        switchTab();
        window.addEventListener('hashchange', switchTab, false);
    })();
    </script>
    `;
  },
  "post"
);
