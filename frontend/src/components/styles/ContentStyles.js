import styled from '@emotion/styled';

const ContentStyles = styled.div`
  display: grid;
  grid-template-areas: '. game settings';
  grid-template-columns: 1fr minmax(min-content, 500px) 1fr;
  margin-top: 5rem;
  margin: 1rem;
  grid-gap: 1rem;
  justify-content: center;

  @media (max-width: 980px) {
    grid-template-areas: 'game' 'settings';
    grid-template-areas: 'game' 'settings';
    grid-template-columns: minmax(min-content, 500px);
  }
`;

export default ContentStyles;
