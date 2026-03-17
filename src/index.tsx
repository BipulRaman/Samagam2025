import React from "react";
import ReactDOM from "react-dom/client";
import { SamagamPic } from "./components/SamagamPic/SamagamPic";

const samagamPicElementId = "samagam-pic";

try {
  const samagamPicRoot = ReactDOM.createRoot(document.getElementById(samagamPicElementId) as HTMLElement);
  samagamPicRoot.render(
    <React.StrictMode>
      <SamagamPic />
    </React.StrictMode>
  );
}
catch (error) {
  console.log("Element with id " + samagamPicElementId + " is not available on this page");
}