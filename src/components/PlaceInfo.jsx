import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import styled, { css } from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CustomModal from './CustomModal';
import Address from './Address';

const InfoBox = styled.div`
  position: relative;
  width: 350px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin: 12px;
  padding: 8px 8px 20px 8px;
  .title {
    font-size: 20px;
    font-weight: 500;
  }
  .info-box {
    display: flex;
    flex-direction: column;
  }
  label {
    font-weight: 700;
    font-size: 16px;
    margin: 8px 0;
  }
  .error {
    margin: 5px 0 0 0;
    display: inline-block;
    color: red;
    font-size: 14px;
  }
`;

const sharedStyles = css`
  width: 100%;
  height: 38px;
  box-sizing: border-box;
  border: 1px solid #ced4da;
  border-radius: 3px;
  outline-color: rgb(222, 226, 230);
  outline-width: 3px;
`;

const InputBox = styled.input`
  ${sharedStyles}
`;

const InputBoxGroup = styled.div``;

const DeleteButton = styled.button`
  color: red;
  font-size: 20px;
  background-color: transparent;
  border: none;
  position: absolute;
  top: 12px;
  right: 12px;
  cursor: pointer;
`;

const DateRagePicker = styled(DatePicker)`
  ${sharedStyles}
  width: 350px;
  font-size: 16px;
  padding-left: 10px;
`;

const PlaceInfo = forwardRef(({ onValidation, id, onDelete }, ref) => {
  const [startDate, setStartDate] = useState(null);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isClickSubmit, setIsClickSubmit] = useState(false);
  const [dateError, setDateError] = useState('');
  const [placeError, setPlaceError] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleNameChange = (value) => {
    setName(value);
  };

  useEffect(() => {
    if (isClickSubmit) {
      handleNameError();
      handleDateError();
    }
  }, [name, startDate]);

  const handleNameError = () => {
    if (!name) {
      setNameError('값을 입력해주세요.');
    } else {
      const nameRegex = /^[ㄱ-ㅎ|가-힣|a-z|A-Z\s]+$/;
      const isValidName = nameRegex.test(name);

      if (!isValidName) {
        setNameError('한글, 영어, 공백만 입력 가능합니다');
      } else {
        setNameError('');
      }
    }
  };

  const handleDateError = () => {
    console.log('dd', !startDate);
    if (!startDate) {
      setDateError('값을 입력해 주세요');
    }
  };

  const validate = () => {
    setIsClickSubmit(true);
    handleNameError();
    handleDateError();

    if (!workplace) {
      setPlaceError('값을 입력해 주세요');
    }

    const isValid = true; // 예시로 true를 반환했다고 가정

    if (onValidation) {
      onValidation(isValid);
    }

    return isValid;
  };

  useImperativeHandle(ref, () => ({
    validate,
  }));

  return (
    <InfoBox>
      {id !== 1 && (
        <DeleteButton
          onClick={() => {
            onDelete();
          }}
        >
          x
        </DeleteButton>
      )}
      <h2 className="title">상차지 정보</h2>
      <div className="info-box">
        <label>담당자</label>
        <InputBox
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        ></InputBox>
        {nameError && <p className="error">{nameError}</p>}
      </div>
      <div className="info-box">
        <label>날짜</label>
        <InputBoxGroup>
          <div className="form-input date">
            <DateRagePicker
              dateFormat="yyyy-MM-dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </div>
          {dateError && <p className="error">{dateError}</p>}
        </InputBoxGroup>
      </div>
      <div className="info-box">
        <label>상차지</label>
        <InputBox
          value={workplace}
          onChange={(e) => setWorkplace(e.target.value)}
          onClick={() => setModalIsOpen(true)}
        />
        <CustomModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
          <Address
            onAddressChange={(fullAddress) => {
              setWorkplace(fullAddress);
              setModalIsOpen(false);
            }}
          />
        </CustomModal>
        {placeError && <p className="error">{placeError}</p>}
      </div>
    </InfoBox>
  );
});

export default PlaceInfo;
