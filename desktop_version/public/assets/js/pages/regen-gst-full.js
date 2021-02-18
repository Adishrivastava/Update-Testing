
// Initialize Cloud Firestore through Firebase
var noc, customerdetails, companydetails, c3, p3, noc2, invno, inv2, date, taxableamt, finalamt, tgst, fstr, bnkdt, count, temp, sp, gst, gst1, user, currentUid, privilages, email;



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


var oid = JSON.parse((localStorage.getItem("datain") || document.cookie));
console.log(oid);
//recieve all these info from pre order and post order array
//
db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      general = doc.data();
      console.log(general);

      //this is for orders

      console.log(oid);
      noc = shorten(oid.noc);
      console.log(noc);
      //this is for company details
      if (oid.gstin != "N/A")
         c3 = "\nGSTIN:" + oid.gstin;
      customerdetails = `Name:${oid.name}${c3}\n${oid.billaddress}`;
      p3 = `Place of supply:${oid.placeofsupply}\n Transport Details:${oid.predelivery.vehregno || 'N.A'}`;
      console.log(customerdetails);
      //place for product list insert to table
      count = 1; sp = gst1 = gst = 0;
      temp = "";
      oid.productlist.forEach(function (element) {
         console.log(element);
         sp += element.quantity * element.rateperunit;
         gst1 = element.quantity * (element.rateperunit * element.gstrate / 100);
         gst += gst1;

         console.log(general['Products'][oid.noc]);
         if (oid.saletype == "Intra-State") {



            temp += `<tr><td>${count++}</td>
      <td>${element.product + '-' + element.description}</td>
      <td>${general['Products'][oid.noc][element.product]['hsn']}</td>
      <td>${element.rateperunit}</td>
      <td>${element.quantity}</td>
      <td>${Number(element.quantity * element.rateperunit).toFixed(2)}</td>  
 
      <td>${Number(gst1 / 2).toFixed(2)}</td>  
      <td>${Number(gst1 / 2).toFixed(2)}</td>  
      <td>0</td>
     <td>${Number((element.quantity * element.rateperunit) + gst1).toFixed(2)}</td>  </tr>`;



         }
         else {



            temp += `<tr><td>${count++}</td>
      <td>${element.product + '-' + element.description}</td>
      <td>${general['Products'][oid.noc][element.product]['hsn']}</td>
      <td>${element.rateperunit}</td>
      <td>${element.quantity}</td>
      <td>${Number(element.quantity * element.rateperunit).toFixed(2)}</td>  
 
      <td>0</td>
      <td>0</td>  
      <td>${Number(gst1).toFixed(2)}</td> 
     <td>${Number((element.quantity * element.rateperunit) + gst1).toFixed(2)}</td>  </tr>`;



         }


      });


      console.log(temp);

      $("#tbody").append(temp);



      console.log(p3);
      db.collection("Settings/invoicing/Companies").doc(oid.noc)
         .get().then(function (doc2) {
            console.log("Current data: ", doc2.data());
            noc2 = doc2.data().name;
            companydetails += `${doc2.data().name}\nGSTIN:${doc2.data().gstin}\nAddress:${doc2.data().address}\nEmial::${doc2.data().email}\nM:${doc2.data().phone}`;
            console.log(companydetails);
            inv2 = doc2.data().lastgstinvno;
            invno = oid.postdelivery.invno;
            date = oid.postdelivery.invgentime;
            taxableamt = Number(sp).toFixed(2);
            tgst = Number(gst).toFixed(2);
            finalamt = Math.round(sp + gst);
            fstr = `Taxable Total=Rs${taxableamt}\n\t\t Gst=Rs${tgst} \n\t finalamt=Rs${finalamt} `;
            bnkdt = `${doc2.data().bankdetails.name}\nAccount No-${doc2.data().bankdetails.accountno}\nIFSC:${doc2.data().bankdetails.ifsc}`;
         });

      $('body').loadingModal('hide');


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

   var elementHandler = {
      '#ignorePDF': function (element, renderer) {
         return true;
      }
   };

   var header = function (data) {


      //logo and invoice no
      doc.text(90, 08, "Tax Invoice");
      doc.setFontSize(20);
      doc.text(12, 13, noc2);
      doc.setFontSize(10);
      doc.text(165, 12, `Invoice No:${invno}`);
      doc.text(168, 16, `Date:${date}`);
      doc.line(0, 20, 220, 20);//first top line
      doc.line(0, 51, 220, 51);//second line
      doc.line(0, 245, 220, 245);//divider horizontal line
      doc.line(80, 20, 80, 51)//first Vertical lne
      doc.line(145, 20, 145, 51)//second Vertical line

      //header
      doc.setFontSize(12);
      doc.setFont('helvetica');
      doc.setFontType('italic');
      doc.text(95, 25, "Billing Details");
      doc.text(154, 25, "Shipping Details");
      doc.text(150, 251, fstr);
      doc.rect(75, 250, 63, 23);
      doc.text(80, 259, bnkdt);
      doc.text(15, 250, "Authorised Signatory");
      // doc.text(15,264,"Receiver's Signature");
      doc.text(15, 284, "Note:-");
      doc.text(15, 288, "#Goods must be inspected during delivery after that no complaints would be entertained!");
      doc.text(15, 292, "#All disputes are subject to mumbai jurisdiction only.");//change jurishdiction
      doc.setFontType("normal");
      doc.setFont("normal");
      doc.setFontSize(10);
      doc.text(12, 27, companydetails);
      doc.text(85, 30, customerdetails);
      doc.text(148, 30, p3);



   };
   var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
   var options = {
      addPageContent: header,
      margin: {
         top: 57
      },

   };

   doc.autoTable(res.columns, res.data, options);
   doc.setProperties({
      title: "::Invoices::"
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
   })

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
               window.close();
            }

         });
   });


});
