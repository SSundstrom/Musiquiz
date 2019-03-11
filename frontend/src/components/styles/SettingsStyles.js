import styled from '@emotion/styled';

const SettingsStyles = styled.div`
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
  .cog {
    justify-self: right;
  }
`;

export default SettingsStyles;
