import React from "react";
import { useLocation } from "react-router-dom";

function Result() {
  const { state } = useLocation();
  const result = state ? state.result : null; // Retrieve the result from location state

  return (
    <div>
      {result !== null ? (
        <p>{result ? "Success!" : "Failed!"}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Result;
