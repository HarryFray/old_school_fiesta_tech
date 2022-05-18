import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { initializeApp } from "firebase/app";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

import Layout from "./global/Layout";
import Theme from "./global/Theme";
import Typography from "./global/Typography";

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
  const [userSignedIn, setUserSignedIn] = useState(false);
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in: ", user);
        setUserSignedIn(true);
      } else {
        setUserSignedIn(false);
        console.log("User not signed in");
      }
    });
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out: ", auth);
      })
      .catch((error) => {
        console.log("Error signing out: ", error);
      });
  };

  return (
    <Theme>
      <Typography>
        <Layout>
          {userSignedIn ? (
            <Button onClick={handleSignOut} variant="outlined">
              Sign Out
            </Button>
          ) : (
            <SignIn />
          )}
        </Layout>
      </Typography>
    </Theme>
  );
}

export default App;
