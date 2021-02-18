
// Initial Overlay starts
$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce'
});

//Variable Decleration
var temp, date2, col, temp2, temp3, t2, yts, ifc, ifu, ofc, ofu, type, exphd, amt, user, noc, general, details, balances, details5, ifcd, ifud, ofcd, ofud, temp4, temp5, dtref, cl, idi1, selfveh, stoneveh, currentts, accdetailsarr, accdetails, temp6, k2, odd, vehdetails, lastoid, stockinfo, gendisplay, privilages, currentUid, notes, otherarr, newtemp, user2, form1;
//overlay starts here

//Initializations

stockinfo = {};

accdetailsarr = [];
otherarr = [];



var date = new Date();
date.setDate(date.getDate() - 1);
currentts = date.getTime();
date.setDate(date.getDate() - 4);
yts = date.getTime();
date.setDate(date.getDate() + 10);
dtref = date.getTime();
console.log(dtref);



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
      console.log(user2);

   } else {
      // Sign out operation. Reset the current user UID.  
      currentUid = null;
      console.log("no user signed in");
      window.location.href = 'index.html';
   }
});




//general db data retival

db.collection("dash1").doc("general")
   .get().then(function (doc) {
      general = doc.data();
      gendisplay = [];
      console.log(general);
      auocomplete1();
      autocomplete2("prevehassigned", general["vehiceno"]);

      db.collection("notes").doc((todaysdate(5)).toString()).get().then(function (doc) {

         if (doc.exists) {

            notes = doc.data().content;
         }
         else {
            notes = "";
         }

         console.log(notes);
      }).catch(function (error) {
         console.log("Error getting document:", error);
      });



      if (general.Stone.lastexitdate < todaysdate(5)) {
         general.Stone.tripnos = 0;
         general.Stone.lastexitdate = todaysdate(5);
         datainsert("dash1/general", general);
      }

      if (general.hazira.datestamp < todaysdate(5)) {
         general.hazira.totalworkers = 0;
         general.hazira.totalwedge = 0;
         general.hazira.datestamp = todaysdate(5);
         datainsert("dash1/general", general);
      }
      gendisplay.push({ name: "Stone Staged", value2: general.Stone.staged.toString() });
      gendisplay.push({ name: "Drivers Onduty", value2: Object.keys(general.vehicledriver.onduty).toString() });
      gendisplay.push({ name: "Vehicles Onduty", value2: Object.keys(general.vehiclesonduty).toString() });
      gendisplay.push({ name: "Total Hazira of=" + general.hazira.totalworkers + " workers", value2: general.hazira.totalwedge });

      console.log(gendisplay);
      //Datatables here
      $('#dailystats').DataTable().destroy();
      var table = $('#dailystats').DataTable({
         data: gendisplay,
         "destroy": true, responsive: true,
         "columns": [
            { data: "name" },
            { data: "value2" }

         ]
      });

   });

//Setings and accounts


db.collection("Settings").doc("Accounts")
   .get().then(function (doc) {
      balances = doc.data();
      console.log(balances);

      //// credentials part

      let credentials = sessionStorage.getItem('uid2') + sessionStorage.getItem('pass2');

      console.log(credentials);

      if (credentials == balances.keywrd) {
         $('#myModal222').modal('hide');
      }



      //accounts to cal balances and summary         
      date2 = todaysdate(3);//todays date generates date like 26-10-2018 =>20181026 the date stored in fire store is also in this format
      temp2 = temp3 = temp4 = temp5 = temp6 = temp = '';
      ifc = {}; ifu = {}; ofc = {}; ofu = {};
      ifcd = {}; ifud = {}; ofcd = {}; ofud = {};
      //get yestardays timestamp

      cl = ["#f44336", "#64b5f6", "#4db6ac"];//setting boundatey colours for html cards to be generated


      //for orders portion


      db.collection("Accounts/mdb/main").where("date", ">=", yts).get().then(function (querySnapshot) {

         querySnapshot.forEach(function (doc) {

            user3 = doc.data().user;
            noc = doc.data().noc;
            console.log(noc);
            exphd = doc.data().expensehead;
            type = exphd.substr(0, exphd.indexOf(':'));
            console.log(type);
            exphd = exphd.substr(exphd.lastIndexOf(':') + 1, exphd.length - 1);
            console.log(exphd);
            amt = parseFloat(doc.data().amount);

            if (type == "Outflow") {

               if (isNaN(ofc[noc])) {
                  ofc[noc] = amt;
                  console.log("nan");
               }
               else {
                  ofc[noc] += amt;
                  console.log("n-nan");
               }

               if (isNaN(ofu[user])) {
                  ofu[user3] = amt;
               }
               else
                  ofu[user3] += amt;

               //spacific outflow details
               if (ofcd[noc] == undefined)
                  ofcd[noc] = {};

               if (ofcd[noc][exphd] == undefined) {
                  ofcd[noc][exphd] = amt;
                  console.log("nan");
               }
               else if (isNaN(ofcd[noc][exphd]) != true) {
                  ofcd[noc][exphd] += amt;
                  console.log("n-nan");
               }

               if (ofud[user3] == undefined)
                  ofud[user3] = {};


               if (ofud[user3][exphd] == undefined) {
                  ofud[user3][exphd] = amt;
               }
               else if (isNaN(ofud[user3][exphd]) != true)
                  ofud[user3][exphd] += amt;

            }


            //fix the inflows
            else if (type == "Inflow") {
               console.log("i/f");
               console.log(doc.data());



               if (isNaN(ifc[noc])) {
                  ifc[noc] = amt;
               }
               else
                  ifc[noc] += amt;

               if (isNaN(ifu[user])) {
                  ifu[user3] = amt;
               }
               else
                  ifu[user3] += amt;

               // Spacific inflow details

               if (ifcd[noc] == undefined) {
                  ifcd[noc] = {};
               }

               if (ifcd[noc][exphd] == undefined) {
                  ifcd[noc][exphd] = amt;
               }
               else if (isNaN(ifcd[noc][exphd]) != true)
                  ifcd[noc][exphd] += amt;

               if (ifud[user3] == undefined) {
                  ifud[user3] = {};
               }



               if (ifud[user3][exphd] == undefined) {
                  ifud[user3][exphd] = amt;
               }
               else if (isNaN(ifud[user3][exphd]) != true)
                  ifud[user3][exphd] += amt;


            }


         });

         console.log(ifc);
         console.log(ifcd);
         console.log(ofc);
         console.log(ofcd);
         //comilance and order list should stay here 


         //Company account details start here
         $("#add4").html("");
         temp4 = "";
         balances.Companies.forEach(function (element) {
            temp4 += `<div class="card mb-3" style="min-width:230px;margin:10px;border-width:2px;border-color: #212121;">
<div class="card-header" ><h5>${element}</h5></div>
<div class="card-body"><h3>Balance:${balances.balancelist[shorten(element) + 'bal']}</h3><hr><h5>Inflow:${ifc[element] || "N.A"}<hr>Outflow:${ofc[element] || "N.A"}<hr>
<button type="button" class="btn btn-success" id="${element}" onclick="getid3(this.id)" data-toggle="modal" data-target="#accdetailsdisplay">Details</button>
  
  </div>
</div>`;

         });
         $("#add4").append(temp4);

         //ifcd and ofcd 

         $("#add5").html("");
         temp4 = "";
         balances.users.forEach(function (element) {
            temp4 += `<div class="card mb-3" style="min-width:230px;margin:10px;border-width:2px;border-color: #212121;">
<div class="card-header" ><h5>${element}</h5></div>
<div class="card-body"><h3>Balance:${balances.balancelist[element + 'bal']}</h3><hr><h5>Inflow:${ifu[element] || "N.A"}<hr>Outflow:${ofu[element] || "N.A"}<hr>
<button type="button" class="btn btn-success" id="${element}" onclick="getid32(this.id)" data-toggle="modal" data-target="#accdetailsdisplay">Details</button>
  
  </div>
</div>`;
         });

         $("#add5").append(temp4);





      });
   });




db.collection("Orders").orderBy("timest").orderBy("timeslot").where("timest", "<=", dtref).get().then(function (querySnapshot) {
   console.log("one");//function test check points
   temp2 = temp3 = "";
   querySnapshot.forEach(function (doc) {
      console.log(doc.data().timeslot);

      col = cl[parseInt(doc.data().timeslot - 1)];


      pdes = doc.data().productlist;

      t2 = "";
      pdes.forEach(function (element) {

         t2 += element.product + ' ' + element.
            description + ' ' + element.quantity + ' ' +
            element.unit + '<br>';
      });

      console.log(t2);

      if (doc.data().status == "Order Created") {
         temp2 += `<div class="card border-mb-3" style="min-width:240px;margin:10px;border-width:4px;border-color:${col};">
<div class="card-header">${doc.data().date}</div>
<div class="card-body"><h6>${doc.data().name}<hr><strong>Advance:${doc.data().advance}</strong><hr>${t2}<hr>${doc.data().placeofsupply}</h6> 
<button type="button" class="btn btn-success" id="${doc.id}" onclick="getid(this.id)" data-toggle="modal" data-target="#preordermod">Deliver</button>
<button type="button" class="btn btn-primary"  onclick="getid2(this.id)" class="ordercancel" id="${doc.id}">Cancel</button>    
  </div>
</div>`;

      }
      else {
         temp3 += `<div class="card border- mb-3" style="min-width:240px;margin:10px;border-width:4px;border-color:${col}">
<div class="card-header">${doc.data().date}</div>
<div class="card-body"><h6>${doc.data().name}<hr><strong>Advance:${doc.data().advance}</strong><hr>${t2}<hr>${doc.data().placeofsupply}</h6> 
<button type="button" class="btn btn-success"id="${doc.id}" onclick="getid4(this.id)" data-toggle="modal" data-target="#postordermod">Deliver</button>
<button type="button" class="btn btn-primary"  onclick="getid2(this.id)" class="ordercancel" id="${doc.id}">Cancel</button>        
  </div>
</div>`;


      }

   });

   $("#add1").append(temp2);
   $("#add2").append(temp3);








   //for compilance part       
   db.collection("Compandtodo").orderBy("date").orderBy("priority").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {


         col = cl[doc.data().priority - 1];
         console.log(col);

         temp += `<div class="card border- mb-3" style="min-width:240px;margin:10px;border-width:4px;border-color:${col}">
<div class="card-body">
  <h5 class="card-title">${doc.data().type + ':' + doc.data().name}</h5>
  <p class="card-text">${doc.data().details}</p>
  <button class="btn btn-primary" onclick="getid(this.id)" id=${doc.id} data-toggle="modal" data-target="#updatetodo">Update</button>
</div>
</div>`;


      });

      $("#add3").append(temp);


      //db get vehicles and stone details                     
      db.collection("dash1/vehicledetails/selfoutflow").onSnapshot(function (querySnapshot) {
         selfveh = [];
         querySnapshot.forEach(function (doc) {
            console.log(general.vehiclesonduty);
            if (Object.keys(general.vehiclesonduty).includes(doc.data().regno))
               selfveh.push(doc.data());
         });
         console.log(selfveh);
         //Datatables here

         //Datatables here
         $('#selfstats').DataTable().destroy();
         var table = $('#selfstats').DataTable({
            data: selfveh,
            "destroy": true, responsive: true,
            "columns": [
               { data: "regno" },
               { data: "catagory" },
               { data: "last_milage" },
               { data: "avgmilage" },
               { data: "expectedmilage" },
               { data: "runningcost" }


            ]
         });




      });


      db.collection("dash1/vehicledetails/stoneinflowtrips").where("time", ">=", currentts)
         .onSnapshot(function (querySnapshot) {
            stoneveh = [];
            querySnapshot.forEach(function (doc) {
               stoneveh.push(doc.data());
            });
            console.log(stoneveh);

            //datables here

            //Datatables here
            $('#stonestats').DataTable().destroy();
            var table = $('#stonestats').DataTable({
               data: stoneveh,
               "destroy": true, responsive: true,
               "columns": [
                  { data: "vehreg" },
                  { data: "exittime" },
                  { data: "wt" },
                  { data: "payamt" },
                  { data: "amtdue" }


               ]
            });


         });


      $('body').loadingModal('hide');



   });





});




$("#datepicker1").datepicker({ orientation: 'bottom', autoclose: true, todayHighlight: true });
$("#datepicker2").datepicker({ orientation: 'bottom', autoclose: true, todayHighlight: true });
$("#datepicker3").datepicker({ orientation: 'bottom', autoclose: true, todayHighlight: true });
$("#datepicker4").datepicker({ orientation: 'bottom', autoclose: true, todayHighlight: true });

$("#postremdate").datepicker({ orientation: 'bottom', autoclose: true, todayHighlight: true });


$(document).ready(function () {


   $("#userlogout").click(function () {
      console.log(currentUid);
      if (currentUid != null) {

         firebase.auth().signOut().then(function () {
            window.location.href = "index.html";
         }).catch(function (error) {
            console.log("no user Signed In");
         });
      }
      else
         swal("Error", "no user Signed In", "error");
   });


   $("#stone2").show();

   var selectas, astyp, temp; temp5 = "none";
   selectas = $("#selectactivity :selected").val();
   astyp = $("#assignmenttype :selected").val();


   $("#selectactivity").change(function () {
      selectas = $("#selectactivity :selected").val();
      astyp = $("#assignmenttype :selected").val();
      $("#driname").hide();
      if (astyp != "none")
         fieldchange();

   });

   $("#predeliverytype").change(function () {
      if ($("#predeliverytype").val() == 2) {
         $("#prevehassigned").prop('disabled', true);
         $("#prelabournos").prop('disabled', true);
         $("#preexphazira").prop('disabled', true);

      }
      else {
         $("#prevehassigned").prop('disabled', false);
         $("#prelabournos").prop('disabled', false);
         $("#preexphazira").prop('disabled', false);
      }

   });

   $("#remfrequency").change(function () {
      if ($("#remfrequency option:selected").val() == 3)
         $("#others22").show();
      else
         $("#others22").hide();
   });
   $("#taskupdatetype").change(function () {
      if ($("#taskupdatetype option:selected").val() == 2) {
         $("#prostpond").show();
         $("#reinitiate").hide();
      }
      else if ($("#taskupdatetype option:selected").val() == 3) {
         console.log('3');
         $("#reinitiate").show();
         $("#prostpond").show();

      }
      else {
         $("#prostpond").hide();
         $("#reinitiate").hide();
      }
   });

   $("#vehicletype").change(function () {
      if ($("#vehicletype option:selected").val() == "Stone") {
         $("#others1").hide();
         $("#others2").hide();
         $("#stone2").show();


      }
      else {
         $("#stone2").hide();
         $("#others1").show();
         $("#others2").show();


      }

   });

   $("#assignmenttype").change(function () {
      $("#driname").hide();
      astyp = $("#assignmenttype option:selected").val();

      console.log(astyp);
      if (astyp == "stone") {
         autocomplete2("vehregstone", general.Stone.stonereg);
         autocomplete3("vehregstone2", general.Stone.staged);
      }
      else if (astyp == "vehicledriver") {
         autocomplete3("drivername", Object.keys(general.vehicledriver.onduty));
         $("#hazirapaybal").html(general.vehicledriver.totalfooding);
      }
      else {
         $("#hazirapaybal").html(general.hazira.totalwedge);
         $("#vehregstone").attr("autocomplete", "off");
         $("#vehregstone2").attr("autocomplete", "off");
         $("#drivername").attr("autocomplete", "off");
      }
      fieldchange();


   });
   function fieldchange() {
      var temp55;
      temp55 = astyp;
      if (selectas == "pay" && astyp != "stone" && astyp != "none")
         astyp = "other"
      console.log(temp5);
      $(temp5).hide();
      if (astyp != "none") {
         temp5 = '#' + selectas + astyp;
         console.log(temp5);

         $(temp5).show();
         if (temp55 == "vehicledriver" && astyp == "other")
            $("#driname").show();
      }
   }

   $("#form2").submit(function (e) {
      e.preventDefault();
      console.log("form2");
      $('body').loadingModal('show');
      //Jquery overlay

      //orginal content starts here

      var vehno, details2, time;
      vehno = $("#vehregno").val();

      console.log(general.vehiclesonduty[vehno]);
      if (!general.vehiclesonduty.hasOwnProperty(vehno))
         general.vehiclesonduty[vehno] = parseInt($("#distravel2").val());
      else
         general.vehiclesonduty[vehno] = parseFloat(general.vehiclesonduty[vehno]) + parseFloat($("#distravel2").val());

      console.log(general.vehiclesonduty);
      time = todaysdate(2);
      var docRef = db.collection("dash1/vehicledetails/selfoutflow").doc(vehno);

      docRef.get().then(function (doc) {
         console.log(doc.data());
         if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log(balances);

            vehdetails = doc.data();
            vehdetails.last_milage = vehdetails.avgmilage;

            vehdetails.totaldistance += parseInt($("#distravel2").val());
            vehdetails.totalfuel += parseInt($("#oilconsumed2").val());
            vehdetails.avgmilage = vehdetails.totaldistance / vehdetails.totalfuel;
            vehdetails.totalcost += parseInt($("#totalfuelcharges").val()) + parseInt($("#maintainance2").val());
            vehdetails.runningcost = (vehdetails.totalcost / vehdetails.totaldistance).toFixed(2);
            balances.balancelist["bbibal"] -= parseInt($("#totalfuelcharges").val()) + parseInt($("#maintainance2").val());
            balances.balancelist["masterbalance"] -= parseInt($("#totalfuelcharges").val()) + parseInt($("#maintainance2").val());
            balances.balancelist[user + 'bal'] -= parseInt($("#totalfuelcharges").val()) + parseInt($("#maintainance2").val());

            details2 = {
               amount: parseInt($("#totalfuelcharges").val()) + parseInt($("#maintainance2").val()),
               balance: balances.balancelist["bbibal"],
               date: todaysdate(4),
               description: vehno + ':' + $("#triptype2").val(),
               expensehead: "Outflow:Expense:SelfVehicleExp",
               masterbalance: balances.balancelist["masterbalance"],
               userbal: balances.balancelist[user + 'bal'],
               suppplier: "Self",
               tid: time,
               user: user,
               noc: "BRICK INDUSTRIES"
            };
            console.log("details->");
            console.log(details2);
            var batch = db.batch();
            //batched transactions

            var Ref3 = db.collection("dash1/vehicledetails/selfoutflow").doc(vehno);
            batch.set(Ref3, vehdetails);
            //update the balance array
            var Ref4 = db.collection("Settings").doc("Accounts");
            batch.set(Ref4, balances);

            //update the balance array
            var Ref5 = db.collection("Accounts/mdb/main").doc(time);
            batch.set(Ref5, details2);
            //update dash geneal
            var Ref6 = db.collection("dash1").doc("general");
            batch.set(Ref6, general);


            // Commit the batch
            batch.commit().then(function () {
               $('body').loadingModal('hide');
               swal("Trip Recorded!", "You may proceed!", "success");
            }).catch(function (error) {
               console.log("Error getting document:", error);
            });


         }
         else {
            // doc.data() will be undefined in this case
            $('body').loadingModal('hide');
            swal("Invalid Regitration number!", "Re enter the Registration Number!", "error");
         }
      }).catch(function (error) {
         console.log("Error getting document:", error);
      });




   });

   $("#btnreg").click(function () {
      console.log("user=" + user);
      $('body').loadingModal('show');
      $("#registervehicle").modal('toggle');
      var catagory, vehno, avgwt;
      console.log("Register Vehicle");
      console.log($("#driversfooding1").val());
      catagory = $("#vehicletype :selected").val();

      vehno = $("#modalvehregno").val();
      console.log(vehno);
      avgwt = parseFloat($("#avgwt").val());
      if (catagory == "Stone") {

         details5 = {
            tripnos: 0,
            totalwt: 0,
            totalpay: 0,
            dueamt: 0,
            regno: vehno,
            source: $("#stonesource").val()


         };
         general.Stone['stonereg'].push(vehno);
         var batch = db.batch();
         //batched transactions

         var Ref3 = db.collection("dash1/vehicledetails/stonedue").doc(vehno);
         batch.set(Ref3, details5);
      }
      else {
         details = {

            catagory: catagory,
            regno: vehno,
            weight: avgwt,
            expectedmilage: parseFloat($("#expectedmilage").val()),
            compilance: parseFloat($("#compilancecharges").val()),
            driversal: parseFloat($("#driversal").val()),
            driverfooding: parseFloat($("#driversfooding1").val()),
            avgmilage: 0,
            totaldistance: 0,
            totalfuel: 0,
            last_milage: 0,
            totalcost: 0,
            runningcost: 0

         }
         console.log(general.vehiceno);
         general.vehiceno.push(vehno);


         var batch = db.batch();
         //batched transactions

         var Ref3 = db.collection("dash1/vehicledetails/selfoutflow").doc(vehno);
         batch.set(Ref3, details);
      }
      //update the balance array
      var Ref4 = db.collection("dash1").doc("general");
      batch.set(Ref4, general);

      // Commit the batch
      batch.commit().then(function () {
         $('body').loadingModal('hide');
         swal("Vehicle Registered!", "You may proceed!", "success");
         $('#form3').trigger("reset");

      }).catch(function (error) {
         $('body').loadingModal('hide');
         swal("Error", error, "error");
         $('#form3').trigger("reset");
      });


   });

   $("#form1").submit(function (e) {
      e.preventDefault();
      time = todaysdate(2);
      astyp = $("#assignmenttype :selected").val();
      var tdiff = todaysdate(4) - todaysdate(5);
      $('body').loadingModal('show');
      stockinfo = {};
      //original content starts here
      var details3, details4, wedge, worknos, otheramt, tmp;
      if (selectas == "assign") {
         if (astyp == "stone") {
            bootstrapValidate('#vehregstone', 'required:This Field is required!');

            if ($("#vehregstone").val() != "") {
               general.Stone.staged.push($("#vehregstone").val());
               console.log(general.Stone.staged);
               generalset(general);
            }
            else {
               swal("Retry", "Importent Fields Missing", "error");
               $('body').loadingModal('hide');
            }
         }
         else if (astyp == "vehicledriver") {
            bootstrapValidate(['#drivername1', '#foodingamt'], 'required:This Field is required!');
            if ($("#drivername1").val() != "" && tdiff <= 32400000) {
               general.vehicledriver["onduty"][$("#drivername1").val()] = parseFloat($("#foodingamt").val());
               general.vehicledriver.totalfooding = parseFloat(general.vehicledriver.totalfooding) + parseFloat($("#foodingamt").val());
               generalset(general);

            }
            else {
               swal("Retry", "Importent Fields Missing or Incorrect Timings", "error");
               $('body').loadingModal('hide');

            }
            //add fooding amount respective to name load from payroll db and enter
         }
         else if (astyp == "dailywedge") {
            bootstrapValidate(['#wedge', '#worknos'], 'required:This Field is required!');
            if ($("#wedge").val() != "" && $("#worknos").val() != "" && tdiff <= 32400000) {
               wedge = parseFloat($("#wedge").val());
               worknos = parseInt($("#worknos").val());

               general.hazira.totalworkers += worknos;
               general.hazira.totalwedge += wedge;

               generalset(general);
            }
            else {
               swal("Retry", "Importent Fields Missing or Incorrect Timings", "error");
               $('body').loadingModal('hide');
            }
         }

         else {
            swal("Retry", "Importent Fields Missing", "error");
            $('body').loadingModal('hide');
         }


      }
      else if (selectas == "pay") {
         if (astyp == "stone") {
            if ($("#avgwtstone").val() != "" && $("#payamtstone").val() != "" && $("#vehregstone2").val() != "" && $("#amtduestone").val() != "") {
               flag1 = 0;
               var wt, valuee;
               wt = parseInt($("#avgwtstone").val());
               otheramt = parseFloat($("#payamtstone").val());
               console.log(otheramt);
               details4 = {
                  vehreg: $("#vehregstone2").val().toUpperCase(),
                  payamt: otheramt,
                  amtdue: parseFloat($("#amtduestone").val()) - otheramt,
                  exittime: time,
                  wt: wt,
                  time: todaysdate(4)

               };
               //Stock increment

               balances.Products["STONE CRUSHING MILL"]["STONE CHIPS"]['qty'] = balances.Products["STONE CRUSHING MILL"]["STONE CHIPS"]['qty'] + wt * (1 - general.dustratio);
               balances.Products["STONE CRUSHING MILL"]["STONE DUST"]['qty'] = balances.Products["STONE CRUSHING MILL"]["STONE DUST"]['qty'] + wt * general.dustratio;

               balances.Products["STONE CRUSHING MILL"]["STONE CHIPS"]['value'] = balances.Products["STONE CRUSHING MILL"]["STONE CHIPS"]['value'] + (amt * .8);
               balances.Products["STONE CRUSHING MILL"]["STONE DUST"]['qty'] = balances.Products["STONE CRUSHING MILL"]["STONE DUST"]['value'] + (amt * .2);

               //insert to stock register

               stockinfo["stock"] = balances.Products["STONE CRUSHING MILL"] || "N.A";
               stockinfo["prostock"] = balances.Procurement["STONE CRUSHING MILL"] || "N.A";
               stockinfo["time"] = todaysdate(4);
               stockinfo["type1"] = "Products";
               stockinfo["noc"] = "STONE CRUSHING MILL";
               stockinfo["type2"] = "Addition";
               stockinfo["item"] = "STONE CHIPS";
               stockinfo["massage"] = "STONE CHIPS increased to quantity:" + balances.Products["STONE CRUSHING MILL"]["STONE CHIPS"]["qty"] + "value updated to:" + balances.Products["STONE CRUSHING MILL"]["STONE CHIPS"]["value"] + " && STONE DUST increased to quantity:" + balances.Products["STONE CRUSHING MILL"]["STONE DUST"]["qty"] + " && value upadated to:" + balances.Products["STONE CRUSHING MILL"]["STONE DUST"]["value"];



               datainsert("Accounts/stockregister/STONE CRUSHING MILL/" + todaysdate(2), stockinfo);

               console.log(details4);
               general.Stone.staged.splice(general.Stone.staged.lastIndexOf($("#vehregstone").val()), 1);
               general.Stone.tripnos += 1;
               general.Stone.lastexitdate = todaysdate(4);
               balances.balancelist["bscmbal"] -= otheramt;
               balances.balancelist["masterbalance"] -= otheramt;
               balances.balancelist[user + 'bal'] -= otheramt;
               details3 = {
                  amount: otheramt,
                  balance: balances.balancelist["bscmbal"],
                  date: todaysdate(4),
                  description: $("#vehregstone2").val() + 'Inflow Trip' + "Weight=" + wt,
                  expensehead: "Outflow:Procurement:RIVER STONE",
                  masterbalance: balances.balancelist["masterbalance"],
                  userbal: balances.balancelist[user + 'bal'],
                  suppplier: "Self",
                  tid: todaysdate(2),
                  user: user,
                  noc: "STONE CRUSHING MILL"
               };
               //add stone truck details 
               //add dash details here                
               db.collection("dash1/vehicledetails/stonedue").doc($("#vehregstone2").val()).get().then(function (doc) {
                  if (doc.exists) {

                     details5 = doc.data();
                     details5.tripnos += 1;
                     details5.totalwt += parseInt($("#avgwtstone").val()),
                        details5.totalpay += otheramt;
                     details5.dueamt += parseFloat($("#amtduestone").val()) - otheramt;
                     console.log(details5);
                     var Ref2 = db.collection("dash1/vehicledetails/stonedue").doc($("#vehregstone2").val());
                     Ref2.set(details5)
                        .then(function () {
                           console.log("Document successfully written!");
                           $('#form1').trigger("reset");
                        })
                        .catch(function (error) {
                           console.error("Error writing document: ", error);
                        });


                  } else {
                     // doc.data() will be undefined in this case
                     console.log("No such document!");
                  }
               }).catch(function (error) {
                  swal("Error getting document:", error, "error");
               });



            }

            else flag1 = 1;

         }
         else if (astyp == "vehicledriver") {
            if ($("#otheramt").val() != "" && $("#drivername").val() != "" && tdiff <= 54000000) {
               otheramt = parseInt($("#otheramt").val());
               console.log($("#driname").val());
               delete general.vehicledriver.onduty[$("#drivername").val()];
               console.log(general.vehicledriver.onduty);
               general.vehicledriver.totalfooding -= otheramt;
               balances.balancelist["bbibal"] -= otheramt;
               balances.balancelist["masterbalance"] -= otheramt;
               balances.balancelist[user + 'bal'] -= otheramt;
               details3 = {
                  amount: otheramt,
                  balance: balances.balancelist["bbibal"],
                  date: todaysdate(4),
                  description: $("#drivername1").val() + " Fooding",
                  expensehead: "Outflow:Expense:SelfVehicleExp:Driver Fooding",
                  masterbalance: balances.balancelist["masterbalance"],
                  suppplier: "Self",
                  tid: todaysdate(2),
                  user: user,
                  userbal: balances.balancelist[user + 'bal'],
                  noc: "BRICK INDUSTRIES"
               };
            }
            else {
               swal("Retry", "Importent Fields Missing or wrong timeslot", "error");
               $('body').loadingModal('hide');
            }
         }
         else if (astyp == "dailywedge") {
            if ($("#otheramt").val() != "" && tdiff <= 54000000) {
               otheramt = parseFloat($("#otheramt").val());
               general.hazira.totalwedge -= otheramt;

               if (general.hazira.totalwedge <= 0)
                  general.hazira.totalworkers = 0;

               balances.balancelist["bbibal"] -= otheramt;
               balances.balancelist["masterbalance"] -= otheramt;
               balances.balancelist[user + 'bal'] -= otheramt;
               details3 = {
                  amount: otheramt,
                  balance: balances.balancelist["bbibal"],
                  date: todaysdate(4),
                  description: "Daily Wadge(Hazira)",
                  expensehead: "Outflow:Expense:Labour",
                  masterbalance: balances.balancelist["masterbalance"],
                  suppplier: "Self",
                  userbal: balances.balancelist[user + 'bal'],
                  tid: todaysdate(2),
                  user: user,
                  noc: "BRICK INDUSTRIES"
               };

               console.log(details3);
            }
            else {
               swal("Retry", "Importent Fields Missing or wrong timeslot", "error");
               $('body').loadingModal('hide');
            }
         }


         if (flag1 == 0) {
            //batched update
            //3.stone self and stone due(>0) only for sto
            var batch = db.batch();

            //batched transactions



            var Ref3 = db.collection("dash1").doc("general");
            batch.set(Ref3, general);  //ok
            //update the balance array
            var Ref4 = db.collection("Settings").doc("Accounts");
            batch.set(Ref4, balances);//ok

            //Add the transaction
            var Ref5 = db.collection("Accounts/mdb/main").doc(time);
            batch.set(Ref5, details3);//ok 

            if (astyp == "stone") {
               var Ref1 = db.collection("dash1/vehicledetails/stoneinflowtrips").doc('#' + todaysdate(4));

               batch.set(Ref1, details4);  //trip register


            }


            // Commit the batch
            batch.commit().then(function () {
               $('body').loadingModal('hide');
               swal("Trip Recorded!", "You may proceed!", "success");
            }).catch(function (error) {
               $('body').loadingModal('hide');
               swal("Error getting document!-Fields Missing", error, "error");
            });

         }

         else {
            $('body').loadingModal('hide');
            swal("Imp Fields Missing", "error");

         }


      }

   })
   //form5 here-register todo
   $("#form5").submit(function (e) {
      e.preventDefault();
      $('body').loadingModal('show');
      $('#registertodo').modal('toggle');
      var details55;
      if (parseInt($("#remfrequency option:selected").val()) == 1) {

         details55 = {

            lasttaskdt: Date.parse($("#datepicker2").val()),
            date: Date.parse($("#datepicker1").val()),
            remfreq: parseInt($("#remfrequency option:selected").val()),
            title: $("#tasktitle").val(),
            description: $("#taskdescription").val(),
            priority: parseInt($("#rempriority option:selected").val()),
            user: user


         }
      }
      else {

         details55 = {

            lasttaskdt: Date.parse($("#datepicker2").val()),
            date: Date.parse($("#datepicker1").val()),
            remfreq: parseInt($("#remfrequency option:selected").val()),
            title: $("#tasktitle").val(),
            description: $("#taskdescription").val(),
            interval: parseInt($("#interval").val()) * 86400000,
            priority: parseInt($("#rempriority option:selected").val()),
            user: user

         }
      }


      db.collection("Compandtodo").doc('#' + todaysdate(4)).set(details55)
         .then(function () {
            console.log("Document successfully written!");

            $('body').loadingModal('hide');
            swal("Task Recorded!", "You may proceed!", "success");

         })
         .catch(function (error) {
            swal("Error writing document:", error, "error");
            $('#form5').trigger("reset"); $('body').loadingModal('hide');
            swal("Error", error, "error");

         });

   });

   //form6  here      

   $("#form65").submit(function (e) {
      e.preventDefault();
      console.log("form65");
      var nxtdt, lstdt, des, obj33;

      db.collection("Compandtodo").doc(idi1)
         .get().then(function (doc) {

            obj33 = doc.data();

            console.log("Current data: ", obj33);


            if ($("#taskupdatetype option:selected").val() == 1 && obj33.remfreq == 1 || $("#taskupdatetype option:selected").val() == 4) {
               db.collection("Compandtodo").doc(idi1).delete().then(function () {
                  swal("Document successfully deleted!", "You may proceed", "success");
               }).catch(function (error) {
                  console.error("Error removing document: ", error);
               });

            }
            else if ($("#taskupdatetype option:selected").val() == 1 && obj33.remfreq == 3) {
               console.log(parseInt(obj33.date) + "+" + parseInt(obj33.interval));
               obj33.date = parseInt(obj33.date) + parseInt(obj33.interval);
               console.log(parseInt(obj33.date) + "+" + parseInt(obj33.interval));
               obj33.lasttaskdt = parseInt(obj33.lasttaskdt) + parseInt(obj33.interval);
               datainsert("Compandtodo/" + idi1, obj33);
            }
            else {
               obj33.date = Date.parse($("#datepicker3").val());
               obj33.lasttaskdt = Date.parse($("#datepicker4").val());
               if ($("#taskupdatetype option:selected").val() == 3)
                  obj33.description = $("#taskdescription2").val();
               obj33.user = user;

               datainsert("Compandtodo/" + idi1, obj33);
            }




         });


   });

   $("#form8").submit(function (e) {
      e.preventDefault();

      var details99, details22, predel, preamt, invtyp, noc2, data1, unload;
      predel = $("#predeliverytype option:selected").val();
      preamt = parseInt($("#preamt").val());
      invtyp = parseInt($("#preinvoicetype option:selected").val());
      unload = parseFloat($("#preexphazira").val());
      console.log(predel);
      if (predel == 2) {
         details99 = {
            transporttype: predel,

            invtyp: invtyp

         };
      }
      else if (predel == 1) {
         details99 = {
            transporttype: predel,

            invtyp: invtyp,
            vehregno: $("#prevehassigned").val(),
            labournos: parseInt($("#prelabournos").val()),
            unloadcharges: unload


         };

         if (!general.vehiclesonduty.hasOwnProperty($("#prevehassigned").val()))
            general.vehiclesonduty[$("#prevehassigned").val()] = 0;
         if (unload > 0)
            odd.advance = odd.advance + unload;

      }
      console.log(details99);
      console.log(general.vehiclesonduty);

      db.collection("Orders").doc(idi1).get().then(function (doc) {

         console.log(doc.data());
         noc2 = shorten(doc.data()["noc"]);
         //noc2=doc.data()["noc"];
         console.log(noc2);
         balances.balancelist[noc2 + "bal"] += preamt;
         balances.balancelist["masterbalance"] += preamt;
         balances.balancelist[user + 'bal'] += preamt;
         data1 = doc.data();
         data1.advance = parseInt(data1.advance) + preamt;
         data1.predelivery = details99;

         console.log(noc2);
         details22 = {
            amount: preamt,
            balance: balances.balancelist[noc2 + "bal"],
            date: todaysdate(4),
            description: "Advance Payment for Order id=" + idi1,
            expensehead: "Inflow:Major Sales:Advance",
            masterbalance: balances.balancelist["masterbalance"],
            userbal: balances.balancelist[user + 'bal'],

            tid: todaysdate(2),
            user: user,
            noc: doc.data()["noc"]
         };

         //batch starts here

         var batch = db.batch();

         //batched transactions

         var Ref2 = db.collection("Orders").doc(idi1);
         batch.set(Ref2, data1);

         var Ref3 = db.collection("dash1").doc("general");
         batch.set(Ref3, general);
         //update the balance array
         var Ref4 = db.collection("Settings").doc("Accounts");
         batch.set(Ref4, balances);

         //update the balance array
         var Ref5 = db.collection("Accounts/mdb/main").doc(todaysdate(2));
         batch.set(Ref5, details22);

         // Commit the batch
         batch.commit().then(function () {
            $('body').loadingModal('hide');
            swal("Details Recorded!", "Redirecting......", "success");

            if (typeof (Storage) !== "undefined") {
               console.log("webstorage there");
               localStorage.setItem("oid", idi1);
            } else {
               console.log("Sorry! No Web Storage support..");
               document.cookie = idi1;
            }







            //Redirection here
            //Redirection here
            if (invtyp == 1)
               window.location.href = "invoicegen-half -billofsupply.html";
            else if (invtyp == 2)
               window.location.href = "invoicegen-half.html";
            // else if (invtyp == 3)
            //    window.location.href = "invoicegen.html";
            // else if (invtyp == 4)
            //    window.location.href = "gst-full.html";
            // else if (invtyp == 5)
            //    window.location.href = "invoicegen-1part.html";
            // else if (invtyp == 6)
            //    window.location.href = "invoicegen-gst1part.html";


         }).catch(function (error) {
            console.log("Error getting document:", error);
         });
      })

         .catch(function (error) {
            console.log("Error getting document:", error);
         });



   });



   $("#form89").submit(function (e) {
      //THis part is for post delivery order details
      e.preventDefault();
      stockinfo = {};

      $("#postordermod").modal('hide');
      $('body').loadingModal('show');

      details2 = details3 = details4 = details5 = {};
      var temp33, tmp44, postpay, hazira, noc4, noc5, rembal, premdate;//rembal-remaining balance
      noc4 = shorten(odd.noc);
      noc5 = shorten2(odd.noc);

      postpay = parseFloat($("#postpayamt").val());

      rembal = odd.balance -
         odd.advance - postpay;

      //batch starts here

      var batch = db.batch();




      console.log(postpay);



      t2 = "";
      odd.productlist.forEach(function (element) {

         t2 += element.product + ' ' + element.
            description + ' ' + element.quantity + ' ' +
            element.unit + '\n';
      });


      if (postpay > 0) {
         //details for accounts

         balances.balancelist[noc4 + "bal"] += postpay;
         balances.balancelist["masterbalance"] += postpay;
         balances.balancelist[user + 'bal'] += postpay;

         details4 = {
            amount: postpay,
            balance: balances.balancelist[noc4 + "bal"],
            date: todaysdate(4),
            description: "Post Delivery Payment from " + odd.name + " against " + t2,
            expensehead: "Inflow:Major Sales:Post Payment",
            masterbalance: balances.balancelist["masterbalance"],
            userbal: balances.balancelist[user + 'bal'],
            tid: todaysdate(2),
            user: user,
            noc: odd.noc
         };

         console.log(details4);
         var Ref221 = db.collection("Accounts/mdb/main").doc(todaysdate(2));
         batch.set(Ref221, details4);

         //gst invoice check

         if (odd.predelivery.invtyp == '2' || odd.predelivery.invtyp == '4') {

            //cash payment

            if ($("#postpaytype option:selected").val() == "1") {
               balances.balancelist['f' + noc4 + "bal"] += postpay;



               details5 = {

                  tid: todaysdate(2),
                  date: todaysdate(4),
                  noc: odd.noc,
                  perticulars: "Payment recieved against Inv:" + odd.postdelivery.invno,
                  vouchartyp: "Sales",
                  bankdebit: "",
                  cashdebit: "",
                  bankcredit: "",
                  cashcredit: odd.advance + postpay,
                  balance: balances.balancelist['f' + noc4 + "bal"],
                  user: user
               };
            }

            //E-transfer or Cheque

            else if ($("#postpaytype option:selected").val() == "2" || $("#postpaytype option:selected").val() == "3") {
               balances.balancelist['f' + noc4 + "bal"] += postpay;
               details5 = {

                  tid: todaysdate(2),
                  date: todaysdate(4),
                  noc: odd.noc,
                  perticulars: "Payment recieved against Inv:" + odd.postdelivery.invno,
                  vouchartyp: "Sales",
                  bankdebit: "",
                  cashdebit: "",
                  bankcredit: odd.advance + postpay,
                  cashcredit: "",
                  balance: balances.balancelist['f' + noc4 + "bal"],
                  user: user
               };
            }

            else if ($("#postpaytype option:selected").val() == "4")//unpaid
            {
               balances.balancelist['f' + noc4 + "bal"] += postpay;
               details5 = {
                  tid: todaysdate(2),
                  date: todaysdate(4),
                  noc: odd.noc,
                  perticulars: "Payment recieved against Inv:" + odd.postdelivery.invno,
                  vouchartyp: "Sales",
                  bankdebit: "",
                  cashdebit: "",
                  bankcredit: "",
                  cashcredit: rembal,
                  balance: balances.balancelist['f' + noc4 + "bal"],
                  user: user
               };
            }

            console.log(details5);
            var Ref222 = db.collection("Accounts/fcb/main").doc(todaysdate(2));
            batch.set(Ref222, details5);
         }

      }


      if ($("#postpaytype option:selected").val() == "1")//cash
      {
         odd.postdelivery["payamt"] = postpay;
      }
      else if ($("#postpaytype option:selected").val() == "4" || rembal > 0)//unpaid
      {
         odd.postdelivery["payamt"] = postpay;

         //for normal date creation 
         var date22 = new Date();
         date22.setDate(date22.getDate() + 5);

         premdate = $("#postremdate").val() || new Date(date22);
         //This is 



         details2 = {

            lasttaskdt: premdate,//last date for the task
            date: Date.parse($("#postremdate").val()) - 172800000 || (premdate.getTime() - 52415250),
            remfreq: 1,
            title: "Debt Reminder of " + odd.name,
            description: t2 + '::\n::' + ($("#postremdetails").val() || ''),
            priority: 1,
            user: user


         }

         console.log(details2);


         var Ref223 = db.collection("Compandtodo").doc('#' + todaysdate(4));
         batch.set(Ref223, details2);



         notes += "/n" + todaysdate(6) + ":Debt created for " + odd.name + " of amount rs" + rembal + "against" + t2;

         //comptodo here
         console.log(odd);

         db.collection("debt").doc((noc5 + odd.contactdetails)).get().then(function (doc) {



            if (doc.exists) {
               console.log("Document data:", doc.data());
               details3 = doc.data();

               console.log(t2);
               details3.balance = details3.balance + rembal;
               details3.tripdetails[todaysdate(0)] = t2;

            }
            else {
               var tmp99;
               if (odd.typeofcustomer == 'Institutional-New' || odd.typeofcustomer == 'Institutional-Old')
                  tmp99 = 'Institutional';
               else
                  tmp99 = odd.typeofcustomer;

               details3 = {
                  balance: rembal,
                  name: odd.name,
                  startdate: todaysdate(0),
                  debtorcatagory: tmp99,
                  type1: "Sale",
                  noc: odd.noc,
                  lastcommdate: "N/A",
                  lastcommdetails: "N/A",
                  contactno: odd.contactdetails,

                  setreminder: '1',
                  tripdetails: todaysdate(0) + '::' + t2 + '\n'
                  //reminder set or not  

               }
               console.log(details3);

            }

            var Ref224 = db.collection("debt").doc(shorten2(odd.noc) + odd.contactdetails);
            batch.set(Ref224, details3);




         }).catch(function (error) {
            console.log("Error getting document:", error);
         });






         //Debt Reminder ends here
      }
      //add reminder
      else//for etransfer and cheque recordvbank details
      {
         odd.postdelivery["bankname"] = $("#postbnkname").val();
         odd.postdelivery["bankdetails"] = $("#postbnkdetails").val();
         odd.postdelivery["payamt"] = rembal;
      }
      //if Company vehicle is used for transport
      if (odd.predelivery.vehregno != undefined) {
         var oil, dis, exp, hazirabal;
         oil = parseFloat($("#postoilconsumed").val());
         dis = parseFloat($("#postdistance").val());
         exp = parseFloat($("#postoilcost").val()) || 0;
         hazirabal = parseFloat($("#hazirabal").val()) || 0;
         var docRef = db.collection("dash1/vehicledetails/selfoutflow").doc(odd.predelivery.vehregno);

         docRef.get().then(function (doc) {



            vehdetails = doc.data();

            vehdetails.last_milage = dis / oil;

            vehdetails.totaldistance += dis;
            vehdetails.totalfuel += oil;
            vehdetails.avgmilage = vehdetails.totaldistance / vehdetails.totalfuel;
            vehdetails.totalcost += (oil * balances.fuelprice) + exp;
            vehdetails.runningcost = (vehdetails.totalcost / vehdetails.totaldistance).toFixed(2);



            console.log(vehdetails);

            var Ref225 = db.collection("dash1/vehicledetails/selfoutflow").doc(odd.predelivery.vehregno);
            batch.set(Ref225, vehdetails);

         });

         //Recording hazira and other charges for unloading

         if (odd.predelivery.unloadcharges > 0) {
            if (exp > 0 || hazirabal > 0)

               notes += "/n" + todaysdate(6) + "for order of" + odd.name + " extrapayment in hazira=" + hazirabal + " in misc exp:" + exp;



            odd.predelivery.unloadcharges = parseFloat(odd.predelivery.unloadcharges) + hazirabal;
            balances.balancelist[odd.noc + "bal"] -= odd.predelivery.unloadcharges;
            balances.balancelist["masterbalance"] -= odd.predelivery.unloadcharges;
            balances.balancelist[user + 'bal'] -= odd.predelivery.unloadcharges;

            details1 = {
               amount: odd.predelivery.unloadcharges,
               balance: balances.balancelist[odd.noc + "bal"],
               date: todaysdate(4),
               description: "Unloading Charges for Invno" + odd.postdelivery.invno + "for" + odd.name,
               expensehead: "Outflow:Expense:Labour",
               masterbalance: balances.balancelist["masterbalance"],
               userbal: balances.balancelist[user + 'bal'],

               tid: todaysdate(2),
               user: user,
               noc: odd.noc
            };

            var Ref227 = db.collection("Accounts/mdb/main").doc(todaysdate(2));
            batch.set(Ref227, details1);
         }

         general.vehiclesonduty[odd.predelivery.vehregno] = general.vehiclesonduty[odd.predelivery.vehregno] + dis;

         //update vehdetais add distance to general.vehdetails,self outflow
         console.log(general.vehiclesonduty);

      }

      //Stock reduction
      if (odd.tradetype == "Sale") {
         Object.keys(k2).forEach(function (element23) {

            balances.Products[odd.noc][element23]['qty'] = balances.Products[odd.noc][element23]['qty'] - k2[element23]['qty'];
            balances.Products[odd.noc][element23]['value'] = balances.Products[odd.noc][element23]['value'] - k2[element23]['value'];
            //set general,balances,odd



            console.log(balances.Products[odd.noc]);
            stockinfo["stock"] = balances.Products[odd.noc] || "N.A";
            stockinfo["prostock"] = balances.Procurement[odd.noc] || "N.A";
            stockinfo["massage"] += element23 + "reduced to quantity:" + balances.Products[odd.noc][element23]['qty'] + "value updated to: " + balances.Products[odd.noc][element23]['value'] + "/n";
            stockinfo["item"] = element23 + "-";
         });
         stockinfo["type1"] = "Products";
      }
      else if (odd.tradetype == "Trade") {
         notes += '\n ' + todaysdate(6) + "Trading done for order of m/s" + odd.name;

         Object.keys(k2).forEach(function (element23) {

            balances.Procurement[odd.noc][element23]['qty'] = balances.Procurement[odd.noc][element23]['qty'] - k2[element23]['qty'];
            balances.Procurement[odd.noc][element23]['value'] = balances.Procurement[odd.noc][element23]['value'] - k2[element23]['value'];
            //set general,balances,odd



            console.log(balances.Procurement[odd.noc]);
            stockinfo["stock"] = balances.Products[odd.noc] || "N.A";
            stockinfo["prostock"] = balances.Procurement[odd.noc] || "N.A";
            stockinfo["massage"] += element23 + "reduced to quantity:" + balances.Procurement[odd.noc][element23]['qty'] + "value updated to: " + balances.Procurement[odd.noc][element23]['value'] + "/n";
            stockinfo["item"] = element23 + "-";
         });
         stockinfo["type1"] = "Procurement";

      }

      stockinfo["time"] = todaysdate(4);

      stockinfo["noc"] = odd.noc;
      stockinfo["type2"] = "Reduction";



      var Ref231 = db.collection("Accounts/stockregister/" + odd.noc).doc(todaysdate(2));
      batch.set(Ref231, stockinfo);


      var Ref228 = db.collection("dash1").doc("general");
      batch.set(Ref228, general);

      if (odd.predelivery.invtyp == "1" || odd.predelivery.invtyp == "3" || odd.predelivery.invtyp == "5")
         var Ref229 = db.collection("billofsupply").doc(odd.postdelivery["docname"]);
      else if (odd.predelivery.invtyp == "2" || odd.predelivery.invtyp == "4" || odd.predelivery.invtyp == "6")
         var Ref229 = db.collection("invoices").doc(odd.postdelivery["docname"]);

      //odd to transfer to past invoices delete the last

      batch.set(Ref229, odd);
      var Ref230 = db.collection("Settings").doc("Accounts");
      batch.set(Ref230, balances);

      details2 = {
         content: notes,
         date: todaysdate(5)
      };

      var Ref231 = db.collection("notes").doc((todaysdate(5)).toString());
      batch.set(Ref231, details2);
      var laRef = db.collection("Orders").doc(lastoid);
      batch.delete(laRef);


      setTimeout(function () {

         batch.commit().then(function () {

            $('#form89').trigger("reset");
            $('body').loadingModal('hide');
            swal("Trip Recorded!", "You may proceed!", "success");



            //close loading modal
         });
      }, 3000);

   });

   //neutralise vehicles
   $("#neutralise").click(function () {

      notes += '<br>' + todaysdate(6) + "::Vehicles neutralised:" + Object.keys(general.vehiclesonduty).toString();
      general.vehiclesonduty = {};
      datainsert("dash1/general", general);


      details2 = {
         date: todaysdate(5),
         content: notes
      };

      datainsert("notes/" + todaysdate(5), details2);
      swal("Neutralized!", "Vehicles Neutralised-Now Empty!", "success");

   });

   $("#katabtn").click(function () {
      var amtff = parseInt($("#kata").val());
      balances.balancelist["nnbcbal"] += amtff;
      balances.balancelist["masterbalance"] += amtff;
      balances.balancelist[user + 'bal'] += amtff;
      details3 = {
         amount: amtff,
         balance: balances.balancelist["nnbcbal"],
         date: todaysdate(4),
         description: 'Kata Inflow',
         expensehead: "Inflow:KATA",
         masterbalance: balances.balancelist["masterbalance"],
         userbal: balances.balancelist[user + 'bal'],

         tid: todaysdate(2),
         user: user,
         noc: "N N & CO"
      };
      datainsert("Accounts/mdb/main/" + todaysdate(2), details3);
      datainsert("Settings/Accounts", balances);
      swal("Sucess", "Transaction Sucessfull", "success");
   });

});

function auocomplete1() {
   console.log(general.vehiceno);
   $("#vehregno").autocomplete({
      source: general.vehiceno
   });
}
function autocomplete2(stt, arr) {
   console.log(arr)
   $("#" + stt).autocomplete({
      source: arr
   });
}

function autocomplete3(stt, arr) {
   console.log(arr)
   $("#" + stt).autocomplete({

      source: function (request, response) {
         response($.ui.autocomplete.filter(arr, request.term));
      },
      change: function (event, ui) {
         if (ui.item == null) {
            $("#" + stt).val("");
            $("#" + stt).focus();
         }

      }
   });
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
function shorten2(s) {

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
function datainsert(dbextn, arr2) {

   db.doc(dbextn).set(arr2)
      .then(function () {
         console.log("Document written with ID: ");
      })
      .catch(function (error) {
         console.error("Error adding document: ", error);
      });
};


function generalset(general) {
   db.collection("dash1").doc("general").set(general)
      .then(function () {
         console.log("Document successfully written!");

         $('body').loadingModal('hide');
         swal("Transaction Recorded!", "You may proceed!", "success");

      })
      .catch(function (error) {
         console.error("Error writing document: ", error);
         swal("Error", error, "error");
         $('body').loadingModal('hide');
      });
}


function getid(idi) {

   idi1 = idi;
   console.log(idi1);

};

function getid2(idi) {

   swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Order!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   })
      .then((willDelete) => {
         if (willDelete) {

            db.collection("Orders").doc(idi).delete().then(function () {
               swal("Your Order has been deleted!", {
                  icon: "success",
               });
            }).catch(function (error) {
               console.error("Error removing document: ", error);
            });



         } else {
            swal("Your order is safe!");
         }
      });

};
function getid3(idi) {
   accdetailsarr = [];
   console.log(ifcd[idi] + '+' + ofcd[idi]);
   var l1, l2, l3;
   if (ifcd[idi] != undefined)
      l1 = Object.keys(ifcd[idi]).length;
   else
      l1 = 0;
   if (ofcd[idi] != undefined)
      l2 = Object.keys(ofcd[idi]).length;
   else
      l2 = 0;

   if (l1 > l2)
      l3 = l1;
   else
      l3 = l2;


   for (i = 0; i < l3; i++) {

      if (l1 == 0) {
         accdetails = {

            iflowdes: "-",
            inflowamt: "-",
            outflowdes: Object.keys(ofcd[idi])[i] || "-",
            outflowamt: Object.values(ofcd[idi])[i] || "-"

         };
      }
      else if (l2 == 0) {
         accdetails = {

            iflowdes: Object.keys(ifcd[idi])[i] || "-",
            inflowamt: Object.values(ifcd[idi])[i] || "-",
            outflowdes: "-",
            outflowamt: "-"

         };
      }
      else {
         accdetails = {

            iflowdes: Object.keys(ifcd[idi])[i] || "-",
            inflowamt: Object.values(ifcd[idi])[i] || "-",
            outflowdes: Object.keys(ofcd[idi])[i] || "-",
            outflowamt: Object.values(ofcd[idi])[i] || "-"

         };
      }
      accdetailsarr.push(accdetails);
   }

   //Datatables here
   $('#accdetailsadd').DataTable().destroy();
   var table = $('#accdetailsadd').DataTable({
      data: accdetailsarr,
      "destroy": true, responsive: true,
      "columns": [
         { data: "iflowdes" },
         { data: "inflowamt" },
         { data: "outflowdes" },
         { data: "outflowamt" }


      ],
      dom: 'Bfrtip',
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });





   console.log(accdetailsarr);
};





function getid32(idi) {
   accdetailsarr = [];
   console.log(ifud[idi] + '+' + ofud[idi]);
   var l1, l2, l3;
   if (ifud[idi] != undefined)
      l1 = Object.keys(ifud[idi]).length;
   else
      l1 = 0;
   if (ofud[idi] != undefined)
      l2 = Object.keys(ofud[idi]).length;
   else
      l2 = 0;

   if (l1 > l2)
      l3 = l1;
   else
      l3 = l2;


   for (i = 0; i < l3; i++) {

      if (l1 == 0) {
         accdetails = {

            iflowdes: "-",
            inflowamt: "-",
            outflowdes: Object.keys(ofud[idi])[i] || "-",
            outflowamt: Object.values(ofud[idi])[i] || "-"

         };
      }
      else if (l2 == 0) {
         accdetails = {

            iflowdes: Object.keys(ifud[idi])[i] || "-",
            inflowamt: Object.values(ifud[idi])[i] || "-",
            outflowdes: "-",
            outflowamt: "-"

         };
      }
      else {
         accdetails = {

            iflowdes: Object.keys(ifud[idi])[i] || "-",
            inflowamt: Object.values(ifud[idi])[i] || "-",
            outflowdes: Object.keys(ofud[idi])[i] || "-",
            outflowamt: Object.values(ofud[idi])[i] || "-"

         };
      }
      accdetailsarr.push(accdetails);
   }

   //Datatables here
   $('#accdetailsadd').DataTable().destroy();
   var table = $('#accdetailsadd').DataTable({
      data: accdetailsarr,
      "destroy": true, responsive: true,
      "columns": [
         { data: "iflowdes" },
         { data: "inflowamt" },
         { data: "outflowdes" },
         { data: "outflowamt" }


      ],
      dom: 'Bfrtip',
      buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
      ]
   });





   console.log(accdetailsarr);
};


function getid4(idi4) {
   temp6 = "";
   $("#postorderextra").html('');
   $("#postremdate").prop('disabled', true);
   $("#postremdetails").prop('disabled', true);
   $("#selfdelivery").hide();

   $("#postpaytype").change(function () {
      if ($("#postpaytype option:selected").val() == "1") {
         $("#unpaiddiv").hide();
         $("#epaydiv").hide();
      }

      else if ($("#postpaytype option:selected").val() == "4") {
         $("#unpaiddiv").show();
         $("#epaydiv").hide();
         $("#postremdate").prop('disabled', false);
         $("#postremdetails").prop('disabled', false);

      }
      else {
         $("#unpaiddiv").hide();
         $("#epaydiv").show();
      }
   });

   db.collection("Orders").doc(idi4)
      .get().then(function (doc) {
         console.log("Current data: ", doc.data());
         lastoid = idi4;
         odd = doc.data();
         k2 = doc.data().stockinfo;
         console.log(k2);
         if (doc.data().predelivery.vehregno != undefined) {
            $("#selfdelivery").show();

         }


         Object.keys(k2).forEach(function (element22) {
            temp6 = `
             <br>     
              <div class="input-group mb-3">
  <h5>${element22}</h5>

  <input autocomplete="off" type="text" class="form-control" id="${element22 + 'qty'}" style="margin:4px;" value="${k2[element22]["qty"]}" placeholder="Quantity" >
  <input autocomplete="off" type="text" class="form-control" id="${element22}value" style="margin:4px;" value="${k2[element22]["value"]}" placeholder="Value">
      <h5>${balances.Products[doc.data().noc][element22]["unit"]}</h5>
<button type="button" class="btn btn-info btn-sm" style="margin:4px;" id="${element22}" 
onclick="getid7('${element22}')">Update</button>
  
              
  </div>`;

         });
         $("#postorderextra").append(temp6);


      });


};
function getid7(idi7) {
   console.log(idi7);
   notes += '<br> ' + todaysdate(6) + "::stock value for ordere no " + odd.postdelivery.invno + "changed from" + JSON.stringify(odd.stockinfo[idi7]);
   odd.stockinfo[idi7]['qty'] = parseFloat($('#' + idi7 + 'qty').val());
   odd.stockinfo[idi7]["value"] =
      parseFloat($('#' + idi7 + 'value').val());
   notes += "to " + JSON.stringify(odd.stockinfo[idi7]) + '<br> ';
   details2 = {
      content: notes,
      date: todaysdate(5)
   };
   datainsert("notes/" + todaysdate(5), details2);
   console.log(odd.stockinfo);
}


//// for sidebar

function openNav() {
   document.getElementById("mySidebar").style.width = "250px";
   //document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
   document.getElementById("mySidebar").style.width = "0";
   //document.getElementById("main").style.marginLeft = "0";
}

//// showing the divs 

const showDiv = (id) => {
   document.getElementById('cont0').style.display = 'none';
   document.getElementById('cont1').style.display = 'none';
   document.getElementById('cont2').style.display = 'none';
   document.getElementById('cont3').style.display = 'none';
   document.getElementById('cont4').style.display = 'none';
   document.getElementById('cont5').style.display = 'none';
   document.getElementById('cont6').style.display = 'none';
   document.getElementById('cont7').style.display = 'none';
   document.getElementById(id).style.display = 'block';

   closeNav();
}