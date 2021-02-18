var general;
//general db
db.collection('dash1')
   .doc('general')
   .get()
   .then(function (doc) {
      general = doc.data();
      gendisplay = [];
      console.log(general);
      auocomplete1();
      autocomplete2('prevehassigned', general['vehiceno']);
   });

function auocomplete1() {
   console.log(general.vehiceno);
   $('#vehregno').autocomplete({
      source: general.vehiceno,
   });
}
function autocomplete2(stt, arr) {
   console.log(arr);
   $('#' + stt).autocomplete({
      source: arr,
   });
}

function autocomplete3(stt, arr) {
   console.log(arr);
   $('#' + stt).autocomplete({
      source: function (request, response) {
         response($.ui.autocomplete.filter(arr, request.term));
      },
      change: function (event, ui) {
         if (ui.item == null) {
            $('#' + stt).val('');
            $('#' + stt).focus();
         }
      },
   });
}

$('#btnaccess').click(function () {
   $('#myModal222').modal('hide');
   // var uid, pass, sum;
   // uid = $('#uid2').val();
   // pass = $('#pass2').val();
   // sum = uid + pass;

   // if (sum == balances.keywrd) {
   //    uid = $('#uid2').val('');
   //    pass = $('#pass2').val('');

   // } else {
   //    uid = $('#uid2').val('');
   //    pass = $('#pass2').val('');
   //    $('#para1').show();
   // }
});


function todaysdate(nn) {
   var d = new Date();
   var s, t, dd, mm, yy;
   s = t = '';

   yy = d.getFullYear();

   t = d.getMonth() + 1;
   if (t < 10) t = '0' + t;
   mm = t;

   t = d.getDate();
   if (t < 10) t = '0' + t;
   dd = t;

   if (nn == 0) s = yy + '-' + mm + '-' + dd;
   else if (nn == 2)
      s =
         dd +
         '-' +
         mm +
         '-' +
         yy +
         ':' +
         d.getHours() +
         ':' +
         d.getMinutes() +
         ':' +
         d.getSeconds();
   else if (nn == 3) s = yy + '' + mm + dd;
   else if (nn == 4) s = d.getTime();
   else if (nn == 5) s = Date.parse(mm + '/' + dd + '/' + yy);
   else if (nn == 6)
      s = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();

   return s;
}

selectas = $('#selectactivity :selected').val();

$('#selectactivity').change(function () {
   selectas = $('#selectactivity :selected').val();
   astyp = $('#assignmenttype :selected').val();
   $('#driname').hide();
   if (astyp != 'none') fieldchange();
});

$('#form1').submit(function (e) {
   e.preventDefault();
   time = todaysdate(2);
   astyp = $('#assignmenttype :selected').val();
   var tdiff = todaysdate(4) - todaysdate(5);
   $('body').loadingModal('show');
   stockinfo = {};
   //original content starts here
   var details3, details4, wedge, worknos, otheramt, tmp;
   if (selectas == 'assign') {
      if (astyp == 'stone') {
         bootstrapValidate(
            '#vehregstone',
            'required:This Field is required!'
         );

         if ($('#vehregstone').val() != '') {
            general.Stone.staged.push($('#vehregstone').val());
            console.log(general.Stone.staged);
            generalset(general);
         } else {
            swal('Retry', 'Importent Fields Missing', 'error');
            $('body').loadingModal('hide');
         }
      } else if (astyp == 'vehicledriver') {
         bootstrapValidate(
            ['#drivername1', '#foodingamt'],
            'required:This Field is required!'
         );
         if ($('#drivername1').val() != '' && tdiff <= 32400000) {
            general.vehicledriver['onduty'][
               $('#drivername1').val()
            ] = parseFloat($('#foodingamt').val());
            general.vehicledriver.totalfooding =
               parseFloat(general.vehicledriver.totalfooding) +
               parseFloat($('#foodingamt').val());
            generalset(general);
         } else {
            swal(
               'Retry',
               'Importent Fields Missing or Incorrect Timings',
               'error'
            );
            $('body').loadingModal('hide');
         }
         //add fooding amount respective to name load from payroll db and enter
      } else if (astyp == 'dailywedge') {
         bootstrapValidate(
            ['#wedge', '#worknos'],
            'required:This Field is required!'
         );
         if (
            $('#wedge').val() != '' &&
            $('#worknos').val() != '' &&
            tdiff <= 32400000
         ) {
            wedge = parseFloat($('#wedge').val());
            worknos = parseInt($('#worknos').val());

            general.hazira.totalworkers += worknos;
            general.hazira.totalwedge += wedge;

            generalset(general);
         } else {
            swal(
               'Retry',
               'Importent Fields Missing or Incorrect Timings',
               'error'
            );
            $('body').loadingModal('hide');
         }
      } else {
         swal('Retry', 'Importent Fields Missing', 'error');
         $('body').loadingModal('hide');
      }
   } else if (selectas == 'pay') {
      if (astyp == 'stone') {
         if (
            $('#avgwtstone').val() != '' &&
            $('#payamtstone').val() != '' &&
            $('#vehregstone2').val() != '' &&
            $('#amtduestone').val() != ''
         ) {
            flag1 = 0;
            var wt, valuee;
            wt = parseInt($('#avgwtstone').val());
            otheramt = parseFloat($('#payamtstone').val());
            console.log(otheramt);
            details4 = {
               vehreg: $('#vehregstone2').val().toUpperCase(),
               payamt: otheramt,
               amtdue:
                  parseFloat($('#amtduestone').val()) - otheramt,
               exittime: time,
               wt: wt,
               time: todaysdate(4),
            };
            //Stock increment

            balances.Products['STONE CRUSHING MILL']['STONE CHIPS'][
               'qty'
            ] =
               balances.Products['STONE CRUSHING MILL'][
               'STONE CHIPS'
               ]['qty'] +
               wt * (1 - general.dustratio);
            balances.Products['STONE CRUSHING MILL']['STONE DUST'][
               'qty'
            ] =
               balances.Products['STONE CRUSHING MILL'][
               'STONE DUST'
               ]['qty'] +
               wt * general.dustratio;

            balances.Products['STONE CRUSHING MILL']['STONE CHIPS'][
               'value'
            ] =
               balances.Products['STONE CRUSHING MILL'][
               'STONE CHIPS'
               ]['value'] +
               amt * 0.8;
            balances.Products['STONE CRUSHING MILL']['STONE DUST'][
               'qty'
            ] =
               balances.Products['STONE CRUSHING MILL'][
               'STONE DUST'
               ]['value'] +
               amt * 0.2;

            //insert to stock register

            stockinfo['stock'] =
               balances.Products['STONE CRUSHING MILL'] || 'N.A';
            stockinfo['prostock'] =
               balances.Procurement['STONE CRUSHING MILL'] || 'N.A';
            stockinfo['time'] = todaysdate(4);
            stockinfo['type1'] = 'Products';
            stockinfo['noc'] = 'STONE CRUSHING MILL';
            stockinfo['type2'] = 'Addition';
            stockinfo['item'] = 'STONE CHIPS';
            stockinfo['massage'] =
               'STONE CHIPS increased to quantity:' +
               balances.Products['STONE CRUSHING MILL'][
               'STONE CHIPS'
               ]['qty'] +
               'value updated to:' +
               balances.Products['STONE CRUSHING MILL'][
               'STONE CHIPS'
               ]['value'] +
               ' && STONE DUST increased to quantity:' +
               balances.Products['STONE CRUSHING MILL'][
               'STONE DUST'
               ]['qty'] +
               ' && value upadated to:' +
               balances.Products['STONE CRUSHING MILL'][
               'STONE DUST'
               ]['value'];

            datainsert(
               'Accounts/stockregister/STONE CRUSHING MILL/' +
               todaysdate(2),
               stockinfo
            );

            console.log(details4);
            general.Stone.staged.splice(
               general.Stone.staged.lastIndexOf(
                  $('#vehregstone').val()
               ),
               1
            );
            general.Stone.tripnos += 1;
            general.Stone.lastexitdate = todaysdate(4);
            balances.balancelist['bscmbal'] -= otheramt;
            balances.balancelist['masterbalance'] -= otheramt;
            balances.balancelist[user + 'bal'] -= otheramt;
            details3 = {
               amount: otheramt,
               balance: balances.balancelist['bscmbal'],
               date: todaysdate(4),
               description:
                  $('#vehregstone2').val() +
                  'Inflow Trip' +
                  'Weight=' +
                  wt,
               expensehead: 'Outflow:Procurement:RIVER STONE',
               masterbalance: balances.balancelist['masterbalance'],
               userbal: balances.balancelist[user + 'bal'],
               suppplier: 'Self',
               tid: todaysdate(2),
               user: user,
               noc: 'STONE CRUSHING MILL',
            };
            //add stone truck details
            //add dash details here
            db.collection('dash1/vehicledetails/stonedue')
               .doc($('#vehregstone2').val())
               .get()
               .then(function (doc) {
                  if (doc.exists) {
                     details5 = doc.data();
                     details5.tripnos += 1;
                     (details5.totalwt += parseInt(
                        $('#avgwtstone').val()
                     )),
                        (details5.totalpay += otheramt);
                     details5.dueamt +=
                        parseFloat($('#amtduestone').val()) -
                        otheramt;
                     console.log(details5);
                     var Ref2 = db
                        .collection('dash1/vehicledetails/stonedue')
                        .doc($('#vehregstone2').val());
                     Ref2.set(details5)
                        .then(function () {
                           console.log(
                              'Document successfully written!'
                           );
                           $('#form1').trigger('reset');
                        })
                        .catch(function (error) {
                           console.error(
                              'Error writing document: ',
                              error
                           );
                        });
                  } else {
                     // doc.data() will be undefined in this case
                     console.log('No such document!');
                  }
               })
               .catch(function (error) {
                  swal('Error getting document:', error, 'error');
               });
         } else flag1 = 1;
      } else if (astyp == 'vehicledriver') {
         if (
            $('#otheramt').val() != '' &&
            $('#drivername').val() != '' &&
            tdiff <= 54000000
         ) {
            otheramt = parseInt($('#otheramt').val());
            console.log($('#driname').val());
            delete general.vehicledriver.onduty[
               $('#drivername').val()
            ];
            console.log(general.vehicledriver.onduty);
            general.vehicledriver.totalfooding -= otheramt;
            balances.balancelist['bbibal'] -= otheramt;
            balances.balancelist['masterbalance'] -= otheramt;
            balances.balancelist[user + 'bal'] -= otheramt;
            details3 = {
               amount: otheramt,
               balance: balances.balancelist['bbibal'],
               date: todaysdate(4),
               description: $('#drivername1').val() + ' Fooding',
               expensehead:
                  'Outflow:Expense:SelfVehicleExp:Driver Fooding',
               masterbalance: balances.balancelist['masterbalance'],
               suppplier: 'Self',
               tid: todaysdate(2),
               user: user,
               userbal: balances.balancelist[user + 'bal'],
               noc: 'BRICK INDUSTRIES',
            };
         } else {
            swal(
               'Retry',
               'Importent Fields Missing or wrong timeslot',
               'error'
            );
            $('body').loadingModal('hide');
         }
      } else if (astyp == 'dailywedge') {
         if ($('#otheramt').val() != '' && tdiff <= 54000000) {
            otheramt = parseFloat($('#otheramt').val());
            general.hazira.totalwedge -= otheramt;

            if (general.hazira.totalwedge <= 0)
               general.hazira.totalworkers = 0;

            balances.balancelist['bbibal'] -= otheramt;
            balances.balancelist['masterbalance'] -= otheramt;
            balances.balancelist[user + 'bal'] -= otheramt;
            details3 = {
               amount: otheramt,
               balance: balances.balancelist['bbibal'],
               date: todaysdate(4),
               description: 'Daily Wadge(Hazira)',
               expensehead: 'Outflow:Expense:Labour',
               masterbalance: balances.balancelist['masterbalance'],
               suppplier: 'Self',
               userbal: balances.balancelist[user + 'bal'],
               tid: todaysdate(2),
               user: user,
               noc: 'BRICK INDUSTRIES',
            };

            console.log(details3);
         } else {
            swal(
               'Retry',
               'Importent Fields Missing or wrong timeslot',
               'error'
            );
            $('body').loadingModal('hide');
         }
      }

      if (flag1 == 0) {
         //batched update
         //3.stone self and stone due(>0) only for sto
         var batch = db.batch();

         //batched transactions

         var Ref3 = db.collection('dash1').doc('general');
         batch.set(Ref3, general); //ok
         //update the balance array
         var Ref4 = db.collection('Settings').doc('Accounts');
         batch.set(Ref4, balances); //ok

         //Add the transaction
         var Ref5 = db.collection('Accounts/mdb/main').doc(time);
         batch.set(Ref5, details3); //ok

         if (astyp == 'stone') {
            var Ref1 = db
               .collection('dash1/vehicledetails/stoneinflowtrips')
               .doc('#' + todaysdate(4));

            batch.set(Ref1, details4); //trip register
         }

         // Commit the batch
         batch
            .commit()
            .then(function () {
               $('body').loadingModal('hide');
               swal(
                  'Trip Recorded!',
                  'You may proceed!',
                  'success'
               );
            })
            .catch(function (error) {
               $('body').loadingModal('hide');
               swal(
                  'Error getting document!-Fields Missing',
                  error,
                  'error'
               );
            });
      } else {
         $('body').loadingModal('hide');
         swal('Imp Fields Missing', 'error');
      }
   }
});


$('#vehicletype').change(function () {
   if ($('#vehicletype option:selected').val() == 'Stone') {
      $('#others1').hide();
      $('#others2').hide();
      $('#stone2').show();
   } else {
      $('#stone2').hide();
      $('#others1').show();
      $('#others2').show();
   }
});

$('#assignmenttype').change(function () {
   $('#driname').hide();
   astyp = $('#assignmenttype option:selected').val();

   console.log(astyp);
   if (astyp == 'stone') {
      autocomplete2('vehregstone', general.Stone.stonereg);
      autocomplete3('vehregstone2', general.Stone.staged);
   } else if (astyp == 'vehicledriver') {
      autocomplete3(
         'drivername',
         Object.keys(general.vehicledriver.onduty)
      );
      $('#hazirapaybal').html(general.vehicledriver.totalfooding);
   } else {
      $('#hazirapaybal').html(general.hazira.totalwedge);
      $('#vehregstone').attr('autocomplete', 'off');
      $('#vehregstone2').attr('autocomplete', 'off');
      $('#drivername').attr('autocomplete', 'off');
   }
   fieldchange();
});

function fieldchange() {
   var temp55;
   temp55 = astyp;
   if (selectas == 'pay' && astyp != 'stone' && astyp != 'none')
      astyp = 'other';
   //console.log(temp5);
   $(temp5).hide();
   if (astyp != 'none') {
      temp5 = '#' + selectas + astyp;
      //console.log(temp5);

      $(temp5).show();
      if (temp55 == 'vehicledriver' && astyp == 'other')
         $('#driname').show();
   }
}

$('#form2').submit(function (e) {
   e.preventDefault();
   console.log('form2');
   $('body').loadingModal('show');
   //Jquery overlay

   //orginal content starts here

   var vehno, details2, time;
   vehno = $('#vehregno').val();

   console.log(general.vehiclesonduty[vehno]);
   if (!general.vehiclesonduty.hasOwnProperty(vehno))
      general.vehiclesonduty[vehno] = parseInt(
         $('#distravel2').val()
      );
   else
      general.vehiclesonduty[vehno] =
         parseFloat(general.vehiclesonduty[vehno]) +
         parseFloat($('#distravel2').val());

   console.log(general.vehiclesonduty);
   time = todaysdate(2);
   var docRef = db
      .collection('dash1/vehicledetails/selfoutflow')
      .doc(vehno);

   docRef
      .get()
      .then(function (doc) {
         console.log(doc.data());
         if (doc.exists) {
            console.log('Document data:', doc.data());
            console.log(balances);

            vehdetails = doc.data();
            vehdetails.last_milage = vehdetails.avgmilage;

            vehdetails.totaldistance += parseInt(
               $('#distravel2').val()
            );
            vehdetails.totalfuel += parseInt(
               $('#oilconsumed2').val()
            );
            vehdetails.avgmilage =
               vehdetails.totaldistance / vehdetails.totalfuel;
            vehdetails.totalcost +=
               parseInt($('#totalfuelcharges').val()) +
               parseInt($('#maintainance2').val());
            vehdetails.runningcost = (
               vehdetails.totalcost / vehdetails.totaldistance
            ).toFixed(2);
            balances.balancelist['bbibal'] -=
               parseInt($('#totalfuelcharges').val()) +
               parseInt($('#maintainance2').val());
            balances.balancelist['masterbalance'] -=
               parseInt($('#totalfuelcharges').val()) +
               parseInt($('#maintainance2').val());
            balances.balancelist[user + 'bal'] -=
               parseInt($('#totalfuelcharges').val()) +
               parseInt($('#maintainance2').val());

            details2 = {
               amount:
                  parseInt($('#totalfuelcharges').val()) +
                  parseInt($('#maintainance2').val()),
               balance: balances.balancelist['bbibal'],
               date: todaysdate(4),
               description: vehno + ':' + $('#triptype2').val(),
               expensehead: 'Outflow:Expense:SelfVehicleExp',
               masterbalance: balances.balancelist['masterbalance'],
               userbal: balances.balancelist[user + 'bal'],
               suppplier: 'Self',
               tid: time,
               user: user,
               noc: 'BRICK INDUSTRIES',
            };
            console.log('details->');
            console.log(details2);
            var batch = db.batch();
            //batched transactions

            var Ref3 = db
               .collection('dash1/vehicledetails/selfoutflow')
               .doc(vehno);
            batch.set(Ref3, vehdetails);
            //update the balance array
            var Ref4 = db.collection('Settings').doc('Accounts');
            batch.set(Ref4, balances);

            //update the balance array
            var Ref5 = db.collection('Accounts/mdb/main').doc(time);
            batch.set(Ref5, details2);
            //update dash geneal
            var Ref6 = db.collection('dash1').doc('general');
            batch.set(Ref6, general);

            // Commit the batch
            batch
               .commit()
               .then(function () {
                  $('body').loadingModal('hide');
                  swal(
                     'Trip Recorded!',
                     'You may proceed!',
                     'success'
                  );
               })
               .catch(function (error) {
                  console.log('Error getting document:', error);
               });
         } else {
            // doc.data() will be undefined in this case
            $('body').loadingModal('hide');
            swal(
               'Invalid Regitration number!',
               'Re enter the Registration Number!',
               'error'
            );
         }
      })
      .catch(function (error) {
         console.log('Error getting document:', error);
      });
});


$('#btnreg').click(function () {
   console.log('user=' + user);
   $('body').loadingModal('show');
   $('#registervehicle').modal('toggle');
   var catagory, vehno, avgwt;
   console.log('Register Vehicle');
   console.log($('#driversfooding1').val());
   catagory = $('#vehicletype :selected').val();

   vehno = $('#modalvehregno').val();
   console.log(vehno);
   avgwt = parseFloat($('#avgwt').val());
   if (catagory == 'Stone') {
      details5 = {
         tripnos: 0,
         totalwt: 0,
         totalpay: 0,
         dueamt: 0,
         regno: vehno,
         source: $('#stonesource').val(),
      };
      general.Stone['stonereg'].push(vehno);
      var batch = db.batch();
      //batched transactions

      var Ref3 = db
         .collection('dash1/vehicledetails/stonedue')
         .doc(vehno);
      batch.set(Ref3, details5);
   } else {
      details = {
         catagory: catagory,
         regno: vehno,
         weight: avgwt,
         expectedmilage: parseFloat($('#expectedmilage').val()),
         compilance: parseFloat($('#compilancecharges').val()),
         driversal: parseFloat($('#driversal').val()),
         driverfooding: parseFloat($('#driversfooding1').val()),
         avgmilage: 0,
         totaldistance: 0,
         totalfuel: 0,
         last_milage: 0,
         totalcost: 0,
         runningcost: 0,
      };
      console.log(general.vehiceno);
      general.vehiceno.push(vehno);

      var batch = db.batch();
      //batched transactions

      var Ref3 = db
         .collection('dash1/vehicledetails/selfoutflow')
         .doc(vehno);
      batch.set(Ref3, details);
   }
   //update the balance array
   var Ref4 = db.collection('dash1').doc('general');
   batch.set(Ref4, general);

   // Commit the batch
   batch
      .commit()
      .then(function () {
         $('body').loadingModal('hide');
         swal('Vehicle Registered!', 'You may proceed!', 'success');
         $('#form3').trigger('reset');
      })
      .catch(function (error) {
         $('body').loadingModal('hide');
         swal('Error', error, 'error');
         $('#form3').trigger('reset');
      });
});

