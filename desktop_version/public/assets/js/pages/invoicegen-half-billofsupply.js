
// Initialize Cloud Firestore through Firebase
var noc, customerdetails, companydetails, c3, p3, noc2, invno, inv2, date, taxableamt, finalamt, tgst, fstr, bnkdt, count, temp, sp, gst, gst1, odd, currentUid, privilages, email;



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
companydetails = customerdetails = c3 = p3 = "";

var oid = localStorage.getItem("oid") || document.cookie;
console.log(oid);
//recieve all these info from pre order and post order array
//
db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      general = doc.data();
      console.log(general);

      //this is for orders
      db.collection("Orders").doc(oid)
         .onSnapshot(function (doc) {
            console.log(doc.data());
            odd = doc.data();
            noc = shorten(doc.data().noc);
            console.log(noc);
            //this is for company details
            //if(doc.data().gstin!="N/A")
            c3 = "\nM:" + doc.data().contactdetails;
            customerdetails = `Name:${doc.data().name}${c3}\n${doc.data().billaddress}`;
            p3 = `Place of supply:${doc.data().placeofsupply}\nInv No:${oid}\n Transport Details:${doc.data().predelivery.vehregno || 'N.A'}`;
            console.log(customerdetails);
            //place for product list insert to table
            count = 1; sp = gst1 = gst = 0;
            temp = "";
            doc.data().productlist.forEach(function (element) {
               console.log(element);
               sp += element.quantity * element.rateperunit;
               gst1 = element.quantity * (element.rateperunit * element.gstrate / 100);
               gst += gst1;

               console.log(doc.data());


               // console.log(general['Products'][doc.data().noc][element.product]["hsn"]);




               temp += `<tr><td>${count++}</td>
            <td>${element.product + '-' + element.description}</td>


            <td>${element.rateperunit}</td>
            <td>${element.quantity}</td>
           <td>${element.unit}</td> <td>${Number(element.quantity * element.rateperunit).toFixed(2)}</td>  


           </tr>`;







            });
            console.log(temp);

            $("#tbody").append(temp);



            console.log(p3);
            console.log(doc.data());
            db.collection("Settings/invoicing/Companies").doc(doc.data().noc)
               .onSnapshot(function (doc2) {
                  console.log("Current data: ", doc2.data());
                  noc2 = doc2.data().name;
                  companydetails += `${doc2.data().name}\nGSTIN:${doc2.data().gstin}\nAddress:${doc2.data().address}\nEmial::${doc2.data().email}\nM:${doc2.data().phone}`;
                  console.log(companydetails);
                  inv2 = +doc2.data().lastbillno;
                  invno = noc.toUpperCase() + '/' + doc2.data().lastbillno;
                  date = todaysdate();
                  taxableamt = Number(sp).toFixed(2);
                  //tgst=Number(gst).toFixed(2);
                  finalamt = Math.round(sp + gst);
                  fstr = `Total=Rs${taxableamt} `;
                  bnkdt = `${doc2.data().bankdetails.name}\nAccount No-${doc2.data().bankdetails.accountno}\nIFSC:${doc2.data().bankdetails.ifsc}`;
               });

            $('body').loadingModal('hide');

         });
   });

function todaysdate() {
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

   s = dd + '/' + mm + '/' + yy;


   return s;

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
   return t.toLocaleLowerCase();
}








function PDF1() {
   var doc = new jsPDF();



   var header = function (data) {


      //logo and invoice no
      doc.setLineWidth(0.5);
      doc.text(94, 13, "Bill of Supply");
      doc.setFontSize(20);
      doc.text(12, 25, noc2);
      doc.setFontSize(10);
      doc.text(162, 24, `Bill No:${invno}`);
      doc.text(165, 28, `Date:${date}`);
      doc.line(0, 32, 220, 32);//first top line
      doc.line(0, 63, 220, 63);//second line
      doc.line(0, 143, 220, 143);//divider horizontal line
      doc.line(105, 32, 105, 62)//first Vertical lne
      //doc.line(145, 32, 145, 62)//second Vertical line

      //header
      doc.setFontSize(12);
      doc.setFont('helvetica');
      doc.setFontType('italic');
      doc.text(120, 37, "Billing Details");
      //doc.text(154, 37, "Shipping Details");
      doc.text(150, 120, fstr);
      doc.rect(75, 116, 63, 23);
      doc.text(80, 122, bnkdt);
      doc.text(15, 120, "Authorised Signatory");
      doc.setFontType("normal");
      doc.setFont("normal");
      doc.setFontSize(10);
      doc.text(12, 39, companydetails);
      doc.text(118, 42, customerdetails);
      //doc.text(148, 42, p3 );



   };
   var header2 = function (data) {


      //logo and invoice no
      doc.setFontSize(15);
      doc.text(94, 158, "Bill of Supply");
      doc.setFontSize(20);

      doc.text(12, 169, noc2);
      doc.setFontSize(10);
      doc.text(162, 168, `Bill No:${invno}`);
      doc.text(165, 172, `Date:${date}`);
      doc.line(0, 176, 220, 176);//first top line
      doc.line(0, 205, 220, 205);//second line
      doc.line(105, 176, 105, 204)//first Vertical lne


      //header
      doc.setFontSize(12);
      doc.setFont('helvetica');
      doc.setFontType('italic');
      doc.text(120, 183, "Billing Details");
      //doc.text(154, 183, "Shipping Details");
      doc.text(150, 259, fstr);
      //doc.rect(75, 254, 63, 23);
      //doc.text(80,261,bnkdt);
      doc.text(15, 258, "Authorised Signatory");
      doc.text(80, 258, "Receiver's Signature");
      doc.text(15, 284, "Note:-");
      doc.text(15, 288, "#Goods must be inspected during delivery after that no complaints would be entertained!");
      doc.text(15, 292, "#All disputes are subject to Alipurduar jurisdiction only.");//change jurishdiction
      doc.setFontType("normal");
      doc.setFont("normal");
      doc.setFontSize(10);
      doc.text(12, 184, companydetails);
      doc.text(118, 188, customerdetails);
      //doc.text(148, 188, p3 );



   };


   var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
   var options = {
      addPageContent: header,
      margin: {
         top: 65
      },

   };
   var options2 = {
      addPageContent: header2,
      margin: {
         top: 208
      },

   };
   doc.autoTable(res.columns, res.data, options);
   doc.autoTable(res.columns, res.data, options2);
   doc.setProperties({
      title: "::Invoice::"
   });



   var string = doc.output('datauristring');
   var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"
   $("#editor").empty();
   $("#editor").append(iframe);
}
$(document).ready(function () {
   //console.log( "ready!" );
   $("#cmd").click(function () {
      PDF1();
      // body...
   });

   $("#done").click(function () {
      swal({
         title: "Are you sure?",
         text: "Once delivered, you can't bring the last state back!",
         icon: "warning",
         buttons: true,
         dangerMode: true,
      })
         .then((willenter) => {
            if (willenter) {
               odd.postdelivery["invno"] = invno;
               odd.postdelivery["invgentime"] = todaysdate(2);
               odd.postdelivery["docname"] = noc.toUpperCase() + inv2;

               db.collection("Orders").doc(oid).update({
                  status: "In Progress",
                  postdelivery: odd.postdelivery
               })
                  .then(function () {

                     db.collection("Settings/invoicing/Companies").doc(noc).update({
                        lastbillno: (parseInt(inv2) + 1)
                     })
                        .then(function () {
                           window.history.back();
                        })
                        .catch(function (error) {
                           // The document probably doesn't exist.
                           console.error("Error updating document: ", error);
                        });




                     window.history.back();
                  })
                  .catch(function (error) {
                     // The document probably doesn't exist.
                     console.error("Error updating document: ", error);
                  });
            }

         });
   });

   $("#cancel").click(function () {
      window.history.back();

   });


});
