'use strict'


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile  } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD31RrT_LQl6QDSqYnZSqi6OooGGUhrvOY",
  authDomain: "flighttracking-31976.firebaseapp.com",
  databaseURL: "https://flighttracking-31976-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flighttracking-31976",
  storageBucket: "flighttracking-31976.appspot.com",
  messagingSenderId: "941878942786",
  appId: "1:941878942786:web:c75c043f3b4b5fee8161db",
  measurementId: "G-SHRT6YBXTN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

signUp.addEventListener('click',(e) =>{

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;

    set(ref(database, 'users/' + user.uid),{
      username: username,
      email: email
    })

    alert('User created!')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    alert(errorMessage);
    // ..
  });
})

login.addEventListener('click', (e) =>{

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    const dt = new Date();

    update(ref(database, 'users/' + user.uid),{
      last_login: dt,
    })

    alert('User loged in')


    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    alert(errorMessage);
  });
});

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    user.providerData.forEach((profile) => {
      console.log("  Sign-in provider: " + profile.providerId);
      console.log("  Provider-specific UID: " + profile.uid);
      console.log("  Name: " + profile.displayName);
      console.log("  Email: " + profile.email);

      const div = document.getElementById('loggeduser')
      div.innerHTML = "";

      const result =
          `
      <div>
       Olet kirjautunut: ${profile.displayName}
      </div`
      div.innerHTML += result;
      });
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});

logout.addEventListener('click', (e) =>{
  signOut(auth).then(() => {
    // Sign-out successful.
    alert('User loged out')
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    alert(errorMessage);
    // An error happened.
  });
})

changeProfileDname.addEventListener('click', (e)=>{

  const name = document.getElementById('changeProfileName').value;
  updateProfile(auth.currentUser, {
    displayName: name
  }).then(() => {
    // Profile updated!
    alert("Name has been changed");
    // ...
  }).catch((error) => {
    // An error occurred
    alert(error);
    // ...
  });
})

