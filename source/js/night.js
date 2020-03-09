/**
 * Icarus 夜间模式 by iMaeGoo
 * https://www.imaegoo.com/
 */ 
var isNight = localStorage.getItem('night')
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
    localStorage.setItem('switched', 'true');
}

let mode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if(mode.toString() != localStorage.getItem('current')){
    localStorage.setItem('switched', 'false');
    localStorage.setItem('current', window.matchMedia('(prefers-color-scheme: dark)').matches);
}
if(localStorage.getItem('switched') != 'true'){
    isNight = window.matchMedia('(prefers-color-scheme: dark)').matches;
}
findNightNav();
applyNight(isNight);
