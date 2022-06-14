import React from "react";
import styled from "styled-components";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Typography from "../../global/Typography";

const StyledDeleteConfirmation = styled(Modal)`
  .MuiBox-root {
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 24px;
    transform: translate(-50%, -50%);
    background: ${({ theme }) => theme.palette.primary.light};

    max-width: 450px;

    h6 {
      margin-top: 12px;
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

      > div {
        padding: 72px 24px 24px 24px;
      }
    }
  }
`;

const DeleteConfirmation = ({
  deleteConfirmationModalOpen,
  setDeleteConfirmationModalOpen,
  handleDeletion,
}) => {
  const handleClickDelete = () => {
    setDeleteConfirmationModalOpen(false);
    handleDeletion();
  };

  return (
    <StyledDeleteConfirmation open={deleteConfirmationModalOpen}>
      <Box>
        <Typography>
          <h3>Are You Sure You Want to Delete!?</h3>
          <h6 className="subtitle-2">
            It's a really big deal if you do, it's not like you can just create
            a new one that is the same as this one was...
          </h6>
          <div className="buttons">
            <Button
              onClick={() => setDeleteConfirmationModalOpen(false)}
              variant="outlined"
            >
              Never Mind
            </Button>
            <Button variant="contained" onClick={handleClickDelete}>
              Yes... Forever
            </Button>
          </div>
        </Typography>
      </Box>
    </StyledDeleteConfirmation>
  );
};

export default DeleteConfirmation;
