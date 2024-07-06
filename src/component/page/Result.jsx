import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Result() {
  const { state } = useLocation();
  const navigator = useNavigate();
  const result = state ? state.result : null; // 위치 상태에서 결과를 가져옵니다.
  const handleReturn = async (event) => {
    event.preventDefault();
    navigator("/");
  };
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {result !== null ? (
        <p style={{ color: result ? "green" : "red" }}>
          {result ? "이 여권은 유효한 여권입니다." : "실패했습니다."}
        </p>
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={handleReturn}>다시 하기</button>
    </div>
  );
}

export default Result;
