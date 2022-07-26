import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { isEmpty } from 'lodash';
import { getDatabase, ref, push, set } from 'firebase/database';
import { useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';

import { openSnackBar } from '../../redux/reducers';
import Typography from '../../global/Typography';

const StyledCreateOrEditSale = styled(Modal)`
  .MuiBox-root {
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 24px;
    transform: translate(-50%, -50%);
    background: ${({ theme }) => theme.palette.primary.light};

    h3 {
      color: ${({ theme }) => theme.palette.primary.dark};
    }

    .content_section {
      display: flex;
      flex-direction: column;

      .text_input {
        margin-top: 24px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;

      button:first-child {
        margin-right: 24px;
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakPoints.xSmall}) {
    .MuiBox-root {
      width: 100vw;
      height: 100vh;
      background: ${({ theme }) => theme.palette.primary.light};

      form {
        padding: 72px 24px 24px 24px;
      }
    }
  }
`;

const CreateOrEditSale = ({
  createOrEditSaleOpen,
  setCreateOrEditSaleOpen,
  setSelectedSale,
  selectedSale,
  currentUser,
  activeEvent,
}) => {
  const { register, handleSubmit, reset, watch } = useForm();

  const isNewSale = isEmpty(selectedSale);
  const allGuests = activeEvent?.guests;
  const selectedName = watch()?.name;

  useEffect(() => {
    if (isNewSale) {
      if (selectedName) {
        const selectedGuest = allGuests?.filter((guest) => guest?.name === selectedName)[0];

        reset({ artistName: currentUser?.displayName, ...selectedGuest });
      }
    } else {
      reset(selectedSale);
    }
  }, [reset, selectedSale, allGuests, isNewSale, currentUser, selectedName]);

  useEffect(() => {
    if (!createOrEditSaleOpen) {
      reset({});
    }
  }, [createOrEditSaleOpen, reset]);

  const dispatch = useDispatch();
  const db = getDatabase();

  const updateOrCreateSale = (data) => {
    setSelectedSale({});
    setCreateOrEditSaleOpen(false);

    if (isNewSale) {
      const saleUID = push(ref(db, `events/${activeEvent?.eventName}/sales`), data).key;

      set(ref(db, `events/${activeEvent?.eventName}/sales/${saleUID}`), {
        ...data,
        saleUID,
      })
        .then(() => {
          dispatch(
            openSnackBar({
              message: 'you successfully added a new sale',
            })
          );
        })
        .catch(() => {
          dispatch(
            openSnackBar({
              message: 'There was an issue creating your sale',
              status: 'error',
            })
          );
        });
    } else {
      set(ref(db, `events/${activeEvent?.eventName}/sales/${data.saleUID}`), data)
        .then(() => {
          dispatch(
            openSnackBar({
              message: 'you successfully updated sale',
            })
          );
        })
        .catch(() => {
          dispatch(
            openSnackBar({
              message: 'There was an issue updating your sale',
              status: 'error',
            })
          );
        });
    }
  };

  return (
    <StyledCreateOrEditSale open={createOrEditSaleOpen}>
      <Box>
        <Typography>
          <form onSubmit={handleSubmit(updateOrCreateSale)}>
            <h3 className="bold">{isNewSale ? 'Add A New Sale' : 'Edit Existing Sale'}</h3>
            <div className="content_section">
              {currentUser?.superUser && (
                <TextField
                  {...register('artistName', { required: true })}
                  label="Artist Name*"
                  className="text_input"
                  variant="outlined"
                  size="small"
                />
              )}
              {selectedName ? (
                <TextField
                  {...register('name', { required: true })}
                  label="Art sold to*"
                  className="text_input"
                  variant="outlined"
                  size="small"
                  disabled
                />
              ) : (
                <Autocomplete
                  disablePortal
                  className="text_input"
                  variant="outlined"
                  size="small"
                  options={allGuests?.map((guest) => ({ label: guest?.name }))}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...register('name', { required: true })}
                        {...params}
                        value={selectedName}
                        label="Art sold to*"
                      />
                    );
                  }}
                />
              )}
              <TextField
                {...register('costOfSale')}
                label="Cost Of Sale"
                className="text_input"
                variant="outlined"
                size="small"
                type="number"
                step="0.01"
              />
              <TextField
                {...register('ticketsBought', { required: true, min: 1 })}
                label="Tickets Bought (must be greater than 0)"
                className="text_input"
                variant="outlined"
                size="small"
                type="number"
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div className="buttons">
              <Button
                onClick={() => {
                  setCreateOrEditSaleOpen(false);
                  setSelectedSale({});
                }}
                variant="outlined"
              >
                Never Mind
              </Button>
              <Button variant="contained" type="submit">
                {isNewSale ? 'Create Sale' : 'Update Sale'}
              </Button>
            </div>
          </form>
        </Typography>
      </Box>
    </StyledCreateOrEditSale>
  );
};

export default CreateOrEditSale;
