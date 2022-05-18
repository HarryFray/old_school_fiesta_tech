import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledSignIn = styled.div`
  background: white;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  .login_card {
    display: flex;
    background: white;
    flex-direction: column;
    padding: 24px;
    border-radius: 4px;
    border: 1px solid lightgray;
    justify-content: center;
    align-items: center;

    h1 {
      margin: 0;
    }

    button,
    .input {
      margin-top: 24px;
    }
  }
`;

const SignIn = ({ auth }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleUserSignIn = (auth, email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User loged in in: ", userCredential);
        navigate("/");
      })
      .catch((error) => {
        console.log("Error on log in", error);
      });
  };

  // const handleCreateUser = (auth, email, password) => {
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       console.log("New user created: ", user);
  //     })
  //     .catch((error) => {
  //       console.log("Error on signUp", error);
  //     });
  // };

  return (
    <StyledSignIn>
      <div className="login_card">
        <h1>Old Sol Fiesta</h1>
        <TextField
          className="input"
          id="outlined-basic"
          label="Enter email"
          variant="outlined"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="input"
          id="outlined-basic"
          label="Enter Password"
          variant="outlined"
          size="small"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          onClick={() => handleUserSignIn(auth, email, password)}
          variant="outlined"
        >
          Sign In
        </Button>
      </div>
    </StyledSignIn>
  );
};

export default SignIn;
