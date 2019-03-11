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
    flex-grow: 1;
  }
  .score-score {
    display: flex;
    justify-self: right;
    justify-content: space-between;
  }
  .score-score-score {
    justify-self: left;
  }

  .score-score-addition {
    justify-self: right;
  }
`;

export default ScoreStyles;
