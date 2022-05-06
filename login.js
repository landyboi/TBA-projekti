//Importataan tarvittavat funktiot
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getDatabase, set, ref, update, get, child } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

//Web sovelluksen firebase konfiguraatio
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

// Käynnistetään ja otetaan käyttöön firebase, database ja auth käytetään käyttäjän tarkistukseen
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

//Tämän funktion avulla pystymme luomaan käyttäjän ja tallentamaan tämän sähköpostin, salasanan(salatusti) ja käyttäjänimen meidän databaseen
signUp.addEventListener('click',(e) =>{
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const username = document.getElementById('username').value;

  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Teit onnistuneesti käyttäjän
    const user = userCredential.user;

    //Tämä itsessään tallentaa yllämainitut tiedot databaseen
    set(ref(database, 'users/' + user.uid),{
      username: username,
      email: email
    })
    alert('User created!')
  })
  .catch((error) => {
    alert(error.message);
  });
})

//Tämän avulla pystymme kirjautumaan sisään käyttäen äsken luotuja salasanaa ja sähköpostia
login.addEventListener('click', (e) =>{
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Olet kirjautunut sisään
    const user = userCredential.user;
    const dt = new Date();

    //vaihdamme boksissa tekstin mistä tietää oletko kirjautunut sisään
    const div = document.getElementById('loggeduser');
    div.innerHTML = "";
    const result =
        `
      <div>
       You are logged in.
      </div`
    div.innerHTML += result;

    //Tallennamme databaseen tiedon milloin kirjauduit sisään
    update(ref(database, 'users/' + user.uid),{
      last_login: dt,
    });
    alert('User loged in')
  })
  .catch((error) => {
    alert(error.message);
  });
});

const user = auth.currentUser;

//Tämän avulla tiedämme kuka on kirjautuneena sisälle, tämä tieto päivittyy aina kun käyttäjän tila muuttuu logged off => logged in tai toistepäin
onAuthStateChanged(auth, (user) => {
      if (user) {
        user.providerData.forEach((profile) => {

      //Tallennamme ensin käyttäjän klikatun lennon tiedot jotka ovat lähtöajankohta ja kohde
      const array =airportArray;
      update(ref(database, 'users/' + user.uid), {
        your_flights: array,
      });

      //Kirjoitamme joka kerta sivulle kun kirjautuminen on onnistunut
      const div = document.getElementById('loggeduser');
      div.innerHTML = "";
      const result =
          `
      <div>
       You are logged in.
      </div`
      div.innerHTML += result;

      const flights = document.getElementById('arrayInfo');
      flights.innerHTML = "";

      //Haemme databasesta tallennetun arrayn jossa on käyttäjän valitut lennot
      const dbRef = ref(getDatabase());
      get(child(dbRef, 'users/' + user.uid))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val().your_flights);
          const result_flights =
              `<h2> Saved flights <i class='fas fa-map-pin'></i></h2>
                <div>
                ${snapshot.val().your_flights}
                </div`
          flights.innerHTML += result_flights;
        }
      }).catch((error) => {
        console.error(error);
      });
    });
  }
});

//Tämän avulla pystymme kirjautumaan ulos käyttäjästä
logout.addEventListener('click', (e) =>{
  signOut(auth).then(() => {
    //Vaihdamme boksissa olevan tekstin tiedottamana että olet kirjautunut ulos
    const div = document.getElementById('loggeduser');
    div.innerHTML = "";
    const result =
        `
      <div>
       You have logged out.
      </div`
    div.innerHTML += result;
    //Vaihdamme tallennetut lennot kohdan takaisin tyhjäksi seuraavaa käyttäjää varten
    const flights = document.getElementById('arrayInfo');
    flights.innerHTML = "";
    const result_flights =
        `<h2> Saved flights <i class='fas fa-map-pin'></i></h2>
                <div>
                
                </div`
    flights.innerHTML += result_flights;
    alert('User logged out')
  }).catch((error) => {
    alert(error.message);
  });
});

//Tämän tiedoston ylläpidosta on vastannut Timi Tienhaara, joka on myös tehnyt täysin tämän tiedoston.
