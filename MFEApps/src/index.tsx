import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { SamagamSearch } from "./components/SamagamSearch/SamagamSearch";
import { SamagamPic } from "./components/SamagamPic/SamagamPic";

const samagamSearchElementId = "samagam-search";
const samagamPicElementId = "samagam-pic";

try {
  const samagamSearchRoot = ReactDOM.createRoot(document.getElementById(samagamSearchElementId) as HTMLElement);
  samagamSearchRoot.render(
    <React.StrictMode>
      <SamagamSearch />
    </React.StrictMode>
  );
} catch (error) {
  console.log("Element with id " + samagamSearchElementId + " is not available on this page");
}

try {
  const samagamPicRoot = ReactDOM.createRoot(document.getElementById(samagamPicElementId) as HTMLElement);
  samagamPicRoot.render(
    <React.StrictMode>
      <SamagamPic />
    </React.StrictMode>
  );
} catch (error) {
  console.log("Element with id " + samagamPicElementId + " is not available on this page");
}