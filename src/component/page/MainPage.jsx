import React, { useState } from "react";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import styled from "styled-components";

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

// Define the form fields
const formFields = [
  { label: "성명", state: "name" },
  { label: "주민등록번호 앞자리", state: "jumin1" },
  { label: "주민등록번호 뒷자리", state: "jumin2" },
  { label: "전화번호", state: "phone" },
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
  const initialState = Object.fromEntries(
    formFields.map((field) => [field.state, ""])
  );
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (event, stateKey) => {
    const { value } = event.target;
    setFormData({ ...formData, [stateKey]: value });
  };

  return (
    <form onSubmit={"/"}>
      {formFields.map(({ label, state, hasImage, imageUrl }) => (
        <div key={state}>
          <MainTitleText>{label}</MainTitleText>
          {hasImage ? (
            <ImgWrapper>
              <ConfirmationImg src={imageUrl} alt="Confirmation" />
              <TextInput
                height={20}
                value={formData[state]}
                onChange={(event) => handleInputChange(event, state)}
              />
            </ImgWrapper>
          ) : (
            <TextInput
              height={20}
              value={formData[state]}
              onChange={(event) => handleInputChange(event, state)}
            />
          )}
        </div>
      ))}
      <Button type="submit">제출</Button>
    </form>
  );
};

export default Submit;
