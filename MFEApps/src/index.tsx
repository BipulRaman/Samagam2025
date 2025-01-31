import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { SamagamSearch } from "./components/SamagamSearch/SamagamSearch";
import { SamagamPic } from "./components/SamagamPic/SamagamPic";
import { MedicoSearch } from "./components/MedicoSearch/MedicoSearch";
import { SamagamInvite } from "./components/SamagamInvite/SamagamInvite";

const samagamSearchElementId = "samagam-search";
const samagamPicElementId = "samagam-pic";
const medicoSearchElementId = "medico-search";
const samagamInviteElementId = "samagam-invite";

try {
  const samagamSearchRoot = ReactDOM.createRoot(document.getElementById(samagamSearchElementId) as HTMLElement);
  samagamSearchRoot.render(
    <React.StrictMode>
      <SamagamSearch />
    </React.StrictMode>
  );
}
catch (error) {
  console.log("Element with id " + samagamSearchElementId + " is not available on this page");
}

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
  const medicoSearchRoot = ReactDOM.createRoot(document.getElementById(medicoSearchElementId) as HTMLElement);
  medicoSearchRoot.render(
    <React.StrictMode>
      <MedicoSearch />
    </React.StrictMode>
  );
}
catch (error) {
  console.log("Element with id " + medicoSearchElementId + " is not available on this page");
}

try {
  const samagamInviteRoot = ReactDOM.createRoot(document.getElementById(samagamInviteElementId) as HTMLElement);
  samagamInviteRoot.render(
    <React.StrictMode>
      <SamagamInvite />
    </React.StrictMode>
  );
}
catch (error) {
  console.log("Element with id " + samagamInviteElementId + " is not available on this page");
}