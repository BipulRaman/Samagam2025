import React from "react";
import ReactDOM from "react-dom/client";
import { SamagamPic } from "./components/SamagamPic/SamagamPic";
import { SamagamForm } from "./components/SamagamForm/SamagamForm";

const samagamPicElementId = "samagam-pic";
const samagamFormElementId = "samagam-form";

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

try {
  const samagamFormRoot = ReactDOM.createRoot(document.getElementById(samagamFormElementId) as HTMLElement);
  samagamFormRoot.render(
    <React.StrictMode>
      <SamagamForm />
    </React.StrictMode>
  );
}
catch (error) {
  console.log("Element with id " + samagamFormElementId + " is not available on this page");
}