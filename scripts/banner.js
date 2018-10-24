const cheerio = require('cheerio');

function addBanner(content) {
    const $ = cheerio.load(content, { decodeEntities: false });
    $('body > .section > .container').prepend(`
<div id="icarus-notify-pre-release" class="notification is-warning">
<button class="delete"></button>
Now you are viewing the documentation of a pre-release version Icarus. Please be aware that content on this website are subject to change.
</div>
<script>
!function () {
    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function removeHtml(selector) {
        document.querySelector(selector).parentNode.removeChild(document.querySelector(selector));
    }

    if (getCookie('icarus-notify-pre-release')) {
        removeHtml('#icarus-notify-pre-release');
    }
    if (document.querySelector('#icarus-notify-pre-release .delete')) {
        document.querySelector('#icarus-notify-pre-release .delete').addEventListener('click', function () {
            setCookie('icarus-notify-pre-release', true);
            removeHtml('#icarus-notify-pre-release');
        });
    }
}();
</script>
`);
    return $.html();
}

hexo.extend.filter.register('after_render:html', function (content, data) {
    return addBanner(content);
});