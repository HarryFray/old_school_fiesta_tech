import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import Modal from "@mui/material/Modal";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

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
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      button:first-child {
        margin-right: 24px;
      }
    }
  }
`;

const CreateOrEditSale = ({
  createOrEditSaleOpen,
  setCreateOrEditSaleOpen,
}) => {
  const { register, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      // SECTION 1: CITATION DETAILS
      isAdult: "adult",
      eventNumber: "",
      IDNumber: "",
      citationType: "traffic",
      trafficCitationEnhancements: [],
      area: "urban",
      travelDirection: "north",
      beatArea: "",
    },
  });

  const onSubmit = (data) => console.log(data);

  return (
    <StyledCreateOrEditSale open={createOrEditSaleOpen}>
      <Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="label">Add Sale</h3>
          <div className="content_section"></div>
          <div className="buttons">
            <Button
              onClick={() => setCreateOrEditSaleOpen(false)}
              variant="outlined"
            >
              Never Mind
            </Button>
            <Button
              onClick={() => setCreateOrEditSaleOpen(false)}
              variant="contained"
            >
              Create Sale
            </Button>
          </div>
        </form>
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
