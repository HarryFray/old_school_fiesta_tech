import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import osfBackground from "../images/osf-background.png";

const StyledSignIn = styled.div`
  background: white;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;

  #bg {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
  }
  #bg img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    min-width: 50%;
    min-height: 50%;
  }

  .login_card {
    position: absolute;
    display: flex;
    flex-direction: column;
    padding: 24px;
    border-radius: 4px;
    border: 1px solid lightgray;
    justify-content: center;
    align-items: center;

    h1 {
      margin: 0;
    }

    h5 {
      color: ${({ theme }) => theme.colors.error};
      position: absolute;
      bottom: 68px;
      left: 26px;
    }

    .input {
      width: 300px;
    }

    button,
    .input {
      margin-top: 28px;
      background: whitesmoke;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakPoints.xSmall}) {
    .login_card {
      border: none;

      .input {
        max-width: 250px;
      }
    }
  }
`;

const SignIn = ({ auth }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setErrorText("");
  }, [password, email]);

  const navigate = useNavigate();

  const handleUserSignIn = (auth, email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/dashboard"))
      .catch(({ message }) => {
        if (!email || !password) {
          setErrorText("Please enter a password and email");
        } else if (message.includes("password")) {
          setErrorText("Invalid Password");
        } else if (message.includes("email")) {
          setErrorText("Invalid Email");
        } else {
          setErrorText(message);
        }
      });
  };

  return (
    <StyledSignIn>
      <div id="bg">
        <img
          src={osfBackground}
          alt="Old Sol Fiesta Background"
          width="500"
          height="600"
        />
      </div>
      <div className="login_card">
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
        {Boolean(errorText) && <h5>{errorText}</h5>}
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
