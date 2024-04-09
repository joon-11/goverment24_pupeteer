import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // react-router-dom에서 navigate import

function Auth(props) {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      navigate("/result");
      const response = await axios.post("http://localhost:8080/result");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    }
  };

  return <button onClick={() => handleSubmit()}>확인</button>;
}

export default Auth;
