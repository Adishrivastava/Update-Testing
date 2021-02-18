$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce',
});
// Initialize Cloud Firestore through Firebase
var noc,
   customerdetails,
   companydetails,
   c3,
   p3,
   noc2,
   invno,
   inv2,
   date,
   taxableamt,
   finalamt,
   tgst,
   fstr,
   bnkdt,
   count,
   temp,
   sp,
   gst,
   gst1,
   odd,
   currentUid,
   privilages,
   email,
   temp95;

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
   } else {
      // Sign out operation. Reset the current user UID.
      currentUid = null;
      console.log('no user signed in');
   }
});
companydetails = customerdetails = c3 = p3 = '';


var oid = localStorage.getItem('oid') || document.cookie;
console.log(oid);
//recieve all these info from pre order and post order array
//
db.collection('Settings')
   .doc('Accounts')
   .onSnapshot(function (doc2) {
      general = doc2.data();
      console.log(general);

      //this is for orders
      db.collection('Orders')
         .doc(oid)
         .onSnapshot(function (doc) {
            console.log(doc.data());
            odd = doc.data();
            noc = shorten(doc.data().noc);
            console.log(noc);
            //this is for company details
            if (doc.data().gstin != 'N/A')
               c3 = '\nGSTIN:' + doc.data().gstin;
            customerdetails = `Name:${doc.data().name}${c3}\n${
               doc.data().billaddress
               }`;
            p3 = `Place of supply:${
               doc.data().placeofsupply
               }\n Transport Details:${
               doc.data().predelivery.vehregno || 'N.A'
               }`;
            console.log(customerdetails);
            //place for product list insert to table
            count = 1;
            sp = gst1 = gst = 0;
            temp = '';
            doc.data().productlist.forEach(function (element) {
               console.log(element);
               sp += element.quantity * element.rateperunit;
               gst1 =
                  element.quantity *
                  ((element.rateperunit * element.gstrate) / 100);
               gst += gst1;

               temp95 =
                  general['Products'][doc.data().noc] ||
                  general['Procurement'][doc.data().noc];

               console.log(temp95);

               if (doc.data().saletype == 'Intra-State') {
                  temp += `<tr><td>${count++}</td>
<td>${element.product + '-' + element.description}</td>
<td>${temp95[element.product]['hsn']}</td>
<td>${element.rateperunit}</td>
<td>${element.quantity}</td>
<td>${Number(element.quantity * element.rateperunit).toFixed(2)}</td>  

<td>${Number(gst1 / 2).toFixed(2)}</td>  
<td>${Number(gst1 / 2).toFixed(2)}</td>  
<td>0</td>
<td>${Number(element.quantity * element.rateperunit + gst1).toFixed(
                     2
                  )}</td>  </tr>`;
               } else {
                  temp += `<tr><td>${count++}</td>
<td>${element.product + '-' + element.description}</td>
<td>${temp95[element.product]['hsn']}</td>
<td>${element.rateperunit}</td>
<td>${element.quantity}</td>
<td>${Number(element.quantity * element.rateperunit).toFixed(2)}</td>  

<td>0</td>
<td>0</td>  
<td>${Number(gst1).toFixed(2)}</td> 
<td>${Number(element.quantity * element.rateperunit + gst1).toFixed(
                     2
                  )}</td>  </tr>`;
               }
            });
            console.log(temp);

            $('#tbody').append(temp);

            console.log(p3);

            db.collection('Settings/invoicing/Companies')
               .doc(doc.data().noc)
               .onSnapshot(function (doc2) {
                  console.log('Current data: ', doc2.data());
                  noc2 = doc2.data().name;
                  companydetails += `${doc2.data().name}\nGSTIN:${
                     doc2.data().gstin
                     }\nAddress:${doc2.data().address}\nEmail:${
                     doc2.data().email
                     }\nM:${doc2.data().phone}`;
                  console.log(companydetails);
                  inv2 = doc2.data().lastgstinvno;
                  invno =
                     noc.toUpperCase() +
                     general.fy +
                     doc2.data().lastgstinvno;
                  //date=todaysdate();
                  date = '10/01/2019';
                  taxableamt = Number(sp).toFixed(2);
                  tgst = Number(gst).toFixed(2);
                  finalamt = Math.round(sp + gst);
                  fstr = `Taxable Amount:Rs${taxableamt}\n\t\t   Gst:Rs${tgst} \n\t\t   Total:Rs${finalamt} `;
                  bnkdt = `${
                     doc2.data().bankdetails.name
                     }\nAccount No-${
                     doc2.data().bankdetails.accountno
                     }\nIFSC:${doc2.data().bankdetails.ifsc}`;
               });

            $('body').loadingModal('hide');
         });
   });

function todaysdate() {
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

   s = dd + '/' + mm + '/' + yy;

   return s;
}

function shorten(s) {
   s = ' ' + s;
   var t, ch, i;
   t = '';
   for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ch == ' ' && ch != '&') t += s.charAt(i + 1);
   }
   return t.toLocaleLowerCase();
}

function PDF1() {
   var doc = new jsPDF();

   var header = function (data) {
      //logo and invoice no
      doc.text(93, 08, 'Tax Invoice');
      doc.setFontSize(20);
      doc.text(12, 15, noc2);
      doc.setFontSize(10);
      doc.text(156, 12, `Inv No:${invno}`);
      doc.text(158, 16, `Date:${date}`);
      doc.line(0, 20, 220, 20); //first top line
      doc.line(0, 51, 220, 51); //second line
      doc.line(0, 145, 220, 145); //divider horizontal line
      doc.line(80, 20, 80, 51); //first Vertical lne
      doc.line(145, 20, 145, 51); //second Vertical line

      //header
      doc.setFontSize(12);
      doc.setFont('helvetica');
      doc.setFontType('italic');
      doc.text(95, 25, 'Billing Details');
      doc.text(154, 25, 'Shipping Details');
      doc.text(147, 121, fstr);
      doc.rect(75, 116, 63, 23);
      doc.text(80, 122, bnkdt);
      doc.text(15, 120, 'Authorised Signatory');
      doc.setFontType('normal');
      doc.setFont('normal');
      doc.setFontSize(10);
      doc.text(12, 27, companydetails);
      doc.text(85, 30, customerdetails);
      doc.text(148, 30, p3);
   };
   var header2 = function (data) {
      //logo and invoice no
      doc.setFontSize(15);
      doc.text(92, 157, 'Tax Invoice');
      doc.setFontSize(20);
      doc.text(12, 164, noc2);
      doc.setFontSize(10);
      doc.text(160, 160, `Inv No:${invno}`);
      doc.text(162, 164, `Date:${date}`);
      doc.line(0, 168, 220, 168); //first top line
      doc.line(0, 197, 220, 197); //second line

      //header
      doc.setFontSize(12);
      doc.setFont('helvetica');
      doc.setFontType('italic');
      doc.text(95, 175, 'Billing Details');
      doc.text(154, 175, 'Shipping Details');
      doc.text(147, 264, fstr);
      //doc.rect(75, 262, 63, 23);
      //doc.text(80,265,bnkdt);
      doc.text(15, 262, 'Authorised Signatory');
      doc.text(80, 262, "Receiver's Signature");
      doc.text(15, 284, 'Note:-');
      doc.text(
         15,
         288,
         '#Goods must be inspected during delivery after that no complaints would be entertained!'
      );
      doc.text(
         15,
         292,
         '#All disputes are subject to Alipurduar jurisdiction only.'
      ); //change jurishdiction
      doc.setFontType('normal');
      doc.setFont('normal');
      doc.setFontSize(10);
      doc.text(12, 176, companydetails);
      doc.text(85, 180, customerdetails);
      doc.text(148, 180, p3);
   };

   var res = doc.autoTableHtmlToJson(
      document.getElementById('basic-table')
   );
   var options = {
      addPageContent: header,
      margin: {
         top: 53,
      },
   };
   var options2 = {
      addPageContent: header2,
      margin: {
         top: 205,
      },
   };
   doc.autoTable(res.columns, res.data, options);
   doc.autoTable(res.columns, res.data, options2);
   doc.setProperties({
      title: '::Invoice::',
   });

   var string = doc.output('datauristring');
   var iframe =
      "<iframe width='100%' height='100%' src='" +
      string +
      "'></iframe>";
   $('#editor').empty();
   $('#editor').append(iframe);
}
$(document).ready(function () {
   //console.log( "ready!" );
   $('#cmd').click(function () {
      PDF1();
      // body...
   });

   $('#done').click(function () {
      swal({
         title: 'Are you sure?',
         text: "Once delivered, you can't bring the last state back!",
         icon: 'warning',
         buttons: true,
         dangerMode: true,
      }).then((willenter) => {
         if (willenter) {
            odd.postdelivery['invno'] = invno;
            odd.postdelivery['invgentime'] = todaysdate(2);
            odd.postdelivery['docname'] = noc.toUpperCase() + inv2;

            db.collection('Orders')
               .doc(oid)
               .update({
                  status: 'In Progress',
                  postdelivery: odd.postdelivery,
               })
               .then(function () {
                  db.collection('Settings/invoicing/Companies')
                     .doc(noc)
                     .update({
                        lastgstinvno: parseInt(inv2) + 1,
                     })
                     .then(function () {
                        window.history.back();
                     })
                     .catch(function (error) {
                        // The document probably doesn't exist.
                        console.error(
                           'Error updating document: ',
                           error
                        );
                     });

                  window.history.back();
               })
               .catch(function (error) {
                  // The document probably doesn't exist.
                  console.error('Error updating document: ', error);
               });
         }
      });
   });

   $('#cancel').click(function () {
      window.history.back();
   });
});
