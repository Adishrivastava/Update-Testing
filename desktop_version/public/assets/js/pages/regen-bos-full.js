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
   } else {
      // Sign out operation. Reset the current user UID.
      currentUid = null;
      console.log('no user signed in');
   }
});
companydetails = customerdetails = c3 = p3 = '';


var oid = JSON.parse(
   localStorage.getItem('datain') || document.cookie
);
console.log(oid);
//recieve all these info from pre order and post order array
//
db.collection('Settings')
   .doc('Accounts')
   .onSnapshot(function (doc) {
      general = doc.data();
      console.log(general);

      //this is for orders

      odd = oid;
      noc = shorten(oid.noc);
      console.log(noc);
      //this is for company details
      // if(oid.gstin!="N/A")
      c3 = '\nM:' + oid.contactdetails;
      customerdetails = `Name:${oid.name}${c3}\n${oid.billaddress}`;
      p3 = `Place of supply:${
         oid.placeofsupply
         }\nInv No:${oid}\n Transport Details:${
         oid.predelivery.vehregno || 'N.A'
         }`;
      console.log(customerdetails);
      //place for product list insert to table
      count = 1;
      sp = gst1 = gst = 0;
      temp = '';
      oid.productlist.forEach(function (element) {
         console.log(element);
         sp += element.quantity * element.rateperunit;
         gst1 =
            element.quantity *
            ((element.rateperunit * element.gstrate) / 100);
         gst += gst1;

         console.log(general['Products'][oid.noc]);

         temp += `<tr><td>${count++}</td>
     <td>${element.product + '-' + element.description}</td>
   

     <td>${element.rateperunit}</td>
     <td>${element.quantity}</td>
    <td>${element.unit}</td> <td>${Number(
            element.quantity * element.rateperunit
         ).toFixed(2)}</td>  
      
     
     </tr>`;
      });
      console.log(temp);

      $('#tbody').append(temp);

      console.log(p3);
      db.collection('Settings/invoicing/Companies')
         .doc(oid.noc)
         .onSnapshot(function (doc2) {
            console.log('Current data: ', doc2.data());
            noc2 = doc2.data().name;
            companydetails += `${doc2.data().name}\nGSTIN:${
               doc2.data().gstin
               }\nAddress:${doc2.data().address}\nEmial::${
               doc2.data().email
               }\nM:${doc2.data().phone}`;
            console.log(companydetails);
            inv2 = doc2.data().lastbillno;
            invno = odd.postdelivery.invno;
            date = odd.postdelivery.invgentime;
            taxableamt = Number(sp).toFixed(2);
            tgst = Number(gst).toFixed(2);
            finalamt = Math.round(sp + gst);
            fstr = `Taxable Total=Rs${taxableamt} `;
            bnkdt = `${doc2.data().bankdetails.name}\nAccount No-${
               doc2.data().bankdetails.accountno
               }\nIFSC:${doc2.data().bankdetails.ifsc}`;
         });

      $('body').loadingModal('hide');
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

   var elementHandler = {
      '#ignorePDF': function (element, renderer) {
         return true;
      },
   };
   var source = window.document.getElementById('capture');
   var header = function (data) {
      //logo and invoice no
      doc.setFontSize(20);
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(1);
      doc.line(75, 20, 120, 20);
      doc.setLineWidth(0.5);
      doc.text(77, 17, 'Bill of Supply');
      doc.text(12, 33, noc2);
      doc.setFontSize(10);
      doc.text(161, 32, `Invoice No:${invno}`);
      doc.text(161, 36, `Date:${date}`);
      doc.line(0, 40, 220, 40); //first top line
      doc.line(0, 71, 220, 71); //second line

      doc.line(105, 40, 105, 71); //second horizontal lne
      doc.line(0, 255, 220, 255);
      //header
      doc.setFontSize(14);
      doc.setFont('helvetica');
      doc.setFontType('italic');
      // doc.text(95, 45, "Billing Details");
      doc.text(134, 45, 'Customer Details');
      doc.text(143, 264, fstr);
      doc.rect(71, 260, 68, 23);
      doc.text(72, 265, bnkdt);
      doc.text(12, 261, 'Authorised Signatory');
      doc.setFontType('normal');
      doc.setFont('normal');
      doc.setFontSize(14);
      doc.text(12, 46, companydetails);
      //doc.text(85, 50, customerdetails);
      doc.text(120, 52, customerdetails);
   };

   var res = doc.autoTableHtmlToJson(
      document.getElementById('basic-table')
   );
   var options = {
      addPageContent: header,
      margin: {
         top: 73,
      },
   };

   doc.autoTable(res.columns, res.data, options);
   doc.setProperties({
      title: '::data::',
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
            window.close();
         }
      });
   });
});
