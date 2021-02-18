
// Initial Overlay starts
$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce'
});

// Initialize Cloud Firestore through Firebase

var objj = {};
var general, balances, details, details2, user, arr1, arr2, arr3, str22, str33, str44, temp99;

$('#myModal2').modal({ backdrop: 'static', keyboard: false });

var general, balances;
//general db
db.collection("Settings").doc("users")
   .onSnapshot(function (doc) {
      general = doc.data();
      console.log(general);



      db.collection("Settings").doc("Accounts")
         .onSnapshot(function (doc) {
            balances = doc.data();
            console.log(balances);


            //// credentials part

            let credentials = sessionStorage.getItem('uid2') + sessionStorage.getItem('pass2');


            if (credentials == balances.keywrd) {

               $('#myModal2').modal('hide');

            }
            replacelist("nocdel", balances["Companies"]);
            replacelist("comprounit1", balances["Productunit"]);
            replacelist("comprounit2", balances["Productunit"]);
            replacelist("comprounit3", balances["Productunit"]);

            setTimeout(function () { $('body').loadingModal('hide'); }, 3000);

         });

   });

arr1 = []; arr2 = []; arr3 = [];
str22 = str33 = str44 = '';


$(document).ready(function () {

   $("#btnaccess").click(function () {
      var uid, pass, sum;
      uid = $("#uid2").val();
      pass = $("#pass2").val();
      sum = uid + pass;

      if (sum == balances.keywrd) {

         sessionStorage.setItem('uid2', uid)
         sessionStorage.setItem('pass2', pass)
         uid = $("#uid2").val('');
         pass = $("#pass2").val('');
         $('#myModal2').modal('hide');
      }
      else {
         uid = $("#uid2").val('');
         pass = $("#pass2").val('');
         $("#para1").show();
      }

   });



   var optyp, temp, upddt, temp2, temp3;

   f = 1;
   optyp = $("#operatontyp").val();
   upddt = $("#updatedetails").val();
   $("#signup").show();
   $("#operatontyp").change(function () {
      optyp = $("#operatontyp").val();

      if (optyp == 1) {
         $("#signup").show();
         $("#update").hide();
      }
      else if (optyp == 2) {
         $("#signup").hide();
         $("#update").show();
      }
   });
   $("#updatedetails").change(function () {

      upddt = $("#updatedetails").val();
      if (upddt == "userid2") {
         $("#label2").html("User ID");
      }
      else if (upddt == "email2") {
         $("#label2").html("Email");
      }
      else if (upddt == "pass2") {
         $("#label2").html("Password");
      }

   });






   $('#password, #confirm_password').on('keyup', function () {
      if ($('#password').val() == $('#confirm_password').val()) {
         $('#message').html('Passwords Matching').css('color', 'green');
         f = 0;

      } else {
         f = 1;
         $('#message').html('Passwords Not Matching').css('color', 'red');
      }

   });
   $("#f1").submit(function (e) {

      $('body').loadingModal('show');
      e.preventDefault();
      var privilages;

      console.log(optyp);
      if (optyp == 1) {
         var email, password, userid;
         if (f == 0) {

            email = $("#email").val();
            password = $("#password").val();
            userid = $("#userid").val();
            privilages = $("#privileges").val();
            console.log(email + password + userid);
            firebase.auth().createUserWithEmailAndPassword(email, password).then(
               (user) => {
                  // here you can use either the returned user object or       firebase.auth().currentUser. It will use the returned user object
                  console.log("hello there user");
                  console.log(user);

                  if (user) {
                     user = firebase.auth().currentUser;

                     user.updateProfile({
                        displayName: userid + ":" + privilages
                     }).then(
                        (s) => {
                           balances["users"].push(userid);
                           if (privilages == "admin") {
                              general.admin.push(userid);
                           }
                           else if (privilages == "nonadmin") {
                              general.nonadmin.push(userid);
                           }
                           datainsert("Settings/users", general);

                           balances.balancelist[userid + "bal"] = 0;
                           datainsert("Settings/Accounts", balances);
                           swal("Sucessfull", "User Created", "success");
                        }
                     ).catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(error);
                        console.log(errorMessage);

                        $('body').loadingModal('hide');
                        swal(errorCode, errorMessage, "error");
                        // ...
                     });
                  }
               }).catch(function (error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  console.log(errorCode);
                  console.log(errorMessage);

                  $('body').loadingModal('hide');
                  swal(errorCode, errorMessage, "error");
                  // ...
               });
         }
         else if (f == 1) {

            $('body').loadingModal('hide');
            swal("Passwords Don't Match!", "Please retry!", "error");
         }
      }
      else if (optyp == 2) {
         user = firebase.auth().currentUser;
         temp = $("#label2op").val();
         upddt = $("#updatedetails").val();



         if (user != null) {



            temp3 = user.displayName;
            temp2 = temp3.substr(0, temp3.lastIndexOf(':'));
            privilages = temp3.substr(temp3.lastIndexOf(':') + 1, temp3.length - 1);
            console.log(temp3);

            console.log(privilages);
            console.log(upddt);
            if (upddt == "userid2") {
               console.log("uid");

               user.updateProfile({
                  displayName: temp + ':' + privilages
               }).then(function () {

                  if (privilages == "admin") {
                     console.log("admin-update");
                     console.log(temp2);
                     general.admin.splice(general.admin.lastIndexOf(temp2), 1);
                     console.log(general.admin);
                     general.admin.push(temp);
                     console.log(general.admin);
                  }
                  else if (privilages == "nonadmin") {
                     general.nonadmin.splice(general.admin.lastIndexOf(temp2), 1);
                     general.nonadmin.push(temp);
                  }
                  datainsert("Settings/users", general);
                  swal("Successfull!", "Please proceed!", "success");

               }).catch(function (error) {
                  $('body').loadingModal('hide');
                  console.log(error);
               });
            }
            else if (upddt == "email2") {
               user.updateEmail(temp).then(function () {
                  $('body').loadingModal('hide');
                  swal("Update Successfull!", "Please proceed!", "success");
               }).catch(function (error) {
                  $('body').loadingModal('hide');
                  console.log(error);
                  swal(error.code, error.message, "error");
               });
            }
            else if (upddt == "pass2") {
               user.updatePassword(temp).then(function () {
                  $('body').loadingModal('hide');
                  swal("Update Successfull!", "Please proceed!", "success");
               }).catch(function (error) {
                  $('body').loadingModal('hide');
                  console.log(error);
               });
            }

            else if (upddt == "delete") {
               user.delete().then(function () {

                  balances["users"].splice(balances.users.lastIndexOf(temp), 1);
                  delete balances.balancelist[temp + "bal"];

                  if (privilages == "admin") {
                     general.admin.splice(general.admin.lastIndexOf(temp2), 1);

                  }
                  else if (privilages == "nonadmin") {
                     general.nonadmin.splice(general.admin.lastIndexOf(temp2), 1);

                  }
                  datainsert("Settings/users", general);
                  datainsert("Settings/Accounts", balances);
                  setTimeout(function () { window.location.href = "LOGIN.html"; }, 1500);

               }).catch(function (error) {
                  $('body').loadingModal('hide');
                  console.log(error);
                  swal("User Deleation Un-Successfull!", error.message, "error");
               });
            }

            else if (upddt == "upgrade") {




               if (privilages == "admin") {
                  general.admin.splice(general.admin.lastIndexOf(temp2), 1);
                  general.nonadmin.push(temp2);
                  privilages = "nonadmin";
               }
               else if (privilages == "nonadmin") {
                  general.nonadmin.splice(general.nonadmin.lastIndexOf(temp2), 1);
                  general.admin.push(temp2);
                  privilages = "admin";
               }
               user.updateProfile({
                  displayName: temp2 + ':' + privilages
               }).then(function () {
                  datainsert("Settings/users", general);
               }).catch(function (error) {
                  $('body').loadingModal('hide');
                  console.log(error);
               });




            }
         }

         else {
            $('body').loadingModal('hide');
            swal("User Sign In Required !", "First SignIn the user to get respective updates ", "error");
         }

      }
   })

   $("#comadd").submit(function (e) {
      e.preventDefault();
      var name, gstin, comemail, comphone, address, bnkdetails, mdb, fcb, bankbal, lastbos, lastinv, details, products, expenses, expensesadmin, procurement, procurementadmin, inflow, inflowadmin, fcbbal, mdbbal, positions, suppliers, website, positionsadmin, protype;


      name = $("#comname").val().toUpperCase();
      gstin = $("#comgstin").val().toUpperCase();
      comemail = $("#comemail").val();
      comphone = $("#comphone").val();
      address = $("#comaddress").val();
      website = $("#comaddress").val();
      mdbbal = parseFloat($("#commdbbal").val());
      fcbbal = parseFloat($("#comfcbbal").val());


      expenses = $("#comexpense").val().split(',');
      console.log(expenses);
      expensesadmin = $("#comexpenseadmin").val().split(',');
      // procurement=$("#compro").val().split(',');
      //procurementadmin=$("#comproadmin").val().split(',');
      inflow = $("#cominflow").val().split(',');
      inflowadmin = $("#cominflowadmin").val().split(',');
      positions = $("#compositions").val().split(',');
      suppliers = $("#comsuppliers").val().split(',');
      positionsadmin = $("#compositionsadmin").val().split(',');
      bnkdetails = {
         accountno: $("#combankaccno").val(),
         ifsc: $("#combankifsc").val(),
         name: $("#combankname").val(),


      };

      details = {
         address: address,
         bankdetails: bnkdetails,
         email: comemail,
         gstin: gstin,
         lastbillno: parseInt($("#comlastbos").val()),
         lastgstinvno: parseInt($("#comlastgst").val()),
         name: name,
         phone: comphone

      };


      console.log(details);

      change(name, "Procurement", arr1);
      change(name, "Procurementadmin", arr2);
      change(name, "Products", arr3);
      datainsert("Settings/invoicing/Companies/" + name, details);
      balances["Companies"].push(name);
      balances.Expense[name] = expenses;
      balances.Expenseadmin[name] = expensesadmin;
      balances.Inflow[name] = inflow;
      balances.inflowadmin[name] = inflowadmin;
      balances.Positions[name] = positions;
      balances.Positionsadmin[name] = positionsadmin;

      balances.orderid[name] = 0;

      balances.Suppliers[name] = suppliers;

      balances.balancelist[shorten(name) + 'bal'] = mdbbal;
      balances.balancelist['f' + shorten(name) + 'bal'] = fcbbal;
      console.log(balances);


      datainsert("Settings/Accounts", balances);

   });


   $("#pro1add").click(function () {
      var name, qty, unit, unitprice, stockprice, hsn, protype;
      name = $("#comproname1").val().toUpperCase();
      qty = parseInt($("#comproqty1").val());
      unit = $("#comprounit1 option:selected").val();

      protype = $("#comprotype1 option:selected").val();
      unitprice = parseFloat($("#comprounitprice1").val());
      stockprice = parseFloat($("#comprostockvalue1").val());
      hsn = parseInt($("#comprohsn1").val());

      str22 = `<tr><th>${name}</th>
      <th>${hsn}</th>
      <th>${qty}</th>
      <th>${unit}</th>
      <th>${unitprice}</th>  
      <th>${stockprice}</th> </tr>`;
      temp99 = { name: name, qty: qty, hsn: hsn, unit: unit, unitprice: unitprice, value: stockprice, type: protype };
      console.log(temp99);
      arr1.push(temp99);

      console.log(arr1);
      $("#addtbl1").append(str22);
      $("#tab1").show();
      $("#reset1").show();

   });

   $("#pro2add").click(function () {
      var name, qty, unit, unitprice, stockprice, hsn;
      name = $("#comproname2").val().toLocaleUpperCase();
      hsn = parseInt($("#comprohsn2").val());
      qty = parseInt($("#comproqty2").val());
      unit = $("#comprounit2 option:selected").val();
      protype = $("#comprotype2 option:selected").val();
      unitprice = parseFloat($("#comprounitprice2").val());
      stockprice = parseFloat($("#comprostockvalue2").val());

      str33 = `<tr><th>${name}</th>
      <th>${hsn}</th>
      <th>${qty}</th>
      <th>${unit}</th>
      <th>${unitprice}</th>  
      <th>${stockprice}</th> </tr>`;
      arr2.push({ name: name, qty: qty, hsn: hsn, unit: unit, unitprice: unitprice, value: stockprice, type: protype });
      console.log(arr2);

      $("#addtbl2").append(str33);


      $("#tab2").show();
      $("#reset2").show();

   });
   $("#pro3add").click(function () {
      var name, qty, unit, unitprice, stockprice, hsn;
      name = $("#comproname3").val().toUpperCase();
      hsn = parseInt($("#comprohsn3").val());
      qty = parseInt($("#comproqty3").val());
      unit = $("#comprounit3 option:selected").val();
      protype = $("#comprotype3 option:selected").val();
      unitprice = parseFloat($("#comprounitprice3").val());
      stockprice = parseFloat($("#comprostockvalue3").val());

      str44 = `<tr><th>${name}</th>
          <th>${hsn}</th>
      <th>${qty}</th>
      <th>${unit}</th>
      <th>${unitprice}</th>  
      <th>${stockprice}</th> </tr>`;
      arr3.push({ name: name, qty: qty, hsn: hsn, unit: unit, unitprice: unitprice, value: stockprice, type: protype });


      $("#addtbl3").append(str44);

      console.log(arr3);

      $("#tab3").show();
      $("#reset3").show();

   });

   $("#reset1").click(function () {
      arr1 = []; str22 = '';
      $("#reset1").hide();
      $("#addtbl1").html('');
      $("#comproqty1").val('');
      $("#comprohsn1").val('');
      $("#comproname1").val('');
      $("#comprounitprice1").val('');
      $("#comprostockvalue1").val('');
      $("#tab1").hide();
   });
   $("#reset2").click(function () {

      arr2 = []; str33 = '';
      $("#reset2").hide();
      $("#addtbl2").html('');
      $("#comprohsn2").val('')
      $("#comproname2").val('');
      $("#comproqty2").val('');

      $("#comprounitprice2").val('');
      $("#comprostockvalue2").val('');
      $("#tab2").hide();

   });
   $("#reset3").click(function () {
      arr3 = []; str44 = '';
      $("#reset3").hide();
      $("#addtbl3").html('');
      $("#comproname3").val('');
      $("#comprohsn3").val('');
      $("#comproqty3").val('');

      $("#comprounitprice3").val('');
      $("#comprostockvalue3").val('');
      $("#tab3").hide();

   });

   $("#btndel").click(function () {

      $("#removeco").modal("toggle");
      var name = $("#nocdel option:selected").val();
      db.collection("Settings/invoicing/Companies").doc(name).delete().then(function () {


         console.log(balances["Companies"].lastIndexOf(name));
         balances["Companies"].splice(balances["Companies"].lastIndexOf(name), 1);
         delete balances.Expense[name];
         delete balances.Expenseadmin[name];
         delete balances.Inflow[name];
         delete balances.inflowadmin[name];
         delete balances.Positions[name];
         delete balances.Positionsadmin[name];
         delete balances.Products[name];
         delete balances.Procurement[name];
         delete balances.Procurementadmin[name];


         delete balances.Suppliers[name];

         delete balances.balancelist[shorten(name) + 'bal'];
         delete balances.balancelist['f' + shorten(name) + 'bal'];
         datainsert("Settings/Accounts", balances);
         swal("Successful", "Document successfully deleted", "success");

      }).catch(function (error) {
         console.error("Error removing document: ", error);
      });



   });

})





function todaysdate(nn) {
   var d = new Date();
   var s, t, dd, mm, yy;
   s = t = "";

   yy = d.getFullYear();

   t = (d.getMonth() + 1);
   if (t < 10)
      t = '0' + t;
   mm = t;

   t = d.getDate();
   if (t < 10)
      t = '0' + t;
   dd = t;

   if (nn == 0)
      s = yy + '-' + mm + '-' + dd;
   else if (nn == 2)
      s = dd + '-' + mm + '-' + yy + ':' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
   else if (nn == 3)
      s = yy + '' + mm + dd;
   else if (nn == 4)
      s = d.getTime();


   return s;

}
function shorten(s) {

   s = ' ' + s;
   var t, ch, i;
   t = "";
   for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ch == ' ' && s.charAt(i + 1) != '&')
         t += s.charAt(i + 1);
   }
   console.log(t.toLocaleLowerCase());

   return t.toLocaleLowerCase();

}


function change(coname, str, arr) {
   var tmpp;
   console.log(coname + str + arr);
   arr.forEach(function (element) {
      console.log(element);
      tmpp = element;
      console.log(element.name);

      if (balances[str][coname] == undefined)
         balances[str][coname] = {};
      console.log(element.name);
      balances[str][coname][element.name] = { qty: element.qty, hsn: element.hsn, unit: element.unit, unitprice: element.unitprice, value: element.value, type: element.type };
   });

};

function datainsert(dbextn, arr2) {

   db.doc(dbextn).set(arr2)
      .then(function () {
         $('body').loadingModal('hide');

         console.log("Document written with ID: ");
      })
      .catch(function (error) {
         console.error("Error adding document: ", error);
      });
};

function replacelist(idi, arr) {
   var $el = $("#" + idi);
   $el.empty(); // remove old options
   arr.forEach(function (element) {
      $el.append($("<option></option>").text(element));
   });
};

