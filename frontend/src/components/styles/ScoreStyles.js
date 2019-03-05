import styled from '@emotion/styled';

const ScoreStyles = styled.div`
  margin-top: 15px;

  .score-row {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .score-name {
    font-size: 17px;
    justify-content: left;
    padding: 0 20px;
    flex-grow: 1;
  }

  .score-score {
    display: flex;
    min-width: 60px;
    justify-content: right;
  }

  .score-addition {
    width: 55px;
  }
`;

export default ScoreStyles;
