$(document).ready(function(){
  const site = window.location.origin;
  let email, name, subject, text, recaptcha;
  let to = window.location.pathname;
  to = to.substring(to.lastIndexOf('/')+1);
  $('#contact').submit(function(e) {
    recaptcha = grecaptcha.getResponse();
    if(recaptcha == '') {
      e.preventDefault();
      $('#message').empty().html('complete recaptcha');
    } else {
      e.preventDefault();
      email = $("#email").val();
      name = $("#fullname").val().trim();
      subject = $("#subject").val().trim();
      text = $("#content").val().trim();
      $("#message").text("Sending E-mail");
      $.get(site + "/api/contact", { email:email, to:to, name:name, subject:subject, text:text, recaptcha:recaptcha}, function(data) {
        if(!data.formSubmit) {
          $("#message").empty().html('Error in recaptcha');
        } else {
          const message = data.error ? data.error : 'Email Sent';
          $("#message").empty().html(message);
        }
      });
    }
  });
});
