import React, { useState } from "react";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import SignIn from "./components/SignIn";

const firebaseConfig = {
  apiKey: "AIzaSyAXx9TD8ryWSwhWGj1bvlbqdQ9iquaP8nU",
  authDomain: "old-school-fiesta.firebaseapp.com",
  projectId: "old-school-fiesta",
  storageBucket: "old-school-fiesta.appspot.com",
  messagingSenderId: "195620709873",
  appId: "1:195620709873:web:2d4fdb7fcf752f49e09050",
  measurementId: "G-GSRZEB32KP",
};

function App() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  const user = auth.currentUser;

  if (user) {
    console.log("User is signed in: ", user);
    // ...
  } else {
    console.log("User not signed in", user);
  }

  return (
    <div className="App">
      <SignIn />
    </div>
  );
}

export default App;
