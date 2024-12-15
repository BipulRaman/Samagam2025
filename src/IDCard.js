import React, { useState } from "react";
import Img from "./background.jpg";
import html2canvas from "html2canvas";

function IDCard() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const captureRef = React.createRef();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set image to state
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event) => {
    setName(event.target.value);
  };

  const handleSchoolChange = (event) => {
    setSchoolName(event.target.value);
  };

  const handleDownload = async () => {
    const element = captureRef.current;

    try {
      // Use html2canvas to capture the element
      const canvas = await html2canvas(element, { scale: 2 });

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Create a link to download the image
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "Samagam2025.png";
      link.click();
    } catch (error) {
      console.error("Failed to capture and download the image:", error);
    }
  };

  return (
    <div className="IDCard h-full grid grid-cols-1 gap-4 place-content-center">
      {/* ID Card UI */}
      <div className="grid place-content-center">
        <div
          ref={captureRef}
          className="relative"
          style={{
            backgroundImage: `url(${Img})`,
            backgroundSize: "cover",
            width: "500px",
            height: "500px",
          }}
        >
          <div className="canditate-name">
            <div className="w-fit grid gap-0 content-center rounded-full h-[10%] bottom-[24%] left-[22%] absolute">
              <div className="font-bold p-0 m-0">{name}</div>
              <div className="text-xs">{schoolName}</div>
            </div>
          </div>
          <div className="profile-container">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-[23%] grid content-center rounded-full h-[23%] bottom-[17%] right-[19%] absolute"
              />
            ) : (
              <div className="bg-white w-[23%] grid content-center rounded-full h-[23%] bottom-[17%] right-[19%] absolute">
                Upload Image
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input for Image Upload */}
      <div className="grid place-content-center">
        <div className="input-container mt-4 w-56 ">
          <div className="mb-4">
            <label
              htmlFor="imageInput"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image:
            </label>
            <input
              type="file"
              id="imageInput"
              alt="Photo"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="textInput"
              className="block text-sm font-medium text-gray-700"
            >
              Name:
            </label>
            <input
              type="text"
              id="textInput"
              onChange={handleTextChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="schoolInput"
              className="block text-sm font-medium text-gray-700"
            >
              School Name:
            </label>
            <input
              type="text"
              id="schoolInput"
              onChange={handleSchoolChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleDownload}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              width: "100%",
              display: (name || schoolName) ? "block" : "none",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              marginTop: "40px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
          >
            Download as Image
          </button>
        </div>
      </div>
    </div>
  );
}

export default IDCard;
