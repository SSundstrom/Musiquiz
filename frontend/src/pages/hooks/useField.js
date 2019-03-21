import { useState, useEffect } from 'react';

const useField = (name, { defaultValue = '', validations = [] }) => {
  const [value, setValue] = useState(defaultValue);
  const [errors, setErrors] = useState([]);
  const [pristine, setPristine] = useState(true);
  const validate = () => {
    let errorMessages = validations.map(validation => validation(value));
    errorMessages = errorMessages.filter(errorMsg => !!errorMsg);
    setErrors(errorMessages);
    const fieldValid = errorMessages.length === 0;
    return fieldValid;
  };
  useEffect(() => {
    validate(); // Avoid validate on mount
  }, [value]);

  const field = {
    name,
    value,
    setValue,
    errors,
    setErrors,
    pristine,
    validate,
    onChange: e => {
      if (pristine) {
        setPristine(false);
      }
      setValue(e.target.value);
    },
    onPaste: e => {
      if (pristine) {
        setPristine(false);
      }
      setValue(e.target.value);
    },
  };

  return field;
};

export default useField;
