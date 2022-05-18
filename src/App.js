import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Theme from "./global/Theme";
import Typography from "./global/Typography";
import DashBoard from "./pages/Dashboard";
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

  return (
    <Theme>
      <Typography>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<SignIn auth={auth} />} />
            {userSignedIn && (
              <>
                <Route path="/" element={<DashBoard auth={auth} />} />
                <Route path="/dashboard" element={<DashBoard auth={auth} />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </Typography>
    </Theme>
  );
}

export default App;
