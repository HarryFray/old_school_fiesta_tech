import React, { useState } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Layout from "../global/Layout";
import CreateOrEditSale from "../components/modal/CreateOrEditSale";

const filteredSalesBasedOnSearchText = (sales, searchText) => {
  let searchedSales = sales?.filter((sale) => {
    let nameIncludedInSearch = sale.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    let artistIncludedInSearch = sale.artistName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return nameIncludedInSearch || artistIncludedInSearch;
  });
  return searchedSales;
};

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
  {
    name: "Nicholas Fray",
    artistName: "Joey Bada$$",
    email: "harry.fray7@gmail.com",
    instagramHandle: "harryfray",
    ticketsBought: 5,
  },
  {
    name: "Cat t",
    artistName: "Joey tBada$$",
    email: "cat.james@gtmail.com",
    instagramHandle: "oldsoltewhatever",
    ticketsBought: 11,
  },
  {
    name: "Patrick long naqqme long",
    artistName: "Court Badqa$$",
    email: "patrick_long_namqe@gmail.com",
    instagramHandle: "reqally long",
    ticketsBought: 1,
  },
  {
    name: "short naeme",
    artistName: "Court Baeda$$",
    email: "sn7@gmreail.com",
    instagramHandle: "asedf",
    ticketsBought: 1,
  },
  {
    name: "Bill whrratever....",
    artistName: "Joey Badra$$",
    email: "harsrsy.fray7@gmail.com",
    instagramHandle: "asddfadsf",
    ticketsBought: 456,
  },
];

const StyledDashBoard = styled.div`
  height: 100%;
  width: 100%;

  .table_management_heading {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;

    .filter_text_input {
      width: 180px;
    }
  }

  table {
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

        .fixed_action_col {
          width: 120px;
        }
      }
    }

    tbody {
      tr {
        td {
          border-bottom: 0.5px solid ${({ theme }) => theme.colors.black34};

          padding: 0 0 0 20px;

          :first-child {
            padding: 0 0 0 20px;
          }

          :last-child {
            display: flex;
            padding: 0;
          }
        }
      }
    }
  }

  .loading_icon,
  .empty_search_text {
    display: flex;
    flex-direction: column;
    margin: 48px 0 0 0;
    width: 100%;
    align-items: center;
    justify-content: center;

    h6 {
      margin: 8px 0 0 0;
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
  const [filterText, setFilterText] = useState("");

  const [createOrEditSaleOpen, setCreateOrEditSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState({});

  const filteredSales = filteredSalesBasedOnSearchText(
    SALES_DUMMY_DATA,
    filterText
  );

  const loadingSales = false;

  return (
    <>
      <CreateOrEditSale
        createOrEditSaleOpen={createOrEditSaleOpen}
        setCreateOrEditSaleOpen={setCreateOrEditSaleOpen}
        setSelectedSale={setSelectedSale}
        selectedSale={selectedSale}
      />
      <Layout auth={auth}>
        <StyledDashBoard>
          <div className="table_management_heading">
            <TextField
              label="Search"
              className="filter_text_input"
              variant="outlined"
              size="small"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <Button
              size="small"
              onClick={() => setCreateOrEditSaleOpen(true)}
              variant="contained"
            >
              ADD SALE
            </Button>
          </div>
          <table>
            <thead>
              <tr>
                <th className="large_col">Artist's Name</th>
                <th className="large_col">Art Sold To</th>
                <th className="large_col">Email</th>
                <th className="large_col">Instagram</th>
                <th className="small_col">Tickets</th>
                <th className="fixed_action_col">Action</th>
              </tr>
            </thead>
            {Boolean(filteredSales?.length && !loadingSales) && (
              <tbody>
                {filteredSales?.map((sale, id) => {
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
                        <td>{artistName}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{instagramHandle}</td>
                        <td>{ticketsBought}</td>
                        <td>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedSale(sale);
                              setCreateOrEditSaleOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => alert("TODO: DELETE ITEM")}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            )}
          </table>
          {Boolean(loadingSales) && (
            <div className="loading_icon">
              <CircularProgress color="inherit" />
            </div>
          )}
          {Boolean(!filteredSales?.length && !loadingSales) && (
            <div className="empty_search_text">
              <h2>No sales available</h2>
              <h6 className="subtitle-2">
                Either sell something or update your search
              </h6>
            </div>
          )}
        </StyledDashBoard>
      </Layout>
    </>
  );
};

export default DashBoard;
