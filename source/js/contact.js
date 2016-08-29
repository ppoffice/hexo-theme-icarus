$(document).ready(function(){
  var email, name, subject, text;
  var to = window.location.pathname;
  to = to.substring(to.lastIndexOf('/')+1)
  $("#contact").submit(function(e) {
    if(grecaptcha.getResponse() == "") {
      e.preventDefault();
      $("#message").empty().html("complete recaptcha");
    } else {
      email = $("#email").val();
      name = $("#fullname").val().trim();
      subject = $("#subject").val().trim();
      text = $("#content").val().trim();
      $("#message").text("Sending E-mail...Please wait");
      $.get("http://localhost:3000/api/contact", { email:email, to:to, name:name, subject:subject, text:text }, function(data) {
        if(data=="sent") {
          $("#message").empty().html("Email is been sent");
        }
      });
    }
  });
});
