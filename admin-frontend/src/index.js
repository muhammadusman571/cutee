import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Redux Store
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/provider";

// Axios Configuration
import axios from "axios";
import { baseURL } from "./util/Config";

// Spinner Action Types
import {
  CLOSE_SPINNER_PROGRESS,
  OPEN_SPINNER_PROGRESS,
} from "./store/spinner/types";
import { CurrentUserProvider } from "./context/CurrentUser";

// Axios Defaults
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

// Axios Interceptors
axios.interceptors.request.use(
  (req) => {
    store.dispatch({ type: OPEN_SPINNER_PROGRESS });
    return req;
  },
  (error) => {
    console.error("Request Error:", error);
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (res) => {
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return res;
  },
  (err) => {
    if (err.message === "Network Error") {
      console.error("Network Error:", err);
    }
    store.dispatch({ type: CLOSE_SPINNER_PROGRESS });
    return Promise.reject(err);
  }
);

// ReactDOM Render
ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// Report Web Vitals (Optional)
reportWebVitals();
