var detais, temp, obj1, obj2, obj, noc, lstbtnval, ref, user, op, count, temp33, notes, currentUid, privilages, email, notes, tmp88, user2;
//Initialize firestore
user = "null";
db.collection("Settings").doc("Accounts")
   .onSnapshot(function (doc) {
      obj1 = doc.data();
      console.log(obj1);
      replacelist("noc", obj1.Companies);
      replacelist("noc1", obj1.Companies);
      obj = obj1.balancelist;
      replacelist("empcategory", obj1.Positions[$("#noc option:selected").val()]);
      replacelist("pos", obj1.Positions[$("#noc option:selected").val()]);



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


      //loading respective positions for jobs in the company

      if (todaysdate(4) - obj1.lastpayday >= 2678400000) {

         db.collection("payroll")
            .get()
            .then(function (querySnapshot) {

               querySnapshot.forEach(function (doc) {
                  console.log(doc.data());
                  temp33 = doc.data();

                  temp33["balamt"] = parseFloat(temp33["balamt"]) + parseFloat(temp33["salaryamount"]);
                  console.log(doc.id);
                  console.log(temp33);
                  datainsert("payroll", doc.id, temp33);

               });
               obj1["lastpayday"] = todaysdate(4);
               datainsert("Settings", "Accounts", obj1);
            })
            .catch(function (error) {
               console.log("Error getting documents: ", error);
            });


      }




      $('body').loadingModal('hide');


   });

$(document).ready(function () {


   $("#contact2").change(function () {

      console.log($("#contact2").val());

   });

   $('.input-group input').datepicker({
      format: "dd/mm/yyyy",
      autoclose: true,
      orientation: 'bottom'
   });

   count
   $("#payment").show();
   ref = db.collection("payroll");
   $("#noc").change(function () {
      replacelist("empcategory", obj1.Positions[$("#noc option:selected").val()]);

   });
   $("#noc1").change(function () {
      replacelist("pos", obj1.Positions[$("#noc1 option:selected").val()]);

   });
   $("#updateoption").change(function () {
      op = $("#updateoption option:selected").val();

      if (op == 1) {
         $("#payment").show();
         $("#contactnodiv").hide();
         $("#baldiv").hide();
      }

      else if (op == 2) {
         $("#contactnodiv").show();
         $("#payment").hide();
         $("#baldiv").hide();

      }
      else if (op == 4) {
         $("#contactnodiv").hide();
         $("#payment").hide();
         $("#baldiv").hide();
      }
      else if (op == 3) {
         $("#contactnodiv").hide();
         $("#payment").hide();
         $("#baldiv").show();
      }


   });



});

////on new Employee add(Register)

$("#f1").submit(function (event) {
   event.preventDefault();

   $('body').loadingModal('show');
   noc = $("#noc1 option:selected").val();

   detais = {
      salaryamount: parseFloat($("#salaryamt").val()),
      name: $("#name").val(),
      startdate: $("#start").val(),
      category: $("#pos option:selected").val(),
      balamt: parseFloat($("#balamt").val()),

      contactno: $("#contact").val(),
      noc: noc,
      paydetails: []


   }
   console.log(detais);
   datainsert("payroll", '#' + $("#contact").val(), detais);

   notes += todaysdate(6) + "Employee Added to" + noc + "--Name= " + $("#name").val() + "With salary=" + $("#salaryamt").val() + "balance=" + $("#balamt").val() + "<br>";
   var details33 = {
      content: notes,
      date: todaysdate(5)
   }
   datainsert("notes", todaysdate(5).toString(), details33);

   $('#f1').trigger("reset");
   $('#myModal').modal('toggle');
   swal("Employee Saved Successfully!", "You may proceed!", "success");
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

         console.log(len);
         console.log(arrObj);

         for (let i = 0; i < (len - 1); i++) {

            const obj = arrObj[i];

            let capNoc = obj.noc.toUpperCase();

            detais = {
               salaryamount: parseFloat(obj.salaryamount),
               name: obj.name,
               startdate: obj.startdate,
               category: obj.category,
               balamt: parseFloat(obj.balamt),
               contactno: obj.contactno,
               noc: capNoc,
               paydetails: [],
            };


            let p = await datainsert('payroll', '#' + obj.contactno, detais);

            notes +=
               todaysdate(6) +
               'Employee Added ' +
               obj.name +
               'With salary=' +
               obj.salaryamount +
               'balance=' +
               obj.balamt +
               '<br>';

            var details33 = {
               content: notes,
               date: todaysdate(5),
            };

            let promise = await datainsert('notes', todaysdate(5).toString(), details33);
         }
      },
   });

})

$("#getdata").click(function () {
   $('#myTable').DataTable().destroy();
   $('body').loadingModal('show');
   var ref, cat, dt, noc2;
   cat = $("#empcategory option:selected").val();

   noc2 = $("#noc option:selected").val();
   ref = db.collection("payroll");

   ref = ref.where("category", "==", cat);

   ref = ref.where("noc", "==", noc2);



   ref.onSnapshot(function (querySnapshot) {
      var temp = [];
      querySnapshot.forEach(function (doc) {
         temp.push(doc.data());

      });

      //datatables here
      //datatables here
      console.log(temp);
      var table = $('#myTable').DataTable({
         data: temp,
         "destroy": true,
         "columns": [
            { data: "name" },
            { data: "contactno" },
            { data: "startdate" },
            { data: "salaryamount" },
            { data: "balamt" },
            {
               "data": null,
               "defaultContent": "<button class='btn btn-info'>Update</button>",
            }
         ],
         dom: 'Bfrtip',
         buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
         ]
      });

      $('#myTable tbody').off().on('click', 'button', function () {
         tmp88 = '';
         $("#myTable22").html('');

         var data = table.row($(this).parents('tr')).data();
         console.log(data);
         data.paydetails.forEach(function (element) {
            tmp88 += `<tr><td>${element.date}</td><td>${element.amt}</td><td>${element.paynotes}</td>
  </tr>`;
         });
         console.log(tmp88);
         $("#myTable22").append(tmp88);
         lstbtnval = data;
         console.log(lstbtnval);
         $('#myModal2').modal('toggle');

      });

      $('body').loadingModal('hide');
   });


});

$("#btn225").click(function (event) {
   event.preventDefault();
   var temp, obj5, newcont, details2, date, nocs;
   $('body').loadingModal('show');
   tmp88 = '';
   count = $("#contact2").val();
   temp = $("#updateoption option:selected").val();

   obj5 = lstbtnval;

   console.log(temp);



   if (temp == "1") {
      nocs = shorten(obj5.noc).toLocaleLowerCase();
      var amt32 = parseInt($("#amt2").val());
      obj5.balamt = parseInt(obj5.balamt) + amt32;
      obj1.balancelist.masterbalance -= amt32;
      obj1.balancelist[user + 'bal'] -= amt32;
      obj1.balancelist[nocs + 'bal'] -= amt32;


      obj5.paydetails.push({ date: todaysdate(2), amt: amt32, paynotes: $("#paynotes").val() });
      if (obj5.paydetails.length > 5) {
         obj5.paydetails.splice(0, 1);
      }

      details2 = {
         amount: amt32,
         date: todaysdate(4),
         description: "Salary Payment to " + obj5.name,
         expensehead: "Outflow:Expense:Staff Salary",
         balance: obj1.balancelist[nocs + 'bal'],
         masterbalance: obj1.balancelist.masterbalance,//get here
         noc: obj5.noc,
         tid: todaysdate(2),//todays date
         user: user,
         userbal: obj1.balancelist[user + 'bal']
      };
      datainsert("Accounts/mdb/main", todaysdate(2), details2);
      datainsert("Settings", "Accounts", obj1);
      datainsert("payroll", '#' + obj5.contactno, obj5);
      swal("Updated Successfully!", "You may proceed!", "success");
   }

   else if (temp == "2") {
      db.collection("payroll").doc('#' + obj5.contactno).delete().then(function () {
         console.log("Employee successfully Exited!");
         console.log(count);
         console.log(obj5);
         obj5.contactno = count;

         console.log(obj5.contactno);
         datainsert("payroll", '#' + count, obj5);
         swal("Contacts Updated Successfully!", "You may proceed!", "success");
      }).catch(function (error) {
         console.error("Error removing document: ", error);
      });

   }

   else if (temp == "4") {
      db.collection("payroll").doc('#' + obj5.contactno).delete().then(function () {
         notes += todaysdate(6) + "Employee Exitted from" + obj5.noc + " with name " + obj5.name + "With balance=" + obj5.balamt + "<br>";
         var details33 = {
            content: notes,
            date: todaysdate(5)
         }
         datainsert("notes", todaysdate(5).toString(), details33);


         swal("Employee Exitted!", "You may proceed!", "success");

      }).catch(function (error) {
         console.error("Error removing document: ", error);
      });

   }

   else if (temp == "3") {

      swal("Sorry!", "This is a Admin only feature!", "error");
      $('body').loadingModal('hide');
   }

   $('#f2').trigger("reset");




   $('#myModal2').modal('toggle');


});



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
   $el.empty();
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
   else if (nn == 5)
      s = Date.parse(mm + '/' + dd + '/' + yy);
   else if (nn == 6)
      s = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();


   return s;

}
//shorten phrase

function shorten(s) {

   s = ' ' + s;
   var t, ch, i;
   t = "";
   for (i = 0; i < s.length; i++) {
      ch = s.charAt(i);
      if (ch == ' ' && ch != '&')
         t += s.charAt(i + 1);
   }
   return t;
}


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
