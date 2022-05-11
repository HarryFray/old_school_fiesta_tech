import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components";

const StyledSignIn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 800px;
  justify-content: center;
  align-items: center;

  button,
  .input {
    margin-top: 24px;
  }
`;

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
        console.log("Error on signUp", error);
      });
  };

  const handleUserSignIn = (auth, email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User loged in in: ", userCredential);
      })
      .catch((error) => {
        console.log("Error on log in", error);
      });
  };

  return (
    <StyledSignIn>
      <h1>Old Sol Fiesta</h1>
      <TextField
        className="input"
        id="outlined-basic"
        label="Enter email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        className="input"
        id="outlined-basic"
        label="Enter Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={() => handleCreateUser(auth, email, password)}>
        Create New Account
      </Button>
      <Button
        onClick={() => handleUserSignIn(auth, email, password)}
        variant="outlined"
      >
        Sign In
      </Button>
    </StyledSignIn>
  );
};

export default SignIn;
