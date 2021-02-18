// Initialize Firebase
var config = {
   apiKey: "AIzaSyDoRzKyGMHeoBFNFAWbGlDtf9wnaTanXts",
   authDomain: "jabook-d0b0b.firebaseapp.com",
   databaseURL: "https://jabook-d0b0b.firebaseio.com",
   projectId: "jabook-d0b0b",
   storageBucket: "jabook-d0b0b.appspot.com",
   messagingSenderId: "989034240400"
};
firebase.initializeApp(config);

const db = firebase.firestore();


const sidebar = document.getElementById('side-nav');
let flag = true;
const showSideBar = () => {
   if (flag) {
      document.getElementById('side-nav').style.width = '300px';
      flag = false;
   } else {
      flag = true;
      document.getElementById('side-nav').style.width = '0';
   }
}