import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading to true when submitting form
    try {
      console.log("asd");
      const response = await axios.post("http://localhost:8080/result");
      console.log(response.data);
      navigate("/result", { state: { result: response.data } }); // Navigate to "/result" with the result as state
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    } finally {
      setIsLoading(false); // Set loading to false after form submission (whether successful or not)
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ marginBottom: "20px" }}>
        카카오톡 본인확인 후 본인확인이 완료되었으면 확인 버튼을 누르세요
      </p>
      {isLoading ? ( // If loading, display loading spinner
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s",
          }}
          onClick={() => handleSubmit()}
        >
          확인
        </button>
      )}
    </div>
  );
}

export default Auth;
