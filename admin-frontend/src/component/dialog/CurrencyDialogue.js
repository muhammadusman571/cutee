import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tooltip
} from '@mui/material';
import { Cancel } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { CLOSE_CURRENCY_DIALOG } from '../../store/currency/types';
import { createNewCurrency, editCurrency } from '../../store/currency/action';
import { set } from 'date-fns';


const CurrencyDialogue = () => {
    const dispatch = useDispatch();
    const { dialog: open , dialogData } = useSelector(state => state.currency)
    console.log("dialogData", dialogData);
    


    const [currency, setCurrency] = useState({
        name: "",
        symbol: "",
        currencyCode: "",
        countryCode: "",
    });

    const [error, setError] = useState({});

   useEffect(() => {
    if (dialogData) {
        setCurrency({
            name: dialogData.name || "",
            symbol: dialogData.symbol || "",
            currencyCode: dialogData.currencyCode || "",
            countryCode: dialogData.countryCode || "",
        });
    }
}, [dialogData]);

    const validated = () => {
        const errors = {};
        if (!currency.name) errors.name = "Name Is Required !";
        if (!currency.symbol) errors.symbol = "Symbol Is Required !";
        if (!currency.currencyCode) errors.currencyCode = "Currency Code Is Required !";
        if (!currency.countryCode) errors.countryCode = "Country Code Is Required !";
        setError(errors);
        return Object.keys(errors).length === 0;
    };

   const handleChange = (e) => {
    const { name, value } = e.target;

    setCurrency(prev => ({ ...prev, [name]: value }));

    if (error[name]) {
        setError(prevError => {
            const newError = { ...prevError };
            delete newError[name];
            return newError;
        });
    }
};

   const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validated(); 

    if (!isValid) return; 

if(dialogData) {
    dispatch(editCurrency(dialogData._id, currency));
}else{
    dispatch(createNewCurrency(currency));
}

    setCurrency({
        name: "",
        symbol: "",
        currencyCode: "",
        countryCode: "",
    });

    setError({});

    closePopup();
};

    const closePopup = () => {
        dispatch({
            type: CLOSE_CURRENCY_DIALOG,
        });
        setCurrency({
            name: "",
            symbol: "",
            currencyCode: "",
            countryCode: "",
        });
        setError({});
    }


    return (
        <Dialog
            open={open}
            aria-labelledby="responsive-dialog-title"
            onClose={closePopup}
            disableBackdropClick
            disableEscapeKeyDown
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle id="responsive-dialog-title">
                <span className="text-danger font-weight-bold h4"> Currency </span>
            </DialogTitle>

            <IconButton
                style={{
                    position: "absolute",
                    right: 0,
                }}
            >
                <Tooltip title="Close">
                    <Cancel className="text-danger"
                        onClick={closePopup}
                    />
                </Tooltip>
            </IconButton>

            <DialogContent>
                <div className="modal-body pt-1 px-1 pb-3">
                    <div className="d-flex flex-column">
                        <form>
                            <div className="form-group col-12 mt-3">
                                <label className="mb-2 text-gray">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name='name'
                                    className="form-control"
                                    placeholder="Enter Name"
                                    required
                                    value={currency.name}
                                    onChange={handleChange}
                                />
                                {error.name && (
                                    <div className="ml-2 mt-1">
                                        {error.name && (
                                            <div className="pl-1 text__left">
                                                <span className="text-red">{error.name}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-group col-12 mt-3">
                                <label className="mb-2 text-gray">Symbol</label>
                                <input
                                    type="text"
                                    id="symbol"
                                    name="symbol"
                                    className="form-control"
                                    placeholder="Enter Symbol"
                                    required
                                    value={currency.symbol}
                                    onChange={handleChange}
                                />
                                {error.symbol && (
                                    <div className="ml-2 mt-1">
                                        {error.symbol && (
                                            <div className="pl-1 text__left">
                                                <span className="text-red">{error.symbol}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-group col-12 mt-3">
                                <label className="mb-2 text-gray">Currency code</label>
                                <input
                                    type="text"
                                    id="currencyCode"
                                    name="currencyCode"
                                    className="form-control"
                                    placeholder="Enter Currency code"
                                    required
                                    value={currency.currencyCode}
                                    onChange={handleChange}
                                />
                                {error.currencyCode && (
                                    <div className="ml-2 mt-1">
                                        {error.currencyCode && (
                                            <div className="pl-1 text__left">
                                                <span className="text-red">{error.currencyCode}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-group col-12 mt-3">
                                <label className="mb-2 text-gray">Country code</label>
                                <input
                                    type="text"
                                    id="countryCode"
                                    name="countryCode"
                                    className="form-control"
                                    placeholder="Enter Country code"
                                    required
                                    value={currency.countryCode}
                                    onChange={handleChange}
                                />
                                {error.countryCode && (
                                    <div className="ml-2 mt-1">
                                        {error.countryCode && (
                                            <div className="pl-1 text__left">
                                                <span className="text-red">{error.countryCode}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className='mt-4'>
                                <button
                                    type="button"
                                    className="btn btn-outline-info ml-2 btn-round float__right icon_margin"
                                    onClick={closePopup}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-round float__right btn-danger"
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CurrencyDialogue
