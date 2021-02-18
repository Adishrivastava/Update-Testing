
$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce',
});

var temp,
   arr,
   v2,
   s,
   tmp,
   productlist,
   details,
   oid,
   general,
   itemscount,
   bal22,
   productdes,
   data1,
   currentUid,
   privilages,
   email;

// Track the UID of the current user.

currentUid = null;
firebase.auth().onAuthStateChanged(function (user2) {
   console.log(user2);

   var temp3;
   if (user2 && user2.uid != currentUid) {
      email = user2.email;
      currentUid = user2.uid;
      temp3 = user2.displayName;
      $('#usermsg').html(temp3);
      console.log(user2);
      user = temp3.substr(0, temp3.lastIndexOf(':')) || 'null';
      console.log(user);
      privilages = temp3.substr(
         temp3.lastIndexOf(':') + 1,
         temp3.length - 1
      );

      console.log(privilages);
      if (privilages == 'nonadmin') window.location.href = 'dash-xxx22.html';
   } else {
      // Sign out operation. Reset the current user UID.
      currentUid = null;
      console.log('no user signed in');
   }
});
//load basics
bal22 = 0;
productdes = '';
db.collection('Settings')
   .doc('Accounts')
   .onSnapshot(function (doc) {
      general = doc.data();
      console.log(general);
      replacelist('noc', general['Companies']);
      if (general['Products'][general['Companies'][0]] != undefined) {
         replacelist(
            'productype',
            Object.keys(general['Products'][general['Companies'][0]])
         );
         $('#tradetyp').val('Sale');
      } else if (
         general['Procurement'][general['Companies'][0]] != undefined
      ) {
         replacelist(
            'productype',
            Object.keys(general['Procurement'][general['Companies'][0]])
         );
         $('#tradetyp').val('Trade');
      }

      replacelist('unit', general['Productunit']);

      db.collection('Settings/invoicing/Institutional-New').onSnapshot(
         function (querySnapshot) {
            var arr3 = [];
            querySnapshot.forEach(function (doc) {
               arr3.push(doc.data().name);
            });
            autocom(arr3);
         }
      );

      $('body').loadingModal('hide');
   });

$(document).ready(function () {
   itemscount = 0;
   arr = [];
   productlist = details = [];

   $('#noc').change(function () {
      $('#reset').trigger('click');
      if (
         general['Products'][$('#noc option:selected').val()] != undefined
      ) {
         replacelist(
            'productype',
            Object.keys(general['Products'][$('#noc option:selected').val()])
         );
         $('#tradetyp').val('Sale');
      } else if (
         general['Procurement'][$('#noc option:selected').val()] != undefined
      ) {
         replacelist(
            'productype',
            Object.keys(
               general['Procurement'][$('#noc option:selected').val()]
            )
         );
         $('#tradetyp').val('Trade');
      }
   });

   $('#tradetyp').change(function () {
      if ($('#tradetyp option:selected').val() == 'Sale') {
         if (
            general['Products'][$('#noc option:selected').val()] != undefined
         )
            replacelist(
               'productype',
               Object.keys(
                  general['Products'][$('#noc option:selected').val()]
               )
            );
         else {
            swal('Data Missing', 'This is a Trading only Firm', 'error');
            $('#tradetyp').val('Trade');
         }
      } else if ($('#tradetyp option:selected').val() == 'Trade') {
         if (
            general['Procurement'][$('#noc option:selected').val()] !=
            undefined
         )
            replacelist(
               'productype',
               Object.keys(
                  general['Procurement'][$('#noc option:selected').val()]
               )
            );
         else {
            swal(
               'Data Missing',
               'This is a Manufacturing only Firm',
               'error'
            );
            $('#tradetyp').val('Sale');
         }
      }
   });

   $(function () {
      $('#datepicker').datepicker({
         orientation: 'bottom',
         startDate: new Date(),
         autoclose: true,
         todayHighlight: true,
      });
   });

   //get the last oid here

   $('#myform').submit(function (evt) {
      evt.preventDefault();

      if (itemscount < 1)
         swal('Items Missing', 'Need to add at least one item', 'error');
      else {
         var name = $('#name').val();

         var noc = $('#noc').val();
         var invtyp = $('#doctyp').val();
         var invno = $('#invno').val();
         var vehno = $('#vehno').val();
         var expecdate = $('#datepicker').val();
         console.log(expecdate);
         var otherdate =
            expecdate.substring(3, 5) +
            '/' +
            expecdate.substring(0, 2) +
            '/' +
            expecdate.substring(6, 10);
         console.log(otherdate);
         expecdate = Date.parse(expecdate);
         console.log(expecdate);

         var toc = $('#toc option:selected').val();
         var placeofsupply = $('#placeofsupply').val();
         var saletype = $('#saletype option:selected').val();

         var billad = $('#billaddress').val();
         var contactdetails = $('#contactdetails').val();
         var gstin = $('#gstin').val();

         //Insert to Customer details here

         if (v === 'Retail') {
            var region = $('#region').val();
            var receieversphone = parseInt($('#receieversphone').val());
            console.log(receieversphone);
            var shipad = $('#shipaddress').val();
            details = {
               name: name,
               address: shipad,
               phone: receieversphone,
               region: region,
               noc: noc,
            };

            checkandinsert(receieversphone.toString(), v, details);
         } else if (v === 'Institutional-New') {
            details = {
               name: name,
               address: billad,
               gstin: gstin,
               contactdetails: contactdetails,
               noc: noc,
            };
            checkandinsert(gstin, v, details);
         }

         //Insert to orders
         oid = general.otherid;
         general.otherid = oid + 1;
         console.log('oid=' + oid);

         if (v === 'Retail') {
            details = {
               order_id: oid,
               name: name,
               date: otherdate,
               timest: expecdate,
               noc: $('#noc option:selected').val(),

               typeofcustomer: toc,

               placeofsupply: placeofsupply,
               saletype: saletype,
               productlist: productlist,
               region: region,
               shipaddress: shipad,
               balance: bal22,
               recieversphone: receieversphone,
               predelivery: { invtyp: invtyp, vehregno: vehno },
               postdelivery: { invno: invno, invgentime: otherdate },
               tradetype: $('#tradetyp').val(),
               productdes: productdes,
            };
         } else if (v === 'Institutional-New') {
            details = {
               order_id: oid,
               name: name,
               date: otherdate,

               noc: $('#noc option:selected').val(),
               typeofcustomer: toc,

               balance: bal22,
               placeofsupply: placeofsupply,
               timest: expecdate,
               saletype: saletype,
               productlist: productlist,
               billaddress: billad,
               gstin: gstin,
               contactdetails: contactdetails,
               predelivery: { invtyp: invtyp, vehregno: vehno },
               postdelivery: { invno: invno, invgentime: otherdate },

               tradetype: $('#tradetyp').val(),
               productdes: productdes,
            };
         } else if (v === 'Institutional-Old') {
            details = {
               order_id: oid,
               name: name,
               date: otherdate,

               noc: $('#noc option:selected').val(),
               typeofcustomer: toc,

               balance: bal22,
               placeofsupply: placeofsupply,
               timest: expecdate,
               saletype: saletype,
               productlist: productlist,
               billaddress: billad,
               gstin: gstin,
               contactdetails: contactdetails,
               predelivery: { invtyp: invtyp, vehregno: vehno },
               postdelivery: { invno: invno, invgentime: otherdate },

               tradetype: $('#tradetyp').val(),
               productdes: productdes,
            };
         }

         data1 = details;
         console.log(details);
         datainsert('otherinv/#' + shorten(noc) + oid, details);
         db.collection('Settings')
            .doc('Accounts')
            .update({
               otherid: general.otherid,
            })
            .then(function () {
               swal(
                  'Registered!',
                  'Document successfully updated!',
                  'success'
               );
               setTimeout(function () {
                  if (typeof Storage !== 'undefined') {
                     console.log('webstorage there');
                     localStorage.setItem('datain', JSON.stringify(data1));
                  } else {
                     console.log('Sorry! No Web Storage support..');
                     document.cookie = JSON.stringify(data1);
                  }

                  if (invtyp == 1) window.open('regenerate-bos-1part.html');
                  else if (invtyp == 2)
                     window.open('regenerate-gst1part.html');

               }, 2000);
            })
            .catch(function (error) {
               // The document probably doesn't exist.
               swal('Error updating document ', error, 'error');
            });
      }
   });
   $('#btn22').click(function () {
      //Product description starts here----
      itemscount++;
      var productype = $('#productype').val();

      var descrip = $('#descrip').val();

      var qty = parseFloat($('#qty').val());

      var unit = $('#unit').val();

      var rate = parseFloat($('#rateperunit').val());

      var gstrate = parseInt($('#gstrate').val());
      bal22 += rate * qty + rate * qty * (5 / 100);

      temp = `<tr><th>${productype + ' - ' + descrip}</th>
     <th>${qty + ' - ' + unit}</th>
     <th>${qty * rate}</th>
     <th>${qty * ((rate * gstrate) / 100)}</th>  
     <th>${qty * rate + qty * ((rate * gstrate) / 100)}</th> </tr>`;
      console.log(temp);

      productdes +=
         productype + ' -' + descrip + '-' + qty + ' - ' + unit + '\n';
      console.log(productdes);

      $('#tab1').show();
      $('#addtbl').append(temp);
      document.getElementById('productype').selectedIndex = 0;
      $('#descrip').val('');
      $('#qty').val('');
      document.getElementById('unit').selectedIndex = 0;
      $('#rateperunit').val('');
      $('#gstrate').val('');
      $('#reset').show('');

      temp = {
         product: productype,
         description: descrip,
         quantity: qty,
         unit: unit,
         rateperunit: rate,
         gstrate: gstrate,
      };
      productlist.push(temp);
   });

   //Reset table here
   $('#reset').click(function () {
      $('#addtbl').html(' ');
      $('#tab1').hide();
      $('#reset').hide();
      productdes = '';
      productlist = [];

      itemscount = 0;
      bal22 = 0;
   });
   var v = 'Institutional-Old';

   $('#toc').change(function () {
      v = $('#toc option:selected').val();
      console.log(v);
      if (v === 'Retail') {
         $('#name').autocomplete({
            disabled: true,
         });
         $('#unreg').show().slideDown();
         $('#newreg').hide();
      } else if (v === 'Institutional-New') {
         $('#name').autocomplete({
            disabled: true,
         });
         $('#newreg').show().slideDown();
         $('#unreg').hide();
      } else {
         $('#name').val(' ');
         $('#name').autocomplete({
            disabled: false,
         });

         $('#unreg').hide();
         $('#newreg').hide();
      }
   });
});
//replace list

function replacelist(idi, arr) {
   var $el = $('#' + idi);
   $el.empty(); // remove old options
   arr.forEach(function (element) {
      $el.append($('<option></option>').text(element));
   });
}

//Datainsert here

function datainsert(dbextn, arr2) {
   db.doc(dbextn)
      .set(arr2)
      .then(function () {
         console.log('Document written with ID: ');
      })
      .catch(function (error) {
         console.error('Error adding document: ', error);
      });
}

//Customer data entry

function checkandinsert(docname, type, arr4) {
   var docRef = db.collection('Settings/invoicing/' + type).doc(docname);

   docRef
      .get()
      .then(function (doc) {
         if (doc.exists) {
            console.log('Document data:', doc.data());
         } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
            docRef
               .set(arr4)
               .then(function () {
                  console.log('Document written with ID: ');
               })
               .catch(function (error) {
                  console.error('Error adding document: ', error);
               });
         }
      })
      .catch(function (error) {
         console.log('Error getting document:', error);
      });
}

function shorten(s) {
   s = ' ' + s;
   var t, ch, i;
   t = '';
   for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ch == ' ' && s.charAt(i + 1) != '&') t += s.charAt(i + 1);
   }
   console.log(t.toLocaleLowerCase());

   return t.toLocaleLowerCase();
}

//AUTOCOMPLETE JUST FOR NAME
function autocom(s1) {
   $('#name').autocomplete({
      source: function (request, response) {
         response($.ui.autocomplete.filter(s1, request.term));
      },
      change: function (event, ui) {
         if (ui.item == null) {
            $('#name').val('');
            $('#name').focus();

            $('#newreg').hide();
            $('#gstin').val('');
            $('#contactdetails').val('');
            $('#billaddress').val('');
         } else {
            console.log(ui.item.value);
            db.collection('Settings/invoicing/Institutional-New')
               .where('name', '==', ui.item.value)
               .get()
               .then(function (querySnapshot) {
                  querySnapshot.forEach(function (doc) {
                     // doc.data() is never undefined for query doc snapshots
                     $('#gstin').val(doc.data().gstin);
                     $('#contactdetails').val(doc.data().contactdetails);
                     $('#billaddress').val(doc.data().address);
                     $('#newreg').show();
                  });
               });
         }
      },
   });
}