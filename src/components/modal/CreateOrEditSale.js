import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

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
}) => {
  const { register, handleSubmit, reset } = useForm();

  console.log({ selectedSale });

  useEffect(() => {
    if (selectedSale?.name) {
      reset(selectedSale);
    } else {
      reset(DEFAULT_SALE);
    }
  }, [selectedSale, reset]);

  const onSubmit = (data) => {
    setSelectedSale({});
    console.log(data);
  };

  return (
    <StyledCreateOrEditSale open={createOrEditSaleOpen}>
      <Box>
        <Typography>
          <form onClick={handleSubmit(onSubmit)}>
            <h3>Add Sale</h3>
            <div className="content_section">
              <TextField
                {...register("artistName")}
                label="Artist Name"
                className="text_input"
                variant="outlined"
                size="small"
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
              <Button
                onClick={() => setCreateOrEditSaleOpen(false)}
                variant="contained"
                type="submit"
              >
                Create Sale
              </Button>
            </div>
          </form>
        </Typography>
      </Box>
    </StyledCreateOrEditSale>
  );
};

CreateOrEditSale.propTypes = {
  CreateOrEditSaleOpen: PropTypes.bool.isRequired,
  setCreateOrEditSaleOpen: PropTypes.func.isRequired,
  setCitationIssuedModalOpen: PropTypes.func.isRequired,
};

export default CreateOrEditSale;
