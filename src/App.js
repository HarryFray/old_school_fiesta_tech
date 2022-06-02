import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { isEmpty } from "lodash";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Theme from "./global/Theme";
import Typography from "./global/Typography";
import SignIn from "./components/SignIn";

import DashBoard from "./pages/Dashboard";
import EventManagement from "./pages/EventManagement";
import UnAuthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const firebaseConfig = {
  apiKey: "AIzaSyAXx9TD8ryWSwhWGj1bvlbqdQ9iquaP8nU",
  authDomain: "old-school-fiesta.firebaseapp.com",
  projectId: "old-school-fiesta",
  storageBucket: "old-school-fiesta.appspot.com",
  messagingSenderId: "195620709873",
  appId: "1:195620709873:web:2d4fdb7fcf752f49e09050",
  measurementId: "G-GSRZEB32KP",
};

const SUPER_USERS = [
  "HXLkDGuh3kQZ5OWy3DRVzzJ4NmC2",
  "wc0eIRXBYrfiojjyokismRA9SuN2",
];

function App() {
  const [currentUser, setCurrentUser] = useState({});

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          ...user,
          superUser: SUPER_USERS.includes(user?.uid),
        });
      } else {
        setCurrentUser({});
      }
    });
  }, [auth]);

  return (
    <Theme>
      <Typography>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="auth" element={<SignIn auth={auth} />} />
            {isEmpty(currentUser) ? (
              <Route path="/" element={<UnAuthorized />} />
            ) : (
              <>
                <Route
                  path="dashboard"
                  element={<DashBoard auth={auth} currentUser={currentUser} />}
                />
                {currentUser?.superUser && (
                  <Route
                    path="events"
                    element={
                      <EventManagement auth={auth} currentUser={currentUser} />
                    }
                  />
                )}
              </>
            )}
          </Routes>
        </BrowserRouter>
      </Typography>
    </Theme>
  );
}

export default App;
