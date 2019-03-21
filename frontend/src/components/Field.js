import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import FieldStyles from './styles/FieldStyles';

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 9fr 1fr;
`;
const Field = ({ label, name, value, onChange, errors, formSubmitted, setErrors, pristine, validate, setValue, button, ...other }) => {
  const hasErrors = (!pristine || formSubmitted) && !!errors.length;
  const [shake, setShake] = useState(false);
  useEffect(() => {
    console.log(errors);
    if (hasErrors) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);
    }
  }, [errors]);
  return (
    <FieldStyles>
      <label htmlFor={name}>
        {label}
        <ButtonContainer>
          <input className={`${hasErrors ? 'error' : ''} ${shake ? 'shake' : ''}`} value={value} onChange={event => onChange(event)} {...other} />
          {button}
        </ButtonContainer>
      </label>
      {hasErrors && (
        <div className={`errors ${shake ? 'shake' : ''}`}>
          {errors.map((errorMsg, index) => (
            <span key={errorMsg}>{`${errorMsg}${index !== errors.length - 1 ? ', ' : ''}`}</span>
          ))}
        </div>
      )}
    </FieldStyles>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  formSubmitted: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  validate: PropTypes.func,
  setValue: PropTypes.func,
  setErrors: PropTypes.func,
  errors: PropTypes.array,
  button: PropTypes.any,
};

Field.defaultProps = {
  errors: [],
  validate: null,
  setValue: null,
  setErrors: null,
  button: null,
};

export default Field;
