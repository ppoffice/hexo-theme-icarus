$(document).ready(() => {
  const site = window.location.origin;
  let email;
  let name;
  let subject;
  let text;
  let recaptcha;
  let to = window.location.pathname;
  to = to.substring(to.lastIndexOf('/') + 1);
  $('#contact').submit(e => {
    recaptcha = grecaptcha.getResponse();
    if (recaptcha === '') {
      e.preventDefault();
      $('#message').empty().html('complete recaptcha');
    } else {
      e.preventDefault();
      email = $('#email').val();
      name = $('#fullname').val().trim();
      subject = $('#subject').val().trim();
      text = $('#content').val().trim();
      $('#message').text('Sending E-mail');
      $.get(`${site}/api/contact`, { email, to, name, subject, text, recaptcha }, ({ formSubmit, errors }) => {
        if (!formSubmit) {
          $('#message').empty().html('Error in recaptcha');
        } else {
          const message = errors || 'Email Sent';
          $('#message').empty().html(message);
        }
      });
    }
  });
});
