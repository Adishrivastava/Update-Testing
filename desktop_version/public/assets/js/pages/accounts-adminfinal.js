
//Preloading on start   
var obj1, obj2, obj, s1, tablesource, currentUid, user, privilages, email;

// Initial Overlay starts
$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce'
});

// Track the UID of the current user.

currentUid = null;
firebase.auth().onAuthStateChanged(function (user2) {

   console.log(user2);

   var temp3;
   if (user2 && user2.uid != currentUid) {
      email = user2.email;
      currentUid = user2.uid;
      temp3 = user2.displayName;
      $("#usermsg").html(temp3);

      user = temp3.substr(0, temp3.lastIndexOf(':'));

      privilages = temp3.substr(temp3.lastIndexOf(':') + 1, temp3.length - 1);

      console.log(user);
      console.log(privilages);
      if (privilages == "nonadmin")
         window.location.href = "dash-xxx22.html";
      console.log(user2);

   } else {
      // Sign out operation. Reset the current user UID.  
      currentUid = null;
      console.log("no user signed in");
   }
});


$('#myModal2').modal({ backdrop: 'static', keyboard: false });





//Initialize firestore
db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      obj1 = doc.data();
      //s1=Object.values(doc.data().supplierlist);
      //// credentials part

      let credentials = sessionStorage.getItem('uid2') + sessionStorage.getItem('pass2');

      console.log(credentials);
      console.log(obj1.keywrd);

      if (credentials == obj1.keywrd) {
         $('#myModal2').modal('hide');
      }

      console.log(obj1);
      replacelist("noc", obj1.Companies);

      obj = obj1.balancelist;
      $("#invav select").val("No");
      $("#invav").hide();
      $("#expenseextra").hide();
      console.log($("#noc option:selected").val());
      //Buttom Table

      db.collection("Accounts/mdb/main").orderBy("date", "desc").limit(4)
         .onSnapshot(function (querySnapshot) {
            tablesource = [];
            querySnapshot.forEach(function (doc) {
               tablesource.push(doc.data());
            });
            console.log(tablesource);
            $('#lasttrans').DataTable().destroy();
            var table = $('#lasttrans').DataTable({
               data: tablesource,
               "destroy": true,
               searching: false,
               paging: false,
               info: false,
               "columns": [
                  { data: "tid" },
                  { data: "noc" },
                  { data: "user" },
                  { data: "expensehead" },
                  { data: "amount" },
                  { data: "description" }


               ]
            });

         });


      replacelist("transtype", obj1.Inflow[$("#noc option:selected").val()]);
      s1 = obj1.Suppliers[$("#noc option:selected").val()];
      autocom(s1);

      $('body').loadingModal('hide');
      //    });



      //    });
   });




$(document).ready(function () {
   $("#other11").show();
   v = $("#transtype option:selected").val();
   $('#invdt').datepicker({
      format: "dd/mm/yyyy",
      autoclose: true,
      todayHighlight: true,
      orientation: 'bottom'
   });

   var s, d, t, s1, s2, f1, temp3, usertyp, v;



   var v2 = "";



   $("#btnaccess").click(function () {
      var uid, pass, sum;
      uid = $("#uid2").val();
      pass = $("#pass2").val();
      sum = uid + pass;

      if (sum == obj1.keywrd) {
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


   $("#noc").change(function () {
      //on change set to set trans nature to inflow
      $('body').loadingModal('show');
      $("#transnature").val("Inflow");
      $("#other11").show();
      $("#invav select").val("No");
      $("#procureother").hide()
      $("#invav").hide();
      $("#expenseextra").hide();
      console.log($("#noc option:selected").val());
      // db.collection("Settings/invoicing/Companies").where("Name", "==", $("#noc option:selected").val())
      // .onSnapshot(function(querySnapshot) {

      //querySnapshot.forEach(function(doc2) {

      // obj2=doc2.data();
      // console.log(obj2);


      replacelist("transtype", obj1.Inflow[$("#noc option:selected").val()]);
      s1 = obj1.Suppliers[$("#noc option:selected").val()];
      console.log(s1);
      autocom(s1);
      $('body').loadingModal('hide');
      //    });



      //  });   
   });

   $("#transnature").change(function () {
      console.log("Hello");
      var v1 = $("#transnature option:selected").val();
      console.log(v1);
      if (v1 == "Outflow") {
         $("#expensehead").prop('disabled', false);
         $("#sd").prop('disabled', false);
         $("#other11").show();

         var newOptions2 = ["Expense", "Procurement", "Bank Deposit", "Expenseadmin", "Procurementadmin"];

         $("#expenseextra").show();
         $("#invav").show();
         $("#exleb").html("Expense Head");
         $("#expensehead").prop('disabled', false);
         $("#sd").prop('disabled', false);

         replacelist("expensehead", obj1.Expense[$("#noc option:selected").val()]);

      }
      else if (v1 == "Inflow") {
         $("#other11").show();
         $("#procureother").hide();
         $("#invav select").val("No");
         $("#invav").hide();
         $("#expenseextra").hide();
         $("#add").hide();
         var newOptions2 = obj1.Inflow[$("#noc option:selected").val()];


      }
      else if (v1 == "Inflow-Admin") {
         $("#other11").show();
         $("#procureother").hide();
         $("#invav select").val("No");
         $("#invav").hide();
         $("#expenseextra").hide();
         $("#add").hide();
         var newOptions2 = obj1.inflowadmin[$("#noc option:selected").val()];


      }
      replacelist("transtype", newOptions2);
   });

   $("#transtype").change(function () {
      console.log("Hello there");
      v = $("#transtype option:selected").val();

      console.log(v);




      if (v === "Expense") {

         $("#expenseextra").show();
         $("#exleb").html("Expense Head");
         $("#expensehead").prop('disabled', false);
         $("#sd").prop('disabled', false);
         $("#other11").show();
         $("#procureother").hide();
         var newOptions = obj1.Expense[$("#noc option:selected").val()];
         replacelist("expensehead", newOptions);

      }
      else if (v === "Expenseadmin") {

         $("#expenseextra").show();
         $("#exleb").html("Expense Head");
         $("#expensehead").prop('disabled', false);
         $("#sd").prop('disabled', false);
         $("#other11").show();
         $("#procureother").hide();
         var newOptions = obj1.Expenseadmin[$("#noc option:selected").val()];
         replacelist("expensehead", newOptions);

      }
      else if (v === "Procurement") {
         $("#invav").show();
         $("#expenseextra").show();
         $("#exleb").html("Procurement Head");
         $("#expensehead").prop('disabled', false);
         $("#sd").prop('disabled', false);
         $("#other11").hide();
         $("#procureother").show();
         var newOptions = Object.keys(obj1.Procurement[$("#noc option:selected").val()]);
         setTimeout(function () {
            $("#qty22").attr("placeholder", "Quantity in " + obj1.Procurement[$("#noc option:selected").val()][$("#expensehead option:selected").val()]["unit"]);
         }, 1500);
         replacelist("expensehead", newOptions);

      }
      else if (v === "Procurementadmin") {
         $("#invav").show();
         $("#expenseextra").show();
         $("#exleb").html("Procurement Head");
         $("#expensehead").prop('disabled', false);
         $("#sd").prop('disabled', false);
         $("#other11").hide();
         $("#procureother").show();
         var newOptions = Object.keys(obj1.Procurementadmin[$("#noc option:selected").val()]);
         $("#qty22").attr("placeholder", "Quantity in " + obj1.Procurementadmin[$("#noc option:selected").val()][$("#expensehead option:selected").val()]["unit"]);

         replacelist("expensehead", newOptions);

      }
      else {
         $("#expenseextra").hide();
         $("#other11").show();
         $("#procureother").hide();
      }

   });

   $("#expensehead").change(function () {
      if (v == "Procurement")
         $("#qty22").attr("placeholder", "Quantity in " + obj1.Procurement[$("#noc option:selected").val()][$("#expensehead option:selected").val()]["unit"]);

      if (v == "Procurementadmin")
         $("#qty22").attr("placeholder", "Quantity in " + obj1.Procurementadmin[$("#noc option:selected").val()][$("#expensehead option:selected").val()]["unit"]);
   });


   //invoice expand
   $("#invoiceavail").change(function () {
      console.log("Hello there");
      var v = $("#invoiceavail option:selected").val();

      console.log(v);
      if (v === "Yes")
         $("#add").show();
      else
         $("#add").hide();


   });

   $("#myform1").submit(function (e) {
      e.preventDefault();
      $('body').loadingModal('show');
      var noc = $("#noc option:selected").val();


      var transid = todaysdate(2);
      console.log(transid);
      var noc2 = shorten(noc).toLocaleLowerCase();
      var tn = $("#transnature  option:selected").val();
      var typ = $("#transtype option:selected").val();
      var expensehead = $("#expensehead option:selected").val();
      var amt = parseFloat($("#amt").val());
      if (typ != "Procurement" || typ != "Procurementadmin")
         var des = $("#description").val();
      else
         var des = $("#description22").val();
      var date = $.now();
      var inv = $("#invav option:selected").val();
      var gstav = $("#slrgstin").val();
      var supplier = $("#sd").val();
      console.log(supplier);
      if (tn == "Inflow") {

         console.log(noc);
         if (typ == "Bank Withdrawal") {
            details =
            {
               tid: transid,
               date: date,
               noc: noc,
               perticulars: "From Bank Account",
               description: des,
               vouchartyp: "Contra",
               bankdebit: "",
               cashdebit: amt,
               bankcredit: amt,
               cashcredit: "",
               balance: getandupdate('f' + noc2 + "bal", amt, 1),
               user: user
            };

            datainsert("Accounts/fcb/main/" + transid, details);
         }
         else {
            details =
            {
               tid: transid,
               date: date,
               noc: noc,
               expensehead: tn + ':' + typ,
               description: des,
               user: user,
               amount: amt,
               balance: getandupdate(noc2 + "bal", amt, 1),
               masterbalance: getandupdate("masterbalance", amt, 1),
               userbal: getandupdate(user + 'bal', amt, 1)


            };
            datainsert("Accounts/mdb/main/" + transid, details);

         }
      }
      else if (tn == "Outflow") {

         if (typ == "Bank Deposit") {
            details =
            {
               tid: transid,
               date: date,
               noc: noc,
               perticulars: "To Bank Account",
               vouchartyp: "Contra",
               bankdebit: amt,
               cashdebit: "",
               bankcredit: "",
               cashcredit: amt,
               balance: getandupdate('f' + noc2 + "bal", -amt, 1),
               user: user
            };
            datainsert("Accounts/fcb/main/" + transid, details);
         }
         else {
            details =
            {
               tid: transid,
               date: date,
               noc: noc,
               expensehead: "Outflow:" + typ + ":" + expensehead,
               description: des,
               supplier: supplier,
               user: user,
               amount: amt,
               balance: getandupdate(noc2 + "bal", -amt, 1),
               masterbalance: getandupdate("masterbalance", -amt, 1),
               userbal: getandupdate(user + 'bal', -amt, 1)

            };
            //update the stock here

            if (typ == "Procurement" || typ == "Procurementadmin") {

               obj1[typ][noc][expensehead]["qty"] += parseFloat($("#qty22").val());
               obj1[typ][noc][expensehead]["value"] += amt;

               details2 = {
                  time: todaysdate(4),
                  noc: noc,
                  stock: obj1.Products[noc],
                  prostock: obj1.Procurement[noc],
                  type1: "Procurement",
                  noc: noc,
                  type2: "Reduction",
                  item: expensehead,
                  massage: expensehead + "reduced to quantity:" + obj1[typ][noc][expensehead]["qty"] + "value updated to:" + obj1[typ][noc][expensehead]["value"]

               };
               datainsert("Settings/Accounts", obj1);
               datainsert("Accounts/stockregister/" + noc + '/' + todaysdate(2), details2);

            }

            datainsert("Accounts/mdb/main/" + transid, details);

            if (inv == "Yes") {
               var s = "To : " + expensehead + " A.C\n" + des;
               var bankinfo = $("#paymode").val();
               console.log(bankinfo);
               var bal1 = getandupdate('f' + noc2 + "bal", -amt, 1);
               if (bankinfo == "Cash") {
                  details =
                  {
                     tid: transid,
                     date: date,
                     noc: noc,
                     perticulars: s,
                     vouchartyp: "Payment",
                     bankdebit: "",
                     cashdebit: "",
                     bankcredit: "",
                     cashcredit: amt,
                     balance: bal1,
                     user: user
                  };
               }
               else if (bankinfo == "Bank") {
                  details =
                  {
                     tid: transid,
                     date: date,
                     noc: noc,
                     perticulars: s,
                     vouchartyp: "Payment",
                     bankdebit: "",
                     cashdebit: "",
                     bankcredit: amt,
                     cashcredit: "",
                     balance: bal1,
                     user: user
                  };
               }
               datainsert("Accounts/fcb/main/" + transid, details);
               if (gstav != "N/A") {
                  console.log("inv available" + s);
                  details =
                  {
                     tid: transid,
                     date: date,
                     noc: noc,
                     description: s,
                     gstin: gstav,
                     invoiceno: $("#invno").val(),
                     invoicedate: $("#invdt").val(),
                     placeofsupply: $("#placeofsupply").val(),
                     expitc: $("#expitc").val(),
                     balance: bal1
                  };
                  datainsert("Accounts/fpurchase/main/" + transid, details);
               }
            }
         }
      }




      //Set Batches here 1.update balance -obj1(settings/accounts)+2.Update data insert db entry



      //update the bal list array-
      db.collection("Settings").doc("Accounts").update({
         balancelist: obj
      })
         .then(function () {
            $("#myform1").trigger("reset");
            $("#invav select").val("No");
            $("#invav").hide();
            $("#expenseextra").hide();
            $("#add").hide();
            console.log("Document successfully updated!");
            $('body').loadingModal('hide');
            swal("Transaction Recorded!", "You may proceed!", "success");



         })
         .catch(function (error) {
            // The document probably doesn't exist.
            $('body').loadingModal('hide');
            console.error("Error updating document: ", error);
            swal("Error!", error, "success");
         });
   });

});
function shorten(s) {

   s = ' ' + s;
   var t, ch, i;
   t = "";
   for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ch == ' ' && ch != '&')
         t += s.charAt(i + 1);
   }
   return t;
}
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
function datainsert(dbextn, arr2) {


   db.doc(dbextn).set(arr2)
      .then(function () {
         console.log("Document written with ID: ");
      })
      .catch(function (error) {
         console.error("Error adding document: ", error);
      });
};

function getandupdate(fieldname, amount, flag) {
   obj[fieldname] += parseInt(amount);
   console.log(obj[fieldname]);
   if (flag == 1)
      return obj[fieldname];

}
function replacelist(idi, arr) {
   var $el = $("#" + idi);
   $el.empty(); // remove old options
   arr.forEach(function (element) {
      $el.append($("<option></option>").text(element));
   });
};
//autococmplete push here


function autocom(s1) {
   console.log(s1);
   $("#sd").autocomplete({
      source: function (request, response) {
         response($.ui.autocomplete.filter(s1, request.term));
      },
      change: function (event, ui) {
         $("#add2").toggle(!ui.item);
      }
   });

   $("#add2").on("click", function () {
      s1.push($("#sd").val());
      console.log(s1);
      obj1.Suppliers[$("#noc option:selected").val()] = s1;
      $(this).hide();
   });
};



