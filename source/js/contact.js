$(document).ready(function(){
  var email, name, subject, text;
  var to = window.location.pathname;
  $("#contact").submit(function() {
      email=$("#email").val();
      name=$("#name").val().trim();
      subject=$("#subject").val().trim();
      text=$("#content").val().trim();
      $("#message").text("Sending E-mail...Please wait");
      $.get("http://localhost:3000/api/contact", { email:email, to:to, name:name, subject:subject, text:text }, function(data) {
      if(data=="sent") {
        $("#message").empty().html("Email is been sent");
      }
    });
  });
});
