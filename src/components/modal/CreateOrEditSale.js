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

const DEFAULT_SALE = {
  name: "",
  artistName: "",
  email: "",
  instagramHandle: "",
  ticketsBought: 0,
};

const StyledCreateOrEditSale = styled(Modal)`
  .MuiBox-root {
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 24px;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.white};

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
`;

const CreateOrEditSale = ({
  createOrEditSaleOpen,
  setCreateOrEditSaleOpen,
  setSelectedSale,
  selectedSale,
  currentUser,
  currentEventName,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const isNewSale = isEmpty(selectedSale);

  useEffect(() => {
    if (isNewSale) {
      if (currentUser?.superUser) {
        reset(DEFAULT_SALE);
      } else {
        reset({ ...DEFAULT_SALE, artistName: currentUser?.email });
      }
    } else {
      reset(selectedSale);
    }
  }, [isNewSale, reset, selectedSale, currentUser]);

  const db = getDatabase();

  const updateOrCreateSale = (data) => {
    setSelectedSale({});
    setCreateOrEditSaleOpen(false);

    if (isNewSale) {
      const newSaleKey = push(
        ref(db, `events/${currentEventName}/sales`),
        data
      ).key;

      console.log({ newSaleKey });

      set(ref(db, `events/${currentEventName}/sales/${newSaleKey}`), {
        ...data,
        newSaleKey,
      });
    } else {
      set(ref(db, `events/${currentEventName}/sales/${data.newSaleKey}`), data);
    }
  };

  return (
    <StyledCreateOrEditSale open={createOrEditSaleOpen}>
      <Box>
        <Typography>
          <form onSubmit={handleSubmit(updateOrCreateSale)}>
            <h3>{isNewSale ? "Add A New Sale" : "Edit Existing Sale"}</h3>
            <div className="content_section">
              <TextField
                {...register("artistName")}
                label="Artist Name"
                className="text_input"
                variant="outlined"
                size="small"
                disabled={!currentUser?.superUser}
              />
              <TextField
                {...register("name")}
                label="Art sold to"
                className="text_input"
                variant="outlined"
                size="small"
              />
              <TextField
                {...register("email")}
                label="Email"
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
                {...register("ticketsBought")}
                label="Tickets Bought"
                className="text_input"
                variant="outlined"
                size="small"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
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
