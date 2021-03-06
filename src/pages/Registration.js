import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { ref, push, set, getDatabase } from 'firebase/database';

import Layout from '../global/Layout';
import { openSnackBar } from '../redux/reducers';
import useActiveEvent from '../hooks/useActiveEvent';

const StyledRegistration = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.primary.light};

  .content_section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 500px;

    h1 {
      text-align: center;
    }

    .text_input {
      margin-top: 24px;
    }
  }

  .buttons {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }
`;

const Registration = () => {
  const { activeEvent } = useActiveEvent();

  const { register, handleSubmit, reset: resetGuestInput } = useForm();
  const db = getDatabase();

  const dispatch = useDispatch();

  const handleGuestCreation = (data) => {
    const guestUID = push(ref(db, `events/${activeEvent?.eventName}/guests`), data).key;

    set(ref(db, `events/${activeEvent?.eventName}/guests/${guestUID}`), {
      ...data,
      fullName: `${data?.firstName} ${data?.lastName}`,
      guestUID,
    })
      .then(() => {
        dispatch(openSnackBar({ message: 'you have successfully been registered' }));
      })
      .catch(() => {
        dispatch(
          openSnackBar({
            message: 'There was an issue with your registeration',
            status: 'error',
          })
        );
      })
      .finally(resetGuestInput);
  };

  return (
    <Layout hideTopBar>
      <StyledRegistration>
        <form onSubmit={handleSubmit(handleGuestCreation)}>
          <div className="content_section">
            <h1>Old Sol Fiesta Registration</h1>
            <TextField
              {...register('firstName', { required: true })}
              label="First Name*"
              className="text_input"
              variant="outlined"
              size="small"
            />
            <TextField
              {...register('lastName', { required: true })}
              label="Last Name*"
              className="text_input"
              variant="outlined"
              size="small"
            />
            <TextField
              {...register('email', { required: true })}
              label="Email*"
              className="text_input"
              variant="outlined"
              size="small"
            />
            <TextField
              {...register('instagramHandle')}
              label="Instagram Handle"
              className="text_input"
              variant="outlined"
              size="small"
            />
          </div>
          <div className="buttons">
            <Button variant="contained" type="submit">
              Register To Win
            </Button>
          </div>
        </form>
      </StyledRegistration>
    </Layout>
  );
};

export default Registration;
