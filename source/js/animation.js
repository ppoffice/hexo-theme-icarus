(function () {
    function $() {
        return Array.prototype.slice.call(document.querySelectorAll.apply(document, arguments));
    }

    $('body > .navbar, body > .section, body > .footer').forEach(function (element) {
        element.style.transition = '0s';
        element.style.opacity = '0';
    });
    document.querySelector('body > .navbar').style.transform = 'translateY(-100px)';
    ['.column-main > .card',
     '.column-left > .card, .column-right-shadow > .card',
     '.column-right > .card'].map(function (selector) {
        $(selector).forEach(function (element) {
            element.style.transition = '0s';
            element.style.opacity = '0';
            element.style.transform = 'scale(0.8)';
            element.style.transformOrigin = 'center top';
        });
    });
    setTimeout(function () {
        $('body > .navbar, body > .section, body > .footer').forEach(function (element) {
            element.style.opacity = '1';
            element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        });
        document.querySelector('body > .navbar').style.transform = 'translateY(0)';
        ['.column-main > .card',
         '.column-left > .card, .column-right-shadow > .card',
         '.column-right > .card'].map(function (selector) {
            var i = 1;
            $(selector).forEach(function (element) {
                setTimeout(function () {
                    element.style.opacity = '1';
                    element.style.transform = '';
                    element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                }, i * 100);
                i++;
            });
        });
    });
})();
