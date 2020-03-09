/**
 * Icarus 夜间模式 by iMaeGoo
 * https://www.imaegoo.com/
 */ 
var isNight = window.matchMedia('(prefers-color-scheme: dark)').matches;

var nightNav;

function applyNight(value) {
    if (value.toString() === 'true') {
        document.body.classList.add('night');
    } else {
        document.body.classList.remove('night');
    }
}

function findNightNav() {
    nightNav = document.getElementById('night-nav');
    if (!nightNav) {
        setTimeout(findNightNav, 100);
    } else {
        nightNav.addEventListener('click', switchNight);
    }
}

function switchNight() {
    isNight = isNight ? isNight.toString() !== 'true' : true;
    applyNight(isNight);
    localStorage.setItem('night', isNight);
}

findNightNav();
applyNight(isNight);
