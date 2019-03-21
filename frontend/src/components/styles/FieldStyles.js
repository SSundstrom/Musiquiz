import styled from '@emotion/styled';

const FieldStyles = styled.div`
  margin-bottom: 20px;
  .error {
    border: 1px solid ${({ theme }) => theme.red};

    background: ${({ theme }) => theme.lightRed};
    color: ${({ theme }) => theme.red};
  }
  .error::placeholder {
    color: ${({ theme }) => theme.red};
  }
  .errors {
    background: ${({ theme }) => theme.lightRed};
    display: inline-block;
    font-size: 0.7em;
    margin-top: 0.5em;
    padding: 0.5em;
    border-radius: 7px;
    border: 1px solid ${({ theme }) => theme.red};
    color: ${({ theme }) => theme.red};
  }

  @keyframes shake {
    20%,
    60% {
      transform: translate(-10px, 0);
    }
    40%,
    80% {
      transform: translate(10px, 0);
    }
  }
  .shake {
    animation-name: shake;
    animation-duration: 0.5s;
  }
`;
export default FieldStyles;
