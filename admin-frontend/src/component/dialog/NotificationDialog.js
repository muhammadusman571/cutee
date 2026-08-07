import React, { useState } from 'react';


//redux
import { connect, useSelector } from "react-redux";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Tooltip
} from '@mui/material';
import { Cancel } from "@mui/icons-material";
import ReactSelect from "react-select";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRef } from 'react';
import { useEffect } from 'react';


//notification  
import { useDispatch } from 'react-redux';
import { notification, personal } from '../../store/notification/action';
import { CLOSE_NOTIFICATION_DIALOG } from '../../store/notification/types';


const NotificationDialog = ({ props }) => {

    const dispatch = useDispatch();



    const { user } = useSelector(
        (state) => state.user
    );


    const selectedUserId = useSelector(state => state.notification.selectedUserId);
    const { dialog: open } = useSelector((state) => state.notification);

    const [imageData, setImageData] = useState();
    const [uniqueId, setUniqueId] = useState(selectedUserId);

    const [search, setSearch] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [imagePath, setImagePath] = useState();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");


    const [error, setError] = useState({
        title: "",
        description: ""
    });



    const scrollRef = useRef(null);



    const data = user;







    useEffect(() => {
        if (!open) {
            setImageData(undefined);
            setUniqueId("");
            setSearch("");
            setHasMore(true);
            setImagePath(undefined);
            setTitle("");
            setDescription("");
            setError({
                title: "",
                description: ""
            });

        }
    }, [open]);

    const HandleInputImage = (e) => {
        if (e.target.files[0]) {
            setImageData(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImagePath(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
            setError("")
        }
    };


    const closePopup = () => {
        dispatch({ type: CLOSE_NOTIFICATION_DIALOG });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description) {
            const errors = {};
            if (!title) error.title = "Title is Required!";
            if (!description) error.description = "description is Required!";
            return setError({ ...error });
        }


        const formData = new FormData();
        formData.append("title", title);
        formData.append("message", description);

        if (selectedUserId) {
            formData.append("userId", selectedUserId);
            if (imageData) formData.append("image", imageData);
            dispatch(personal(formData));
        } else {
            
            if (imageData) formData.append("image", imageData);
            dispatch(notification(formData));
        }

        closePopup();
    };






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
                <span className="text-danger font-weight-bold h4"> Notification </span>
            </DialogTitle>

            <IconButton
                style={{
                    position: "absolute",
                    right: 0,
                }}
            >
                <Tooltip title="Close">
                    <Cancel className="text-danger" onClick={closePopup} />
                </Tooltip>
            </IconButton>

            <DialogContent>
                <div className="modal-body pt-1 px-1 pb-3">
                    <div className="d-flex flex-column">
                        <form>
                            <div className="form-group col-12 mt-3">
                                <label className="mb-2 text-gray">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Title"
                                    required
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value.trim());

                                        if (!e.target.value) {
                                            return setError({
                                                ...error,
                                                title: "Title can't be a blank!",
                                            });
                                        } else {
                                            return setError({
                                                ...error,
                                                title: "",
                                            });
                                        }
                                    }}
                                />
                                {error.title && (
                                    <div className="ml-2 mt-1">
                                        {error.title && (
                                            <div className="pl-1 text__left">
                                                <span className="text-red">{error.title}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="form-group col-12 mt-3">
                                <label className="mb-2 text-gray">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Description"
                                    required
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value.trim());

                                        if (!e.target.value) {
                                            return setError({
                                                ...error,
                                                description: "Description can't be a blank!",
                                            });
                                        } else {
                                            return setError({
                                                ...error,
                                                description: "",
                                            });
                                        }
                                    }}
                                />
                                {error.description && (
                                    <div className="ml-2 mt-1">
                                        {error.description && (
                                            <div className="pl-1 text__left">
                                                <span className="text-red">{error.description}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>


                            <div className="form-group mt-4">
                                <label className="mb-2 text-gray">Image</label>
                                <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    accept="image/jpg,image/jpeg,image/png,image/gif"
                                    required=""
                                    onChange={HandleInputImage}
                                />

                                {imagePath && (
                                    <>
                                        <img
                                            height="70px"
                                            width="70px"
                                            alt="app"
                                            src={imagePath}
                                            style={{
                                                // boxShadow: "0 5px 15px 0 rgb(105 103 103 / 50%)",
                                                // border: "2px solid #fff",
                                                borderRadius: 10,
                                                marginTop: 10,
                                                float: "left",
                                            }}
                                        />
                                    </>
                                )}
                            </div>
                            <div className={imagePath ? "mt-5 pt-5" : "mt-5"}>
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
    );
};

export default connect(null, { notification })(NotificationDialog);
