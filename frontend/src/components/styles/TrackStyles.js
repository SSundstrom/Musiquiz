import styled from '@emotion/styled';

const TrackStyles = styled.div`
  border: none;
  border-bottom: 1px #fff solid;
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  width: 100%;
  background: none;
  align-items: center;
  padding-bottom: 15px;
  padding-top: 15px;
  transition: 0.3s all ease;

  .trackinfo {
    padding: 10px;
    text-align: left;
    word-break: break-all;
  }

  .trackitem:active,
  .trackitem:focus {
    transform: scale(0.95);
  }

  .trackname {
    font-size: 18px;
  }

  .trackartists {
    font-size: 14px;
    opacity: 0.5;
  }
`;

export default TrackStyles;
