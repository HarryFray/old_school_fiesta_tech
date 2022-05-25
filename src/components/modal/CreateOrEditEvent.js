import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { isEmpty } from "lodash";

import Typography from "../../global/Typography";

const DEFAULT_EVENT = {
  eventName: "",
  dateOccuring: "",
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

    .artists_section {
      margin-top: 24px;
      border: 1px solid ${({ theme }) => theme.colors.black34};
      padding: 12px;
      border-radius: 4px;

      .artists_inputs {
        .artist_inputs {
          div:first-child {
            margin-right: 12px;
          }
          .text_input {
            margin-top: 12px;
          }
        }
      }

      .manage_artists_buttons {
        display: flex;
        justify-content: space-between;

        .add_artist_button {
          margin-top: 24px;
        }
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
  const [artists, setArtists] = useState([{}]);
  const { register, handleSubmit, reset, getValues } = useForm();

  console.log(getValues());

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
            <h3>{isNewEvent ? "Create New Event" : "Edit Existing Event"}</h3>
            <div className="content_section">
              <TextField
                {...register("eventName")}
                label="Event Name"
                className="text_input"
                variant="outlined"
                size="small"
                disabled={!currentUser?.superUser}
              />
              <TextField
                {...register("dateOccuring")}
                label="Date Of Event"
                className="text_input"
                variant="outlined"
                size="small"
              />
              <div className="artists_section">
                <h4>Artists:</h4>
                <div className="artists_inputs">
                  {artists.map((_, i) => {
                    return (
                      <div className="artist_inputs" key={i}>
                        <TextField
                          {...register(`artist_name_${i}`)}
                          label="Name"
                          className="text_input"
                          variant="outlined"
                          size="small"
                        />
                        <TextField
                          {...register(`artist_email_${i}`)}
                          label="Email"
                          className="text_input"
                          variant="outlined"
                          size="small"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="manage_artists_buttons">
                  <Button
                    className="add_artist_button"
                    onClick={() => setArtists(artists.slice(1))}
                    variant="outlined"
                  >
                    Delete Artist
                  </Button>
                  <Button
                    className="add_artist_button"
                    onClick={() => setArtists([...artists, {}])}
                    variant="outlined"
                  >
                    Add Artist
                  </Button>
                </div>
              </div>
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