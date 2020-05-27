import styled from 'styled-components';

const QueueStyles = styled.div`
  .queue-heading {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .queue-label {
    justify-content: left;
    flex-grow: 1;
  }
  .queue-name {
    display: flex;
    justify-self: right;
    justify-content: space-between;
  }
`;
export default QueueStyles;
