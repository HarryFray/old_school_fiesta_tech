import React from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "../global/Layout";

const SALES_DUMMY_DATA = [
  {
    name: "Nicholas Fray",
    artistName: "Joey Bada$$",
    email: "harry.fray7@gmail.com",
    instagramHandle: "harryfray",
    ticketsBought: 5,
  },
  {
    name: "Cat James",
    artistName: "Joey Bada$$",
    email: "cat.james@gmail.com",
    instagramHandle: "oldsolewhatever",
    ticketsBought: 2,
  },
  {
    name: "Patrick long name long",
    artistName: "Court Bada$$",
    email: "patrick_long_name@gmail.com",
    instagramHandle: "really long",
    ticketsBought: 22,
  },
  {
    name: "short name",
    artistName: "Court Bada$$",
    email: "sn7@gmail.com",
    instagramHandle: "asdf",
    ticketsBought: 33,
  },
  {
    name: "Bill whatever....",
    artistName: "Joey Bada$$",
    email: "harry.fray7@gmail.com",
    instagramHandle: "asdfasdfadsf",
    ticketsBought: 2,
  },
];

const StyledDashBoard = styled.div`
  height: 100%;
  width: 100%;

  .search_input {
    width: 180px;
  }

  table {
    margin: 20px 0 0 0;
    width: 100%;
    table-layout: fixed;

    thead {
      background: ${({ theme }) => theme.colors.black12};

      tr {
        th {
          padding: 14px 0 14px 20px;
          font-weight: normal;
          text-align: start;

          :first-child {
            border-radius: 4px;
            padding: 0 0 0 20px;
            border-radius: 4px 0 0 4px;
          }
        }

        .large_col {
          width: 24%;
        }

        .small_col {
          width: 14%;
        }
      }
    }

    tbody {
      tr {
        td {
          border-bottom: 0.5px solid ${({ theme }) => theme.colors.black34};

          padding: 10px 0 10px 20px;
          min-height: 62px;

          :first-child {
            padding: 0 0 0 20px;
          }
        }
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakPoints.small}) {
    margin: 0 20px 0 0;

    table {
      table-layout: unset;

      thead {
        tr {
          th {
            padding: 14px 0 14px 8px;
          }
        }
      }

      tbody {
        tr {
          td {
            padding: 10px 0 10px 8px;
          }
        }
      }
    }
  }
`;

const DashBoard = ({ auth }) => {
  const loadingSales = false;

  return (
    <Layout auth={auth}>
      <StyledDashBoard>
        <table>
          <thead>
            <tr>
              <th className="large_col">Name</th>
              <th className="large_col">Artist Name</th>
              <th className="large_col">Email</th>
              <th className="large_col">Instagram</th>
              <th className="small_col">Tickets</th>
              <th className="small_col">Action</th>
            </tr>
          </thead>
          {Boolean(SALES_DUMMY_DATA?.length && !loadingSales) && (
            <tbody>
              {SALES_DUMMY_DATA?.map((sale, id) => {
                const {
                  name,
                  artistName,
                  email,
                  instagramHandle,
                  ticketsBought,
                } = sale;

                return (
                  <React.Fragment key={id}>
                    <tr>
                      <td>{name}</td>
                      <td>{artistName}</td>
                      <td>{email}</td>
                      <td>{instagramHandle}</td>
                      <td>{ticketsBought}</td>
                      <td>EDIT</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          )}
        </table>
        {Boolean(loadingSales) && <CircularProgress color="inherit" />}
        {Boolean(!SALES_DUMMY_DATA?.length && !loadingSales) && (
          <h2>There is noting in your search!</h2>
        )}
      </StyledDashBoard>
    </Layout>
  );
};

export default DashBoard;
