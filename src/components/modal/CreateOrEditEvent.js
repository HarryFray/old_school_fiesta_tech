import React, { useEffect } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { isEmpty } from "lodash";

import Typography from "../../global/Typography";

const DEFAULT_EVENT = {
  name: "",
  artistName: "",
  email: "",
  instagramHandle: "",
  ticketsBought: 0,
};

const StyledCreateOrEditEvent = styled(Modal)`
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

const CreateOrEditEvent = ({
  createOrEditEventOpen,
  setCreateOrEditEventOpen,
  setSelectedEvent,
  selectedEvent,
  handleUpdateEvent,
  handleCreateEvent,
  currentUser,
}) => {
  const { register, handleSubmit, reset } = useForm();

  const isNewEvent = isEmpty(selectedEvent);

  useEffect(() => {
    if (isNewEvent) {
      if (currentUser?.superUser) {
        reset(DEFAULT_EVENT);
      } else {
        reset({ ...DEFAULT_EVENT, artistName: currentUser?.email });
      }
    } else {
      reset(selectedEvent);
    }
  }, [isNewEvent, reset, selectedEvent, currentUser]);

  const onSubmit = (data) => {
    setSelectedEvent({});
    setCreateOrEditEventOpen(false);
    isNewEvent ? handleCreateEvent(data) : handleUpdateEvent(data?.id, data);
  };

  return (
    <StyledCreateOrEditEvent open={createOrEditEventOpen}>
      <Box>
        <Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3>{isNewEvent ? "Add A New Event" : "Edit Existing Event"}</h3>
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
                  setCreateOrEditEventOpen(false);
                  setSelectedEvent({});
                }}
                variant="outlined"
              >
                Never Mind
              </Button>
              <Button variant="contained" type="submit">
                {isNewEvent ? "Create Event" : "Update Event"}
              </Button>
            </div>
          </form>
        </Typography>
      </Box>
    </StyledCreateOrEditEvent>
  );
};

export default CreateOrEditEvent;
