import { tr } from 'date-fns/locale';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteCurrency, getCurrency, updateCurrencyStatus } from '../../store/currency/action';
import CurrencyDialogue from '../dialog/CurrencyDialogue';
import { Tooltip } from '@mui/material';
import { OPEN_CURRENCY_DIALOG } from '../../store/currency/types';
import { warning } from '../../util/Alert';

const Currency = () => {
  const dispatch = useDispatch();

  const { currency } = useSelector((state) => state.currency);
  console.log("currency", currency);
  


  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);


  useEffect(() => {
    dispatch(getCurrency());
  }, []);

  useEffect(() => {
    setData(currency);
    setTotal(currency.total);
  }, [currency]);

  const handleOpen = () => {
    dispatch({ type: OPEN_CURRENCY_DIALOG });
  };

  const handleEdit = (data) => {

    dispatch({ type: OPEN_CURRENCY_DIALOG, payload: data });
  };

  const handleDelete = (id) => {
    console.log("id", id);


    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          dispatch(deleteCurrency(id));
        }
      })
      .catch((err) => console.log(err));
  }

  const handleSwitch = (id) => {
    dispatch(updateCurrencyStatus(id));
  };


  return (
    <>
      <CurrencyDialogue />
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-header pb-0">
              <div className="row my-3">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-8 float-left">
                  <button
                    type="button"
                    className="btn waves-effect waves-light btn-danger btn-sm float-left"
                    onClick={handleOpen}
                    id="bannerDialog"
                  >
                    <i className="fa fa-plus"></i>
                    <span className="icon_margin">New</span>
                  </button>
                </div>

              </div>
            </div>
            <div className="card-body card-overflow">
              {/* <div className="d-sm-flex align-items-center justify-content-between mb-4"></div> */}

              <table className="table table-striped">
                <thead className="text-white">
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Country  code</th>
                    <th>Currency code</th>
                    <th>Is Default</th>
                    <th>Created date</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {data.length > 0 ? (
                    (rowsPerPage > 0
                      ? data.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      : data
                    ).map((data, index) => {
                      return (

                        <tr key={index + data._id}>
                          <td>{index + 1}</td>
                          <td>{data?.name}</td>
                          <td>{data?.symbol}</td>
                          <td>{data?.countryCode}</td>
                          <td>{data?.currencyCode}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={data?.isDefault}
                                onChange={() => handleSwitch(data?._id)}
                              />
                              <span className="slider">
                                <p
                                  style={{
                                    fontSize: 12,
                                    marginLeft: `${data?.isDefault ? '-22px' : '35px'
                                      }`,
                                    color: '#000',
                                    marginTop: '6px',
                                  }}
                                >
                                  {data?.isDefault ? 'Yes' : 'No'}
                                </p>
                              </span>
                            </label>
                          </td>
                          <td>{data?.createdAt?.split('T')[0]}</td>
                          <td>
                            <Tooltip title="Edit">
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEdit(data)}
                              >
                                <i className="fa fa-edit"></i>
                              </button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="Delete">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(data._id)}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </Tooltip>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="9" align="center">
                        Nothing to show!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* <Pagination
                      activePage={activePage}
                      rowsPerPage={rowsPerPage}
                      userTotal={redeemOptions.length}
                      handleRowsPerPage={handleRowsPerPage}
                      handlePageChange={handlePageChange}
                    /> */}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default Currency
