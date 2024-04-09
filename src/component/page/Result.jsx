import React, { useState, useEffect } from "react";

function MyComponent() {
  const [liExists, setLiExists] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered");
    async function fetchData() {
      try {
        const response = await fetch("/result");
        const data = await response.json();
        console.log("Server Response:", data); // Log the server response
        setLiExists(data.liTextContent); // Set the value of liExists received from the server
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [liExists]); // Run only once on component mount

  return (
    <div>
      {liExists !== null && (
        <p>
          {liExists ? "The li element exists" : "The li element does not exist"}
        </p>
      )}
    </div>
  );
}

export default MyComponent;
