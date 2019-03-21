import styled from '@emotion/styled';

const BackgroundStyles = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  background-color: ${({ isLeader, guessed, correct, theme }) => {
    if (isLeader) {
      return theme.purple;
    }
    if (guessed) {
      if (correct) {
        return theme.green;
      }
      return theme.red;
    }
    return theme.blue;
  }};
  height: auto;
  min-height: 100vh;
  @keyframes bgcolor {
    0% {
      background-color: ${({ theme }) => theme.blue};
    }
    17% {
      background-color: ${({ theme }) => theme.teal};
    }
    34% {
      background-color: ${({ theme }) => theme.green};
    }
    51% {
      background-color: ${({ theme }) => theme.yellow};
    }
    67% {
      background-color: ${({ theme }) => theme.orange};
    }
    84% {
      background-color: ${({ theme }) => theme.red};
    }
    100% {
      background-color: ${({ theme }) => theme.purple};
    }
  }
  ${({ isHost, started }) => {
    if (isHost || !started) {
      return `animation: bgcolor 20s infinite;
              animation-direction: alternate;`;
    }
    return '';
  }}
`;

export default BackgroundStyles;
