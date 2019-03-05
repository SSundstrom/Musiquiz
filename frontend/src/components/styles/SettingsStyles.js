import styled from '@emotion/styled';

const SettingsStyles = styled.div`
  grid-area: settings;
  .settings {
    padding: 0 5rem;
  }
  .setting {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
  .settings-header {
    display: flex;
    justify-content: space-between;
  }
`;

export default SettingsStyles;
