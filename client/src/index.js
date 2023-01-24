import React from "react";
import ReactDOM from "react-dom/client";
import App from "./component/App";
import GlobalStyles from "./component/GlobalStyles";
import { CurrentUserProvider } from "./component/CurrentUserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CurrentUserProvider>
      <GlobalStyles />
      <App />
    </CurrentUserProvider>
  </React.StrictMode>
);
