
// Initialize Cloud Firestore through Firebase

var general, balances, details, details2, user, self2, lease2, supplier2, days, tmp, laboursource, generalvehreport, currentUid, privilages, email;

var objj = {};




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


      console.log(privilages);

   } else {
      // Sign out operation. Reset the current user UID.  
      currentUid = null;
      console.log("no user signed in");
   }
});

laboursource = [];
generalvehreport = [];
db.collection("Settings/Production Extra/labour").get().then(function (querySnapshot) {

   querySnapshot.forEach(function (doc) {
      tmp = doc.data();
      tmp["type"] = doc.id;
      objj[doc.id] = doc.data();
      laboursource.push(tmp);
   });
   console.log(objj);
   console.log(laboursource);


   $('#labourstat').DataTable().destroy();
   var table = $('#labourstat').DataTable({
      data: laboursource,
      "destroy": true,
      responsive: true,
      "columns": [
         { data: "type" },
         { data: "avgexpense" },
         { data: "avgrate" },
         { data: "balance" },
         { data: "projected" },
         { data: "mismatch" },
         { data: "currentwastage" },
         { data: "avgwastage" }


      ]
   });








   //general for transport
   db.collection("Settings/Production Extra/earthinputs").doc("load")
      .get().then(function (doc) {
         general = doc.data();
         console.log(general);
         days = parseInt((general.seasonenddate - parseInt(todaysdate(4))) / 86400000);
         //console.log(days);
         tmp = general.totalcost;
         tmp["type"] = "Total cost";
         generalvehreport.push(tmp);

         tmp = general.totaldistance;
         tmp["type"] = "Total Distance";
         generalvehreport.push(tmp);

         tmp = general.totalfuel;
         tmp["type"] = "Total Fuel";
         generalvehreport.push(tmp);

         tmp = general.totalweight;
         tmp["type"] = "Total Weight";
         generalvehreport.push(tmp);


         console.log(generalvehreport);






         //get the balances of bbi and individual
         db.collection("Settings").doc("Accounts")
            .get().then(function (doc) {
               balances = doc.data();
               console.log(balances);

               //get the transport details here
               db.collection("Settings/Production Extra/earthinputs/vehicletype/self").get().then(function (querySnapshot) {
                  self2 = [];
                  querySnapshot.forEach(function (doc) {
                     self2.push(doc.data());
                  });

                  console.log(self2);
                  db.collection("Settings/Production Extra/earthinputs/vehicletype/lease").get().then(function (querySnapshot) {
                     lease2 = [];
                     querySnapshot.forEach(function (doc) {
                        lease2.push(doc.data());
                     });

                     console.log(lease2);
                     db.collection("Settings/Production Extra/earthinputs/vehicletype/supplier").get().then(function (querySnapshot) {
                        supplier2 = [];
                        querySnapshot.forEach(function (doc) {
                           supplier2.push(doc.data());
                        });

                        console.log(supplier2);

                        //set all the datatables

                        //Datatables here

                        //1.self
                        $('#selfstat').DataTable().destroy();
                        var table = $('#selfstat').DataTable({
                           data: self2,
                           "destroy": true,
                           responsive: true,
                           "columns": [
                              { data: "regno" },
                              { data: "catagory" },
                              { data: "expectedmilage" },
                              { data: "last_milage" },
                              { data: "avgmilage" },
                              { data: "avgweight" },
                              { data: "avgcostperbrick" }


                           ]
                        });
                        //2.lease
                        $('#leasestat').DataTable().destroy();
                        var table = $('#leasestat').DataTable({
                           data: lease2,
                           "destroy": true,
                           responsive: true,
                           "columns": [
                              { data: "regno" },
                              { data: "catagory" },
                              { data: "expectedmilage" },
                              { data: "last_milage" },
                              { data: "avgmilage" },
                              { data: "avgweight" },
                              { data: "avgcostperbrick" }


                           ]
                        });

                        //3.Supplier
                        $('#supplierstats').DataTable().destroy();
                        var table = $('#supplierstats').DataTable({
                           data: supplier2,
                           "destroy": true,
                           responsive: true,
                           "columns": [
                              { data: "name" },
                              { data: "catagory" },
                              { data: "avgweight" },
                              { data: "avgcostperbrick" },
                              { data: "ratepertrip" }

                           ]
                        });


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







                        $('body').loadingModal('hide');

                     });
                  });
               });
            });
         autocomplete(general['self']);
         console.log(general['bedowner']);
         autocom2(general['bedowner']);
      });

   //Preloding 1.accounts(general) 2.earthinputs 3.vehicle details
});




$(document).ready(function () {
   $("#dateset").datepicker({ orientation: 'bottom', autoclose: true, startDate: new Date(), todayHighlight: true });
   var pacount, pahdcount, paexpense, counter, wastage, ownership, ownership2, catagory, vehno, rate, avgwt;


   ownership = $("#ownership :selected").val();



   $("#ownership").change(function () {
      ownership = $("#ownership :selected").val();

      if (ownership == "self") {
         console.log(ownership);
         $("#vehnoo").text("Vehicle Reg No");
         $("#self1").show();
         $("#lease").hide()
      }
      else if (ownership == "lease") {
         console.log(ownership);
         $("#vehnoo").text("Vehicle Reg No");
         $("#self1").hide();
         $("#lease").show();
      }
      else {
         console.log(ownership);

         $("#vehnoo").text("Supplier Name");
         $("#self1").hide();
         $("#lease").hide();
      }
   });
   ownership2 = $("#ownership2 :selected").val();

   $("#ownership2").change(function () {
      ownership2 = $("#ownership2 :selected").val();

      if (ownership2 == "self") {
         console.log(general[ownership2]);
         autocomplete(general[ownership2]);
         $("#totalfuelcharges").removeAttr('disabled');
         $("#suppliername2").removeAttr('disabled');
         $("#vehno2").text("Vehicle Reg No");
         $("#self2").show();
         $("#maintainance2").attr("placeholder", "Maintainance(₹)");
      }
      else if (ownership2 == "lease") {
         console.log(general[ownership2]);
         autocomplete(general[ownership2]);
         $("#totalfuelcharges").removeAttr('disabled');
         $("#suppliername2").removeAttr('disabled');
         console.log(ownership2);
         $("#vehno2").text("Vehicle Reg No");
         $("#self2").show();
         $("#maintainance2").attr("placeholder", "Advance(₹)");
      }
      else {
         autocomplete(general[ownership2]);
         console.log(ownership2);
         $("#totalfuelcharges").prop('disabled', true);
         $("#suppliername2").prop('disabled', true);


         $("#vehno2").text("Supplier Name");
         $("#self2").hide();
         $("#maintainance2").attr("placeholder", "Maintainance(₹)");
      }
   });
   $("#btnreg").click(function (event) {
      event.preventDefault();
      console.log("hello");

      catagory = $("#vehicletype :selected").val();
      vehno = $("#vehicleregno").val();
      rate = parseInt($("#ratepertrip").val());
      avgwt = parseFloat($("#avgwt").val());
      if (ownership == "self") {
         details = {
            ownership: ownership,
            catagory: catagory,
            regno: vehno,
            ratepertrip: rate,
            avgweight: avgwt,
            expectedmilage: parseFloat($("#expectedmilage1").val()),
            compilance: parseFloat($("#compilancecharges").val()),
            unloadingcharges: parseFloat($("#unloadingcharges").val()),
            driversal: parseFloat($("#driversal").val()),
            driverfooding: parseFloat($("#driversfooding2").val()),
            numberoftrips: 0,
            avgmilage: 'unknown',
            totaldistance: 0,
            totalfuel: 0,
            last_milage: 'unknown',
            totalcost: 0,
            avgcostperbrick: 0,
            totalweight: 0

         }


      }
      else if (ownership == "lease") {

         details = {
            ownership: ownership,
            catagory: catagory,
            regno: vehno,
            ratepertrip: rate,
            avgweight: avgwt,
            expectedmilage: parseFloat($("#expectedmilage").val()),
            unloadingcharges: parseFloat($("#unloadamt").val()),
            lease: parseFloat($("#leaseamt").val()),
            leasor: $("#leasor").val(),
            driverfooding: parseFloat($("#driversfooding1").val()),
            numberoftrips: 0,
            avgmilage: 'unknown',
            totaldistance: 0,
            totalfuel: 0,
            last_milage: 'unknown',
            totalcost: 0,
            totalweight: 0,
            avgcostperbrick: 0

         }

      }
      else if (ownership == "supplier") {
         details = {
            ownership: ownership,
            catagory: catagory,
            name: vehno,
            ratepertrip: rate,
            avgweight: avgwt,
            totalweight: 0,
            totalcost: 0,
            numberoftrips: 0,
            avgcostperbrick: 0
         };

      }

      general[ownership].push(vehno);


      //batch transactions starts here
      var batch = db.batch();
      //update earthinputs
      var Ref1 = db.collection("Settings/Production Extra/earthinputs/vehicletype" + '/' + ownership).doc(vehno);
      batch.set(Ref1, details);

      // Update general
      var Ref2 = db.collection("Settings/Production Extra/earthinputs").doc("load");
      batch.set(Ref2, general);


      batch.commit().then(function () {
         swal("Registered!", "You may proceed!", "success");
      });



   });

   $("#btnrecord").click(function () {
      var tripnos, bedowner, oil, distance, maintainance, fuelcharges, totalcharges, ttt;
      var obj3 = {};
      tripnos = parseInt($("#nooftrips2").val());
      console.log(tripnos);
      bedowner = $("#suppliername2").val();
      vehno = $("#vehicleregno2").val();
      totalcharges = 0;
      db.collection("Settings/Production Extra/earthinputs/vehicletype/" + ownership2).doc(vehno)
         .get().then(function (doc) {
            console.log("Current data: ", doc.data());
            obj3 = doc.data();
            oil = parseFloat($("#oilconsumed2").val());
            distance = parseFloat($("#distravel2").val());
            maintainance = parseFloat($("#maintainance2").val());

            if (ownership2 == "self") {
               console.log("oil=" + oil);

               fuelcharges = parseFloat($("#totalfuelcharges").val());
               catagory = obj3["catagory"];
               console.log(catagory);

               obj3.numberoftrips = parseInt(obj3.numberoftrips) + tripnos;

               obj3.totaldistance = parseFloat(obj3.totaldistance) + (distance * tripnos);
               general.totaldistance[catagory] = parseFloat(general.totaldistance[catagory]) + (distance * tripnos);
               obj3.totalfuel = parseFloat(obj3.totalfuel) + oil;
               general.totalfuel[catagory] = parseFloat(general.totalfuel[catagory]) + oil;
               obj3.last_milage = (distance * tripnos) / oil;
               totalcharges = parseFloat(obj3.driversal) / 25 + tripnos * parseFloat(obj3.unloadingcharges) +
                  parseFloat(obj3.ratepertrip) + parseFloat(obj3.driverfooding) + fuelcharges + parseFloat(obj3.compilance) / 25 + maintainance;
               obj3.totalcost = parseFloat(obj3.totalcost) + parseFloat(totalcharges);
               general.totalcost[catagory] = parseFloat(general.totalcost[catagory]) + totalcharges
               obj3.avgmilage = (obj3.totaldistance / obj3.totalfuel);
               obj3.totalweight = parseFloat(obj3.totalweight) + (tripnos * parseFloat(obj3.avgweight));
               general.totalweight[catagory] = parseFloat(general.totalweight[catagory]) + (tripnos * parseFloat(obj3.avgweight));
               obj3.avgcostperbrick = parseFloat(obj3.totalcost) / parseFloat(obj3.totalweight) * parseFloat(general.brickwt);
               totalcharges = parseFloat(totalcharges) - parseFloat(obj3.driversal) / 25 + parseFloat(obj3.compilancecharges) / 25;

               balances.balancelist["bbibal"] -= totalcharges;
               balances.balancelist["masterbalance"] -= totalcharges;
               balances.balancelist[user + 'bal'] -= totalcharges;

               details2 = {
                  amount: totalcharges,
                  date: todaysdate(4),
                  expensehead: "Outflow:Procurement:Earth Procurement:" + ownership2,
                  suppplier: bedowner,
                  description: vehno + ':' + "Earth Trip",
                  user: user,
                  balance: balances.balancelist["bbibal"],
                  masterbalance: balances.balancelist["masterbalance"],
                  userbal: balances.balancelist[user + 'bal'],
                  noc: "BANIK BRICK INDUSTRIES",
                  tid: todaysdate(2)

               };

            }
            else if (ownership2 == "lease") {

               fuelcharges = parseFloat($("#totalfuelcharges").val());
               catagory = obj3["catagory"];
               console.log(catagory);

               obj3.numberoftrips += tripnos;
               obj3.totaldistance += distance * tripnos;
               general.totaldistance[catagory] = parseFloat(general.totaldistance[catagory]) + distance * tripnos;
               obj3.totalfuel += parseFloat(obj3.totalfuel) + oil;
               general.totalfuel[catagory] = parseFloat(obj3.totalfuel[catagory]) + oil;

               obj3.last_milage = (distance * tripnos) / oil;
               totalcharges = parseFloat(obj3.lease) / 25 + tripnos * parseFloat(obj3.unloadingcharges) +
                  parseFloat(obj3.ratepertrip) + parseFloat(obj3.driverfooding) + fuelcharges;
               obj3.totalcost = parseFloat(obj3.totalcost) + parseFloat(totalcharges);
               general.totalcost[catagory] = parseFloat(general.totalcost[catagory]) + totalcharges

               obj3.totalweight = parseFloat(obj3.totalweight) + (tripnos * parseFloat(obj3.avgweight));
               general.totalweight[catagory] = parseFloat(general.totalweight[catagory]) + (tripnos * parseFloat(obj3.avgweight));
               //obj3.avgcostperbrick=parseFloat(obj3.totalcost)/parseFloat(obj3.totalweight)*parseFloat(general.brickwt);
               totalcharges = parseFloat(totalcharges) - parseFloat(obj3.lease) / 25;
               balances.balancelist["bbibal"] -= totalcharges;
               balances.balancelist["masterbalance"] -= totalcharges;
               balances.balancelist[user + 'bal'] -= totalcharges;
               obj3.avgmilage = (obj3.totaldistance / obj3.totalfuel);

               //obj3.avgcostperbrick=(obj3.totalcost/obj3.totalweight)*general[brickwt];
               totalcharges -= parseFloat(obj3.lease / 25);
               details2 = {
                  amount: totalcharges,
                  date: todaysdate(4),
                  expensehead: "Outflow:Procurement:Earth Procurement:" + ownership2,
                  suppplier: bedowner,

                  description: vehno + ':' + "Earth Trip",
                  user: user,
                  balance: balances.balancelist["bbibal"],
                  masterbalance: balances.balancelist["masterbalance"],
                  userbal: balances.balancelist[user + 'bal'],
                  noc: "BANIK BRICK INDUSTRIES",
                  tid: todaysdate(2)
               };

            }
            else if (ownership2 == "supplier") {


               obj3.totalweight = parseFloat(obj3.totalweight) + tripnos * parseFloat(obj3.avgweight);
               obj3.numberoftrips += tripnos;
               totalcharges = tripnos * parseFloat(obj3.ratepertrip);
               obj3.totalcost += totalcharges;

               obj3.avgcostper = general.brickwt * (obj3.totalcost / obj3.totalweight);

               balances.balancelist["bbibal"] -= totalcharges;
               balances.balancelist["masterbalance"] -= totalcharges;
               balances.balancelist[user + 'bal'] -= totalcharges;


               details2 = {
                  amount: totalcharges,
                  date: todaysdate(4),
                  expensehead: "Outflow:Procurement:Earth Procurement:" + ownership2,
                  suppplier: bedowner,
                  description: vehno + ':' + "Earth Trip",
                  user: user,
                  balance: balances.balancelist["bbibal"],
                  masterbalance: balances.balancelist["masterbalance"],
                  userbal: balances.balancelist[user + 'bal'],
                  noc: "BANIK BRICK INDUSTRIES"

               };
            }


            var time = todaysdate(2);
            //batch transactions starts here
            var batch = db.batch();


            var Ref1 = db.collection("Settings/Production Extra/earthinputs/vehicletype" + '/' + ownership2).doc(vehno);
            batch.set(Ref1, obj3);

            // Update general
            var Ref2 = db.collection("Settings/Production Extra/earthinputs").doc("load");
            batch.set(Ref2, general);

            //update accounts
            var Ref3 = db.collection("Accounts/mdb/main").doc(time);
            batch.set(Ref3, details2);
            //update the balance array
            var Ref4 = db.collection("Settings").doc("Accounts");
            batch.set(Ref4, balances);

            // Commit the batch
            batch.commit().then(function () {
               swal("Trips Recorded!", "You may proceed!", "success");
            });



         }).catch(function (error) {
            console.log("Error getting document:", error);
         });
   });



   //Labour Records Starts Here  


   $("#myform1").submit(function (e) {
      console.log(objj);
      e.preventDefault();
      console.log("pathai");
      pacount = parseInt($("#pacount").val());
      pahdcount = parseInt($("#pahdcount").val());
      paexpense = parseInt($("#paexpense").val());
      objj.pthai.count += 1;
      counter = objj.pthai.count;
      objj.pthai.balance += pacount;
      objj.pthai.target -= pacount;
      objj.pthai.expense += parseFloat((paexpense / pacount).toFixed(2));
      objj.pthai.avgexpense = parseFloat((objj.pthai.expense / counter).toFixed(2));
      objj.pthai.totalproductivit += parseFloat((pacount / pahdcount).toFixed(2));
      objj.pthai.avgprod = parseFloat((objj.pthai.totalproductivit / counter).toFixed(2));
      objj.pthai.avgrate = parseFloat((objj.pthai.balance / counter).toFixed(2));
      objj.pthai.projected = parseFloat((days * objj.pthai.avgrate).toFixed(2));
      objj.pthai.mismatch = parseFloat((objj.pthai.target - objj.pthai.projected).toFixed(2));
      labourupdate(paexpense, "pthai"); //spelling mistake here pthai not pathai
      document.getElementById("myform1").reset();
      console.log(objj.pthai);

      datainsert("Settings/Production Extra/labour/pthai", objj.pthai);
      notes += todaysdate(6) + ":Pathai expense=" + paexpense + "<br>";
      var details33 = {
         content: notes,
         date: todaysdate(5)
      }
      datainsert("notes/" + todaysdate(5).toString(), details33);
      document.getElementById("myform1").reset();

   });

   $("#myform2").submit(function (e) {
      e.preventDefault();
      bhocount = (parseFloat($("#bhocount").val())) * (objj.bhojai.chambersize);//total number of bricks
      console.log(bhocount);
      reja = parseInt($("#reja").val()) * objj.bhojai.rejaunit;//no of bricks by reja

      van = parseInt($("#van").val()) * objj.bhojai.vanunit;//no of bricks by van
      others = parseInt($("#outside").val()) * objj.bhojai.othersunit;//no of bricks by van
      console.log("reja=" + reja + "van=" + van + "others=" + others);
      bhoexpense = parseFloat($("#bhoexpense").val());
      console.log(bhoexpense + "/n" + (reja + van + others));
      wastage = (reja + van + others) - bhocount;//in nos 
      console.log("wastage=" + wastage);
      console.log(bhocount + "&&" + bhoexpense);
      objj.bhojai.count += 1;
      counter = objj.bhojai.count;
      console.log(counter);
      objj.bhojai.balance += bhocount;
      objj.bhojai.target -= bhocount;
      objj.bhojai.expense += parseFloat(bhoexpense / (bhocount - wastage).toFixed(2));
      objj.bhojai.avgexpen = parseFloat((objj.bhojai.expense / counter).toFixed(2));
      objj.bhojai.avgrate = objj.bhojai.balance / counter;
      //better to have bhajai/time
      objj.bhojai.totalwastage += wastage; objj.bhojai.currentwastage = parseFloat(((wastage / bhocount) * 100).toFixed(2));
      // in %age 
      objj.bhojai.avgewastage = parseFloat(((objj.bhojai.totalwastage / objj.bhojai.balance) * 100).toFixed(2));//%age
      objj.bhojai.projected = objj.bhojai.avgrate * days;
      objj.bhojai.mismatch = parseFloat((objj.bhojai.target - objj.bhojai.projected).toFixed(2));
      notes += todaysdate(6) + ":Bhojai expense=" + bhoexpense + "<br>";
      var details33 = {
         content: notes,
         date: todaysdate(5)
      }
      datainsert("notes/" + todaysdate(5).toString(), details33);
      console.log(objj.bhojai);
      labourupdate(bhoexpense, "bhojai");

      datainsert("Settings/Production Extra/labour/bhojai", objj.bhojai);
      document.getElementById("myform2").reset();
   });

   $("#myform3").submit(function (e) {
      e.preventDefault();
      console.log("jhukai");
      var jhoexpense = parseFloat($("#jhoexpense").val());
      var jhocount = parseFloat($("#jhocount").val()) * objj.jhokai.chambersize;

      console.log(jhoexpense);
      counter = ++(objj.jhokai.count);
      objj.jhokai.balance += jhocount;
      objj.jhokai.target -= jhocount;

      objj.jhokai.avgexpense += parseFloat(((jhoexpense + parseFloat($("#coalexp").val()) + parseFloat($("#afexp").val())) / jhocount).toFixed(2));
      objj.jhokai.avgrate = parseFloat((objj.jhokai.balance / counter).toFixed(2));
      objj.jhokai.projected = parseFloat((objj.jhokai.avgrate * days).toFixed(2));
      objj.jhokai.mismatch = parseFloat((objj.jhokai.target - objj.jhokai.projected).toFixed(2));
      objj.jhokai.totalcoal = parseFloat((objj.jhokai.totalcoal + parseFloat($("#totalcoal").val())).toFixed(2));
      objj.jhokai.coalcost = parseFloat(objj.jhokai.coalcost + parseFloat($("#coalexp").val()).toFixed(2));
      objj.jhokai.totalaf = parseFloat(objj.jhokai.totalaf + parseFloat($("#totalaf").val()).toFixed(2));
      objj.jhokai.afcost = parseFloat(objj.jhokai.afcost + parseFloat($("#afexp").val()).toFixed(2));

      notes += todaysdate(6) + ":Jhokai expense=" + jhoexpense + "<br>";
      var details33 = {
         content: notes,
         date: todaysdate(5)
      }
      datainsert("notes/" + todaysdate(5).toString(), details33);
      labourupdate(jhoexpense, "jhokai");
      console.log(objj.jhokai);

      datainsert("Settings/Production Extra/labour/jhokai", objj.jhokai);


      document.getElementById("myform3").reset();
   });

   $("#myform4").submit(function (e) {
      e.preventDefault();
      console.log("kholai");
      khocount1 = parseFloat($("#khocount").val());
      khocount = khocount1 * objj.kholai.chambersize;
      khoexpense = parseFloat($("#khoexpense").val());
      khowastage = parseFloat($("#khowastage").val());//number of bricks
      objj.kholai.count += 1;
      counter = objj.kholai.count;
      objj.kholai.balance += parseFloat(khocount.toFixed(2) - khowastage);//number of bricks not chamber wise
      objj.kholai.target -= parseInt(khocount);
      objj.kholai.expense += parseFloat((khoexpense / (khocount - khowastage)).toFixed(2));//inclusive of wastage
      objj.kholai.avgexpen = parseFloat((objj.kholai.expense / counter).toFixed(2));
      objj.kholai.avgrate = parseFloat((objj.kholai.balance / counter).toFixed(2));
      objj.kholai.currentwastage += parseFloat((khowastage / (khocount - khowastage) * 100).toFixed(2));//last %age
      objj.kholai.avgwastage = parseFloat(((objj.kholai.avgwastage + objj.kholai.currentwastage) / 2).toFixed(2));//wastage %age
      objj.kholai.projected = parseFloat((objj.kholai.avgrate * days).toFixed(2));
      objj.kholai.mismatch = parseFloat((objj.kholai.target - objj.kholai.projected).toFixed(2));

      labourupdate(khoexpense, "kholai");
      //Stock Update

      balances.Products["BANIK BRICK INDUSTRIES"]["Bricks"]["qty"] += khocount1 - (khowastage);
      balances.Products["BANIK BRICK INDUSTRIES"]["Brick Bats"]["qty"] += khowastage * 1.176;
      balances.Products["BANIK BRICK INDUSTRIES"]["Bricks"]["value"] += (khocount1 - (khowastage)) * (objj.pthai.expense + objj.bhojai.expense + objj.jhokai.expense + objj.kholai.expense);
      balances.Products["BANIK BRICK INDUSTRIES"]["Brick Bats"]["value"] += khowastage * (objj.pthai.expense + objj.bhojai.expense + objj.jhokai.expense + objj.kholai.expense);

      details2 = {
         time: todaysdate(4),
         noc: "BANIK BRICK INDUSTRIES",
         stock: balances.Products["BANIK BRICK INDUSTRIES"],
         type1: "Products",
         type2: "Addition",
         stock: balances.Products["BANIK BRICK INDUSTRIES"] || "N.A",
         prostock: balances.Procurement["BANIK BRICK INDUSTRIES"] || "N.A",
         item: "Bricks",
         massage: "Bricks increased to quantity:" + balances.Products["BANIK BRICK INDUSTRIES"]["Bricks"]["qty"] + "value updated to:" + balances.Products["BANIK BRICK INDUSTRIES"]["Bricks"]["value"] + " && Brick Bats increased to quantity:" + balances.Products["BANIK BRICK INDUSTRIES"]["Brick Bats"]["qty"] + " && value upadated to:" + balances.Products["BANIK BRICK INDUSTRIES"]["Bricks"]["value"]

      };
      datainsert("Settings/Accounts", balances);
      datainsert("Accounts/stockregister/BANIK BRICK INDUSTRIES" + '/' + todaysdate(2), details2);
      notes += todaysdate(6) + ":Kholai expense=" + khoexpense + "<br>";
      var details33 = {
         content: notes,
         date: todaysdate(5)
      }
      datainsert("notes/" + todaysdate(5).toString(), details33);


      datainsert("Settings/Production Extra/labour/kholai", objj.kholai);

      console.log(objj.kholai);
      document.getElementById("myform4").reset();
   });


   //Season End date

   $("#datesetbtn").click(function () {

      general.seasonenddate = Date.parse($("#dateset").val());
      console.log(Date.parse($("#dateset").val()));
      datainsert("Settings/Production Extra/earthinputs/load", general);
      swal("Date Updated!", "You may proceed!", "success");

   });

});




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
function labourupdate(totalcharges, type) {
   balances.balancelist["bbibal"] -= totalcharges;
   balances.balancelist["masterbalance"] -= totalcharges;
   balances.balancelist[user + 'bal'] -= totalcharges;
   var time = todaysdate(2);
   //batch transactions starts here
   var batch = db.batch();
   console
   //update production extra labour
   var Ref1 = db.collection("Settings/Production Extra/labour").doc(type);
   batch.set(Ref1, objj[type]);


   details2 = {
      amount: totalcharges,
      balance: balances.balancelist["bbibal"],
      date: todaysdate(4),
      description: type + "Expense",
      expensehead: "Outflow:Expense:Labour",
      masterbalance: balances.balancelist["masterbalance"],
      userbal: balances.balancelist[user + 'bal'],
      tid: time,
      user: user,
      noc: "BANIK BRICK INDUSTRIES"
   };

   //update accounts
   var Ref3 = db.collection("Accounts/mdb/main").doc(time);
   batch.set(Ref3, details2);
   //update the balance array
   var Ref4 = db.collection("Settings").doc("Accounts");
   batch.set(Ref4, balances);

   // Commit the batch
   batch.commit().then(function () {
      swal("Labour data Recorded!", "You may proceed!", "success");
   }).catch(function (error) {
      console.log("Error getting document:", error);
   });

}

function autocomplete(s) {
   console.log(s);
   $(function () {

      $("#vehicleregno2").autocomplete({
         source: s
      });
   });
}




function autocom2(s1) {
   console.log(s1);
   $("#suppliername2").autocomplete({
      source: function (request, response) {
         response($.ui.autocomplete.filter(s1, request.term));
      },
      change: function (event, ui) {
         $("#add2").toggle(!ui.item);
      }
   });

   $("#add2").on("click", function () {
      s1.push($("#suppliername2").val());
      console.log(s1);
      general['bedowner'] = s1;
      $(this).hide();
   });
};

function goback() {
   if (privilages == "admin")
      window.location = "dash-Admin.html";
   else
      window.location = "dash-xxx22.html";
}

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
   document.getElementById('section1').style.display = 'none';
   document.getElementById('section2').style.display = 'none';
   document.getElementById('section3').style.display = 'none';
   document.getElementById(id).style.display = 'block';

   closeNav();
}