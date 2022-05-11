import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const auth = getAuth();

  const handleCreateUser = (auth, email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("New user created: ", user);
      })
      .catch((error) => {
        console.log("Error on signUp/LogIn", error);
      });
  };

  return (
    <div className="SignIn">
      <TextField
        id="outlined-basic"
        label="Enter email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        id="outlined-basic"
        label="Enter Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div>
        <Button
          onClick={() => alert("sign in existing user not set up yet")}
          variant="outlined"
        >
          Sign In
        </Button>
        <Button onClick={() => handleCreateUser(auth, email, password)}>
          Create New Account
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
