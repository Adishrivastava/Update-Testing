$(document).ready(function () {
   $('body').loadingModal('hide');
   console.log("start");
   var email, password, f, tmp, uid, user, tmp2;
   const auth = firebase.auth();
   $("#mform").submit(function (evt) {
      evt.preventDefault();
      $('body').loadingModal('show');
      console.log("hello");
      email = $("#email").val();
      password = $("#password").val();
      console.log(email + password);
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
         .then(function () {

            firebase.auth().signInWithEmailAndPassword(email, password).
               then(function () {
                  user = auth.currentUser;
                  console.log(user);
                  uid = user.displayName;
                  console.log(uid);
                  uid = uid.substr(0, uid.lastIndexOf(':'));
                  f = 0;
                  $("#p1").hide();
                  console.log("Success!");


                  f = 0;
                  db.collection("Settings").doc("users").onSnapshot(function (doc) {
                     tmp = doc.data().admin;
                     tmp2 = doc.data().nonadmin;
                     console.log(tmp + ' ' + tmp2);

                     tmp.forEach(function (element) {
                        if (uid == element)
                           f = 1;

                     });

                     tmp2.forEach(function (element2) {
                        if (uid == element2)
                           f = 2;

                     });

                     $('body').loadingModal('hide');
                     if (f == 1)
                        window.location.href = "dash-Admin.html";
                     else if (f == 2)
                        window.location.href = "dash-xxx22.html";
                     else
                        swal("Try Again!", "User not Registered !", "error");
                  });

               })
               .catch(function (error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  console.log(error);
                  errorCode = errorCode.replace("auth/", "");
                  var errorMessage = error.message;
                  // ...
                  $('body').loadingModal('hide');
                  swal(errorCode, errorMessage, "error");

               });


         })
         .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            errorCode = errorCode.replace("auth/", "");
            var errorMessage = error.message;
            // ...
            $('body').loadingModal('hide');
            swal(errorCode, errorMessage, "error");
         });

   });
});