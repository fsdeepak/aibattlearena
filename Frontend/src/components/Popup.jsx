import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css"; // Ensure styles are imported

function HomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Trigger the popup when the component mounts (on page load)
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <Popup open={isOpen} closeOnDocumentClick onClose={closeModal} modal>
        <div style={styles.modal}>
          <button style={styles.close} onClick={closeModal}>
            &times;
          </button>
          <div style={styles.content}>
            <p>Please click on the link to start the backend server</p>

            <a
              href="https://my-app-backend-0b3n.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.linkButton}
            >
              Start Backend Server
            </a>
          </div>
        </div>
      </Popup>
    </div>
  );
}

// Basic inline styling to get you started
const styles = {
  modal: {
    fontSize: "16px",
    padding: "20px",
    textAlign: "center",
    background: "#111111",
  },
  close: {
    cursor: "pointer",
    position: "absolute",
    display: "block",
    padding: "2px 5px",
    lineHeight: "20px",
    right: "-10px",
    top: "-10px",
    fontSize: "24px",
    background: "#111111",
    borderRadius: "11p",
  },
  content: {
    width: "100%",
    padding: "10px 5px",
  },
  linkButton: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 20px",
    backgroundColor: "#111855",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
    fontWeight: "bold",
  },
};

export default HomePopup;
