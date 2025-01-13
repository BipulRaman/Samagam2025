import React, { useState } from "react";
import Img from "./BG.png";
import { toJpeg } from 'html-to-image';
import styles from "./App.module.css";

function App() {
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

  const handleDownload = () => {
    try {
      const node = document.getElementById('alumniId')?.children[0];
      if (node) {
        toJpeg(node, { quality: 0.95 })
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'Alumni_Id.jpeg';
            link.href = dataUrl;
            link.click();
          });
      }
    }
    catch (error) {
    }
  }

  return (
    <>
      <div className={styles.idCardContainer}>
        {/* ID Card UI */}
        <div className={styles.idCard} id="alumniId">
          <div ref={captureRef} className={styles.idCardContent} style={{ backgroundImage: `url(${Img})` }}>
            <div className={styles.candidateName}>
              <div className={styles.name}>{name}</div>
              <div className={styles.schoolName}>{schoolName}</div>
            </div>
            <div className={styles.profileContainer}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" />
              ) : (
                <div>Upload Image</div>
              )}
            </div>
          </div>
        </div>

        {/* Input for Image Upload */}
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label
              htmlFor="imageInput"
            >
              Upload Image:
            </label>
            <input
              type="file"
              id="imageInput"
              alt="Photo"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label
              htmlFor="textInput"
            >
              Name:
            </label>
            <input
              type="text"
              id="textInput"
              onChange={handleTextChange}
            />
          </div>
          <div className={styles.inputGroup}>
            <label
              htmlFor="schoolInput"
            >
              JNV Name:
            </label>
            <input
              type="text"
              id="schoolInput"
              onChange={handleSchoolChange}
            />
          </div>
          <button
            onClick={handleDownload}
            className={styles.downloadButton}
            style={{ display: name || schoolName ? "block" : "none" }}
          >
            Download as Image
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
