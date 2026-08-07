// src/context/CurrentUserContext.js

import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../store/admin/action";

const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Select profile data from Redux store
  const profile = useSelector((state) => state.admin.admin);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <CurrentUserContext.Provider value={{ profile }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

// custom hook for easy access
export const useCurrentUser = () => useContext(CurrentUserContext);
