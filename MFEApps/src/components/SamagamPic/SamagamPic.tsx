import React, { useState } from "react";
import { toJpeg } from 'html-to-image';
import styles from "./SamagamPic.module.css";
import { Config } from "../../config";

export const SamagamPic = () => {
  const [profileImage, setProfileImage] = useState<string | ArrayBuffer | null>(null);
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const captureRef = React.createRef<HTMLDivElement>();

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Set image to state
      };
      reader.readAsDataURL(file);
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSchoolChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolName(event.target.value);
  };

  const handleDownload = () => {
    try {
      const node = document.getElementById('alumniId')?.children[0];
      if (node) {
        toJpeg(node as HTMLElement, { quality: 0.95 })
          .then(function (dataUrl: string) {
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
          <div ref={captureRef} className={styles.idCardContent} style={{ backgroundImage: `url(${Config.SamagamBGImage})` }}>
            <div className={styles.candidateName}>
              <div className={styles.name}>{name}</div>
              <div className={styles.schoolName}>{schoolName}</div>
            </div>
            <div className={styles.profileContainer}>
              {profileImage ? (
                <img src={typeof profileImage === 'string' ? profileImage : undefined} alt="Profile" />
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