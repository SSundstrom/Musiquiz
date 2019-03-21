import styled from '@emotion/styled';

const JoinStyles = styled.div`
  padding: 2rem;
  text-align: center;
  margin: auto;
  form {
    display: grid;
    grid-template-columns: 100px auto 100px;
    .input {
      grid-column: 2;
    }
    .lucky {
      grid-column: span 1 / -1;
    }
  }
`;

export default JoinStyles;
