import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of useHistory
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import styled from "styled-components";
import axios from "axios";

const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ImgWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ConfirmationImg = styled.img`
  width: 400px;
  height: 100px;
  margin-right: 10px;
`;

const formFields = [
  { label: "성명", state: "name" },
  { label: "생일 8자리", state: "jumin1" },
  { label: "주민등록번호 뒷자리", state: "jumin2" },
  { label: "전화번호(010 제외)", state: "phone" },
  { label: "여권번호", state: "passportNum" },
  { label: "발급일", state: "issueDate" },
  { label: "만료일", state: "expireDate" },
  {
    label: "확인번호",
    state: "confirmNum",
    hasImage: true,
    imageUrl: "/captcha.png",
  },
];

const Submit = (props) => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate(); // Use useNavigate for programmatic navigation

  const handleInputChange = (event, stateKey) => {
    const { value } = event.target;
    setFormData({ ...formData, [stateKey]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let requiredFields = formFields.map(function (element) {
      return element.state;
    });

    for (const field of requiredFields) {
      if (!formData[field]) {
        const label = formFields.find((item) => item.state === field).label;
        alert(`${label}을(를) 입력해주세요.`);
        return;
      }
    }

    if (formData.jumin1.length !== 8) {
      alert("생일은 8자리의 숫자여야 합니다.");
      return;
    }

    if (formData.phone.length !== 8) {
      alert("전화번호는 8자리여야 합니다.");
      return;
    }

    const dateRegex = /^\d{4}\d{2}\d{2}$/;
    if (
      !dateRegex.test(formData.issueDate) ||
      !dateRegex.test(formData.expireDate)
    ) {
      alert("날짜 형식이 올바르지 않습니다. (YYYYMMDD 형식)");
      return;
    }


    try {
      navigate("/auth");
      const response = await axios.post(
        "http://localhost:8080/processInput",
        formData
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {formFields.map(({ label, state, hasImage, imageUrl }) => (
        <div key={state}>
          <MainTitleText>{label}</MainTitleText>
          {hasImage ? (
            <ImgWrapper>
              <ConfirmationImg src={imageUrl} alt="Confirmation" />
              <TextInput
                height={20}
                value={formData[state] || ""}
                onChange={(event) => handleInputChange(event, state)}
              />
            </ImgWrapper>
          ) : (
            <TextInput
              height={20}
              value={formData[state] || ""}
              onChange={(event) => handleInputChange(event, state)}
            />
          )}
        </div>
      ))}
      <Button type="submit" title="제출"></Button>
    </form>
  );
};

export default Submit;
