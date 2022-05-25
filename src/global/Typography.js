import React from "react";
import styled from "styled-components";

const StyledTypography = styled.div`
  h1 {
    font-size: 28px;
    font-style: normal;
    font-weight: normal;
    line-height: 30px;
  }

  h2 {
    font-size: 24px;
    font-style: normal;
    font-weight: bold;
    line-height: 30px;
    letter-spacing: 0.15px;
    margin: 48px auto 34px;
  }

  h3 {
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    letter-spacing: 0.5px;
  }

  h4 {
    font-size: 18px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    letter-spacing: 0.25px;
  }

  a {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 16px;
    letter-spacing: 0.5px;
    text-decoration-line: none;
    text-transform: capitalize;

    :visited {
      color: ${({ theme }) => theme.colors.black};
    }

    :hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  .subtitle {
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    line-height: 28px;
    letter-spacing: 0.15px;
  }

  .subtitle-2 {
    font-size: 18px;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
    letter-spacing: 0.1px;
  }

  .caption {
    font-size: 16px;
    font-style: normal;
    font-weight: normal;
    line-height: 20px;
    letter-spacing: 0.4px;
  }

  .label {
    font-size: 14px;
    font-style: normal;
    font-weight: normal;
    line-height: 18px;
    letter-spacing: 0.4px;
    color: ${({ theme }) => theme.colors.black87};
  }

  .break_line {
    border-top: 0.5px solid ${({ theme }) => theme.colors.black12};
    margin: 40px 0 30px;
  }

  .bold {
    font-weight: bold;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;
  }
`;

const Typography = ({ children }) => {
  return <StyledTypography>{children}</StyledTypography>;
};

export default Typography;
