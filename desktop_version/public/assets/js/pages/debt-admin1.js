
//start  the loading modal
$('body').loadingModal({
   text: 'Loading',
   color: '#fff',
   opacity: '0.7',
   backgroundColor: 'rgb(0,0,0)',
   animation: 'doubleBounce',
   zIndex: 111111111
});

var detais, temp, obj1, obj, noc, lstbtnval, tmp22, remdt, t3, count, date, nocs, user, noc2, temp45, currentUid, privilages, email, user2;

$('#myModal22').modal({ backdrop: 'static', keyboard: false });


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

      if (privilages == "nonadmin")
         window.location.href = "dash-xxx22.html";

   } else {
      // Sign out operation. Reset the current user UID.  
      currentUid = null;
      console.log("no user signed in");
      window.location.href = 'index.html';
   }

});


//Initialize firestore
db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      obj1 = doc.data();
      console.log(obj1);


      //// credentials part

      let credentials = sessionStorage.getItem('uid2') + sessionStorage.getItem('pass2');


      if (credentials == obj1.keywrd) {

         $('#myModal22').modal('hide');

      }

      replacelist("noc", obj1.Companies);
      replacelist("risk1", obj1.Companies);
      obj = obj1.balancelist;


      $('body').loadingModal('hide');
   });

tmp22 = $("#setrem").val();

$(document).ready(function () {

   $("#commupdt").show();

   $("#btnaccess").click(function () {

      var uid, pass, sum;
      uid = $("#uid2").val();
      pass = $("#pass2").val();

      sum = uid + pass;

      if (sum == obj1.keywrd) {

         sessionStorage.setItem('uid2', uid)
         sessionStorage.setItem('pass2', pass)
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


   count = 0;
   $('.input-group input').datepicker({
      format: "dd/mm/yyyy",
      autoclose: true,

      orientation: 'bottom'

   });
   $("#paymode").change(function () {
      if ($("#paymode option:selected").val() == "Bank")
         $("#invisu").show();

      else
         $("#invisu").hide();

   });



   $("#setrem").change(function () {

      tmp22 = $("#setrem").val();
      console.log(tmp22);
      console.log($("#reminderdt").val());

      if (tmp22 == 0) {
         $("#reminderdt").prop('disabled', true);
         $("#reminderdetails").prop('disabled', true);
         $("#reminderdt").val("N/A");
         $("#reminderdetails").val("N/A");
      }
      else if (tmp22 == 1) {
         $("#reminderdt").prop('disabled', false);
         $("#reminderdetails").prop('disabled', false);
         $("#reminderdt").val("");
         $("#reminderdetails").val("");
      }

   });
   $("#updateoption").change(function () {
      t3 = $("#updateoption option:selected").val();
      console.log(t3);
      if (t3 == '1') {
         $("#commupdt").show();
         $("#reminderupdt").hide();
         $("#payment").hide();
         $("#contactdiv").hide();



      }
      else if (t3 == '2') {
         $("#reminderupdt").show();
         $("#commupdt").hide();

         $("#payment").hide();
         $("#contactdiv").hide();
      }
      else if (t3 == '3') {
         $("#payment").show();
         $("#commupdt").hide();
         $("#reminderupdt").hide();

         $("#contactdiv").hide();

      }
      else if (t3 == '4') {
         $("#contactdiv").show();
         $("#commupdt").hide();
         $("#reminderupdt").hide();
         $("#payment").hide();

      }
      else if (t3 == 0) {
         $("#contactdiv").hide();
         $("#commupdt").hide();
         $("#reminderupdt").hide();
         $("#payment").hide();
      }
      else if (t3 == '5') {
         $("#contactdiv").hide();
         $("#commupdt").hide();
         $("#reminderupdt").hide();
         $("#payment").hide();

      }



   });


});


//// _____________ on new debt add(Register) ________________

$("#f1").submit(function (event) {

   $('body').loadingModal('show');

   event.preventDefault();

   noc = $("#risk1 option:selected").val();
   remdt = $("#reminderdt").val();
   t3 = remdt.split("/");

   console.log(remdt);

   t3 = new Date(t3[2], t3[1], t3[0]);
   t3 = t3.getTime();
   console.log(t3);


   detais = {
      balance: $("#debtamt").val(),
      name: $("#name").val(),
      startdate: $("#start").val(),
      debtorcatagory: $("#toc option:selected").val(),
      type1: $("#typ1 option:selected").val(),
      noc: $("#risk1").val(),
      lastcommdate: $("#lstcomdt").val(),
      lastcommdetails: $("#lstcommdetails").val(),
      contactno: $("#contactno").val(),
      setreminder: tmp22,
      tripdetails: "N/A"
      //reminder set or not  

   }

   console.log(detais);

   datainsert("debt", shorten(noc) + $("#contactno").val(), detais);

   if (tmp22 == '1') {

      detais = {
         date: t3,
         details: $("#reminderdetails").val(),
         name: $("#name").val() + "'s Debt Reminder",
         priority: 1,
         type: "todo",
         user: user

      }

      datainsert("Compandtodo", '#' + todaysdate(4), detais);

   }

   $('#myModal').modal('toggle');

   swal("Transaction Recorded!", "You may proceed!", "success");

});


//// _____________ adding employees through csv file ______________

$('#csvForm').submit(async (evt) => {
   evt.preventDefault();

   let file = document.getElementById('csvFile').files[0];

   // parsing the csv file
   Papa.parse(file, {

      header: true,
      dynamicTyping: true,

      before: () => {
         spinner.style.display = 'flex';
      },

      error: (e) => {
         console.log(e);
      },

      complete: async (results) => {

         arrObj = results.data;

         let len = arrObj.length;

         for (let i = 0; i < (len - 1); i++) {

            const obj = arrObj[i];

            console.log(obj);

            let capNoc = obj.noc.toUpperCase();

            detais = {

               balance: obj.debtamt,
               name: obj.name,
               startdate: obj.startdate,
               debtorcatagory: obj.toc,
               type1: obj.type1,
               noc: capNoc,
               lastcommdate: obj.lastcommdate,
               lastcommdetails: obj.lastcommdetails,
               contactno: obj.contactno,
               setreminder: obj.setrem,
               tripdetails: "N/A"
               //reminder set or not  

            }


            let p = await datainsert("debt", shorten(capNoc) + obj.contactno, detais);

            if (tmp22 == '1') {

               detais = {
                  date: obj.remdate,
                  details: obj.remdetails,
                  name: obj.name + "'s Debt Reminder",
                  priority: 1,
                  type: "todo",
                  user: user

               }

               let promise = await datainsert("Compandtodo", '#' + todaysdate(4), detais);

            }

            $('#myModal').modal('toggle');

         }

      },

   });

})


$("#getdata").click(function () {

   $('#myTable').DataTable().destroy();


   $('body').loadingModal('show');
   var ref, cat, dt;
   cat = $("#customertyp1 option:selected").val();
   dt = $("#debttyp1 option:selected").val();
   noc2 = $("#noc option:selected").val();
   ref = db.collection("debt");
   if (cat != "All")
      ref = ref.where("debtorcatagory", "==", cat);
   if (dt != "All")
      ref = ref.where("type1", "==", dt);

   ref = ref.where("noc", "==", noc2);


   ref.onSnapshot(function (querySnapshot) {
      var temp = [];
      querySnapshot.forEach(function (doc) {
         temp.push(doc.data());

      });
      console.log(temp);
      //datatables here
      //datatables here

      var table = $('#myTable').DataTable({
         data: temp,
         "columns": [
            { data: "name" },
            { data: "contactno" },
            { data: "balance" },
            { data: "lastcommdate" },
            { data: "lastcommdetails" },
            { data: "setreminder" },
            {
               "data": null,
               "defaultContent": "<button class='btn btn-info'>Update</button>",

            }
         ],
         dom: 'Bfrtip',

         buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
         ],
         "destroy": true,
         responsive: true,
      });

      $('#myTable tbody').off().on('click', 'button', function () {
         var data = table.row($(this).parents('tr')).data();
         console.log(data);
         lstbtnval = data;


         temp45 = (data.tripdetails || "N.A");
         $("#tripp").html(temp45);



         $('#myModal2').modal('toggle');

      });

      $('body').loadingModal('hide');
   });


});

$("#btn225").click(function () {
   var temp, obj5, newcont, details2, date;
   $('body').loadingModal('show');
   $('#myTable').DataTable().destroy();
   temp = $("#updateoption option:selected").val();

   obj5 = lstbtnval;
   console.log(obj5);
   if (temp == "1") {
      obj5.lastcommdate = $("#lstcomdt2").val();

      obj5.lastcommdetails = $("#lstcommdetails2").val();
      datainsert("debt", shorten(obj5.noc) + obj5.contactno, obj5);
      $('#myModal2').modal('toggle');
      $('#f2').trigger("reset");

   }

   else if (temp == "2") {
      obj5.setreminder = "1";
      //insert to compilance
      date = todaysdate($("#reminderdt2").val());//to timestamp
      details2 = {
         date: date,
         details: $("#reminderdetails2").val(),
         name: obj5.name + "'s Debt Reminder",
         priority: 1,
         type: "todo",
         user: user

      };
      datainsert("Compandtodo", date, details2);
      datainsert("debt", shorten(obj5.noc) + obj5.contactno, obj5);
      $('#myModal2').modal('toggle');
      $('#f2').trigger("reset");
   }

   else if (temp == "3") {

      if ($("#paymode option:selected").val() == "Bank") {
         if ($("#invissue option:selected").val() == "Yes") {
            details2 = {
               date: todaysdate(4) + 259200000,//todays date
               details: "Issue invoices for recent payment recueved from" + obj5.name,
               name: obj5.name + "Invoice Issue",
               priority: 1,
               type: "compilance",
               user: user

            };
            datainsert("Compandtodo", '#' + date, details2);
         }
      }
      nocs = shorten(obj5.noc).toLocaleLowerCase();
      obj5.balance = parseInt(obj5.balance) - parseInt($("#amt2").val());
      obj1.balancelist.masterbalance += parseInt($("#amt2").val());
      obj1.balancelist[user + 'bal'] += parseInt($("#amt2").val());
      obj1.balancelist[nocs + 'bal'] += parseInt($("#amt2").val());

      details2 = {
         amount: parseInt($("#amt2").val()),
         date: todaysdate(4),//todays date
         description: "Debt Repayment By " + obj5.name,
         expensehead: "Inflow:Debt Repayment",
         masterbalance: obj1.balancelist.masterbalance,//get here
         balance: obj1.balancelist[nocs + 'bal'],
         noc: noc2,
         tid: todaysdate(2),//todays date
         user: user,
         userbal: obj1.balancelist[user + 'bal']
      };
      datainsert("Accounts/mdb/main", todaysdate(2), details2);
      datainsert("Settings", "Accounts", obj1);

      datainsert("debt", shorten(obj5.noc) + obj5.contactno, obj5);
      $('#myModal2').modal('toggle');
      $('#f2').trigger("reset");
      swal("Updated Successfully!", "You may proceed!", "success");
   }

   else if (temp == "4") {
      db.collection("debt").doc(shorten(obj5.noc) + obj5.contactno).delete().then(function () {
         console.log("Document successfully deleted!");


         obj5.contactno = $("#contact2").val();



         datainsert("debt", shorten(obj5.noc) + obj5.contactno, obj5);
         $('#myModal2').modal('toggle');
         $('#f2').trigger("reset");

      }).catch(function (error) {
         console.error("Error removing document: ", error);
      });



   }

   else if (temp == "5") {


      swal({
         title: "Are you sure?",
         text: "Once deleted, you will not be able to recover!",
         icon: "warning",
         buttons: true,
         dangerMode: true,
      })
         .then((willDelete) => {
            if (willDelete) {

               db.collection("debt").doc(shorten(obj5.noc) + obj5.contactno).delete().then(function () {

                  if (obj5.balance > 0) {

                     nocs = shorten(obj5.noc).toLocaleLowerCase();
                     obj1.balancelist.masterbalance -= obj5.balance;
                     obj1.balancelist[user + 'bal'] -= obj5.balance;
                     obj1.balancelist[nocs + 'bal'] -= obj5.balance;


                     details2 = {
                        amount: parseInt(obj5.balance),
                        date: todaysdate(4),//todays date
                        description: "Debt Offset For " + obj5.name,
                        expensehead: "Outflow:Expense:Bad Debt",
                        masterbalance: obj1.balancelist.masterbalance,//get here
                        noc: noc2,
                        tid: todaysdate(2),//todays date
                        user: user,
                        userbal: obj1.balancelist[user + 'bal'],
                        balance: obj1.balancelist[nocs + 'bal']
                     };
                     datainsert("Accounts/mdb/main", todaysdate(2), details2);
                     datainsert("Settings", "Accounts", obj1);

                  }




                  swal("Offset Successfull!", {
                     icon: "success",
                  });

                  $('#myModal2').modal('toggle');
                  $('#f2').trigger("reset");
               }).catch(function (error) {
                  console.error("Error removing document: ", error);
               });



            } else {
               swal("Data is safe!");
               $('body').loadingModal('hide');
            }


         })

   }



});


//// inserting data to collections

async function datainsert(dbextn, dbname, arr2) {


   let p = await db.collection(dbextn).doc(dbname).set(arr2)
      .then(function () {
         console.log("Document written with ID: ");
         //add write to reminder ifapplicable        
         $('body').loadingModal('hide');
      })
      .catch(function (error) {
         console.error("Error adding document: ", error);
      });
};


//replace list starts here
function replacelist(idi, arr) {
   var $el = $("#" + idi);
   //$el.empty();  remove old options
   arr.forEach(function (element) {
      $el.append($("<option></option>").text(element));
   });
};
//for the date part
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
   else {
      t3 = nn.split("/");
      console.log(t3);

      t3 = new Date(t3[2], t3[1], t3[0]);
      console.log(t3);
      s = t3.getTime().toString();
   }


   return s;

}
//shorten phrase

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

console.log(sessionStorage.getItem(''))