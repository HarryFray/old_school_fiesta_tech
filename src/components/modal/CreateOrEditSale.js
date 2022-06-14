import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { isEmpty } from "lodash";
import { getDatabase, ref, push, set } from "firebase/database";

import Typography from "../../global/Typography";

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
  activeEventName,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const isNewSale = isEmpty(selectedSale);
  const db = getDatabase();

  // MANAGES SALE FIELDS ON OPENING MODAL BASED ON USER ACCESS AND NEW/EDIT
  useEffect(() => {
    if (isNewSale) {
      if (currentUser?.superUser) {
        reset({});
      } else {
        reset({ artistName: currentUser?.displayName });
      }
    } else {
      reset(selectedSale);
    }
  }, [isNewSale, reset, selectedSale, currentUser]);

  const updateOrCreateSale = (data) => {
    setSelectedSale({});
    setCreateOrEditSaleOpen(false);

    if (isNewSale) {
      const saleUID = push(
        ref(db, `events/${activeEventName}/sales`),
        data
      ).key;

      set(ref(db, `events/${activeEventName}/sales/${saleUID}`), {
        ...data,
        saleUID,
      });
    } else {
      set(ref(db, `events/${activeEventName}/sales/${data.saleUID}`), data);
    }
  };

  return (
    <StyledCreateOrEditSale open={createOrEditSaleOpen}>
      <Box>
        <Typography>
          <form onSubmit={handleSubmit(updateOrCreateSale)}>
            <h3 className="bold">{isNewSale ? "Add A New Sale" : "Edit Existing Sale"}</h3>
            <div className="content_section">
              <TextField
                {...register("artistName", { required: true })}
                label="Artist Name*"
                className="text_input"
                variant="outlined"
                size="small"
                disabled={!currentUser?.superUser}
              />
              <TextField
                {...register("name", { required: true })}
                label="Art sold to*"
                className="text_input"
                variant="outlined"
                size="small"
              />
              <TextField
                {...register("email", { required: true })}
                label="Email*"
                className="text_input"
                variant="outlined"
                size="small"
              />
              <TextField
                {...register("instagramHandle")}
                label="Instagram Handle"
                className="text_input"
                variant="outlined"
                size="small"
              />
              <TextField
                {...register("costOfSale")}
                label="Cost Of Sale"
                className="text_input"
                variant="outlined"
                size="small"
                type="number"
                step="0.01"
              />
              <TextField
                {...register("ticketsBought", { required: true, min: 1 })}
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
                {isNewSale ? "Create Sale" : "Update Sale"}
              </Button>
            </div>
          </form>
        </Typography>
      </Box>
    </StyledCreateOrEditSale>
  );
};

export default CreateOrEditSale;
