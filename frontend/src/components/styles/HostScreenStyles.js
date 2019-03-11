import styled from '@emotion/styled';

const HostScreenStyles = styled.div`
  display: grid;
  grid-template-areas: 'qr game settings';
  grid-template-columns: 1fr 1fr 1fr;
  margin: 1rem;
  grid-gap: 1rem;
  justify-content: center;

  @media (max-width: 980px) {
    grid-template-areas: 'game' 'settings' 'qr';
    grid-template-areas: 'game' 'settings' 'qr';
    grid-template-columns: 1fr;
  }
  .qr {
    grid-area: qr;
  }

  .game {
    grid-area: game;
  }
  .settings {
    grid-area: settings;
  }
`;

export default HostScreenStyles;
