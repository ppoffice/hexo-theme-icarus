[].slice.call(document.querySelectorAll('.input')).forEach(inputEl => {
  // in case the input is already filled..
  if (inputEl.value.trim() !== '') {
    classie.add(inputEl.parentNode, 'input--filled');
  }

  // events:
  inputEl.addEventListener('focus', onInputFocus);
  inputEl.addEventListener('blur', onInputBlur);
});

function onInputFocus ({ target }) {
  classie.add(target.parentNode, 'input--filled');
}

function onInputBlur ({ target }) {
  if (target.value.trim() === '') {
    classie.remove(target.parentNode, 'input--filled');
  }
}
