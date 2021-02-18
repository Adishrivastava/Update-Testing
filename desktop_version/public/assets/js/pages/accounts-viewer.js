$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce'
});

$('#myModal22').modal({ backdrop: 'static', keyboard: false });



//PRE-lOAD Noc from db--get this directly from settings/accounts.db

var obj1, noc2, companyarr, userarr, currentUid, privilages, email, tmp009, ofc, ifc;

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
      console.log(user2);
      user = temp3.substr(0, temp3.lastIndexOf(':')) || "null";
      console.log(user);
      privilages = temp3.substr(temp3.lastIndexOf(':') + 1, temp3.length - 1);

      if (privilages == "nonadmin")
         window.location.href = "dash-xxx22.html";
      console.log(privilages);

   } else {
      // Sign out operation. Reset the current user UID.  
      currentUid = null;
      console.log("no user signed in");
   }
});


db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      obj1 = doc.data();
      console.log(obj1);

      console.log(obj1.keywrd);

      replacelist("noc", obj1.Companies);
      $('body').loadingModal('hide');

      //// credentials part

      let credentials = sessionStorage.getItem('uid2') + sessionStorage.getItem('pass2');


      if (credentials == obj1.keywrd) {
         console.log("eher")
         $('#myModal22').modal('hide');

      }

      noc2 = $("#noc option:selected").val();
      console.log(noc2);

      if (obj1['Procurement'][noc2] == undefined) {

         $("#stock-details").val("Products");

         replacelist("stock-details", Object.keys(obj1['Products'][noc2]));
      }
      else {
         $("#stock-details").val("Procurement");

         replacelist("stock-details", Object.keys(obj1['Procurement'][noc2]));

      }

   });

//Start here
companyarr = [
   "Formal CB", "Inward Invoices", "Stock Register", "Stock Register Item Specific", "Journal", "LEDGER-INFLOW", "LEDGER-OUTFLOW", "LEDGER-OUTFLOW FILTER BY SUPPLIER", "Profit and Loss Statement", "Invoice All", "Invoice-Retail", "Invoices-B2B", "Bill of Supplies", "Other Invoices", "Zoho Invoices"];
userarr = ["Journal",
   "LEDGER-INFLOW-user", "LEDGER-OUTFLOW-user"];
replacelist("doctype", companyarr);

$(document).ready(function () {


   $('#datepicker').datepicker({
      autoclose: true,
      todayHighlight: true
   });
   $('#datepicker2').datepicker({
      autoclose: true,
      todayHighlight: true
   });
   $('#datepicker3').datepicker({
      autoclose: true,
      todayHighlight: true
   });
   $('#datepicker4').datepicker({
      autoclose: true,
      todayHighlight: true
   });

   $("#datepicker4").change(function () {
      if ($("#datepicker3").val() == '') {
         $("#datepicker4").val('');
         swal("enter the start date first", "Re-try", "error");
      }
      else if (Date.parse($("#datepicker4").val()) <= Date.parse($("#datepicker3").val())) {
         $("#datepicker4").val('');
         swal("start date can't come after end date!", "Re-Try", "error");


      }
   });

   $("#datepicker2").change(function () {
      if ($("#datepicker").val() == '') {
         $("#datepicker2").val('');
         swal("enter the start date first", "Re-try", "error");
      }
      else if (Date.parse($("#datepicker2").val()) <= Date.parse($("#datepicker").val())) {
         $("#datepicker2").val('');
         swal("start date can't come after end date!", "Re-Try", "error");


      }
   });

   var s1, f1, v1, v2, tmp, start, end, suplier, keywrd, noc;


   var v2 = "";


   $("#noc").change(function () {

      noc2 = $("#noc option:selected").val();

      console.log($("#doctype").val());

      if (obj1['Procurement'][noc2] == undefined) {

         $("#stock-type").val("Products");

         replacelist("stock-details", Object.keys(obj1['Products'][noc2]));
      }
      else {
         $("#stock-type").val("Procurement");

         replacelist("stock-details", Object.keys(obj1['Procurement'][noc2]));

      }
      $("#doctype").val("Journal");
      $("#iflow").hide();
      $("#spl").hide();
      $("#oflow").hide();
      $("#stockoptions").hide();
      $("#ofd").hide();
      $("#pandl").hide();
      $("#stockview").hide();
      $("#mdbcb").show();



   });

   $("#tydoc").change(function () {
      if ($("#tydoc option:selected").val() == "Individual") {

         replacelist("noc", obj1.users);
         $("#noclabel").html("Name of User");
         $("#mdbcb").show();
         $("#pandl").hide();
         $("#stockview").hide();
         $("#invoicing").hide();
         $("#zohoinvoicing").hide();
         replacelist("doctype", userarr);



      }
      else {

         replacelist("noc", obj1.Companies);

         $("#noclabel").html("Name of Concern");
         replacelist("doctype", companyarr);
      }
   });



   $("#stock-type").change(function () {
      v2 = $("#stock-type option:selected").val();


      console.log(v2);
      console.log(obj1[v2][noc2]);

      if (obj1[v2][noc2] == undefined && v2 == "Procurement") {
         swal("Procurement data not available", "error");
         v2 = "Products";
         $("#stock-type").val("Products");
      }

      else if (obj1[v2][noc2] == undefined && v2 == "Products") {
         swal("Products data not available", "error");
         v2 = "Procurement";
         $("#stock-type").val("Procurement");
      }


      replacelist("stock-details", Object.keys(obj1[v2][noc2]));


   });


   $("#doctype").change(function () {
      noc2 = $("#noc option:selected").val();
      v1 = $("#doctype option:selected").val();
      if (v1 == "LEDGER-INFLOW") {
         $("#formalcb").hide();
         $("#mdbcb").show();
         $("#pandl").hide();
         $("#invoicing").hide();
         $("#zohoinvoicing").hide();
         $("#stockview").hide();

         console.log("Inflow");
         $("#iflow").show();

         replacelist("iflow-type", obj1.Inflow[noc2]);

         $("#oflow").hide();
         $("#stockoptions").hide();
         $("#spl").hide();
      }
      else if (v1 == "LEDGER-OUTFLOW") {
         $("#formalcb").hide();
         $("#mdbcb").show();
         $("#pandl").hide();
         $("#invoicing").hide();
         $("#zohoinvoicing").hide();
         $("#outflow-type").val("Bank Withdrawal");
         $("#stockview").hide();
         $("#iflow").hide();
         $("#spl").hide();
         $("#oflow").show();
         $("#stockoptions").hide();
         $("#ofd").hide();
         $("#outflow-type").change(function () {
            v2 = $("#outflow-type option:selected").val();
            if (v2 == "Bank Withdrawal") {
               $("#ofd").hide();
            }
            else {
               $("#ofd").show();
               console.log(v2);
               if (v2 == "Procurement")
                  replacelist("outflow-details", Object.keys(obj1[v2][noc2]));
               else
                  replacelist("outflow-details", obj1[v2][noc2]);
            }
         });

      }
      else if (v1 == "LEDGER-OUTFLOW FILTER BY SUPPLIER") {
         $("#formalcb").hide();
         $("#mdbcb").show();
         $("#pandl").hide();
         $("#invoicing").hide();
         $("#zohoinvoicing").hide();
         $("#stockview").hide();

         $("#outflow-type").val("Bank Withdrawal");
         $("#iflow").hide();
         $("#oflow").show();
         $("#stockoptions").hide();
         $("#spl").hide();
         $("#ofd").hide();
         $("#outflow-type").change(function () {
            v2 = $("#outflow-type option:selected").val();
            if (v2 == "Bank Withdrawal") {
               $("#ofd").hide();
               $("#spl").hide();
            }
            else {
               $("#ofd").show();
               $("#spl").show();
               if (v2 == "Procurement")
                  replacelist("outflow-details", Object.keys(obj1[v2][noc2]));
               else
                  replacelist("outflow-details", obj1[v2][noc2]);
               autocom(obj1.Suppliers[noc2]);
            }

         });

      }

      else if (v1 == "Stock Register Item Specific") {
         $("#mdbcb").hide();
         $("#formalcb").hide();
         $("#stockview").show();
         $("#stockoptions").show();
         $("#pandl").hide();
         $("#invoicing").hide();
         $("#zohoinvoicing").hide();
         $("#iflow").hide();
         $("#spl").hide();
         $("#oflow").hide();

         $("#ofd").hide();

      }

      else {

         $("#iflow").hide();
         $("#spl").hide();
         $("#oflow").hide();
         $("#ofd").hide();
         $("#stockoptions").hide();


         if (v1 == "Journal") {
            $("#formalcb").hide();
            $("#mdbcb").show();
            $("#pandl").hide();
            $("#invoicing").hide();
            $("#stockview").hide();
            $("#zohoinvoicing").hide();
         }
         else if (v1 == "Formal CB") {
            $("#formalcb").show();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").hide();
            $("#stockview").hide();
            $("#zohoinvoicing").hide();
         }
         else if (v1 == "Inward Invoices") {
            $("#formalcb").show();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").hide();
            $("#zohoinvoicing").hide();
            $("#stockview").hide();
            //need to create the gst parts

         }
         else if (v1 == "Profit and Loss Statement") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").show();
            $("#invoicing").hide();
            $("#zohoinvoicing").hide();
            $("#stockview").hide();
         }



         else if (v1 == "Invoice-Retail") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").show();
            $("#zohoinvoicing").hide();
            $("#stockview").hide();
         }

         else if (v1 == "Invoices-B2B") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").show();
            $("#zohoinvoicing").hide();
            $("#stockview").hide();
         }

         else if (v1 == "Invoice All") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").show();
            $("#zohoinvoicing").hide();
            $("#stockview").hide();
         }
         else if (v1 == "Zoho Invoices") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").hide();
            $("#zohoinvoicing").show();
            $("#stockview").hide();
         }
         else if (v1 == "Other Invoices") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#invoicing").show();
            $("#zohoinvoicing").hide();
            $("#stockview").hide();
         }

         else if (v1 == "Bill of Supplies") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#pandl").hide();
            $("#zohoinvoicing").hide();
            $("#invoicing").show();
            $("#stockview").hide();
         }

         else if (v1 == "Stock Register" || v1 == "Stock Register Item Specific") {
            $("#formalcb").hide();
            $("#mdbcb").hide();
            $("#stockview").show();
            $("#invoicing").hide();
            $("#zohoinvoicing").hide();
            $("#pandl").hide();
         }



      }

   });


   $("#btnaccess").click(function () {
      var uid, pass, sum;
      uid = $("#uid2").val();
      pass = $("#pass2").val();
      sum = uid + pass;

      if (sum == obj1.keywrd) {

         sessionStorage.setItem('uid2', uid);
         sessionStorage.setItem('pass2', pass);

         uid = $("#uid2").val('');
         pass = $("#pass2").val('');
         $('#myModal22').modal('hide');
      }
      else {
         uid = $("#uid2").val('');
         pass = $("#pass2").val('');
         $("#para1").show();
      }


   });







   //Add extras for 1.comes under inflow Ordesr(gst sales-fcb) list-gst 2.non gst 3.formal purchase fcb purchase
   //add p&l& investments




   $("#sbmt1").click(function () {
      noc2 = $("#noc option:selected").val();
      start = parseInt(Date.parse($("#datepicker").val()));
      end = parseInt(Date.parse($("#datepicker2").val()));
      console.log(start + end);
      v1 = $("#doctype option:selected").val();
      console.log(v1);


      var tydoc = $("#tydoc option:selected").val();//Individual

      if (v1 == "LEDGER-INFLOW-user" && tydoc == "Individual") {

         tmp = "Inflow:" + $("#iflow-type option:selected").val();
         keywrd = "Inflow";
         getdata(start, end, "mdb", 11);
      }
      else if (v1 == "LEDGER-OUTFLOW-user" && tydoc == "Individual") {
         tmp = "Outflow:" + v2 + ":" + $("#outflow-details").val();
         //v2 is expense sub header
         keywrd = "Outflow";
         getdata(start, end, "mdb", 11);
      }
      else if (v1 == "Journal" && tydoc == "Individual") {

         getdata(start, end, "mdb", 13);
      }







      else if (v1 == "LEDGER-INFLOW") {

         tmp = "Inflow:" + $("#iflow-type option:selected").val();
         keywrd = tmp;
         getdata(start, end, "mdb", 1);
      }
      else if (v1 == "LEDGER-OUTFLOW") {
         tmp = "Outflow:" + v2 + ":" + $("#outflow-details").val();
         //v2 is expense sub header
         keywrd = tmp;
         getdata(start, end, "mdb", 1);
      }
      else if (v1 == "LEDGER-OUTFLOW FILTER BY SUPPLIER") {
         suplier = $("#supplierk").val();
         tmp = "Outflow:" + v2 + ":" + $("#outflow-details").val();
         keywrd = tmp;
         getdata(start, end, "mdb", 2);
      }
      else if (v1 == "Journal") {

         getdata(start, end, "mdb", 3);

      }

      else if (v1 == "Formal CB")
         getdata(start, end, "fcb", 3);

      //fcb purchases
      else if (v1 == "Inward Invoices") {
         getdata(start, end, "fcb", 4);

         console.log(keywrd);
         //need to create the gst parts

      }
      else if (v1 == "Profit and Loss Statement")

         getdata(start, end, "mdb", 5);



      else if (v1 == "Invoice-Retail") {
         keywrd = "Retail";
         getdata(start, end, "invoices", 6);
      }

      else if (v1 == "Invoices-B2B") {
         keywrd = "Institutional";
         getdata(start, end, "invoices", 7);
      }

      else if (v1 == "Invoice All")

         getdata(start, end, "invoices", 8);
      else if (v1 == "Zoho Invoices")

         getdata(start, end, "invoices", 88);//Zoho Invoices

      else if (v1 == "Other Invoices")

         getdata(start, end, "otherinv", 19);//Other Invoices


      else if (v1 == "Bill of Supplies")

         getdata(start, end, "billofsupply", 9);

      else if (v1 == "Stock Register")

         getdata(start, end, "stockregister", 10);




      else if (v1 == "Stock Register Item Specific")

         getdata(start, end, "stockregister", 18);
      //need to create the gst parts




   });


   $("#f2").submit(function (e) {
      e.preventDefault();
      var dt1, dt2;
      dt1 = parseInt(Date.parse($("#datepicker3").val()));
      dt2 = parseInt(Date.parse($("#datepicker4").val()));

      db.collection("Accounts/" + $("#database").val() + "/main").where("date", ">=", dt1).where("date", "<=", dt2)
         .onSnapshot(function (querySnapshot) {
            var cities = [];
            querySnapshot.forEach(function (doc) {
               db.collection("Accounts/" + $("#database").val() + "/main").doc(doc.id).delete().then(function () {

               }).catch(function (error) {
                  console.error("Error removing document: ", error);
               });
            });
            console.log("successfully deleted");
            $("#f2").trigger("reset");
         });





   });




   function getdata(start, end, dbname, f) {
      var tmp32, exphd, type2;
      start = parseInt(start);
      end = parseInt(end);
      console.log(start + '/n' + end + '/n' + noc2);
      console.log(f);

      if (f == 1) {
         exphd = keywrd.substr(0, keywrd.indexOf(':') - 1);
         db.collection("Accounts/" + dbname + "/main").where("noc", "==", noc2).where("expensehead", "==", keywrd).where("date", ">=", start).where("date", "<=", end).orderBy("date")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {




                  console.log(doc.data());
                  tmp32 = doc.data();
                  if (exphd == "Inflow") {
                     tmp32["credit"] = tmp32.amount;
                     tmp32["debit"] = 0;

                  }
                  else {
                     tmp32["credit"] = 0;
                     tmp32["debit"] = tmp32.amount;


                  }
                  arr.push(tmp32);
               });
               console.log(arr);
               mdbcbdispaly(arr);
            });
      }



      if (f == 11) {

         console.log(11);

         db.collection("Accounts/" + dbname + "/main").where("user", "==", noc2).where("date", ">=", start).where("date", "<=", end).orderBy("date")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {


                  tmp32 = doc.data();

                  exphd = tmp32.expensehead.substr(0, (tmp32.expensehead).indexOf(':'));
                  console.log(exphd);
                  console.log(keywrd);






                  if (exphd == "Inflow" && exphd == keywrd) {
                     tmp32["credit"] = tmp32.amount;
                     tmp32["debit"] = 0;

                     arr.push(tmp32);

                  }
                  else if (exphd == "Outflow" && exphd == keywrd) {
                     tmp32["credit"] = 0;
                     tmp32["debit"] = tmp32.amount;

                     arr.push(tmp32);
                  }



               });
               console.log(arr);
               mdbcbdispaly(arr);
            });
      }





      else if (f == 2)//when you need to filter for the supplier
      {
         exphd = keywrd.substr(0, keywrd.indexOf(':') - 1);
         var que = db.collection("Accounts/" + dbname + "/main").where("noc", "==", noc2).where("expensehead", "==", keywrd).where("date", ">=", start).where("date", "<=", end);

         que.where("supplier", "==", suplier).orderBy("date").onSnapshot(function (querySnapshot) {
            var arr = [];
            querySnapshot.forEach(function (doc) {

               console.log(doc.data());
               tmp32 = doc.data();
               if (exphd == "Inflow") {
                  tmp32["credit"] = tmp32.amount;
                  tmp32["debit"] = 0;

               }
               else {
                  tmp32["credit"] = 0;
                  tmp32["debit"] = tmp32.amount;


               }
               arr.push(tmp32);
            });
            console.log(arr);
            mdbcbdispaly(arr);

         });

      }
      else if (f == 3)  //other options  
      {
         console.log(3);

         db.collection("Accounts/" + dbname + "/main").where("noc", "==", noc2).where("date", ">=", start).where("date", "<=", end).orderBy("date").onSnapshot(function (querySnapshot) {
            var arr = [];
            querySnapshot.forEach(function (doc) {
               //console.log(doc.data());
               tmp32 = doc.data();
               if (dbname == "mdb") {
                  exphd = tmp32.expensehead.substr(0, (tmp32.expensehead).indexOf(':'));

                  console.log(exphd);

                  if (exphd == "Inflow") {
                     tmp32["credit"] = tmp32.amount;
                     tmp32["debit"] = 0;

                  }
                  else {
                     tmp32["credit"] = 0;
                     tmp32["debit"] = tmp32.amount;


                  }
               }
               arr.push(tmp32);
            });
            console.log(arr);
            mdbcbdispaly(arr);
         });
      }


      else if (f == 13)  //other options  
      {
         console.log(13);

         db.collection("Accounts/" + dbname + "/main").where("user", "==", noc2).where("date", ">=", start).where("date", "<=", end).orderBy("date").onSnapshot(function (querySnapshot) {
            var arr = [];
            querySnapshot.forEach(function (doc) {
               //console.log(doc.data());
               tmp32 = doc.data();

               exphd = tmp32.expensehead.substr(0, (tmp32.expensehead).indexOf(':'));
               console.log(exphd);

               if (exphd == "Inflow") {
                  tmp32["credit"] = tmp32.amount;
                  tmp32["debit"] = 0;

               }
               else {
                  tmp32["credit"] = 0;
                  tmp32["debit"] = tmp32.amount;


               }

               arr.push(tmp32);
            });
            console.log(arr);
            mdbcbdispaly(arr);
         });
      }

      else if (f == 10)  //stock  
      {
         console.log(10);

         db.collection("Accounts/" + dbname + "/" + noc2).where("time", ">=", start).where("time", "<=", end).orderBy("time").onSnapshot(function (querySnapshot) {
            var arr = [];
            querySnapshot.forEach(function (doc) {
               // console.log(doc.data());
               //console.log(exphd);
               tmp32 = doc.data();

               exphd = tmp32.type2;
               if (tmp32.type1 == "Products")
                  delete tmp32.stock.hsn;
               else
                  delete tmp32.stockpro.hsn;


               tmp32["date"] = doc.id;

               arr.push(tmp32);
            });
            console.log(arr);
            stockdisplay(arr);
         });
      }


      //Stock Register Item spacific


      else if (f == 18) {
         console.log(18);

         tmp009 = $("#stock-details option:selected").val();

         db.collection("Accounts/" + dbname + "/" + noc2).where("time", ">=", start).where("time", "<=", end).where("item", "==", tmp009).orderBy("time").onSnapshot(function (querySnapshot) {
            var arr = [];
            querySnapshot.forEach(function (doc) {
               // console.log(doc.data());
               //console.log(exphd);
               tmp32 = doc.data();

               exphd = tmp32.type2;
               if (tmp32.type1 == "Products")
                  delete tmp32.stock.hsn;
               else
                  delete tmp32.stockpro.hsn;


               tmp32["date"] = doc.id;

               arr.push(tmp32);
            });
            console.log(arr);
            stockdisplay(arr);
         });
      }




      else if (f == 4)  //other options  
      {
         console.log(4);
         db.collection("Accounts/" + dbname + "/main").where("noc", "==", noc2).where("date", ">=", start).where("date", "<=", end).orderBy("date").where("vouchartyp", "==", "Payment")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  arr.push(doc.data());
               });
               console.log(arr);
               formalcbdispaly(arr);
            });
      }


      else if (f == 5)  //Options 
      {
         console.log(3);
         var amt, ofcd, ifcd, s1, s2, s3, s4, s5, s6, count66, arr, tmp33, tmp55, arr33;
         count66 = 0; arr = []; arr33 = [];
         tmp33 = {};
         ofcd = {};
         ifcd = {};
         ofc = 0;
         ifc = 0;
         s1 = {}; s2 = {};
         db.collection("Accounts/" + dbname + "/main").where("noc", "==", noc2).where("date", ">=", start).where("date", "<=", end)
            .onSnapshot(function (querySnapshot) {



               querySnapshot.forEach(function (doc) {

                  //     console.log(doc.data());




                  exphd = doc.data().expensehead;
                  type2 = exphd.substr(0, exphd.indexOf(':'));



                  exphd = exphd.substr(exphd.lastIndexOf(':') + 1, exphd.length - 1);
                  //console.log(exphd);


                  amt = parseFloat(doc.data().amount);
                  //console.log(ofc+','+ifc);
                  if (type2 == "Outflow") {


                     ofc += amt;




                     if (ofcd[exphd] == undefined) {
                        ofcd[exphd] = amt;

                     }
                     else if (isNaN(ofcd[exphd]) != true) {
                        ofcd[exphd] += amt;

                     }

                     //console.log(ofcd);

                  }


                  //fix the inflows
                  else if (type2 == "Inflow") {


                     ifc += amt;

                     // Spacific inflow details



                     if (ifcd[exphd] == undefined) {
                        ifcd[exphd] = amt;
                     }
                     else if (isNaN(ifcd[exphd]) != true)
                        ifcd[exphd] += amt;


                     //console.log(ifcd);         

                  }

                  //console.log(ofcd);
                  //console.log(ifcd);

               });
               console.log(ofc + ',' + ifc);
               console.log(ofcd);
               console.log(ifcd);


               if (Object.keys(ofcd).length > Object.keys(ifcd).length) {
                  tmp55 = Object.keys(ifcd);
                  count66 = 0;
                  Object.keys(ofcd).forEach(function (e2) {
                     tmp33 = {};
                     tmp33["debitname"] = e2;
                     tmp33["debitval"] = ofcd[e2];

                     if (tmp55[count66] != undefined) {
                        tmp33["creditname"] = tmp55[count66];
                        tmp33["creditval"] = ifcd[tmp55[count66]];
                        count66++;
                     }

                     else {
                        tmp33["creditname"] = '-';
                        tmp33["creditval"] = 0;
                     }
                     arr33.push(tmp33);
                  });
               }
               else if (Object.keys(ifcd).length > Object.keys(ofcd).length) {
                  tmp55 = Object.keys(ofcd);
                  count66 = 0;
                  Object.keys(ifcd).forEach(function (e2) {
                     tmp33 = {};
                     tmp33["creditname"] = e2;
                     tmp33["creditval"] = ofcd[e2];

                     if (tmp55[count66] != undefined) {
                        tmp33["debitname"] = tmp33[tmp55[count66]];
                        tmp33["debitval"] = ifcd[tmp55[count66]];
                        count66++;
                     }

                     else {
                        tmp33["debitname"] = '-';
                        tmp33["debitval"] = 0;
                     }
                     tmp33["time"] = '-';
                     arr33.push(tmp33);
                  });
               }
               console.log(arr33);
               pandldispaly(arr33);
            });

         //add p&l here
      }

      else if (f == 8)  //All invoices 
      {
         console.log(8);
         db.collection(dbname).where("noc", "==", noc2).where("timest", ">=", start).where("timest", "<=", end).orderBy("timest")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  arr.push(doc.data());
               });
               console.log(arr);
               invoicingdispaly(arr);
            });


      }


      else if (f == 88)  //Zoho invoices 
      {
         console.log(8);
         db.collection(dbname).where("noc", "==", noc2).where("timest", ">=", start).where("timest", "<=", end).orderBy("timest")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  tmp009 = doc.data();
                  tmp009.productlist.forEach(function (doc2) {
                     tmp009["itemname2"] = doc2.product;
                     tmp009["itemdescrip2"] = doc2.description;
                     tmp009["itemtype2"] = "goods";
                     tmp009["hsn2"] = "2415";
                     tmp009["qty2"] = doc2.quantity;
                     tmp009["unit2"] = doc2.unit;
                     tmp009["invstatus2"] = "draft";
                     tmp009["itemprice2"] = doc2.rateperunit

                     arr.push(tmp009);
                  });
               });
               console.log(arr);
               zohoinvoicingdispaly(arr);
            });


      }


      else if (f == 6)  //All Retail 
      {
         console.log(6);
         db.collection(dbname).where("noc", "==", noc2).where("timest", ">=", start).where("timest", "<=", end).where("typeofcustomer", "==", "Retail").orderBy("timest")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  arr.push(doc.data());
               });
               console.log(arr);
               invoicingdispaly(arr);
            });


      }
      else if (f == 7)  //All Institutional
      {
         console.log(7);
         db.collection(dbname).where("noc", "==", noc2).where("timest", ">=", start).where("timest", "<=", end).where("typeofcustomer", "==", "Institutional-Old").where("typeofcustomer", "==", "Institutional-New").orderBy("timest")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  arr.push(doc.data());
               });
               console.log(arr);
               invoicingdispaly(arr);
            });


      }


      else if (f == 9)  //All bill of supply
      {
         console.log(9);
         db.collection(dbname).where("noc", "==", noc2).where("timest", ">=", start).where("timest", "<=", end).orderBy("timest")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  arr.push(doc.data());
               });
               console.log(arr);
               invoicingdispaly(arr);
            });


      }

      else if (f == 19)  //All other Inv
      {
         console.log(9);
         db.collection(dbname).where("noc", "==", noc2).where("timest", ">=", start).where("timest", "<=", end).orderBy("timest")
            .onSnapshot(function (querySnapshot) {
               var arr = [];
               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  arr.push(doc.data());
               });
               console.log(arr);
               invoicingdispaly(arr);
            });


      }



   }




   function shorten(s) {

      s = ' ' + s;
      var t, ch, i;
      t = "";
      for (i = 0; i < s.length; i++) {
         ch = s.charAt(i);
         if (ch == ' ' && ch != '&')
            t += s.charAt(i + 1);
      }
      t = t.toLocaleLowerCase();
      return t;
   }



});

function formalcbdispaly(arr) {
   //Datatables here
   $('#fcbtab').DataTable().destroy();
   var table = $('#fcbtab').DataTable({
      data: arr,
      "destroy": true,
      "columns": [
         { data: "tid" },
         { data: "vouchartyp" },
         { data: "particulars" },
         { data: "cashcredit" },
         { data: "bankcredit" },
         { data: "cashdebit" },
         { data: "bankdebit" },
         { data: "balance" }



      ],
      dom: 'Bfrtip',
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });

}

function mdbcbdispaly(arr) {
   //Datatables here
   $('#mdbtab').DataTable().destroy();
   var table = $('#mdbtab').DataTable({
      data: arr,
      "destroy": true,
      "columns": [
         { data: "tid" },
         { data: "expensehead" },
         { data: "description" },
         { data: "credit" },

         { data: "debit" },

         { data: "balance" }



      ],
      dom: 'Bfrtip',
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });

}

//This needs to be done                
function pandldispaly(arr) {
   //Datatables here
   $('#pandltab').DataTable().destroy();

   $('#pandltab').append("<tfoot> <tr> <th>Total Credit-</th> <th>" + ifc + "</th> <th>Total Debit-</th> <th>" + ofc + "</th>  </tr> </tfoot>");

   var table = $('#pandltab').DataTable({
      data: arr,
      "destroy": true,
      "columns": [

         { data: "creditname" },

         { data: "creditval" },
         { data: "debitname" },
         { data: "debitval" }



      ],
      dom: 'Bfrtip',
      buttons: [
         { extend: 'copyHtml5', footer: true },
         { extend: 'excelHtml5', footer: true },
         { extend: 'csvHtml5', footer: true },
         { extend: 'pdfHtml5', footer: true }
      ]
   });

}


//This needs to be done                
function stockdisplay(arr) {
   //Datatables here
   $('#stocktab').DataTable().destroy();
   var table = $('#stocktab').DataTable({
      data: arr,
      "destroy": true,
      "columns": [
         { data: "date" },
         { data: "item" },
         { data: "type2" },
         { data: "massage" }



      ],
      dom: 'Bfrtip',
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });

}


function invoicingdispaly(arr) {
   //Datatables here
   $('#invtab').DataTable().destroy();
   var table = $('#invtab').DataTable({
      data: arr,
      "destroy": true,
      "columns": [
         { data: "date" },
         { data: "postdelivery.invno" },
         { data: "name" },
         { data: "contactdetails" },

         { data: "placeofsupply" },

         //{data:"productdes"},
         { data: "balance" },
         {
            "data": null,
            "defaultContent": "<button>Regenerate</button>",

         }



      ],
      dom: 'Bfrtip',
      "destroy": true,
      responsive: true,
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });





   $('#invtab tbody').off().on('click', 'button', function () {
      var data = table.row($(this).parents('tr')).data();

      var invtyp = parseInt(data.predelivery.invtyp);
      console.log(invtyp);
      if (typeof (Storage) !== "undefined") {
         console.log("webstorage there");
         localStorage.setItem("datain", JSON.stringify(data));
      } else {
         console.log("Sorry! No Web Storage support..");
         document.cookie = JSON.stringify(data);
      }


      if (invtyp == 1 || invtyp == 5)
         window.open("regenerate-bos-1part.html");
      else if (invtyp == 2 || invtyp == 6)
         window.open("regenerate-gst1part.html");
      else if (invtyp == 3)
         window.open("regen-bos-full.html");
      else if (invtyp == 4)
         window.open("regen-gst-full.html");




   });


}



function zohoinvoicingdispaly(arr) {

   /*
     <table class="table table-hover" id="zohoinvtab" style="border:solid 2px black;padding-left:5px;">
   <thead>
       <tr>
          <th>Invoice Number</th>
           <th>Invoice Date</th>
           <th>Invoice Status</th>
             <th>Customer Name</th>
           <th>GST Identification Number (GSTIN)</th>
           <th>Item Name</th>
           <th>Item Desc</th>
           <th>Item Type</th>
           <th>HSN/SAC</th>
           <th>Quantity</th>
           <th>Usage unit</th>
           <th>Item Price</th>
       </tr>
   </thead>
 </table> 
   */




   //Datatables here
   $('#zohoinvtab').DataTable().destroy();
   var table = $('#zohoinvtab').DataTable({
      data: arr,
      "destroy": true,
      "columns": [
         { data: "postdelivery.invno" },
         { data: "date" },
         { data: "invstatus2" },
         { data: "name" },

         { data: "gstin" },

         { data: "itemname2" },
         { data: "itemdescrip2" },
         { data: "itemtype2" },
         { data: "hsn2" },
         { data: "qty2" },
         { data: "unit2" },
         { data: "itemprice2" },



      ],
      dom: 'Bfrtip',
      "destroy": true,
      responsive: true,
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });







}

function autocom(s1) {
   console.log(s1);
   $("#supplierk").autocomplete({
      source: function (request, response) {
         response($.ui.autocomplete.filter(s1, request.term));
      }
   });


};




function replacelist(idi, arr) {
   var $el = $("#" + idi);
   $el.empty(); // remove old options
   arr.forEach(function (element) {
      $el.append($("<option></option>").text(element));
   });
};