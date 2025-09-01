
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";    
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // includes Popper.js
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);