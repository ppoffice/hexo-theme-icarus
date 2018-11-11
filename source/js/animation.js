function isIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    return (msie > 0 || trident > 0);
}

document.addEventListener("DOMContentLoaded", function () {
    var containers = document.querySelectorAll('body>.navbar,body>.section,body>.footer');
    for (var i = 0; i < containers.length; i++) {
        containers[i].style.opacity = '1';
    }
    if (!isIE()) {
        ['.column-main > .card',
            '.column-left > .card',
            '.column-right > .card'].map(function (target) {
                anime({
                    targets: target,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 300,
                    easing: 'easeOutSine',
                    delay: function (el, i, l) {
                        return i * 100;
                    }
                })
            });

        anime({
            targets: '.navbar-main',
            translateY: [-100, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutSine'
        });
    }
});