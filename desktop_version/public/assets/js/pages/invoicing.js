// Initialize Cloud Firestore through Firebase

$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce'
});


var temp, arr, v2, s, tmp, productlist, details, oid, general, itemscount, stockdeduct, bal22, productdes, nocs, currentUid, privilages, email;;
//load basics



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
      user = temp3.substr(0, temp3.lastIndexOf(':'));
      console.log(user2);
      privilages = temp3.substr(temp3.lastIndexOf(':') + 1, temp3.length - 1);


      console.log(privilages);

   } else {
      // Sign out operation. Reset the current user UID.  
      currentUid = null;
      console.log("no user signed in");
   }
});




bal22 = 0; productdes = "";
db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      general = doc.data();
      console.log(general);
      replacelist("noc", general['Companies']);
      if (general['Products'][general['Companies'][0]] != undefined) {
         replacelist("productype", Object.keys(general['Products'][general['Companies'][0]]));
         $("#tradetyp").val("Sale");
      }
      else if (general['Procurement'][general['Companies'][0]] != undefined) {
         replacelist("productype", Object.keys(general['Procurement'][general['Companies'][0]]));
         $("#tradetyp").val("Trade");
      }

      replacelist("unit", general['Productunit']);

      db.collection("Settings/invoicing/Institutional-New").onSnapshot(function (querySnapshot) {
         var arr3 = [];
         querySnapshot.forEach(function (doc) {
            arr3.push(doc.data().name);
         });
         autocom(arr3);
      });


      $('body').loadingModal('hide');
   });



$(document).ready(function () {
   itemscount = 0;
   arr = []; productlist = details = [];
   stockdeduct = {};

   $("#noc").change(function () {
      $('#reset').trigger('click');
      if (general['Products'][$("#noc option:selected").val()] != undefined) {
         replacelist("productype", Object.keys(general['Products'][$("#noc option:selected").val()]));
         $("#tradetyp").val("Sale");
      }
      else if (general['Procurement'][$("#noc option:selected").val()] != undefined) {
         replacelist("productype", Object.keys(general['Procurement'][$("#noc option:selected").val()]));
         $("#tradetyp").val("Trade");
      }
   });

   $("#tradetyp").change(function () {
      if ($("#tradetyp option:selected").val() == "Sale") {
         if (general['Products'][$("#noc option:selected").val()] != undefined)
            replacelist("productype", Object.keys(general['Products'][$("#noc option:selected").val()]));
         else {
            swal("Data Missing", "This is a Trading only Firm", "error");
            $("#tradetyp").val("Trade");
         }


      }
      else if ($("#tradetyp option:selected").val() == "Trade") {

         if (general['Procurement'][$("#noc option:selected").val()] != undefined)
            replacelist("productype", Object.keys(general['Procurement'][$("#noc option:selected").val()]));
         else {
            swal("Data Missing", "This is a Manufacturing only Firm", "error");
            $("#tradetyp").val("Sale");
         }
      }

   });


   $(function () {
      $("#datepicker").datepicker({ orientation: 'bottom', startDate: new Date(), autoclose: true, todayHighlight: true });
   });



   //get the last oid here


   $("#myform").submit(function (evt) {
      evt.preventDefault();

      if (itemscount < 1)
         swal("Items Missing", "Need to add at least one item", "error");
      else {
         var name = $("#name").val();

         var noc = $("#noc").val();
         nocs = shorten(noc).toLocaleLowerCase();
         var slot = $("#slot option:selected").val();
         var expecdate = $("#datepicker").val();
         console.log(expecdate);
         var otherdate = expecdate.substring(3, 5) + '/' + expecdate.substring(0, 2) + '/' + expecdate.substring(6, 10);
         console.log(otherdate);
         expecdate = Date.parse(expecdate);
         console.log(expecdate);

         var toc = $("#toc option:selected").val();
         var placeofsupply = $("#placeofsupply").val();
         var saletype = $("#saletype option:selected").val();
         var advance = parseFloat($("#advance").val());
         var billad = $("#billaddress").val();
         var contactdetails = $("#contactdetails").val();
         var gstin = $("#gstin").val();

         //Insert to Customer details here    

         if (v === "Retail") {

            var region = $("#region").val();
            var receieversphone = parseInt($("#receieversphone").val());
            console.log(receieversphone);
            var shipad = $("#shipaddress").val();
            details = {
               name: name,
               address: shipad,
               phone: receieversphone,
               region: region,
               noc: noc

            };

            checkandinsert(receieversphone.toString(), v, details);
         }
         else if (v === "Institutional-New") {


            details = {
               name: name,
               address: billad,
               gstin: gstin,
               contactdetails: contactdetails,
               noc: noc


            };
            checkandinsert(gstin, v, details);

         }

         //Insert to orders    
         oid = general.orderid[$("#noc option:selected").val()];
         general.orderid[$("#noc option:selected").val()] = oid + 1;
         console.log("oid=" + oid);

         if (v === "Retail") {
            details = {
               order_id: oid,
               name: name,
               date: otherdate,
               timest: expecdate,
               noc: $("#noc option:selected").val(),
               advance: advance,
               typeofcustomer: toc,
               timeslot: slot,
               placeofsupply: placeofsupply,
               saletype: saletype,
               productlist: productlist,
               region: region,
               shipaddress: shipad,
               balance: bal22,
               recieversphone: receieversphone,
               predelivery: "N/A",
               postdelivery: {},
               status: "Order Created",
               stockinfo: stockdeduct,
               tradetype: $("#tradetyp").val(),
               productdes: productdes,
               billaddress: placeofsupply,
               gstin: "N/A",
               contactdetails: receieversphone


            };


         }
         else if (v === "Institutional-New") {
            details = {
               order_id: oid,
               name: name,
               date: otherdate,
               advance: advance,
               noc: $("#noc option:selected").val(),
               typeofcustomer: toc,
               timeslot: slot,
               balance: bal22, placeofsupply: placeofsupply,
               timest: expecdate,
               saletype: saletype,
               productlist: productlist,
               billaddress: billad,
               gstin: gstin,
               contactdetails: contactdetails,
               predelivery: "N/A",
               postdelivery: {},
               status: "Order Created",
               stockinfo: stockdeduct,
               tradetype: $("#tradetyp").val(),
               productdes: productdes

            };
         }
         else if (v === "Institutional-Old") {
            details = {
               order_id: oid,
               name: name,
               date: otherdate,
               advance: advance,
               noc: $("#noc option:selected").val(),
               typeofcustomer: toc,
               timeslot: slot,
               balance: bal22, placeofsupply: placeofsupply,
               timest: expecdate,
               saletype: saletype,
               productlist: productlist,
               billaddress: billad,
               gstin: gstin,
               contactdetails: contactdetails,
               predelivery: "N/A",
               postdelivery: {},
               status: "Order Created",
               stockinfo: stockdeduct,
               tradetype: $("#tradetyp").val(),
               productdes: productdes

            };
         }


         console.log(details);

         datainsert("Orders/#" + shorten(noc) + oid, details);

         general.balancelist[nocs + "bal"] += advance;
         general.balancelist["masterbalance"] += advance;
         general.balancelist[user + 'bal'] += advance;
         datainsert("Settings/Accounts", general);


         var details22 = {
            amount: advance,
            balance: general.balancelist[nocs + "bal"],
            date: todaysdate(4),
            description: "Advance Payment for Order id=" + oid + "for M/S " + name,
            expensehead: "Inflow:Major Sales:Advance",
            masterbalance: general.balancelist["masterbalance"],
            userbal: general.balancelist[user + 'bal'],
            tid: todaysdate(2),
            user: user,
            noc: noc
         };


         datainsert("Accounts/mdb/main/" + todaysdate(2), details22);




         setTimeout(function () {
            swal("Registered!", "Document successfully updated!", "success");
            window.history.back();
         }, 2500);





      };
   });
   $("#btn22").click(function () {
      var productype = $("#productype").val();

      var descrip = $("#descrip").val();

      var qty = parseFloat($("#qty").val());


      var unit = $("#unit").val();

      var rate = parseFloat($("#rateperunit").val());

      var gstrate = parseInt($("#gstrate").val());

      if (productype == '' || descrip == '' || $("#qty").val() == '' || unit == '' || $("#rateperunit").val() == '' || $("#gstrate").val() == '') {
         swal("Try again", "Imp Data Missing", "error");

      }

      else {   //Product description starts here---- 
         itemscount++;

         var hsnnew, itemtype2;
         bal22 += (rate * qty) + ((rate * qty) * (5 / 100));

         if ($("#tradetyp option:selected").val() != "Trade") {
            hsnnew = general.Products[$("#noc option:selected").val()][productype]["hsn"];
            itemtype2 = general.Products[$("#noc option:selected").val()][productype]["type"];
         }
         else {
            hsnnew = general.Procurement[$("#noc option:selected").val()][productype]["hsn"];
            itemtype2 = general.Procurement[$("#noc option:selected").val()][productype]["type"];
         }



         if (stockdeduct.hasOwnProperty(productype)) {
            stockdeduct[productype]["qty"] += qty;
            if ($("#tradetyp option:selected").val() != "Trade") {
               stockdeduct[productype]["value"] += (general.Products[$("#noc option:selected").val()][productype]["unitprice"]) * qty;

            }
            else {
               stockdeduct[productype]["value"] += (general.Procurement[$("#noc option:selected").val()][productype]["unitprice"]) * qty;

            }

         }
         else {
            stockdeduct[productype] = {};
            stockdeduct[productype]["qty"] = qty;

            if ($("#tradetyp option:selected").val() != "Trade") {
               stockdeduct[productype]["value"] = (general.Products[$("#noc option:selected").val()][productype]["unitprice"]) * qty;

            }
            else {
               stockdeduct[productype]["value"] = (general.Procurement[$("#noc option:selected").val()][productype]["unitprice"]) * qty;

            }

         }


         temp = `<tr><th>${productype + ' - ' + descrip}</th>
        <th>${qty + ' - ' + unit}</th>
        <th>${qty * rate}</th>
        <th>${qty * (rate * gstrate / 100)}</th>  
        <th>${(qty * rate) + qty * (rate * gstrate / 100)}</th> </tr>`;
         console.log(temp);

         productdes += productype + ' -' + descrip + '-' + qty + ' - ' + unit + '\n';
         console.log(productdes);

         $("#tab1").show();
         $("#addtbl").append(temp);
         document.getElementById("productype").selectedIndex = 0;
         $("#descrip").val('');
         $("#qty").val('');
         document.getElementById("unit").selectedIndex = 0;
         $("#rateperunit").val('');
         $("#gstrate").val('');
         $("#reset").show('');

         temp = {
            product: productype,
            description: descrip,
            quantity: qty,
            unit: unit,
            rateperunit: rate,
            gstrate: gstrate,
            hsn: hsnnew,
            type: itemtype2
         };
         productlist.push(temp);


         console.log(stockdeduct);
      }

   });

   //Reset table here
   $("#reset").click(function () {
      $("#addtbl").html(" ");
      $("#tab1").hide();
      $("#reset").hide();
      productdes = "";
      productlist = [];
      stockdeduct = {};
      itemscount = 0;
      bal22 = 0;
   });
   var v = "Institutional-Old";



   $("#toc").change(function () {
      v = $("#toc option:selected").val();
      console.log(v);
      if (v === "Retail") {
         $("#name").autocomplete({
            disabled: true
         });
         $("#unreg").show().slideDown();
         $("#newreg").hide();

      }
      else if (v === "Institutional-New") {
         $("#name").autocomplete({
            disabled: true
         });
         $("#newreg").show().slideDown();
         $("#unreg").hide();
      }
      else {
         $("#name").val(" ");
         $("#name").autocomplete({
            disabled: false
         });

         $("#unreg").hide();
         $("#newreg").hide();

      }
   });







});
//replace list

function replacelist(idi, arr) {
   var $el = $("#" + idi);
   $el.empty(); // remove old options
   arr.forEach(function (element) {
      $el.append($("<option></option>").text(element));
   });
};

function shorten(s) {

   s = ' ' + s;
   var t, ch, i;
   t = "";
   for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ch == ' ' && s.charAt(i + 1) != '&')
         t += s.charAt(i + 1);
   }


   return t.toUpperCase();

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
   else if (nn == 5)
      s = Date.parse(mm + '/' + dd + '/' + yy);
   else if (nn == 6)
      s = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();


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

//Customer data entry  

function checkandinsert(docname, type, arr4) {
   var docRef = db.collection("Settings/invoicing/" + type).doc(docname);

   docRef.get().then(function (doc) {
      if (doc.exists) {
         console.log("Document data:", doc.data());
      }
      else {
         // doc.data() will be undefined in this case
         console.log("No such document!");
         docRef.set(arr4)
            .then(function () {
               console.log("Document written with ID: ");
            })
            .catch(function (error) {
               console.error("Error adding document: ", error);
            });
      }
   }).catch(function (error) {
      console.log("Error getting document:", error);
   });
}

//AUTOCOMPLETE JUST FOR NAME
function autocom(s1) {
   $("#name").autocomplete({
      source: function (request, response) {
         response($.ui.autocomplete.filter(s1, request.term));
      },
      change: function (event, ui) {
         if (ui.item == null) {
            $("#name").val("");
            $("#name").focus();

            $("#newreg").hide();
            $("#gstin").val("");
            $("#contactdetails").val("");
            $("#billaddress").val("");
         }
         else {
            console.log(ui.item.value);
            db.collection("Settings/invoicing/Institutional-New").where("name", "==", ui.item.value)
               .get()
               .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                     // doc.data() is never undefined for query doc snapshots
                     $("#gstin").val(doc.data().gstin);
                     $("#contactdetails").val(doc.data().contactdetails);
                     $("#billaddress").val(doc.data().address);
                     $("#newreg").show();
                  });
               })

         }
      }
   });



};

