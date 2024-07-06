import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import TextInput from "../ui/TextInput";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const MainTitleText = styled.p`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
`;

const ImgWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const ConfirmationImg = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 10px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: bold;
`;

const FormField = styled.div`
  margin-bottom: 20px;
`;

const SubmitButton = styled(Button)`
  margin-top: 20px;
`;

const formFields = [
  { label: "성명", state: "name" },
  { label: "생일 8자리", state: "jumin1" },
  { label: "주민등록번호 뒷자리", state: "jumin2" },
  { label: "전화번호(010 제외)", state: "phone" },
  { label: "여권번호", state: "passportNum" },
  { label: "발급일", state: "issueDate" },
  { label: "만료일", state: "expireDate" },
  { label: "확인번호", state: "confirmNum", hasImage: true },
];

function Submit() {
  const [formData, setFormData] = useState({});
  const [captchaImage, setCaptchaImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const connect = async () => {
      try {
        const res = await axios.post("http://localhost:8080/connect");
        if (res.data && res.data.captchaImage) {
          const base64Image = res.data.captchaImage;
          const imageUrl = `data:image/png;base64,${base64Image}`;
          setCaptchaImage(imageUrl); // 이미지 데이터를 state에 설정
        } else {
          console.error("Captcha image data is missing in the response");
        }
      } catch (error) {
        console.error("Error fetching captcha image:", error);
      }
    };
    connect();
  }, []);

  const handleInputChange = (event, stateKey) => {
    const { value } = event.target;
    setFormData({ ...formData, [stateKey]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Form validation
      const requiredFields = formFields.map((field) => field.state);
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

      // Submit form data
      const response = await axios.post(
        "http://localhost:8080/processInput",
        formData
      );

      if (response.data && response.data.alertMessage) {
        alert(response.data.alertMessage);
      } else {
        navigate("/auth");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Container>
      <MainTitleText>여권정보 입력</MainTitleText>
      <form onSubmit={handleSubmit}>
        {formFields.map(({ label, state, hasImage }) => (
          <FormField key={state}>
            <Label>{label}</Label>
            {hasImage ? (
              <ImgWrapper>
                <ConfirmationImg src={captchaImage} alt="Confirmation" />
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
          </FormField>
        ))}
        <SubmitButton type="submit" title="제출" />
      </form>
    </Container>
  );
}

export default Submit;
