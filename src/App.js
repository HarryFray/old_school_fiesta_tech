import React, { useState, useEffect } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { Provider } from 'react-redux';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import store from './redux/store';
import Theme from './global/Theme';
import Typography from './global/Typography';
import SignIn from './components/SignIn';

import DashBoard from './pages/Dashboard';
import Lottery from './pages/Lottery';
import EventManagement from './pages/EventManagement';
import Registration from './pages/Registration';

const FIRE_BASE_CONFIG = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_APP_ID,
  measurementId: process.env.REACT_APP_FB_MEASUREMENT_ID,
};

const SUPER_USERS_IDS = [
  process.env.REACT_APP_SUPER_USER_ID_1,
  process.env.REACT_APP_SUPER_USER_ID_2,
];

function App() {
  const [currentUser, setCurrentUser] = useState({});

  const app = initializeApp(FIRE_BASE_CONFIG);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          ...user,
          superUser: SUPER_USERS_IDS.includes(user?.uid),
        });
      } else {
        setCurrentUser({});
      }
    });
  }, [auth]);

  return (
    <Provider store={store}>
      <Theme>
        <Typography>
          <BrowserRouter>
            <Routes>
              {isEmpty(currentUser) ? (
                <>
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/" element={<SignIn auth={auth} />} />
                </>
              ) : (
                <>
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  <Route
                    path="dashboard"
                    element={<DashBoard auth={auth} currentUser={currentUser} />}
                  />
                  {currentUser?.superUser && (
                    <>
                      <Route
                        path="events"
                        element={<EventManagement auth={auth} currentUser={currentUser} />}
                      />
                      <Route
                        path="lottery"
                        element={<Lottery auth={auth} currentUser={currentUser} />}
                      />
                      <Route
                        path="registration"
                        element={<Registration auth={auth} currentUser={currentUser} />}
                      />
                    </>
                  )}
                </>
              )}
            </Routes>
          </BrowserRouter>
        </Typography>
      </Theme>
    </Provider>
  );
}

export default App;
