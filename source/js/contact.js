$(document).ready(function(){
  var site = window.location.hostname;
  var email, name, subject, text, recaptcha;
  var to = window.location.pathname;
  to = to.substring(to.lastIndexOf('/')+1)
  $("#contact").submit(function(e) {
    recaptcha = grecaptcha.getResponse();
    if(recaptcha == "") {
      e.preventDefault();
      $("#message").empty().html("complete recaptcha");
    } else {
      e.preventDefault();
      email = $("#email").val();
      name = $("#fullname").val().trim();
      subject = $("#subject").val().trim();
      text = $("#content").val().trim();
      $("#message").text("Sending E-mail");
      $.get("https://" + site + "/api/contact", { email:email, to:to, name:name, subject:subject, text:text, recaptcha:recaptcha}, function(data) {
        if(data === "sent") {
          $("#message").empty().html("Email has been sent");
        }
      });
    }
  });
});
