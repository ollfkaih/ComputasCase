import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCm6crKKFMYnYyX8F5av4X0YVcRjd-Au70",
  authDomain: "wastewhisperer.firebaseapp.com",
  databaseURL: "https://wastewhisperer-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wastewhisperer",
  storageBucket: "wastewhisperer.appspot.com",
  messagingSenderId: "99873099354",
  appId: "1:99873099354:web:c1874866d8307cb3a91263"
};

export default initializeApp(firebaseConfig);